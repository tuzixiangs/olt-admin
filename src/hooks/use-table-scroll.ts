import { useSize } from "ahooks";
import { debounce } from "lodash-es";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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

		const height = viewportHeight - nodeTop - paginationHeight - Number(paginationMarginTop.replace("px", "")) - 48;
		console.log("[ height ] >", height);
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

	return { scroll: { y: tableHeight, x: "max-content" }, tableContainerRef };
}

export function useTableScrollHeight() {
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const node = tableContainerRef.current?.querySelector(".ant-table-tbody") as HTMLElement;
	const nodeRect = node?.getBoundingClientRect() ?? { top: 0 };
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	const pagination = tableContainerRef.current?.querySelector(".ant-pagination") as HTMLElement;
	const { top: nodeTop } = nodeRect;
	const { height: paginationHeight } = pagination?.getBoundingClientRect() ?? {
		height: 0,
	};
	const antProTableSearch = tableContainerRef.current?.querySelector(".ant-pro-table-search") as HTMLElement;
	// const antProCardBody = tableContainerRef.current?.querySelector(".ant-pro-card-body") as HTMLElement;
	// console.log("[ antProCardBody ] >", antProCardBody);
	// if (antProCardBody) {
	// 	antProCardBody.style.height = `calc(100% - ${antProTableSearch?.offsetHeight + 16}px)`;
	// }

	useSize(antProTableSearch);
	const height = viewportHeight - nodeTop - paginationHeight - 48;

	return { scroll: { y: height, x: "max-content" }, tableContainerRef };
}
