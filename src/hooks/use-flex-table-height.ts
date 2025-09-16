import { useSettings } from "@/store/settingStore";
import { useLayoutEffect, useRef } from "react";

/**
 * 自适应表格高度 Hook - 基于 CSS Flexbox
 * 使用纯 CSS 实现表格 tbody 自适应高度，性能更好，更稳定
 */
export function useFlexTableHeight() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { multiTab } = useSettings();

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 添加自适应表格容器类名
		container.classList.add("adaptive-table-container");

		// 检查是否启用了多标签页，用于高度计算
		if (multiTab) {
			document.body.classList.add("multi-tab-enabled");
		} else {
			document.body.classList.remove("multi-tab-enabled");
		}

		return () => {
			// 清理时移除类名
			container.classList.remove("adaptive-table-container");
		};
	}, [multiTab]);

	return { containerRef };
}

/**
 * 页面级别的高度管理 Hook
 * 确保页面容器占满可用高度
 */
export function usePageHeight() {
	const pageRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const updateHeight = () => {
			const page = pageRef.current;
			if (!page) return;

			// 计算页面可用高度
			const main = document.getElementById("olt-layout-main");
			const header = document.getElementById("olt-layout-header-wrapper");

			if (main && header) {
				const mainRect = main.getBoundingClientRect();
				// const headerHeight = header.offsetHeight;
				const viewportHeight = window.innerHeight;

				// 设置页面高度为视口高度减去导航栏等固定元素高度
				const availableHeight = viewportHeight - mainRect.top;
				page.style.height = `${availableHeight}px`;
			}
		};

		// 初始设置
		updateHeight();

		// 监听窗口大小变化
		window.addEventListener("resize", updateHeight);

		return () => {
			window.removeEventListener("resize", updateHeight);
		};
	}, []);

	return { pageRef };
}
