# 状态管理方案对比

在 OLT Admin 项目中，我们使用了多种状态管理方案来满足不同的需求。本文档将对这些方案进行详细对比，帮助开发者在合适的场景下选择合适的存储方式。

## 📚 存储方案概览

| 存储方案 | 持久化 | 作用域 | 适用场景 | 复杂度 |
|----------|--------|--------|----------|--------|
| useState | 否 | 组件级别 | 临时组件状态 | 低 |
| useRef | 否 | 组件级别 | DOM引用、可变值 | 低 |
| Zustand | 否/可配置 | 全局/模块级别 | 全局状态管理 | 中 |
| useLocalStorageState | 是 | 全局 | 跨会话持久化数据 | 低 |
| useSessionStorageState | 是 | 全局 | 会话级持久化数据 | 低 |
| LRUStore | 否 | 全局 | 带缓存策略的全局状态 | 中 |
| usePageState | 可配置 | 页面级别 | 页面状态持久化 | 中 |
| useProTable | 可配置 | 表格组件 | 表格数据管理 | 高 |

## 🆚 详细对比分析

### 1. useState

React 内置的状态管理 Hook，用于管理组件内的临时状态。

#### 适用场景
- 组件内部的临时状态
- 表单输入值
- 控制组件显示/隐藏
- 组件局部的简单状态

#### 示例
```tsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

#### 优缺点
- ✅ 简单易用，零配置
- ✅ 性能优秀
- ❌ 页面刷新后状态丢失
- ❌ 无法跨组件共享

### 2. useRef

React 内置 Hook，用于访问 DOM 元素或存储可变值。

#### 适用场景
- 访问 DOM 元素
- 存储不需要触发重新渲染的可变值
- 存储定时器 ID 等引用

#### 示例
```tsx
import React, { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

#### 优缺点
- ✅ 不会触发重新渲染
- ✅ 持久保持引用
- ❌ 页面刷新后数据丢失
- ❌ 不适合存储需要响应式更新的状态

### 3. Zustand

轻量级的状态管理库，用于全局状态管理。

#### 适用场景
- 全局应用设置
- 用户认证信息
- 跨组件共享状态

#### 示例
```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

#### 优缺点
- ✅ 轻量级，API 简单
- ✅ 支持中间件（如持久化）
- ✅ 支持选择性订阅
- ❌ 需要额外依赖

### 4. useLocalStorageState/useSessionStorageState (ahooks)

将状态持久化到浏览器存储的 Hooks。

#### 适用场景
- 需要跨会话保持的设置
- 用户偏好设置
- 表单草稿

#### 示例
```tsx
import { useLocalStorageState } from 'ahooks';

function Preferences() {
  const [theme, setTheme] = useLocalStorageState('theme', {
    defaultValue: 'light',
  });
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        切换到深色主题
      </button>
    </div>
  );
}
```

#### 优缺点
- ✅ 自动持久化到浏览器存储
- ✅ 支持多种数据类型
- ✅ 简单易用
- ❌ 存储量有限制
- ❌ 可能影响性能（大量数据时）

### 5. LRUStore

基于 LRU (Least Recently Used) 算法的缓存状态管理。

#### 适用场景
- 需要缓存策略的临时数据
- 频繁访问但有限容量的数据
- 需要自动淘汰旧数据的场景

#### 示例
```tsx
import { useLRUStore } from '@/store/lruStore';

function DataCache() {
  const [cachedData, setCachedData] = useLRUStore('api-data', null);
  
  const fetchAndCache = async () => {
    const data = await fetchData();
    setCachedData(data);
  };
  
  return (
    <div>
      <p>缓存数据: {cachedData ? '已缓存' : '未缓存'}</p>
      <button onClick={fetchAndCache}>获取并缓存数据</button>
    </div>
  );
}
```

#### 优缺点
- ✅ 自动管理内存使用
- ✅ 支持容量限制
- ✅ 最近使用数据优先保留
- ❌ 实现复杂度较高
- ❌ 不适合需要长期持久化的数据

### 6. usePageState

基于 LRUStore 的页面状态管理 Hook。

#### 适用场景
- 页面级状态持久化
- 表单数据保存
- 页面滚动位置恢复
- 跨页面导航状态保持

#### 示例
```tsx
import { usePageState } from '@/hooks/use-page-state';

