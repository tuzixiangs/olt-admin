# TanStack Query (React Query) 详解

TanStack Query（前身为 React Query）是一个强大的数据获取和状态管理库，专门用于处理服务端状态。它提供了缓存、同步、后台更新和数据失效等高级功能，大大简化了复杂应用中的数据管理。

## 🎯 核心概念

### 1. 查询 (Queries)

查询用于获取数据，是 TanStack Query 的核心概念之一。

#### 基础查询

```typescript
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

// 基础查询
const UserList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>错误: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

#### 带参数的查询

```typescript
import { useQuery } from '@tanstack/react-query';

// 带参数的查询
const UserDetail = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', userId], // 查询键包含参数
    queryFn: () => userService.getUser(userId),
    enabled: !!userId, // 只有当 userId 存在时才执行查询
  });

  // 渲染逻辑...
};
```

#### 查询键 (Query Keys)

查询键用于唯一标识一个查询，支持嵌套结构：

```typescript
// 简单查询键
['todos']

// 带参数的查询键
['todo', 5]

// 复杂查询键
['todos', { status: 'done', page: 1 }]

// 嵌套查询键
['todos', { status: 'done' }, { page: 1 }]
```

### 2. 变更 (Mutations)

变更用于创建、更新或删除数据。

#### 基础变更

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateUser = () => {
  const queryClient = useQueryClient();
  
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (newUser) => userService.createUser(newUser),
    onSuccess: () => {
      // 变更成功后使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (userData) => {
    mutate(userData);
  };

  // 渲染逻辑...
};
```

#### 高级变更处理

```typescript
const UpdateUser = () => {
  const queryClient = useQueryClient();
  
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // 取消相关的数据获取，防止冲突
      await queryClient.cancelQueries({ queryKey: ['user', id] });
      
      // 保存之前的数据快照
      const previousUser = queryClient.getQueryData(['user', id]);
      
      // 立即更新 UI（乐观更新）
      queryClient.setQueryData(['user', id], { ...previousUser, ...data });
      
      // 返回上下文对象，用于错误回滚
      return { previousUser, id };
    },
    onError: (err, variables, context) => {
      // 发生错误时回滚
      if (context?.previousUser) {
        queryClient.setQueryData(['user', context.id], context.previousUser);
      }
    },
    onSuccess: (data, variables) => {
      // 更新成功后更新缓存
      queryClient.setQueryData(['user', variables.id], data);
    },
    onSettled: (data, error, variables) => {
      // 最终使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // 使用逻辑...
};
```

### 3. 查询失效和缓存

#### 手动失效查询

```typescript
import { useQueryClient } from '@tanstack/react-query';

const UserProfile = () => {
  const queryClient = useQueryClient();
  
  // 失效单个查询
  const invalidateUser = (userId) => {
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
  };
  
  // 失效多个相关查询
  const invalidateAllUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };
  
  // 精确匹配失效
  const invalidateExactUser = (userId) => {
    queryClient.invalidateQueries({
      queryKey: ['user', userId],
      exact: true,
    });
  };
};
```

#### 手动设置查询数据

```typescript
const OptimisticUpdate = () => {
  const queryClient = useQueryClient();
  
  // 直接更新缓存数据
  const updateUserCache = (userId, newData) => {
    queryClient.setQueryData(['user', userId], (oldData) => {
      return { ...oldData, ...newData };
    });
  };
  
  // 预取数据
  const prefetchUser = async (userId) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => userService.getUser(userId),
    });
  };
};
```

## ⚙️ 配置选项详解

### 查询配置

```typescript
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  
  // 缓存时间（默认5分钟）
  cacheTime: 1000 * 60 * 5,
  
  // 数据陈旧时间（默认0，即始终陈旧）
  staleTime: 1000 * 60 * 1, // 1分钟内数据被视为新鲜
  
  // 是否在浏览器标签页重新获得焦点时重新获取
  refetchOnWindowFocus: true,
  
  // 是否在连接恢复时重新获取
  refetchOnReconnect: true,
  
  // 是否在组件挂载时重新获取
  refetchOnMount: true,
  
  // 是否启用查询
  enabled: true,
  
  // 重试次数（默认3）
  retry: 3,
  
  // 重试延迟
  retryDelay: 1000,
  
  // 查询失败时是否使用之前的陈旧数据
  useErrorBoundary: false,
  
  // 查询成功回调
  onSuccess: (data) => {
    console.log('查询成功:', data);
  },
  
  // 查询失败回调
  onError: (error) => {
    console.error('查询失败:', error);
  },
  
  // 查询状态改变回调
  onSettled: (data, error) => {
    console.log('查询完成');
  },
  
  // 选择器，只返回需要的部分数据
  select: (data) => data.slice(0, 10),
  
  // 初始数据
  initialData: [],
  
  // 保持之前的数据（分页时很有用）
  placeholderData: keepPreviousData,
});
```

