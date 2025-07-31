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
 * 在 hook 执行时检测保存的滚动位置并自动恢复，然后开始监听滚动事件
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
		/** 滚动事件节流时间，默认 200ms */
		throttleMs?: number;
		/** 是否禁用缓存功能，默认 false */
		disabled?: boolean;
		/** 手动调用时的滚动行为，默认 smooth */
		manualScrollBehavior?: ScrollBehavior;
		/** 初始恢复时的滚动行为，默认 smooth */
		restoreScrollBehavior?: ScrollBehavior;
	} = {},
) {
	const location = useLocation();
	const {
		key = location.pathname,
		autoListen = true,
		throttleMs = 200,
		disabled = false,
		manualScrollBehavior = "smooth",
		restoreScrollBehavior = "smooth",
	} = options;

	// 程序化滚动标志，用于区分程序触发的滚动和用户手动滚动
	const isProgrammaticScrollRef = useRef(false);

	// 是否已经完成初始滚动恢复
	const [isRestoreCompleted, setIsRestoreCompleted] = useState(false);

	// 恢复滚动位置的通用函数
	const createRestoreScroll = useCallback(
		(scrollY: number | undefined, behavior: ScrollBehavior = manualScrollBehavior) => {
			return () => {
				const targetScrollY = scrollY || 0;
				if (targetScrollY && targetScrollY > 0) {
					// 标记为程序化滚动
					isProgrammaticScrollRef.current = true;

					requestAnimationFrame(() => {
						window.scrollTo({
							top: targetScrollY,
							behavior: behavior,
						});

						// 根据滚动行为设置不同的延迟时间来清除标志
						const clearDelay = behavior === "smooth" ? 1000 : 100; // smooth 滚动需要更长时间

						setTimeout(() => {
							isProgrammaticScrollRef.current = false;
						}, clearDelay);
					});
				}
			};
		},
		[manualScrollBehavior],
	);

	if (disabled) {
		// 禁用模式下，不进行任何滚动监听和处理，只返回基本的状态管理
		const [scrollY, setScrollY] = useState<number>(0);
		const removeScrollY = useCallback(() => {
			setScrollY(0);
		}, []);

		// 提供一个空的恢复函数，保持 API 一致性
		const restoreScroll = useCallback(() => {
			// 禁用模式下不执行任何操作
		}, []);

		return [scrollY, setScrollY, restoreScroll, removeScrollY] as const;
	}

	// 启用缓存时，使用 LRU Store
	const [scrollY, setScrollY, removeScrollY] = useLRUStore<number>(`scroll_position:${key}`, 0);

	// 恢复滚动位置 - 手动调用时使用平滑滚动
	const restoreScroll = createRestoreScroll(scrollY, manualScrollBehavior);

	// 初始化时检测并恢复保存的滚动位置
	useEffect(() => {
		const savedScrollY = scrollY || 0;
		if (savedScrollY > 0) {
			// 延迟恢复，确保页面内容已加载
			const timer = setTimeout(() => {
				const initialRestoreScroll = createRestoreScroll(savedScrollY, restoreScrollBehavior);
				initialRestoreScroll();

				// 标记恢复完成，延迟一点时间确保滚动完成
				setTimeout(
					() => {
						setIsRestoreCompleted(true);
					},
					restoreScrollBehavior === "smooth" ? 1000 : 100,
				);
			}, 100);

			return () => clearTimeout(timer);
		}

		// 没有保存的滚动位置，直接标记恢复完成
		setIsRestoreCompleted(true);
	}, [scrollY, restoreScrollBehavior, createRestoreScroll]);

	// 滚动监听 - 只在恢复完成后开始监听
	useEffect(() => {
		if (!autoListen || !isRestoreCompleted) return;

		let timeoutId: NodeJS.Timeout;

		const handleScroll = () => {
			// 如果是程序化滚动，跳过状态更新
			if (isProgrammaticScrollRef.current) {
				return;
			}

			// 节流处理保存滚动位置
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				// 再次检查是否为程序化滚动，避免延迟执行时的状态更新
				if (!isProgrammaticScrollRef.current) {
					console.log("[ window.scrollY ] >", window.scrollY);
					setScrollY(window.scrollY);
				}
			}, throttleMs);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(timeoutId);
		};
	}, [throttleMs, autoListen, isRestoreCompleted, setScrollY]);

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
