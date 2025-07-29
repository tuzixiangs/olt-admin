---
sidebar_position: 11
---

# 页面缓存与状态管理使用场景对比

在 React 应用开发中，正确选择页面缓存和状态管理方案对用户体验至关重要。本文将对比分析 Enhanced KeepAlive、usePageState、usePageScrollPosition 和 usePageStateWithScroll 的使用场景。

## 概述

在 OLT Admin 项目中，我们提供了多种页面缓存和状态管理方案：

1. **Enhanced KeepAlive** - 组件级缓存方案
2. **usePageState** - 页面数据状态管理
3. **usePageScrollPosition** - 页面滚动位置管理
4. **usePageStateWithScroll** - 组合方案，同时管理页面数据和滚动位置

## Enhanced KeepAlive

### 简介

Enhanced KeepAlive 是基于 react-activation 的增强型 KeepAlive 解决方案，主要用于组件级别的缓存。

### 核心特性

- 智能缓存策略管理
- LRU (Least Recently Used) 算法
- 自动过期清理
- 缓存数量限制
- 可视化管理面板
- 开发调试工具

### 适用场景

| 场景 | 描述 | 推荐程度 |
|------|------|----------|
| 复杂表单页面 | 包含大量用户输入的表单，避免用户重新填写 | ⭐⭐⭐⭐⭐ |
| 图表/数据可视化页面 | 包含大量计算或远程数据加载的图表页面 | ⭐⭐⭐⭐⭐ |
| 多步骤向导 | 需要用户分步完成的流程页面 | ⭐⭐⭐⭐ |
| 耗时的数据加载页面 | 需要从服务器加载大量数据的页面 | ⭐⭐⭐⭐ |
| 频繁切换的路由 | 用户经常在几个页面之间来回切换的场景 | ⭐⭐⭐ |

### 使用示例

```tsx
import { EnhancedKeepAlive } from '@/components/enhanced-keep-alive';

function ComplexFormPage() {
  return (
    <EnhancedKeepAlive strategy="always">
      <ComplexForm />
    </EnhancedKeepAlive>
  );
}
```

## usePageState

### 简介

usePageState 是一个专门用于管理页面状态的 Hook，基于 LRU Store 实现，自动与路由绑定。

### 核心特性

- 自动与路由绑定
- 支持表单数据、任意状态的保存和恢复
- 基于 LRU 算法管理内存
- 支持禁用缓存功能

### 适用场景

| 场景 | 描述 | 推荐程度 |
|------|------|----------|
| 表单数据持久化 | 保存用户在表单中的输入，防止页面刷新丢失 | ⭐⭐⭐⭐⭐ |
| 搜索过滤条件 | 保存用户设置的搜索和过滤条件 | ⭐⭐⭐⭐⭐ |
| 分页状态 | 保存列表页的分页信息 | ⭐⭐⭐⭐ |
| 选项卡状态 | 保存用户选择的选项卡 | ⭐⭐⭐⭐ |
| 临时数据存储 | 存储不需要全局共享的临时数据 | ⭐⭐⭐ |

### 使用示例

```tsx
import { usePageState } from '@/hooks/use-page-state';

function SearchableList() {
  const [searchFilters, setSearchFilters] = usePageState({
    keyword: '',
    category: 'all',
    page: 1
  });

  return (
    <div>
      <input 
        value={searchFilters.keyword}
        onChange={e => setSearchFilters({...searchFilters, keyword: e.target.value})}
        placeholder="搜索关键词"
      />
      {/* 其他组件 */}
    </div>
  );
}
```

## usePageScrollPosition

### 简介

usePageScrollPosition 是专门用于管理页面滚动位置的 Hook，可以自动保存和恢复滚动位置。

### 核心特性

- 自动监听滚动事件
- 路由切换时自动恢复滚动位置
- 支持手动保存和恢复
- 可配置的节流时间
- 支持禁用缓存功能

### 适用场景

| 场景 | 描述 | 推荐程度 |
|------|------|----------|
| 长列表页面 | 用户需要滚动浏览大量内容的页面 | ⭐⭐⭐⭐⭐ |
| 文章阅读页面 | 长篇文章或文档阅读页面 | ⭐⭐⭐⭐⭐ |
| 电商商品列表 | 商品列表页面，用户浏览后返回需要恢复位置 | ⭐⭐⭐⭐ |
| 新闻资讯列表 | 新闻列表等需要记住阅读位置的场景 | ⭐⭐⭐⭐ |
| 任意需要保存滚动位置的页面 | 任何用户可能需要返回之前滚动位置的页面 | ⭐⭐⭐ |

### 使用示例

```tsx
import { usePageScrollPosition } from '@/hooks';

function LongListPage() {
  const [scrollY, setScrollY, restoreScroll] = usePageScrollPosition({
    autoListen: true,
    autoRestore: true
  });

  // 页面加载时恢复滚动位置
  useEffect(() => {
    restoreScroll();
  }, []);

  return (
    <div style={{ height: '200vh' }}>
      <p>当前滚动位置: {scrollY}px</p>
      {/* 列表内容 */}
    </div>
  );
}
```

## usePageStateWithScroll

