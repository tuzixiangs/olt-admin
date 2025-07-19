import { GroupInfo } from "@/dict";
import { GLOBAL_CONFIG } from "@/global-config";
import { useSettings } from "@/store/settingStore";
import { useUserPermissions } from "@/store/userStore";
import type { AppRouteObject } from "@/types/router";
import { checkAny } from "@/utils";
import { useMemo } from "react";

// 基础路由数据 - 为文件路径路由提供静态数据
const staticNavData: AppRouteObject[] = [
	{
		path: "/workbench",
		meta: {
			key: "workbench",
			title: "sys.nav.workbench",
			icon: "local:ic-workbench",
		},
	},
	{
		path: "/analysis",
		meta: {
			key: "analysis",
			title: "sys.nav.analysis",
			icon: "local:ic-analysis",
		},
	},
];

/**
 * 递归处理导航数据，过滤掉没有权限的项目
 * @param items 导航项目数组
 * @param permissions 权限列表
 * @returns 过滤后的导航项目数组
 */
const filterItems = (items: AppRouteObject[], permissions: string[]) => {
	return items.filter((item) => {
		// 如果是重定向，则返回 false
		if (item.index) {
			return false;
		}

		// 检查当前项目是否有权限
		const hasPermission = item?.meta?.auth ? checkAny(item.meta.auth, permissions) : true;

		// 如果有子项目，递归处理
		if (item.children?.length) {
			const filteredChildren = filterItems(item.children, permissions);
			// 如果子项目都被过滤掉了，则过滤掉当前项目
			if (filteredChildren.length === 0) {
				return false;
			}
			// 更新子项目
			item.children = filteredChildren;
		}

		return hasPermission;
	});
};

/**
 *
 * 根据权限过滤导航数据
 * @param permissions 权限列表
 * @returns 过滤后的导航数据
 */
const filterNavData = (permissions: string[]) => {
	return staticNavData
		.map((group: AppRouteObject) => {
			// 如果是重定向，则返回 null
			if (group.index) {
				return null;
			}

			// 过滤组内的项目
			const filteredItems = filterItems(group.children || [], permissions);

			// 如果组内没有项目了，返回 null
			if (filteredItems.length === 0 && group.meta?.groupKey) {
				return null;
			}

			// 返回过滤后的组
			return {
				...group,
				children: filteredItems,
			};
		})
		.filter((group): group is NonNullable<typeof group> => group !== null); // 过滤掉空组
};

// 递归排序,如果有子项目,则递归排序子项目
function sort(data: AppRouteObject[]) {
	for (const item of data) {
		if (item.children && item.children.length > 0) {
			item.children = sort(item.children);
		}
	}
	return data.sort((a, b) => {
		return (!a.meta?.groupKey && !a.order ? -1 : a.order || 0) - (!b.meta?.groupKey && !b.order ? -1 : b.order || 0);
	});
}
/**
 * 先判断 isGroup 是否为 true, 如果为 true, 则进行 groupKey 分组, 在根据order排序
 * 如果 isGroup 为 false, 则直接根据order排序
 */
const sortNavData = (navData: AppRouteObject[], isGroup: boolean) => {
	if (!isGroup) {
		return sort(navData);
	}
	// 根据 groupKey 分组，只支持首层分组
	let groupedNavData: AppRouteObject[] = [];
	for (const item of navData) {
		const groupKey = item.meta?.groupKey;
		if (groupKey) {
			const group = groupedNavData.find((g) => g.meta?.groupKey === groupKey);
			if (group) {
				group.children?.push(item);
			} else {
				groupedNavData.push({
					path: `/${groupKey}`,
					order: GroupInfo[groupKey].order,
					meta: {
						key: groupKey,
						title: GroupInfo[groupKey].title,
						groupKey,
						groupName: GroupInfo[groupKey].title,
					},
					children: [item],
				});
			}
		} else {
			groupedNavData.push(item);
		}
		groupedNavData = sort(groupedNavData);
	}
	return groupedNavData;
};

/**
 * 获取过滤和排序后的导航数据
 */
export function useFilteredNavData() {
	const userPermissions = useUserPermissions();
	const { group: groupSetting } = useSettings();

	const filteredData = useMemo(() => {
		// 使用静态数据替代动态路由数据
		const filtered =
			GLOBAL_CONFIG.routerMode === "backend" ? filterNavData(userPermissions.map((p) => p.code)) : staticNavData;

		return sortNavData(filtered, groupSetting);
	}, [userPermissions, groupSetting]);

	return filteredData;
}