function FormPage() {
  const [formData, setFormData] = usePageState({
    name: '',
    email: '',
  });
  
  return (
    <form>
      <input
        value={formData?.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="姓名"
      />
      <input
        value={formData?.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="邮箱"
      />
    </form>
  );
}
```

#### 优缺点
- ✅ 自动与路由绑定
- ✅ 页面间导航状态保持
- ✅ 支持禁用缓存选项
- ❌ 仅适用于页面级状态

### 7. useProTable

专门用于表格数据管理的 Hook。

#### 适用场景
- 表格数据获取和展示
- 分页、排序、过滤
- 表格状态持久化

#### 示例
```tsx
import { useProTable } from '@/hooks/use-pro-table';
import { ProTable } from '@ant-design/pro-components';

function UserTable() {
  const { tableProps } = useProTable(
    (params) => userService.getUsers(params),
    {
      queryKey: ['users'],
      useCache: true,
    }
  );
  
  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
  ];
  
  return (
    <ProTable
      columns={columns}
      {...tableProps}
      rowKey="id"
    />
  );
}
```

#### 优缺点
- ✅ 集成数据获取、分页、搜索等功能
- ✅ 支持状态持久化
- ✅ 与 Ant Design Pro Components 深度集成
- ❌ 仅适用于表格场景
- ❌ 依赖较多第三方库

## 🎯 选择指南

### 按数据生命周期选择

| 生命周期 | 推荐方案 |
|----------|----------|
| 组件内临时数据 | useState, useRef |
| 跨组件共享数据 | Zustand |
| 跨会话持久化数据 | useLocalStorageState |
| 会话级数据 | useSessionStorageState |
| 页面级状态 | usePageState |
| 表格数据 | useProTable |
| 带缓存策略的数据 | LRUStore |

### 按数据复杂度选择

| 复杂度 | 推荐方案 |
|--------|----------|
| 简单状态 | useState |
| 中等复杂度 | Zustand, usePageState |
| 复杂业务逻辑 | Zustand |
| 专门场景 | useProTable, LRUStore |

### 按性能要求选择

| 性能要求 | 推荐方案 |
|----------|----------|
| 高性能要求 | useRef (不触发渲染) |
| 一般性能要求 | useState, usePageState |
| 可接受一定开销 | Zustand, useProTable |

## 🧪 最佳实践

### 1. 合理选择存储方案

```tsx
// ❌ 不合理的使用方式
const [globalTheme, setGlobalTheme] = useState('light'); // 全局状态不应该用 useState

// ✅ 合理的使用方式
const globalTheme = useSettings(); // 使用 Zustand 管理全局设置
```

### 2. 避免过度使用全局状态

```tsx
// ❌ 不必要的全局状态
const useStore = create((set) => ({
  localCounter: 0, // 组件局部状态不应该放在全局
}));

// ✅ 正确的使用方式
function Counter() {
  const [count, setCount] = useState(0); // 组件局部状态用 useState
}
```

### 3. 合理使用缓存

```tsx
// 表格数据使用 useProTable 并启用缓存
const { tableProps } = useProTable(fetchUsers, {
  queryKey: ['users'],
  useCache: true, // 启用页面状态缓存
});

// 表单数据使用 usePageState
const [formData, setFormData] = usePageState({
  name: '',
  email: '',
});
```

## 📈 性能考虑

1. **useState**: 性能最好，适用于频繁更新的组件状态
2. **useRef**: 不触发重新渲染，适用于存储引用值
3. **Zustand**: 性能良好，支持选择性订阅
4. **useLocalStorageState**: 有 I/O 开销，适用于不频繁更新的数据
5. **LRUStore**: 有额外的算法开销，适用于需要缓存策略的数据
6. **usePageState**: 基于 LRUStore，性能与 LRUStore 相似
7. **useProTable**: 功能丰富但依赖较多，适用于复杂表格场景

## 🛡️ 安全性考虑

1. **浏览器存储**: 不要存储敏感信息（如密码、token等）
2. **全局状态**: 注意敏感信息的访问控制
3. **缓存数据**: 定期清理过期数据

```tsx
// ❌ 不要存储敏感信息到 localStorage
useLocalStorageState('user-token', token);

// ✅ 使用安全的存储方式
const userToken = useUserToken(); // 存储在内存中并通过 HTTPS 传输
```

## 🧩 组合使用示例

```tsx
import { useState } from 'react';
import { usePageState } from '@/hooks/use-page-state';
import { useProTable } from '@/hooks/use-pro-table';
import { useSettings } from '@/store/settingStore';

function ComplexPage() {
  // 组件局部状态
  const [loading, setLoading] = useState(false);
  
  // 全局设置
  const settings = useSettings();
  
  // 页面状态（跨页面导航保持）
  const [searchForm, setSearchForm] = usePageState({
    keyword: '',
    category: '',
  });
  
  // 表格数据（带缓存和分页）
  const { tableProps } = useProTable(
    (params) => fetchData({ ...params, ...searchForm }),
    {
      queryKey: ['data-list'],
      useCache: true,
    }
  );
  
  return (
    <div>
      {/* 搜索表单 */}
      <SearchForm 
        value={searchForm}
        onChange={setSearchForm}
      />
      
      {/* 数据表格 */}
      <DataTable 
        {...tableProps}
        loading={loading || tableProps.loading}
      />
    </div>
  );
}
```

通过合理选择和组合使用这些状态管理方案，可以构建出高性能、易维护的应用程序。