### 简介

usePageStateWithScroll 是一个组合 Hook，同时管理页面数据状态和滚动位置。

### 核心特性

- 同时管理页面状态和滚动位置
- 统一的 API 接口
- 支持禁用所有缓存功能
- 提供清除所有状态的方法

### 适用场景

| 场景 | 描述 | 推荐程度 |
|------|------|----------|
| 复杂列表页面 | 既有搜索过滤条件又有长列表的页面 | ⭐⭐⭐⭐⭐ |
| 用户仪表板 | 包含多种状态和大量内容的仪表板页面 | ⭐⭐⭐⭐⭐ |
| 个人资料页面 | 包含表单和长内容的用户资料页面 | ⭐⭐⭐⭐ |
| 内容管理系统 | 需要保存编辑状态和滚动位置的管理页面 | ⭐⭐⭐⭐ |
| 任何需要同时管理状态和滚动位置的页面 | 需要两种功能的复合场景 | ⭐⭐⭐ |

### 使用示例

```tsx
import { usePageStateWithScroll } from '@/hooks/use-page-state';

function DashboardPage() {
  const {
    state,
    setState,
    scrollY,
    restoreScroll,
    clearAll
  } = usePageStateWithScroll({
    searchQuery: '',
    filters: {},
    selectedTab: 0
  });

  // 页面加载时恢复滚动位置
  useEffect(() => {
    restoreScroll();
  }, []);

  return (
    <div style={{ height: '200vh' }}>
      <input 
        value={state.searchQuery}
        onChange={e => setState({...state, searchQuery: e.target.value})}
        placeholder="搜索"
      />
      <p>当前滚动位置: {scrollY}px</p>
      <button onClick={clearAll}>清除所有状态</button>
      {/* 其他内容 */}
    </div>
  );
}
```

## 方案选择指南

### 根据需求选择

| 需求 | 推荐方案 | 理由 |
|------|----------|------|
| 保持组件状态和DOM结构 | Enhanced KeepAlive | 完整保留组件状态和DOM，用户体验最佳 |
| 保存简单的表单数据 | usePageState | 轻量级，专门用于数据持久化 |
| 记住页面滚动位置 | usePageScrollPosition | 专门处理滚动位置，功能专一 |
| 同时保存数据和滚动位置 | usePageStateWithScroll | 组合方案，一站式解决两种需求 |
| 需要复杂缓存控制 | Enhanced KeepAlive | 提供丰富的缓存策略和管理功能 |

### 性能考虑

1. **Enhanced KeepAlive**:
   - 性能开销最大，因为保持整个组件树在内存中
   - 适用于复杂组件，避免重复渲染和数据加载
   - 需要注意内存泄漏，合理设置 maxCacheCount 和 expireTime

2. **usePageState**:
   - 性能开销较小，只保存必要的数据状态
   - 适用于简单数据持久化场景
   - 基于 LRU 算法管理内存，自动清理过期数据

3. **usePageScrollPosition**:
   - 性能开销最小，只保存数字类型的滚动位置
   - 自动节流处理，避免频繁更新
   - 适用于任何需要保存滚动位置的场景

4. **usePageStateWithScroll**:
   - 性能开销为 usePageState 和 usePageScrollPosition 之和
   - 适用于需要同时管理两种状态的场景
   - 避免同时使用 usePageState 和 usePageScrollPosition 导致的重复逻辑

### 最佳实践

1. **合理使用 Enhanced KeepAlive**:
   ```tsx
   // 对于复杂表单，使用 Enhanced KeepAlive
   <EnhancedKeepAlive 
     strategy="conditional"
     condition={() => form.dirty} // 只有表单被修改时才缓存
     maxCacheCount={3}
   >
     <ComplexForm />
   </EnhancedKeepAlive>
   ```

2. **表单数据持久化**:
   ```tsx
   // 对于需要保存用户输入的表单，使用 usePageState
   const [formData, setFormData] = usePageState({
     title: '',
     content: '',
     category: 'tech'
   });
   
   // 表单组件
   <Form>
     <Input 
       value={formData.title}
       onChange={e => setFormData({...formData, title: e.target.value})}
       placeholder="标题"
     />
     <TextArea 
       value={formData.content}
       onChange={e => setFormData({...formData, content: e.target.value})}
       placeholder="内容"
     />
   </Form>
   ```

3. **复杂表单与滚动位置管理**:
   ```tsx
   // 对于较长的表单页面，同时需要保存状态和滚动位置
   const {
     state: formData,
     setState: setFormData,
     scrollY,
     restoreScroll
   } = usePageStateWithScroll({
     title: '',
     content: '',
     category: 'tech',
     tags: []
   });
   
   // 页面加载时恢复滚动位置
   useEffect(() => {
     restoreScroll();
   }, []);
   
   // 表单组件
   <Form>
     <Input 
       value={formData.title}
       onChange={e => setFormData({...formData, title: e.target.value})}
       placeholder="标题"
     />
     {/* 更多表单字段 */}
   </Form>
   ```

通过合理选择和使用这些方案，可以显著提升用户体验，减少重复的数据加载和用户输入，同时平衡性能和功能需求。