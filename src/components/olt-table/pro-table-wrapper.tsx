import { useFlexTableHeight } from "@/hooks/use-flex-table-height";
import { type ColumnsState, type ParamsType, type ProColumns, ProTable } from "@ant-design/pro-components";
import { debounce } from "lodash-es";
// import { Pagination } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColumnSetting from "./column-setting";
import ResizableHeader from "./components/ResizableHeader";
import type { ColumnStateType, OltTableProps } from "./types";

const OltTable = <T extends Record<string, any> = any, Params extends ParamsType = Record<string, any>>({
	autoHeight = false,
	stripe = false,
	rowClickable = false,
	defaultLockedColumns = [],
	enableColumnStorage = false,
	columnStorageKey,
	params,
	...tableProps
}: OltTableProps<T, Params>) => {
	const { containerRef: flexContainerRef } = useFlexTableHeight();
	const staticRef = useRef<HTMLDivElement>(null);

	// 根据 autoHeight 决定使用哪个 ref 和 scroll
	const containerRef = autoHeight ? flexContainerRef : staticRef;

	const scrollConfig = autoHeight ? undefined : { x: "max-content", ...tableProps.scroll };

	// 生成默认存储键名
	const defaultStorageKey = columnStorageKey || `olt-table-${window.location.pathname}`;

	// 合并工具栏按钮
	const mergedOptionsRender = (options: any, defaultDom: React.ReactNode[]) => {
		const setColumnsStates = (columns: ProColumns[]) => {
			const value: Record<string, ColumnsState> = {};
			for (const column of columns) {
				value[column.dataIndex] = {
					order: column.index,
					fixed: column.fixed as "left" | "right" | undefined,
					show: column.hideInTable,
				};
			}
			setColumnsState((prev) => ({
				...prev,
				value,
			}));
		};

		// 自定义的列设置按钮
		const columnSettingButton = (
			<ColumnSetting
				key="column-setting"
				columns={tableProps.columns || []}
				onColumnsChange={setColumnsStates}
				defaultLockedColumns={defaultLockedColumns}
				enableStorage={enableColumnStorage}
				storageKey={defaultStorageKey}
			/>
		);

		// hack 移除默认的列设置按钮
		const customDom = [...defaultDom.filter((item: any) => item.key !== "setting"), columnSettingButton];

		// props 中的 optionsRender 的设置
		const propsDom = tableProps.optionsRender ? tableProps.optionsRender(options, customDom) : customDom;

		return propsDom;
	};

	// 列设置相关状态
	const [columns, setColumns] = useState<ProColumns[]>(tableProps.columns || []);
	const [columnsState, setColumnsState] = useState<ColumnStateType>({
		...(tableProps.columnsState || {}),
	});

	// 防抖更新列宽，避免频繁更新状态
	const debouncedUpdateColumnWidth = useMemo(
		() =>
			debounce((columnIndex: number, newWidth: number) => {
				setColumns((prevColumns) => {
					const newColumns = [...prevColumns];
					newColumns[columnIndex] = {
						...newColumns[columnIndex],
						width: newWidth,
					};
					return newColumns;
				});
			}, 100),
		[],
	);

	const rowClassName = useCallback(() => {
		return `${stripe ? "olt-table-stripe" : ""} ${rowClickable ? "olt-table-row-clickable" : ""} ${
			tableProps.rowClassName || ""
		}`;
	}, [stripe, rowClickable, tableProps.rowClassName]);

	const handleResize = useCallback(
		(columnIndex: number) => (newWidth: number) => {
			debouncedUpdateColumnWidth(columnIndex, newWidth);
		},
		[debouncedUpdateColumnWidth],
	);

	const mergedColumns = useMemo(() => {
		return columns.map((col, index) => ({
			...col,
			onHeaderCell: (column: any) => ({
				width: column.width,
				columnIndex: index,
				onColumnResize: handleResize(index),
			}),
		}));
	}, [columns, handleResize]);

	// 当外部 columns 改变时同步内部状态
	useEffect(() => {
		setColumns(tableProps.columns || []);
	}, [tableProps.columns]);

	useEffect(() => {
		if (tableProps?.formRef?.current && params?.[1]) {
			tableProps.formRef.current.setFieldsValue(params[1]);
		}
	}, [params, tableProps?.formRef]);

	// 组件卸载时清理防抖函数
	useEffect(() => {
		return () => {
			debouncedUpdateColumnWidth.cancel();
		};
	}, [debouncedUpdateColumnWidth]);

	return (
		<div ref={containerRef} className="page-container">
			<ProTable<T, Params>
				{...tableProps}
				components={{
					header: {
						cell: ResizableHeader,
					},
				}}
				columnsState={columnsState}
				columns={mergedColumns}
				className={`${tableProps.className || ""} olt-table`}
				scroll={scrollConfig || tableProps.scroll}
				optionsRender={mergedOptionsRender}
				rowClassName={rowClassName}
				// pagination={false}
			/>

			{/* <Pagination className="!absolute !bottom-0 !right-[24px]" {...tableProps.pagination} /> */}
		</div>
	);
};

export default OltTable;
export type { OltTableProps };
