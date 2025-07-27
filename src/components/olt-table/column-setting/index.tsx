import { Icon } from "@/components/icon";
import { toast } from "@/components/olt-toast";
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
import { Button, Empty, Popover, Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AddFieldDialog from "./add-field-dialog";
import SortableItem from "./dragable-item";
import { FixedItem } from "./fixed-item";
import { LockedItem } from "./locked-item";
import type { AddFieldFormData, ColumnConfig, ColumnSettingProps } from "./types";

const ColumnSetting = ({
	columns,
	onColumnsChange,
	defaultLockedColumns = [],
	enableStorage = false,
	storageKey = "olt-table-columns",
}: ColumnSettingProps) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [configs, setConfigs] = useState<ColumnConfig[]>([]);
	const [originalConfigs, setOriginalConfigs] = useState<ColumnConfig[]>([]);
	const [addFieldVisible, setAddFieldVisible] = useState(false);
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
			return cols.map((col, index) => {
				// 优先使用 dataIndex 作为 key，然后是 key，最后是索引
				const columnKey = col.dataIndex?.toString() || col.key?.toString() || `column-${index}`;
				return {
					key: columnKey,
					title: col.title?.toString() || "",
					dataIndex: col.dataIndex?.toString() || "",
					visible: !col.hideInTable,
					locked: defaultLockedColumns.includes(columnKey),
					sortIndex: index,
					originalSortIndex: index, // 记住原始位置
					width: col.width as number,
					fixed: col.fixed as "left" | "right" | undefined,
					originalColumn: col,
				};
			});
		},
		[defaultLockedColumns],
	);

	// 将 ColumnConfig 转换回 ProColumns
	const convertConfigsToColumns = useCallback((configs: ColumnConfig[]): ProColumns[] => {
		return configs.map((config) => ({
			...config.originalColumn,
			key: config.key,
			title: config.title,
			dataIndex: config.dataIndex,
			width: config.width,
			fixed: config.fixed,
			index: config.sortIndex,
			hideInTable: config.visible,
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
					originalSortIndex: index,
				}));
			});
		}
	}, []);

	// 切换显示/隐藏
	const handleVisibilityChange = useCallback((key: string, visible: boolean) => {
		setConfigs((prev) => prev.map((config) => (config.key === key ? { ...config, visible } : config)));
	}, []);

	// 切换锁定状态
	const handleLockChange = useCallback((key: string, locked: boolean) => {
		setConfigs((prev) => prev.map((config) => (config.key === key ? { ...config, locked } : config)));
	}, []);

	// 切换可见性
	const handleToggleVisible = useCallback((key: string) => {
		setConfigs((prev) => {
			const newConfigs = prev.map((config) => (config.key === key ? { ...config, visible: !config.visible } : config));
			return newConfigs;
		});
	}, []);

	// 删除字段
	const handleDelete = useCallback(
		(key: string) => {
			setConfigs((prev) => prev.filter((config) => config.key !== key));
			toast.success(t("table.fieldDeleted"));
		},
		[t],
	);

	// 固定到列首
	const handlePinToStart = useCallback((key: string) => {
		setConfigs((prev) => {
			const targetIndex = prev.findIndex((config) => config.key === key);
			if (targetIndex === -1) return prev;

			const targetConfig = { ...prev[targetIndex], fixed: "left" as const };
			const newConfigs = [...prev];
			newConfigs.splice(targetIndex, 1);

			// 找到左侧固定字段的插入位置（插入到所有左侧固定字段的末尾）
			const leftFixedConfigs = newConfigs.filter((c) => c.fixed === "left");
			const insertIndex = leftFixedConfigs.length;

			newConfigs.splice(insertIndex, 0, targetConfig);

			// 重新计算 sortIndex
			return newConfigs.map((config) => ({
				...config,
			}));
		});
	}, []);

	// 固定到列尾
	const handlePinToEnd = useCallback((key: string) => {
		setConfigs((prev) => {
			const targetIndex = prev.findIndex((config) => config.key === key);
			if (targetIndex === -1) return prev;

			const targetConfig = { ...prev[targetIndex], fixed: "right" as const };
			const newConfigs = [...prev];
			newConfigs.splice(targetIndex, 1);

			// 找到右侧固定字段的插入位置（插入到所有右侧固定字段的开头）
			const leftFixedConfigs = newConfigs.filter((c) => c.fixed === "left");
			const normalConfigs = newConfigs.filter((c) => !c.fixed);
			const insertIndex = leftFixedConfigs.length + normalConfigs.length;

			newConfigs.splice(insertIndex, 0, targetConfig);

			// 重新计算 sortIndex
			return newConfigs.map((config) => ({
				...config,
			}));
		});
	}, []);

	// 取消固定
	const handleUnpin = useCallback((key: string) => {
		setConfigs((prev) => {
			const targetIndex = prev.findIndex((config) => config.key === key);
			if (targetIndex === -1) return prev;

			const targetConfig = { ...prev[targetIndex], sortIndex: prev[targetIndex].originalSortIndex, fixed: undefined };
			const newConfigs = [...prev];
			newConfigs.splice(targetIndex, 1);

			newConfigs.splice(prev[targetIndex].originalSortIndex, 0, targetConfig);

			// 重新计算 sortIndex
			return newConfigs;
		});
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
				originalSortIndex: configs.length, // 新增字段的原始位置就是当前位置
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
			toast.success(t("table.fieldAddedSuccess"));
		},
		[configs.length, t],
	);

	// 重置配置
	const handleReset = useCallback(() => {
		setConfigs(originalConfigs);
		if (enableStorage) {
			localStorage.removeItem(storageKey);
		}
		toast.success(t("table.configReset"));
	}, [originalConfigs, enableStorage, storageKey, t]);

	// 监听 configs 变化并防抖应用
	useEffect(() => {
		if (configs.length > 0) {
			debouncedApply();
		}
	}, [configs, debouncedApply]);

	// 获取已存在的字段key列表
	const existingKeys = useMemo(() => configs.map((config) => config.key), [configs]);

	// 按固定位置分离字段
	const leftFixedConfigs = useMemo(() => configs.filter((config) => config.fixed === "left"), [configs]);
	const rightFixedConfigs = useMemo(() => configs.filter((config) => config.fixed === "right"), [configs]);
	const normalConfigs = useMemo(() => configs.filter((config) => !config.fixed), [configs]);

	// 分离锁定字段和可拖动字段（仅在普通字段中）
	const lockedNormalConfigs = useMemo(() => normalConfigs.filter((config) => config.locked), [normalConfigs]);
	const draggableNormalConfigs = useMemo(() => normalConfigs.filter((config) => !config.locked), [normalConfigs]);

	return (
		<>
			<Popover
				placement="bottomLeft"
				styles={{
					body: {
						padding: 0,
					},
				}}
				arrow={false}
				content={
					<div className="w-80 p-0">
						<div className="flex flex-col h-full">
							{/* 标题栏 */}
							<div className="flex items-center justify-between py-3.5 pl-5 pr-3 border-b">
								<div className="flex items-center gap-2">
									<span className="font-medium">{t("table.columnConfig")}</span>
								</div>
								<div className="flex gap-1">
									<Button
										type="text"
										size="small"
										onClick={handleReset}
										icon={<Icon icon="material-symbols:refresh" />}
									/>
								</div>
							</div>

							{/* 内容区域 */}
							<div className="flex-1 overflow-hidden">
								<div className="h-full">
									{configs.length > 0 ? (
										<div className="space-y-0">
											{/* 锁定的普通字段 */}
											{lockedNormalConfigs.length > 0 && (
												<div className="px-1.5 py-2 border-b">
													<div className="space-y-0">
														{lockedNormalConfigs.map((config) => (
															<LockedItem key={config.key} config={config} onToggleVisible={handleToggleVisible} />
														))}
													</div>
												</div>
											)}

											{/* 固定在左侧的字段 */}
											{leftFixedConfigs.length > 0 && (
												<div className="border-b">
													<div className="px-3 py-2 bg-blue-50 text-xs text-blue-600 font-medium">
														{t("table.fixedLeft")}
													</div>
													<div className="px-1.5 py-2">
														<div className="space-y-0">
															{leftFixedConfigs.map((config) => (
																<FixedItem
																	key={config.key}
																	config={config}
																	onVisibilityChange={handleVisibilityChange}
																	onLockChange={handleLockChange}
																	onDelete={handleDelete}
																	onUnpin={handleUnpin}
																/>
															))}
														</div>
													</div>
												</div>
											)}

											{/* 普通字段区域 */}
											{normalConfigs.length > 0 && (
												<div className={rightFixedConfigs.length > 0 ? "border-b" : ""}>
													{/* 可拖动的普通字段 */}
													{draggableNormalConfigs.length > 0 && (
														<div className="px-1.5 py-2">
															<DndContext
																sensors={sensors}
																collisionDetection={closestCenter}
																onDragEnd={handleDragEnd}
															>
																<SortableContext
																	items={draggableNormalConfigs.map((config) => config.key)}
																	strategy={verticalListSortingStrategy}
																>
																	<div className="space-y-0">
																		{draggableNormalConfigs.map((config) => (
																			<SortableItem
																				key={config.key}
																				config={config}
																				onVisibilityChange={handleVisibilityChange}
																				onLockChange={handleLockChange}
																				onDelete={handleDelete}
																				onPinToStart={handlePinToStart}
																				onPinToEnd={handlePinToEnd}
																			/>
																		))}
																	</div>
																</SortableContext>
															</DndContext>
														</div>
													)}
												</div>
											)}

											{/* 固定在右侧的字段 */}
											{rightFixedConfigs.length > 0 && (
												<div>
													<div className="px-3 py-2 bg-green-50 text-xs text-green-600 font-medium">
														{t("table.fixedRight")}
													</div>
													<div className="px-1.5 py-2">
														<div className="space-y-0">
															{rightFixedConfigs.map((config) => (
																<FixedItem
																	key={config.key}
																	config={config}
																	onVisibilityChange={handleVisibilityChange}
																	onLockChange={handleLockChange}
																	onDelete={handleDelete}
																	onUnpin={handleUnpin}
																/>
															))}
														</div>
													</div>
												</div>
											)}
										</div>
									) : (
										<div className="p-3">
											<Empty description={t("table.noFields")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
										</div>
									)}
								</div>
							</div>

							{/* 新增字段按钮 */}
							<div className="px-5 py-3.5 border-t">
								{/* TODO:实验性功能，暂不支持 */}
								<div
									className="text-left flex items-center gap-1 pl-1.5 cursor-pointer"
									onClick={() => {
										setAddFieldVisible(true);
									}}
								>
									<Icon icon="material-symbols:add" />
									<span>{t("table.addField")}</span>
								</div>
							</div>
						</div>
					</div>
				}
				trigger="click"
				open={open}
				onOpenChange={setOpen}
			>
				<Tooltip title={t("table.columnSetting")}>
					<div className="hover:text-blue-700 cursor-pointer flex items-center">
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
