import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";

/**
 * 自定义 Hook，用于在路由切换时保存和恢复滚动位置。
 */
export const useScrollRestoration = () => {
	const location = useLocation();
	const scrollHistoryMap = useRef<Map<string, number>>(new Map());
	const activeKey = useMemo(() => {
		return location.pathname + location.search;
	}, [location.pathname, location.search]);
	useEffect(() => {
		const scrollTop = scrollHistoryMap.current.get(activeKey) || 0;
		scrollTop && window.scrollTo(0, scrollTop);
		const onScroll = (e: Event) => {
			const target = e.target as HTMLDivElement;
			if (!target) return;
			scrollHistoryMap.current.set(activeKey, target?.scrollTop || window.scrollY || 0);
		};
		document?.addEventListener("scroll", onScroll, {
			passive: true,
		});
		return () => {
			document?.removeEventListener("scroll", onScroll);
		};
	}, [activeKey]);
};
