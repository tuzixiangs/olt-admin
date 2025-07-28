import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAliveController } from "react-activation";
import { useLocation } from "react-router";

export interface KeepAliveConfig {
	/** 是否启用缓存 */
	enabled?: boolean;
	/** 缓存策略 */
	strategy?: "always" | "conditional" | "never";
	/** 条件函数，当 strategy 为 'conditional' 时使用 */
	condition?: () => boolean;
	/** 是否保存滚动位置 */
	saveScrollPosition?: boolean | "screen";
	/** 缓存最大数量限制 */
	maxCacheCount?: number;
	/** 缓存过期时间（毫秒） */
	expireTime?: number;
	/** 是否在开发环境下显示调试信息 */
	debug?: boolean;
	/** 当 KeepAlive 不可用时是否显示警告 */
	warnOnUnavailable?: boolean;
}

export interface CacheInfo {
	id: string;
	name: string;
	path: string;
	search: string;
	createdAt: number;
	lastAccessAt: number;
	accessCount: number;
}

export type KeepAliveStatus = "available" | "unavailable" | "checking";

const DEFAULT_CONFIG: Required<KeepAliveConfig> = {
	enabled: true,
	strategy: "always",
	condition: () => true,
	saveScrollPosition: "screen",
	maxCacheCount: 10,
	expireTime: 30 * 60 * 1000, // 30分钟
	debug: process.env.NODE_ENV === "development",
	warnOnUnavailable: true,
};

