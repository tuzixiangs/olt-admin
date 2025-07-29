# 路由系统文档

本文档介绍如何在项目中添加和管理路由，以及路由的结构和参数使用。

## 路由结构

项目采用分层路由结构，主要分为以下几个部分：

1. **Auth Routes** - 认证相关路由（如登录页面）
2. **Dashboard Routes** - 主应用路由（受保护的页面）
3. **Main Routes** - 主路由（如错误页面）

路由配置采用嵌套结构，支持动态导入和懒加载。

## 如何添加路由

### 1. 创建页面组件

首先，在 `/src/pages/` 目录下创建你的页面组件。根据 [Feature-Sliced Design](../architecture/feature-sliced-design.md) 原则，将相关功能组织在相应的功能模块中。(项目会自动收集页面模块下的配置文件`src/xxx/router/index.tsx`，并生成路由配置)

例如，创建一个用户管理页面：

```
src/
└─ pages/
   └─ management/
      └─ user/
         ├─ index.tsx      # 页面组件
         ├─ api.ts         # API 调用
         ├─ types.ts       # 类型定义
         └─ hooks.ts       # 自定义 hooks
```

### 2. 添加路由配置

根据页面的性质，选择合适的路由位置添加配置：

#### 对于主应用页面（受保护页面）

在对应的模块路由文件中添加路由配置，例如在 `/src/pages/example/routes/index.tsx`：

```typescript
import type { AppRouteObject } from "@/types/router";

const UserPage = lazy(() => import("../user"));

const routes: AppRouteObject[] = [
  {
    path: "user",
    Components: <UserPage />,
  },
  // 其他路由...
];

export default routes;
```

#### 对于认证页面

在 `/src/routes/sections/auth.tsx` 中添加：

```typescript
const LoginPage = lazy(() => import("@/pages/sys/login"));
const UserLoginPage = lazy(() => import("@/pages/user/login"));

const authCustom: RouteObject[] = [
  {
    path: "login",
    Components,: <LoginPage />,
  },
  {
    path: "user-login",
    element: <UserLoginPage />,
  },
];

export const authRoutes: RouteObject[] = [
  {
    path: "auth",
    element: (
      <Suspense>
        <Outlet />
      </Suspense>
    ),
    children: [...authCustom],
  },
];
```

### 3. 路由嵌套

项目支持嵌套路由，可以通过 children 属性实现：

```typescript
const routes: AppRouteObject[] = [
  {
    path: "user",
    children: [
      {
        index: true,
        Components: <UserList />,
      },
      {
        path: "create",
        Components: <UserCreate />,
      },
      {
        path: ":id",
        Components: <UserDetail />,
      },
      {
        path: ":id/edit",
        Components: <UserEdit />,
      },
    ],
  },
];
```

## 路由参数

### 1. 路径参数（Path Parameters）

通过 `:paramName` 的形式定义路径参数：

```typescript
{
  path: "user/:id",
  element: <UserDetail />,
}
```

在组件中获取参数：

```typescript
import { useParams } from "@/routes/hooks";

const UserDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>用户详情 - ID: {id}</h1>
    </div>
  );
};
```

### 2. 查询参数（Query Parameters）

通过 `useSearchParams` 获取查询参数：

```typescript
import { useSearchParams } from "@/routes/hooks";

const UserList = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const keyword = searchParams.get("keyword") || "";
  
  return (
    <div>
      <p>当前页: {page}</p>
      <p>搜索关键词: {keyword}</p>
    </div>
  );
};
```

### 3. 状态参数（State Parameters）

通过 `useLocation` 获取通过路由传递的状态：

```typescript
import { useLocation } from "react-router";

const SomeComponent = () => {
  const location = useLocation();
  const { from } = location.state || {};
  
  // 使用 from 状态
};
```

## 路由导航

使用 `useRouter` hook 进行编程式导航：

```typescript
import { useRouter } from "@/routes/hooks";

const SomeComponent = () => {
  const router = useRouter();
  
  const handleNavigate = () => {
    // 跳转到指定路径
    router.push("/user/123");
    
    // 替换当前历史记录
    router.replace("/user/123");
    
    // 返回上一页
    router.back();
    
    // 前进到下一页
    router.forward();
    
    // 重新加载页面
    router.reload();
  };
  
  return (
    <button onClick={handleNavigate}>
      导航到用户详情
    </button>
  );
};
```

## 动态路由加载

项目使用 React 的 lazy 和 Suspense 实现组件的懒加载：

```typescript
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("../path/to/component"));

const ParentComponent = () => (
  <Suspense fallback={<div>加载中...</div>}>
    <LazyComponent />
  </Suspense>
);
```

## 路由守卫

项目提供了路由守卫功能，用于保护某些路由只允许认证用户访问：

```typescript
import LoginAuthGuard from "@/routes/components/login-auth-guard";

export const protectedRoutes: RouteObject[] = [
  {
    element: (
      <LoginAuthGuard>
        <DashboardLayout />
      </LoginAuthGuard>
    ),
    children: [
      // 受保护的路由
    ],
  },
];
```

## 错误边界

项目集成了路由错误边界处理：

```typescript
import ErrorBoundary from "@/routes/components/error-boundary";

export const routes: RouteObject[] = [
  {
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      // 路由配置
    ],
  },
];
```

## 路由模式

项目支持两种路由模式：

1. **前端路由模式** - 使用 React Router 处理路由
2. **后端路由模式** - 根据后端返回的菜单数据动态生成路由

通过 `/src/global-config.ts` 中的 `GLOBAL_CONFIG.routerMode` 配置项切换路由模式。
