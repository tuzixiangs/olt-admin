import { Icon } from "@iconify/react";
import { Checkbox, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import type { ColumnConfig } from "./types";

interface FixedItemProps {
	config: ColumnConfig;
	onVisibilityChange: (key: string, visible: boolean) => void;
	onLockChange: (key: string, locked: boolean) => void;
	onDelete: (key: string) => void;
	onUnpin: (key: string) => void;
}

export const FixedItem: React.FC<FixedItemProps> = ({
	config,
	onVisibilityChange,
	// onLockChange,
	// onDelete,
	onUnpin,
}) => {
	const { t } = useTranslation();

	const menuItems: MenuProps["items"] = [
		{
			key: "unpin",
			label: t("table.unpin"),
			icon: <Icon icon="material-symbols:push-pin-outline" />,
			onClick: () => onUnpin(config.key),
		},
	];

	return (
		<div className="flex items-center rounded-lg gap-2 pl-5.5 pr-1.5 py-2 hover:bg-gray-200">
			{/* 显示/隐藏复选框 */}
			<Checkbox
				checked={config.visible}
				onChange={(e) => onVisibilityChange(config.key, e.target.checked)}
				className="flex-shrink-0"
			/>

			{/* 字段信息 */}
			<div className="flex-1 min-w-0 flex items-center gap-1.5">
				<div className="truncate">{config.title}</div>
				{/* 固定图标 */}
				<div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
					<Icon
						icon="material-symbols:push-pin"
						className={`text-xs ${config.fixed === "left" ? "text-blue-500" : "text-green-500"}`}
					/>
				</div>
			</div>

			{/* 更多操作 */}
			<div className="flex-shrink-0 transition-opacity">
				<Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
					<div className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer">
						<Icon icon="material-symbols:more-horiz" />
					</div>
				</Dropdown>
			</div>
		</div>
	);
};
