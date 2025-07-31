/**
 * Enhanced KeepAlive 示例页面
 *
 * 展示 EnhancedKeepAlive 组件的各种功能和配置选项
 */

import {
	type CacheStrategy,
	EnhancedKeepAlive,
	KeepAliveCachePanel,
	KeepAlivePresets,
	useKeepAliveManager,
} from "@/components/enhanced-keep-alive";
import { useSessionStorageState } from "ahooks";
import { Alert, Button, Card, Col, Divider, Input, Row, Select, Slider, Space, Switch, Tag, Typography } from "antd";
import { useCallback, useState } from "react";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// 示例组件 - 计数器
function CounterDemo({ title, color = "#1890ff" }: { title: string; color?: string }) {
	const [count, setCount] = useState<number>(0);
	const [text, setText] = useState<string>("");

	return (
		<Card
			title={title}
			size="small"
			style={{
				borderColor: color,
				minHeight: "200px",
			}}
			headStyle={{ backgroundColor: color, color: "white" }}
		>
			<Space direction="vertical" style={{ width: "100%" }}>
				<div>
					<Text strong>计数器: </Text>
					<Tag color={color}>{count}</Tag>
				</div>
				<Button
					type="primary"
					onClick={() => setCount((c) => c + 1)}
					style={{ backgroundColor: color, borderColor: color }}
				>
					增加计数
				</Button>

				<div>
					<Text strong>输入框状态: </Text>
					<Input placeholder="输入一些文字测试状态保持" value={text} onChange={(e) => setText(e.target.value)} />
				</div>

				<div style={{ fontSize: "12px", color: "#666" }}>
					<div>创建时间: {new Date().toLocaleTimeString()}</div>
					<div>这个组件的状态会被 KeepAlive 保持</div>
				</div>
			</Space>
		</Card>
	);
}

// 配置面板组件
function ConfigPanel({
	config,
	onChange,
}: {
	config: any;
	onChange: (key: string, value: any) => void;
}) {
	return (
		<Card title="🔧 配置面板" size="small">
			<Space direction="vertical" style={{ width: "100%" }}>
				<div>
					<Text strong>缓存策略: </Text>
					<Select value={config.strategy} onChange={(value) => onChange("strategy", value)} style={{ width: 120 }}>
						<Option value="always">总是缓存</Option>
						<Option value="conditional">条件缓存</Option>
						<Option value="never">从不缓存</Option>
					</Select>
				</div>

				<div>
					<Text strong>最大缓存数: </Text>
					<Slider
						min={1}
						max={20}
						value={config.maxCacheCount}
						onChange={(value) => onChange("maxCacheCount", value)}
						style={{ width: 200 }}
					/>
					<Text type="secondary">{config.maxCacheCount}</Text>
				</div>

				<div>
					<Text strong>过期时间(分钟): </Text>
					<Slider
						min={1}
						max={60}
						value={config.expireTime / (60 * 1000)}
						onChange={(value) => onChange("expireTime", value * 60 * 1000)}
						style={{ width: 200 }}
					/>
					<Text type="secondary">{config.expireTime / (60 * 1000)}</Text>
				</div>

				<div>
					<Text strong>调试模式: </Text>
					<Switch checked={config.debug} onChange={(checked) => onChange("debug", checked)} />
				</div>

				<div>
					<Text strong>显示调试信息: </Text>
					<Switch checked={config.showDebugInfo} onChange={(checked) => onChange("showDebugInfo", checked)} />
				</div>
			</Space>
		</Card>
	);
}

