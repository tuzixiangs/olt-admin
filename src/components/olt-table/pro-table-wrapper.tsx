import { useTableScroll } from "@/hooks/use-table-scroll";
import {
	type ActionType,
	type ParamsType,
	type ProColumns,
	ProTable,
	type ProTableProps,
} from "@ant-design/pro-components";
// import { useSize } from "ahooks";
import { useRef, useState } from "react";
import ColumnSetting from "./column-setting";

interface OltTableProps<T = any, Params = Record<string, any>> extends ProTableProps<T, Params> {
	/**
	 * 是否启用自动高度
	 * @default false
	 */
	autoHeight?: boolean;
	/**
	 * 是否启用斑马线
	 * @default false
	 */
	stripe?: boolean;
	/**
	 * 是否启用行点击样式
	 * @default false
	 */
	rowClickable?: boolean;
	/**
	 * 是否启用列设置
	 * @default true
	 */
	enableColumnSetting?: boolean;
	/**
	 * 默认锁定的列key
	 */
	defaultLockedColumns?: string[];
	/**
	 * 是否启用列配置持久化存储
	 * @default false
	 */
	enableColumnStorage?: boolean;
	/**
	 * 列配置存储键名
	 */
	columnStorageKey?: string;
}

const OltTable = <T extends Record<string, any> = any, Params extends ParamsType = Record<string, any>>({
	autoHeight = false,
	stripe = false,
	rowClickable = false,
	enableColumnSetting = true,
	defaultLockedColumns = [],
	enableColumnStorage = false,
	columnStorageKey,
	...tableProps
}: OltTableProps<T, Params>) => {
	const { scroll, tableContainerRef } = useTableScroll();
	// const tableContainerRef = useRef<HTMLDivElement>(null);
	const staticRef = useRef<HTMLDivElement>(null);

	// 根据 autoHeight 决定使用哪个 ref 和 scroll
	const containerRef = autoHeight ? tableContainerRef : staticRef;
	const scrollConfig = autoHeight ? scroll : undefined;

	// 生成默认存储键名
	const defaultStorageKey = columnStorageKey || `olt-table-${window.location.pathname}`;

	// 合并工具栏按钮
	const mergedToolBarRender = (
		action: ActionType | undefined,
		rows: { selectedRowKeys?: (string | number)[]; selectedRows?: T[] },
	) => {
		const originalToolbar = tableProps.toolBarRender ? tableProps.toolBarRender(action, rows) : [];
		const toolbarItems = Array.isArray(originalToolbar) ? originalToolbar : [originalToolbar];

		// 列设置按钮
		const columnSettingButton = enableColumnSetting ? (
			<ColumnSetting
				key="column-setting"
				columns={tableProps.columns || []}
				onColumnsChange={setColumns}
				defaultLockedColumns={defaultLockedColumns}
				enableStorage={enableColumnStorage}
				storageKey={defaultStorageKey}
			/>
		) : null;

		return enableColumnSetting ? [...toolbarItems, columnSettingButton] : toolbarItems;
	};

	// 列设置相关状态
	const [columns, setColumns] = useState<ProColumns[]>(tableProps.columns || []);

	// const tableContainerRef = useRef<HTMLDivElement>(null);

	// const size = useSize(tableContainerRef);
	// const height = (size?.height || 500) - 120;
	// console.log("[ height ] >", height);
	// style={{ height: "calc(100vh - 220px)", overflow: "hidden" }}

	return (
		<div ref={containerRef} className="page-container">
			<ProTable<T, Params>
				{...tableProps}
				columns={columns}
				className={`${tableProps.className || ""} olt-table`}
				scroll={scrollConfig || tableProps.scroll}
				toolBarRender={(action, rows) => mergedToolBarRender(action, rows)}
				// scroll={{ x: "max-content", y: height }}
				rowClassName={`${stripe ? "olt-table-stripe" : ""} ${rowClickable ? "olt-table-row-clickable" : ""} ${
					tableProps.rowClassName || ""
				}`}
			/>
		</div>
	);
};

export default OltTable;
export type { OltTableProps };
