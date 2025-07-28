import { useLocalStorageState, useSessionStorageState } from "ahooks";
import { Alert, Button, Card, Col, Divider, Input, Row, Select, Slider, Space, Switch, Tag, Typography } from "antd";
import type { FC } from "react";
import { useState } from "react";
import { useCartStore, useFormCacheStore, useUserPreferencesStore } from "./stores";
import { useCartMemoryStore } from "./stores/memory-stores";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// ahooks 示例组件
const AhooksDemo: FC = () => {
	const [counter, setCounter] = useLocalStorageState("ahooks-counter", { defaultValue: 0 });
	const [userInfo, setUserInfo] = useLocalStorageState("ahooks-user", {
		defaultValue: { name: "", age: 18, city: "" },
	});
	const [sessionData, setSessionData] = useSessionStorageState("ahooks-session", {
		defaultValue: { lastVisit: new Date().toISOString() },
	});

	return (
		<Card title="⚡ ahooks 实现" className="mb-4">
			<Space direction="vertical" className="w-full">
				<Alert
					message="特点"
					description="开箱即用的 API，完善的错误处理，支持 SSR，TypeScript 友好"
					type="success"
					showIcon
				/>

				<Row gutter={16}>
					<Col span={8}>
						<Card size="small" title="计数器">
							<Space direction="vertical" className="w-full">
								<Text>
									当前值: <Tag color="green">{counter}</Tag>
								</Text>
								<Space>
									<Button onClick={() => setCounter((counter || 0) + 1)}>+1</Button>
									<Button onClick={() => setCounter((counter || 0) - 1)}>-1</Button>
									<Button onClick={() => setCounter(0)} danger>
										重置
									</Button>
								</Space>
							</Space>
						</Card>
					</Col>

					<Col span={8}>
						<Card size="small" title="用户信息">
							<Space direction="vertical" className="w-full">
								<Input
									value={userInfo?.name || ""}
									onChange={(e) =>
										setUserInfo({ ...(userInfo || { name: "", age: 18, city: "" }), name: e.target.value })
									}
									placeholder="姓名"
								/>
								<Slider
									min={1}
									max={100}
									value={userInfo?.age || 18}
									onChange={(age) => setUserInfo({ ...(userInfo || { name: "", age: 18, city: "" }), age })}
								/>
								<Text>年龄: {userInfo?.age}</Text>
								<Input
									value={userInfo?.city || ""}
									onChange={(e) =>
										setUserInfo({ ...(userInfo || { name: "", age: 18, city: "" }), city: e.target.value })
									}
									placeholder="城市"
								/>
							</Space>
						</Card>
					</Col>

					<Col span={8}>
						<Card size="small" title="会话数据">
							<Space direction="vertical" className="w-full">
								<Text>上次访问: {new Date(sessionData?.lastVisit || "").toLocaleString()}</Text>
								<Button onClick={() => setSessionData({ lastVisit: new Date().toISOString() })} type="primary">
									更新访问时间
								</Button>
							</Space>
						</Card>
					</Col>
				</Row>
			</Space>
		</Card>
	);
};

// zustand 示例组件
const ZustandDemo: FC = () => {
	// 用户偏好设置
	const {
		theme,
		language,
		fontSize,
		sidebarCollapsed,
		setTheme,
		setLanguage,
		setFontSize,
		setSidebarCollapsed,
		resetPreferences,
	} = useUserPreferencesStore();

	// 表单缓存
	const { setFormField, clearFormData, getFormField } = useFormCacheStore();

	// 购物车
	const { items, total, addItem, removeItem, updateQuantity, clearCart, getItemCount } = useCartStore();

	const sampleProducts = [
		{ id: "1", name: "MacBook Pro", price: 12999, image: "💻" },
		{ id: "2", name: "iPhone 15", price: 5999, image: "📱" },
		{ id: "3", name: "AirPods Pro", price: 1899, image: "🎧" },
	];

	return (
		<Card title="🚀 zustand 全局状态管理" className="mb-4">
			<Space direction="vertical" className="w-full">
				<Alert
					message="特点"
					description="全局状态管理，支持复杂状态逻辑，中间件生态丰富，优秀的性能表现"
					type="warning"
					showIcon
				/>

				<Row gutter={16}>
					<Col span={8}>
						<Card size="small" title="用户偏好设置">
							<Space direction="vertical" className="w-full">
								<div>
									<Text>主题: </Text>
									<Select value={theme} onChange={setTheme} style={{ width: 100 }}>
										<Option value="light">浅色</Option>
										<Option value="dark">深色</Option>
										<Option value="auto">自动</Option>
									</Select>
								</div>
								<div>
									<Text>语言: </Text>
									<Select value={language} onChange={setLanguage} style={{ width: 100 }}>
										<Option value="zh-CN">中文</Option>
										<Option value="en-US">English</Option>
									</Select>
								</div>
								<div>
									<Text>字体大小: {fontSize}px</Text>
									<Slider min={12} max={20} value={fontSize} onChange={setFontSize} />
								</div>
								<div>
									<Text>侧边栏折叠: </Text>
									<Switch checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
								</div>
								<Button onClick={resetPreferences} danger size="small">
									重置偏好
								</Button>
							</Space>
						</Card>
					</Col>

					<Col span={8}>
						<Card size="small" title="表单缓存">
							<Space direction="vertical" className="w-full">
								<Input
									value={getFormField("username") || ""}
									onChange={(e) => setFormField("username", e.target.value)}
									placeholder="用户名"
								/>
								<Input
									value={getFormField("email") || ""}
									onChange={(e) => setFormField("email", e.target.value)}
									placeholder="邮箱"
								/>
								<Input.TextArea
									value={getFormField("description") || ""}
									onChange={(e) => setFormField("description", e.target.value)}
									placeholder="描述"
									rows={3}
								/>
								<Button onClick={clearFormData} danger size="small">
									清除表单
								</Button>
							</Space>
						</Card>
					</Col>

					<Col span={8}>
						<Card size="small" title={`购物车 (${getItemCount()}件商品)`}>
							<Space direction="vertical" className="w-full">
								<div>
									<Text strong>商品列表:</Text>
									{sampleProducts.map((product) => (
										<div
											key={product.id}
											style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}
										>
											<span>
												{product.image} {product.name}
											</span>
											<Button size="small" onClick={() => addItem(product)}>
												+
											</Button>
										</div>
									))}
								</div>

								<Divider style={{ margin: "8px 0" }} />

								<div>
									<Text strong>购物车:</Text>
									{items.map((item) => (
										<div
											key={item.id}
											style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}
										>
											<span>
												{item.name} x{item.quantity}
											</span>
											<Space>
												<Button size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
													-
												</Button>
												<Button size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
													+
												</Button>
												<Button size="small" danger onClick={() => removeItem(item.id)}>
													删除
												</Button>
											</Space>
										</div>
									))}
								</div>

								<div>
									<Text strong>总计: ¥{total.toFixed(2)}</Text>
								</div>

								<Button onClick={clearCart} danger size="small" disabled={items.length === 0}>
									清空购物车
								</Button>
							</Space>
						</Card>
					</Col>
				</Row>
			</Space>
		</Card>
	);
};

