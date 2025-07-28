import { useCallback, useRef, useState } from "react";
import { useDialogStore } from "../store";
import type { DialogConfig, UseModalReturn } from "../types";

interface UseModalOptions {
	defaultConfig?: Partial<DialogConfig>;
	onOpen?: () => void;
	onClose?: () => void;
}

/**
 * 基础弹窗 Hook - 管理单个弹窗的状态
 * 适用于简单的弹窗场景，如编辑表单、详情查看等
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
	const { defaultConfig, onOpen, onClose } = options;

	const dialogIdRef = useRef<string | null>(null);

	const [loading, setLoading] = useState(false);

	const addDialog = useDialogStore((state) => state.addDialog);
	const removeDialog = useDialogStore((state) => state.removeDialog);
	const setDialogLoading = useDialogStore((state) => state.setDialogLoading);
	const getDialog = useDialogStore((state) => state.getDialog);

	// 获取当前弹窗状态
	const currentDialog = dialogIdRef.current ? getDialog(dialogIdRef.current) : null;
	const isOpen = !!currentDialog?.visible;

	const open = useCallback(
		(config: Partial<DialogConfig> = {}) => {
			// 如果已经有弹窗打开，先关闭
			if (dialogIdRef.current) {
				removeDialog(dialogIdRef.current);
			}

			// 合并默认配置
			const finalConfig: DialogConfig = {
				type: "modal",
				destroyOnClose: true,
				maskClosable: true,
				...defaultConfig,
				...config,
				onCancel: () => {
					config.onCancel?.();
					onClose?.();
				},
				onClose: () => {
					config.onClose?.();
					onClose?.();
				},
			} as DialogConfig;

			const id = addDialog(finalConfig);
			dialogIdRef.current = id;
			onOpen?.();
		},
		[defaultConfig, addDialog, removeDialog, onOpen, onClose],
	);

	const close = useCallback(() => {
		if (dialogIdRef.current) {
			removeDialog(dialogIdRef.current);
			dialogIdRef.current = null;
			setLoading(false);
			onClose?.();
		}
	}, [removeDialog, onClose]);

	const toggle = useCallback(() => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}, [isOpen, open, close]);

	const handleSetLoading = useCallback(
		(newLoading: boolean) => {
			setLoading(newLoading);
			if (dialogIdRef.current) {
				setDialogLoading(dialogIdRef.current, newLoading);
			}
		},
		[setDialogLoading],
	);

	return {
		open,
		close,
		toggle,
		isOpen,
		loading,
		setLoading: handleSetLoading,
	};
}

// 便捷的特定类型弹窗 hooks

/**
 * Modal 弹窗 Hook
 */
export function useModalDialog(options: UseModalOptions = {}) {
	return useModal({
		...options,
		defaultConfig: {
			type: "modal",
			centered: true,
			...options.defaultConfig,
		},
	});
}

/**
 * Drawer 弹窗 Hook
 */
export function useDrawerDialog(options: UseModalOptions = {}) {
	return useModal({
		...options,
		defaultConfig: {
			type: "drawer",
			placement: "right",
			width: 600,
			...options.defaultConfig,
		},
	});
}
