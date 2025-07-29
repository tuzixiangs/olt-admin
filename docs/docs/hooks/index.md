# React Hooks 文档

本目录包含了 OLT Admin 项目中所有自定义的 React Hooks。这些 hooks 提供了各种实用功能，帮助简化组件开发和状态管理。

## 📚 Hooks 概览

| Hook 名称 | 功能描述 | 文档链接 |
|-----------|----------|----------|
| `useCopyToClipboard` | 复制文本到剪贴板 | [📖 文档](./use-copy-to-clipboard.md) |
| `useKeepAliveManager` | KeepAlive 缓存管理 | [📖 文档](./use-keep-alive-manager.md) |
| `useMediaQuery` | 响应式媒体查询 | [📖 文档](./use-media-query.md) |
| `usePageState` | 页面状态管理 | [📖 文档](./use-page-state.md) |
| `useProTable` | Pro Table 数据管理 | [📖 文档](./use-pro-table.md) |

## 🚀 快速开始

### 安装和导入

所有 hooks 都可以从 `@/hooks` 中导入：

```tsx
import { 
  useCopyToClipboard,
  useKeepAliveManager,
  useMediaQuery,
  usePageState,
  useProTable
} from '@/hooks';
```

### 基本使用示例

```tsx
import React from 'react';
import { useCopyToClipboard, useMediaQuery, usePageState } from '@/hooks';

function ExampleComponent() {
  const { copyFn } = useCopyToClipboard();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [pageData, setPageData] = usePageState({ count: 0 });

  const handleCopy = () => {
    copyFn('Hello World!');
  };

  const increment = () => {
    setPageData(prev => ({ 
      ...prev, 
      count: (prev?.count || 0) + 1 
    }));
  };

  return (
    <div>
      <p>当前设备: {isMobile ? '移动端' : '桌面端'}</p>
      <p>计数: {pageData?.count}</p>
      <button onClick={handleCopy}>复制文本</button>
      <button onClick={increment}>增加</button>
    </div>
  );
}
```

## 🎯 Hook 分类

### 🔧 工具类 Hooks

- **useCopyToClipboard**: 剪贴板操作
- **useMediaQuery**: 响应式查询

### 📊 数据管理 Hooks

- **useProTable**: 表格数据和分页管理
- **useKeepAliveManager**: 组件缓存管理

## 🔗 相关资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Ant Design Pro 组件](https://pro.ant.design/)
- [TanStack Query](https://tanstack.com/query/latest)
