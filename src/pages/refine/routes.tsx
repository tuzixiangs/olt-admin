import type { AppRouteObject } from "@/types/router";
// import { t } from "@/utils/i18n";
import { refineProductRoutes } from "./products/route";
import { refineUserRoutes } from "./users/route";

const refineRoutes: AppRouteObject[] = [
	{
		path: "/refine",
		meta: { key: "products", title: "refine页面" },
		children: [...refineProductRoutes, ...refineUserRoutes],
	},
];

export default refineRoutes;
