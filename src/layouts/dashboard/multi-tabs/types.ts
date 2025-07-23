import type { MenuProps } from "antd";
import type { CSSProperties } from "react";
// types.ts
import type { AppRouteObject } from "#/router";

export type KeepAliveTab = AppRouteObject;

export type MultiTabsContextType = {
	tabs: KeepAliveTab[];
	activeTabRoutePath?: string;
	setTabs: (tabs: KeepAliveTab[]) => void;
	closeTab: (path?: string) => void;
	closeOthersTab: (path?: string) => void;
	closeAll: () => void;
	closeLeft: (path: string) => void;
	closeRight: (path: string) => void;
	refreshTab: (path?: string) => void;
	updateTabTitle: (path: string, title: string, action: TabAction) => void;
	manualCloseTab: (path: string) => void;
};

export type TabItemProps = {
	tab: KeepAliveTab;
	style?: CSSProperties;
	className?: string;
	onClose?: () => void;
};

export type TabDropdownProps = {
	menuItems: MenuProps["items"];
	menuClick: (menuInfo: any, tab: KeepAliveTab) => void;
};

export type TabAction = "replace" | "join";
export interface TabActionParams {
	tabTitle?: string;
	tabAction?: TabAction;
	[key: string]: any;
}
