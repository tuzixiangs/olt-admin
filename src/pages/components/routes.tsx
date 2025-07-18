import { Icon } from "@/components/icon";
import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
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
				element: Component("/pages/components/animate"),
				meta: {
					key: "animate",
					title: t("sys.nav.animate"),
				},
			},
			{
				path: "/components/scroll",
				element: Component("/pages/components/scroll"),
				meta: {
					key: "scroll",
					title: t("sys.nav.scroll"),
				},
			},
			{
				path: "/components/multi-language",
				element: Component("/pages/components/multi-language"),
				meta: {
					key: "multi-language",
					title: t("sys.nav.i18n"),
				},
			},
			{
				path: "/components/icon",
				element: Component("/pages/components/icon"),
				meta: {
					key: "icon",
					title: t("sys.nav.icon"),
				},
			},
			{
				path: "/components/chart",
				element: Component("/pages/components/chart"),
				meta: {
					key: "chart",
					title: t("sys.nav.chart"),
				},
			},
			{
				path: "/components/toast",
				element: Component("/pages/components/toast"),
				meta: {
					key: "toast",
					title: t("sys.nav.toast"),
				},
			},
			{
				path: "/components/upload",
				element: Component("/pages/components/upload"),
				meta: {
					key: "upload",
					title: t("sys.nav.upload"),
				},
			},
		],
	},
];

export default componentsRoutes;
