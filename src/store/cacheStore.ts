import { uniqueId } from "lodash-es";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router";
import { create } from "zustand";

// 分页参数类型
interface PaginationParams {
	current?: number;
	pageSize?: number;
	filters?: any;
	sorter?: any;
	extra?: any;
}

// 缓存的参数类型
type CachedParams<TParams = any> = [PaginationParams, TParams?];

// 缓存配置类型
interface CacheConfig {
	maxCacheCount: number; // 最大缓存数量
	expireTime: number; // 过期时间（毫秒）
	debug: boolean; // 调试模式
	autoCleanup: boolean; // 是否自动清理
	cleanupInterval: number; // 清理间隔（毫秒）
}

// 默认配置
const DEFAULT_CACHE_CONFIG: CacheConfig = {
	maxCacheCount: 20,
	expireTime: 30 * 60 * 1000, // 30分钟
	debug: false,
	autoCleanup: true,
	cleanupInterval: 5 * 60 * 1000, // 5分钟
};

// 缓存信息类型
interface CacheInfo<TParams = any> {
	params: CachedParams<TParams>;
	timestamp: number; // 创建时间
	lastAccessAt: number; // 最后访问时间
	accessCount: number; // 访问次数
	path: string;
	customKey?: string; // 自定义键
}

/**
 * 生成缓存键
 */
function generateCacheKey(pathname: string, search?: string): string {
	return search ? `${pathname}${search}` : pathname;
}

type ParamsCacheStore = {
	// 缓存数据：路径 -> 缓存信息
	cache: Map<string, CacheInfo>;
	// 缓存配置
	config: CacheConfig;
	// 清理定时器
	cleanupTimer: NodeJS.Timeout | null;

	// actions 命名空间
	actions: {
		// 基础缓存操作
		setCachedParams: <TParams = any>(params: CachedParams<TParams>, customKey?: string, path?: string) => void;
		getCachedParams: <TParams = any>(customKey?: string, path?: string) => CachedParams<TParams> | null;
		clearCachedParams: (customKey?: string, path?: string) => void;
		hasCachedParams: (customKey?: string, path?: string) => boolean;

		// 批量操作
		clearCachedParamsByPaths: (paths: string[]) => void;
		clearCachedParamsByKeys: (keys: string[]) => void;
		clearAllCachedParams: () => void;

		// 查询操作
		getCachedPaths: () => string[];
		getCachedKeys: () => string[];
		getCacheStats: () => {
			total: number;
			caches: Array<{
				key: string;
				path: string;
				timestamp: number;
				lastAccessAt: number;
				accessCount: number;
				isExpired: boolean;
				params: CachedParams;
			}>;
		};

		// LRU 和自动管理
		cleanExpiredCache: () => number;
		limitCacheCount: () => number;
		updateCacheConfig: (newConfig: Partial<CacheConfig>) => void;
		startAutoCleanup: () => void;
		stopAutoCleanup: () => void;

		// 内部方法
		_generateKey: (customKey?: string, path?: string) => string;
		_updateAccessInfo: (key: string) => void;
	};
};

