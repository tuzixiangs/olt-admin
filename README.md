# OLT Admin Dashboard

基于 React 19 + Vite + TypeScript 构建的现代化管理后台，采用 Feature-Sliced Design 架构模式，集成 Refine 框架。

## 🚀 技术栈

### 核心框架
- **React 19** - 最新的 React 版本
- **Vite** - 快速的构建工具
- **TypeScript** - 类型安全的 JavaScript 超集
- **React Router v7** - 声明式路由

### UI 与样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vanilla Extract** - 零运行时的 CSS-in-TS
- **Framer Motion** - 强大的动画库
- **shadcn/ui** - 基于 Radix UI 的组件库
- **antd** - 基于 React 的 UI 组件库
- **Iconify** - 丰富的图标库

### 状态管理与数据获取
- **Zustand** - 轻量级状态管理
- **TanStack Query** - 服务端状态管理和数据同步
- **Refine** - CRUD 密集型应用的 React 元框架

### 开发工具与代码质量
- **Biome** - 高性能代码格式化和检查工具
- **Lefthook** - Git hooks 管理
- **Mock Service Worker (MSW)** - API 模拟

## 🏗️ 项目架构

### Feature-Sliced Design

项目采用 **Feature-Sliced Design** 架构模式，将功能相关的代码组织在一起：

```
src/
├─ ui/                    # 原子级 UI 组件
├─ components/            # 复合组件
├─ hooks/                 # 全局 Hooks
├─ utils/                 # 工具函数
├─ store/                 # 全局状态
├─ types/                 # 全局类型
├─ refine/                # Refine 框架配置
│  ├─ providers/          # 数据提供者、路由提供者等
│  └─ resources/          # 自动收集资源配置
├─ pages/                 # 功能模块（就近管理）
│  ├─ dashboard/          # 仪表盘模块
│  ├─ management/         # 管理模块
│  ├─ refine/             # Refine CURD 示例
│  │  ├─ products/        # 产品管理
│  │  │  ├─ list.tsx
│  │  │  ├─ routes.tsx
│  │  │  └─ refine-config.ts
│  │  └─ users/           # 用户管理
│  └─ ...
└─ routes/                # 路由配置
```

### Refine 集成架构

我们采用**就近管理**的方式集成 Refine：

- **全局配置**: `src/refine/` 目录包含提供者配置和工具
- **模块配置**: 每个功能模块管理自己的 `refine-config.ts`
- **自动发现**: 系统自动收集所有模块的配置，无需手动注册

## 🎯 核心特性

### 开发体验
- ⚡ **零配置扩展** - 添加新功能自动生效
- 🔧 **类型安全** - 完整的 TypeScript 支持
- 🎨 **主题系统** - 支持亮色/暗色主题
- 🌍 **国际化** - 多语言支持

### 架构优势
- 🏗️ **高内聚低耦合** - 相关代码组织在一起
- 👥 **团队协作友好** - 避免配置文件冲突
- 📦 **模块化管理** - 易于维护和扩展
- 🔄 **自动化工具** - 减少重复配置

### 功能模块
- 📊 **数据分析** - 丰富的图表和数据可视化
- 👤 **用户管理** - 完整的用户 CRUD 操作
- 🛍️ **产品管理** - 产品信息管理系统
- ⚙️ **系统设置** - 权限、角色等系统配置

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

## 📚 文档

- [项目架构说明](src/pages/README.md) - Feature-Sliced Design 详细说明
- [Refine 集成指南](src/refine/README.md) - Refine 模块化配置说明
- [主题系统](src/theme/README.md) - 主题定制指南

## 🤝 开发指南

1. **遵循架构原则** - 使用 Feature-Sliced Design 模式
2. **类型安全** - 确保所有代码都有完整的类型定义
3. **就近管理** - 相关功能的代码应该组织在一起
4. **自动化优先** - 优先使用自动发现和配置机制
