import { Icon } from "@/components/icon";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { lazy } from "react";

const dashboardRoutes: AppRouteObject[] = [
	{
		path: "/workbench",
		Component: lazy(() => import("@/pages/dashboard/workbench")),
		meta: { key: "workbench", title: t("sys.nav.workbench"), icon: <Icon icon="local:ic-workbench" size="24" /> },
	},
	{
		path: "/analysis",
		Component: lazy(() => import("@/pages/dashboard/analysis")),
		meta: {
			key: "analysis",
			title: t("sys.nav.analysis"),
			icon: <Icon icon="local:ic-analysis" size="24" />,
		},
	},
];

export default dashboardRoutes;
