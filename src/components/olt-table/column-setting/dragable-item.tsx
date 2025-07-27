import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import { Checkbox, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import type { ColumnConfig } from "./types";

interface DragableItemProps {
	config: ColumnConfig;
	onVisibilityChange: (key: string, visible: boolean) => void;
	onLockChange: (key: string, locked: boolean) => void;
	onDelete: (key: string) => void;
	onPinToStart?: (key: string) => void;
	onPinToEnd?: (key: string) => void;
}

const SortableItem = ({
	config,
	onVisibilityChange,
	// onLockChange,
	// onDelete,
	onPinToStart,
	onPinToEnd,
}: DragableItemProps) => {
	const { t } = useTranslation();
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
			key: "pin-start",
			label: t("table.pinToLeft"),
			icon: <Icon icon="material-symbols:vertical-align-top" />,
			onClick: () => onPinToStart?.(config.key),
			disabled: !onPinToStart,
		},
		{
			key: "pin-end",
			label: t("table.pinToRight"),
			icon: <Icon icon="material-symbols:vertical-align-bottom" />,
			onClick: () => onPinToEnd?.(config.key),
			disabled: !onPinToEnd,
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
        bg-white
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
				onChange={(e) => onVisibilityChange(config.key, e.target.checked)}
				className="flex-shrink-0"
				onClick={handlePreventDrag}
			/>

			{/* 字段信息 */}
			<div className="flex-1 min-w-0 ml-2" {...attributes} {...listeners}>
				<div className="flex items-center gap-2 cursor-grab">
					<span className="font-medium truncate">{config.title}</span>
				</div>
			</div>

			{/* 更多操作 */}
			<Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
				<div
					className="flex items-center justify-center w-6 h-6 cursor-pointer flex-shrink-0"
					onClick={handlePreventDrag}
				>
					<Icon icon="material-symbols:more-horiz" />
				</div>
			</Dropdown>
		</div>
	);
};

export default SortableItem;
