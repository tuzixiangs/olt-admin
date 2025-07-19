import App from "@/App";
import DashboardLayout from "@/layouts/dashboard";
import SimpleLayout from "@/layouts/simple";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import ErrorBoundary from "./components/error-boundary";

// 定义路由器上下文类型
interface RouterContext {
	queryClient: QueryClient;
}

// 需要dashboard布局的路径
const DASHBOARD_PATHS = ["/workbench", "/analysis", "/management", "/components", "/functions"];
// 需要简单布局的路径
const SIMPLE_PATHS = ["/auth", "/403", "/404", "/500"];

// 创建根路由 - 用于文件路径路由
export const Route = createRootRoute({
	component: RootComponent,
	errorComponent: ErrorBoundary,
});

function RootComponent() {
	const location = useLocation();
	const { pathname } = location;

	// 根据路径决定使用哪种布局
	const shouldUseDashboardLayout = DASHBOARD_PATHS.some((path) => pathname.startsWith(path));
	const shouldUseSimpleLayout = SIMPLE_PATHS.some((path) => pathname.startsWith(path));

	return (
		<App>
			{shouldUseDashboardLayout ? (
				<DashboardLayout>
					<Outlet />
				</DashboardLayout>
			) : shouldUseSimpleLayout ? (
				<SimpleLayout>
					<Outlet />
				</SimpleLayout>
			) : (
				<Outlet />
			)}
			{/* 开发环境下显示路由调试工具 */}
			{process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
		</App>
	);
}

// 导出上下文类型供其他地方使用
export type { RouterContext };
