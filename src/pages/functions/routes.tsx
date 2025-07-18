import { Icon } from "@/components/icon";
import { Component } from "@/routes/sections/utils";
import type { AppRouteObject } from "@/types/router";
import { t } from "@/utils/i18n";
import { Navigate } from "react-router";

const functionsRoutes: AppRouteObject[] = [
	{
		path: "/functions",
		order: 11,
		meta: {
			key: "functions",
			title: t("sys.nav.functions"),
			icon: <Icon icon="solar:plain-2-bold-duotone" size="24" />,
			groupKey: "ui",
		},
		children: [
			{ index: true, element: <Navigate to="/functions/clipboard" replace /> },
			{
				path: "/functions/clipboard",
				element: Component("/pages/functions/clipboard"),
				meta: {
					key: "clipboard",
					title: t("sys.nav.clipboard"),
				},
			},
			{
				path: "/functions/token_expired",
				element: Component("/pages/functions/token-expired"),
				meta: {
					key: "token_expired",
					title: t("sys.nav.token_expired"),
				},
			},
		],
	},
];

export default functionsRoutes;
