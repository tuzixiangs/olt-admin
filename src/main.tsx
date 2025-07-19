import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";
import "@ant-design/v5-patch-for-react-19";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { worker } from "./_mock";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { GLOBAL_CONFIG } from "./global-config";
import { urlJoin } from "./utils";

// 导入自动生成的路由树
import { routeTree } from "./routeTree.gen";

await registerLocalIcons();
await worker.start({
	onUnhandledRequest: "bypass",
	serviceWorker: { url: urlJoin(GLOBAL_CONFIG.publicPath, "mockServiceWorker.js") },
});

if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

// 创建 QueryClient 实例
const queryClient = new QueryClient();

// 创建 TanStack Router 实例
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	// 在开发环境中启用更多调试功能
	...(process.env.NODE_ENV === "development" && {
		defaultPreloadStaleTime: 0,
	}),
});

// 注册路由器类型以获得类型安全
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
