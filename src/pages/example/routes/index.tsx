import { Icon } from "@/components/icon";
import { $t } from "@/locales/i18n";
import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";
import { Navigate } from "react-router";
import curdRoutes from "./curd";

const env = import.meta.env.MODE;

const exampleRoutes: AppRouteObject[] = [
	...curdRoutes,
	{
		path: "components",
		handle: {
			key: "components",
			title: $t("sys.nav.components"),
			icon: <Icon icon="solar:widget-5-bold-duotone" size="24" />,
			groupKey: "ui",
			caption: $t("sys.nav.custom_ui_components"),
		},
		children: [
			{ index: true, element: <Navigate to="/components/animate" replace /> },
			{
				path: "animate",
				Component: lazy(() => import("@/pages/example/animate")),
				handle: {
					key: "animate",
					title: $t("sys.nav.animate"),
				},
			},
			{
				path: "scroll",
				Component: lazy(() => import("@/pages/example/scroll")),
				handle: {
					key: "scroll",
					title: $t("sys.nav.scroll"),
				},
			},
			{
				path: "multi-language",
				Component: lazy(() => import("@/pages/example/multi-language")),
				handle: {
					key: "multi-language",
					title: $t("sys.nav.i18n"),
				},
			},
			{
				path: "icon",
				Component: lazy(() => import("@/pages/example/icon")),
				handle: {
					key: "icon",
					title: $t("sys.nav.icon"),
				},
			},
			{
				path: "chart",
				Component: lazy(() => import("@/pages/example/chart")),
				handle: {
					key: "chart",
					title: $t("sys.nav.chart"),
				},
			},
			{
				path: "toast",
				Component: lazy(() => import("@/pages/example/toast")),
				handle: {
					key: "toast",
					title: $t("sys.nav.toast"),
				},
			},
			{
				path: "upload",
				Component: lazy(() => import("@/pages/example/upload")),
				handle: {
					key: "upload",
					title: $t("sys.nav.upload"),
				},
			},
		],
	},
	{
		path: "functions",
		order: 11,
		handle: {
			key: "functions",
			title: $t("sys.nav.functions"),
			icon: <Icon icon="solar:plain-2-bold-duotone" size="24" />,
			groupKey: "ui",
		},
		children: [
			{ index: true, element: <Navigate to="/functions/clipboard" replace /> },
			{
				path: "clipboard",
				loader: async () => {
					return {
						message: $t("sys.nav.clipboard"),
					};
				},
				Component: lazy(() => import("@/pages/example/functions/clipboard")),
				handle: {
					key: "clipboard",
					title: $t("sys.nav.clipboard"),
				},
			},
			{
				path: "token_expired",
				Component: lazy(() => import("@/pages/example/functions/token-expired")),
				handle: {
					key: "token_expired",
					title: $t("sys.nav.token_expired"),
				},
			},
		],
	},
	{
		path: "menu_level",
		order: 1,
		handle: {
			key: "menu_level",
			title: $t("sys.nav.menulevel.index"),
			icon: <Icon icon="local:ic-menulevel" size="24" />,
			groupKey: "pages",
		},
		children: [
			{ index: true, element: <Navigate to="/menu_level/1a" replace /> },
			{
				path: "1a",
				Component: lazy(() => import("@/pages/example/menu-level/menu-level-1a")),
				handle: {
					key: "1a",
					title: $t("sys.nav.menulevel.1a"),
				},
			},
			{
				path: "1b",
				handle: {
					key: "1b",
					title: $t("sys.nav.menulevel.1b.index"),
				},
				children: [
					{ index: true, element: <Navigate to="/menu_level/1b/2a" replace /> },
					{
						path: "2a",
						Component: lazy(() => import("@/pages/example/menu-level/menu-level-1b/menu-level-2a")),
						handle: {
							key: "2a",
							title: $t("sys.nav.menulevel.1b.2a"),
						},
					},
					{
						path: "2b",
						handle: {
							key: "2b",
							title: $t("sys.nav.menulevel.1b.2b.index"),
						},
						children: [
							{ index: true, element: <Navigate to="/menu_level/1b/2b/3a" replace /> },
							{
								path: "3a",
								Component: lazy(() => import("@/pages/example/menu-level/menu-level-1b/menu-level-2b/menu-level-3a")),
								handle: {
									key: "3a",
									title: $t("sys.nav.menulevel.1b.2b.3a"),
								},
							},
							{
								path: "3b",
								Component: lazy(() => import("@/pages/example/menu-level/menu-level-1b/menu-level-2b/menu-level-3b")),
								handle: {
									key: "3b",
									title: $t("sys.nav.menulevel.1b.2b.3b"),
								},
							},
						],
					},
				],
			},
		],
	},
	{
		path: "error",
		handle: {
			key: "error",
			title: $t("sys.nav.error.index"),
			groupKey: "pages",
			icon: <Icon icon="solar:error-circle-bold-duotone" size="24" />,
		},
		children: [
			{
				index: true,
				element: <Navigate to="/error/403" replace />,
			},
			{
				path: "403",
				Component: lazy(() => import("@/pages/example/error/Page403")),
				handle: { key: "403", title: $t("sys.nav.error.403") },
			},
			{
				path: "404",
				Component: lazy(() => import("@/pages/example/error/Page404")),
				handle: { key: "404", title: $t("sys.nav.error.404") },
			},
			{
				path: "500",
				Component: lazy(() => import("@/pages/example/error/Page500")),
				handle: { key: "500", title: $t("sys.nav.error.500") },
			},
		],
	},
	{
		path: "link",
		handle: {
			key: "link",
			title: $t("sys.nav.link"),
			groupKey: "pages",
			icon: <Icon icon="solar:link-bold-duotone" size="24" />,
		},
		children: [
			{ index: true, element: <Navigate to="iframe" replace /> },
			{
				path: "iframe",
				element: Component("/pages/example/others/link/iframe", { src: "https://ant.design/index-cn" }),
				handle: { key: "iframe", title: $t("sys.nav.iframe") },
			},
			{
				path: "external-link",
				element: Component("/pages/example/others/link/external-link", {
					src: "https://ant.design/index-cn",
				}),
				handle: { key: "external-link", title: $t("sys.nav.external_link") },
			},
		],
	},
	{
		path: "permission",
		Component: lazy(() => import("@/pages/example/others/permission")),
		handle: {
			key: "permission",
			title: $t("sys.nav.permission"),
			groupKey: "pages",
		},
	},
];

export default env === "development" ? exampleRoutes : [];
