import type { AppRouteObject } from "@/types/router";

const modules = import.meta.glob<{ default: any }>("../../../pages/**/routes.tsx", { eager: true });
const pageRoutes = Object.values(modules).flatMap((mod) => mod.default || []);

export const frontendDashboardRoutes: AppRouteObject[] = [
	...pageRoutes,
	// {
	// 	path: "permission",
	// 	children: [
	// 		{ index: true, element: Component("/pages/sys/others/permission") },
	// 		{ path: "page-test", element: Component("/pages/sys/others/permission/page-test") },
	// 	],
	// },
	// { path: "calendar", element: Component("/pages/sys/others/calendar") },
	// { path: "kanban", element: Component("/pages/sys/others/kanban") },
	// { path: "blank", element: Component("/pages/sys/others/blank") },
];
