import { Button, Card, Col, Row, TreeSelect } from "antd";

import { Icon } from "@/components/icon";

const treeData = [
	{
		value: "parent 1",
		title: "parent 1",
		children: [
			{
				value: "parent 1-0",
				title: "parent 1-0",
				children: [
					{
						value: "leaf1",
						title: "leaf1",
					},
					{
						value: "leaf2",
						title: "leaf2",
					},
					{
						value: "leaf3",
						title: "leaf3",
					},
					{
						value: "leaf4",
						title: "leaf4",
					},
					{
						value: "leaf5",
						title: "leaf5",
					},
					{
						value: "leaf6",
						title: "leaf6",
					},
				],
			},
			{
				value: "parent 1-1",
				title: "parent 1-1",
				children: [
					{
						value: "leaf11",
						title: <b style={{ color: "#08c" }}>leaf11</b>,
					},
				],
			},
		],
	},
];
// 测试ui规范中的各个组件
export default function CustomUi() {
	return (
		<Row gutter={16}>
			<Col span={24} className="mb-4">
				<div className="text-text-text14 mb-2 text-lg">基础按钮</div>
				<div className="flex items-center gap-2">
					<Button color="primary" variant="solid">
						Primary
					</Button>
					<Button color="default" variant="filled">
						Filled
					</Button>
					<Button color="default" variant="outlined">
						Outlined
					</Button>
					<Button color="default" variant="dashed">
						Dashed
					</Button>
					<Button color="default" variant="text">
						Text
					</Button>
				</div>
			</Col>
			<Col span={24} className="mb-4">
				<div className="text-text-text14 mb-2 text-lg">图标按钮</div>
				<div className="flex items-center gap-2">
					<Button type="primary" icon={<Icon icon="ant-design:plus-outlined" />}>
						新建任务
					</Button>
					<Button color="default" icon={<Icon icon="ant-design:upload-outlined" />}>
						上传文件
					</Button>
				</div>
			</Col>
			<Col span={24} className="mb-4">
				<div className="text-text-text14 mb-2 text-lg">幽灵按钮</div>
				<div className="flex items-center gap-2 bg-sidebar-foreground">
					<Button type="primary" ghost>
						Primary
					</Button>
					<Button ghost>Default</Button>
					<Button type="dashed" ghost>
						Dashed
					</Button>
					<Button type="primary" danger ghost>
						Danger
					</Button>
				</div>
			</Col>
			<Col span={24} className="mb-4">
				<div className="text-text-text14 mb-2 text-lg">按钮主题</div>
				<div className="flex items-center gap-2 mb-4">
					<div className="text-text-secondary">默认填充色</div>
					<Button color="default" variant="solid">
						solid
					</Button>
					<Button color="default" variant="filled">
						filled
					</Button>
					<Button color="default" variant="outlined">
						outlined
					</Button>
					<Button color="default" variant="dashed">
						dashed
					</Button>
					<Button color="default" variant="text">
						text
					</Button>
					<Button color="default" variant="link">
						Link
					</Button>
				</div>
				<div className="flex items-center gap-2 mb-4">
					<div className="text-text-secondary">品牌色</div>
					<Button color="primary" variant="solid">
						solid
					</Button>
					<Button color="primary" variant="filled">
						filled
					</Button>
					<Button color="primary" variant="outlined">
						outlined
					</Button>
					<Button color="primary" variant="dashed">
						dashed
					</Button>
					<Button color="primary" variant="text">
						text
					</Button>
					<Button color="primary" variant="link">
						link
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<div className="text-text-secondary">错误色</div>
					<Button color="danger" variant="solid">
						danger
					</Button>
					<Button color="danger" variant="filled">
						filled
					</Button>
					<Button color="danger" variant="outlined">
						outlined
					</Button>
					<Button color="danger" variant="dashed">
						dashed
					</Button>
					<Button color="danger" variant="text">
						text
					</Button>
					<Button color="danger" variant="link">
						link
					</Button>
				</div>
			</Col>
			<Col span={24} className="mb-4">
				<Card className="shadow-default">
					<div>shadow</div>
				</Card>
			</Col>
			<Col span={24} className="mb-4">
				<div className="text-text-text14 mb-2 text-lg">TreeSelect</div>
				<TreeSelect showSearch style={{ width: "100%" }} treeData={treeData} />
			</Col>
		</Row>
	);
}