const useParamsCacheStore = create<ParamsCacheStore>((set, get) => ({
	cache: new Map(),
	config: { ...DEFAULT_CACHE_CONFIG },
	cleanupTimer: null,

	actions: {
		// 生成缓存键（内部方法）
		_generateKey: (customKey?: string, path?: string) => {
			if (customKey) return customKey;
			if (path) return path;
			return uniqueId();
		},

		// 更新访问信息（内部方法）
		_updateAccessInfo: (key: string) => {
			set((state) => {
				const newCache = new Map(state.cache);
				const cacheInfo = newCache.get(key);
				if (cacheInfo) {
					cacheInfo.lastAccessAt = Date.now();
					cacheInfo.accessCount += 1;
					newCache.set(key, cacheInfo);
				}
				return { cache: newCache };
			});
		},

		setCachedParams: <TParams = any>(params: CachedParams<TParams>, customKey?: string, path?: string) => {
			const { _generateKey } = get().actions;
			const key = _generateKey(customKey, path);

			set((state) => {
				const newCache = new Map(state.cache);
				const now = Date.now();

				newCache.set(key, {
					params,
					timestamp: now,
					lastAccessAt: now,
					accessCount: 1,
					path: path || key,
					customKey,
				});

				if (state.config.debug) {
					console.log(`[ParamsCache] 设置缓存: ${key}`, params);
				}

				return { cache: newCache };
			});

			// 设置后自动清理
			const { config } = get();
			if (config.autoCleanup) {
				const { cleanExpiredCache, limitCacheCount } = get().actions;
				cleanExpiredCache();
				limitCacheCount();
			}
		},

		getCachedParams: <TParams = any>(customKey?: string, path?: string): CachedParams<TParams> | null => {
			const { _generateKey, _updateAccessInfo } = get().actions;
			const key = _generateKey(customKey, path);
			const cacheInfo = get().cache.get(key);

			if (cacheInfo) {
				// 检查是否过期
				const { config } = get();
				const now = Date.now();
				if (now - cacheInfo.lastAccessAt > config.expireTime) {
					// 过期了，删除并返回 null
					set((state) => {
						const newCache = new Map(state.cache);
						newCache.delete(key);
						if (state.config.debug) {
							console.log(`[ParamsCache] 缓存已过期，自动删除: ${key}`);
						}
						return { cache: newCache };
					});
					return null;
				}

				// 更新访问信息
				_updateAccessInfo(key);

				if (get().config.debug) {
					console.log(`[ParamsCache] 获取缓存: ${key}`, cacheInfo.params);
				}

				return cacheInfo.params as CachedParams<TParams>;
			}

			return null;
		},

		clearCachedParams: (customKey?: string, path?: string) => {
			const { _generateKey } = get().actions;
			const key = _generateKey(customKey, path);

			set((state) => {
				const newCache = new Map(state.cache);
				const deleted = newCache.delete(key);

				if (state.config.debug && deleted) {
					console.log(`[ParamsCache] 清除缓存: ${key}`);
				}

				return { cache: newCache };
			});
		},

		hasCachedParams: (customKey?: string, path?: string) => {
			const { _generateKey } = get().actions;
			const key = _generateKey(customKey, path);
			return get().cache.has(key);
		},

		clearCachedParamsByPaths: (paths: string[]) => {
			set((state) => {
				const newCache = new Map(state.cache);
				let deletedCount = 0;

				for (const path of paths) {
					if (newCache.delete(path)) {
						deletedCount++;
					}
				}

				if (state.config.debug && deletedCount > 0) {
					console.log(`[ParamsCache] 批量清除路径缓存: ${deletedCount} 个`);
				}

				return { cache: newCache };
			});
		},

		clearCachedParamsByKeys: (keys: string[]) => {
			set((state) => {
				const newCache = new Map(state.cache);
				let deletedCount = 0;

				for (const key of keys) {
					if (newCache.delete(key)) {
						deletedCount++;
					}
				}

				if (state.config.debug && deletedCount > 0) {
					console.log(`[ParamsCache] 批量清除键缓存: ${deletedCount} 个`);
				}

				return { cache: newCache };
			});
		},

		clearAllCachedParams: () => {
			set((state) => {
				const count = state.cache.size;
				if (state.config.debug && count > 0) {
					console.log(`[ParamsCache] 清除所有缓存: ${count} 个`);
				}
				return { cache: new Map() };
			});
		},

		getCachedPaths: () => {
			return Array.from(get().cache.values()).map((info) => info.path);
		},

		getCachedKeys: () => {
			return Array.from(get().cache.keys());
		},

		getCacheStats: () => {
			const cache = get().cache;
			const config = get().config;
			const now = Date.now();

			const caches = Array.from(cache.entries()).map(([key, info]) => ({
				key,
				path: info.path,
				timestamp: info.timestamp,
				lastAccessAt: info.lastAccessAt,
				accessCount: info.accessCount,
				isExpired: now - info.lastAccessAt > config.expireTime,
				params: info.params,
			}));

			return {
				total: cache.size,
				caches,
			};
		},

		// LRU 清理过期缓存
		cleanExpiredCache: () => {
			const { config, cache } = get();
			const now = Date.now();
			const expiredKeys: string[] = [];

			for (const [key, info] of cache) {
				if (now - info.lastAccessAt > config.expireTime) {
					expiredKeys.push(key);
				}
			}

			if (expiredKeys.length > 0) {
				set((state) => {
					const newCache = new Map(state.cache);
					for (const key of expiredKeys) {
						newCache.delete(key);
					}

					if (state.config.debug) {
						console.log(`[ParamsCache] 清理过期缓存: ${expiredKeys.length} 个`);
					}

					return { cache: newCache };
				});
			}

			return expiredKeys.length;
		},

		// LRU 限制缓存数量
		limitCacheCount: () => {
			const { config, cache } = get();
			const cacheArray = Array.from(cache.entries());

			if (cacheArray.length <= config.maxCacheCount) {
				return 0;
			}

			// 按最后访问时间排序，删除最旧的
			const sortedCaches = cacheArray
				.map(([key, info]) => ({ key, info }))
				.sort((a, b) => a.info.lastAccessAt - b.info.lastAccessAt);

			const toRemove = sortedCaches.slice(0, cacheArray.length - config.maxCacheCount);
			const keysToRemove = toRemove.map((item) => item.key);

			if (keysToRemove.length > 0) {
				set((state) => {
					const newCache = new Map(state.cache);
					for (const key of keysToRemove) {
						newCache.delete(key);
					}

					if (state.config.debug) {
						console.log(`[ParamsCache] 达到缓存上限，清理最旧缓存: ${keysToRemove.length} 个`);
					}

					return { cache: newCache };
				});
			}

			return keysToRemove.length;
		},

		updateCacheConfig: (newConfig: Partial<CacheConfig>) => {
			set((state) => {
				const updatedConfig = { ...state.config, ...newConfig };

				if (state.config.debug) {
					console.log("[ParamsCache] 更新配置:", newConfig);
				}

				// 如果自动清理设置发生变化，重新启动定时器
				if (newConfig.autoCleanup !== undefined || newConfig.cleanupInterval !== undefined) {
					const { stopAutoCleanup, startAutoCleanup } = get().actions;
					stopAutoCleanup();
					if (updatedConfig.autoCleanup) {
						startAutoCleanup();
					}
				}

				return { config: updatedConfig };
			});
		},

		startAutoCleanup: () => {
			const { config } = get();
			const { stopAutoCleanup, cleanExpiredCache, limitCacheCount } = get().actions;

			// 先停止现有定时器
			stopAutoCleanup();

			if (config.autoCleanup) {
				const timer = setInterval(() => {
					const expiredCount = cleanExpiredCache();
					const limitedCount = limitCacheCount();

					if (config.debug && (expiredCount > 0 || limitedCount > 0)) {
						console.log(`[ParamsCache] 自动清理完成 - 过期: ${expiredCount}, 超限: ${limitedCount}`);
					}
				}, config.cleanupInterval);

				set({ cleanupTimer: timer });

				if (config.debug) {
					console.log(`[ParamsCache] 启动自动清理，间隔: ${config.cleanupInterval}ms`);
				}
			}
		},

		stopAutoCleanup: () => {
			const { cleanupTimer, config } = get();
			if (cleanupTimer) {
				clearInterval(cleanupTimer);
				set({ cleanupTimer: null });

				if (config.debug) {
					console.log("[ParamsCache] 停止自动清理");
				}
			}
		},
	},
}));

