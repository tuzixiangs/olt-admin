import { Icon } from "@/components/icon";
import { useKeepAliveManager } from "@/hooks/use-keep-alive-manager";
import { Button, Card, Modal, Space, Table, Tag, Tooltip, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";

interface CacheItem {
	id: string;
	name: string;
	path: string;
	search: string;
	createdAt: number;
	lastAccessAt: number;
	accessCount: number;
	isExpired: boolean;
}

export function KeepAliveCachePanel() {
	const { getCacheStats, clearCache, refreshCurrentCache } = useKeepAliveManager();
	const [cacheData, setCacheData] = useState<CacheItem[]>([]);
	const [loading, setLoading] = useState(false);

	const refreshData = useCallback(() => {
		setLoading(true);
		try {
			const stats = getCacheStats();
			setCacheData(stats.caches);
		} finally {
			setLoading(false);
		}
	}, [getCacheStats]);

	useEffect(() => {
		refreshData();
		const interval = setInterval(refreshData, 5000); // 每5秒刷新一次
		return () => clearInterval(interval);
	}, [refreshData]);

	const handleClearCache = (id?: string) => {
		Modal.confirm({
			title: id ? "确认清除缓存" : "确认清除所有缓存",
			content: id ? `确定要清除缓存 "${id}" 吗？` : "确定要清除所有缓存吗？",
			onOk: () => {
				clearCache(id);
				message.success(id ? "缓存已清除" : "所有缓存已清除");
				refreshData();
			},
		});
	};

	const handleRefreshCurrent = () => {
		Modal.confirm({
			title: "确认刷新当前页面",
			content: "这将清除当前页面的缓存并重新加载页面",
			onOk: () => {
				refreshCurrentCache();
			},
		});
	};

	const formatTime = (timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	};

	const formatDuration = (timestamp: number) => {
		const now = Date.now();
		const diff = now - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days}天前`;
		if (hours > 0) return `${hours}小时前`;
		if (minutes > 0) return `${minutes}分钟前`;
		return "刚刚";
	};

	const columns: ColumnsType<CacheItem> = [
		{
			title: "缓存ID",
			dataIndex: "id",
			key: "id",
			ellipsis: true,
			width: 200,
		},
		{
			title: "页面路径",
			dataIndex: "path",
			key: "path",
			ellipsis: true,
		},
		{
			title: "查询参数",
			dataIndex: "search",
			key: "search",
			ellipsis: true,
			render: (search: string) => search || "-",
		},
		{
			title: "访问次数",
			dataIndex: "accessCount",
			key: "accessCount",
			width: 100,
			sorter: (a, b) => a.accessCount - b.accessCount,
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 160,
			render: (timestamp: number) => <Tooltip title={formatTime(timestamp)}>{formatDuration(timestamp)}</Tooltip>,
			sorter: (a, b) => a.createdAt - b.createdAt,
		},
		{
			title: "最后访问",
			dataIndex: "lastAccessAt",
			key: "lastAccessAt",
			width: 160,
			render: (timestamp: number) => <Tooltip title={formatTime(timestamp)}>{formatDuration(timestamp)}</Tooltip>,
			sorter: (a, b) => a.lastAccessAt - b.lastAccessAt,
		},
		{
			title: "状态",
			dataIndex: "isExpired",
			key: "isExpired",
			width: 80,
			render: (isExpired: boolean) => <Tag color={isExpired ? "red" : "green"}>{isExpired ? "已过期" : "正常"}</Tag>,
			filters: [
				{ text: "正常", value: false },
				{ text: "已过期", value: true },
			],
			onFilter: (value, record) => record.isExpired === value,
		},
		{
			title: "操作",
			key: "action",
			width: 100,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title="清除此缓存">
						<Button
							type="text"
							size="small"
							icon={<Icon icon="material-symbols:delete-outline" />}
							onClick={() => handleClearCache(record.id)}
							danger
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Card
			title={
				<Space>
					<Icon icon="material-symbols:info-outline" />
					KeepAlive 缓存管理
				</Space>
			}
			extra={
				<Space>
					<Button icon={<Icon icon="material-symbols:refresh" />} onClick={refreshData} loading={loading}>
						刷新
					</Button>
					<Button icon={<Icon icon="material-symbols:refresh" />} onClick={handleRefreshCurrent}>
						刷新当前页
					</Button>
					<Button icon={<Icon icon="material-symbols:clear-all" />} onClick={() => handleClearCache()} danger>
						清除所有
					</Button>
				</Space>
			}
		>
			<Table
				columns={columns}
				dataSource={cacheData}
				rowKey="id"
				loading={loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total) => `共 ${total} 个缓存`,
				}}
				scroll={{ x: 800 }}
			/>
		</Card>
	);
}
