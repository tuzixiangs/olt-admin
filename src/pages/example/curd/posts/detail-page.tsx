import { useMultiTabsContext } from "@/layouts/dashboard/multi-tabs/providers/multi-tabs-provider";
import { useParams, useRouter } from "@/routes/hooks";
import { ProDescriptions } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { memo } from "react";
import { useLocation } from "react-router";
import { getPost } from "./api";
import type { IPost } from "./types";

/**
 * 文章详情组件 - 纯展示组件
 * 通过id获取文章详情
 */
const PostDetail = memo(() => {
	const { updateTabTitle, manualCloseTab } = useMultiTabsContext();
	const { pathname = "" } = useLocation();
	console.log("[ pathname ] >", pathname);

	const { id } = useParams();
	const { back } = useRouter();
	return (
		<div>
			<ProDescriptions
				request={async () => {
					try {
						const res = await getPost(id?.toString() || "");
						// 利用 hook 更新 tab 的 title
						updateTabTitle(pathname, res.title, "join");
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
			<Button
				onClick={() => {
					back();
					manualCloseTab(pathname);
				}}
			>
				返回
			</Button>
		</div>
	);
});

PostDetail.displayName = "PostDetail";

export default PostDetail;
