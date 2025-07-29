# Store 状态管理

OLT Admin 使用 Zustand 作为主要的状态管理库，提供了三种不同用途的 Store 实现。

## 📦 Store 概览

项目中包含了三种不同的 Store 实现：

1. **userStore.ts** - 用户状态管理
2. **settingStore.ts** - 应用设置状态管理
3. **lruStore.ts** - LRU 缓存状态管理

## 👤 userStore - 用户状态管理

管理用户认证相关状态，包括用户信息和访问令牌。

主要功能：
- 存储用户信息和认证令牌
- 提供登录/登出操作
- 持久化存储用户状态到 localStorage

```typescript
// 使用示例
const userInfo = useUserInfo();
const userToken = useUserToken();
const signIn = useSignIn();
```

## ⚙️ settingStore - 应用设置管理

管理应用的全局设置，如主题、布局、字体等配置。

主要功能：
- 主题颜色、模式和布局设置
- 字体和排版配置
- 界面功能开关（面包屑、多标签等）
- 持久化存储设置到 localStorage

```typescript
// 使用示例
const settings = useSettings();
const { setSettings } = useSettingActions();
```

## 🗃️ lruStore - LRU 缓存管理

实现了一个基于 LRU (Least Recently Used) 算法的缓存存储，用于管理临时数据。

主要功能：
- LRU 缓存算法实现
- 支持设置缓存容量
- 提供类似 useState 的 React Hook 使用方式
- 支持缓存的增删改查操作

```typescript
// 使用示例
const [value, setValue, removeValue] = useLRUStore('key', 'defaultValue');
const { get, set, remove } = useLRUStoreActions();
```

## 🧩 使用方式

所有 Store 都遵循 Zustand 的最佳实践，提供了 Hooks 方便在组件中使用，并支持持久化存储。