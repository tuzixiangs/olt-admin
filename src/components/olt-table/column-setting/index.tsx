import { Icon } from "@/components/icon";
import type { ProColumns } from "@ant-design/pro-components";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDebounceFn } from "ahooks";
import { Button, Empty, Popover, Tooltip, message } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddFieldDialog from "./add-field-dialog";
import SortableItem from "./dragable-item";
import type { AddFieldFormData, ColumnConfig, ColumnSettingProps } from "./types";

const ColumnSetting = ({
	columns,
	onColumnsChange,
	defaultLockedColumns = [],
	enableStorage = false,
	storageKey = "olt-table-column-config",
}: ColumnSettingProps) => {
	const [configs, setConfigs] = useState<ColumnConfig[]>([]);
	const [addFieldVisible, setAddFieldVisible] = useState(false);
	const [originalConfigs, setOriginalConfigs] = useState<ColumnConfig[]>([]);
	const [open, setOpen] = useState(false);
	const prevColumnsRef = useRef<ProColumns[]>([]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// 将 ProColumns 转换为 ColumnConfig
	const convertColumnsToConfigs = useCallback(
		(cols: ProColumns[]): ColumnConfig[] => {
			return cols.map((col, index) => ({
				key: col.key?.toString() || col.dataIndex?.toString() || `column-${index}`,
				title: col.title?.toString() || "",
				dataIndex: col.dataIndex?.toString() || "",
				visible: !col.hideInTable,
				locked: defaultLockedColumns.includes(col.key?.toString() || col.dataIndex?.toString() || ""),
				sortIndex: index,
				width: col.width as number,
				fixed: col.fixed as "left" | "right" | undefined,
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
		if (!columns.length) return;

		// 检查 columns 是否发生变化
		const isColumnsChanged = JSON.stringify(columns) !== JSON.stringify(prevColumnsRef.current);
		if (!isColumnsChanged && configs.length > 0) return;

		prevColumnsRef.current = columns;
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
	}, [columns, convertColumnsToConfigs, loadStoredConfig, configs.length]);

	// 防抖应用配置
	const { run: debouncedApply } = useDebounceFn(
		() => {
			const newColumns = convertConfigsToColumns(configs);
			onColumnsChange(newColumns);
			saveConfigToStorage(configs);
		},
		{
			wait: 200,
		},
	);

	// 处理拖拽结束事件
	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setConfigs((prev) => {
				const activeIndex = prev.findIndex((item) => item.key === active.id);
				const overIndex = prev.findIndex((item) => item.key === over.id);

				// 如果目标位置是锁定列，则不允许移动
				if (prev[overIndex].locked) return prev;

				const newConfigs = arrayMove(prev, activeIndex, overIndex);

				// 重新计算 sortIndex
				return newConfigs.map((config, index) => ({
					...config,
					sortIndex: index,
				}));
			});
		}
	}, []);

	// 切换可见性
	const handleToggleVisible = useCallback((key: string) => {
		setConfigs((prev) => {
			const newConfigs = prev.map((config) => (config.key === key ? { ...config, visible: !config.visible } : config));
			return newConfigs;
		});
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

	// 监听 configs 变化并防抖应用
	useEffect(() => {
		if (configs.length > 0) {
			debouncedApply();
		}
	}, [configs, debouncedApply]);

	// 获取已存在的字段key列表
	const existingKeys = useMemo(() => configs.map((config) => config.key), [configs]);

	return (
		<>
			<Popover
				placement="bottomLeft"
				style={{
					padding: 0,
				}}
				arrow={false}
				content={
					<div className="w-80 p-2">
						<div className="flex flex-col h-full">
							{/* 标题栏 */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<span className="font-medium">字段配置</span>
								</div>
								<div className="flex gap-1">
									<Button
										type="text"
										size="small"
										onClick={() => {
											setAddFieldVisible(true);
										}}
										icon={<Icon icon="material-symbols:add" />}
									/>
									<Button
										type="text"
										size="small"
										onClick={handleReset}
										icon={<Icon icon="material-symbols:refresh" />}
									/>
								</div>
							</div>

							{/* 字段列表 */}
							<div className="flex-1 overflow-hidden">
								<div className="h-full py-1">
									{configs.length > 0 ? (
										<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
											<SortableContext
												items={configs.map((config) => config.key)}
												strategy={verticalListSortingStrategy}
											>
												<div className="space-y-2">
													{configs.map((config) => (
														<SortableItem
															key={config.key}
															config={config}
															onToggleVisible={handleToggleVisible}
															onDelete={config.locked ? undefined : handleDelete}
														/>
													))}
												</div>
											</SortableContext>
										</DndContext>
									) : (
										<Empty description="暂无字段" image={Empty.PRESENTED_IMAGE_SIMPLE} />
									)}
								</div>
							</div>
						</div>
					</div>
				}
				trigger="click"
				open={open}
				onOpenChange={setOpen}
			>
				<Tooltip title="列设置">
					<div className="hover:text-blue-700 cursor-pointer">
						<Icon icon="ant-design:setting-outlined" size={20} />
					</div>
				</Tooltip>
			</Popover>

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
