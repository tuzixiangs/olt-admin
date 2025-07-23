import { GLOBAL_CONFIG } from "@/global-config";
import DashboardLayout from "@/layouts/dashboard";
import LoginAuthGuard from "@/routes/components/login-auth-guard";
import type { AppRouteObject } from "@/types/router";
import { Navigate } from "react-router";
import { backendDashboardRoutes } from "./backend";
import { frontendDashboardRoutes } from "./frontend";

const getRoutes = (): AppRouteObject[] => {
	if (GLOBAL_CONFIG.routerMode === "frontend") {
		return frontendDashboardRoutes;
	}
	return backendDashboardRoutes();
};

export const dashboardRoutes: AppRouteObject[] = [
	{
		element: (
			<LoginAuthGuard>
				<DashboardLayout />
			</LoginAuthGuard>
		),
		children: [{ index: true, element: <Navigate to={GLOBAL_CONFIG.defaultRoute} replace /> }, ...getRoutes()],
	},
];
