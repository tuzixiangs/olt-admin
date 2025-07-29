# usePageState Hooks

`usePageState` 是一组用于管理页面状态的 React Hooks，基于 LRU Store 实现，能够自动与路由绑定，支持表单数据、滚动位置等任意状态的保存和恢复。

## 📦 Hooks 概览

| Hook 名称 | 功能描述 |
|-----------|----------|
| `usePageState` | 通用页面状态管理 |
| `usePageScrollPosition` | 页面滚动位置管理 |
| `usePageStateWithScroll` | 组合页面状态和滚动位置管理 |

## 🚀 快速开始

### 安装和导入

```tsx
import { 
  usePageState,
  usePageScrollPosition,
  usePageStateWithScroll
} from '@/hooks/use-page-state';
```

## 🎯 usePageState

通用页面状态管理 Hook，基于 LRU Store 实现，自动与路由绑定，支持表单数据、滚动位置等任意状态的保存和恢复。

### 基本使用

```tsx
import React, { useState } from 'react';
import { usePageState } from '@/hooks/use-page-state';

function MyForm() {
  // 保存表单数据
  const [formData, setFormData, removeFormData] = usePageState({
    name: '',
    email: ''
  });

  // 保存任意页面状态
  const [pageState, setPageState] = usePageState({
    selectedTab: 0,
    searchQuery: '',
    filters: {}
  });

  const handleSubmit = () => {
    // 提交数据后清除缓存
    removeFormData();
  };

  return (
    <div>
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
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
```

### API 参考

```typescript
function usePageState<T>(
  defaultValue?: T,
  options?: {
    key?: string;
    disabled?: boolean;
  }
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void, () => void]
```

#### 参数

- `defaultValue` (可选): 默认值
- `options` (可选): 配置选项
  - `key` (可选): 自定义缓存键，默认使用当前路由路径 + 查询参数
  - `disabled` (可选): 是否禁用缓存功能，默认为 `false`

#### 返回值

返回一个数组，包含：

1. `state`: 当前状态值
2. `setState`: 更新状态的函数
3. `removeState`: 移除状态的函数

## 📜 usePageScrollPosition

专门用于管理页面滚动位置的保存和恢复。

### 基本使用

```tsx
import React, { useEffect } from 'react';
import { usePageScrollPosition } from '@/hooks/use-page-state';

function MyPage() {
  const [scrollY, setScrollY, restoreScroll] = usePageScrollPosition({
    autoListen: true,
    autoRestore: true
  });

  // 手动保存滚动位置
  const handleSaveScroll = () => {
    setScrollY(window.scrollY);
  };

  // 恢复滚动位置
  const handleRestoreScroll = () => {
    restoreScroll();
  };

  return (
    <div style={{ height: '200vh' }}>
      <p>当前滚动位置: {scrollY}px</p>
      <button onClick={handleSaveScroll}>保存位置</button>
      <button onClick={handleRestoreScroll}>恢复位置</button>
    </div>
  );
}
```

### API 参考

```typescript
function usePageScrollPosition(
  options?: {
    key?: string;
    autoListen?: boolean;
    autoRestore?: boolean;
    throttleMs?: number;
    disabled?: boolean;
    userScrollTimeout?: number;
  }
): [number, (value: number | ((prev: number | undefined) => number)) => void, () => void, () => void]
```

#### 参数

- `options` (可选): 配置选项
  - `key` (可选): 自定义缓存键，默认使用当前路由路径
  - `autoListen` (可选): 是否自动监听滚动事件，默认为 `true`
  - `autoRestore` (可选): 是否在路由切换时自动恢复滚动位置，默认为 `true`
  - `throttleMs` (可选): 滚动事件节流时间，默认为 `200ms`
  - `disabled` (可选): 是否禁用缓存功能，默认为 `false`
  - `userScrollTimeout` (可选): 用户滚动检测超时时间，默认为 `1000ms`

#### 返回值

返回一个数组，包含：

1. `scrollY`: 当前滚动位置
2. `setScrollY`: 设置滚动位置的函数
3. `restoreScroll`: 恢复滚动位置的函数
4. `removeScrollY`: 移除滚动位置的函数