### 变更配置

```typescript
const { mutate } = useMutation({
  mutationFn: (data) => api.createTodo(data),
  
  // 变更前的处理
  onMutate: (variables) => {
    console.log('变更即将开始:', variables);
  },
  
  // 变更成功
  onSuccess: (data, variables, context) => {
    console.log('变更成功:', data);
  },
  
  // 变更失败
  onError: (error, variables, context) => {
    console.error('变更失败:', error);
  },
  
  // 变更完成（无论成功或失败）
  onSettled: (data, error, variables, context) => {
    console.log('变更完成');
  },
});
```

## 🔄 高级用法

### 1. 分页查询

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query';

const TodoList = ({ page }) => {
  const { data, isPlaceholderData } = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page),
    placeholderData: keepPreviousData, // 保持之前的数据
    staleTime: 1000 * 60 * 5, // 5分钟内数据新鲜
  });

  return (
    <div>
      {data?.todos.map(todo => (
        <div key={todo.id}>{todo.title}</div>
      ))}
      <button 
        onClick={() => setPage(page + 1)} 
        disabled={isPlaceholderData} // 加载新数据时禁用按钮
      >
        下一页
      </button>
    </div>
  );
};
```

### 2. 无限查询

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const InfiniteTodos = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: ({ pageParam = 0 }) => fetchTodos(pageParam),
    getNextPageParam: (lastPage, pages) => {
      // 根据最后一页数据决定是否还有下一页
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.todos.map(todo => (
            <div key={todo.id}>{todo.title}</div>
          ))}
        </div>
      ))}
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? '加载中...' : '加载更多'}
      </button>
    </div>
  );
};
```

### 3. 并行和依赖查询

```typescript
// 并行查询
const ParallelQueries = () => {
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
  
  // 两个查询会并行执行
};

// 依赖查询
const DependentQuery = () => {
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
  
  // 只有当用户数据加载完成后才执行这个查询
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => fetchProjects(user?.id),
    enabled: !!user?.id,
  });
};
```

### 4. 查询预取

```typescript
import { useQueryClient } from '@tanstack/react-query';

const TodoItem = ({ todoId }) => {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // 预取数据
    queryClient.prefetchQuery({
      queryKey: ['todo', todoId],
      queryFn: () => fetchTodo(todoId),
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* 组件内容 */}
    </div>
  );
};
```

## 🛠️ 在 OLT Admin 中的实践

在 OLT Admin 项目中，我们采用了一种模块化的 TanStack Query 管理方式，以确保代码的可维护性和可扩展性。

### 1. 全局配置

我们创建了全局的查询客户端配置，统一管理所有查询和变更的默认行为：

```typescript
// src/api/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      cacheTime: 1000 * 60 * 30, // 30分钟
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

在应用入口文件中使用这个配置：

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### 2. 统一错误处理

为了提供一致的用户体验，我们创建了统一的错误处理工具：

```typescript
// src/utils/queryErrorHandler.ts
import { toast } from "@/components/olt-toast";

/**
 * 统一的查询错误处理函数
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 */
export const handleQueryError = (error: unknown, defaultMessage = "操作失败，请稍后重试") => {
  // 如果是已知的错误类型
  if (error instanceof Error) {
    toast.error(error.message || defaultMessage);
    return;
  }

  // 如果是字符串错误
  if (typeof error === "string") {
    toast.error(error || defaultMessage);
    return;
  }

  // 其他情况使用默认消息
  toast.error(defaultMessage);
};

/**
 * 获取错误消息
 * @param error 错误对象
 * @returns 错误消息字符串
 */
export const getErrorMessage = (error: unknown, defaultMessage = "操作失败，请稍后重试"): string => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === "string") {
    return error || defaultMessage;
  }

  return defaultMessage;
};
```

在实际使用中：

```typescript
// src/pages/example/curd/posts/hooks/mutations.ts
import { handleQueryError } from "@/utils/queryErrorHandler";

