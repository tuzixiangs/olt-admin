import { $t } from "@/locales/i18n";
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";

export const uiRoutes: AppRouteObject[] = [
	{
		path: "customUi",
		Component: lazy(() => import("@/pages/example/curd/ui")),
		handle: { key: "customUi", title: $t("UI 测试") },
	},
];
