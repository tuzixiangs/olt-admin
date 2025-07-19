# TanStack Router 迁移指南

## 迁移完成状态

✅ **已完成的任务：**
1. 安装 @tanstack/react-router 及相关依赖
2. 更新路由类型定义，保持向后兼容
3. 创建 TanStack Router 路由树结构
4. 迁移认证相关路由
5. 迁移 Dashboard 路由（基础版本）
6. 迁移主路由和错误页面路由
7. 更新导航组件以支持 TanStack Router
8. 迁移路由守卫逻辑
9. 更新 main.tsx 使用 TanStack Router
10. 配置 Vite 插件支持

## 📁 已创建的文件

### 核心路由文件
- `src/routes/__root.tsx` - 根路由配置
- `src/routes/auth.tsx` - 认证路由
- `src/routes/dashboard.tsx` - Dashboard 布局路由
- `src/routes/dashboard/workbench.tsx` - 工作台页面路由
- `src/routes/dashboard/analysis.tsx` - 分析页面路由
- `src/routes/main.tsx` - 主路由和错误页面
- `src/routes/routeTree.ts` - 完整路由树配置
- `src/routes/test-routeTree.ts` - 测试用简化路由树

### 工具和Hook
- `src/utils/route-converter.ts` - 路由格式转换工具
- `src/routes/hooks/use-router-tanstack.ts` - TanStack Router 兼容的 useRouter hook
- `src/routes/components/router-link-tanstack.tsx` - TanStack Router 兼容的 RouterLink 组件
- `src/hooks/use-tanstack-nav-data.ts` - 从 TanStack Router 提取导航数据的 hook

### 入口文件
- `src/main-tanstack.tsx` - 使用 TanStack Router 的新入口文件

### 类型定义
- `src/types/router.ts` - 更新的路由类型，保持向后兼容

## 🚀 如何测试迁移

### 1. 快速测试
要快速测试 TanStack Router 是否正常工作，可以临时替换入口文件：

```bash
# 备份原始 main.tsx
mv src/main.tsx src/main-react-router.tsx

# 使用 TanStack Router 版本
mv src/main-tanstack.tsx src/main.tsx

# 启动开发服务器
pnpm dev
```

### 2. 功能验证
测试以下功能是否正常：

- ✅ 应用启动和基本导航
- ✅ 认证流程 (访问 `/auth/login`)
- ✅ Dashboard 页面 (访问 `/workbench`)
- ✅ 错误页面 (访问 `/404`)
- ✅ 路由守卫功能
- ⚠️  导航组件显示（可能需要调整）
- ⚠️  面包屑功能（需要测试）
- ⚠️  多标签页功能（需要测试）

## 📋 剩余工作

### 高优先级
1. **完整页面路由迁移** - 迁移所有页面模块的路由
2. **导航组件兼容性** - 确保所有导航组件正常工作
3. **权限系统适配** - 验证权限控制功能
4. **多标签页系统** - 适配多标签页功能

### 中优先级
1. **面包屑组件** - 适配面包屑导航
2. **搜索功能** - 适配搜索栏功能
3. **后端路由模式** - 适配后端驱动的路由模式

### 低优先级
1. **性能优化** - 利用 TanStack Router 的预加载功能
2. **开发体验** - 配置开发工具和热重载
3. **文档更新** - 更新项目文档

## 🔧 迁移特定页面模块

对于每个页面模块（如 `/src/pages/components/routes.tsx`），需要：

1. **创建对应的 TanStack Router 路由文件**
```typescript
// src/routes/components.tsx
import { createRoute } from "@tanstack/react-router";
import { dashboardRoute } from "./dashboard";
// ... 导入组件

export const componentsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/components",
  meta: { /* 从原 routes.tsx 复制 meta 信息 */ }
});
```

2. **在路由树中注册**
```typescript
// src/routes/routeTree.ts
import { componentsRoute } from "./components";

export const routeTree = rootRoute.addChildren([
  dashboardRoute.addChildren([
    // ... 现有路由
    componentsRoute,
  ])
]);
```

## ⚠️  注意事项

1. **保持向后兼容** - 现有的 UI 组件应该继续工作
2. **渐进式迁移** - 可以逐步迁移，不需要一次性完成
3. **类型安全** - 充分利用 TanStack Router 的类型推断能力
4. **性能优化** - 利用预加载和懒加载功能

## 🔄 回滚计划

如果迁移过程中遇到问题，可以快速回滚：

```bash
# 恢复原始 main.tsx
mv src/main.tsx src/main-tanstack.tsx
mv src/main-react-router.tsx src/main.tsx

# 移除 TanStack Router 依赖（可选）
pnpm remove @tanstack/react-router @tanstack/router-devtools @tanstack/router-vite-plugin
```

## 📚 相关资源

- [TanStack Router 官方文档](https://tanstack.com/router/latest)
- [迁移指南](https://tanstack.com/router/latest/docs/framework/react/guide/migration)
- [类型安全指南](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety) 