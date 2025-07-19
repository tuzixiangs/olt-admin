# Refine 模块化配置

本目录包含了 Refine 的模块化配置，采用**就近管理**的架构模式，便于维护和扩展。

## 架构设计理念

我们采用**就近管理**而非集中管理的原因：

1. **符合 Feature-Sliced Design**：与项目整体架构保持一致
2. **高内聚低耦合**：每个功能模块独立管理自己的资源
3. **团队协作友好**：避免多人同时修改同一个配置文件产生冲突
4. **扩展性更好**：添加新功能无需修改全局配置

## 目录结构

```
src/
├─ refine/                    # Refine 核心配置
│  ├─ providers/              # 提供者配置
│  │  ├─ index.tsx           # RefineProvider 主组件
│  │  ├─ data-provider.ts    # 数据提供者配置
│  │  └─ router-provider.ts  # 路由提供者配置
│  ├─ resources/             # 资源管理
│  │  ├─ index.ts           # 资源汇总和工具函数
│  │  └─ auto-collect.ts    # 自动收集各模块的资源配置
│  └─ hooks/                # Refine 相关的自定义 hooks (可选)
├─ pages/refine/             # Refine 功能模块（就近管理）
│  ├─ products/              # 产品模块
│  │  ├─ list.tsx           # 列表页
│  │  ├─ create.tsx         # 创建页（可选）
│  │  ├─ edit.tsx           # 编辑页（可选）
│  │  ├─ show.tsx           # 详情页（可选）
│  │  ├─ routes.tsx         # 模块路由配置
│  │  └─ refine-config.ts   # Refine 资源配置
│  └─ users/                # 用户模块
│     ├─ list.tsx           
│     ├─ routes.tsx         
│     └─ refine-config.ts   
```

## 使用方法

### 1. 添加新的 Refine 功能模块

以添加 `categories` 模块为例：

**步骤 1**: 创建页面组件
```typescript
// src/pages/refine/categories/list.tsx
import { useList } from "@refinedev/core";

export default function CategoryList() {
  const { data: categories } = useList({
    resource: "categories",
    dataProviderName: "refine",
  });

  return (
    <div>
      <h1>Categories</h1>
      {/* 页面内容 */}
    </div>
  );
}
```

**步骤 2**: 创建 Refine 资源配置
```typescript
// src/pages/refine/categories/refine-config.ts
import type { IResourceItem } from "@refinedev/core";

export const categoriesRefineConfig: IResourceItem = {
  name: "categories",
  list: "/refine/categories/list",
  create: "/refine/categories/create",
  edit: "/refine/categories/edit/:id",
  show: "/refine/categories/show/:id",
  meta: {
    dataProviderName: "refine",
  },
};
```

**步骤 3**: 创建路由配置
```typescript
// src/pages/refine/categories/routes.tsx
import type { AppRouteObject } from "@/types/router";
import { lazy } from "react";

const refineCategoriesRoutes: AppRouteObject[] = [
  {
    path: "/refine/categories",
    meta: { key: "categories", title: "分类管理" },
    children: [
      {
        path: "/refine/categories/list",
        Component: lazy(() => import("./list")),
        meta: { key: "categories", title: "分类列表" },
      },
    ],
  },
];

export default refineCategoriesRoutes;
```

**完成！** 系统会自动发现并加载新的资源配置，无需手动注册。

### 2. 自动发现机制

系统使用 Vite 的 `import.meta.glob` 功能自动发现所有的 `refine-config.ts` 文件：

```typescript
// src/refine/resources/auto-collect.ts
const refineConfigModules = import.meta.glob(
  "../../pages/**/refine-config.ts",
  { eager: true }
);
```

### 3. 查看所有资源

```typescript
import { resourceNames, getResourceConfig } from "@/refine/resources";

// 获取所有资源名称
console.log(resourceNames); // ["products", "users", "categories"]

// 获取特定资源配置
const productConfig = getResourceConfig("products");
```

## 优势

### 1. 开发体验
- ✅ **独立开发**：每个模块可以独立开发和测试
- ✅ **零配置**：添加新功能无需修改全局配置
- ✅ **自动发现**：系统自动发现和加载新的资源

### 2. 团队协作
- ✅ **减少冲突**：不同开发者不会修改同一个配置文件
- ✅ **职责清晰**：每个模块的维护者负责自己的配置
- ✅ **代码审查**：配置变更与功能变更在同一个 PR 中

### 3. 维护性
- ✅ **高内聚**：相关的代码在同一个目录下
- ✅ **易删除**：删除功能时直接删除整个目录
- ✅ **易重构**：模块内部重构不影响其他模块

## 最佳实践

1. **命名规范**：资源配置文件统一命名为 `refine-config.ts`
2. **导出规范**：导出的变量名为 `{模块名}RefineConfig`
3. **路径一致**：确保资源配置中的路径与路由配置一致
4. **类型安全**：使用 TypeScript 类型检查
5. **文档完善**：为每个模块添加 README 说明

## 注意事项

- 确保 `refine-config.ts` 文件位于 `src/pages/` 目录下的任意层级
- 资源名称在整个应用中必须唯一
- dataProviderName 要与数据提供者配置中的键名一致 