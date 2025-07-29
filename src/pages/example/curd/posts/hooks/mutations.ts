import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from ".";
import { batchDeletePosts, createPost, deletePost, togglePostStatus, updatePost } from "../api/index";
import type { IPost } from "../types";

/**
 * 创建文章
 */
export function useCreatePost(options?: UseMutationOptions<IPost, Error, Omit<IPost, "id">, unknown>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,
		...options,
		onSuccess: (data, variables, context) => {
			// 内部缓存更新逻辑
			queryClient.invalidateQueries({
				queryKey: queryKeys.lists(),
				exact: false,
			});

			options?.onSuccess?.(data, variables, context);
		},
	});
}

/**
 * 更新文章
 */
export function useUpdatePost(options?: UseMutationOptions<IPost, Error, IPost, unknown>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: IPost) => updatePost(post),
		...options,
		onSuccess: (updatedPost, variables, context) => {
			// 内部缓存更新逻辑
			queryClient.setQueryData(queryKeys.detail(updatedPost.id), updatedPost);

			queryClient.invalidateQueries({
				queryKey: queryKeys.lists(),
				exact: false,
			});

			options?.onSuccess?.(updatedPost, variables, context);
		},
	});
}

/**
 * 删除文章
 */
export function useDeletePost(options?: UseMutationOptions<void, Error, string, unknown>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePost,
		...options,
		onSuccess: (data, deletedId, context) => {
			// 内部缓存更新逻辑
			queryClient.removeQueries({ queryKey: queryKeys.detail(deletedId) });

			queryClient.invalidateQueries({
				queryKey: queryKeys.lists(),
				exact: false,
			});

			options?.onSuccess?.(data, deletedId, context);
		},
	});
}

/**
 * 切换文章状态（乐观更新）
 */
export function useTogglePostStatus(
	options?: UseMutationOptions<IPost, Error, { id: string; status: "enable" | "disable" }, any>,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: "enable" | "disable" }) => togglePostStatus(id, status),
		...options,
		// 乐观更新
		onMutate: async (variables) => {
			const { id, status } = variables;

			const userContext = await options?.onMutate?.(variables);

			// 取消相关的查询以避免冲突
			await queryClient.cancelQueries({ queryKey: queryKeys.detail(id) });

			// 获取当前数据快照
			const previousPost = queryClient.getQueryData<IPost>(queryKeys.detail(id));

			// 乐观更新详情缓存
			if (previousPost) {
				queryClient.setQueryData<IPost>(queryKeys.detail(id), {
					...previousPost,
					status,
				});
			}

			// 返回合并的上下文
			return { previousPost, id, userContext };
		},

		// 成功时更新缓存
		onSuccess: (updatedPost, variables, context) => {
			// 内部缓存更新逻辑
			queryClient.setQueryData(queryKeys.detail(updatedPost.id), updatedPost);

			queryClient.invalidateQueries({
				queryKey: queryKeys.lists(),
				exact: false,
			});

			options?.onSuccess?.(updatedPost, variables, context?.userContext);
		},

		// 错误时回滚
		onError: (error, variables, context) => {
			// 内部回滚逻辑
			if (context?.previousPost) {
				queryClient.setQueryData(queryKeys.detail(context.id), context.previousPost);
			}

			// 调用用户的 onError 回调
			options?.onError?.(error, variables, context?.userContext);
		},
	});
}

/**
 * 批量删除文章
 */
export function useBatchDeletePosts(options?: UseMutationOptions<void, Error, string[], unknown>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: batchDeletePosts,
		...options,
		onSuccess: (data, deletedIds, context) => {
			// 内部缓存更新逻辑
			for (const id of deletedIds) {
				queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
			}

			queryClient.invalidateQueries({
				queryKey: queryKeys.lists(),
				exact: false,
			});

			options?.onSuccess?.(data, deletedIds, context);
		},
	});
}
