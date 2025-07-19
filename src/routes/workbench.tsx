import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const WorkbenchPage = lazy(() => import("@/pages/dashboard/workbench"));

export const Route = createFileRoute("/workbench")({
	component: WorkbenchPage,
});
