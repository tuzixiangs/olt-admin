# Feature-Sliced Design 架构

Feature-Sliced Design (FSD) 是 OLT Admin 采用的核心架构模式。它将应用按功能切片组织，实现高内聚、低耦合的代码结构。

## 🎯 核心理念

### 什么是 Feature-Sliced Design？

Feature-Sliced Design 是一种前端架构方法论，其核心思想是：

> **将实现同一功能的代码组织在一起，而不是按技术类型分散在不同目录中**

### 传统架构 vs FSD

#### 传统架构 (按技术分层)

```
src/
├── components/     # 所有组件
├── services/       # 所有 API
├── types/          # 所有类型
├── hooks/          # 所有 Hooks
└── utils/          # 所有工具
```

**问题**:

- 修改一个功能需要在多个目录间跳转
- 代码耦合度高，难以维护
- 团队协作时容易产生冲突

#### FSD 架构 (按功能分层)

```
src/
├── pages/
│   ├── user-management/    # 用户管理功能
│   │   ├── api.ts         # 用户 API
│   │   ├── types.ts       # 用户类型
│   │   ├── hooks.ts       # 用户 Hooks
│   │   └── components/    # 用户组件
│   └── product-management/ # 产品管理功能
└── shared/                # 共享资源
```

**优势**:

- 功能内聚，相关代码在一起
- 易于理解和维护
- 团队可以并行开发不同功能

## 🏗️ 架构层级

FSD 将应用分为多个层级，每个层级有明确的职责和依赖关系：

```
┌─────────────────┐
│     app/        │ ← 应用层 (配置、提供者)
├─────────────────┤
│    pages/       │ ← 页面层 (路由页面)
├─────────────────┤
│   widgets/      │ ← 部件层 (页面块)
├─────────────────┤
│  features/      │ ← 功能层 (用户场景)
├─────────────────┤
│  entities/      │ ← 实体层 (业务实体)
├─────────────────┤
│   shared/       │ ← 共享层 (可复用资源)
└─────────────────┘
```

### 在 OLT Admin 中的映射

我们根据项目特点，对标准 FSD 进行了适配：

| FSD 层级 | OLT Admin 目录 | 说明 |
|----------|----------------|------|
| app | `src/App.tsx`, `src/main.tsx` | 应用配置和启动 |
| pages | `src/pages/` | 路由页面和功能模块 |
| widgets | `src/layouts/`, `src/components/` | 页面布局和复合组件 |
| features | `src/pages/*/` | 具体业务功能 |
| entities | `src/api/`, `src/types/` | 业务实体和数据模型 |
| shared | `src/ui/`, `src/hooks/`, `src/utils/` | 共享资源 |

## 📁 目录结构详解

### 1. 共享层 (Shared)

存放与业务无关的可复用资源：

```
src/
├── ui/              # 基础 UI 组件
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── hooks/           # 通用 Hooks
│   ├── use-media-query.ts
│   └── use-copy-to-clipboard.ts
├── utils/           # 工具函数
│   ├── format.ts
│   └── validation.ts
└── assets/          # 静态资源
    ├── icons/
    └── images/
```

**特点**:

- 与业务逻辑解耦
- 可在任何地方使用
- 不依赖其他层级

### 2. 实体层 (Entities)

定义业务实体和数据模型：

```
src/
├── api/             # 全局 API 服务
│   ├── user.ts      # 用户 API
│   └── upload.ts    # 上传 API
└── types/           # 全局类型
    ├── user.ts      # 用户类型
    └── upload.ts    # 上传类型
```

**特点**:

- 定义核心业务概念
- 提供数据访问接口
- 可被上层使用

### 3. 功能层 (Features)

实现具体的用户场景和业务功能：

```
src/pages/user-management/
├── api.ts           # 用户管理 API
├── types.ts         # 用户管理类型
├── hooks.ts         # 用户管理 Hooks
├── store.ts         # 用户管理状态
├── components/      # 用户管理组件
│   ├── UserForm.tsx
│   └── UserCard.tsx
├── list.tsx         # 用户列表页
├── detail.tsx       # 用户详情页
└── edit.tsx         # 用户编辑页
```

**特点**:

- 实现完整的用户场景
- 包含该功能的所有资源
- 高度内聚，低耦合

### 4. 页面层 (Pages)

组织路由页面和功能入口：

