# React Hooks 文档

本目录包含了 OLT Admin 项目中所有自定义的 React Hooks。这些 hooks 提供了各种实用功能，帮助简化组件开发和状态管理。

## 📚 Hooks 概览

| Hook 名称 | 功能描述 | 文档链接 |
|-----------|----------|----------|
| `useCopyToClipboard` | 复制文本到剪贴板 | [📖 文档](./docs/use-copy-to-clipboard.md) |
| `useKeepAliveManager` | KeepAlive 缓存管理 | [📖 文档](./docs/use-keep-alive-manager.md) |
| `useMediaQuery` | 响应式媒体查询 | [📖 文档](./docs/use-media-query.md) |
| `useProTable` | Pro Table 数据管理 | [📖 文档](./docs/use-pro-table.md) |
| `useScrollRestoration` | 滚动位置恢复 | [📖 文档](./docs/use-scroll-restoration.md) |
| `useTableScroll` | 表格滚动计算 | [📖 文档](./docs/use-table-scroll.md) |

## 📖 文档目录

每个 Hook 都有详细的文档说明，包含 API 文档、使用示例和最佳实践：

- [useCopyToClipboard](./docs/use-copy-to-clipboard.md) - 复制文本到剪贴板
- [useMediaQuery](./docs/use-media-query.md) - 响应式媒体查询
- [useScrollRestoration](./docs/use-scroll-restoration.md) - 滚动位置恢复
- [useTableScroll](./docs/use-table-scroll.md) - 表格滚动高度计算
- [useKeepAliveManager](./docs/use-keep-alive-manager.md) - KeepAlive 缓存管理
- [useProTable](./docs/use-pro-table.md) - ProTable 数据管理

## 🚀 快速开始

### 安装和导入

所有 hooks 都可以从 `@/hooks` 中导入：

```tsx
import { 
  useCopyToClipboard,
  useKeepAliveManager,
  useMediaQuery,
  useProTable,
  useScrollRestoration,
  useTableScroll
} from '@/hooks';
```

### 基本使用示例

```tsx
import React from 'react';
import { useCopyToClipboard, useMediaQuery } from '@/hooks';

function ExampleComponent() {
  const { copyFn } = useCopyToClipboard();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleCopy = () => {
    copyFn('Hello World!');
  };

  return (
    <div>
      <p>当前设备: {isMobile ? '移动端' : '桌面端'}</p>
      <button onClick={handleCopy}>复制文本</button>
    </div>
  );
}
```

## 📁 文档组织结构

```
src/hooks/
├── README.md                    # 主文档（本文件）
├── index.ts                     # 统一导出
├── docs/                        # 详细文档目录
│   ├── use-copy-to-clipboard.md
│   ├── use-keep-alive-manager.md
│   ├── use-media-query.md
│   ├── use-pro-table.md
│   ├── use-scroll-restoration.md
│   └── use-table-scroll.md
├── use-copy-to-clipboard.ts     # Hook 实现
├── use-keep-alive-manager.ts
├── use-media-query.ts
├── use-pro-table.ts
├── use-scroll-restoration.ts
└── use-table-scroll.ts
```

## 🎯 Hook 分类

### 🔧 工具类 Hooks

- **useCopyToClipboard**: 剪贴板操作
- **useMediaQuery**: 响应式查询

### 📊 数据管理 Hooks

- **useProTable**: 表格数据和分页管理
- **useKeepAliveManager**: 组件缓存管理

### 🎨 UI 交互 Hooks

- **useScrollRestoration**: 滚动位置管理
- **useTableScroll**: 表格滚动优化

## 📝 开发指南

### 创建新的 Hook

1. 在 `src/hooks/` 目录下创建新的 `.ts` 文件
2. 在 `docs/` 目录下创建对应的 `.md` 文档
3. 在 `index.ts` 中添加导出
4. 更新本 README 文档

### 文档编写规范

每个 Hook 的文档应包含：

- **功能描述**: 简要说明 Hook 的用途
- **API 文档**: 详细的参数和返回值说明
- **使用示例**: 多个实际使用场景
- **注意事项**: 使用时需要注意的问题
- **相关链接**: 相关 Hook 或外部资源

### 代码规范

- 使用 TypeScript 编写，提供完整的类型定义
- 添加详细的 JSDoc 注释
- 遵循 React Hooks 规则
- 提供错误处理和边界情况处理

## 🔗 相关资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Ant Design Pro 组件](https://pro.ant.design/)
- [TanStack Query](https://tanstack.com/query/latest)
