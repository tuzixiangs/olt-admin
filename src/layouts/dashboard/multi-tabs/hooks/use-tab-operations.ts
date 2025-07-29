import { GLOBAL_CONFIG } from "@/global-config";
import { useKeepAliveManager } from "@/hooks/use-keep-alive-manager";
import { useRouter } from "@/routes/hooks";
import { useLRUStoreActions } from "@/store/lruStore";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import type { KeepAliveTab, TabAction } from "../types";

export function useTabOperations(
	tabs: KeepAliveTab[],
	setTabs: Dispatch<SetStateAction<KeepAliveTab[]>>,
	activeTabRoutePath: string,
) {
	const { push } = useRouter();
	const { clearCache, getCacheStats } = useKeepAliveManager();
	const lruActions = useLRUStoreActions();

	/**
	 * 清除页面相关的所有状态
	 * 包括页面状态、滚动位置、表单数据等
	 */
	const clearPageStates = useCallback(
		(path: string) => {
			// 清除页面状态相关的缓存
			const keysToRemove = [`page_state:${path}`, `scroll_position:${path}`, `form:${path}`];

			for (const key of keysToRemove) {
				if (lruActions.has(key)) {
					lruActions.remove(key);
				}
			}

			// 清除所有以该路径为前缀的缓存
			const allKeys = lruActions.getKeys();
			for (const key of allKeys) {
				if (key.includes(path)) {
					lruActions.remove(key);
				}
			}
		},
		[lruActions],
	);

	/**
	 * 批量清除多个路径的页面状态
	 */
	const clearMultiplePageStates = useCallback(
		(paths: string[]) => {
			for (const path of paths) {
				if (path) {
					clearPageStates(path);
				}
			}
		},
		[clearPageStates],
	);

	const closeTab = useCallback(
		(path = activeTabRoutePath) => {
			if (!path) return;
			const tempTabs = [...tabs];
			if (tempTabs.length === 1) return;

			const deleteTabIndex = tempTabs.findIndex((item) => item.path === path);
			if (deleteTabIndex === -1) return;

			if (deleteTabIndex > 0) {
				if (tempTabs[deleteTabIndex].path === activeTabRoutePath) {
					push(tempTabs[deleteTabIndex - 1].path || "/");
				}
			} else {
				push(tempTabs[deleteTabIndex + 1].path || "/");
			}

			tempTabs.splice(deleteTabIndex, 1);

			// 清除 KeepAlive 缓存
			clearCache(path);

			// 清除页面状态缓存
			clearPageStates(path);

			setTabs(tempTabs);
		},
		[activeTabRoutePath, push, tabs, setTabs, clearCache, clearPageStates],
	);

	const closeOthersTab = useCallback(
		(path = activeTabRoutePath) => {
			setTabs((prev) => {
				const pathsToRemove: string[] = [];
				for (let i = 0; i < prev.length; i++) {
					if (prev[i].path !== path) {
						clearCache(prev[i].path || "");
						pathsToRemove.push(prev[i].path || "");
					}
				}

				// 批量清除其他标签的页面状态
				clearMultiplePageStates(pathsToRemove);

				return prev.filter((item) => item.path === path);
			});
			if (path !== activeTabRoutePath) {
				push(path);
			}
		},
		[activeTabRoutePath, push, setTabs, clearCache, clearMultiplePageStates],
	);

	const closeAll = useCallback(() => {
		// 获取所有标签路径
		const allPaths = tabs.map((tab) => tab.path).filter(Boolean) as string[];

		setTabs([]);
		clearCache("All");

		// 批量清除所有页面状态
		clearMultiplePageStates(allPaths);

		push(GLOBAL_CONFIG.defaultRoute);
	}, [push, setTabs, clearCache, clearMultiplePageStates, tabs]);

	const closeLeft = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(currentTabIndex);
			const pathsToRemove = tabs
				.slice(0, currentTabIndex)
				.map((tab) => tab.path)
				.filter(Boolean) as string[];

			setTabs(() => {
				for (const pathToRemove of pathsToRemove) {
					clearCache(pathToRemove);
				}

				// 批量清除左侧标签的页面状态
				clearMultiplePageStates(pathsToRemove);

				return newTabs;
			});
			push(path);
		},
		[push, tabs, setTabs, clearCache, clearMultiplePageStates],
	);

	const closeRight = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(0, currentTabIndex + 1);
			const pathsToRemove = tabs
				.slice(currentTabIndex + 1)
				.map((tab) => tab.path)
				.filter(Boolean) as string[];

			setTabs(() => {
				for (const pathToRemove of pathsToRemove) {
					clearCache(pathToRemove);
				}

				// 批量清除右侧标签的页面状态
				clearMultiplePageStates(pathsToRemove);

				return newTabs;
			});
			push(path);
		},
		[push, tabs, setTabs, clearCache, clearMultiplePageStates],
	);

	const refreshTab = useCallback(
		(path = activeTabRoutePath) => {
			if (!path) return;

			// 刷新时清除页面状态，让页面重新初始化
			clearPageStates(path);

			setTabs((prev) => {
				const newTabs = [...prev];
				const index = newTabs.findIndex((item) => item.path === path);
				if (index >= 0) {
					newTabs[index] = {
						...newTabs[index],
						handle: {
							...newTabs[index].handle,
							title: newTabs[index].handle?.title || "",
							timeStamp: new Date().getTime().toString(),
						},
					};
				}
				return newTabs;
			});
		},
		[activeTabRoutePath, setTabs, clearPageStates],
	);

	const updateTabTitle = useCallback(
		(path: string, title: string, action: TabAction) => {
			setTabs((prev) => {
				const newTabs = [...prev];
				const index = newTabs.findIndex((item) => item.path === path);
				if (index >= 0) {
					let newTitle = title;
					if (action === "replace") {
						newTitle = title;
					} else if (action === "join") {
						const splitTitle = newTabs[index].handle?.title?.split(" - ");
						newTitle = `${splitTitle?.[0]} - ${title}`;
					}
					newTabs[index] = { ...newTabs[index], handle: { ...newTabs[index].handle, title: newTitle } };
				}
				return newTabs;
			});
		},
		[setTabs],
	);

	/**
	 * 手动关闭tab,需要自行处理路由跳转
	 */
	const manualCloseTab = useCallback(
		(path: string) => {
			setTabs((prev) => {
				for (let i = 0; i < prev.length; i++) {
					if (prev[i].path === path) {
						clearCache(path);
						// 清除页面状态
						clearPageStates(path);
					}
				}
				return prev.filter((item) => item.path !== path);
			});
		},
		[setTabs, clearCache, clearPageStates],
	);

	/**
	 * 获取页面状态统计信息
	 */
	const getPageStateStats = useCallback(() => {
		const allKeys = lruActions.getKeys();
		const pageStateKeys = allKeys.filter(
			(key: string) => key.startsWith("page_state:") || key.startsWith("scroll_position:") || key.startsWith("form:"),
		);

		return {
			totalKeys: allKeys.length,
			pageStateKeys: pageStateKeys.length,
			pageStates: pageStateKeys.filter((key: string) => key.startsWith("page_state:")).length,
			scrollPositions: pageStateKeys.filter((key: string) => key.startsWith("scroll_position:")).length,
			formStates: pageStateKeys.filter((key: string) => key.startsWith("form:")).length,
			keys: pageStateKeys,
		};
	}, [lruActions]);

	/**
	 * 清除所有页面状态（保留其他类型的缓存）
	 */
	const clearAllPageStates = useCallback(() => {
		const allKeys = lruActions.getKeys();
		const pageStateKeys = allKeys.filter(
			(key: string) => key.startsWith("page_state:") || key.startsWith("scroll_position:") || key.startsWith("form:"),
		);

		for (const key of pageStateKeys) {
			lruActions.remove(key);
		}

		return pageStateKeys.length;
	}, [lruActions]);

	return {
		// 原有的标签操作
		closeTab,
		closeOthersTab,
		closeAll,
		closeLeft,
		closeRight,
		refreshTab,
		updateTabTitle,
		manualCloseTab,

		// 增强缓存管理功能
		clearCache,
		getCacheStats,

		// 新增的页面状态管理功能
		clearPageStates,
		clearMultiplePageStates,
		getPageStateStats,
		clearAllPageStates,
	};
}
