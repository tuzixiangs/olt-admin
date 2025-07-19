import type { AppRouteObject } from "@/types/router";
// import { t } from "@/utils/i18n";
import { lazy } from "react";

export const refineProductRoutes: AppRouteObject[] = [
	{
		path: "/refine/products",
		Component: lazy(() => import("./list")),
		meta: { key: "products", title: "products列表" },
	},
	{
		path: "/refine/products/edit/:id",
		Component: lazy(() => import("./edit")),
		meta: { key: "productsEdit", title: "products编辑", hideMenu: true },
	},
];
