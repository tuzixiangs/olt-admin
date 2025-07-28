import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// 购物车商品接口
interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

/**
 * 购物车内存状态管理
 * 支持商品的增删改查
 */
interface CartMemoryState {
	items: CartItem[];
	total: number;
	addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	getItemCount: () => number;
	calculateTotal: () => void;
}

export const useCartMemoryStore = create<CartMemoryState>()(
	subscribeWithSelector((set, get) => ({
		items: [],
		total: 0,

		addItem: (item) =>
			set((state) => {
				const existingItem = state.items.find((i) => i.id === item.id);
				let newItems: CartItem[];

				if (existingItem) {
					newItems = state.items.map((i) =>
						i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
					);
				} else {
					newItems = [...state.items, { ...item, quantity: item.quantity || 1 }];
				}

				const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
				return { items: newItems, total };
			}),

		removeItem: (id) =>
			set((state) => {
				const newItems = state.items.filter((item) => item.id !== id);
				const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
				return { items: newItems, total };
			}),

		updateQuantity: (id, quantity) =>
			set((state) => {
				if (quantity <= 0) {
					const newItems = state.items.filter((item) => item.id !== id);
					const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
					return { items: newItems, total };
				}

				const newItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item));
				const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
				return { items: newItems, total };
			}),

		clearCart: () => set({ items: [], total: 0 }),

		getItemCount: () => {
			const state = get();
			return state.items.reduce((count, item) => count + item.quantity, 0);
		},

		calculateTotal: () =>
			set((state) => {
				const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
				return { total };
			}),
	})),
);
