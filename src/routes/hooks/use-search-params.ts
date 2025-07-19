import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

export function useSearchParams() {
	const search = useSearch({ from: "__root__" });

	return useMemo(() => {
		// 为了保持兼容性，返回一个类似 URLSearchParams 的对象
		return new URLSearchParams(search as any);
	}, [search]);
}
