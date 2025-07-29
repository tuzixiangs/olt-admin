import { ProDescriptions } from "@ant-design/pro-components";
import { Tag } from "antd";
import { memo } from "react";
import { fetchPost } from "../api";
import type { IPost } from "../types";

interface PostDetailProps {
	postId: string;
}

/**
 * 文章详情组件 - 纯展示组件
 * 不再使用 forwardRef，通过 props 接收数据
 */
const PostDetail = memo<PostDetailProps>(({ postId }) => {
	return (
		<ProDescriptions
			request={async () => {
				try {
					const res = await fetchPost(postId);
					return {
						success: true,
						data: res,
					};
				} catch (error) {
					console.error("获取文章详情失败:", error);
					return {
						success: false,
						data: null,
					};
				}
			}}
			column={1}
			columns={[
				{
					title: "ID",
					dataIndex: "id",
					valueType: "text",
				},
				{
					title: "标题",
					dataIndex: "title",
					valueType: "text",
					copyable: true,
				},
				{
					title: "内容",
					dataIndex: "content",
					valueType: "text",
				},
				{
					title: "状态",
					dataIndex: "status",
					valueType: "text",
					render: (_, record: IPost) => (
						<Tag color={record.status === "enable" ? "green" : "red"}>
							{record.status === "enable" ? "启用" : "禁用"}
						</Tag>
					),
				},
				{
					title: "创建时间",
					dataIndex: "createdAt",
					valueType: "dateTime",
				},
			]}
		/>
	);
});

PostDetail.displayName = "PostDetail";

export default PostDetail;
