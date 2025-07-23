import type { AppRouteObject } from "@/types/router";

const modules = import.meta.glob<{ default: AppRouteObject[] }>("../../../pages/*/routes/index.tsx", { eager: true });
const pageRoutes = Object.values(modules).flatMap((mod) => mod.default || []);

export const frontendDashboardRoutes: AppRouteObject[] = [...pageRoutes];
