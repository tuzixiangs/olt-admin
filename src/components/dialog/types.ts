import type { DrawerProps, ModalProps } from "antd";
import type { ReactNode } from "react";

// 弹窗类型
export type DialogType = "modal" | "drawer";

// 弹窗基础配置
export interface BaseDialogConfig {
	id?: string;
	title?: ReactNode;
	content: ReactNode;
	type?: DialogType;
	width?: string | number;
	onOk?: () => void | Promise<void>;
	onCancel?: () => void;
	onClose?: () => void;
	okText?: string;
	cancelText?: string;
	closable?: boolean;
	maskClosable?: boolean;
	destroyOnClose?: boolean;
	className?: string;
	style?: React.CSSProperties;
	footer?: ReactNode;
}

// Modal 配置
export interface ModalConfig extends BaseDialogConfig {
	type: "modal";
	centered?: boolean;
	modalProps?: Omit<ModalProps, "open" | "onOk" | "onCancel">;
}

// Drawer 配置
export interface DrawerConfig extends BaseDialogConfig {
	type: "drawer";
	placement?: "top" | "right" | "bottom" | "left";
	drawerProps?: Omit<DrawerProps, "open" | "onClose">;
}

// 弹窗配置联合类型
export type DialogConfig = ModalConfig | DrawerConfig;

// 弹窗实例
export interface DialogInstance {
	id: string;
	config: DialogConfig;
	visible: boolean;
	loading?: boolean;
}

// Hook 返回值
export interface UseModalReturn {
	open: (config?: Partial<DialogConfig>) => void;
	close: () => void;
	toggle: () => void;
	isOpen: boolean;
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

// 弹窗管理器返回值
export interface UseDialogReturn {
	open: (config: DialogConfig) => string;
	close: (id: string) => void;
	closeAll: () => void;
	update: (id: string, config: Partial<DialogConfig>) => void;
	getInstance: (id: string) => DialogInstance | undefined;
}

// 确认弹窗配置
export interface ConfirmConfig {
	title?: ReactNode;
	content?: ReactNode;
	onOk?: () => void | Promise<void>;
	onCancel?: () => void;
	okText?: string;
	cancelText?: string;
	type?: "info" | "success" | "error" | "warning" | "confirm";
}

// 表单弹窗配置
export interface FormDialogConfig<T = any> extends Omit<BaseDialogConfig, "content"> {
	formComponent: ReactNode;
	initialValues?: T;
	onSubmit?: (values: T) => void | Promise<void>;
	formProps?: any;
}