// 内存状态演示组件
const MemoryStateDemo: FC = () => {
	// zustand 内存状态
	const { items, total, addItem, removeItem, clearCart } = useCartMemoryStore();

	const handleAddItem = () => {
		const newItem = {
			id: Date.now().toString(),
			name: `商品 ${items.length + 1}`,
			price: Math.floor(Math.random() * 100) + 10,
		};
		addItem(newItem);
	};

	return (
		<Card title="💾 内存状态管理演示" className="mb-4">
			<Space direction="vertical" className="w-full">
				<Alert
					message="特点"
					description="状态保存在内存中，组件切换时保留，页面刷新后丢失。适用于临时数据、表单草稿、UI 状态等场景。"
					type="warning"
					showIcon
				/>

				<Row gutter={16}>
					<Col span={6}>
						<Card size="small" title="zustand 内存" className="bg-purple-50">
							<Space direction="vertical" className="w-full">
								<Space>
									<Button onClick={handleAddItem} size="small">
										添加商品
									</Button>
									<Button onClick={clearCart} danger size="small">
										清空
									</Button>
								</Space>
								<div style={{ maxHeight: "120px", overflowY: "auto" }}>
									{items.map((item) => (
										<div key={item.id} className="flex justify-between items-center text-xs">
											<span>
												{item.name} x{item.quantity}
											</span>
											<Button size="small" danger onClick={() => removeItem(item.id)}>
												×
											</Button>
										</div>
									))}
								</div>
								<Text className="text-xs">总计: ¥{total}</Text>
							</Space>
						</Card>
					</Col>
				</Row>

				<Alert
					message="💡 测试提示"
					description="尝试在上面输入数据，然后切换到其他演示区域再回来，数据应该还在。但刷新页面后数据会丢失。"
					type="info"
					showIcon
				/>
			</Space>
		</Card>
	);
};

// 主组件
const StateCacheExample: FC = () => {
	const [activeTab, setActiveTab] = useState<"persistent" | "memory">("memory");

	return (
		<div className="p-6">
			<div className="mb-6">
				<Title level={2}>🗄️ 状态缓存方案对比</Title>
				<Paragraph>
					本页面展示了在 React 应用中实现状态缓存的不同方案：
					<Text strong>持久化存储</Text>（localStorage/sessionStorage）和
					<Text strong>内存状态管理</Text>。 每种方案都有其适用场景和优势。
				</Paragraph>

				{/* 标签切换 */}
				<div className="mb-4">
					<Space>
						<Button type={activeTab === "memory" ? "primary" : "default"} onClick={() => setActiveTab("memory")}>
							💾 内存状态管理
						</Button>
						<Button
							type={activeTab === "persistent" ? "primary" : "default"}
							onClick={() => setActiveTab("persistent")}
						>
							💿 持久化存储
						</Button>
					</Space>
				</div>
			</div>

			{activeTab === "memory" && <MemoryStateDemo />}

			{activeTab === "persistent" && (
				<>
					<AhooksDemo />
					<ZustandDemo />
				</>
			)}

			<Card title="📊 方案对比总结">
				<Row gutter={16}>
					<Col span={12}>
						<Card size="small" title="内存状态管理" className="h-full">
							<Space direction="vertical">
								<Tag color="blue">组件切换时保留</Tag>
								<Tag color="green">性能更好</Tag>
								<Tag color="orange">页面刷新后丢失</Tag>
								<Paragraph className="text-sm">
									适合临时数据、表单草稿、UI 状态等场景。不占用存储空间，但不能跨会话保持。
								</Paragraph>
							</Space>
						</Card>
					</Col>

					<Col span={12}>
						<Card size="small" title="持久化存储" className="h-full">
							<Space direction="vertical">
								<Tag color="green">页面刷新后保留</Tag>
								<Tag color="blue">跨标签页共享</Tag>
								<Tag color="purple">适合重要数据</Tag>
								<Paragraph className="text-sm">
									适合用户偏好、登录状态、重要表单数据等场景。占用存储空间，但数据持久化。
								</Paragraph>
							</Space>
						</Card>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default StateCacheExample;
