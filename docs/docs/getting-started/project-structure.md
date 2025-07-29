# 项目结构

本文档详细介绍 OLT Admin 的项目结构和文件组织方式，帮助您快速理解代码布局。

## 📁 根目录结构

```
olt-admin/
├── docs/                    # 📚 文档站点 (Docusaurus)
├── public/                  # 🌐 静态资源
├── src/                     # 💻 源代码目录
├── .env                     # 🔧 环境变量
├── .env.development         # 🔧 开发环境配置
├── .env.production          # 🔧 生产环境配置
├── biome.json              # 🔍 代码格式化配置
├── components.json         # 🧩 shadcn/ui 组件配置
├── lefthook.yml           # 🪝 Git hooks 配置
├── package.json           # 📦 项目依赖
├── pnpm-workspace.yaml    # 📦 pnpm workspace 配置
├── tailwind.config.ts     # 🎨 Tailwind CSS 配置
├── tsconfig.json          # 📝 TypeScript 配置
└── vite.config.ts         # ⚡ Vite 构建配置
```

## 🏗️ 源代码结构 (src/)

项目采用 **Feature-Sliced Design** 架构模式，将代码按功能模块组织：

```
src/
├── _mock/                   # 🎭 模拟数据 (MSW)
│   ├── handlers/           # API 处理器
│   ├── assets.ts          # 模拟资源
│   └── index.ts           # MSW 配置
│
├── api/                     # 🔌 API 客户端
│   ├── services/          # 通用 API 服务
│   ├── apiClient.ts       # HTTP 客户端
│   └── fakeClient.ts      # 模拟客户端
│
├── assets/                  # 🖼️ 静态资源
│   ├── icons/             # 图标文件
│   └── images/            # 图片文件
│
├── components/              # 🧩 全局共享组件
│   ├── animate/           # 动画组件
│   ├── auth/              # 认证组件
│   ├── icon/              # 图标组件
│   ├── loading/           # 加载组件
│   ├── nav/               # 导航组件
│   ├── olt-table/         # 表格组件
│   └── ...                # 其他组件
│
├── dict/                    # 📖 全局字典
│   └── index.ts           # 常量定义
│
├── hooks/                   # 🎣 自定义 Hooks
│   ├── docs/              # Hooks 文档
│   ├── use-copy-to-clipboard.ts
│   ├── use-media-query.ts
│   └── ...                # 其他 Hooks
│
├── layouts/                 # 📐 布局组件
│   ├── dashboard/         # 仪表盘布局
│   └── simple/            # 简单布局
│
├── locales/                 # 🌍 国际化
│   ├── lang/              # 语言包
│   ├── i18n.ts            # i18n 配置
│   └── use-locale.ts      # 语言 Hook
│
├── pages/                   # 📄 页面模块 (Feature-Sliced)
│   ├── dashboard/         # 仪表盘模块
│   ├── example/           # 示例模块
│   │   ├── curd/          # CRUD 示例
│   │   │   ├── posts/     # 文章管理
│   │   │   └── role/      # 角色管理
│   │   └── error/         # 错误页面
│   └── sys/               # 系统模块
│
├── routes/                  # 🛣️ 路由配置
│   ├── components/        # 路由组件
│   ├── hooks/             # 路由 Hooks
│   └── sections/          # 路由分组
│
├── store/                   # 🗄️ 全局状态管理
│   ├── cacheStore.ts      # 缓存状态
│   ├── settingStore.ts    # 设置状态
│   └── userStore.ts       # 用户状态
│
├── styles/                  # 🎨 全局样式
│   ├── index.css          # 主样式文件
│   ├── olt-table.css      # 表格样式
│   └── rest-antd.css      # Ant Design 重置
│
├── theme/                   # 🌈 主题系统
│   ├── adapter/           # 主题适配器
│   ├── hooks/             # 主题 Hooks
│   ├── tokens/            # 设计令牌
│   ├── theme-provider.tsx # 主题提供者
│   └── theme.css.ts       # 主题样式
│
├── types/                   # 📝 全局类型定义
│   ├── api.ts             # API 类型
│   ├── entity.ts          # 实体类型
│   ├── enum.ts            # 枚举类型
│   └── router.ts          # 路由类型
│
├── ui/                      # 🎛️ 基础 UI 组件
│   ├── button.tsx         # 按钮组件
│   ├── input.tsx          # 输入框组件
│   ├── dialog.tsx         # 对话框组件
│   └── ...                # 其他 UI 组件
│
├── utils/                   # 🔧 工具函数
│   ├── format-number.ts   # 数字格式化
│   ├── storage.ts         # 存储工具
│   ├── theme.ts           # 主题工具
│   └── tree.ts            # 树形数据工具
│
├── App.tsx                  # 🚀 应用根组件
├── main.tsx                 # 🎯 应用入口
├── global.css              # 🌐 全局样式
└── vite-env.d.ts           # 🔧 Vite 类型声明
```

