import { Icon } from "@/components/icon";
import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { Navigate } from "react-router";

const menuLevelRoutes: AppRouteObject[] = [
	{
		path: "/menu_level",
		order: 1,
		meta: {
			key: "menu_level",
			title: t("sys.nav.menulevel.index"),
			icon: <Icon icon="local:ic-menulevel" size="24" />,
			groupKey: "pages",
		},
		children: [
			{ index: true, element: <Navigate to="/menu_level/1a" replace /> },
			{
				path: "/menu_level/1a",
				element: Component("/pages/menu-level/menu-level-1a"),
				meta: {
					key: "1a",
					title: t("sys.nav.menulevel.1a"),
				},
			},
			{
				path: "/menu_level/1b",
				meta: {
					key: "1b",
					title: t("sys.nav.menulevel.1b.index"),
				},
				children: [
					{ index: true, element: <Navigate to="/menu_level/1b/2a" replace /> },
					{
						path: "/menu_level/1b/2a",
						element: Component("/pages/menu-level/menu-level-1b/menu-level-2a"),
						meta: {
							key: "2a",
							title: t("sys.nav.menulevel.1b.2a"),
						},
					},
					{
						path: "/menu_level/1b/2b",
						meta: {
							key: "2b",
							title: t("sys.nav.menulevel.1b.2b.index"),
						},
						children: [
							{ index: true, element: <Navigate to="/menu_level/1b/2b/3a" replace /> },
							{
								path: "/menu_level/1b/2b/3a",
								element: Component("/pages/menu-level/menu-level-1b/menu-level-2b/menu-level-3a"),
								meta: {
									key: "3a",
									title: t("sys.nav.menulevel.1b.2b.3a"),
								},
							},
							{
								path: "/menu_level/1b/2b/3b",
								element: Component("/pages/menu-level/menu-level-1b/menu-level-2b/menu-level-3b"),
								meta: {
									key: "3b",
									title: t("sys.nav.menulevel.1b.2b.3b"),
								},
							},
						],
					},
				],
			},
		],
	},
];

export default menuLevelRoutes;
