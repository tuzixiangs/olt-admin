import { useParams as _useParams } from "@tanstack/react-router";
import { useMemo } from "react";

export function useParams() {
	const params = _useParams({ strict: false });

	return useMemo(() => params, [params]);
}
