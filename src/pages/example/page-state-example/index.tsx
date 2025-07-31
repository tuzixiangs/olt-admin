import { useFormState, usePageScrollPosition, usePageState } from "@/hooks/use-page-state";
import { Button, Card, Divider, Form, Input, InputNumber, Space, Switch, Typography, message } from "antd";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;

interface FormData {
	name: string;
	email: string;
	age: number;
	description: string;
	isActive: boolean;
}

export default function PageStateExample() {
	console.log("[ PageStateExample ] >");
	// 使用页面状态管理
	const [pageData, setPageData] = usePageState<{ counter: number; lastAction: string }>({
		counter: 0,
		lastAction: "initialized",
	});

	// 使用滚动位置管理
	const [scrollPosition, setScrollPosition] = usePageScrollPosition();

	// 使用表单状态管理
	const {
		formData,
		setFormData,
		updateField: updateFormField,
	} = useFormState<FormData>({
		name: "",
		email: "",
		age: 18,
		description: "",
		isActive: true,
	});

	// 确保formData不为undefined
	const safeFormData = formData || {
		name: "",
		email: "",
		age: 18,
		description: "",
		isActive: true,
	};

	// 本地状态（不会被保存）
	const [localCounter, setLocalCounter] = useState(0);

	const handleIncrement = () => {
		setPageData({
			...(pageData || { counter: 0, lastAction: "" }),
			counter: (pageData?.counter || 0) + 1,
			lastAction: `incremented at ${new Date().toLocaleTimeString()}`,
		});
	};

	const handleDecrement = () => {
		setPageData({
			...(pageData || { counter: 0, lastAction: "" }),
			counter: (pageData?.counter || 0) - 1,
			lastAction: `decremented at ${new Date().toLocaleTimeString()}`,
		});
	};

	const handleReset = () => {
		setPageData({
			counter: 0,
			lastAction: `reset at ${new Date().toLocaleTimeString()}`,
		});
	};

	const handleSaveScrollPosition = () => {
		setScrollPosition(window.scrollY);
		message.success(`滚动位置已保存: ${window.scrollY}`);
	};

	const handleRestoreScrollPosition = () => {
		if (scrollPosition) {
			window.scrollTo(0, scrollPosition);
			message.success(`滚动位置已恢复: ${scrollPosition}`);
		} else {
			message.info("没有保存的滚动位置");
		}
	};

	const handleFormSubmit = () => {
		console.log("表单数据:", formData);
		message.success("表单数据已提交（查看控制台）");
	};

	const handleFormReset = () => {
		setFormData({
			name: "",
			email: "",
			age: 18,
			description: "",
			isActive: true,
		});
		message.success("表单已重置");
	};

	return (
		<div style={{ padding: "24px", minHeight: "200vh" }}>
			<Title level={2}>页面状态管理示例</Title>
			<Paragraph>
				这个页面演示了如何使用新的页面状态管理 hooks。当你切换到其他标签页再回来时，
				页面状态、表单数据和滚动位置都会被自动保存和恢复。
			</Paragraph>

			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				{/* 页面状态示例 */}
				<Card title="页面状态管理 (usePageState)">
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Text strong>持久化计数器: </Text>
							<Text style={{ fontSize: "24px", color: "#1890ff" }}>{pageData?.counter || 0}</Text>
						</div>
						<div>
							<Text>最后操作: </Text>
							<Text type="secondary">{pageData?.lastAction || ""}</Text>
						</div>
						<Space>
							<Button type="primary" onClick={handleIncrement}>
								增加
							</Button>
							<Button onClick={handleDecrement}>减少</Button>
							<Button danger onClick={handleReset}>
								重置
							</Button>
						</Space>
						<Divider />
						<div>
							<Text strong>本地计数器 (不会保存): </Text>
							<Text style={{ fontSize: "24px", color: "#ff4d4f" }}>{localCounter}</Text>
						</div>
						<Space>
							<Button onClick={() => setLocalCounter(localCounter + 1)}>本地增加</Button>
							<Button onClick={() => setLocalCounter(0)}>本地重置</Button>
						</Space>
					</Space>
				</Card>

				{/* 滚动位置示例 */}
				<Card title="滚动位置管理 (usePageScrollPosition)">
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Text>当前保存的滚动位置: </Text>
							<Text code>{scrollPosition ? `y: ${scrollPosition}` : "未保存"}</Text>
						</div>
						<Space>
							<Button type="primary" onClick={handleSaveScrollPosition}>
								保存当前滚动位置
							</Button>
							<Button onClick={handleRestoreScrollPosition}>恢复滚动位置</Button>
						</Space>
						<Text type="secondary">
							提示: 滚动页面后点击"保存当前滚动位置"，然后切换标签页再回来，滚动位置会自动恢复。
						</Text>
					</Space>
				</Card>

				{/* 表单状态示例 */}
				<Card title="表单状态管理 (useFormState)" bordered={false}>
					<Form layout="vertical" style={{ maxWidth: "600px" }}>
						<Form.Item label="姓名">
							<Input
								value={safeFormData.name}
								onChange={(e) => updateFormField("name", e.target.value)}
								placeholder="请输入姓名"
							/>
						</Form.Item>

						<Form.Item label="邮箱">
							<Input
								value={safeFormData.email}
								onChange={(e) => updateFormField("email", e.target.value)}
								placeholder="请输入邮箱"
								type="email"
							/>
						</Form.Item>

						<Form.Item label="年龄">
							<InputNumber
								value={safeFormData.age}
								onChange={(value) => updateFormField("age", value || 18)}
								min={1}
								max={120}
								style={{ width: "100%" }}
							/>
						</Form.Item>

						<Form.Item label="描述">
							<Input.TextArea
								value={safeFormData.description}
								onChange={(e) => updateFormField("description", e.target.value)}
								placeholder="请输入描述"
								rows={4}
							/>
						</Form.Item>

						<Form.Item label="状态">
							<Switch
								checked={safeFormData.isActive}
								onChange={(checked) => updateFormField("isActive", checked)}
								checkedChildren="激活"
								unCheckedChildren="禁用"
							/>
						</Form.Item>

						<Form.Item>
							<Space>
								<Button type="primary" onClick={handleFormSubmit}>
									提交表单
								</Button>
								<Button onClick={handleFormReset}>重置表单</Button>
							</Space>
						</Form.Item>
					</Form>

					<Divider />
					<div>
						<Text strong>当前表单数据:</Text>
						<pre
							style={{
								background: "#f5f5f5",
								padding: "12px",
								borderRadius: "4px",
								marginTop: "8px",
								fontSize: "12px",
							}}
						>
							{JSON.stringify(safeFormData, null, 2)}
						</pre>
					</div>
				</Card>

				{/* 使用说明 */}
				<Card title="使用说明">
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Title level={4}>功能特点:</Title>
							<ul>
								<li>
									🔄 <strong>自动保存恢复</strong>: 路由切换时自动保存和恢复页面状态
								</li>
								<li>
									🗂️ <strong>多标签支持</strong>: 每个标签页独立保存状态
								</li>
								<li>
									🧠 <strong>智能内存管理</strong>: 基于 LRU 算法，自动清理最少使用的数据
								</li>
								<li>
									🎯 <strong>类型安全</strong>: 完整的 TypeScript 支持
								</li>
								<li>
									🚀 <strong>简单易用</strong>: 类似 useState 的 API
								</li>
								<li>
									🔧 <strong>灵活配置</strong>: 支持自定义键名和默认值
								</li>
							</ul>
						</div>

						<div>
							<Title level={4}>测试步骤:</Title>
							<ol>
								<li>在上面的表单中填写一些数据</li>
								<li>滚动页面到某个位置并保存滚动位置</li>
								<li>操作计数器</li>
								<li>切换到其他标签页</li>
								<li>再切换回来，观察数据是否被保存</li>
								<li>关闭标签页，对应的缓存会被自动清除</li>
							</ol>
						</div>

						<div>
							<Title level={4}>API 使用:</Title>
							<pre
								style={{
									background: "#f5f5f5",
									padding: "12px",
									borderRadius: "4px",
									fontSize: "12px",
								}}
							>
								{`// 页面状态管理
const [data, setData] = usePageState(defaultValue);

// 滚动位置管理
const [position, setPosition] = usePageScrollPosition();

// 表单状态管理
const { formData, setFormData, updateField } = useFormState(defaultFormData);`}
							</pre>
						</div>
					</Space>
				</Card>

				{/* 占位内容，用于测试滚动 */}
				<Card title="滚动测试区域" bordered={false}>
					<div style={{ height: "800px", background: "linear-gradient(45deg, #f0f2f5, #e6f7ff)" }}>
						<div style={{ padding: "50px", textAlign: "center" }}>
							<Title level={3}>滚动到这里测试滚动位置保存</Title>
							<Paragraph>
								这是一个很长的区域，用于测试滚动位置的保存和恢复功能。 滚动到不同位置，然后使用上面的按钮保存滚动位置。
							</Paragraph>
						</div>
					</div>
				</Card>
			</Space>
		</div>
	);
}
