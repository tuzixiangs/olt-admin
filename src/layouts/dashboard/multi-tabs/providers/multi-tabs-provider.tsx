import type { RouteMeta } from "@/types/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMatches } from "react-router";
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

export function MultiTabsProvider({ children }: { children: React.ReactNode }) {
	const [tabs, setTabs] = useState<KeepAliveTab[]>([]);
	const matches = useMatches();
	const currentRouteMeta = useMemo(() => {
		const current = matches.at(-1);
		if (!current) return null;
		return {
			handle: (current.handle || {}) as RouteMeta,
			path: current.pathname,
		};
	}, [matches]);

	const activeTabRoutePath = useMemo(() => {
		if (!currentRouteMeta) return "";
		const { path } = currentRouteMeta;
		return path || "/";
	}, [currentRouteMeta]);

	useEffect(() => {
		if (!currentRouteMeta) return;

		setTabs((prev) => {
			const filtered = prev.filter((item) => !item.handle?.hideTab);
			const { path } = currentRouteMeta;

			const isExisted = filtered.find((item) => item.path === path);
			if (!isExisted && currentRouteMeta.handle.title) {
				return [
					...filtered,
					{
						...currentRouteMeta,
						key: path || "/",
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
