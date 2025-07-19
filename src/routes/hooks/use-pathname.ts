import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

export function usePathname() {
	const { pathname } = useLocation();

	return useMemo(() => pathname, [pathname]);
}
