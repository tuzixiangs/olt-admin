import fakeClient from "@/api/fakeClient";
import type { IListResult, IPost, PostQueryParams } from "../types";

/**
 * 获取文章列表
 */
export async function fetchPosts(params: PostQueryParams): Promise<IListResult<IPost>> {
	return fakeClient.get<IListResult<IPost>>({
		url: "/curd",
		params,
	});
}

/**
 * 获取文章详情
 */
export async function fetchPost(id: string): Promise<IPost> {
	return fakeClient.get<IPost>({
		url: `/curd/${id}`,
	});
}

/**
 * 创建文章
 */
export async function createPost(data: Omit<IPost, "id">): Promise<IPost> {
	return fakeClient.post<IPost>({
		url: "/curd",
		data,
	});
}

/**
 * 更新文章
 */
export async function updatePost(data: Partial<IPost>): Promise<IPost> {
	return fakeClient.put<IPost>({
		url: `/curd/${data.id}`,
		data,
	});
}

/**
 * 删除文章
 */
export async function deletePost(id: string): Promise<void> {
	await fakeClient.delete({
		url: `/curd/${id}`,
	});
}

/**
 * 批量删除文章
 */
export async function batchDeletePosts(ids: string[]): Promise<void> {
	await Promise.all(ids.map((id) => deletePost(id)));
}

/**
 * 切换文章状态
 */
export async function togglePostStatus(id: string, status: "enable" | "disable"): Promise<IPost> {
	return updatePost({ id, status });
}
