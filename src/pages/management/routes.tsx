import { Icon } from "@/components/icon";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { lazy } from "react";
import { Navigate } from "react-router";

const managementRoutes: AppRouteObject[] = [
	{
		path: "/management",
		order: 2,
		meta: {
			key: "management",
			title: t("sys.nav.pages"),
			icon: <Icon icon="local:ic-management" size="24" />,
			groupKey: "pages",
		},
		children: [
			{ index: true, element: <Navigate to="/management/user" replace /> },
			{
				path: "/management/user",
				meta: {
					key: "user",
					title: t("sys.nav.user.index"),
				},
				children: [
					{ index: true, element: <Navigate to="/management/user/profile" replace /> },
					{
						path: "/management/user/profile",
						Component: lazy(() => import("@/pages/management/user/profile")),
						meta: {
							key: "profile",
							title: t("sys.nav.user.profile"),
						},
					},
					{
						path: "/management/user/account",
						Component: lazy(() => import("@/pages/management/user/account")),
						meta: {
							key: "account",
							title: t("sys.nav.user.account"),
						},
					},
				],
			},
			{
				path: "/management/system",
				meta: {
					key: "system",
					title: t("sys.nav.system.index"),
				},
				children: [
					{ index: true, element: <Navigate to="/management/system/permission" replace /> },
					{
						path: "/management/system/permission",
						Component: lazy(() => import("@/pages/management/system/permission")),
						meta: {
							key: "permission",
							title: t("sys.nav.system.permission"),
						},
					},
					{
						path: "/management/system/role",
						Component: lazy(() => import("@/pages/management/system/role")),
						meta: {
							key: "role",
							title: t("sys.nav.system.role"),
						},
					},
					{
						path: "/management/system/user",
						Component: lazy(() => import("@/pages/management/system/user")),
						meta: {
							key: "user",
							title: t("sys.nav.system.user"),
						},
					},
				],
			},
		],
	},
];

export default managementRoutes;