```
src/pages/
├── dashboard/       # 仪表盘
├── user-management/ # 用户管理
├── product-management/ # 产品管理
└── settings/        # 系统设置
```

**特点**:

- 对应路由结构
- 组合下层功能
- 提供页面入口

## 🔄 依赖规则

### 严格的依赖方向

```
app → pages → widgets → features → entities → shared
```

**规则**:

- 只能向下依赖 (右侧层级)
- 禁止向上依赖 (左侧层级)
- 同层级间谨慎依赖

### 导入示例

```tsx
// ✅ 允许: pages 导入 shared
import { Button } from '@/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

// ✅ 允许: features 导入 entities
import { getUserList } from '@/api/user';
import type { User } from '@/types/user';

// ❌ 禁止: shared 导入 features
import { UserForm } from '@/pages/user-management/components/UserForm';

// ❌ 禁止: entities 导入 features
import { useUserList } from '@/pages/user-management/hooks';
```

## 🎯 实践原则

### 1. 就近管理原则

相关功能的代码应该组织在一起：

```
user-management/
├── api.ts          # 用户 API
├── types.ts        # 用户类型
├── hooks.ts        # 用户 Hooks
├── store.ts        # 用户状态
└── components/     # 用户组件
```

### 2. 单一职责原则

每个模块应该有明确的职责：

```
user-api.ts         # 只处理用户 API
user-types.ts       # 只定义用户类型
user-hooks.ts       # 只包含用户 Hooks
```

### 3. 开放封闭原则

模块应该对扩展开放，对修改封闭：

```tsx
// 通过配置扩展功能
<UserTable 
  columns={customColumns}
  actions={customActions}
  filters={customFilters}
/>
```

## 🚀 实际应用

### 创建新功能模块

1. **确定功能边界**

   ```
   产品管理功能包括：
   - 产品列表
   - 产品详情
   - 产品编辑
   - 产品创建
   ```

2. **创建模块目录**

   ```bash
   mkdir src/pages/product-management
   ```

3. **添加核心文件**

   ```
   product-management/
   ├── api.ts          # 产品 API
   ├── types.ts        # 产品类型
   ├── hooks.ts        # 产品 Hooks
   ├── store.ts        # 产品状态
   ├── index.tsx       # 模块入口
   └── components/     # 产品组件
   ```

4. **实现功能**

   ```tsx
   // api.ts
   export const getProducts = () => api.get('/products');
   export const createProduct = (data) => api.post('/products', data);

   // types.ts
   export interface Product {
     id: string;
     name: string;
     price: number;
   }

   // hooks.ts
   export const useProducts = () => {
     return useQuery(['products'], getProducts);
   };
   ```

### 重构现有代码

如果发现代码分散在多个地方，可以按以下步骤重构：

1. **识别功能边界**
2. **创建新的功能模块**
3. **迁移相关代码**
4. **更新导入路径**
5. **删除旧文件**

### 何时应该提升资源？

当不确定某个资源是否需要共享时，默认应将其设为子模块私有。如果后续发现有多个子模块需要使用该资源，再采用“就近提升”原则，将其提升到父模块的公共层（如 dict/, utils/ 等目录中）。

## 📊 架构优势

### 开发效率

- **快速定位**: 功能相关代码在一起
- **并行开发**: 团队可以独立开发不同功能
- **减少冲突**: 避免多人修改同一文件

### 代码质量

- **高内聚**: 相关代码组织在一起
- **低耦合**: 模块间依赖关系清晰
- **易测试**: 功能模块独立，便于单元测试

### 维护性

- **易理解**: 代码结构清晰，新人容易上手
- **易扩展**: 添加新功能不影响现有代码
- **易重构**: 模块边界清晰，重构风险低

## 🔧 工具支持

### 路径别名

配置路径别名简化导入：

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "#/*": ["src/types/*"]
    }
  }
}
```

### Biome 规则

配置 Biome 规则强制依赖方向：

```js
// biome.json
{
 "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
 ...
}

```

## 📚 延伸阅读

- [Feature-Sliced Design 官方文档](https://feature-sliced.design/)
- [项目结构详解](../getting-started/project-structure)
- [代码风格指南](../development/code-style)

---

Feature-Sliced Design 不仅是一种架构模式，更是一种思维方式。它帮助我们构建更加清晰、可维护的前端应用。
