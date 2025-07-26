import { Icon } from "@/components/icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Dropdown, type MenuProps } from "antd";
import { Tooltip } from "antd";
import type { DragableItemProps } from "./types";

const SortableItem = ({ config, onToggleVisible, onDelete }: DragableItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: config.key,
		disabled: config.locked,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : undefined,
		opacity: isDragging ? 0.5 : 1,
	};

	// 更多操作菜单
	const menuItems: MenuProps["items"] = [
		{
			key: "move-top",
			label: "置顶",
			icon: <Icon icon="material-symbols:vertical-align-top" />,
			disabled: config.locked,
			onClick: () => {
				// 这个功能需要通过父组件实现，这里暂时留空
			},
		},
		{
			key: "move-bottom",
			label: "置底",
			icon: <Icon icon="material-symbols:vertical-align-bottom" />,
			disabled: config.locked,
			onClick: () => {
				// 这个功能需要通过父组件实现，这里暂时留空
			},
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

	// 阻止其他元素触发拖拽
	const handlePreventDrag = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`
        flex items-center rounded-lg p-2 pl-1 pr-1.5
        transition-all duration-200 mb-0 hover:bg-gray-200
        ${config.locked ? "bg-gray-50" : "bg-white"}
        ${!config.visible ? "opacity-60" : ""}
      `}
		>
			{/* 拖拽手柄 */}
			<div
				{...attributes}
				{...listeners}
				className={`
          flex items-center justify-center w-4 h-6 
          ${config.locked ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"}
        `}
			>
				<Icon icon="material-symbols:drag-indicator" className="text-lg" />
			</div>

			{/* 显示/隐藏复选框 */}
			<Checkbox
				checked={config.visible}
				disabled={config.locked}
				onChange={() => onToggleVisible(config.key)}
				className="flex-shrink-0"
				onClick={handlePreventDrag}
			/>

			{/* 字段信息 */}
			<div className="flex-1 min-w-0 ml-2" {...attributes} {...listeners}>
				<div className="flex items-center gap-2">
					<span
						className={`
              font-medium truncate
              ${!config.visible ? "text-gray-400 line-through" : "text-gray-900"}
              ${config.locked ? "cursor-default" : "cursor-grab"}
            `}
					>
						{config.title}
					</span>

					{/* 锁定图标 */}
					{config.locked && <Icon icon="material-symbols:lock" className="text-sm text-gray-400 flex-shrink-0" />}

					{/* 固定位置图标 */}
					{config.fixed && (
						<Tooltip title={`固定在${config.fixed === "left" ? "左侧" : "右侧"}`}>
							<Icon
								icon={
									config.fixed === "left" ? "material-symbols:format-align-left" : "material-symbols:format-align-right"
								}
								className="text-sm text-blue-500 flex-shrink-0"
							/>
						</Tooltip>
					)}
				</div>
			</div>

			{/* 更多操作 */}
			<Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
				<Button
					type="text"
					size="small"
					icon={<Icon icon="material-symbols:more-horiz" />}
					className="flex-shrink-0"
					onClick={handlePreventDrag}
				/>
			</Dropdown>
		</div>
	);
};

export default SortableItem;
