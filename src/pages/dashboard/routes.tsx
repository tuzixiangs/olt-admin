import { Icon } from "@/components/icon";
import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";

const dashboardRoutes: AppRouteObject[] = [
	{
		path: "/workbench",
		element: Component("/pages/dashboard/workbench"),
		meta: { key: "workbench", title: t("sys.nav.workbench"), icon: <Icon icon="local:ic-workbench" size="24" /> },
	},
	{
		path: "/analysis",
		element: Component("/pages/dashboard/analysis"),
		meta: {
			key: "analysis",
			title: t("sys.nav.analysis"),
			icon: <Icon icon="local:ic-analysis" size="24" />,
		},
	},
];

export default dashboardRoutes;
