import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AnalysisPage = lazy(() => import("@/pages/dashboard/analysis"));

export const Route = createFileRoute("/analysis")({
	component: AnalysisPage,
});
