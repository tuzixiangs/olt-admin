import { LineLoading } from "@/components/loading";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Page500 = lazy(() => import("@/pages/sys/error/Page500"));

export const Route = createFileRoute("/500")({
	component: () => (
		<Suspense fallback={<LineLoading />}>
			<Page500 />
		</Suspense>
	),
});
