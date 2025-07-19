import type { AppRouteObject } from "@/types/router";
import { convertToAppRouteObject, extractRoutesFromRouter } from "@/utils/route-converter";
import { useRouter } from "@tanstack/react-router";
import { useMemo } from "react";

/**
 * 从 TanStack Router 中提取导航数据，转换为现有组件可以使用的格式
 */
export function useTanStackNavData(): AppRouteObject[] {
	const router = useRouter();

	const navData = useMemo(() => {
		const uiRoutes = extractRoutesFromRouter(router);
		return convertToAppRouteObject(uiRoutes);
	}, [router]);

	return navData;
}

/**
 * 兼容性hook，可以逐步替换现有的useFilteredNavData
 */
export function useFilteredNavData(): AppRouteObject[] {
	return useTanStackNavData();
}