// 导出 actions 的便捷访问器
export const useParamsCacheActions = () => useParamsCacheStore((state) => state.actions);
export const useParamsCacheConfig = () => useParamsCacheStore((state) => state.config);

export function useParamsCache<TParams = any>() {
	const { pathname, search } = useLocation();
	const actions = useParamsCacheActions();
	const config = useParamsCacheConfig();

	// 生成当前页面的缓存键
	const getCacheKey = useCallback(() => {
		return generateCacheKey(pathname, search);
	}, [pathname, search]);

	// 获取缓存的参数
	const getCachedParams = useCallback(
		(customKey?: string): CachedParams<TParams> | null => {
			const key = customKey || getCacheKey();
			return actions.getCachedParams<TParams>(customKey, customKey ? undefined : key);
		},
		[getCacheKey, actions],
	);

	// 设置缓存参数
	const setCachedParams = useCallback(
		(params: CachedParams<TParams>, customKey?: string) => {
			const key = customKey || getCacheKey();
			actions.setCachedParams(params, customKey, customKey ? undefined : key);
		},
		[getCacheKey, actions],
	);

	// 清除指定路径的缓存
	const clearCachedParams = useCallback(
		(customKey?: string) => {
			const key = customKey || getCacheKey();
			actions.clearCachedParams(customKey, customKey ? undefined : key);
		},
		[getCacheKey, actions],
	);

	// 检查指定路径是否有缓存
	const hasCachedParams = useCallback(
		(customKey?: string): boolean => {
			const key = customKey || getCacheKey();
			return actions.hasCachedParams(customKey, customKey ? undefined : key);
		},
		[getCacheKey, actions],
	);

	// 清除所有缓存
	const clearAllCachedParams = useCallback(() => {
		actions.clearAllCachedParams();
	}, [actions]);

	// 获取所有缓存的路径
	const getCachedPaths = useCallback((): string[] => {
		return actions.getCachedPaths();
	}, [actions]);

	// 获取缓存统计信息
	const getCacheStats = useCallback(() => {
		return actions.getCacheStats();
	}, [actions]);

	// 更新缓存配置
	const updateCacheConfig = useCallback(
		(newConfig: Partial<CacheConfig>) => {
			actions.updateCacheConfig(newConfig);
		},
		[actions],
	);

	// 手动清理
	const cleanExpiredCache = useCallback(() => {
		return actions.cleanExpiredCache();
	}, [actions]);

	const limitCacheCount = useCallback(() => {
		return actions.limitCacheCount();
	}, [actions]);

	// 启动自动清理（组件挂载时）
	useEffect(() => {
		if (config.autoCleanup) {
			actions.startAutoCleanup();
		}

		// 组件卸载时停止自动清理
		return () => {
			actions.stopAutoCleanup();
		};
	}, [actions, config.autoCleanup]);

	return {
		// 基础操作（支持自定义 key）
		getCachedParams,
		setCachedParams,
		clearCachedParams,
		hasCachedParams,

		// 批量操作
		clearAllCachedParams,
		getCachedPaths,

		// 统计和管理
		getCacheStats,
		updateCacheConfig,
		cleanExpiredCache,
		limitCacheCount,

		// 当前信息
		currentPath: getCacheKey(),
		config,
	};
}