## 🎯 Feature-Sliced Design 详解

### 全局共享资源

这些资源与具体业务逻辑解耦，可在应用任何地方复用：

- **`ui/`**: 最基础的原子组件 (Button, Input, Dialog)
- **`components/`**: 复杂的通用组件 (Chart, Editor, Table)
- **`hooks/`**: 通用的自定义 Hooks
- **`utils/`**: 全局工具函数
- **`types/`**: 全局共享类型
- **`assets/`**: 静态资源

### 功能模块资源 (pages/*)

每个功能模块是一个独立的"切片"，包含实现自身业务所需的所有资源。

#### 模块示例: posts 文章管理

```
pages/example/curd/posts/
├── components/              # 私有组件
│   ├── PostCard.tsx        # 文章卡片
│   └── PostForm.tsx        # 文章表单
├── api.ts                  # API 接口
├── hooks.ts                # 业务 Hooks
├── store.ts                # 模块状态
├── types.ts                # 类型定义
├── index.tsx               # 页面入口
├── list.tsx                # 列表页面
├── detail.tsx              # 详情页面
└── edit.tsx                # 编辑页面
```

## 📂 目录命名规范

### 文件夹命名

- 使用 **kebab-case** (小写 + 连字符)
- 具有描述性的名称
- 避免特殊字符和空格

```bash
# ✅ 推荐
user-management/
api-services/
data-table/

# ❌ 不推荐
UserManagement/
apiServices/
data_table/
```

### 文件命名

- **组件文件**: PascalCase + `.tsx`
- **工具文件**: kebab-case + `.ts`
- **类型文件**: kebab-case + `.ts`

```bash
# ✅ 推荐
UserCard.tsx          # React 组件
user-service.ts       # 工具函数
api-types.ts          # 类型定义

# ❌ 不推荐
userCard.tsx
UserService.ts
apiTypes.ts
```

## 🔄 模块间依赖关系

### 依赖层级

```
┌─────────────────┐
│   pages/        │ ← 业务模块 (可依赖下层)
├─────────────────┤
│   components/   │ ← 通用组件 (可依赖下层)
├─────────────────┤
│   ui/           │ ← 基础组件 (最底层)
└─────────────────┘
```

### 导入规则

- **向下依赖**: 上层可以导入下层
- **禁止向上依赖**: 下层不能导入上层
- **同层导入**: 同层模块间谨慎导入

```tsx
// ✅ 允许: pages 导入 components
import { DataTable } from '@/components/data-table';

// ✅ 允许: components 导入 ui
import { Button } from '@/ui/button';

// ❌ 禁止: ui 导入 components
import { DataTable } from '@/components/data-table';
```

## 📋 文件组织最佳实践

### 1. 就近管理原则

相关功能的代码应该组织在同一个模块目录下：

```
posts/
├── api.ts          # Posts 相关 API
├── types.ts        # Posts 相关类型
├── hooks.ts        # Posts 相关 Hooks
└── components/     # Posts 专用组件
```

### 2. 单一职责原则

每个文件应该有明确的职责：

```
user-service.ts     # 只处理用户相关的 API
user-types.ts       # 只定义用户相关的类型
user-hooks.ts       # 只包含用户相关的 Hooks
```

### 3. 统一导出

使用 `index.ts` 文件统一导出：

```tsx title="components/index.ts"
export { default as DataTable } from './data-table';
export { default as UserCard } from './user-card';
export type { DataTableProps } from './data-table';
```

### 路径别名

项目配置了路径别名，方便导入：

```tsx
// 使用别名
import { Button } from '@/ui/button';
import { useUser } from '@/hooks/use-user';
import { UserService } from '@/api/user-service';

// 而不是相对路径
import { Button } from '../../../ui/button';
```

## 📈 扩展项目结构

### 添加新模块

1. 在 `pages/` 下创建模块目录
2. 添加必要的文件 (api.ts, types.ts, etc.)
3. 在路由配置中注册
4. 更新导航菜单

### 添加新组件

1. 在 `components/` 下创建组件目录
2. 实现组件功能
3. 添加到 `index.ts` 导出
4. 编写文档和测试

---

理解项目结构是高效开发的基础。遵循这些组织原则，您的代码将更加清晰、可维护和可扩展。
