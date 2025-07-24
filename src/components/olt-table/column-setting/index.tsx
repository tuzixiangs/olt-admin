import { Icon } from "@/components/icon";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Drawer, Empty, Input, Space, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddFieldDialog from "./add-field-dialog";
import DragableItem from "./dragable-item";
import type { AddFieldFormData, ColumnConfig, ColumnSettingProps } from "./types";

const ColumnSetting = ({
	visible,
	columns,
	onColumnsChange,
	onClose,
	defaultLockedColumns = [],
	enableStorage = false,
	storageKey = "olt-table-column-config",
}: ColumnSettingProps) => {
	const [configs, setConfigs] = useState<ColumnConfig[]>([]);
	const [searchText, setSearchText] = useState("");
	const [addFieldVisible, setAddFieldVisible] = useState(false);
	const [originalConfigs, setOriginalConfigs] = useState<ColumnConfig[]>([]);

	// 将 ProColumns 转换为 ColumnConfig
	const convertColumnsToConfigs = useCallback(
		(cols: ProColumns[]): ColumnConfig[] => {
			return cols.map((col, index) => ({
				key: col.key?.toString() || col.dataIndex?.toString() || `column-${index}`,
				title: col.title?.toString() || "未命名",
				dataIndex: col.dataIndex?.toString() || "",
				visible: !col.hideInTable,
				locked: defaultLockedColumns.includes(col.key?.toString() || col.dataIndex?.toString() || ""),
				sortIndex: index,
				width: col.width as number,
				fixed: col.fixed,
				originalColumn: col,
			}));
		},
		[defaultLockedColumns],
	);

	// 将 ColumnConfig 转换回 ProColumns
	const convertConfigsToColumns = useCallback((configs: ColumnConfig[]): ProColumns[] => {
		return configs
			.filter((config) => config.visible)
			.sort((a, b) => a.sortIndex - b.sortIndex)
			.map((config) => ({
				...config.originalColumn,
				key: config.key,
				title: config.title,
				dataIndex: config.dataIndex,
				width: config.width,
				fixed: config.fixed,
				hideInTable: false,
			}));
	}, []);

	// 从 localStorage 加载配置
	const loadStoredConfig = useCallback(() => {
		if (!enableStorage) return null;
		try {
			const stored = localStorage.getItem(storageKey);
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	}, [enableStorage, storageKey]);

	// 保存配置到 localStorage
	const saveConfigToStorage = useCallback(
		(configs: ColumnConfig[]) => {
			if (!enableStorage) return;
			try {
				localStorage.setItem(storageKey, JSON.stringify(configs));
			} catch (error) {
				console.error("保存列配置失败:", error);
			}
		},
		[enableStorage, storageKey],
	);

	// 初始化配置
	useEffect(() => {
		if (!visible || !columns.length) return;

		const newConfigs = convertColumnsToConfigs(columns);

		// 尝试从存储中恢复配置
		const storedConfigs = loadStoredConfig();
		if (storedConfigs && Array.isArray(storedConfigs)) {
			// 合并存储的配置和新的列配置
			const mergedConfigs = newConfigs.map((config) => {
				const stored = storedConfigs.find((s) => s.key === config.key);
				return stored ? { ...config, ...stored, originalColumn: config.originalColumn } : config;
			});
			setConfigs(mergedConfigs);
			setOriginalConfigs(newConfigs);
		} else {
			setConfigs(newConfigs);
			setOriginalConfigs(newConfigs);
		}
	}, [visible, columns, convertColumnsToConfigs, loadStoredConfig]);

	// 过滤后的配置
	const filteredConfigs = useMemo(() => {
		if (!searchText) return configs;
		return configs.filter(
			(config) =>
				config.title.toLowerCase().includes(searchText.toLowerCase()) ||
				config.dataIndex.toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [configs, searchText]);

	// 移动列
	const handleMove = useCallback((dragIndex: number, hoverIndex: number) => {
		setConfigs((prev) => {
			const newConfigs = [...prev];
			const dragConfig = newConfigs[dragIndex];
			const hoverConfig = newConfigs[hoverIndex];

			// 如果目标位置是锁定列，则不允许移动
			if (hoverConfig.locked) return prev;

			// 执行移动
			newConfigs.splice(dragIndex, 1);
			newConfigs.splice(hoverIndex, 0, dragConfig);

			// 重新计算 sortIndex
			const updatedConfigs = newConfigs.map((config, index) => ({
				...config,
				sortIndex: index,
			}));

			return updatedConfigs;
		});
	}, []);

	// 切换可见性
	const handleToggleVisible = useCallback((key: string) => {
		setConfigs((prev) => prev.map((config) => (config.key === key ? { ...config, visible: !config.visible } : config)));
	}, []);

	// 删除字段
	const handleDelete = useCallback((key: string) => {
		setConfigs((prev) => prev.filter((config) => config.key !== key));
		message.success("字段已删除");
	}, []);

	// 新增字段
	const handleAddField = useCallback(
		(data: AddFieldFormData) => {
			const newConfig: ColumnConfig = {
				key: data.key,
				title: data.title,
				dataIndex: data.dataIndex,
				visible: true,
				locked: false,
				sortIndex: configs.length,
				width: data.width,
				fixed: data.fixed,
				originalColumn: {
					key: data.key,
					title: data.title,
					dataIndex: data.dataIndex,
					width: data.width,
					fixed: data.fixed,
					render: (text) => text || "-", // 默认渲染函数
				},
			};

			setConfigs((prev) => [...prev, newConfig]);
			setAddFieldVisible(false);
			message.success("字段添加成功");
		},
		[configs.length],
	);

	// 重置配置
	const handleReset = useCallback(() => {
		setConfigs(originalConfigs);
		if (enableStorage) {
			localStorage.removeItem(storageKey);
		}
		message.success("配置已重置");
	}, [originalConfigs, enableStorage, storageKey]);

	// 应用配置
	const handleApply = useCallback(() => {
		const newColumns = convertConfigsToColumns(configs);
		onColumnsChange(newColumns);
		saveConfigToStorage(configs);
		message.success("列配置已应用");
		onClose();
	}, [configs, convertConfigsToColumns, onColumnsChange, saveConfigToStorage, onClose]);

	// 获取已存在的字段key列表
	const existingKeys = useMemo(() => configs.map((config) => config.key), [configs]);

	return (
		<>
			<Drawer
				title={
					<div className="flex items-center gap-2">
						<Icon icon="material-symbols:view-column" className="text-blue-500" />
						<span>字段配置</span>
					</div>
				}
				placement="right"
				width={480}
				open={visible}
				onClose={onClose}
				footer={
					<div className="flex justify-between">
						<Button onClick={handleReset} icon={<Icon icon="material-symbols:refresh" />}>
							重置
						</Button>
						<Space>
							<Button onClick={onClose}>取消</Button>
							<Button type="primary" onClick={handleApply}>
								应用
							</Button>
						</Space>
					</div>
				}
			>
				<div className="flex flex-col h-full">
					{/* 操作栏 */}
					<div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
						<Input
							placeholder="搜索字段..."
							prefix={<Icon icon="material-symbols:search" className="text-gray-400" />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>

						<Button
							type="dashed"
							block
							icon={<Icon icon="material-symbols:add" />}
							onClick={() => setAddFieldVisible(true)}
						>
							新增字段
						</Button>
					</div>

					{/* 字段列表 */}
					<div className="flex-1 overflow-hidden">
						<div className="h-full overflow-y-auto py-4">
							{filteredConfigs.length > 0 ? (
								<div className="space-y-3">
									{filteredConfigs.map((config, index) => (
										<DragableItem
											key={config.key}
											config={config}
											index={configs.indexOf(config)}
											onMove={handleMove}
											onToggleVisible={handleToggleVisible}
											onDelete={config.locked ? undefined : handleDelete}
										/>
									))}
								</div>
							) : (
								<Empty description="暂无字段" image={Empty.PRESENTED_IMAGE_SIMPLE} />
							)}
						</div>
					</div>

					{/* 统计信息 */}
					<div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
						共 {configs.length} 个字段，显示 {configs.filter((c) => c.visible).length} 个
					</div>
				</div>
			</Drawer>

			{/* 新增字段对话框 */}
			<AddFieldDialog
				visible={addFieldVisible}
				onOk={handleAddField}
				onCancel={() => setAddFieldVisible(false)}
				existingKeys={existingKeys}
			/>
		</>
	);
};

export default ColumnSetting;
export type { ColumnSettingProps };
