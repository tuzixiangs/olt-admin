import type { ColumnsState, ProTableProps } from "@ant-design/pro-components";

export type ColumnStateType = {
	/**
	 * 持久化的类型，支持 localStorage 和 sessionStorage
	 *
	 * @param localStorage 设置在关闭浏览器后也是存在的
	 * @param sessionStorage 关闭浏览器后会丢失
	 */
	persistenceType?: "localStorage" | "sessionStorage";
	/** 持久化的key，用于存储到 storage 中 */
	persistenceKey?: string;
	/** ColumnsState 的值，columnsStateMap将会废弃 */
	defaultValue?: Record<string, ColumnsState>;
	/** ColumnsState 的值，columnsStateMap将会废弃 */
	value?: Record<string, ColumnsState>;
	onChange?: (map: Record<string, ColumnsState>) => void;
};

export interface OltTableProps<T = any, Params = Record<string, any>> extends ProTableProps<T, Params> {
	/**
	 * 是否启用自动高度
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
	 * 默认锁定的列 dataIndex, 配合列设置使用
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
