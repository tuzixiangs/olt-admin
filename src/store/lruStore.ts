import { useCallback } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// LRU 缓存节点
interface LRUNode<T = any> {
	key: string;
	value: T;
	prev: LRUNode<T> | null;
	next: LRUNode<T> | null;
}

// LRU 缓存类
class LRUCache<T = any> {
	private capacity: number;
	private cache: Map<string, LRUNode<T>>;
	private head: LRUNode<T>;
	private tail: LRUNode<T>;

	constructor(capacity = 100) {
		this.capacity = capacity;
		this.cache = new Map();

		// 创建虚拟头尾节点
		this.head = { key: "", value: null as T, prev: null, next: null };
		this.tail = { key: "", value: null as T, prev: null, next: null };
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}

	// 移动节点到头部
	private moveToHead(node: LRUNode<T>): void {
		this.removeNode(node);
		this.addToHead(node);
	}

	// 添加节点到头部
	private addToHead(node: LRUNode<T>): void {
		node.prev = this.head;
		node.next = this.head.next;

		if (this.head.next) {
			this.head.next.prev = node;
		}
		this.head.next = node;
	}

	// 移除节点
	private removeNode(node: LRUNode<T>): void {
		if (node.prev) {
			node.prev.next = node.next;
		}
		if (node.next) {
			node.next.prev = node.prev;
		}
	}

	// 移除尾部节点
	private removeTail(): LRUNode<T> | null {
		const lastNode = this.tail.prev;
		if (lastNode && lastNode !== this.head) {
			this.removeNode(lastNode);
			return lastNode;
		}
		return null;
	}

	// 获取值
	get(key: string): T | undefined {
		const node = this.cache.get(key);
		if (node) {
			// 移动到头部（最近使用）
			this.moveToHead(node);
			return node.value;
		}
		return undefined;
	}

	// 设置值
	set(key: string, value: T): void {
		const existingNode = this.cache.get(key);

		if (existingNode) {
			// 更新现有节点
			existingNode.value = value;
			this.moveToHead(existingNode);
		} else {
			// 创建新节点
			const newNode: LRUNode<T> = {
				key,
				value,
				prev: null,
				next: null,
			};

			this.cache.set(key, newNode);
			this.addToHead(newNode);

			// 检查容量限制
			if (this.cache.size > this.capacity) {
				const tail = this.removeTail();
				if (tail) {
					this.cache.delete(tail.key);
				}
			}
		}
	}

	// 删除值
	delete(key: string): boolean {
		const node = this.cache.get(key);
		if (node) {
			this.removeNode(node);
			this.cache.delete(key);
			return true;
		}
		return false;
	}

	// 检查是否存在
	has(key: string): boolean {
		return this.cache.has(key);
	}

	// 清空缓存
	clear(): void {
		this.cache.clear();
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}

	// 获取当前大小
	size(): number {
		return this.cache.size;
	}

	// 获取所有键
	keys(): string[] {
		return Array.from(this.cache.keys());
	}

	// 设置容量
	setCapacity(newCapacity: number): void {
		this.capacity = newCapacity;

		// 如果当前大小超过新容量，删除多余的项
		while (this.cache.size > this.capacity) {
			const tail = this.removeTail();
			if (tail) {
				this.cache.delete(tail.key);
			}
		}
	}
}

// Store 状态类型
interface LRUStoreState {
	cache: LRUCache;
	capacity: number;
	// 用于触发 React 重新渲染的版本号
	version: number;
}

// Store Actions 类型
interface LRUStoreActions {
	get: <T = any>(key: string) => T | undefined;
	set: <T = any>(key: string, value: T) => void;
	remove: (key: string) => boolean;
	has: (key: string) => boolean;
	clear: () => void;
	setCapacity: (capacity: number) => void;
	getSize: () => number;
	getKeys: () => string[];
	getCapacity: () => number;
}

// 创建 LRU Store
const useLRUStoreBase = create<LRUStoreState & { actions: LRUStoreActions }>()(
	subscribeWithSelector((set, get) => ({
		cache: new LRUCache(100), // 默认容量 100
		capacity: 100,
		version: 0,

		actions: {
			get: <T = any>(key: string): T | undefined => {
				const { cache } = get();
				const value = cache.get(key);

				// 如果获取到值，触发重新渲染（因为 LRU 顺序可能改变）
				if (value !== undefined) {
					set((state) => ({ version: state.version + 1 }));
				}

				return value as T;
			},

			set: <T = any>(key: string, value: T): void => {
				const { cache } = get();
				cache.set(key, value);

				// 触发重新渲染
				set((state) => ({ version: state.version + 1 }));
			},

			remove: (key: string): boolean => {
				const { cache } = get();
				const deleted = cache.delete(key);

				if (deleted) {
					// 触发重新渲染
					set((state) => ({ version: state.version + 1 }));
				}

				return deleted;
			},

			has: (key: string): boolean => {
				const { cache } = get();
				return cache.has(key);
			},

			clear: (): void => {
				const { cache } = get();
				cache.clear();

				// 触发重新渲染
				set((state) => ({ version: state.version + 1 }));
			},

			setCapacity: (capacity: number): void => {
				const { cache } = get();
				cache.setCapacity(capacity);

				set({ capacity });
				// 触发重新渲染
				set((state) => ({ version: state.version + 1 }));
			},

			getSize: (): number => {
				const { cache } = get();
				return cache.size();
			},

			getKeys: (): string[] => {
				const { cache } = get();
				return cache.keys();
			},

			getCapacity: (): number => {
				return get().capacity;
			},
		},
	})),
);

// 导出 store actions
export const useLRUStoreActions = () => useLRUStoreBase((state) => state.actions);

// 类似 useState 的 hook
export function useLRUStore<T = any>(
	key: string,
	defaultValue?: T,
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void, () => void] {
	const actions = useLRUStoreActions();

	// 订阅特定 key 的变化
	const value = useLRUStoreBase(
		useCallback(
			(state) => {
				const currentValue = state.cache.get(key);
				return currentValue !== undefined ? currentValue : defaultValue;
			},
			[key, defaultValue],
		),
	);

	const setValue = useCallback(
		(newValue: T | ((prev: T | undefined) => T)) => {
			// 支持函数形式的更新，就像 useState 一样
			if (typeof newValue === "function") {
				// 获取当前值
				const currentValue = actions.get<T>(key);
				// 应用更新函数
				const updatedValue = (newValue as (prev: T | undefined) => T)(currentValue);
				actions.set(key, updatedValue);
			} else {
				actions.set(key, newValue);
			}
		},
		[key, actions],
	);

	const removeValue = useCallback(() => {
		actions.remove(key);
	}, [key, actions]);

	return [value as T, setValue, removeValue];
}

// 导出 store 本身（用于调试或高级用法）
export const lruStore = useLRUStoreBase;

// 导出类型
export type { LRUStoreActions };
