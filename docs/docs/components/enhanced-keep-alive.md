# Enhanced KeepAlive 组件文档

## 概述

Enhanced KeepAlive 是一个基于 `react-activation` 的增强版 KeepAlive 组件，提供了智能缓存管理、LRU 算法、自动过期清理等高级功能。

## 功能特性

### 🚀 核心功能

- **智能缓存策略**: 支持 `always`、`conditional`、`never` 三种缓存策略
- **LRU 算法**: 自动管理缓存数量，超出限制时清理最久未使用的缓存
- **自动过期**: 支持设置缓存过期时间，自动清理过期缓存
- **可视化管理**: 提供缓存管理面板，实时查看和管理缓存状态
- **开发调试**: 内置调试模式，方便开发时查看缓存行为

### 📊 缓存统计

- 当前缓存数量
- 最大缓存限制
- 缓存命中率
- 内存使用情况

## 安装和导入

```typescript
import { 
  EnhancedKeepAlive, 
  KeepAliveCachePanel, 
  useKeepAliveManager,
  KeepAlivePresets 
} from '@/components/enhanced-keep-alive';
```

## 基础使用

### 1. 基本用法

```typescript
import { EnhancedKeepAlive } from '@/components/enhanced-keep-alive';

function App() {
  return (
    <EnhancedKeepAlive>
      <YourComponent />
    </EnhancedKeepAlive>
  );
}
```

### 2. 自定义配置

```typescript
<EnhancedKeepAlive
  strategy="conditional"
  maxCacheCount={10}
  expireTime={30 * 60 * 1000} // 30分钟
  debug={true}
  when={(location) => location.pathname !== '/login'}
>
  <YourComponent />
</EnhancedKeepAlive>
```

## 配置选项

### EnhancedKeepAliveProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `strategy` | `CacheStrategy` | `'always'` | 缓存策略 |
| `maxCacheCount` | `number` | `10` | 最大缓存数量 |
| `expireTime` | `number` | `30 * 60 * 1000` | 过期时间(毫秒) |
| `debug` | `boolean` | `false` | 调试模式 |
| `showDebugInfo` | `boolean` | `false` | 显示调试信息 |
| `when` | `CacheCondition` | `undefined` | 缓存条件函数 |
| `children` | `ReactNode` | - | 子组件 |

### CacheStrategy 类型

```typescript
type CacheStrategy = 'always' | 'conditional' | 'never';
```

- `always`: 总是缓存组件状态
- `conditional`: 根据 `when` 条件决定是否缓存
- `never`: 从不缓存，每次都重新创建组件

### CacheCondition 类型

```typescript
type CacheCondition = (location: Location, match: any) => boolean;
```

## 预设配置

### 使用预设配置

```typescript
import { EnhancedKeepAlive, KeepAlivePresets } from '@/components/enhanced-keep-alive';

// 使用默认配置
<EnhancedKeepAlive {...KeepAlivePresets.default}>
  <YourComponent />
</EnhancedKeepAlive>

// 使用高性能配置
<EnhancedKeepAlive {...KeepAlivePresets.performance}>
  <YourComponent />
</EnhancedKeepAlive>

// 使用长期缓存配置
<EnhancedKeepAlive {...KeepAlivePresets.longTerm}>
  <YourComponent />
</EnhancedKeepAlive>

// 使用调试配置
<EnhancedKeepAlive {...KeepAlivePresets.debug}>
  <YourComponent />
</EnhancedKeepAlive>
```

### 1. 默认配置 (KeepAlivePresets.default)

```typescript
import { EnhancedKeepAlive, KeepAlivePresets } from '@/components/enhanced-keep-alive';

<EnhancedKeepAlive {...KeepAlivePresets.default}>
  <YourComponent />
</EnhancedKeepAlive>
```

**配置参数:**

- 策略: `always`
- 最大缓存: `10`
- 过期时间: `30分钟`
- 调试模式: `false`

### 2. 高性能配置 (KeepAlivePresets.performance)

```typescript
import { EnhancedKeepAlive, KeepAlivePresets } from '@/components/enhanced-keep-alive';

<EnhancedKeepAlive {...KeepAlivePresets.performance}>
  <YourComponent />
</EnhancedKeepAlive>
```

**配置参数:**
- 策略: `conditional`
- 条件函数: 只在页面获得焦点且可见时缓存
- 最大缓存: `5`
- 过期时间: `10分钟`
- 调试模式: `false`

### 3. 长期缓存配置 (KeepAlivePresets.longTerm)

```typescript
import { EnhancedKeepAlive, KeepAlivePresets } from '@/components/enhanced-keep-alive';

<EnhancedKeepAlive {...KeepAlivePresets.longTerm}>
  <YourComponent />
</EnhancedKeepAlive>
```

**配置参数:**

- 策略: `always`
- 最大缓存: `20`
- 过期时间: `60分钟`
- 调试模式: `false`

### 4. 调试配置 (KeepAlivePresets.debug)

```typescript
import { EnhancedKeepAlive, KeepAlivePresets } from '@/components/enhanced-keep-alive';

<EnhancedKeepAlive {...KeepAlivePresets.debug}>
  <YourComponent />
</EnhancedKeepAlive>
```

