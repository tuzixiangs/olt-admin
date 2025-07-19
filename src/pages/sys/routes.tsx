import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { lazy } from "react";
import { Navigate } from "react-router";

const sysRoutes: AppRouteObject[] = [
	{
		path: "/error",
		meta: {
			title: t("sys.nav.error.index"),
		},
		children: [
			{ index: true, element: <Navigate to="/error/403" replace /> },
			{
				path: "/error/403",
				Component: lazy(() => import("@/pages/sys/error/Page403")),
				meta: { key: "403", title: t("sys.nav.error.403") },
			},
			{
				path: "/error/404",
				Component: lazy(() => import("@/pages/sys/error/Page404")),
				meta: { key: "404", title: t("sys.nav.error.404") },
			},
			{
				path: "/error/500",
				Component: lazy(() => import("@/pages/sys/error/Page500")),
				meta: { key: "500", title: t("sys.nav.error.500") },
			},
		],
	},
	{
		path: "/link",
		meta: {
			key: "link",
			title: t("sys.nav.link"),
		},
		children: [
			{ index: true, element: <Navigate to="iframe" replace /> },
			{
				path: "/link/iframe",
				element: Component("/pages/sys/others/link/iframe", { src: "https://ant.design/index-cn" }),
				meta: { key: "iframe", title: t("sys.nav.iframe") },
			},
			{
				path: "/link/external-link",
				element: Component("/pages/sys/others/link/external-link", { src: "https://ant.design/index-cn" }),
				meta: { key: "external-link", title: t("sys.nav.external_link") },
			},
		],
	},
];

export default sysRoutes;
