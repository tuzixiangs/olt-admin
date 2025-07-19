import { LineLoading } from "@/components/loading";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Page404 = lazy(() => import("@/pages/sys/error/Page404"));

export const Route = createFileRoute("/404")({
	component: () => (
		<Suspense fallback={<LineLoading />}>
			<Page404 />
		</Suspense>
	),
});
