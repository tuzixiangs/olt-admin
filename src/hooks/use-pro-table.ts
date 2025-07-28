import type { ProFormInstance } from "@ant-design/pro-components";
import { type UseQueryOptions, keepPreviousData, useQuery } from "@tanstack/react-query";
import type { TablePaginationConfig, TableProps } from "antd";
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParamsCache } from "../store/cacheStore";

// 定义服务函数的类型
type ServiceFunction<TData = any, TParams = any> = (
	paginationParams: {
		current?: number;
		pageSize?: number;
		filters?: any;
		sorter?: any;
		extra?: any;
	},
	searchParams?: TParams,
) => Promise<{ list: TData[]; total: number }>;

// 定义查询返回数据类型
interface QueryResult<TData = any> {
	list: TData[];
	total: number;
}

// 分页参数类型
interface PaginationParams {
	current?: number;
	pageSize?: number;
	filters?: any;
	sorter?: any;
	extra?: any;
}

// PaginationOptions 类型
interface PaginationOptions
	extends Omit<
		TablePaginationConfig,
		"onChange" | "onShowSizeChange" | "total" | "current" | "pageSize" | "defaultCurrent" | "defaultPageSize"
	> {}

// Hook 选项类型
interface UseProTableOptions<TParams = any> {
	/** 默认每页条数，默认 10 */
	defaultPageSize?: number;
	/** 默认查询参数，默认 { current: 1, pageSize: 10 } */
	defaultParams?: [PaginationParams, TParams?];
	/** 默认分页配置，默认 {} */
	defaultPaginationOptions?: PaginationOptions;
	/** 是否使用缓存，默认 false */
	useCache?: boolean;
	/** 是否手动查询，默认 false */
	manual?: boolean;
	/** 支持完整的 useQuery 配置 */
	queryOptions?: Omit<UseQueryOptions<QueryResult, Error>, "queryKey" | "queryFn">;
	/** 查询 key，用于useQuery缓存 */
	queryKey: any[];
	/** 查询成功回调 */
	onSuccess?: (data: QueryResult) => void;
	/** 查询失败回调 */
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
	run: (newParams?: [PaginationParams, TParams?]) => void; // 手动查询方法
	params: [PaginationParams, TParams?];
	isPlaceholderData: boolean; // 是否为占位数据
	isFetching: boolean; // 是否正在获取数据（包括后台刷新）
	isLoading: boolean; // 是否为初始加载状态
}

export function useProTable<TData = any, TParams = any>(
	service: (...args: any[]) => Promise<any>,
	options: UseProTableOptions<TParams> = {
		queryKey: [],
	},
): UseProTableResult<TData, TParams> {
	const {
		defaultPageSize = 10,
		defaultParams,
		defaultPaginationOptions,
		manual = false, // 默认自动查询
		useCache = false, // 默认不使用缓存
		queryKey = [],
		onSuccess,
		onError,
		queryOptions,
	} = options;

	// 使用 params 缓存
	const { getCachedParams, setCachedParams } = useParamsCache<TParams>();

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

	// 分页和搜索参数状态，优先使用缓存
	const [params, setParams] = useState<[PaginationParams, TParams?]>(() => {
		// 如果使用缓存，首先尝试从缓存中获取参数
		if (useCache) {
			const cachedParams = getCachedParams();
			if (cachedParams) {
				return cachedParams;
			}
		}

		// 如果没有缓存，使用默认参数
		if (defaultParams) {
			return [Object.assign({ current: 1, pageSize: defaultPageSize }, defaultParams[0]), defaultParams[1]];
		}
		return [
			{
				current: 1,
				pageSize: defaultPageSize,
			},
			undefined,
		];
	});

	// 当 params 变化时，更新缓存
	useEffect(() => {
		if (useCache) {
			setCachedParams(params);
		}
	}, [params, setCachedParams, useCache]);

	const { data, isLoading, isFetching, refetch, error, isPlaceholderData } = useQuery<QueryResult<TData>, Error>({
		...queryOptions, // 传递用户的所有 useQuery 配置
		queryKey: [...queryKey, params[0], params[1]],
		queryFn: () => antdService(params[0], params[1]),
		enabled: !manual,
		placeholderData: keepPreviousData, // 保持之前的数据，避免分页时数据清空
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

	// 手动查询方法
	const run = useCallback(
		(newParams?: [PaginationParams, TParams?]) => {
			if (newParams) {
				setParams(newParams);
			}
			// 手动触发查询
			refetch();
		},
		[refetch],
	);

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
	const handleSearch = useCallback(
		(values?: TParams) => {
			const newParams: [PaginationParams, TParams?] = [
				{
					current: 1, // 搜索时重置到第一页
					pageSize: params[0].pageSize,
				},
				values,
			];
			setParams(newParams);

			// 如果是手动模式，需要手动触发查询
			if (manual) {
				refetch();
			}
		},
		[manual, refetch, params],
	);

	// 重置搜索
	const handleReset = useCallback(() => {
		const newParams: [PaginationParams, TParams?] = [
			{
				current: 1,
				pageSize: defaultPageSize,
			},
			undefined,
		];
		setParams(newParams);

		// 如果是手动模式，需要手动触发查询
		if (manual) {
			refetch();
		}
	}, [defaultPageSize, manual, refetch]);

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
			loading: isFetching,
			formRef,
			onSubmit,
			onReset,
			params,
			pagination: {
				current: params[0].current || 1,
				pageSize: params[0].pageSize || defaultPageSize,
				total: data?.total || 0,
				onChange: handlePaginationChange,
				onShowSizeChange: handleShowSizeChange,
				showSizeChanger: true,
				showQuickJumper: true,
				...defaultPaginationOptions,
			},
			onChange: handleTableChange,
		}),
		[
			data,
			isFetching,
			params,
			handlePaginationChange,
			handleShowSizeChange,
			handleTableChange,
			onSubmit,
			onReset,
			defaultPaginationOptions,
			defaultPageSize,
		],
	);

	return {
		tableProps,
		search: {
			submit: handleSearch,
			reset: handleReset,
		},
		refresh: handleRefresh,
		run,
		params,
		isPlaceholderData,
		isFetching,
		isLoading,
	};
}
