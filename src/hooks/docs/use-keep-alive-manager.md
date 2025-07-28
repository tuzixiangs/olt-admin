# useKeepAliveManager Hook

`useKeepAliveManager` 是一个用于管理 React 应用中 KeepAlive 功能的自定义 hook。它提供了完整的缓存控制机制，包括缓存策略、过期清理、数量限制等功能。

## 导入

```typescript
import { useKeepAliveManager } from '@/hooks/use-keep-alive-manager';
```

## 类型定义

### KeepAliveConfig

配置对象类型，用于控制缓存行为：

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| enabled | `boolean` | `true` | 是否启用缓存 |
| strategy | `"always" \| "conditional" \| "never"` | `"always"` | 缓存策略 |
| condition | `() => boolean` | `() => true` | 条件函数，当 strategy 为 'conditional' 时使用 |
| saveScrollPosition | `boolean \| "screen"` | `"screen"` | 是否保存滚动位置 |
| maxCacheCount | `number` | `10` | 缓存最大数量限制 |
| expireTime | `number` | `30 * 60 * 1000` (30分钟) | 缓存过期时间（毫秒） |
| debug | `boolean` | `process.env.NODE_ENV === "development"` | 是否在开发环境下显示调试信息 |
| warnOnUnavailable | `boolean` | `true` | 当 KeepAlive 不可用时是否显示警告 |

### CacheInfo

缓存信息类型：

| 属性 | 类型 | 描述 |
|------|------|------|
| id | `string` | 缓存唯一标识 |
| name | `string` | 缓存名称 |
| path | `string` | 路径 |
| search | `string` | 查询参数 |
| createdAt | `number` | 创建时间戳 |
| lastAccessAt | `number` | 最后访问时间戳 |
| accessCount | `number` | 访问次数 |

### KeepAliveStatus

KeepAlive 状态类型：

```typescript
"available" | "unavailable" | "checking"
```

## 使用方法

### 基本用法

```typescript
import { useKeepAliveManager } from '@/hooks/use-keep-alive-manager';

function MyComponent() {
  const {
    isKeepAliveAvailable,
    keepAliveStatus,
    cacheId,
    cacheName,
    shouldCache,
    config,
    clearCache,
    refreshCurrentCache,
    getCacheStats
  } = useKeepAliveManager({
    enabled: true,
    strategy: 'always',
    maxCacheCount: 20,
    expireTime: 60 * 60 * 1000 // 1小时
  });

  // 组件逻辑
  return <div>{/* 组件内容 */}</div>;
}
```

### 条件缓存

```typescript
const { shouldCache } = useKeepAliveManager({
  strategy: 'conditional',
  condition: () => {
    // 根据某些条件决定是否缓存
    return someCondition;
  }
});
```

### 禁用缓存

```typescript
const { shouldCache } = useKeepAliveManager({
  enabled: false
});
```

## 返回值

Hook 返回一个对象，包含以下属性和方法：

### 状态属性

| 属性 | 类型 | 描述 |
|------|------|------|
| isKeepAliveAvailable | `boolean` | KeepAlive 是否可用 |
| keepAliveStatus | `KeepAliveStatus` | KeepAlive 状态 |
| cacheId | `string` | 当前页面缓存 ID |
| cacheName | `string` | 当前页面缓存名称 |
| shouldCache | `boolean` | 是否应该缓存当前页面 |

### 配置

| 属性 | 类型 | 描述 |
|------|------|------|
| config | `Required<KeepAliveConfig>` | 最终的配置对象 |

### 方法

#### clearCache

清理缓存的方法：

```typescript
clearCache(): void; // 清理所有缓存
clearCache(target: string): void; // 清理指定缓存
clearCache(target: RegExp): void; // 清理匹配正则表达式的缓存
```

#### refreshCurrentCache

刷新当前页面缓存：

```typescript
refreshCurrentCache(target?: string): void;
```

#### getCacheStats

获取缓存统计信息：

```typescript
getCacheStats(): {
  total: number;
  maxCount: number;
  caches: (CacheInfo & { isExpired: boolean })[];
}
```

### 原始控制器方法

这些方法直接来自 `react-activation` 的 `useAliveController`：

| 方法 | 类型 | 描述 |
|------|------|------|
| drop | `((id: string) => void) \| undefined` | 删除指定缓存 |
| dropScope | `((id: string) => void) \| undefined` | 删除作用域缓存 |
| clear | `(() => void) \| undefined` | 清空所有缓存 |
| getCachingNodes | `(() => Array<{ id?: string; name?: string }>) \| undefined` | 获取缓存节点列表 |

## 缓存策略

### always

默认策略，始终缓存页面。

### conditional

条件缓存，根据 `condition` 函数返回值决定是否缓存。

### never

从不缓存页面。

## 功能特性

### 自动过期清理

Hook 会自动清理超过 `expireTime` 时间未访问的缓存。

### 数量限制

当缓存数量超过 `maxCacheCount` 时，会自动按最后访问时间清除最旧的缓存。

### 调试支持

在开发环境下，可以通过设置 `debug: true` 查看详细的缓存操作日志。

## 注意事项

1. 组件必须被 `react-activation` 的 `<KeepAlive>` 组件包裹才能正常使用缓存功能。
2. 当 KeepAlive 不可用时，所有缓存相关操作都会被忽略。
3. 缓存 ID 基于当前路由的路径和查询参数生成。
4. 在生产环境中，默认不会输出调试日志。

## 示例

### 基础缓存管理组件

```tsx
import React from 'react';
import { useKeepAliveManager } from '@/hooks/use-keep-alive-manager';

const CacheManager: React.FC = () => {
  const { getCacheStats, clearCache, refreshCurrentCache } = useKeepAliveManager({
    debug: true,
    maxCacheCount: 15
  });

  const stats = getCacheStats();

  return (
    <div>
      <h2>缓存管理</h2>
      <p>当前缓存数量: {stats.total}/{stats.maxCount}</p>
      
      <button onClick={() => clearCache()}>
        清空所有缓存
      </button>
      
      <button onClick={() => clearCache(/user/)}>
        清理用户相关缓存
      </button>
      
      <ul>
        {stats.caches.map(cache => (
          <li key={cache.id}>
            {cache.name} - 访问次数: {cache.accessCount}
            {cache.isExpired && ' (已过期)'}
            <button onClick={() => clearCache(cache.id)}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CacheManager;
```