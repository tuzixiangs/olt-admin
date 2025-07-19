import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useWindowScroll } from "react-use";

/**
 * 自定义 Hook，用于在路由切换时保存和恢复滚动位置。
 * @param scrollContainerRef 可选，要管理滚动条的容器的引用。如果未提供，则默认为 window。
 */
export const useScrollRestoration = (scrollContainerRef?: React.RefObject<HTMLElement>) => {
	const location = useLocation();
	// 使用 useRef 避免在 useEffect 依赖中因对象引用变化而频繁触发
	const lastScrollPositions = useRef<Map<string, number>>(new Map());
	const { y: windowScrollY } = useWindowScroll();

	useEffect(() => {
		console.log("[ location ] >", location);
		const container = scrollContainerRef?.current || window;

		// 1. 在路由变化（卸载旧组件，挂载新组件前）时保存当前滚动位置
		const saveScrollPosition = () => {
			const position = container === window ? windowScrollY : (container as HTMLElement).scrollTop;
			lastScrollPositions.current.set(location.pathname, position);
			sessionStorage.setItem("scrollPositions", JSON.stringify(Array.from(lastScrollPositions.current.entries())));
			console.log(`[Scroll] Saved scroll for ${location.pathname}: ${position}`);
		};

		return () => {
			saveScrollPosition();
		};
	}, [location.pathname, scrollContainerRef, windowScrollY, location]); // 依赖 location.pathname 变化

	useEffect(() => {
		const container = scrollContainerRef?.current || window;
		const currentPath = location.pathname;

		// 1. 尝试从 sessionStorage 加载所有保存的位置
		const storedPositions = sessionStorage.getItem("scrollPositions");
		if (storedPositions) {
			lastScrollPositions.current = new Map(JSON.parse(storedPositions));
		}

		// 2. 恢复当前路径的滚动位置
		const savedPosition = lastScrollPositions.current.get(currentPath);
		if (typeof savedPosition === "number") {
			// 使用 requestAnimationFrame 确保 DOM 已经渲染完毕
			requestAnimationFrame(() => {
				if (container === window) {
					window.scrollTo(0, savedPosition);
				} else {
					(container as HTMLElement).scrollTop = savedPosition;
				}
				console.log(`[Scroll] Restored scroll for ${currentPath}: ${savedPosition}`);
			});
		} else {
			// 如果没有保存的位置，滚动到顶部
			requestAnimationFrame(() => {
				if (container === window) {
					window.scrollTo(0, 0);
				} else {
					(container as HTMLElement).scrollTop = 0;
				}
				console.log(`[Scroll] Scrolled to top for new path: ${currentPath}`);
			});
		}
	}, [location.pathname, scrollContainerRef]); // 依赖 location.pathname 变化
};
