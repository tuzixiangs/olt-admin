# 状态缓存方案对比

本页面展示了在 React 应用中实现状态缓存的不同方案，包括原生 React hooks、ahooks 和 zustand 的实现方式。

## 🎯 方案对比

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **React Hooks** | 原生支持，无额外依赖 | 需要手动处理序列化、错误处理 | 简单的本地状态缓存 |
| **ahooks** | 开箱即用，API 简洁，错误处理完善 | 增加依赖大小 | 中小型项目的状态缓存 |
| **zustand** | 全局状态管理，支持复杂状态逻辑 | 学习成本稍高 | 大型项目的全局状态缓存 |

## 📚 实现方案

### 1. React Hooks 方案

使用原生 `useState` + `useEffect` + `localStorage`：

```typescript
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  return [value, setStoredValue] as const;
}
```

### 2. ahooks 方案

使用 `useLocalStorageState` 和 `useSessionStorageState`：

```typescript
import { useLocalStorageState, useSessionStorageState } from 'ahooks';

// localStorage 持久化
const [value, setValue] = useLocalStorageState('key', {
  defaultValue: 'default'
});

// sessionStorage 会话级缓存
const [sessionValue, setSessionValue] = useSessionStorageState('sessionKey', {
  defaultValue: 'default'
});
```

### 3. zustand 方案

使用 zustand 的 persist 中间件：

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CacheStore {
  data: any;
  setData: (data: any) => void;
  clearData: () => void;
}

const useCacheStore = create<CacheStore>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: 'cache-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## 🚀 功能特性

### React Hooks
- ✅ 原生支持，无额外依赖
- ✅ 完全可控的实现
- ❌ 需要手动处理边界情况

### ahooks
- ✅ 开箱即用的 API
- ✅ 完善的错误处理
- ✅ 支持 SSR
- ✅ TypeScript 友好

### zustand
- ✅ 全局状态管理
- ✅ 中间件生态丰富
- ✅ 支持复杂状态逻辑
- ✅ 优秀的性能表现

## 📖 使用建议

1. **简单场景**：使用 ahooks 的 `useLocalStorageState`
2. **复杂全局状态**：使用 zustand + persist 中间件
3. **自定义需求**：基于原生 React hooks 实现
4. **会话级缓存**：使用 ahooks 的 `useSessionStorageState`

## 🔗 相关链接

- [ahooks 官方文档](https://ahooks.js.org/)
- [zustand 官方文档](https://zustand-demo.pmnd.rs/)
- [React Hooks 官方文档](https://react.dev/reference/react)