import { useTableScroll } from "@/hooks/use-table-scroll";
import { type ParamsType, ProTable, type ProTableProps } from "@ant-design/pro-components";
// import { useSize } from "ahooks";
import { useRef } from "react";

interface OltTableProps<T = any, Params = Record<string, any>> extends ProTableProps<T, Params> {
	/**
	 * 是否启用自动高度
	 * @default false
	 */
	autoHeight?: boolean;
	/**
	 * 是否启用斑马线
	 * @default false
	 */
	stripe?: boolean;
	/**
	 * 是否启用行点击样式
	 * @default false
	 */
	rowClickable?: boolean;
}

const OltTable = <T extends Record<string, any> = any, Params extends ParamsType = Record<string, any>>({
	autoHeight = false,
	stripe = false,
	rowClickable = false,
	...tableProps
}: OltTableProps<T, Params>) => {
	const { scroll, tableContainerRef } = useTableScroll();
	const staticRef = useRef<HTMLDivElement>(null);

	// 根据 autoHeight 决定使用哪个 ref 和 scroll
	const containerRef = autoHeight ? tableContainerRef : staticRef;
	const scrollConfig = autoHeight ? scroll : undefined;

	// const tableContainerRef = useRef<HTMLDivElement>(null);

	// const size = useSize(tableContainerRef);
	// const height = (size?.height || 500) - 120;
	// console.log("[ height ] >", height);
	// style={{ height: "calc(100vh - 220px)", overflow: "hidden" }}

	return (
		<div ref={containerRef} className="page-container">
			<ProTable<T, Params>
				{...tableProps}
				scroll={scrollConfig || tableProps.scroll}
				// scroll={{ x: "max-content", y: height }}
				rowClassName={`${stripe ? "olt-table-stripe" : ""} ${rowClickable ? "olt-table-row-clickable" : ""} ${
					tableProps.rowClassName || ""
				}`}
			/>
		</div>
	);
};

export default OltTable;
export type { OltTableProps };
