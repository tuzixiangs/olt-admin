import { LineLoading } from "@/components/loading";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Page403 = lazy(() => import("@/pages/sys/error/Page403"));

export const Route = createFileRoute("/403")({
	component: () => (
		<Suspense fallback={<LineLoading />}>
			<Page403 />
		</Suspense>
	),
});
