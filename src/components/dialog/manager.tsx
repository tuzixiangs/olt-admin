import useLocale from "@/locales/use-locale";
import { Drawer, Modal } from "antd";
import { useDialogStore } from "./store";
import type { DialogInstance } from "./types";
import { ModalProvider, useModalContext } from "./modal-context";
import { dialog } from "./hooks/use-dialog";

/**
 * 弹窗实例渲染器
 */
function DialogRenderer({ dialog }: { dialog: DialogInstance }) {
	const { t } = useLocale();
	const { id, config, visible, loading } = dialog;
	const { type, content } = config;

	const handleClose = () => {
		// 调用配置中的关闭回调
		config.onClose?.();
		// 从状态中移除弹窗
		useDialogStore.getState().removeDialog(id);
	};

	const handleOk = async () => {
		if (config.onOk) {
			try {
				// 设置加载状态
				useDialogStore.getState().setDialogLoading(id, true);
				await config.onOk();
				// 如果没有错误，关闭弹窗
				handleClose();
			} catch (error) {
				console.error("Dialog onOk error:", error);
			} finally {
				// 清除加载状态
				useDialogStore.getState().setDialogLoading(id, false);
			}
		} else {
			handleClose();
		}
	};

	const handleCancel = () => {
		config.onCancel?.();
		handleClose();
	};

	if (type === "drawer") {
		const { placement = "right", drawerProps, onOk, onCancel, onClose, okText, cancelText, ...otherConfig } = config;

		return (
			<Drawer
				key={id}
				open={visible}
				placement={placement}
				onClose={handleClose}
				{...otherConfig}
				{...drawerProps}
				// 支持自定义 footer
				footer={
					onOk || onCancel ? (
						<div style={{ textAlign: "right" }}>
							{onCancel && (
								<button type="button" onClick={handleCancel} style={{ marginRight: 8 }} disabled={loading}>
									{cancelText || t("common.cancelText")}
								</button>
							)}
							{onOk && (
								<button
									type="button"
									onClick={handleOk}
									disabled={loading}
									style={{
										backgroundColor: "#1890ff",
										color: "white",
										border: "none",
										borderRadius: "6px",
										padding: "4px 15px",
										cursor: loading ? "not-allowed" : "pointer",
									}}
								>
									{loading ? "加载中..." : okText || t("common.okText")}
								</button>
							)}
						</div>
					) : undefined
				}
			>
				{content}
			</Drawer>
		);
	}

	// Modal 类型
	const { centered = true, modalProps, onOk, onCancel, onClose, okText, cancelText, ...otherConfig } = config;

	return (
		<Modal
			key={id}
			open={visible}
			centered={centered}
			onOk={onOk ? handleOk : undefined}
			onCancel={handleCancel}
			confirmLoading={loading}
			okText={okText || t("common.okText")}
			cancelText={cancelText || t("common.cancelText")}
			{...otherConfig}
			{...modalProps}
			// 确保弹窗关闭时的回调正确处理
			afterClose={() => {
				modalProps?.afterClose?.();
				// 确保弹窗实例从状态中移除
				const currentDialog = useDialogStore.getState().getDialog(id);
				if (currentDialog) {
					useDialogStore.getState().removeDialog(id);
				}
			}}
		>
			{content}
		</Modal>
	);
}

/**
 * 弹窗管理器组件
 * 负责渲染所有活跃的弹窗实例
 */
function DialogManagerContent() {
	const dialogs = useDialogStore((state) => state.dialogs);
	const modal = useModalContext();
	
	// 设置modal实例到全局dialog对象中
	if (modal && dialog._setModalInstance) {
		dialog._setModalInstance(modal);
	}

	return (
		<>
			{dialogs.map((dialog) => (
				<DialogRenderer key={dialog.id} dialog={dialog} />
			))}
		</>
	);
}

export function DialogManager() {
	return (
		<ModalProvider>
			<DialogManagerContent />
		</ModalProvider>
	);
}

export default DialogManager;