import { useLRUStore } from "@/store/lruStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

/**
 * 页面状态管理 Hook
 * 基于 LRU Store 实现，自动与路由绑定，支持表单数据、滚动位置等任意状态的保存和恢复
 *
 * @template T 状态数据类型
 * @param defaultValue 默认值
 * @param options 配置选项
 * @returns [state, setState, removeState] 类似 useState 的 API
 *
 * @example
 * ```typescript
 * // 保存表单数据
 * const [formData, setFormData] = usePageState<FormData>({
 *   name: '',
 *   email: ''
 * });
 *
 * // 保存任意页面状态
 * const [pageState, setPageState] = usePageState({
 *   selectedTab: 0,
 *   searchQuery: '',
 *   filters: {}
 * });
 * ```
 */
export function usePageState<T>(
	defaultValue?: T,
	options: {
		/** 自定义缓存键，默认使用当前路由路径 + 查询参数 */
		key?: string;
		/** 是否禁用缓存功能，默认 false */
		disabled?: boolean;
	} = {},
) {
	const location = useLocation();
	const key = location.pathname + location.search;
	const { key: customKey = key, disabled = false } = options;

	if (disabled) {
		// 在禁用模式下，只使用 useState
		const [state, setState] = useState<T | undefined>(defaultValue);
		const removeState = useCallback(() => {
			setState(defaultValue);
		}, [defaultValue]);

		return [state, setState, removeState] as const;
	}

	// 启用缓存时，使用 LRU Store
	return useLRUStore<T>(`page_state:${customKey}`, defaultValue);
}

/**
 * 页面滚动位置管理 Hook
 * 专门用于管理页面滚动位置的保存和恢复
 *
 * @param options 配置选项
 * @returns [scrollY, setScrollY, restoreScroll]
 *
 * @example
 * ```typescript
 * const [scrollY, setScrollY, restoreScroll] = usePageScrollPosition();
 *
 * // 手动保存滚动位置
 * const handleSaveScroll = () => {
 *   setScrollY(window.scrollY);
 * };
 *
 * // 恢复滚动位置
 * const handleRestoreScroll = () => {
 *   restoreScroll();
 * };
 * ```
 */
export function usePageScrollPosition(
	options: {
		/** 自定义缓存键，默认使用当前路由路径 */
		key?: string;
		/** 是否自动监听滚动事件，默认 true */
		autoListen?: boolean;
		/** 是否在路由切换时自动恢复滚动位置，默认 true */
		autoRestore?: boolean;
		/** 滚动事件节流时间，默认 200ms */
		throttleMs?: number;
		/** 是否禁用缓存功能，默认 false */
		disabled?: boolean;
		/** 用户滚动检测超时时间，默认 1000ms */
		userScrollTimeout?: number;
		/** 手动调用时的滚动行为，默认 smooth */
		manualScrollBehavior?: ScrollBehavior;
		/** 自动恢复时的滚动行为，默认 instant */
		autoScrollBehavior?: ScrollBehavior;
	} = {},
) {
	const location = useLocation();
	const {
		key = location.pathname,
		autoListen = true,
		autoRestore = true,
		throttleMs = 200,
		disabled = false,
		userScrollTimeout = 1000,
		manualScrollBehavior = "smooth",
		autoScrollBehavior = "smooth",
	} = options;

	// 用户交互状态
	const [isUserScrolling, setIsUserScrolling] = useState(false);
	const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 恢复滚动位置的通用函数
	const createRestoreScroll = (scrollY: number | undefined, behavior: ScrollBehavior = manualScrollBehavior) => {
		return () => {
			const targetScrollY = scrollY || 0;
			if (targetScrollY && targetScrollY > 0) {
				// 对于手动调用，不检查 isUserScrolling，允许用户主动触发平滑滚动
				// 对于自动恢复，检查 isUserScrolling，避免冲突
				const shouldScroll = behavior === manualScrollBehavior || !isUserScrolling;

				if (shouldScroll) {
					requestAnimationFrame(() => {
						window.scrollTo({
							top: targetScrollY,
							behavior: behavior,
						});
					});
				}
			}
		};
	};

	// 自动监听滚动事件的通用函数
	const useScrollListener = (
		setScrollY: (value: number | ((prev: number | undefined) => number)) => void,
		throttleMsValue: number,
	) => {
		const handleUserScrollEnd = useCallback(() => {
			setIsUserScrolling(false);
		}, []);

		useEffect(() => {
			if (!autoListen) return;

			let timeoutId: NodeJS.Timeout;

			const handleScroll = () => {
				// 标记用户正在滚动
				setIsUserScrolling(true);

				// 清除之前的超时
				if (userScrollTimeoutRef.current) {
					clearTimeout(userScrollTimeoutRef.current);
				}

				// 设置用户滚动结束检测
				userScrollTimeoutRef.current = setTimeout(handleUserScrollEnd, userScrollTimeout);

				// 节流处理保存滚动位置
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					setScrollY(window.scrollY);
				}, throttleMsValue);
			};

			window.addEventListener("scroll", handleScroll, { passive: true });

			return () => {
				window.removeEventListener("scroll", handleScroll);
				clearTimeout(timeoutId);
				if (userScrollTimeoutRef.current) {
					clearTimeout(userScrollTimeoutRef.current);
				}
			};
		}, [setScrollY, throttleMsValue, handleUserScrollEnd]);
	};

	// 自动恢复滚动位置的通用函数
	const useAutoRestore = (scrollY: number | undefined) => {
		useEffect(() => {
			if (!autoRestore) return;

			// 延迟恢复，确保页面内容已加载，并且用户没有在滚动
			const timer = setTimeout(() => {
				if (!isUserScrolling) {
					// 自动恢复使用 instant 行为，避免与用户操作冲突
					const autoRestoreScroll = createRestoreScroll(scrollY, autoScrollBehavior);
					autoRestoreScroll();
				}
			}, 300); // 增加延迟时间，给页面更多加载时间

			return () => clearTimeout(timer);
		}, [scrollY]);
	};

	if (disabled) {
		// 在禁用模式下，只使用 useState
		const [scrollY, setScrollY] = useState<number>(0);
		const removeScrollY = useCallback(() => {
			setScrollY(0);
		}, []);

		// 恢复滚动位置 - 手动调用时使用平滑滚动
		const restoreScroll = createRestoreScroll(scrollY, manualScrollBehavior);

		// 自动监听滚动事件
		useScrollListener(setScrollY, throttleMs);

		// 路由切换时自动恢复滚动位置
		useAutoRestore(scrollY);

		return [scrollY, setScrollY, restoreScroll, removeScrollY] as const;
	}

	// 启用缓存时，使用 LRU Store
	const [scrollY, setScrollY, removeScrollY] = useLRUStore<number>(`scroll_position:${key}`, 0);

	// 恢复滚动位置 - 手动调用时使用平滑滚动
	const restoreScroll = createRestoreScroll(scrollY, manualScrollBehavior);

	// 自动监听滚动事件
	useScrollListener(setScrollY, throttleMs);

	// 路由切换时自动恢复滚动位置
	useAutoRestore(scrollY);

	return [scrollY || 0, setScrollY, restoreScroll, removeScrollY] as const;
}

