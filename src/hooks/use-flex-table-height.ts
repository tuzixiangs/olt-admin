import { useSettings } from "@/store/settingStore";
import { useLayoutEffect, useRef } from "react";

/**
 * 自适应表格高度 Hook - 基于 CSS Flexbox
 * 使用纯 CSS 实现表格 tbody 自适应高度，性能更好，更稳定
 * 同时处理 flex 布局下的固定列阴影问题
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

		// 固定列阴影处理
		const scrollContainer = container.querySelector(".ant-table-container") as HTMLElement;
		const tableElement = container.querySelector(".ant-table") as HTMLElement;

		if (scrollContainer && tableElement) {
			// 检查滚动状态并更新 ping 类名
			const updatePingClasses = () => {
				const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

				// 移除现有的 ping 类名
				tableElement.classList.remove("ant-table-ping-left", "ant-table-ping-right");

				// 判断是否可以向左滚动（内容已经向右滚动了）
				const canScrollLeft = scrollLeft > 0;
				// 判断是否可以向右滚动（内容还可以继续向左滚动）
				const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1; // -1 为了处理浮点数精度问题

				// 添加相应的 ping 类名
				if (canScrollLeft) {
					tableElement.classList.add("ant-table-ping-left");
				}
				if (canScrollRight) {
					tableElement.classList.add("ant-table-ping-right");
				}
			};

			// 初始检查
			updatePingClasses();

			// 监听滚动事件
			scrollContainer.addEventListener("scroll", updatePingClasses, { passive: true });

			// 监听容器大小变化（可能影响滚动状态）
			const resizeObserver = new ResizeObserver(updatePingClasses);
			resizeObserver.observe(scrollContainer);
			resizeObserver.observe(tableElement);

			// 清理函数中包含滚动监听器的清理
			return () => {
				// 清理时移除类名
				container.classList.remove("adaptive-table-container");
				// 清理滚动监听
				scrollContainer.removeEventListener("scroll", updatePingClasses);
				resizeObserver.disconnect();
			};
		}

		// 如果没有找到表格元素，只做基本的清理
		return () => {
			container.classList.remove("adaptive-table-container");
		};
	}, [multiTab]);

	return { containerRef };
}
