import type { AppRouteObject, RouteConverter, TanStackRouteConfig, UIRouteData } from "@/types/router";

/**
 * 将 TanStack 路由配置转换为 UI 路由数据
 */
export const convertToUIRouteData = (configs: TanStackRouteConfig[]): UIRouteData[] => {
	return configs
		.map((config) => ({
			path: config.path,
			meta: config.meta,
			children: config.children ? convertToUIRouteData(config.children) : undefined,
			order: config.order,
		}))
		.filter((route) => route.path !== undefined);
};

/**
 * 将现有的 AppRouteObject 转换为 TanStack 路由配置
 */
export const convertFromAppRouteObject = (routes: AppRouteObject[]): TanStackRouteConfig[] => {
	return routes.map((route) => ({
		path: route.path,
		meta: route.meta,
		children: route.children ? convertFromAppRouteObject(route.children) : undefined,
		order: route.order,
	}));
};

/**
 * 从 TanStack Router 实例提取路由信息用于 UI 组件
 * 注意：由于 TanStack Router 的路由结构复杂，这里提供一个基础实现
 */
export const extractRoutesFromRouter = (router: any): UIRouteData[] => {
	if (!router || !router.routeTree) {
		return [];
	}

	// 基础实现：返回静态路由数据
	// 在实际项目中，可以根据需要从路由树中提取更多信息
	const staticRoutes: UIRouteData[] = [
		{
			path: "/workbench",
			meta: {
				key: "workbench",
				title: "sys.nav.workbench",
			},
		},
		{
			path: "/analysis",
			meta: {
				key: "analysis",
				title: "sys.nav.analysis",
			},
		},
	];

	return staticRoutes;
};

/**
 * 路由转换器实现
 */
export const routeConverter: RouteConverter = {
	toUIRouteData: convertToUIRouteData,
	extractRoutesFromRouter: extractRoutesFromRouter,
};

/**
 * 为了兼容性，提供一个函数将 TanStack 路由数据转换为现有的 AppRouteObject 格式
 */
export const convertToAppRouteObject = (uiRoutes: UIRouteData[]): AppRouteObject[] => {
	return uiRoutes.map((route) => ({
		path: route.path,
		meta: route.meta,
		children: route.children ? convertToAppRouteObject(route.children) : undefined,
		order: route.order,
	}));
};

/**
 * 扁平化路由树，用于搜索和面包屑功能
 */
export const flattenRoutes = (routes: UIRouteData[]): UIRouteData[] => {
	const result: UIRouteData[] = [];

	const flatten = (routeList: UIRouteData[]) => {
		for (const route of routeList) {
			if (route.path && route.meta && !route.meta.hideMenu) {
				result.push({
					path: route.path,
					meta: route.meta,
					order: route.order,
				});
			}

			if (route.children) {
				flatten(route.children);
			}
		}
	};

	flatten(routes);
	return result;
};
