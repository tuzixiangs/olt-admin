# 项目模块化结构 (Feature-Sliced Design)

本目录 (`src/pages`) 不仅存放项目的页面级组件，更是我们实践 **模块化架构 (Feature-Sliced Design)** 的核心区域。其核心思想是：**将实现同一功能的代码组织在一起，而不是按技术类型分散在不同目录中**。

## 核心原则

每个功能模块（通常以 `pages` 下的一个子目录为单位）都应该是一个高内聚、低耦合的单元。这意味着一个模块包含了实现其功能所需的所有资源，包括：

*   **页面组件 (`index.tsx`)**: 功能的入口视图。
*   **路由定义 (`routes.tsx`)**: 该功能模块下的所有路由配置。
*   **API 请求 (`api.ts`)**: 所有与后端交互的接口调用。
*   **类型定义 (`types.ts`)**: 模块内部使用的 TypeScript 类型和接口。
*   **自定义 Hooks (`hooks.ts`)**: 专为该模块封装的可复用逻辑。
*   **状态管理 (`store.ts`)**: 与模块相关的状态切片 (Zustand store)。
*   **功能特定组件 (`components/`)**: 仅在该模块内部使用的私有组件。
*   **Refine 资源配置 (`refine-config.ts`)**: 如果模块使用 Refine 框架，包含该模块的资源定义和配置。

## 全局资源 vs. 模块私有资源

为了保持代码的清晰和可维护性，我们需要严格区分"全局共享"资源和"模块私有"资源。

### 1. 全局共享资源

这些资源与具体的业务逻辑解耦，可以在应用的任何地方复用。它们存放在 `src/` 下的根级目录中：

*   `src/ui`: 存放最基础的原子组件，如 `Button`, `Input`, `Dialog`。它们是 UI 的基础构建块。
*   `src/components`: 存放由原子组件构成的、更复杂的通用组件，如 `Chart`, `Editor`。
*   `src/hooks`: 存放通用的、与业务无关的自定义 Hooks，如 `useMediaQuery`, `useCopyToClipboard`。
*   `src/utils`: 全局工具函数。
*   `src/store`: 全局 Zustand store 的初始化或不属于任何特定模块的通用状态。
*   `src/types`: 全局共享的、非业务相关的核心类型。
*   `src/dict`: 全局共享的、非业务相关的字典。
*   `src/refine`: Refine 框架的全局配置，包括提供者配置和资源管理工具。

### 2. 模块私有资源

这些资源与特定的业务功能紧密耦合，**只能在其所属的模块内部使用**。它们都位于各自的模块文件夹下。

## 推荐的目录结构示例

```
src/
├─ ui/                  # 1. 全局原子组件
├─ components/          # 2. 全局通用复合组件
├─ hooks/               # 3. 全局通用 Hooks
├─ utils/               # 4. 全局工具函数
├─ store/               # 5. 全局状态管理
├─ types/               # 6. 全局类型
├─ dict/                # 7. 全局字典
├─ refine/              # 8. Refine 框架全局配置
│  ├─ providers/        # Refine 提供者配置
│  ├─ resources/        # 资源管理和自动收集工具
│  └─ hooks/            # Refine 相关的全局 Hooks
├─ pages/               # 9. 页面级目录，也是功能模块的根目录
│  ├─ management/       # 「管理」功能模块
│  │  ├─ system/
│  │  │  ├─ user/       # 「用户管理」子模块
│  │  │  │  ├─ components/    # User管理专用的组件 (e.g., UserDetailCard)
│  │  │  │  ├─ index.tsx      # 页面入口组件
│  │  │  │  ├─ api.ts         # User管理相关的API (e.g., getUser, deleteUser)
│  │  │  │  ├─ hooks.ts       # User管理专用的Hooks (e.g., useUserList)
│  │  │  │  ├─ store.ts       # User管理相关的状态
│  │  │  │  ├─ types.ts       # User管理相关的类型 (e.g., interface User)
│  │  │  │  └─ refine-config.ts  # User管理相关的 Refine 资源配置
│  │  ├─ routes.tsx           # 「管理」模块下的所有路由
│  │  ├─ dict/                # 「管理」模块下所有用到的字典
│  │  │  ├─ index.ts          # 字典入口
│  │  │  ├─ system.ts         # 系统管理字典
│  │  │  └─ ...               # 其他字典
│  │  └─ ...
│  ├─ refine/           # Refine 功能模块示例
│  │  ├─ products/      # 「产品管理」模块
│  │  │  ├─ list.tsx           # 产品列表页面
│  │  │  ├─ create.tsx         # 产品创建页面
│  │  │  ├─ edit.tsx           # 产品编辑页面
│  │  │  ├─ show.tsx           # 产品详情页面
│  │  │  ├─ routes.tsx         # 产品模块路由配置
│  │  │  └─ refine-config.ts   # 产品模块 Refine 资源配置
│  │  └─ users/         # 「用户管理」模块
│  │     ├─ list.tsx           # 用户列表页面
│  │     ├─ routes.tsx         # 用户模块路由配置
│  │     └─ refine-config.ts   # 用户模块 Refine 资源配置
├─ routes/              # 根路由配置，负责从各个模块导入并组合路由
└─ ...
```

## Refine 资源配置说明

对于使用 Refine 框架的模块，我们采用**就近管理**的原则：

### 配置文件结构

每个 Refine 功能模块应包含：

1. **`refine-config.ts`**: 该模块的 Refine 资源配置
2. **页面组件**: 实现 CRUD 操作的页面组件
3. **`routes.tsx`**: 该模块的路由配置

### 示例配置

```typescript
// src/pages/refine/products/refine-config.ts
import type { IResourceItem } from "@refinedev/core";

export const productsRefineConfig: IResourceItem = {
  name: "products",
  list: "/refine/products",
  create: "/refine/products/create",
  edit: "/refine/products/edit/:id",
  show: "/refine/products/show/:id",
  meta: {
    dataProviderName: "refine",
  },
};
```

### 自动发现机制

系统会自动发现所有的 `refine-config.ts` 文件，无需手动注册：

- 使用 Vite 的 `import.meta.glob` 功能自动收集配置
- 支持任意嵌套层级的目录结构
- 零配置，添加新模块自动生效

## 实践优势

*   **高内聚，低耦合**: 修改或理解一个功能时，所有相关代码都在一个地方，无需在整个项目中跳转。
*   **易于维护和扩展**: 添加新功能只需创建一个新模块目录；移除功能也只需删除对应目录，对其他部分影响极小。
*   **清晰的代码所有权**: 在团队协作中，可以方便地将某个功能模块分配给特定开发者。
*   **零配置扩展**: 对于 Refine 模块，添加新功能无需修改全局配置文件。
*   **避免配置冲突**: 不同开发者不会同时修改同一个配置文件，减少合并冲突。

## 何时应该全局共享？

当不确定某个资源是否需要全局共享时，就采用"模块私有"方式，先在模块内部使用，如果发现有多个模块需要使用，则考虑"资源提升"到全局共享。

## Refine 最佳实践

1. **命名规范**: 资源配置文件统一命名为 `refine-config.ts`
2. **导出规范**: 导出变量名为 `{模块名}RefineConfig`
3. **路径一致**: 确保资源配置中的路径与路由配置一致
4. **数据提供者**: 根据数据来源选择合适的 `dataProviderName`
5. **功能完整**: 每个模块应实现完整的 CRUD 功能（根据需要）
