import type { IResourceItem } from "@refinedev/core";

/**
 * 自动收集各模块的 Refine 资源配置
 * 使用 Vite 的 import.meta.glob 功能动态导入所有模块的配置
 */

// 动态导入所有页面模块中的 refine-config.ts 文件
const refineConfigModules = import.meta.glob<{ [key: string]: IResourceItem }>("../../pages/**/refine-config.ts", {
	eager: true,
});

// 提取所有资源配置
export const autoCollectedResources: IResourceItem[] = Object.values(refineConfigModules)
	.flatMap((module) => Object.values(module))
	.filter((resource): resource is IResourceItem => resource && typeof resource === "object" && "name" in resource);

console.log("[ autoCollectedResources ] >", autoCollectedResources);

// 按名称索引的资源配置，便于查找
export const resourcesMap = new Map(autoCollectedResources.map((resource) => [resource.name, resource]));

// 导出特定资源的便捷函数
export const getResourceConfig = (name: string) => resourcesMap.get(name);

// 导出所有资源名称
export const resourceNames = autoCollectedResources.map((resource) => resource.name);
