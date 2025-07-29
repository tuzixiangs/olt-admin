/**
 * Posts API 模块常量定义
 */

// 模块命名空间 - 基于文件路径，避免与其他模块冲突
export const MODULE_NAMESPACE = ["pages", "example", "curd", "posts"];

// 查询键工厂 - 使用命名空间前缀
export const createQueryKeys = () => ({
	all: () => [...MODULE_NAMESPACE],
	lists: () => [...MODULE_NAMESPACE, "list"],
	list: (params: any) => [...MODULE_NAMESPACE, "list", params],
	details: () => [...MODULE_NAMESPACE, "detail"],
	detail: (id: string) => [...MODULE_NAMESPACE, "detail", id],
});

export const queryKeys = createQueryKeys();
