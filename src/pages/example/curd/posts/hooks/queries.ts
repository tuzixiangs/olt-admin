/**
 * React Query 查询 Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from ".";
import { fetchPost, fetchPosts } from "../api";
import type { PostQueryParams } from "../types";

/**
 * 获取文章列表
 */
export function usePosts(params: PostQueryParams) {
	return useQuery({
		queryKey: queryKeys.list(params),
		queryFn: () => fetchPosts(params),
		staleTime: 5 * 60 * 1000, // 5分钟
	});
}

/**
 * 获取文章详情
 */
export function usePost(id: string) {
	return useQuery({
		queryKey: queryKeys.detail(id),
		queryFn: () => fetchPost(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // 10分钟
	});
}