## 🔄 usePageStateWithScroll

同时管理页面数据状态和滚动位置的组合 Hook。

### 基本使用

```tsx
import React from 'react';
import { usePageStateWithScroll } from '@/hooks/use-page-state';

function MyPage() {
  const {
    state,
    setState,
    scrollY,
    setScrollY,
    restoreScroll,
    clearAll
  } = usePageStateWithScroll({
    formData: { name: '', email: '' },
    selectedTab: 0
  });

  return (
    <div style={{ height: '200vh' }}>
      <div>
        <input 
          value={state?.formData.name}
          onChange={(e) => setState({
            ...state,
            formData: {
              ...state.formData,
              name: e.target.value
            }
          })}
          placeholder="姓名"
        />
        <input 
          value={state?.formData.email}
          onChange={(e) => setState({
            ...state,
            formData: {
              ...state.formData,
              email: e.target.value
            }
          })}
          placeholder="邮箱"
        />
      </div>
      
      <p>当前滚动位置: {scrollY}px</p>
      
      <div>
        <button onClick={restoreScroll}>恢复滚动位置</button>
        <button onClick={clearAll}>清除所有状态</button>
      </div>
    </div>
  );
}
```

### API 参考

```typescript
function usePageStateWithScroll<T>(
  defaultState?: T,
  options?: {
    keyPrefix?: string;
    stateOptions?: Parameters<typeof usePageState>[1];
    scrollOptions?: Parameters<typeof usePageScrollPosition>[0];
    disabled?: boolean;
  }
): {
  // 页面状态
  state: T | undefined;
  setState: (value: T | ((prev: T | undefined) => T)) => void;
  removeState: () => void;

  // 滚动位置
  scrollY: number;
  setScrollY: (value: number | ((prev: number | undefined) => number)) => void;
  restoreScroll: () => void;
  removeScrollY: () => void;

  // 工具方法
  clearAll: () => void;
}
```

#### 参数

- `defaultState` (可选): 默认页面状态
- `options` (可选): 配置选项
  - `keyPrefix` (可选): 自定义缓存键前缀，默认使用当前路由路径
  - `stateOptions` (可选): 页面状态配置，传递给 [usePageState](./use-page-state.md#usepagestate) 的选项
  - `scrollOptions` (可选): 滚动位置配置，传递给 [usePageScrollPosition](./use-page-state.md#usepagescrollposition) 的选项
  - `disabled` (可选): 是否禁用缓存功能，默认为 `false`

#### 返回值

返回一个对象，包含：

##### 页面状态
- `state`: 当前页面状态
- `setState`: 更新页面状态的函数
- `removeState`: 移除页面状态的函数

##### 滚动位置
- `scrollY`: 当前滚动位置
- `setScrollY`: 设置滚动位置的函数
- `restoreScroll`: 恢复滚动位置的函数
- `removeScrollY`: 移除滚动位置的函数

##### 工具方法
- `clearAll`: 清除所有状态的函数

## 🛠️ 最佳实践

### 1. 表单数据持久化

```tsx
import React from 'react';
import { usePageState } from '@/hooks/use-page-state';

function PersistentForm() {
  const [formData, setFormData, removeFormData] = usePageState({
    title: '',
    content: ''
  }, {
    // 可以自定义缓存键
    key: 'my-form-data'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 提交表单数据
    await submitForm(formData);
    // 成功后清除缓存
    removeFormData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData?.title || ''}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="标题"
      />
      <textarea
        value={formData?.content || ''}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        placeholder="内容"
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 🧪 注意事项

1. **性能考虑**: 这些 hooks 基于 LRU 缓存实现，会自动管理内存使用，但应避免存储过大的对象。

2. **路由绑定**: 默认情况下，状态会与当前路由自动绑定，不同页面的状态是隔离的。

3. **禁用缓存**: 在某些情况下，可以通过 `disabled` 选项禁用缓存功能，此时将使用普通的 useState。

4. **滚动位置**: `usePageScrollPosition` 提供了自动监听和恢复滚动位置的功能，可以根据需要进行配置。