export function useCreatePost(options?: UseMutationOptions<IPost, Error, Omit<IPost, "id">, unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    ...options,
    onError: (error, variables, context) => {
      // 使用统一的错误处理
      handleQueryError(error, "创建文章失败");
      
      // 调用用户自定义的 onError
      options?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      // 内部缓存更新逻辑
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
```

### 3. 模块化查询键管理

我们为每个功能模块定义专门的查询键工厂，避免键名冲突并提高可读性：

```typescript
// src/pages/example/curd/posts/hooks/constants.ts
/**
 * Posts API 模块常量定义
 */

// 模块命名空间 - 基于文件路径，避免与其他模块冲突
export const MODULE_NAMESPACE = ["pages", "example", "curd", "posts"];

// 查询键工厂 - 使用命名空间前缀
export const createQueryKeys = () => ({
  all: () => [...MODULE_NAMESPACE],
  lists: () => [...MODULE_NAMESPACE, "list"],
  list: (params: any) => [...MODULE_NAMESPACE, "list", params],
  details: () => [...MODULE_NAMESPACE, "detail"],
  detail: (id: string) => [...MODULE_NAMESPACE, "detail", id],
});

export const queryKeys = createQueryKeys();
```

### 4. 查询 Hooks

我们将所有查询逻辑封装在专门的 Hooks 文件中：

```typescript
// src/pages/example/curd/posts/hooks/queries.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from ".";
import { fetchPost, fetchPosts } from "../api";
import type { PostQueryParams } from "../types";

/**
 * 获取文章列表
 */
export function usePosts(params: PostQueryParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchPosts(params),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

/**
 * 获取文章详情
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}
```

### 5. 变更 Hooks

同样，我们将所有变更逻辑封装在专门的 Hooks 文件中：

```typescript
// src/pages/example/curd/posts/hooks/mutations.ts
import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from ".";
import { batchDeletePosts, createPost, deletePost, togglePostStatus, updatePost } from "../api/index";
import type { IPost } from "../types";

/**
 * 创建文章
 */
export function useCreatePost(options?: UseMutationOptions<IPost, Error, Omit<IPost, "id">, unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    ...options,
    onSuccess: (data, variables, context) => {
      // 内部缓存更新逻辑
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost(options?: UseMutationOptions<IPost, Error, IPost, unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPost) => updatePost(post),
    ...options,
    onSuccess: (updatedPost, variables, context) => {
      // 内部缓存更新逻辑
      queryClient.setQueryData(queryKeys.detail(updatedPost.id), updatedPost);

      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });

      options?.onSuccess?.(updatedPost, variables, context);
    },
  });
}
```

### 6. API 层分离

我们将 API 调用逻辑与 TanStack Query 分离，放在专门的 API 文件中：

```typescript
// src/pages/example/curd/posts/api/index.ts
import fakeClient from "@/api/fakeClient";
import type { IListResult, IPost, PostQueryParams } from "../types";

/**
 * 获取文章列表
 */
export async function fetchPosts(params: PostQueryParams): Promise<IListResult<IPost>> {
  return fakeClient.get<IListResult<IPost>>({
    url: "/curd",
    params,
  });
}

/**
 * 获取文章详情
 */
export async function fetchPost(id: string): Promise<IPost> {
  return fakeClient.get<IPost>({
    url: `/curd/${id}`,
  });
}
```

### 7. 组件中使用

在组件中，我们直接使用这些 Hooks：

```typescript
// src/pages/example/curd/posts/list-page.tsx
import { usePosts } from "./hooks";

const PostList: React.FC = () => {
  const { data, isLoading } = usePosts({ current: 1, pageSize: 10 });
  
  // 渲染逻辑
};
```

这种结构化的管理方式有以下优势：

1. **清晰的职责分离**：API 调用、查询逻辑、组件渲染各司其职
2. **易于维护**：所有与数据相关的逻辑都集中在 hooks 目录下
3. **可重用性**：查询和变更逻辑可以在多个组件中重用
4. **类型安全**：通过 TypeScript 提供完整的类型支持
5. **模块化**：每个功能模块都有自己的查询键命名空间，避免冲突
6. **全局配置**：统一的查询客户端配置确保一致的行为
7. **统一错误处理**：提供一致的用户体验


## 🎯 最佳实践

### 1. 合理设置 staleTime

```typescript
// 对于不经常变化的数据，设置较长的 staleTime
const { data } = useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 1000 * 60 * 60 * 24, // 24小时
});

// 对于经常变化的数据，设置较短的 staleTime 或保持默认
const { data } = useQuery({
  queryKey: ['stock-prices'],
  queryFn: fetchStockPrices,
  staleTime: 1000 * 30, // 30秒
});
```

### 2. 使用查询工厂模式

```typescript
// 集中管理查询配置，避免重复代码
const userQueries = {
  list: (filters) => ({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
  }),
  detail: (id) => ({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
  }),
};
```

### 3. 合理使用缓存更新策略

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (data, variables) => {
    // 更新详情缓存
    queryClient.setQueryData(['user', variables.id], data);
    
    // 使列表失效（而不是直接更新）
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

### 4. 错误处理

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  onError: (error) => {
    // 记录错误
    console.error('获取待办事项失败:', error);
    
    // 显示用户友好的错误消息
    toast.error('加载数据失败，请稍后重试');
  },
});
```

通过合理使用 TanStack Query，我们可以极大地简化数据获取和状态管理的复杂性，提高应用的性能和用户体验。