import { $t } from "@/locales/i18n";
import type { AppRouteObject } from "@/types/router";
import { postsRoutes } from "./posts.routes";
import { uiRoutes } from "./ui.routes";

const curdRoutes: AppRouteObject[] = [
	{
		path: "curd",
		handle: {
			key: "curd",
			title: $t("curd示例"),
			groupKey: "pages",
		},
		children: [...postsRoutes, ...uiRoutes],
	},
];

export default curdRoutes;
