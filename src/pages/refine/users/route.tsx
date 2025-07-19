import type { AppRouteObject } from "@/types/router";
// import { t } from "@/utils/i18n";
import { lazy } from "react";

export const refineUserRoutes: AppRouteObject[] = [
	{
		path: "/refine/users",
		Component: lazy(() => import("./list")),
		meta: { key: "users", title: "用户列表" },
	},
	{
		path: "/refine/users/edit/:id",
		Component: lazy(() => import("./edit")),
		meta: { key: "usersEdit", title: "用户编辑", hideMenu: true },
	},
];