export default function EnhancedKeepAliveExample() {
	// 使用持久化状态缓存 activeDemo 选择
	const [activeDemo, setActiveDemo] = useSessionStorageState<string>("enhanced-keep-alive-demo", {
		defaultValue: "custom",
	});
	console.log("[ EnhancedKeepAliveExample ] >");
	const [customConfig, setCustomConfig] = useState({
		strategy: "always" as CacheStrategy,
		maxCacheCount: 5,
		expireTime: 10 * 60 * 1000, // 10分钟
		debug: true,
		showDebugInfo: true,
	});

	const { getCacheStats, clearCache } = useKeepAliveManager();

	const handleConfigChange = useCallback((key: string, value: any) => {
		setCustomConfig((prev) => ({ ...prev, [key]: value }));
	}, []);

	const renderDemo = () => {
		switch (activeDemo) {
			case "default":
				return (
					<EnhancedKeepAlive {...KeepAlivePresets.default}>
						<CounterDemo title="默认配置示例" color="#52c41a" />
					</EnhancedKeepAlive>
				);

			case "performance":
				return (
					<EnhancedKeepAlive {...KeepAlivePresets.performance}>
						<CounterDemo title="高性能配置示例" color="#fa8c16" />
					</EnhancedKeepAlive>
				);

			case "longterm":
				return (
					<EnhancedKeepAlive {...KeepAlivePresets.longTerm}>
						<CounterDemo title="长期缓存配置示例" color="#722ed1" />
					</EnhancedKeepAlive>
				);

			case "debug":
				return (
					<EnhancedKeepAlive {...KeepAlivePresets.debug}>
						<CounterDemo title="调试配置示例" color="#eb2f96" />
					</EnhancedKeepAlive>
				);

			case "custom":
				return (
					<EnhancedKeepAlive {...customConfig}>
						<CounterDemo title="自定义配置示例" color="#1890ff" />
					</EnhancedKeepAlive>
				);

			default:
				return (
					<EnhancedKeepAlive {...customConfig}>
						<CounterDemo title="自定义配置示例" color="#1890ff" />
					</EnhancedKeepAlive>
				);
		}
	};

	return (
		<div style={{ padding: "24px" }}>
			<Title level={2}>🚀 Enhanced KeepAlive 示例</Title>

			<Alert
				message="功能说明"
				description="这个页面展示了 Enhanced KeepAlive 组件的各种功能。你可以切换不同的配置，观察组件状态的保持效果。"
				type="info"
				showIcon
				style={{ marginBottom: "24px" }}
			/>

			<Row gutter={[16, 16]}>
				{/* 左侧：示例选择和配置 */}
				<Col xs={24} lg={8}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* 示例选择 */}
						<Card title="📋 示例选择" size="small">
							<Space direction="vertical" style={{ width: "100%" }}>
								<Button
									type={activeDemo === "custom" ? "primary" : "default"}
									onClick={() => setActiveDemo("custom")}
									block
								>
									自定义配置
								</Button>
								<Button
									type={activeDemo === "default" ? "primary" : "default"}
									onClick={() => setActiveDemo("default")}
									block
								>
									默认配置
								</Button>
								<Button
									type={activeDemo === "performance" ? "primary" : "default"}
									onClick={() => setActiveDemo("performance")}
									block
								>
									高性能配置
								</Button>
								<Button
									type={activeDemo === "longterm" ? "primary" : "default"}
									onClick={() => setActiveDemo("longterm")}
									block
								>
									长期缓存配置
								</Button>
								<Button
									type={activeDemo === "debug" ? "primary" : "default"}
									onClick={() => setActiveDemo("debug")}
									block
								>
									调试配置
								</Button>
							</Space>
						</Card>

						{/* 自定义配置面板 */}
						{activeDemo === "custom" && <ConfigPanel config={customConfig} onChange={handleConfigChange} />}

						{/* 操作按钮 */}
						<Card title="🎮 操作面板" size="small">
							<Space direction="vertical" style={{ width: "100%" }}>
								<Button danger onClick={() => clearCache()} block>
									清除所有缓存
								</Button>
								<Button
									onClick={() => {
										const stats = getCacheStats();
										alert(`当前缓存统计:\n总数: ${stats.total}\n最大数: ${stats.maxCount}`);
									}}
									block
								>
									查看缓存统计
								</Button>
							</Space>
						</Card>
					</Space>
				</Col>

				{/* 右侧：示例展示 */}
				<Col xs={24} lg={16}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* 当前配置信息 */}
						<Card title="📊 当前配置" size="small">
							<Row gutter={16}>
								<Col span={8}>
									<Text strong>策略: </Text>
									<Tag color="blue">
										{activeDemo === "custom"
											? customConfig.strategy
											: activeDemo === "default"
												? "always"
												: activeDemo === "performance"
													? "conditional"
													: activeDemo === "longterm"
														? "always"
														: "always"}
									</Tag>
								</Col>
								<Col span={8}>
									<Text strong>最大缓存: </Text>
									<Tag color="green">
										{activeDemo === "custom"
											? customConfig.maxCacheCount
											: activeDemo === "default"
												? 10
												: activeDemo === "performance"
													? 5
													: activeDemo === "longterm"
														? 20
														: 3}
									</Tag>
								</Col>
								<Col span={8}>
									<Text strong>过期时间: </Text>
									<Tag color="orange">
										{activeDemo === "custom"
											? `${customConfig.expireTime / (60 * 1000)}分钟`
											: activeDemo === "default"
												? "30分钟"
												: activeDemo === "performance"
													? "10分钟"
													: activeDemo === "longterm"
														? "60分钟"
														: "5分钟"}
									</Tag>
								</Col>
							</Row>
						</Card>

						{/* 示例组件 */}
						<div style={{ minHeight: "300px" }}>{renderDemo()}</div>

						{/* 使用说明 */}
						<Card title="📖 使用说明" size="small">
							<Paragraph>
								<Text strong>测试步骤：</Text>
							</Paragraph>
							<ol>
								<li>在上面的示例组件中增加计数器数值</li>
								<li>在输入框中输入一些文字</li>
								<li>切换到其他示例配置</li>
								<li>再切换回来，观察状态是否被保持</li>
								<li>尝试不同的配置选项，观察缓存行为的变化</li>
							</ol>

							<Divider />

							<Paragraph>
								<Text strong>配置说明：</Text>
							</Paragraph>
							<ul>
								<li>
									<Text code>always</Text>: 总是缓存组件状态
								</li>
								<li>
									<Text code>conditional</Text>: 根据条件决定是否缓存
								</li>
								<li>
									<Text code>never</Text>: 从不缓存，每次都重新创建
								</li>
								<li>
									<Text code>maxCacheCount</Text>: 最大缓存数量，超出时使用 LRU 算法清理
								</li>
								<li>
									<Text code>expireTime</Text>: 缓存过期时间，过期后自动清理
								</li>
							</ul>
						</Card>
					</Space>
				</Col>
			</Row>

			<Divider />

			{/* 缓存管理面板 */}
			<KeepAliveCachePanel />
		</div>
	);
}
