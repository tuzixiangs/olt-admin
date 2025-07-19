import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

export function useRouter() {
	const navigate = useNavigate();

	const router = useMemo(
		() => ({
			back: () => window.history.back(),
			forward: () => window.history.forward(),
			reload: () => window.location.reload(),
			push: (href: string) => navigate({ to: href }),
			replace: (href: string) => navigate({ to: href, replace: true }),
		}),
		[navigate],
	);

	return router;
}
