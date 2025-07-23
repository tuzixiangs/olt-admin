import { Icon } from "@/components/icon";
import { $t } from "@/locales/i18n";
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";

const dashboardRoutes: AppRouteObject[] = [
	{
		path: "workbench",
		Component: lazy(() => import("@/pages/dashboard/workbench")),
		handle: { key: "workbench", title: $t("sys.nav.workbench"), icon: <Icon icon="local:ic-workbench" size="24" /> },
	},
	{
		path: "analysis",
		Component: lazy(() => import("@/pages/dashboard/analysis")),
		handle: {
			key: "analysis",
			title: $t("sys.nav.analysis"),
			icon: <Icon icon="local:ic-analysis" size="24" />,
		},
	},
];

export default dashboardRoutes;
