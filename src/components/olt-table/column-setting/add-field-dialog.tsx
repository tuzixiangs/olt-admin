import { Icon } from "@/components/icon";
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from "antd";
import { useEffect } from "react";
import type { AddFieldFormData } from "./types";

interface AddFieldDialogProps {
	visible: boolean;
	onOk: (data: AddFieldFormData) => void;
	onCancel: () => void;
	existingKeys: string[];
}

const AddFieldDialog = ({ visible, onOk, onCancel, existingKeys }: AddFieldDialogProps) => {
	const [form] = Form.useForm<AddFieldFormData>();

	useEffect(() => {
		if (visible) {
			form.resetFields();
		}
	}, [visible, form]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			onOk(values);
			form.resetFields();
		} catch (error) {
			console.error("表单验证失败:", error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	// 字段类型选项
	const fieldTypeOptions = [
		{ label: "文本", value: "text", icon: "material-symbols:text-fields" },
		{ label: "数字", value: "number", icon: "material-symbols:123" },
		{ label: "日期", value: "date", icon: "material-symbols:calendar-today" },
		{ label: "选择", value: "select", icon: "material-symbols:list" },
		{ label: "自定义", value: "custom", icon: "material-symbols:code" },
	];

	return (
		<Modal
			title={
				<div className="flex items-center gap-2">
					<Icon icon="material-symbols:add-circle-outline" className="text-blue-500" />
					<span>新增字段</span>
				</div>
			}
			open={visible}
			onOk={handleOk}
			onCancel={handleCancel}
			width={600}
			destroyOnClose
			footer={[
				<Button key="cancel" onClick={handleCancel}>
					取消
				</Button>,
				<Button key="ok" type="primary" onClick={handleOk}>
					确定
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" requiredMark={false} className="mt-4">
				<div className="grid grid-cols-2 gap-4">
					<Form.Item
						label="字段标识"
						name="key"
						rules={[
							{ required: true, message: "请输入字段标识" },
							{ pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: "只能包含字母、数字和下划线，且以字母开头" },
							{
								validator: (_, value) => {
									if (value && existingKeys.includes(value)) {
										return Promise.reject(new Error("字段标识已存在"));
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input
							placeholder="例如: customField1"
							prefix={<Icon icon="material-symbols:key" className="text-gray-400" />}
						/>
					</Form.Item>

					<Form.Item label="字段名称" name="title" rules={[{ required: true, message: "请输入字段名称" }]}>
						<Input
							placeholder="例如: 自定义字段"
							prefix={<Icon icon="material-symbols:label" className="text-gray-400" />}
						/>
					</Form.Item>
				</div>

				<Form.Item
					label="数据索引"
					name="dataIndex"
					rules={[{ required: true, message: "请输入数据索引" }]}
					tooltip="对应数据对象中的属性名"
				>
					<Input
						placeholder="例如: custom_field"
						prefix={<Icon icon="material-symbols:database" className="text-gray-400" />}
					/>
				</Form.Item>

				<Form.Item
					label="字段类型"
					name="type"
					initialValue="text"
					rules={[{ required: true, message: "请选择字段类型" }]}
				>
					<Radio.Group className="w-full">
						<div className="grid grid-cols-3 gap-2">
							{fieldTypeOptions.map((option) => (
								<Radio.Button key={option.value} value={option.value} className="flex items-center justify-center">
									<div className="flex items-center justify-center gap-1 h-full">
										<Icon icon={option.icon} className="text-lg" />
										<span className="text-xs">{option.label}</span>
									</div>
								</Radio.Button>
							))}
						</div>
					</Radio.Group>
				</Form.Item>

				<div className="grid grid-cols-2 gap-4">
					<Form.Item label="列宽度" name="width" tooltip="留空则自动适应">
						<InputNumber placeholder="像素值" min={50} max={1000} className="w-full" addonAfter="px" />
					</Form.Item>

					<Form.Item label="固定位置" name="fixed" tooltip="固定在表格左侧或右侧">
						<Select
							placeholder="选择固定位置"
							allowClear
							options={[
								{ label: "固定在左侧", value: "left" },
								{ label: "固定在右侧", value: "right" },
							]}
						/>
					</Form.Item>
				</div>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
					<div className="flex items-start gap-2">
						<Icon icon="material-symbols:info" className="text-blue-500 mt-0.5 flex-shrink-0" />
						<div className="text-sm text-blue-700">
							<div className="font-medium mb-1">提示：</div>
							<ul className="space-y-1 text-xs">
								<li>• 字段标识必须唯一，且只能包含字母、数字和下划线</li>
								<li>• 数据索引对应数据源中的属性名</li>
								<li>• 自定义类型字段需要后续配置渲染函数</li>
							</ul>
						</div>
					</div>
				</div>
			</Form>
		</Modal>
	);
};

export default AddFieldDialog;
