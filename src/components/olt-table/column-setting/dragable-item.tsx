import { Icon } from "@/components/icon";
import { Button, Checkbox, Dropdown, type MenuProps } from "antd";
import { type DragEvent, useRef } from "react";
import type { DragableItemProps } from "./types";

const DragableItem = ({ config, index, onMove, onToggleVisible, onDelete }: DragableItemProps) => {
	const itemRef = useRef<HTMLDivElement>(null);
	const dragItemRef = useRef<number | null>(null);

	// 拖拽开始
	const handleDragStart = (e: DragEvent) => {
		if (config.locked) {
			e.preventDefault();
			return;
		}
		dragItemRef.current = index;
		e.dataTransfer.effectAllowed = "move";
	};

	// 拖拽进入
	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		if (config.locked) return;

		const item = itemRef.current;
		if (item) {
			item.classList.add("drag-over");
		}
	};

	// 拖拽离开
	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		const item = itemRef.current;
		if (item) {
			item.classList.remove("drag-over");
		}
	};

	// 拖拽经过
	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = config.locked ? "none" : "move";
	};

	// 放置
	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		const item = itemRef.current;
		if (item) {
			item.classList.remove("drag-over");
		}

		if (config.locked || dragItemRef.current === null) return;

		const dragIndex = dragItemRef.current;
		const hoverIndex = index;

		if (dragIndex !== hoverIndex) {
			onMove(dragIndex, hoverIndex);
		}
		dragItemRef.current = null;
	};

	// 更多操作菜单
	const menuItems: MenuProps["items"] = [
		{
			key: "move-top",
			label: "置顶",
			icon: <Icon icon="material-symbols:vertical-align-top" />,
			disabled: config.locked || index === 0,
			onClick: () => onMove(index, 0),
		},
		{
			key: "move-bottom",
			label: "置底",
			icon: <Icon icon="material-symbols:vertical-align-bottom" />,
			disabled: config.locked,
			onClick: () => onMove(index, 999),
		},
		{
			type: "divider",
		},
		{
			key: "delete",
			label: "删除字段",
			icon: <Icon icon="material-symbols:delete-outline" />,
			danger: true,
			disabled: config.locked,
			onClick: () => onDelete?.(config.key),
		},
	];

	return (
		<div
			ref={itemRef}
			className={`
        flex items-center gap-3 p-3 border border-gray-200 rounded-lg 
        transition-all duration-200 hover:shadow-sm
        ${config.locked ? "bg-gray-50" : "bg-white cursor-move"}
        ${!config.visible ? "opacity-60" : ""}
      `}
			draggable={!config.locked}
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{/* 拖拽手柄 */}
			<div
				className={`
          flex items-center justify-center w-6 h-6 
          ${config.locked ? "text-gray-300" : "text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"}
        `}
			>
				<Icon icon="material-symbols:drag-indicator" className="text-lg" />
			</div>

			{/* 显示/隐藏复选框 */}
			<Checkbox
				checked={config.visible}
				disabled={config.locked}
				onChange={(e) => onToggleVisible(config.key)}
				className="flex-shrink-0"
			/>

			{/* 字段信息 */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span
						className={`
              font-medium truncate
              ${!config.visible ? "text-gray-400 line-through" : "text-gray-900"}
            `}
					>
						{config.title}
					</span>

					{/* 锁定图标 */}
					{config.locked && <Icon icon="material-symbols:lock" className="text-sm text-gray-400 flex-shrink-0" />}

					{/* 固定位置图标 */}
					{config.fixed && (
						<Icon
							icon={
								config.fixed === "left" ? "material-symbols:format-align-left" : "material-symbols:format-align-right"
							}
							className="text-sm text-blue-500 flex-shrink-0"
							title={`固定在${config.fixed === "left" ? "左侧" : "右侧"}`}
						/>
					)}
				</div>

				<div className="text-xs text-gray-500 truncate mt-1">
					{config.dataIndex} {config.width && `• 宽度: ${config.width}px`}
				</div>
			</div>

			{/* 更多操作 */}
			<Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
				<Button type="text" size="small" icon={<Icon icon="material-symbols:more-vert" />} className="flex-shrink-0" />
			</Dropdown>
		</div>
	);
};

export default DragableItem;
