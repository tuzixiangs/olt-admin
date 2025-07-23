import { debounce } from "lodash-es";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
// import { useSize } from 'ahooks';

// const containerRef = useRef<HTMLDivElement>(null);
// const size = useSize(containerRef);
// const height = (size?.height || 500) - 120;

export function useTableScroll() {
	const [tableHeight, setTableHeight] = useState(600);
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const calculateTableHeight = useCallback(() => {
		const node = tableContainerRef.current?.querySelector(".ant-table-tbody") as HTMLElement;
		const nodeRect = node?.getBoundingClientRect() ?? { top: 0 };
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		const pagination = tableContainerRef.current?.querySelector(".ant-pagination") as HTMLElement;
		const { top: nodeTop } = nodeRect;
		const { height: paginationHeight } = pagination?.getBoundingClientRect() ?? {
			height: 0,
		};
		const { marginTop: paginationMarginTop } = pagination
			? (getComputedStyle(pagination) as CSSStyleDeclaration)
			: { marginTop: "0px" };

		const height = viewportHeight - nodeTop - paginationHeight - Number(paginationMarginTop.replace("px", "")) - 40;
		// console.log("[ height ] >", height);
		setTableHeight(height);
	}, []);

	useLayoutEffect(() => {
		if (!tableContainerRef.current) return;

		const debouncedCalculate = debounce(calculateTableHeight, 100);

		// 初次加载时计算一次
		debouncedCalculate();

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === tableContainerRef.current) {
					debouncedCalculate();
				}
			}
		});

		resizeObserver.observe(tableContainerRef.current);

		// 清理函数：组件卸载时停止观察
		return () => {
			resizeObserver.disconnect();
			debouncedCalculate.cancel();
		};
	}, [calculateTableHeight]);

	return { scroll: { y: tableHeight }, tableContainerRef };
}
