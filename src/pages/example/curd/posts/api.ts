import fakeClient from "@/api/fakeClient";
import type { IListResult, IPost, PostQueryParams } from "./types";

/**
 * react-query queryKey 命名空间, 避免 queryKey 冲突, 请求通过 queryKey 更新缓存, 保持唯一性
 */
export const queryKeys = {
	posts: ["curd", "posts"],
};

export const getPosts = (params: PostQueryParams) => fakeClient.get<IListResult<IPost>>({ url: "/curd", params });

export const getPost = (id: string) => fakeClient.get<IPost>({ url: `/curd/${id}` });

export const createPost = (data: IPost) => fakeClient.post({ url: "/curd", data });

export const updatePost = (id: string, data: IPost) => fakeClient.put({ url: `/curd/${id}`, data });

export const deletePost = (id: string) => fakeClient.delete({ url: `/curd/${id}` });
