import type { AppRouteObject } from "@/types/router";
import { Navigate } from "react-router";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { mainRoutes } from "./main";

export const routesSection: AppRouteObject[] = [
	// Auth
	...authRoutes,
	// Dashboard
	...dashboardRoutes,
	// Main
	...mainRoutes,
	// No Match
	{ path: "*", element: <Navigate to="/404" replace /> },
];
