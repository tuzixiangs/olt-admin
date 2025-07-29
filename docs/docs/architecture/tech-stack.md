# 技术栈

OLT Admin 采用现代化的前端技术栈，确保高性能、可维护性和开发体验。

## 🎯 技术选型原则

- **现代化**: 使用最新稳定版本的技术
- **类型安全**: 全面采用 TypeScript
- **性能优先**: 选择高性能的库和工具
- **开发体验**: 优化开发工具链和工作流
- **生态丰富**: 选择社区活跃的技术

## 🏗️ 核心技术栈

### 前端框架

#### React 19

- **版本**: 19.x
- **特性**: 并发渲染、自动批处理、Suspense
- **选择理由**:
  - 成熟稳定的生态系统
  - 优秀的性能和开发体验
  - 强大的社区支持

```tsx
// 使用 React 19 的并发特性
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

#### TypeScript 5.x

- **版本**: 5.x
- **特性**: 严格类型检查、装饰器、模板字符串类型
- **配置**: 严格模式，确保类型安全

```typescript
// 严格的类型定义
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// 泛型约束
function createApiClient<T extends Record<string, any>>(
  config: ApiConfig<T>
): ApiClient<T> {
  // ...
}
```

### 构建工具

#### Vite 6.x

- **版本**: 6.x
- **特性**: 极速热更新、ES 模块、插件生态
- **优势**:
  - 开发服务器启动速度快
  - 热模块替换 (HMR) 性能优异
  - 生产构建优化

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
  },
});
```

### 路由管理

#### React Router 7.x

- **版本**: 7.0.2
- **特性**: 现代化路由、代码分割、嵌套路由、类型安全
- **优势**:
  - 基于文件系统的路由配置
  - 强大的路由守卫和中间件
  - 优秀的开发体验

```typescript
// 路由配置示例
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

```typescript
// 路由 Hook 使用
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
  };
};
```

### 状态管理

#### Zustand

- **版本**: 4.x
- **特性**: 轻量级、TypeScript 友好、中间件支持
- **使用场景**: 全局状态管理

```typescript
// 简洁的状态定义
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

#### TanStack Query

- **版本**: 5.x
- **特性**: 服务器状态管理、缓存、同步
- **使用场景**: API 数据管理

```typescript
// 强大的数据获取和缓存
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
}
```

### 样式方案

#### Tailwind CSS

- **版本**: 4.x
- **特性**: 原子化 CSS、响应式设计、暗色模式
- **优势**:
  - 快速开发
  - 一致的设计系统
  - 优秀的性能

```tsx
// 原子化 CSS 类
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    用户管理
  </h2>
  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
    添加用户
  </Button>
</div>
```

#### Vanilla Extract

- **版本**: 1.x
- **特性**: 零运行时 CSS-in-JS、类型安全
- **使用场景**: 复杂样式逻辑

```typescript
// 类型安全的样式定义
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
});
```

### UI 组件库

#### Radix UI

- **版本**: 最新版
- **特性**: 无样式组件、可访问性、可定制
- **组件**: Dialog、Dropdown、Tooltip 等

```tsx
// 可访问的对话框组件
import * as Dialog from '@radix-ui/react-dialog';

function UserDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>编辑用户</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <UserForm />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

#### React Hook Form

- **版本**: 7.x
- **特性**: 高性能表单、验证、TypeScript 支持
- **优势**: 最小重渲染、易于使用

```typescript
// 高性能表单处理
function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: User) => {
    // 处理表单提交
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: '姓名是必填项' })}
        placeholder="姓名"
      />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

### 数据验证

#### Zod

- **版本**: 3.x
- **特性**: TypeScript 优先、运行时验证、类型推断
- **使用场景**: API 数据验证、表单验证

```typescript
// 强类型的数据验证
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('邮箱格式不正确'),
  age: z.number().min(18, '年龄必须大于18岁'),
});

type User = z.infer<typeof userSchema>;

// 运行时验证
function validateUser(data: unknown): User {
  return userSchema.parse(data);
}
```

### HTTP 客户端

#### Axios

- **版本**: 1.7.7
- **特性**: 成熟的 HTTP 客户端、拦截器、TypeScript 支持
- **优势**:
  - 丰富的生态系统
  - 强大的拦截器功能
  - 完善的错误处理

```typescript
// HTTP 客户端配置
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "@/components/olt-toast";
import { GLOBAL_CONFIG } from "@/global-config";

/**
 * 创建一个带有预设默认值和拦截器的 Axios 实例
 */
export function createApiClient(customConfig?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: GLOBAL_CONFIG.API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...customConfig,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // 处理认证失败
        handleAuthError();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// API 客户端类
export class APIClient {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  // 类型安全的 API 调用
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
}
```

