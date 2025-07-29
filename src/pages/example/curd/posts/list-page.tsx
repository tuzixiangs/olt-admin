import { dialog } from "@/components/olt-modal";
import OltTable from "@/components/olt-table";
import { useProTable } from "@/hooks/use-pro-table";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import type React from "react";

import { toast } from "@/components/olt-toast";
import { useRouter } from "@/routes/hooks";
import { Tooltip } from "antd";
import { statusOptions } from "../dict";
import { fetchPosts } from "./api/index";
import { queryKeys, useDeletePost } from "./hooks";
import type { IPost, PostQueryParams } from "./types";

const PostList: React.FC = () => {
	const { tableProps, refresh } = useProTable<IPost, PostQueryParams>(fetchPosts, {
		queryKey: [queryKeys.lists()],
		defaultPageSize: 10,
	});

	const { push } = useRouter();

	const { mutateAsync: deleteMutate, isPending: isDeleting } = useDeletePost();

	// 显示详情
	const showDetail = (record: IPost) => {
		push(`/curd/pagePosts/detail/${record.id}`);
	};

	// 显示编辑表单
	const showEditForm = (record?: IPost) => {
		push(`/curd/pagePosts/edit/${record?.id}`);
	};

	// 删除确认
	const handleDelete = async (record: IPost) => {
		await dialog.confirm({
			title: "确认删除",
			content: `确定要删除文章 "${record.title}" 吗？此操作不可恢复。`,
			okText: "确认删除",
			cancelText: "取消",
			onOk: async () => {
				await deleteMutate(record.id.toString());
				toast.success("删除成功");
			},
		});
	};

	const columns: ProColumns<IPost>[] = [
		{
			title: "ID",
			dataIndex: "id",
			search: false,
			width: 200,
		},
		{
			title: "标题",
			dataIndex: "title",
			// copyable: true, // 不要使用 copyable 属性，有性能问题[https://github.com/ant-design/ant-design/issues?q=copyable]
			// ellipsis: true, // ellipsis 属性似乎也有性能问题 [https://github.com/ant-design/ant-design/issues/54411]
			render: (_, record) => (
				<Tooltip title={record.title}>
					<div style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
						{record.title}
					</div>
				</Tooltip>
			),
			width: 200,
		},
		{
			title: "内容",
			dataIndex: "content",
			ellipsis: true,
			search: false,
			minWidth: 400,
		},
		{
			title: "状态",
			dataIndex: "status",
			valueType: "select",
			valueEnum: statusOptions,
			width: 100,
			render: (_, record) => (
				<Tag color={record.status === "enable" ? "green" : "red"}>{record.status === "enable" ? "启用" : "禁用"}</Tag>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			valueType: "dateTime",
			search: false,
			width: 180,
		},
		{
			title: "操作",
			dataIndex: "action",
			valueType: "option",
			width: 150,
			render: (_, record) => (
				<div>
					<Button
						type="link"
						size="small"
						onClick={(e) => {
							e.stopPropagation();
							showEditForm(record);
						}}
					>
						编辑
					</Button>
					{/* 隐藏 tab 示例 */}
					<Button
						type="link"
						size="small"
						onClick={(e) => {
							e.stopPropagation();
							push(`/curd/pagePosts/hiddenTabDetail/${record.id}`);
						}}
					>
						详情
					</Button>
					<Button
						type="link"
						danger
						size="small"
						loading={isDeleting}
						onClick={(e) => {
							e.stopPropagation();
							handleDelete(record);
						}}
					>
						删除
					</Button>
				</div>
			),
		},
	];

	return (
		<OltTable<IPost>
			{...tableProps}
			columns={columns}
			rowKey="id"
			autoHeight={true}
			toolBarRender={() => [
				<Button type="primary" key="add" onClick={() => push("/curd/pagePosts/create")}>
					新增文章
				</Button>,
			]}
			onRow={(record) => ({
				onClick: () => showDetail(record),
			})}
			rowClickable={true}
			bordered={true}
			stripe={true}
			options={{
				reload: () => refresh(),
			}}
		/>
	);
};

export default PostList;
