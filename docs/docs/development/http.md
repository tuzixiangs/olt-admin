# 请求处理

请求模块负责处理所有 HTTP 请求，提供统一的接口调用方式和完善的错误处理机制。该模块可与 `@tanstack/react-query` 深度集成，为数据获取、缓存和状态管理提供强大的支持。

## 📁 目录结构

```
src/api/
├── apiClient.ts          # 默认 API 客户端实例
├── apiClientFactory.ts   # API 客户端工厂函数
├── fakeClient.ts         # Mock 客户端（用于开发测试）
└── services/             # 业务服务模块
    ├── userService.ts    # 用户相关 API
    ├── menuService.ts    # 菜单相关 API
    └── demoService.ts    # 演示相关 API
```

## 🏗️ 架构设计

### 核心组件

#### 1. API 客户端工厂 (`apiClientFactory.ts`)

API 客户端工厂是整个 API 模块的核心，负责创建配置完善的 Axios 实例：

```typescript
export function createApiClient(customConfig: ApiClientOptions = {}): AxiosInstance {
  const defaultConfig: ApiClientOptions = {
    baseURL: GLOBAL_CONFIG.apiBaseUrl,
    timeout: 50000,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  };

  const mergedConfig = deepmerge(defaultConfig, customConfig);
  const apiClient = axios.create(mergedConfig);

  // 添加请求拦截器和响应拦截器
  // ...
  
  return apiClient;
}
```

**主要功能：**

- 统一的基础配置管理
- 自动 Token 注入
- 统一的响应数据处理
- 全局错误处理
- 401 状态码自动登出

#### 2. APIClient 类

提供了类型安全的 HTTP 方法封装：

```typescript
export class APIClient {
  get<T = unknown>(config: AxiosRequestConfig): Promise<T>
  post<T = unknown>(config: AxiosRequestConfig): Promise<T>
  put<T = unknown>(config: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(config: AxiosRequestConfig): Promise<T>
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>
}
```

#### 3. 服务模块 (`services/`)

每个服务模块负责特定业务领域的 API 调用：

```typescript
// userService.ts 示例
export interface SignInReq {
  username: string;
  password: string;
}

export enum UserApi {
  SignIn = "/auth/signin",
  SignUp = "/auth/signup",
  Logout = "/auth/logout",
}

const signin = (data: SignInReq) => 
  apiClient.post<SignInRes>({ url: UserApi.SignIn, data });

export default {
  signin,
  signup,
  findById,
  logout,
};
```

## 🔄 与 React Query 集成

### 基本使用模式

API 模块与 `@tanstack/react-query` 的集成遵循以下模式：

#### 1. 查询 (Queries)

```typescript
// hooks/queries.ts
import { useQuery } from '@tanstack/react-query';
import userService from '@/api/services/userService';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.findById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}
```

#### 2. 变更 (Mutations)

```typescript
// hooks/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/api/services/userService';

export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.signin,
    onSuccess: (data) => {
      // 更新用户信息缓存
      queryClient.setQueryData(['user', data.user.id], data.user);
      // 清除相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('登录失败:', error);
    },
  });
}
```

### 高级集成模式

#### 1. 查询键管理

使用查询键工厂统一管理缓存键：

```typescript
// hooks/queryKeys.ts
export const userQueryKeys = {
  all: () => ['user'] as const,
  lists: () => [...userQueryKeys.all(), 'list'] as const,
  list: (filters: string) => [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all(), 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};
```

#### 2. 乐观更新

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.update,
    onMutate: async (newUser) => {
      // 取消相关的查询
      await queryClient.cancelQueries({ queryKey: userQueryKeys.detail(newUser.id) });
      
      // 获取当前数据快照
      const previousUser = queryClient.getQueryData(userQueryKeys.detail(newUser.id));
      
      // 乐观更新
      queryClient.setQueryData(userQueryKeys.detail(newUser.id), newUser);
      
      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // 回滚到之前的数据
      if (context?.previousUser) {
        queryClient.setQueryData(userQueryKeys.detail(newUser.id), context.previousUser);
      }
    },
    onSettled: (data, error, variables) => {
      // 重新获取数据确保一致性
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) });
    },
  });
}
```

## 🛠️ 使用示例

### 基础用法

```typescript
// 在组件中使用
import { useQuery, useMutation } from '@tanstack/react-query';
import userService from '@/api/services/userService';

