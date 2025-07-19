import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const LoginPage = lazy(() => import("@/pages/sys/login"));

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
});
