import { useFilteredNavData } from "@/layouts/dashboard/nav";
import type { AppRouteObject } from "@/types/router";
import { useLocation } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTabOperations } from "../hooks/use-tab-operations";
import type { KeepAliveTab, MultiTabsContextType } from "../types";

const MultiTabsContext = createContext<MultiTabsContextType>({
	tabs: [],
	activeTabRoutePath: "",
	setTabs: () => {},
	closeTab: () => {},
	closeOthersTab: () => {},
	closeAll: () => {},
	closeLeft: () => {},
	closeRight: () => {},
	refreshTab: () => {},
});

function findPathInNavData(path: string, navData: AppRouteObject[]): AppRouteObject | null {
	for (const item of navData) {
		if (item.path === path) {
			return item;
		}
		if (item.children) {
			const child = findPathInNavData(path, item.children);
			if (child) {
				return child;
			}
		}
	}
	return null;
}

export function MultiTabsProvider({ children }: { children: React.ReactNode }) {
	const [tabs, setTabs] = useState<KeepAliveTab[]>([]);
	const navData = useFilteredNavData();
	const location = useLocation();

	const currentRouteMeta = useMemo(() => {
		// 使用 TanStack Router 的 location.pathname
		const currentPath = location.pathname;
		if (!currentPath) return null;
		return findPathInNavData(currentPath, navData);
	}, [location.pathname, navData]);

	const activeTabRoutePath = useMemo(() => {
		if (!currentRouteMeta) return "";
		const { path } = currentRouteMeta;
		return path || "/";
	}, [currentRouteMeta]);

	useEffect(() => {
		if (!currentRouteMeta) return;

		setTabs((prev) => {
			const filtered = prev.filter((item) => !item.meta?.hideTab);

			const { path, children } = currentRouteMeta;

			const isExisted = filtered.find((item) => item.path === path);
			if (!isExisted) {
				return [
					...filtered,
					{
						...currentRouteMeta,
						key: path || "/",
						children,
						timeStamp: new Date().getTime().toString(),
					},
				];
			}

			return filtered;
		});
	}, [currentRouteMeta]);

	const operations = useTabOperations(tabs, setTabs, activeTabRoutePath);

	const contextValue = useMemo(
		() => ({
			tabs,
			activeTabRoutePath,
			setTabs,
			...operations,
		}),
		[tabs, activeTabRoutePath, operations],
	);

	return <MultiTabsContext.Provider value={contextValue}>{children}</MultiTabsContext.Provider>;
}

export function useMultiTabsContext() {
	return useContext(MultiTabsContext);
}
