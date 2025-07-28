import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

// 用户偏好设置 Store
interface UserPreferencesStore {
	theme: "light" | "dark" | "auto";
	language: string;
	fontSize: number;
	sidebarCollapsed: boolean;

	setTheme: (theme: "light" | "dark" | "auto") => void;
	setLanguage: (language: string) => void;
	setFontSize: (fontSize: number) => void;
	setSidebarCollapsed: (collapsed: boolean) => void;
	resetPreferences: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
	devtools(
		persist(
			(set) => ({
				// 默认值
				theme: "auto",
				language: "zh-CN",
				fontSize: 14,
				sidebarCollapsed: false,

				// Actions
				setTheme: (theme) => set({ theme }, false, "setTheme"),
				setLanguage: (language) => set({ language }, false, "setLanguage"),
				setFontSize: (fontSize) => set({ fontSize }, false, "setFontSize"),
				setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }, false, "setSidebarCollapsed"),
				resetPreferences: () =>
					set(
						{
							theme: "auto",
							language: "zh-CN",
							fontSize: 14,
							sidebarCollapsed: false,
						},
						false,
						"resetPreferences",
					),
			}),
			{
				name: "user-preferences",
				storage: createJSONStorage(() => localStorage),
				// 可以选择性地持久化某些字段
				partialize: (state) => ({
					theme: state.theme,
					language: state.language,
					fontSize: state.fontSize,
					sidebarCollapsed: state.sidebarCollapsed,
				}),
			},
		),
		{
			name: "user-preferences-store",
		},
	),
);

// 表单数据缓存 Store
interface FormCacheStore {
	formData: Record<string, any>;

	setFormField: (key: string, value: any) => void;
	setFormData: (data: Record<string, any>) => void;
	getFormField: (key: string) => any;
	clearFormData: () => void;
	removeFormField: (key: string) => void;
}

export const useFormCacheStore = create<FormCacheStore>()(
	devtools(
		persist(
			(set, get) => ({
				formData: {},

				setFormField: (key, value) =>
					set(
						(state) => ({
							formData: { ...state.formData, [key]: value },
						}),
						false,
						`setFormField:${key}`,
					),

				setFormData: (data) => set({ formData: data }, false, "setFormData"),

				getFormField: (key) => get().formData[key],

				clearFormData: () => set({ formData: {} }, false, "clearFormData"),

				removeFormField: (key) =>
					set(
						(state) => {
							const { [key]: removed, ...rest } = state.formData;
							return { formData: rest };
						},
						false,
						`removeFormField:${key}`,
					),
			}),
			{
				name: "form-cache",
				storage: createJSONStorage(() => sessionStorage), // 使用 sessionStorage
			},
		),
		{
			name: "form-cache-store",
		},
	),
);

// 购物车 Store (复杂状态示例)
interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
}

interface CartStore {
	items: CartItem[];
	total: number;

	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	getItemCount: () => number;
	getItemById: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
	devtools(
		persist(
			(set, get) => ({
				items: [],
				total: 0,

				addItem: (newItem) =>
					set(
						(state) => {
							const existingItem = state.items.find((item) => item.id === newItem.id);

							let updatedItems: CartItem[];
							if (existingItem) {
								updatedItems = state.items.map((item) =>
									item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
								);
							} else {
								updatedItems = [...state.items, { ...newItem, quantity: 1 }];
							}

							const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

							return { items: updatedItems, total };
						},
						false,
						"addItem",
					),

				removeItem: (id) =>
					set(
						(state) => {
							const updatedItems = state.items.filter((item) => item.id !== id);
							const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

							return { items: updatedItems, total };
						},
						false,
						"removeItem",
					),

				updateQuantity: (id, quantity) => {
					if (quantity <= 0) {
						get().removeItem(id);
						return;
					}

					set(
						(state) => {
							const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item));
							const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

							return { items: updatedItems, total };
						},
						false,
						"updateQuantity",
					);
				},

				clearCart: () => set({ items: [], total: 0 }, false, "clearCart"),

				getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

				getItemById: (id) => get().items.find((item) => item.id === id),
			}),
			{
				name: "shopping-cart",
				storage: createJSONStorage(() => localStorage),
				// 版本控制，当数据结构变化时可以迁移
				version: 1,
				migrate: (persistedState: any, version: number) => {
					if (version === 0) {
						// 从版本 0 迁移到版本 1 的逻辑
						return {
							...persistedState,
							total:
								persistedState.items?.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0) || 0,
						};
					}
					return persistedState;
				},
			},
		),
		{
			name: "cart-store",
		},
	),
);
