import { useMemo } from "react";
import { type NavigateOptions, useNavigate } from "react-router";

export function useRouter() {
	const navigate = useNavigate();

	const router = useMemo(
		() => ({
			back: () => navigate(-1),
			forward: () => navigate(1),
			reload: () => window.location.reload(),
			push: (href: string, options?: NavigateOptions) => navigate(href, options),
			replace: (href: string, options?: NavigateOptions) => navigate(href, { replace: true, ...options }),
		}),
		[navigate],
	);

	return router;
}