## 🛠️ 开发工具

### 代码质量

#### Biome

- **版本**: 1.9.4
- **特性**: 一体化工具链、快速格式化、代码检查
- **优势**:
  - 极快的性能（比 ESLint + Prettier 快 10-100 倍）
  - 零配置开箱即用
  - 统一的工具链（格式化 + 检查 + 导入排序）

```json
// biome.json 配置
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["public", ".vscode", "src/ui"]
  },
  "formatter": {
    "enabled": true,
    "lineWidth": 120,
    "indentStyle": "tab"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off"
      },
      "a11y": {
        "useKeyWithClickEvents": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

#### 开发脚本

```json
// package.json scripts
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check . --write",
    "format": "biome format --write .",
    "type-check": "tsc --noEmit"
  }
}
```

### 包管理

#### pnpm

- **版本**: 10.x
- **特性**: 快速、节省磁盘空间、严格的依赖管理
- **优势**:
  - 安装速度快
  - 磁盘空间利用率高
  - 避免幽灵依赖

```json
// package.json
{
  "packageManager": "pnpm@10.13.1",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## 📊 性能优化

### 代码分割

```tsx
// 路由级别的代码分割
import { lazy } from 'react';

const UserManagement = lazy(() => import('./pages/user-management'));
const ProductManagement = lazy(() => import('./pages/product-management'));
```

### 缓存策略

#### TanStack Query + 自定义缓存存储

项目采用多层缓存策略，结合 TanStack Query 的服务器状态缓存和自定义的参数缓存存储。

##### TanStack Query 配置

```typescript
// 智能缓存配置
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      gcTime: 10 * 60 * 1000, // 10 分钟 (原 cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
```

##### 页面状态管理

```typescript
// src/hooks/use-page-state.ts - 页面状态管理
import { usePageState } from '@/hooks/use-page-state';

interface PageStateConfig {
  autoSave: boolean; // 是否自动保存
  saveOnUnmount: boolean; // 组件卸载时保存
}

// 页面状态管理 Hook
export function usePageState<T>(
  defaultValue?: T,
  options?: {
    key?: string;
    autoSave?: boolean;
    saveOnUnmount?: boolean;
  }
): [T, (value: T) => void, () => void];
```

##### 页面状态管理使用示例

```typescript
// 在组件中使用页面状态管理
import { usePageState } from '@/hooks/use-page-state';

function UserListPage() {
  // 使用页面状态管理保存表格参数
  const [tableParams, setTableParams] = usePageState({
    current: 1,
    pageSize: 10,
    searchQuery: '',
    filters: {}
  }, { key: 'user-list-params' });
  
  // 使用 ProTable Hook（已集成页面状态管理）
  const { tableProps, search, refresh } = useProTable(
    getUserList,
    {
      queryKey: ['users'],
      useCache: true, // 启用缓存
      defaultParams: [tableParams]
    }
  );
  
  return (
    <ProTable
      {...tableProps}
      search={{
        labelWidth: 'auto',
        onSubmit: search.submit,
        onReset: search.reset,
      }}
      toolBarRender={() => [
        <Button key="refresh" onClick={refresh}>
          刷新
        </Button>
      ]}
    />
  );
}
```

##### 缓存策略特点

- **多层缓存**: 服务器状态缓存 + 参数状态缓存
- **智能过期**: 基于时间和访问频率的过期策略
- **自动清理**: LRU 算法和定时清理机制
- **类型安全**: 完整的 TypeScript 类型支持
- **调试友好**: 开发环境下的缓存状态监控

## 🔧 开发环境

### 环境要求

- **Node.js**: 20.x 或更高版本
- **pnpm**: 8.x 或更高版本
- **TypeScript**: 5.x

### 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

### 构建配置

```typescript
// 生产构建优化
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

## 📈 技术栈优势

### 开发效率

- **类型安全**: TypeScript 提供编译时错误检查
- **热更新**: Vite 提供极速的开发体验
- **自动化**: ESLint 和 Prettier 自动化代码质量

### 性能表现

- **运行时性能**: React 18 并发特性
- **构建性能**: Vite 快速构建
- **包大小**: 按需加载和 Tree Shaking

### 可维护性

- **模块化**: 清晰的架构和依赖关系
- **测试友好**: 组件化设计便于单元测试
- **文档完善**: 每个技术都有详细文档

## 🔄 技术演进

### 升级策略

1. **定期更新**: 每月检查依赖更新
2. **渐进升级**: 优先升级补丁版本
3. **测试验证**: 升级后进行全面测试
4. **回滚准备**: 保持回滚能力

---

这个技术栈经过精心选择和优化，确保了项目的高质量、高性能和良好的开发体验。随着技术的发展，我们会持续评估和更新技术选型。
