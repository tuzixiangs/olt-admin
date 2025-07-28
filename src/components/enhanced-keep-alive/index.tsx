/**
 * Enhanced KeepAlive System
 *
 * 一个基于 react-activation 的增强型 KeepAlive 解决方案，提供：
 * - 智能缓存策略管理
 * - LRU (Least Recently Used) 算法
 * - 自动过期清理
 * - 缓存数量限制
 * - 可视化管理面板
 * - 开发调试工具
 */

import { useKeepAliveManager } from "@/hooks/use-keep-alive-manager";
import type { ReactNode } from "react";
import KeepAlive from "react-activation";

/**
 * 缓存策略类型
 */
export type CacheStrategy = "always" | "conditional" | "never";

/**
 * 缓存条件函数类型
 */
export type CacheCondition = () => boolean;

/**
 * EnhancedKeepAlive 组件属性
 */
export interface EnhancedKeepAliveProps {
	/** 子组件 */
	children: ReactNode;

	/** 缓存策略 - 'always': 总是缓存, 'conditional': 条件缓存, 'never': 从不缓存 */
	strategy?: CacheStrategy;

	/** 条件缓存的判断函数，仅在 strategy='conditional' 时生效 */
	condition?: CacheCondition;

	/** 自定义缓存名称，不提供则自动生成 */
	cacheName?: string;

	/** 自定义缓存ID，不提供则自动生成 */
	cacheId?: string;

	/** 是否保存滚动位置 */
	saveScrollPosition?: boolean | "screen";

	/** 最大缓存数量，超出时使用 LRU 算法清理 */
	maxCacheCount?: number;

	/** 缓存过期时间（毫秒），0 表示永不过期 */
	expireTime?: number;

	/** 是否启用调试模式 */
	debug?: boolean;

	/** 是否显示调试信息（仅在开发环境生效） */
	showDebugInfo?: boolean;

	/** 组件类名 */
	className?: string;

	/** 组件样式 */
	style?: React.CSSProperties;
}

/**
 * Enhanced KeepAlive 组件
 *
 * 使用示例：
 * ```tsx
 * // 基础用法
 * <EnhancedKeepAlive>
 *   <YourComponent />
 * </EnhancedKeepAlive>
 *
 * // 高级配置
 * <EnhancedKeepAlive
 *   strategy="conditional"
 *   condition={() => user.hasPermission}
 *   maxCacheCount={5}
 *   expireTime={30 * 60 * 1000}
 *   debug={true}
 *   showDebugInfo={true}
 * >
 *   <YourComponent />
 * </EnhancedKeepAlive>
 * ```
 */
export function EnhancedKeepAlive({
	children,
	strategy = "always",
	condition,
	cacheName,
	cacheId,
	saveScrollPosition = "screen",
	maxCacheCount = 10,
	expireTime = 30 * 60 * 1000, // 30分钟
	debug = process.env.NODE_ENV === "development",
	showDebugInfo = false,
	className,
	style,
}: EnhancedKeepAliveProps) {
	const {
		cacheId: managedCacheId,
		cacheName: managedCacheName,
		shouldCache,
		config,
		getCacheStats,
	} = useKeepAliveManager({
		strategy,
		condition,
		saveScrollPosition,
		maxCacheCount,
		expireTime,
		debug,
	});

	const finalCacheId = cacheId || managedCacheId;
	const finalCacheName = cacheName || managedCacheName;

	// 开发环境调试信息
	const debugInfo =
		showDebugInfo && debug && process.env.NODE_ENV === "development" ? (
			<div
				style={{
					position: "fixed",
					top: "10px",
					right: "10px",
					background: "rgba(0, 0, 0, 0.8)",
					color: "white",
					padding: "8px 12px",
					borderRadius: "4px",
					fontSize: "12px",
					zIndex: 9999,
					fontFamily: "monospace",
				}}
			>
				<div>🔧 KeepAlive Debug</div>
				<div>ID: {finalCacheId}</div>
				<div>Name: {finalCacheName}</div>
				<div>Strategy: {config.strategy}</div>
				<div>Should Cache: {shouldCache ? "✅" : "❌"}</div>
				<div>Max Count: {config.maxCacheCount}</div>
				<div>Expire: {config.expireTime ? `${config.expireTime / 1000}s` : "Never"}</div>
				<div>Total Cached: {getCacheStats().total}</div>
			</div>
		) : null;

	return (
		<div className={className} style={style}>
			{debugInfo}
			<KeepAlive id={finalCacheId} name={finalCacheName} when={shouldCache} saveScrollPosition={saveScrollPosition}>
				{children}
			</KeepAlive>
		</div>
	);
}

// 导出相关组件和 Hook
export { useKeepAliveManager };

// 导出 KeepAliveCachePanel 组件
export { KeepAliveCachePanel } from "./cache-panel";

/**
 * 预设配置
 */
export const KeepAlivePresets = {
	/** 默认配置 - 适合大多数场景 */
	default: {
		strategy: "always" as CacheStrategy,
		maxCacheCount: 10,
		expireTime: 30 * 60 * 1000, // 30分钟
		saveScrollPosition: "screen" as const,
	},

	/** 高性能配置 - 适合性能敏感场景 */
	performance: {
		strategy: "conditional" as CacheStrategy,
		condition: () => {
			// 高性能模式下，只在用户有交互行为时才缓存
			// 可以根据实际需求调整条件
			return document.hasFocus() && !document.hidden;
		},
		maxCacheCount: 5,
		expireTime: 10 * 60 * 1000, // 10分钟
		saveScrollPosition: false,
	},

	/** 长期缓存配置 - 适合数据加载耗时的页面 */
	longTerm: {
		strategy: "always" as CacheStrategy,
		maxCacheCount: 20,
		expireTime: 60 * 60 * 1000, // 1小时
		saveScrollPosition: "screen" as const,
	},

	/** 开发调试配置 */
	debug: {
		strategy: "always" as CacheStrategy,
		maxCacheCount: 3,
		expireTime: 5 * 60 * 1000, // 5分钟
		debug: true,
		showDebugInfo: true,
	},
} as const;

/**
 * 使用预设配置的便捷组件
 */
export const DefaultKeepAlive = ({
	children,
	...props
}: Omit<EnhancedKeepAliveProps, keyof typeof KeepAlivePresets.default>) => (
	<EnhancedKeepAlive {...KeepAlivePresets.default} {...props}>
		{children}
	</EnhancedKeepAlive>
);

export const PerformanceKeepAlive = ({
	children,
	...props
}: Omit<EnhancedKeepAliveProps, keyof typeof KeepAlivePresets.performance>) => (
	<EnhancedKeepAlive {...KeepAlivePresets.performance} {...props}>
		{children}
	</EnhancedKeepAlive>
);

export const LongTermKeepAlive = ({
	children,
	...props
}: Omit<EnhancedKeepAliveProps, keyof typeof KeepAlivePresets.longTerm>) => (
	<EnhancedKeepAlive {...KeepAlivePresets.longTerm} {...props}>
		{children}
	</EnhancedKeepAlive>
);

export const DebugKeepAlive = ({
	children,
	...props
}: Omit<EnhancedKeepAliveProps, keyof typeof KeepAlivePresets.debug>) => (
	<EnhancedKeepAlive {...KeepAlivePresets.debug} {...props}>
		{children}
	</EnhancedKeepAlive>
);
