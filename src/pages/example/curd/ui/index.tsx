import OltSteps from "@/components/olt-steps";
import {
	Button,
	Card,
	Cascader,
	Checkbox,
	Col,
	DatePicker,
	Radio,
	Row,
	Select,
	type StepProps,
	Switch,
	Tree,
	TreeSelect,
	type UploadFile,
	message,
} from "antd";

import { Icon } from "@/components/icon";
import { toast } from "@/components/olt-toast";
import { OltImageUpload } from "@/components/olt-upload";
import { useState } from "react";

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

const items: StepProps[] = [
	{
		title: "Login",
		status: "finish",
		description: "This is a description.",
		// icon: <Icon icon="ant-design:check-circle-outlined" size={20} />,
	},
	{
		title: "Verification",
		status: "process",
		description: "This is a description.",
	},
	{
		title: "Pay",
		status: "error",
		description: "This is a description.",
	},
	{
		title: "Done",
		status: "wait",
		description: "This is a description.",
	},
];

// 测试ui规范中的各个组件
export default function CustomUi() {
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleFileListChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};
	const [messageApi, contextHolder] = message.useMessage();
	return (
		<>
			{contextHolder}
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
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">步骤条</div>
					<OltSteps items={items} />
					<OltSteps items={items} progressDot className="!mt-4" />
					<OltSteps items={items} direction="vertical" progressDot className="!mt-4" />
				</Col>
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">上传图片</div>
					<OltImageUpload fileList={fileList} onChange={handleFileListChange} />
				</Col>
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">tree</div>
					<Tree
						checkable={true}
						treeData={treeData.map((node) => ({
							...node,
							key: node.value,
							children: node.children?.map((child) => ({
								...child,
								key: child.value,
								children: child.children?.map((leaf) => ({
									...leaf,
									key: leaf.value,
								})),
							})),
						}))}
					/>
				</Col>
				{/* 时间组件 */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">时间组件</div>
					<DatePicker />
					<DatePicker.RangePicker />
				</Col>
				{/* 开关 */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">开关</div>
					<Switch />
					<Switch disabled value={true} />
				</Col>
				{/* messageApi */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">toaster</div>
					<Button onClick={() => messageApi.open({ content: "成功", type: "success", duration: 1000 * 100 })}>
						成功
					</Button>
					<Button onClick={() => messageApi.error("错误")}>错误</Button>
					<Button onClick={() => messageApi.warning("警告")}>警告</Button>
					<Button onClick={() => messageApi.info("信息")}>信息</Button>
					<Button onClick={() => messageApi.open({ content: "加载中", type: "loading", duration: 1000 * 100 })}>
						加载中
					</Button>
				</Col>
				{/* toast */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">toast</div>
					<Button
						onClick={() =>
							toast.success("成功", {
								description: "description",
								duration: 1000 * 100,
							})
						}
					>
						成功
					</Button>
					<Button onClick={() => toast.error("错误")}>错误</Button>
					<Button onClick={() => toast.warning("警告")}>警告</Button>
					<Button onClick={() => toast.info("信息")}>信息</Button>
					<Button onClick={() => toast.loading("加载中")}>加载中</Button>
				</Col>
				{/* 单选 */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">多选单选</div>
					<Radio.Group>
						<Radio value={1}>选项1</Radio>
						<Radio value={2}>选项2</Radio>
						<Radio disabled value={3}>
							选项3
						</Radio>
						<Radio disabled value={4} defaultChecked>
							选项4
						</Radio>
					</Radio.Group>
				</Col>
				{/* 多选 */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">多选</div>
					<Checkbox.Group value={["4"]}>
						<Checkbox value="1">选项1</Checkbox>
						<Checkbox value="2">选项2</Checkbox>
						<Checkbox value="3" disabled>
							选项3
						</Checkbox>
						<Checkbox value="4" disabled>
							选项4
						</Checkbox>
					</Checkbox.Group>
				</Col>
				{/* 下拉选择 */}
				<Col span={24} className="mb-4">
					<div className="text-text-text14 mb-2 text-lg">下拉选择</div>
					<Select
						placeholder="请选择"
						options={[
							{
								label: "选项1",
								value: "1",
							},
							{
								label: "选项2",
								value: "2",
							},
							{
								label: "选项3",
								value: "3",
							},
						]}
					/>
					{/* 多选 */}
					<Select
						mode="multiple"
						placeholder="请选择"
						className="w-[100px]"
						options={[
							{
								label: "选项1",
								value: "1",
							},
							{
								label: "选项2",
								value: "2",
							},
							{
								label: "选项3",
								value: "3",
							},
						]}
					/>
					{/* 级联选择*/}
					<Cascader
						placeholder="请选择"
						className="w-[100px]"
						options={[
							{
								label: "选项1",
								value: "1",
							},
							{
								label: "选项2",
								value: "2",
							},
							{
								label: "选项3",
								value: "3",
							},
						]}
					/>
					{/* 级联选择多选 */}
					<Cascader
						multiple
						placeholder="请选择"
						className="w-[100px]"
						options={[
							{
								label: "选项1",
								value: "1",
							},
							{
								label: "选项2",
								value: "2",
							},
							{
								label: "选项3",
								value: "3",
							},
						]}
					/>
				</Col>
			</Row>
		</>
	);
}