**配置参数:**

- 策略: `always`
- 最大缓存: `3`
- 过期时间: `5分钟`
- 调试模式: `true`
- 显示调试信息: `true`

## Hook 使用

### useKeepAliveManager

```typescript
import { useKeepAliveManager } from '@/components/enhanced-keep-alive';

function MyComponent() {
  const {
    clearCache,
    clearCurrentCache,
    refreshCurrentCache,
    getCacheStats
  } = useKeepAliveManager();

  const handleClearAll = () => {
    clearCache();
  };

  const handleRefresh = () => {
    refreshCurrentCache();
  };

  const stats = getCacheStats();
  
  return (
    <div>
      <p>当前缓存数: {stats.total}</p>
      <p>最大缓存数: {stats.maxCount}</p>
      <button onClick={handleClearAll}>清除所有缓存</button>
      <button onClick={handleRefresh}>刷新当前缓存</button>
    </div>
  );
}
```

### Hook 方法说明

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `clearCache` | 清除所有缓存 | `(cacheKey?: string)` | `void` |
| `clearCurrentCache` | 清除当前页面缓存 | - | `void` |
| `refreshCurrentCache` | 刷新当前页面缓存 | - | `void` |
| `getCacheStats` | 获取缓存统计信息 | - | `CacheStats` |

## 缓存管理面板

### KeepAliveCachePanel

```typescript
import { KeepAliveCachePanel } from '@/components/enhanced-keep-alive';

function App() {
  return (
    <div>
      {/* 你的应用内容 */}
      <KeepAliveCachePanel />
    </div>
  );
}
```

**面板功能:**

- 实时显示缓存列表
- 查看每个缓存的详细信息
- 单独清除特定缓存
- 批量清除所有缓存
- 缓存统计信息展示

## 与 useTabOperations 集成

Enhanced KeepAlive 已经与 `useTabOperations` 集成，提供了以下增强功能：

```typescript
import { useTabOperations } from '@/layouts/dashboard/multi-tabs/hooks/use-tab-operations';

function TabComponent() {
  const { 
    clearCache,      // 清除增强缓存
    getCacheStats,   // 获取缓存统计
    closeAll,        // 关闭所有标签时自动清理缓存
    refreshTab       // 刷新标签时同步刷新增强缓存
  } = useTabOperations();

  return (
    <div>
      <button onClick={() => clearCache()}>清除所有缓存</button>
      <button onClick={() => {
        const stats = getCacheStats();
        console.log('缓存统计:', stats);
      }}>查看缓存统计</button>
    </div>
  );
}
```

## 最佳实践

### 1. 选择合适的缓存策略

```typescript
// 对于需要保持状态的页面
<EnhancedKeepAlive strategy="always">
  <FormPage />
</EnhancedKeepAlive>

// 对于有条件缓存的页面
<EnhancedKeepAlive 
  strategy="conditional"
  when={(location) => !location.pathname.includes('/edit')}
>
  <ListPage />
</EnhancedKeepAlive>

// 对于不需要缓存的页面
<EnhancedKeepAlive strategy="never">
  <LoginPage />
</EnhancedKeepAlive>
```

### 2. 合理设置缓存数量和过期时间

```typescript
<EnhancedKeepAlive 
  maxCacheCount={5}
  expireTime={10 * 60 * 1000} // 10分钟
>
  <YourComponent />
</EnhancedKeepAlive>

// 对于需要长期缓存的应用
<EnhancedKeepAlive 
  maxCacheCount={20}
  expireTime={60 * 60 * 1000} // 1小时
>
  <YourComponent />
</EnhancedKeepAlive>
```

### 3. 开发时启用调试模式

```typescript
const isDev = process.env.NODE_ENV === 'development';

<EnhancedKeepAlive 
  debug={isDev}
  showDebugInfo={isDev}
>
  <YourComponent />
</EnhancedKeepAlive>
```

## 性能优化建议

### 1. 避免过度缓存

- 根据实际需求设置合理的 `maxCacheCount`
- 对于不需要状态保持的页面使用 `strategy="never"`

### 2. 合理设置过期时间

- 根据用户使用习惯设置 `expireTime`
- 避免设置过长的过期时间导致内存占用过高

### 3. 使用条件缓存

- 对于编辑页面等不适合缓存的场景使用条件缓存
- 利用 `when` 函数精确控制缓存行为

## 故障排除

### 1. 缓存没有生效

- 检查 `strategy` 是否设置正确
- 确认 `when` 条件函数返回值
- 查看控制台是否有错误信息

### 2. 内存占用过高

- 减少 `maxCacheCount` 设置
- 缩短 `expireTime` 时间
- 使用缓存管理面板清理不需要的缓存

### 3. 状态没有保持

- 确认组件被 `EnhancedKeepAlive` 包裹
- 检查是否有其他因素导致组件重新创建
- 启用调试模式查看缓存行为

## 示例页面

访问 `/example/enhanced-keep-alive` 查看完整的功能演示和使用示例。
