import type { TabActionParams } from "@/layouts/dashboard/multi-tabs/types";
import { useRouter } from "@/routes/hooks";
import { BetaSchemaForm, type ProFormColumnsType } from "@ant-design/pro-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { memo } from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { toast } from "sonner";
import { statusOptions } from "../dict";
import { createPost, getPost, queryKeys, updatePost } from "./api";
import type { IPost } from "./types";

const postFormColumns: ProFormColumnsType<IPost>[] = [
	{
		title: "标题",
		dataIndex: "title",
		valueType: "text",
		fieldProps: {
			placeholder: "请输入标题",
		},
		formItemProps: {
			rules: [{ required: true, message: "请输入标题" }],
		},
	},
	{
		title: "内容",
		dataIndex: "content",
		valueType: "textarea",
		fieldProps: {
			placeholder: "请输入内容",
			rows: 4,
		},
		formItemProps: {
			rules: [{ required: true, message: "请输入内容" }],
		},
	},
	{
		title: "状态",
		dataIndex: "status",
		valueType: "select",
		valueEnum: statusOptions,
		formItemProps: {
			rules: [{ required: true, message: "请选择状态" }],
		},
	},
];
export const loader = async ({ params }: LoaderFunctionArgs): Promise<TabActionParams> => {
	const { id } = params as { id: string };
	if (!id) {
		return { editData: {} as IPost };
	}
	const editData = await getPost(id);
	// 利用 loader 中的 tabTitle 和 tabAction 动态更新 tab 的 title
	return { editData, tabTitle: editData.title, tabAction: "join" };
};

/**
 * 文章编辑表单组件
 * 通过 loader 获取数据
 */
const PostEditForm = memo(() => {
	const { editData } = useLoaderData<{ editData: IPost }>();
	const { back } = useRouter();
	const queryClient = useQueryClient();

	// 判断是编辑还是新增
	const isEditing = !!editData?.id;

	const { mutateAsync, isPending } = useMutation({
		mutationFn: (formData: IPost) => {
			if (isEditing && editData) {
				return updatePost(editData.id.toString(), formData);
			}
			return createPost(formData);
		},
		onSuccess: () => {
			toast.success(isEditing ? "更新成功！" : "新增成功！");
			queryClient.invalidateQueries({ queryKey: [queryKeys.posts] });
		},
		onError: (error: any) => {
			toast.error(`${isEditing ? "更新" : "新增"}失败：${error.message || "未知错误"}`);
		},
	});

	const handleFinish = async (formData: IPost) => {
		try {
			await mutateAsync(formData);
			back();
			return true;
		} catch (error) {
			return false;
		}
	};

	// 设置初始值
	const initialValues = editData || {
		title: "",
		content: "",
		status: "enable" as const,
	};

	return (
		<BetaSchemaForm<IPost>
			key={editData?.id?.toString()}
			layoutType="Form"
			columns={postFormColumns}
			initialValues={initialValues}
			onFinish={handleFinish}
			submitter={{
				submitButtonProps: {
					loading: isPending,
					disabled: isPending,
				},
				resetButtonProps: {
					disabled: isPending,
				},
				render: (_, dom) => {
					return (
						<div style={{ textAlign: "right", marginTop: 24 }}>
							<Button onClick={() => back()} type="default" style={{ marginRight: 8 }} disabled={isPending}>
								取消
							</Button>
							{dom[1]}
						</div>
					);
				},
			}}
		/>
	);
});

PostEditForm.displayName = "PostEditForm";

export default PostEditForm;
