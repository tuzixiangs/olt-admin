import type { App } from "antd";
import { Modal } from "antd";
import { useCallback } from "react";
import { dialogActions, useDialogStore } from "../store";
import type { ConfirmConfig, DialogConfig, FormDialogConfig, UseDialogReturn } from "../types";

/**
 * 高级弹窗管理 Hook
 * 支持多个弹窗同时存在，提供函数式调用 API
 */
export function useDialog(): UseDialogReturn {
	const addDialog = useDialogStore((state) => state.addDialog);
	const removeDialog = useDialogStore((state) => state.removeDialog);
	const updateDialog = useDialogStore((state) => state.updateDialog);
	const clearAllDialogs = useDialogStore((state) => state.clearAllDialogs);
	const getDialog = useDialogStore((state) => state.getDialog);

	const open = useCallback(
		(config: DialogConfig): string => {
			return addDialog(config);
		},
		[addDialog],
	);

	const close = useCallback(
		(id: string) => {
			removeDialog(id);
		},
		[removeDialog],
	);

	const closeAll = useCallback(() => {
		clearAllDialogs();
	}, [clearAllDialogs]);

	const update = useCallback(
		(id: string, config: Partial<DialogConfig>) => {
			updateDialog(id, config);
		},
		[updateDialog],
	);

	const getInstance = useCallback(
		(id: string) => {
			return getDialog(id);
		},
		[getDialog],
	);

	return {
		open,
		close,
		closeAll,
		update,
		getInstance,
	};
}

/**
 * 创建全局弹窗管理器函数
 */
function createGlobalDialog() {
	// 存储modal实例的变量
	let modalInstance: ReturnType<typeof App.useApp> | null = null;

	// 设置modal实例的方法
	const setModalInstance = (instance: ReturnType<typeof App.useApp>) => {
		modalInstance = instance;
	};

	return {
		/**
		 * 设置modal实例（仅供内部使用）
		 */
		_setModalInstance: setModalInstance,

		/**
		 * 打开弹窗
		 */
		open: (config: DialogConfig): string => {
			return dialogActions.open(config);
		},

		/**
		 * 关闭弹窗
		 */
		close: (id: string): void => {
			dialogActions.close(id);
		},

		/**
		 * 关闭所有弹窗
		 */
		closeAll: (): void => {
			dialogActions.closeAll();
		},

		/**
		 * 更新弹窗配置
		 */
		update: (id: string, updates: Partial<DialogConfig>): void => {
			dialogActions.update(id, updates);
		},

		/**
		 * 设置弹窗加载状态
		 */
		setLoading: (id: string, loading: boolean): void => {
			dialogActions.setLoading(id, loading);
		},

		/**
		 * 确认对话框
		 */
		confirm: (config: ConfirmConfig): Promise<boolean> => {
			return new Promise((resolve) => {
				const { type = "confirm" } = config;

				// 优先使用context中的modal实例，否则使用全局Modal
				const modal = modalInstance?.modal || Modal;

				if (type === "confirm") {
					modal.confirm({
						title: config.title,
						content: config.content,
						okText: config.okText,
						cancelText: config.cancelText,
						onOk: async () => {
							try {
								await config.onOk?.();
								resolve(true);
							} catch (error) {
								console.error("Confirm dialog onOk error:", error);
								resolve(false);
							}
						},
						onCancel: () => {
							config.onCancel?.();
							resolve(false);
						},
					});
				} else {
					// 其他类型的确认框
					const modalMethod = modal[type];
					if (modalMethod) {
						modalMethod({
							title: config.title,
							content: config.content,
							okText: config.okText,
							onOk: async () => {
								try {
									await config.onOk?.();
									resolve(true);
								} catch (error) {
									console.error(`${type} dialog onOk error:`, error);
									resolve(false);
								}
							},
						});
					}
				}
			});
		},

		/**
		 * 信息提示
		 */
		info: (config: Omit<ConfirmConfig, "type">): Promise<boolean> => {
			return dialog.confirm({ ...config, type: "info" });
		},

		/**
		 * 成功提示
		 */
		success: (config: Omit<ConfirmConfig, "type">): Promise<boolean> => {
			return dialog.confirm({ ...config, type: "success" });
		},

		/**
		 * 错误提示
		 */
		error: (config: Omit<ConfirmConfig, "type">): Promise<boolean> => {
			return dialog.confirm({ ...config, type: "error" });
		},

		/**
		 * 警告提示
		 */
		warning: (config: Omit<ConfirmConfig, "type">): Promise<boolean> => {
			return dialog.confirm({ ...config, type: "warning" });
		},

		/**
		 * 表单弹窗
		 */
		form: <T = any>(config: FormDialogConfig<T>): string => {
			const { formComponent, initialValues, onSubmit, formProps, ...dialogConfig } = config;

			return dialog.open({
				type: "modal",
				...dialogConfig,
				content: formComponent,
				onOk: async () => {
					if (onSubmit) {
						await onSubmit(initialValues as T);
					}
				},
			});
		},
	};
}

// 创建全局弹窗实例
export const dialog = createGlobalDialog();

// 导出便捷方法，使其可以在组件外使用
export { dialog as globalDialog };