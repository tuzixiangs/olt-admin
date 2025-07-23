import type { ProFormInstance } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import type { TablePaginationConfig, TableProps } from "antd";
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// 定义服务函数的类型
type ServiceFunction<TData = any, TParams = any> = (
	paginationParams: {
		current: number;
		pageSize: number;
		filters?: any;
		sorter?: any;
		extra?: any;
	},
	searchParams?: TParams,
) => Promise<{ list: TData[]; total: number }>;

// 分页参数类型
interface PaginationParams {
	current: number;
	pageSize: number;
	filters?: any;
	sorter?: any;
	extra?: any;
}

// Hook 选项类型
interface UseProTableOptions<TParams = any> {
	defaultPageSize?: number;
	defaultParams?: [PaginationParams, TParams?];
	queryKey: any[];
	onSuccess?: (data: { list: any[]; total: number }) => void;
	onError?: (error: any) => void;
}

// Hook 返回值类型
interface UseProTableResult<TData = any, TParams = any> {
	tableProps: {
		dataSource: TData[];
		loading: boolean;
		pagination: {
			current: number;
			pageSize: number;
			total: number;
			onChange: (page: number, pageSize?: number) => void;
			onShowSizeChange: (current: number, size: number) => void;
		};
		onChange: TableProps<TData>["onChange"];
	};
	search: {
		submit: (values?: any) => void;
		reset: () => void;
	};
	refresh: () => void;
	params: [PaginationParams, TParams?];
}

export function useProTable<TData = any, TParams = any>(
	service: (...args: any[]) => Promise<any>,
	options: UseProTableOptions<TParams> = {
		queryKey: [],
	},
): UseProTableResult<TData, TParams> {
	const { defaultPageSize = 10, defaultParams, queryKey = [], onSuccess, onError } = options;
	const antdService: ServiceFunction<TData, TParams> = async (...args) => {
		const [{ current, pageSize }, formData = {}] = args;

		const params = {
			current,
			pageSize,
			...formData,
		};

		const response = await service(params);

		// 转换为 useAntdTable 期望的格式
		return {
			list: response.content,
			total: response.total,
		};
	};
	// 分页和搜索参数状态
	const [params, setParams] = useState<[PaginationParams, TParams?]>(() => {
		if (defaultParams) {
			return defaultParams;
		}
		return [
			{
				current: 1,
				pageSize: defaultPageSize,
			},
			undefined,
		];
	});

	// 使用 useQuery 获取数据
	const { data, isLoading, refetch, error } = useQuery({
		queryKey: [...queryKey, params[0], params[1]],
		queryFn: () => antdService(params[0], params[1]),
		enabled: true,
	});

	// 使用 useEffect 来处理成功和错误回调
	useEffect(() => {
		if (data && onSuccess) {
			onSuccess(data);
		}
	}, [data, onSuccess]);

	useEffect(() => {
		if (error && onError) {
			onError(error);
		}
	}, [error, onError]);

	// 处理分页变化
	const handlePaginationChange = useCallback((page: number, pageSize?: number) => {
		setParams(([paginationParams, searchParams]) => [
			{
				...paginationParams,
				current: page,
				pageSize: pageSize || paginationParams.pageSize,
			},
			searchParams,
		]);
	}, []);

	// 处理页面大小变化
	const handleShowSizeChange = useCallback((_current: number, size: number) => {
		setParams(([paginationParams, searchParams]) => [
			{
				...paginationParams,
				current: 1, // 改变页面大小时重置到第一页
				pageSize: size,
			},
			searchParams,
		]);
	}, []);

	// 处理表格变化（排序、过滤等）
	const handleTableChange: TableProps<TData>["onChange"] = useCallback(
		(
			pagination: TablePaginationConfig,
			filters: Record<string, FilterValue | null>,
			sorter: SorterResult<TData> | SorterResult<TData>[],
			extra: TableCurrentDataSource<TData>,
		) => {
			setParams(([paginationParams, searchParams]) => [
				{
					...paginationParams,
					current: pagination.current || 1,
					pageSize: pagination.pageSize || defaultPageSize,
					filters,
					sorter,
					extra,
				},
				searchParams,
			]);
		},
		[defaultPageSize],
	);

	// 设置 formRef表单
	const formRef = useRef<ProFormInstance>(undefined);

	// 搜索提交
	const handleSearch = useCallback((values?: TParams) => {
		setParams(([paginationParams]) => [
			{
				...paginationParams,
				current: 1, // 搜索时重置到第一页
			},
			values,
		]);
	}, []);

	// 重置搜索
	const handleReset = useCallback(() => {
		setParams([
			{
				current: 1,
				pageSize: defaultPageSize,
			},
			undefined,
		]);
	}, [defaultPageSize]);

	// tableProps里面的搜索和提交
	const onSubmit = useCallback(
		(values: TParams) => {
			handleSearch(values);
		},
		[handleSearch],
	);

	const onReset = useCallback(() => {
		handleReset();
	}, [handleReset]);

	// 刷新数据
	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	// 构建表格属性
	const tableProps = useMemo(
		() => ({
			dataSource: data?.list || [],
			loading: isLoading,
			formRef,
			onSubmit,
			onReset,
			pagination: {
				current: params[0].current,
				pageSize: params[0].pageSize,
				total: data?.total || 0,
				onChange: handlePaginationChange,
				onShowSizeChange: handleShowSizeChange,
				showSizeChanger: true,
				showQuickJumper: true,
			},
			onChange: handleTableChange,
		}),
		[data, isLoading, params, handlePaginationChange, handleShowSizeChange, handleTableChange, onSubmit, onReset],
	);

	return {
		tableProps,
		search: {
			submit: handleSearch,
			reset: handleReset,
		},
		refresh: handleRefresh,
		params,
	};
}
