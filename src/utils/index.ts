import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * merge classnames
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * 优化: 检查项是否存在于资源池中。
 * @param item 要检查的项
 * @param resourcePool 资源池，可以是数组或Set。推荐使用Set以获得O(1)性能。
 */
export const check = (item: string, resourcePool: string[] | Set<string>) => {
	if (resourcePool instanceof Set) {
		return resourcePool.has(item);
	}
	return resourcePool.some((p) => p === item);
};

/**
 * 优化: 检查是否有任意项存在于资源池中。
 * @param items 要检查的项或项数组
 * @param resourcePool 资源池，可以是数组或Set。
 */
export const checkAny = (items: string | string[], resourcePool: string[] | Set<string>) => {
	if (Array.isArray(items)) {
		return items.some((item) => check(item, resourcePool));
	}
	return check(items, resourcePool);
};

/**
 * check if all items exist in resourcePool
 */
export const checkAll = (items: string[], resourcePool: string[]) => items.every((item) => check(item, resourcePool));

/**
 * join url parts
 * @example
 * urlJoin('/admin/', '/api/', '/user/') // '/admin/api/user'
 * urlJoin('/admin', 'api', 'user/')     // '/admin/api/user'
 * urlJoin('/admin/', '', '/user/')      // '/admin/user'
 */
export const urlJoin = (...parts: string[]) => {
	const result = parts
		.map((part) => {
			return part.replace(/^\/+|\/+$/g, ""); // 去除两边/
		})
		.filter(Boolean);
	return `/${result.join("/")}`;
};
