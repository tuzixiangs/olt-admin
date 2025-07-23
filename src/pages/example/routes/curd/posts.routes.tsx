import { $t } from "@/locales/i18n";
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";

export const postsRoutes: AppRouteObject[] = [
	{
		path: "posts",
		Component: lazy(() => import("@/pages/example/curd/posts/list")),
		handle: { key: "posts", title: $t("文章列表") },
	},
];
