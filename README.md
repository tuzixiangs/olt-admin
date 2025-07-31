# OLT Admin

基于 React 19 + Vite + TypeScript 构建的现代化管理后台，采用 Feature-Sliced Design 架构模式。

## 🚀 技术栈

### 核心框架

- [**React 19**](https://react.dev/) - 最新的 React 版本，提供更好的性能和新特性
- [**Vite**](https://vite.dev/) - 极速的构建工具，提供快速的开发体验
- [**TypeScript**](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- [**React Router v7**](https://reactrouter.com/home) - 路由管理

### UI 与样式

- [**Tailwind CSS**](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [**Vanilla Extract**](https://vanilla-extract.style/) - 零运行时的 CSS-in-TS
- [**Framer Motion**](https://motion.dev/) - 强大的动画库
- [**shadcn/ui**](https://ui.shadcn.com/) - 基于 Radix UI 的组件库
- [**Ant Design**](https://ant.design/) - 企业级 UI 设计语言和 React 组件库
- [**Ant Design Pro Components**](https://pro.ant.design/zh-CN/docs/overview) - 高级组件库
- [**Iconify**](https://iconify.design/) - 丰富的图标库

### 状态管理与数据获取

- [**Zustand**](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [**TanStack Query**](https://tanstack.com/query/latest) - 服务端状态管理和数据同步 [tanstack query]
- [**React Hook Form**](https://react-hook-form.com/) - 表单状态管理 [react hook form]
- [**React Activation**](https://github.com/CJY0208/react-activation) - keep-alive 实现，保持组件状态 [react activation]

### 开发工具与代码质量

- [**Biome**](https://biomejs.dev/) - 高性能代码格式化和检查工具
- [**Lefthook**](https://github.com/Arkweid/lefthook) - Git hooks 管理
- [**Mock Service Worker (MSW)**](https://mswjs.io/) - API 模拟

## 🏗️ 项目架构

### Feature-Sliced Design

项目采用 **Feature-Sliced Design** 架构模式，将功能相关的代码组织在一起，实现高内聚、低耦合：

```
src/
├─ _mock/                 # 模拟数据
├─ api/                   # API 客户端和服务
├─ assets/                # 静态资源
├─ components/            # 全局共享组件
├─ dict/                  # 全局字典
├─ hooks/                 # 全局 Hooks
├─ layouts/               # 布局组件
├─ locales/               # 国际化资源
├─ pages/                 # 功能模块（就近管理）
│  ├─ dashboard/          # 仪表盘模块
│  ├─ example/            # 示例模块
│  │  ├─ curd/            # CRUD 示例
│  │  │  ├─ posts/        # 文章管理
│  │  │  └─ role/         # 角色管理
│  │  └─ error/           # 错误页面
│  └─ sys/                # 系统模块
├─ routes/                # 路由配置
├─ store/                 # 全局状态管理
├─ styles/                # 全局样式
├─ theme/                 # 主题配置
├─ types/                 # 全局类型定义
├─ ui/                    # 基础 UI 组件
├─ utils/                 # 工具函数
├─ App.tsx                # 应用根组件
└─ main.tsx               # 应用入口
```

### 模块化设计

每个功能模块（如 [/src/pages/example/curd/posts](src/pages/example/curd/posts)）都遵循就近管理原则，包含该功能所需的所有资源：

```
posts/
├── api/
│   └── index.ts        # API 接口定义
├── components/
│   ├── PostDetail.tsx  # 详情组件
│   └── PostEdit.tsx    # 编辑组件
├── hooks/
│   ├── constants.ts    # 常量定义
│   ├── index.ts        # hooks 导出
│   ├── mutations.ts    # react-query mutations
│   └── queries.ts      # react-query queries
├── detail-page.tsx     # 详情页面（基于路由）
├── edit-page.tsx       # 编辑页面（基于路由）
├── list-page.tsx       # 列表页面（基于路由）
├── list.tsx            # 列表组件（使用模态框）
├── types.ts            # 类型定义
```

## 🎯 核心特性

### 开发体验

- ⚡ **热重载** - 代码修改即时生效
- 🔧 **类型安全** - 完整的 TypeScript 支持
- 🎨 **主题系统** - 支持亮色/暗色主题
- 🌍 **国际化** - 多语言支持
- 🧪 **模拟数据** - MSW 提供完整的 API 模拟

### 架构优势

- 🏗️ **高内聚低耦合** - 相关代码组织在一起
- 👥 **团队协作友好** - 避免配置文件冲突
- 📦 **模块化管理** - 易于维护和扩展
- 🔄 **自动化工具** - 减少重复配置

### 功能模块

- 📊 **数据展示** - 丰富的表格和数据可视化组件
- 📝 **表单处理** - 完整的表单验证和提交流程
- 👤 **用户管理** - 用户认证和权限控制
- 📁 **文件管理** - 文件上传和管理功能
- 🌐 **多页签** - 多页签浏览体验
- 🧠 **状态缓存** - keep-alive 实现组件状态缓存

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📚 文档

通过运行 `pnpm run docs` 来启动文档服务器，查看项目详细文档。

```
pnpm run docs
```

## 🤝 开发指南

1. **遵循架构原则** - 使用 Feature-Sliced Design 模式组织代码
2. **类型安全** - 确保所有代码都有完整的 TypeScript 类型定义
3. **就近管理** - 相关功能的代码应该组织在同一个模块目录下
4. **组件复用** - 优先使用现有组件，避免重复开发
5. **状态管理** - 合理使用 Zustand 和 TanStack Query 管理应用状态
6. **样式规范** - 使用 Tailwind CSS 和 Vanilla Extract 编写样式

## 🧩 组件和功能

### 路由系统

- 基于 React Router v7 实现
- 支持动态路由和嵌套路由
- 提供编程式导航 hooks
- 支持路由守卫和权限控制

### 表格组件

- 基于 Ant Design Pro Table 实现
- 集成分页、搜索、排序功能
- 支持自定义列渲染
- 内置数据缓存和状态管理

### 表单组件

- 基于 Ant Design Pro Form 实现
- 支持多种表单控件
- 内置表单验证
- 支持动态表单和复杂表单布局

### 状态管理

- 使用 Zustand 管理全局状态
- 使用 TanStack Query 管理服务端状态
- 提供自定义 hooks 简化状态操作

### 多页签管理

- 支持多页签浏览
- 页签状态保持
- 动态页签标题更新
- 页签关闭和刷新功能

### 主题系统

- 支持亮色和暗色主题
- 可扩展的主题配置
- 组件级别的主题适配
