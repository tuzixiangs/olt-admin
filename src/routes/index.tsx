import { GLOBAL_CONFIG } from "@/global-config";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		// 重定向到默认路由
		throw redirect({ to: GLOBAL_CONFIG.defaultRoute });
	},
});
