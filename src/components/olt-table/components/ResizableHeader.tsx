import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableTitleProps extends React.HTMLAttributes<HTMLTableCellElement> {
	onColumnResize: (width: number) => void;
	width: number;
	columnIndex: number;
}

const ResizableHeader: React.FC<ResizableTitleProps> = (props) => {
	const { onColumnResize, width, columnIndex, ...restProps } = props;
	const [isResizing, setIsResizing] = useState(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(0);
	const thRef = useRef<HTMLTableCellElement>(null);
	const isResizingRef = useRef(false);

	if (!width) {
		return <th {...restProps} ref={thRef} />;
	}

	// 使用useEffect来管理全局事件监听器
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizingRef.current) return;

			// 更新辅助线位置
			const guideLine = document.getElementById("column-resize-guide-line");
			if (guideLine) {
				guideLine.style.left = `${e.clientX}px`;
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!isResizingRef.current) return;

			const deltaX = e.clientX - startXRef.current;
			const newWidth = Math.max(50, startWidthRef.current + deltaX);

			onColumnResize(newWidth);
			setIsResizing(false);
			isResizingRef.current = false;

			// 恢复默认样式
			document.body.style.userSelect = "";
			document.body.style.cursor = "";

			// 移除辅助线
			const guideLine = document.getElementById("column-resize-guide-line");
			if (guideLine) {
				document.body.removeChild(guideLine);
			}

			// 移除事件监听器
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		if (isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			// 清理函数
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isResizing, onColumnResize]);

	// 简化的开始拖拽函数
	const startResize = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			// 清理任何现有的辅助线
			const existingGuideLine = document.getElementById("column-resize-guide-line");
			if (existingGuideLine) {
				document.body.removeChild(existingGuideLine);
			}

			setIsResizing(true);
			isResizingRef.current = true;
			startXRef.current = e.clientX;
			startWidthRef.current = width;

			// 禁用文本选择
			document.body.style.userSelect = "none";
			document.body.style.cursor = "col-resize";

			// 创建拖拽辅助线
			const guideLine = document.createElement("div");
			guideLine.id = "column-resize-guide-line";

			// 获取表格容器的位置和高度
			const tableElement = thRef.current?.closest(".ant-table-container");
			const tableRect = tableElement?.getBoundingClientRect();

			const guideTop = tableRect?.top || 0;
			const guideHeight = tableRect?.height || 300;

			guideLine.style.cssText = `
				position: fixed;
				left: ${e.clientX}px;
				top: ${guideTop}px;
				height: ${guideHeight}px;
				width: 2px;
				background-color: #1890ff;
				z-index: 9999;
				pointer-events: none;
				box-shadow: 0 0 4px rgba(24, 144, 255, 0.5);
			`;
			document.body.appendChild(guideLine);
		},
		[width],
	);

	return (
		<th {...restProps} ref={thRef} style={{ ...restProps.style, position: "relative" }}>
			{restProps.children}
			<div
				className="column-resize-handle"
				onMouseDown={startResize}
				style={{
					position: "absolute",
					right: "0px",
					top: "0",
					height: "100%",
					width: "8px",
					cursor: "col-resize",
					zIndex: 10,
					backgroundColor: "transparent",
					borderRight: isResizing ? "2px solid #1890ff" : "1px solid transparent",
				}}
				onClick={(e) => e.stopPropagation()}
			/>
		</th>
	);
};

export default ResizableHeader;