function UserProfile({ userId }: { userId: string }) {
  // 查询用户信息
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.findById(userId),
  });

  // 登录变更
  const signInMutation = useMutation({
    mutationFn: userService.signin,
    onSuccess: (data) => {
      console.log('登录成功:', data);
    },
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button 
        onClick={() => signInMutation.mutate({ username: 'test', password: '123' })}
        disabled={signInMutation.isPending}
      >
        {signInMutation.isPending ? '登录中...' : '登录'}
      </button>
    </div>
  );
}
```

### 高级用法 - 结合 useProTable

```typescript
import { useProTable } from '@/hooks/use-pro-table';
import userService from '@/api/services/userService';

function UserList() {
  const { tableProps, refresh } = useProTable(
    userService.getList,
    {
      queryKey: ['users', 'list'],
      defaultPageSize: 10,
    }
  );

  return (
    <OltTable
      {...tableProps}
      columns={columns}
      rowKey="id"
      toolBarRender={() => [
        <Button key="refresh" onClick={refresh}>
          刷新
        </Button>
      ]}
    />
  );
}
```

## 🎯 最佳实践

### 1. 错误处理

```typescript
// 全局错误处理已在 apiClientFactory 中配置
// 组件级别的错误处理
const { data, error, isError } = useQuery({
  queryKey: ['user', id],
  queryFn: () => userService.findById(id),
  retry: (failureCount, error) => {
    // 401 错误不重试
    if (error.response?.status === 401) return false;
    return failureCount < 3;
  },
});

if (isError) {
  // 处理特定错误
  if (error.response?.status === 404) {
    return <div>用户不存在</div>;
  }
  return <div>加载失败，请重试</div>;
}
```

### 2. 缓存策略

```typescript
// 不同数据的缓存策略
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => userService.findById(id),
  staleTime: 5 * 60 * 1000,    // 5分钟内认为数据是新鲜的
  cacheTime: 10 * 60 * 1000,   // 10分钟后清除缓存
  refetchOnWindowFocus: false,  // 窗口聚焦时不重新获取
  refetchOnMount: false,        // 组件挂载时不重新获取
});
```

### 3. 类型安全

```typescript
// 定义完整的类型
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

// 服务方法使用泛型
const getUsers = (params: UserListParams) => 
  apiClient.get<User[]>({ url: '/users', params });

// Hook 中保持类型安全
export function useUsers(params: UserListParams) {
  return useQuery<User[], Error>({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
}
```

### 4. 性能优化

```typescript
// 使用 select 选择需要的数据
const userName = useQuery({
  queryKey: ['user', id],
  queryFn: () => userService.findById(id),
  select: (user) => user.name, // 只选择名称，减少重渲染
});

// 使用 keepPreviousData 保持之前的数据
const { data, isFetching } = useQuery({
  queryKey: ['users', page],
  queryFn: () => userService.getList({ page }),
  keepPreviousData: true, // 翻页时保持之前的数据
});
```

## 🔧 配置选项

### API 客户端配置

```typescript
// 自定义 API 客户端
const customApiClient = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  headers: {
    'Custom-Header': 'value',
  },
  interceptors: {
    request: {
      onFulfilled: (config) => {
        // 自定义请求拦截
        return config;
      },
    },
    response: {
      onFulfilled: (response) => {
        // 自定义响应拦截
        return response;
      },
    },
  },
  disableCommonInterceptors: false, // 是否禁用通用拦截器
});
```

### React Query 全局配置

```typescript
// main.tsx 中的全局配置
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5分钟
      cacheTime: 10 * 60 * 1000,    // 10分钟
      retry: 3,                      // 重试3次
      refetchOnWindowFocus: false,   // 窗口聚焦时不重新获取
    },
    mutations: {
      retry: 1, // 变更操作重试1次
    },
  },
});
```

## 📚 相关文档

- [开发指南 - CRUD 示例](../development/curd.md) - 完整的 CRUD 实现示例
- [Hooks - useProTable](../hooks/use-pro-table.md) - 表格数据管理 Hook
- [开发指南 - 状态管理](../development/state-management.md) - 状态管理最佳实践
- [@tanstack/react-query 官方文档](https://tanstack.com/query/latest) - React Query 官方文档
