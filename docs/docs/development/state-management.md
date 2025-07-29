# 状态管理

OLT Admin 采用现代化的状态管理方案，结合 Zustand 和 TanStack Query，为应用提供高效、类型安全的状态管理。

## 🎯 状态管理架构

### 技术选型

| 技术 | 用途 | 优势 |
|------|------|------|
| **Zustand** | 客户端状态管理 | 轻量、简单、TypeScript 友好 |
| **TanStack Query** | 服务端状态管理 | 缓存、同步、后台更新 |
| **React Context** | 组件间状态共享 | 原生支持、适合主题等全局状态 |

### 状态分类

```
状态管理
├── 客户端状态 (Zustand)
│   ├── 用户认证状态
│   ├── 应用配置
│   ├── UI 状态
│   └── 临时数据
├── 服务端状态 (TanStack Query)
│   ├── API 数据缓存
│   ├── 数据同步
│   ├── 加载状态
│   └── 错误处理
└── 组件状态 (React State)
    ├── 表单状态
    ├── 本地 UI 状态
    └── 临时交互状态
```

## 📚 状态管理方案对比

我们项目中使用了多种状态管理方案，每种都有其适用场景。详细对比请参考 [状态管理方案对比](./state-management-comparison.md) 文档。

## 🏪 Zustand 状态管理

### 基础用法

```typescript
// src/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[];
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],

      // 操作
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          permissions: user.permissions || [],
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
```

### 持久化存储

通过 `persist` 中间件实现状态的持久化存储：

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
}

interface SettingsActions {
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage', // 存储的键名
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    },
  ),
);
```

## 🌐 TanStack Query (React Query)

TanStack Query 是一个专门用于处理服务端状态的强大库，提供了缓存、同步、后台更新和数据失效等高级功能。由于其功能复杂且重要，我们为其提供了专门的文档，请参考 [TanStack Query 详解](./tanstack-query.md) 文档了解更多信息。

## 🧠 最佳实践

### 1. 合理划分状态类型

```typescript
// ❌ 不好的做法 - 混合不同类型的状态
const useMixedStore = create((set) => ({
  // 本地 UI 状态
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  
  // 全局应用状态
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  
  // 服务端状态（不应该放在 Zustand 中）
  users: [],
  fetchUsers: async () => {
    const users = await api.getUsers();
    set({ users });
  },
}));

// ✅ 好的做法 - 分离不同类型的状态
// 本地 UI 状态使用 useState
const [isOpen, setIsOpen] = useState(false);

// 全局应用状态使用 Zustand
const theme = useSettingsStore((state) => state.theme);

// 服务端状态使用 TanStack Query
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.getUsers(),
});
```

### 2. 正确使用持久化

```typescript
// 只持久化需要跨会话保存的数据
const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      // 不应该持久化的状态（如加载状态）
      // loading: false,
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        // 只持久化特定字段
        theme: state.theme,
        language: state.language,
      }),
    },
  ),
);
```

### 3. 优化性能

```typescript
// ❌ 性能较差 - 每次都返回新对象
const useUserStore = create((set, get) => ({
  users: [],
  getActiveUsers: () => {
    // 每次都返回新数组，导致不必要的重新渲染
    return get().users.filter(user => user.active);
  },
}));

// ✅ 性能更好 - 使用选择器和 useMemo
const useActiveUsers = () => {
  return useUserStore(
    useMemo(
      () => (state) => state.users.filter(user => user.active),
      []
    )
  );
};
```

## 🛠️ 调试工具

### React Developer Tools

使用 React Developer Tools 可以查看组件的状态和属性。

### Zustand Devtools

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<StoreState & StoreActions>()(
  devtools(
    (set) => ({
      // 状态和操作
    }),
    {
      name: 'store-name',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
```

## 🧪 测试

### 测试 Zustand Store

```typescript
// store.test.ts
import { useUserStore } from './userStore';

// 重置 store 状态
beforeEach(() => {
  useUserStore.getState().actions.clearUserInfoAndToken();
});

test('should set user info', () => {
  const userInfo = { id: 1, name: 'John' };
  useUserStore.getState().actions.setUserInfo(userInfo);
  
  expect(useUserStore.getState().userInfo).toEqual(userInfo);
});
```

通过合理使用这些状态管理方案，可以构建出高性能、易维护的应用程序。有关各种状态管理方案的详细对比，请查看 [状态管理方案对比](./state-management-comparison.md) 文档。有关 TanStack Query 的详细使用方法，请查看 [TanStack Query 详解](./tanstack-query.md) 文档。
