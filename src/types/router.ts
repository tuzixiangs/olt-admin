import type { AnyRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type GroupKey = "ui" | "pages";

// 保留现有的 RouteMeta 接口，用于 UI 组件
export interface RouteMeta {
	/**
	 * unique key
	 */
	key?: string;
	/**
	 * route path
	 */
	path?: string;
	/**
	 * menu title, i18n
	 */
	title: string;
	/**
	 * menu auth
	 */
	auth?: string | string[];
	/**
	 * menu prefix icon
	 */
	icon?: ReactNode;
	/**
	 * menu suffix icon
	 */
	info?: ReactNode;
	/**
	 * menu open
	 */
	open?: boolean;
	/**
	 * menu active
	 */
	active?: boolean;
	/**
	 * menu caption
	 */
	caption?: string;
	/**
	 * menu group name i18n
	 */
	groupName?: string;
	/**
	 * menu group key 根据groupKey进行分组，如果groupKey相同，则显示在同一个组中
	 */
	groupKey?: GroupKey;
	/**
	 * menu group order 根据groupOrder进行排序，数字越小，越靠前
	 * 默认值为 0
	 */
	groupOrder?: number;
	/**
	 * hide in menu
	 */
	hideMenu?: boolean;
	/**
	 * hide in multi tab
	 */
	hideTab?: boolean;
	/**
	 * disable in menu
	 */
	disabled?: boolean;
	/**
	 * react router outlet
	 */
	outlet?: ReactNode;
	/**
	 * use to refresh tab
	 */
	timeStamp?: string;
	/**
	 * external link and iframe need
	 */
	frameSrc?: URL;
	/**
	 * dynamic route params
	 *
	 * @example /user/:id
	 */
	params?: { [key: string]: string };
}

// 兼容性类型：保留现有的 AppRouteObject 用于现有组件
export type AppRouteObject = {
	/**
	 * 先判断 菜单分组是否开启，如果为 true, 则进行 groupKey 分组, 在根据order排序
	 * 为 false, 则直接根据order排序
	 * 默认值为 0
	 */
	order?: number;
	meta?: RouteMeta;
	children?: AppRouteObject[];
	path?: string;
	element?: ReactNode;
	index?: boolean;
	// 兼容现有路由定义中的Component属性
	Component?: React.ComponentType<any> | React.LazyExoticComponent<React.ComponentType<any>>;
};

// TanStack Router 兼容类型
export interface TanStackRouteMeta extends RouteMeta {
	/**
	 * TanStack Router specific properties
	 */
	routeId?: string;
	/**
	 * Parent route reference for TanStack Router
	 */
	parentRoute?: () => AnyRoute;
}

// TanStack Router 路由对象类型
export interface TanStackRouteConfig {
	/**
	 * Route path
	 */
	path?: string;
	/**
	 * Route ID for pathless routes
	 */
	id?: string;
	/**
	 * Parent route getter
	 */
	getParentRoute?: () => AnyRoute;
	/**
	 * Route component
	 */
	component?: () => ReactNode;
	/**
	 * Lazy component
	 */
	lazy?: () => Promise<{ component?: () => ReactNode }>;
	/**
	 * Route meta information for UI
	 */
	meta?: TanStackRouteMeta;
	/**
	 * Child routes
	 */
	children?: TanStackRouteConfig[];
	/**
	 * Order for UI sorting
	 */
	order?: number;
}

// 路由上下文类型
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type RouterContext = {};

// 工具类型：从 TanStack Router 配置生成 UI 路由数据
export type UIRouteData = {
	path?: string;
	meta?: RouteMeta;
	children?: UIRouteData[];
	order?: number;
};

// 路由转换工具类型
export interface RouteConverter {
	/**
	 * 将 TanStack 路由配置转换为 UI 路由数据
	 */
	toUIRouteData: (config: TanStackRouteConfig[]) => UIRouteData[];
	/**
	 * 从 TanStack Router 实例提取路由信息
	 */
	extractRoutesFromRouter: (router: any) => UIRouteData[];
}