export function useKeepAliveManager(config: KeepAliveConfig = {}) {
	const { pathname, search } = useLocation();
	const aliveController = useAliveController();
	const { drop, dropScope, clear, getCachingNodes } = aliveController;

	const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
	const cacheInfoRef = useRef<Map<string, CacheInfo>>(new Map());
	const debugInfoRef = useRef<string>("");
	const [keepAliveStatus, setKeepAliveStatus] = useState<KeepAliveStatus>("checking");

	// 检测 KeepAlive 是否可用
	const isKeepAliveAvailable = useMemo(() => {
		// 检查 useAliveController 是否返回了有效的实现
		// 通过检查函数是否为默认的空函数来判断
		try {
			if (getCachingNodes && typeof getCachingNodes === "function") {
				const nodes = getCachingNodes();
				const isValid = Array.isArray(nodes);

				const funcStr = getCachingNodes.toString();
				const isNotDefaultEmpty = !funcStr.includes("() => []") && funcStr.length > 20;

				return isValid && (nodes.length > 0 || isNotDefaultEmpty);
			}
			return false;
		} catch (error) {
			// 如果调用出错，说明可能不在 KeepAlive 环境中
			return false;
		}
	}, [getCachingNodes]);

	// 更新 KeepAlive 状态
	useEffect(() => {
		setKeepAliveStatus(isKeepAliveAvailable ? "available" : "unavailable");

		if (finalConfig.debug) {
			console.log(`[KeepAlive] 状态检测: ${isKeepAliveAvailable ? "可用" : "不可用"}`);
		}

		if (!isKeepAliveAvailable && finalConfig.warnOnUnavailable && finalConfig.debug) {
			console.warn(
				"[KeepAlive] 当前组件未被 KeepAlive 包裹，缓存功能将不可用。" +
					"如需使用缓存功能，请确保组件被 <KeepAlive> 包裹。",
			);
		}
	}, [isKeepAliveAvailable, finalConfig.debug, finalConfig.warnOnUnavailable]);

	// 生成缓存 ID
	const cacheId = useMemo(() => `${pathname}${search}`, [pathname, search]);
	const cacheName = useMemo(() => `${cacheId}`, [cacheId]);

	// 判断是否应该缓存
	const shouldCache = useMemo(() => {
		// 首先检查 KeepAlive 是否可用
		if (!isKeepAliveAvailable) return false;
		if (!finalConfig.enabled) return false;

		switch (finalConfig.strategy) {
			case "never":
				return false;
			case "conditional":
				return typeof finalConfig.condition === "function" ? finalConfig.condition() : true;
			default:
				return true;
		}
	}, [isKeepAliveAvailable, finalConfig.enabled, finalConfig.strategy, finalConfig.condition]);

	// 更新缓存信息
	const updateCacheInfo = useCallback(
		(id: string) => {
			const now = Date.now();
			const existing = cacheInfoRef.current.get(id);

			if (existing) {
				existing.lastAccessAt = now;
				existing.accessCount += 1;
			} else {
				cacheInfoRef.current.set(id, {
					id,
					name: cacheName,
					path: pathname,
					search,
					createdAt: now,
					lastAccessAt: now,
					accessCount: 1,
				});
			}
		},
		[cacheName, pathname, search],
	);

	// 清理过期缓存
	const cleanExpiredCache = useCallback(() => {
		if (!isKeepAliveAvailable) {
			if (finalConfig.debug) {
				console.log("[KeepAlive] KeepAlive 不可用，跳过过期缓存清理");
			}
			return;
		}

		const now = Date.now();
		const expiredIds: string[] = [];

		for (const [id, info] of cacheInfoRef.current) {
			if (now - info.lastAccessAt > finalConfig.expireTime) {
				expiredIds.push(id);
			}
		}

		for (const id of expiredIds) {
			if (drop) {
				drop(id);
			}
			cacheInfoRef.current.delete(id);
			if (finalConfig.debug) {
				console.log(`[KeepAlive] 清理过期缓存: ${id}`);
			}
		}
	}, [isKeepAliveAvailable, drop, finalConfig.expireTime, finalConfig.debug]);

	// 限制缓存数量
	const limitCacheCount = useCallback(() => {
		if (!isKeepAliveAvailable) {
			if (finalConfig.debug) {
				console.log("[KeepAlive] KeepAlive 不可用，跳过缓存数量限制");
			}
			return;
		}

		const cacheInfos = Array.from(cacheInfoRef.current.values());
		if (cacheInfos.length <= finalConfig.maxCacheCount) return;

		// 按最后访问时间排序，删除最旧的
		const sortedInfos = cacheInfos.sort((a, b) => a.lastAccessAt - b.lastAccessAt);
		const toRemove = sortedInfos.slice(0, cacheInfos.length - finalConfig.maxCacheCount);

		for (const info of toRemove) {
			if (drop) {
				drop(info.id);
			}
			cacheInfoRef.current.delete(info.id);
			if (finalConfig.debug) {
				console.log(`[KeepAlive] 达到缓存上限，清理缓存: ${info.id}`);
			}
		}
	}, [isKeepAliveAvailable, drop, finalConfig.maxCacheCount, finalConfig.debug]);

	// 手动清理指定缓存
	const clearCache = useCallback(
		(target?: string | RegExp) => {
			if (!isKeepAliveAvailable) {
				if (finalConfig.debug) {
					console.warn("[KeepAlive] KeepAlive 不可用，无法执行缓存清理操作");
				}
				return;
			}

			if (!getCachingNodes || !drop || !clear) {
				if (finalConfig.debug) {
					console.warn("[KeepAlive] 缓存控制器方法不可用");
				}
				return;
			}

			if (!target) {
				// 清理所有缓存
				const allCaches = getCachingNodes();
				if (allCaches.length > 0) {
					clear();
					cacheInfoRef.current.clear();
					if (finalConfig.debug) {
						console.log(`[KeepAlive] 清理所有缓存，共 ${allCaches.length} 个`);
					}
				} else {
					if (finalConfig.debug) {
						console.log("[KeepAlive] 没有缓存需要清理");
					}
				}
				return;
			}

			if (typeof target === "string") {
				// 检查缓存是否存在
				const allCaches = getCachingNodes();
				const cacheExists = allCaches.some((cache) => cache.name === target || cache.id === target);

				if (cacheExists) {
					drop(target);
					cacheInfoRef.current.delete(target);
					if (finalConfig.debug) {
						console.log(`[KeepAlive] 清理指定缓存: ${target}`);
					}
				} else {
					if (finalConfig.debug) {
						console.log(`[KeepAlive] 缓存不存在，无需清理: ${target}`);
					}
				}
			} else {
				// 正则表达式匹配
				const toRemove: string[] = [];
				const allCaches = getCachingNodes();

				for (const cache of allCaches) {
					if (target.test(cache.id || "") || target.test(cache.name || "")) {
						toRemove.push(cache.id || cache.name || "");
					}
				}

				// 同时检查我们的缓存信息
				for (const [id, info] of cacheInfoRef.current) {
					if (target.test(id) || target.test(info.path)) {
						if (!toRemove.includes(id)) {
							toRemove.push(id);
						}
					}
				}

				for (const id of toRemove) {
					drop(id);
					cacheInfoRef.current.delete(id);
				}

				if (finalConfig.debug) {
					console.log(`[KeepAlive] 清理匹配缓存: ${target}, 共 ${toRemove.length} 个`);
				}
			}
		},
		[isKeepAliveAvailable, clear, drop, finalConfig.debug, getCachingNodes],
	);

	// 获取缓存统计信息
	const getCacheStats = useCallback(() => {
		const cacheInfos = Array.from(cacheInfoRef.current.values());
		return {
			total: cacheInfos.length,
			maxCount: finalConfig.maxCacheCount,
			caches: cacheInfos.map((info) => ({
				...info,
				isExpired: Date.now() - info.lastAccessAt > finalConfig.expireTime,
			})),
		};
	}, [finalConfig.maxCacheCount, finalConfig.expireTime]);

	// 刷新当前页面缓存
	const refreshCurrentCache = useCallback(
		(target?: string) => {
			if (!isKeepAliveAvailable) {
				if (finalConfig.debug) {
					console.warn("[KeepAlive] KeepAlive 不可用，无法刷新缓存");
				}
				return;
			}

			if (!target || !drop) {
				if (finalConfig.debug) {
					console.warn("[KeepAlive] 参数或 drop 方法不可用");
				}
				return;
			}

			drop(target || cacheId);
			cacheInfoRef.current.delete(target || cacheId);
			if (finalConfig.debug) {
				console.log(`[KeepAlive] 刷新当前页面缓存: ${target || cacheId}`);
			}
			// 触发重新渲染
			window.location.reload();
		},
		[isKeepAliveAvailable, cacheId, drop, finalConfig.debug],
	);

	// 页面访问时更新缓存信息
	useEffect(() => {
		if (shouldCache && isKeepAliveAvailable) {
			updateCacheInfo(cacheId);
			cleanExpiredCache();
			limitCacheCount();
		}
	}, [cacheId, shouldCache, isKeepAliveAvailable, updateCacheInfo, cleanExpiredCache, limitCacheCount]);

	// 调试信息
	useEffect(() => {
		if (finalConfig.debug) {
			// 只在组件首次挂载或关键配置变化时打印
			const debugInfo = {
				cacheId,
				cacheName,
				shouldCache,
				isKeepAliveAvailable,
				keepAliveStatus,
				strategy: finalConfig.strategy,
				maxCacheCount: finalConfig.maxCacheCount,
			};

			const debugInfoStr = JSON.stringify(debugInfo);
			if (debugInfoRef.current !== debugInfoStr) {
				console.log("[KeepAlive] 配置信息:", debugInfo);
				debugInfoRef.current = debugInfoStr;
			}
		}
	}, [
		cacheId,
		cacheName,
		shouldCache,
		isKeepAliveAvailable,
		keepAliveStatus,
		finalConfig.strategy,
		finalConfig.maxCacheCount,
		finalConfig.debug,
	]);

	return {
		// KeepAlive 状态
		isKeepAliveAvailable,
		keepAliveStatus,

		// 缓存标识
		cacheId,
		cacheName,
		shouldCache,

		// 缓存配置
		config: finalConfig,

		// 缓存操作
		clearCache,
		refreshCurrentCache,

		// 缓存信息
		getCacheStats,

		// 原始控制器方法
		drop: isKeepAliveAvailable ? drop : undefined,
		dropScope: isKeepAliveAvailable ? dropScope : undefined,
		clear: isKeepAliveAvailable ? clear : undefined,
		getCachingNodes: isKeepAliveAvailable ? getCachingNodes : undefined,
	};
}
