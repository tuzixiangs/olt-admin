import { GLOBAL_CONFIG } from "@/global-config";
import { useKeepAliveManager } from "@/hooks/use-keep-alive-manager";
import { useRouter } from "@/routes/hooks";
import { useParamsCacheActions } from "@/store/cacheStore";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import type { KeepAliveTab, TabAction } from "../types";

export function useTabOperations(
	tabs: KeepAliveTab[],
	setTabs: Dispatch<SetStateAction<KeepAliveTab[]>>,
	activeTabRoutePath: string,
) {
	const { push } = useRouter();
	const { clearCache, getCacheStats } = useKeepAliveManager();
	const { clearCachedParams, clearCachedParamsByPaths, getCachedPaths } = useParamsCacheActions();

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
			clearCache(path);

			// 清除对应的 params 缓存
			clearCachedParams(path);

			setTabs(tempTabs);
		},
		[activeTabRoutePath, push, tabs, setTabs, clearCache, clearCachedParams],
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

				// 清除其他标签的 params 缓存
				clearCachedParamsByPaths(pathsToRemove);

				return prev.filter((item) => item.path === path);
			});
			if (path !== activeTabRoutePath) {
				push(path);
			}
		},
		[activeTabRoutePath, push, setTabs, clearCache, clearCachedParamsByPaths],
	);

	const closeAll = useCallback(() => {
		setTabs([]);
		clearCache("All");

		// 清除所有 params 缓存
		const allCachedPaths = getCachedPaths();
		clearCachedParamsByPaths(allCachedPaths);

		push(GLOBAL_CONFIG.defaultRoute);
	}, [push, setTabs, clearCache, getCachedPaths, clearCachedParamsByPaths]);

	const closeLeft = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(currentTabIndex);
			setTabs((prev) => {
				const pathsToRemove: string[] = [];
				for (let i = 0; i < currentTabIndex; i++) {
					clearCache(prev[i].path || "");
					pathsToRemove.push(prev[i].path || "");
				}

				// 清除左侧标签的 params 缓存
				clearCachedParamsByPaths(pathsToRemove);

				return newTabs;
			});
			push(path);
		},
		[push, tabs, setTabs, clearCache, clearCachedParamsByPaths],
	);

	const closeRight = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(0, currentTabIndex + 1);
			setTabs((prev) => {
				const pathsToRemove: string[] = [];
				for (let i = currentTabIndex + 1; i < prev.length; i++) {
					clearCache(prev[i].path || "");
					pathsToRemove.push(prev[i].path || "");
				}

				// 清除右侧标签的 params 缓存
				clearCachedParamsByPaths(pathsToRemove);

				return newTabs;
			});
			push(path);
		},
		[push, tabs, setTabs, clearCache, clearCachedParamsByPaths],
	);

	const refreshTab = useCallback(
		(path = activeTabRoutePath) => {
			if (!path) return;

			// 刷新增强缓存管理器中的缓存
			// refreshCurrentCache(path);

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
		[activeTabRoutePath, setTabs],
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
						// 清除对应的 params 缓存
						clearCachedParams(path);
					}
				}
				return prev.filter((item) => item.path !== path);
			});
		},
		[setTabs, clearCache, clearCachedParams],
	);

	return {
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
	};
}