/**
 * 组合页面状态管理 Hook
 * 同时管理页面数据状态和滚动位置
 *
 * @template T 页面状态数据类型
 * @param defaultState 默认页面状态
 * @param options 配置选项
 * @returns 包含状态和滚动位置的管理对象
 *
 * @example
 * ```typescript
 * const {
 *   state,
 *   setState,
 *   scrollY,
 *   setScrollY,
 *   restoreScroll,
 *   clearAll
 * } = usePageStateWithScroll({
 *   formData: { name: '', email: '' },
 *   selectedTab: 0
 * });
 * ```
 */
export function usePageStateWithScroll<T>(
	defaultState?: T,
	options: {
		/** 自定义缓存键前缀，默认使用当前路由路径 */
		keyPrefix?: string;
		/** 页面状态配置 */
		stateOptions?: Parameters<typeof usePageState>[1];
		/** 滚动位置配置 */
		scrollOptions?: Parameters<typeof usePageScrollPosition>[0];
		/** 是否禁用缓存功能，默认 false */
		disabled?: boolean;
	} = {},
) {
	const location = useLocation();
	const { keyPrefix = location.pathname, stateOptions, scrollOptions, disabled = false } = options;

	const [state, setState, removeState] = usePageState(defaultState, {
		key: keyPrefix,
		disabled: disabled, // 传递disabled选项
		...stateOptions,
	});

	const [scrollY, setScrollY, restoreScroll, removeScrollY] = usePageScrollPosition({
		key: keyPrefix,
		disabled: disabled, // 传递disabled选项
		...scrollOptions,
	});

	// 清除所有状态
	const clearAll = useCallback(() => {
		removeState();
		removeScrollY();
	}, [removeState, removeScrollY]);

	return {
		// 页面状态
		state,
		setState,
		removeState,

		// 滚动位置
		scrollY,
		setScrollY,
		restoreScroll,
		removeScrollY,

		// 工具方法
		clearAll,
	};
}

/**
 * TODO：待完善
 * 表单状态管理 Hook
 * 专门用于表单数据的保存和恢复，提供表单特有的功能
 *
 * @template T 表单数据类型
 * @param defaultFormData 默认表单数据
 * @param options 配置选项
 * @returns 表单状态管理对象
 *
 * @example
 * ```typescript
 * const {
 *   formData,
 *   setFormData,
 *   updateField,
 *   resetForm,
 *   isDirty
 * } = useFormState({
 *   name: '',
 *   email: '',
 *   age: 0
 * });
 *
 * // 更新单个字段
 * updateField('name', 'John');
 *
 * // 检查表单是否有变更
 * if (isDirty) {
 *   // 提示用户保存
 * }
 * ```
 */
export function useFormState<T extends Record<string, any>>(
	defaultFormData: T,
	options: {
		/** 自定义缓存键，默认使用当前路由路径 */
		key?: string;
		/** 是否在路由切换时提示保存，默认 false */
		promptOnRouteChange?: boolean;
	} = {},
) {
	const location = useLocation();
	const { key = location.pathname, promptOnRouteChange = false } = options;

	const [formData, setFormData, removeFormData] = usePageState<T>(defaultFormData, { key: `form:${key}` });

	// 更新单个字段
	const updateField = useCallback(
		<K extends keyof T>(field: K, value: T[K]) => {
			const currentData = formData || defaultFormData;
			setFormData({
				...currentData,
				[field]: value,
			} as T);
		},
		[setFormData, formData, defaultFormData],
	);

	// 重置表单
	const resetForm = useCallback(() => {
		setFormData(defaultFormData);
	}, [setFormData, defaultFormData]);

	// 检查表单是否有变更
	const isDirty = JSON.stringify(formData) !== JSON.stringify(defaultFormData);

	// 路由切换时提示保存
	useEffect(() => {
		if (!promptOnRouteChange || !isDirty) return;

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "您有未保存的表单数据，确定要离开吗？";
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [promptOnRouteChange, isDirty]);

	return {
		formData,
		setFormData,
		updateField,
		resetForm,
		removeFormData,
		isDirty,
	};
}
