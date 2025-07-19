import { AuthGuard } from "@/components/auth/auth-guard";
import { LineLoading } from "@/components/loading";
import Page403 from "@/pages/sys/error/Page403";
import { useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import type { AppRouteObject } from "@/types/router";
import { cn } from "@/utils";
import { flattenTrees } from "@/utils/tree";
import { Outlet, useLocation } from "@tanstack/react-router";
import { clone, concat } from "ramda";
import { type ReactNode, Suspense } from "react";
import BreadCrumb from "../components/bread-crumb";

// 基础路由数据 - 为文件路径路由系统提供静态数据
const staticRoutes: AppRouteObject[] = [
	{
		path: "/workbench",
		meta: {
			key: "workbench",
			title: "sys.nav.workbench",
			auth: ["workbench:read"],
		},
	},
	{
		path: "/analysis",
		meta: {
			key: "analysis",
			title: "sys.nav.analysis",
			auth: ["analysis:read"],
		},
	},
];

function getRoutes(): AppRouteObject[] {
	// 在文件路径路由系统中，使用静态数据
	return clone(staticRoutes);
}

const navData = getRoutes();
const allItems = navData.reduce((acc: any[], group) => {
	const flattenedItems = flattenTrees(group.children || []);
	return concat(acc, flattenedItems);
}, []);

// 根据路径查找权限要求
const findAuthByPath = (pathname: string) => {
	const item = allItems.find((item: any) => pathname.startsWith(item.path || ""));
	return item?.meta?.auth || [];
};

interface MainProps {
	children?: ReactNode;
}

const Main = ({ children }: MainProps) => {
	const { themeStretch, breadCrumb, themeLayout } = useSettings();

	const { pathname } = useLocation();
	const currentNavAuth = findAuthByPath(pathname);

	return (
		<AuthGuard checkAny={currentNavAuth} fallback={<Page403 />}>
			<main
				data-slot="olt-layout-main"
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

				<Suspense fallback={<LineLoading />}>{children || <Outlet />}</Suspense>
			</main>
		</AuthGuard>
	);
};

export default Main;
