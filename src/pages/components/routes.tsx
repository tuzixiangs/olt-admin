import { Icon } from "@/components/icon";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { lazy } from "react";
import { Navigate } from "react-router";

const componentsRoutes: AppRouteObject[] = [
	{
		path: "/components",
		meta: {
			key: "components",
			title: t("sys.nav.ui"),
			icon: <Icon icon="solar:widget-5-bold-duotone" size="24" />,
			groupKey: "ui",
			caption: t("sys.nav.custom_ui_components"),
		},
		children: [
			{ index: true, element: <Navigate to="/components/animate" replace /> },
			{
				path: "/components/animate",
				Component: lazy(() => import("@/pages/components/animate")),
				meta: {
					key: "animate",
					title: t("sys.nav.animate"),
				},
			},
			{
				path: "/components/scroll",
				Component: lazy(() => import("@/pages/components/scroll")),
				meta: {
					key: "scroll",
					title: t("sys.nav.scroll"),
				},
			},
			{
				path: "/components/multi-language",
				Component: lazy(() => import("@/pages/components/multi-language")),
				meta: {
					key: "multi-language",
					title: t("sys.nav.i18n"),
				},
			},
			{
				path: "/components/icon",
				Component: lazy(() => import("@/pages/components/icon")),
				meta: {
					key: "icon",
					title: t("sys.nav.icon"),
				},
			},
			{
				path: "/components/chart",
				Component: lazy(() => import("@/pages/components/chart")),
				meta: {
					key: "chart",
					title: t("sys.nav.chart"),
				},
			},
			{
				path: "/components/toast",
				Component: lazy(() => import("@/pages/components/toast")),
				meta: {
					key: "toast",
					title: t("sys.nav.toast"),
				},
			},
			{
				path: "/components/upload",
				Component: lazy(() => import("@/pages/components/upload")),
				meta: {
					key: "upload",
					title: t("sys.nav.upload"),
				},
			},
		],
	},
];

export default componentsRoutes;
