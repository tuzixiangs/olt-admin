import type { ReactNode } from "react";
import type { Params, RouteObject } from "react-router";

export type GroupKey = "ui" | "pages";
export interface RouteMeta {
	/**
	 * unique key
	 */
	key?: string;
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
	params?: Params<string>;
}
export type AppRouteObject = {
	/**
	 * 先判断 菜单分组是否开启，如果为 true, 则进行 groupKey 分组, 在根据order排序
	 * 为 false, 则直接根据order排序
	 * 默认值为 0
	 */
	order?: number;
	meta?: RouteMeta;
	children?: AppRouteObject[];
} & Omit<RouteObject, "children">;
