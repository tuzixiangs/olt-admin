import { dialog } from "@/components/dialog";
import { useModal } from "@/components/dialog";
import OltTable from "@/components/olt-table";
import { useProTable } from "@/hooks/use-pro-table";
import type { ProColumns } from "@ant-design/pro-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Tag } from "antd";
import type React from "react";

import { toast } from "sonner";
import { statusOptions } from "../dict";
import { deletePost, getPosts, queryKeys } from "./api";
import PostDetail from "./detail";
import PostEditForm from "./edit";
import type { IPost, PostQueryParams } from "./types";

const PostList: React.FC = () => {
	const { tableProps, refresh } = useProTable<IPost, PostQueryParams>(getPosts, {
		queryKey: [queryKeys.posts],
		defaultPageSize: 10,
	});

	const queryClient = useQueryClient();

	// 详情弹窗管理
	const detailModal = useModal({
		defaultConfig: {
			type: "modal",
			title: "文章详情",
			width: 800,
			footer: null,
		},
	});

	// 编辑弹窗管理
	const editModal = useModal({
		defaultConfig: {
			type: "drawer",
			title: "编辑文章",
			width: 600,
			destroyOnClose: true,
			footer: null,
		},
	});

	const { mutateAsync: deleteMutate, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => deletePost(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.posts] });
		},
		onError: (error: any) => {
			toast.error(`删除失败：${error.message || "未知错误"}`);
		},
	});

	// 显示详情
	const showDetail = (record: IPost) => {
		detailModal.open({
			content: <PostDetail postId={record.id} />,
		});
	};

	// 显示编辑表单
	const showEditForm = (record?: IPost) => {
		editModal.open({
			title: record ? "编辑文章" : "新增文章",
			content: (
				<PostEditForm
					editData={record}
					onSuccess={() => {
						console.log("onSuccess");
						editModal.close();
					}}
					onCancel={editModal.close}
				/>
			),
		});
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
			copyable: true,
			ellipsis: true,
			width: 400,
		},
		{
			title: "内容",
			dataIndex: "content",
			ellipsis: true,
			search: false,
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
				<Button type="primary" key="add" onClick={() => showEditForm()}>
					新增文章
				</Button>,
			]}
			onRow={(record) => ({
				onClick: () => showDetail(record),
				style: { cursor: "pointer" },
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
