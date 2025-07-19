import { Edit } from "@refinedev/antd";
import { useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import type { IProduct } from "./types";

export default function ProductEdit() {
	const {
		formProps,
		saveButtonProps,
		query: queryResult,
	} = useForm<IProduct>({
		resource: "products",
	});
	console.log("[ queryResult ] >", queryResult);
	return (
		<Edit saveButtonProps={saveButtonProps}>
			<Form {...formProps}>
				<Form.Item label="Name" name="name">
					<Input />
				</Form.Item>
				<Form.Item label="Price" name="price">
					<InputNumber />
				</Form.Item>
				<Form.Item label="Description" name="description">
					<Input.TextArea />
				</Form.Item>
			</Form>
		</Edit>
	);
}
