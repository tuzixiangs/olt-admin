import { EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import type { IProduct } from "./types";

export default function ProductList() {
	const { tableProps } = useTable<IProduct>({
		resource: "products",
	});
	console.log("[ tableProps ] >", tableProps);

	return (
		<List>
			<Table {...tableProps} rowKey="id">
				<Table.Column dataIndex="id" title="Id" />
				<Table.Column dataIndex="name" title="Name" />
				<Table.Column dataIndex="price" title="Price" />
				<Table.Column
					title="Actions"
					dataIndex="actions"
					render={(_, record: BaseRecord) => (
						<Space>
							<ShowButton hideText size="small" recordItemId={record.id} />
							<EditButton hideText size="small" recordItemId={record.id} />
						</Space>
					)}
				/>
			</Table>
		</List>
	);
}
