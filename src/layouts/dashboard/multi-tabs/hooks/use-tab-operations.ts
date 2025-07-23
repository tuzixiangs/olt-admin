import { GLOBAL_CONFIG } from "@/global-config";
import { useRouter } from "@/routes/hooks";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import type { KeepAliveTab, TabAction } from "../types";

export function useTabOperations(
	tabs: KeepAliveTab[],
	setTabs: Dispatch<SetStateAction<KeepAliveTab[]>>,
	activeTabRoutePath: string,
) {
	const { push } = useRouter();

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
			setTabs(tempTabs);
		},
		[activeTabRoutePath, push, tabs, setTabs],
	);

	const closeOthersTab = useCallback(
		(path = activeTabRoutePath) => {
			setTabs((prev) => prev.filter((item) => item.path === path));
			if (path !== activeTabRoutePath) {
				push(path);
			}
		},
		[activeTabRoutePath, push, setTabs],
	);

	const closeAll = useCallback(() => {
		setTabs([]);
		push(GLOBAL_CONFIG.defaultRoute);
	}, [push, setTabs]);

	const closeLeft = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(currentTabIndex);
			setTabs(newTabs);
			push(path);
		},
		[push, tabs, setTabs],
	);

	const closeRight = useCallback(
		(path: string) => {
			const currentTabIndex = tabs.findIndex((item) => item.path === path);
			const newTabs = tabs.slice(0, currentTabIndex + 1);
			setTabs(newTabs);
			push(path);
		},
		[push, tabs, setTabs],
	);

	const refreshTab = useCallback(
		(path = activeTabRoutePath) => {
			if (!path) return;
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
			setTabs((prev) => prev.filter((item) => item.path !== path));
		},
		[setTabs],
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
	};
}
