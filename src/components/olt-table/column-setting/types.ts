import type { ProColumns } from "@ant-design/pro-components";

/**
 * 列配置项
 */
export interface ColumnConfig {
	/** 列的唯一标识 */
	key: string;
	/** 列标题 */
	title: string;
	/** 数据索引 */
	dataIndex: string;
	/** 是否显示 */
	visible: boolean;
	/** 是否锁定（锁定的列不能隐藏或移动） */
	locked: boolean;
	/** 排序索引 */
	sortIndex: number;
	/** 列宽度 */
	width?: number;
	/** 固定位置 */
	fixed?: "left" | "right";
	/** 原始列配置 */
	originalColumn: ProColumns;
}

/**
 * 列设置组件属性
 */
export interface ColumnSettingProps {
	/** 原始列配置 */
	columns: ProColumns[];
	/** 列配置变更回调 */
	onColumnsChange: (columns: ProColumns[]) => void;
	/** 默认锁定的列key */
	defaultLockedColumns?: string[];
	/** 是否启用持久化存储 */
	enableStorage?: boolean;
	/** 存储键名 */
	storageKey?: string;
}

/**
 * 新增字段表单数据
 */
export interface AddFieldFormData {
	/** 字段key */
	key: string;
	/** 字段标题 */
	title: string;
	/** 数据索引 */
	dataIndex: string;
	/** 字段类型 */
	type: "text" | "number" | "date" | "select" | "custom";
	/** 列宽度 */
	width?: number;
	/** 固定位置 */
	fixed?: "left" | "right";
}

/**
 * 拖拽项属性
 */
export interface DragableItemProps {
	/** 列配置 */
	config: ColumnConfig;
	/** 可见性切换回调 */
	onToggleVisible: (key: string) => void;
	/** 删除回调 */
	onDelete?: (key: string) => void;
}
