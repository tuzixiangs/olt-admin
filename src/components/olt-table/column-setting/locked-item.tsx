import { Icon } from "@iconify/react";
import { Checkbox } from "antd";
import type { ColumnConfig } from "./types";

interface LockedItemProps {
	config: ColumnConfig;
	onToggleVisible: (key: string) => void;
}

export const LockedItem: React.FC<LockedItemProps> = ({ config, onToggleVisible }) => {
	return (
		<div className="flex items-center rounded-lg gap-2 pl-5.5 pr-3 py-2 hover:bg-gray-200">
			{/* 显示/隐藏复选框 */}
			<Checkbox checked={config.visible} onChange={() => onToggleVisible(config.key)} className="flex-shrink-0" />

			{/* 字段信息 */}
			<div className="flex-1 min-w-0 flex items-center gap-1.5">
				<div className="truncate">{config.title}</div>
				{/* 拖拽手柄占位 */}
				<div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
					<Icon icon="ant-design:lock-outlined" className="text-xl" />
				</div>
			</div>
		</div>
	);
};
