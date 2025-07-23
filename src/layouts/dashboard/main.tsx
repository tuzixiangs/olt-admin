import { AuthGuard } from "@/components/auth/auth-guard";
import { LineLoading } from "@/components/loading";
import { GLOBAL_CONFIG } from "@/global-config";
import Page403 from "@/pages/example/error/Page403";
import { backendDashboardRoutes } from "@/routes/sections/dashboard/backend";
import { frontendDashboardRoutes } from "@/routes/sections/dashboard/frontend";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import type { AppRouteObject } from "@/types/router";
import { cn } from "@/utils";
import { flattenTrees } from "@/utils/tree";
import { clone, concat } from "ramda";
import { Suspense } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import BreadCrumb from "../components/bread-crumb";

function getRoutes(): AppRouteObject[] {
	if (GLOBAL_CONFIG.routerMode === "frontend") {
		return clone(frontendDashboardRoutes);
	}
	return clone(backendDashboardRoutes());
}

/**
 * find auth by path
 * @param path
 * @returns
 */
function findAuthByPath(path: string): string[] {
	const foundItem = allItems.find((item) => item.path === path);
	return foundItem?.auth || [];
}

const navData = getRoutes();
const allItems = navData.reduce((acc: any[], group) => {
	const flattenedItems = flattenTrees(group.children || []);
	return concat(acc, flattenedItems);
}, []);

const Main = () => {
	const { themeStretch, breadCrumb, themeLayout } = useSettings();

	const { pathname } = useLocation();
	const currentNavAuth = findAuthByPath(pathname);

	return (
		<AuthGuard checkAny={currentNavAuth} fallback={<Page403 />}>
			<main
				data-slot="olt-layout-main"
				id="olt-layout-main"
				className={cn(
					"flex-auto w-full flex flex-col",
					"transition-[max-width] duration-300 ease-in-out",
					"px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto",
					{
						"max-w-full": themeStretch,
						"xl:max-w-screen-xl": !themeStretch,
					},
				)}
				style={{
					willChange: "max-width",
				}}
			>
				{breadCrumb && themeLayout === ThemeLayout.Horizontal && (
					<div className="mb-4">
						<BreadCrumb />
					</div>
				)}

				<Suspense fallback={<LineLoading />}>
					<Outlet />
					<ScrollRestoration />
				</Suspense>
			</main>
		</AuthGuard>
	);
};

export default Main;
