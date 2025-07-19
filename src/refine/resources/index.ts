import type { IResourceItem } from "@refinedev/core";
import { autoCollectedResources, getResourceConfig, resourceNames, resourcesMap } from "./auto-collect";

// 手动配置的资源（可选，用于覆盖或补充自动收集的配置）
const manualResources: IResourceItem[] = [
	// 如果需要手动添加或覆盖某些资源配置，可以在这里添加
];

// 合并自动收集和手动配置的资源
export const resources: IResourceItem[] = [...autoCollectedResources, ...manualResources];

// 导出工具函数
export { autoCollectedResources, resourcesMap, getResourceConfig, resourceNames };
