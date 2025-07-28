import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DialogConfig, DialogInstance } from "./types";

interface DialogState {
	dialogs: DialogInstance[];
	// Actions
	addDialog: (config: DialogConfig) => string;
	removeDialog: (id: string) => void;
	updateDialog: (id: string, updates: Partial<DialogConfig>) => void;
	setDialogLoading: (id: string, loading: boolean) => void;
	clearAllDialogs: () => void;
	getDialog: (id: string) => DialogInstance | undefined;
}

// 生成唯一ID
const generateId = () => `dialog_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export const useDialogStore = create<DialogState>()(
	devtools(
		(set, get) => ({
			dialogs: [],

			addDialog: (config: DialogConfig) => {
				const id = config.id || generateId();
				const dialog: DialogInstance = {
					id,
					config: { ...config, id },
					visible: true,
					loading: false,
				};

				set(
					(state) => ({
						dialogs: [...state.dialogs, dialog],
					}),
					false,
					"addDialog",
				);

				return id;
			},

			removeDialog: (id: string) => {
				set(
					(state) => ({
						dialogs: state.dialogs.filter((dialog) => dialog.id !== id),
					}),
					false,
					"removeDialog",
				);
			},

			updateDialog: (id: string, updates: Partial<DialogConfig>) => {
				set(
					(state) => ({
						dialogs: state.dialogs.map((dialog) =>
							dialog.id === id
								? {
										...dialog,
										config: { ...dialog.config, ...updates },
									}
								: dialog,
						),
					}),
					false,
					"updateDialog",
				);
			},

			setDialogLoading: (id: string, loading: boolean) => {
				set(
					(state) => ({
						dialogs: state.dialogs.map((dialog) => (dialog.id === id ? { ...dialog, loading } : dialog)),
					}),
					false,
					"setDialogLoading",
				);
			},

			clearAllDialogs: () => {
				set({ dialogs: [] }, false, "clearAllDialogs");
			},

			getDialog: (id: string) => {
				return get().dialogs.find((dialog) => dialog.id === id);
			},
		}),
		{
			name: "dialog-store",
		},
	),
);

// 导出便捷方法
export const dialogActions = {
	open: (config: DialogConfig) => useDialogStore.getState().addDialog(config),
	close: (id: string) => useDialogStore.getState().removeDialog(id),
	closeAll: () => useDialogStore.getState().clearAllDialogs(),
	update: (id: string, updates: Partial<DialogConfig>) => useDialogStore.getState().updateDialog(id, updates),
	setLoading: (id: string, loading: boolean) => useDialogStore.getState().setDialogLoading(id, loading),
};
