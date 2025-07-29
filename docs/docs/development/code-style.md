# 代码风格指南

本指南定义了 OLT Admin 项目的代码风格规范，确保代码的一致性、可读性和可维护性。

## 🎯 核心原则

### 1. 一致性优于个人偏好

团队统一的代码风格比个人喜好更重要。

### 2. 可读性优于简洁性

代码应该易于理解，即使这意味着写更多的代码。

### 3. 明确性优于隐式性

代码的意图应该明确表达，避免隐式行为。

### 4. 安全性优于便利性

优先考虑类型安全和运行时安全。

## 📝 命名规范

### 文件命名

#### 组件文件

```
✅ 推荐
UserProfile.tsx
ProductCard.tsx
NavigationMenu.tsx

❌ 避免
userProfile.tsx
product-card.tsx
navigation_menu.tsx
```

#### 工具文件

```
✅ 推荐
format-date.ts
validate-email.ts
api-client.ts

❌ 避免
formatDate.ts
ValidateEmail.ts
apiClient.ts
```

#### 页面文件

```
✅ 推荐
posts/
├── api.ts          # API 接口定义
├── components/     # 组件目录
│   ├── PostDetail.tsx # 详情组件（用于模态框）
│   ├── PostEdit.tsx   # 编辑组件（用于模态框）
├── detail-page.tsx # 详情页面（基于路由）
├── edit-page.tsx   # 编辑页面（基于路由）
├── list-page.tsx   # 列表页面（基于路由）
├── types.ts        # 类型定义

❌ 避免
UserManagement.tsx
userList.tsx
user_detail.tsx
```

### 变量命名

#### 常量

```typescript
✅ 推荐
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;

❌ 避免
const apiBaseUrl = 'https://api.example.com';
const maxRetryCount = 3;
const default_page_size = 20;
```

#### 变量和函数

```typescript
✅ 推荐
const userName = 'john';
const isLoading = false;
const getUserById = (id: string) => { /* ... */ };
const handleSubmit = () => { /* ... */ };

❌ 避免
const user_name = 'john';
const IsLoading = false;
const GetUserById = (id: string) => { /* ... */ };
const HandleSubmit = () => { /* ... */ };
```

#### 类型和接口

```typescript
✅ 推荐
interface User {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'user' | 'guest';

class ApiClient {
  // ...
}

❌ 避免
interface user {
  id: string;
  name: string;
}

type userRole = 'admin' | 'user' | 'guest';

class apiClient {
  // ...
}
```

### 组件命名

```tsx
✅ 推荐
// 组件名使用 PascalCase
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// 自定义 Hook 以 use 开头
function useUserData(userId: string) {
  return useQuery(['user', userId], () => fetchUser(userId));
}

❌ 避免
function userProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

function getUserData(userId: string) {
  return useQuery(['user', userId], () => fetchUser(userId));
}
```

## 🏗️ TypeScript 规范

### 类型定义

#### 接口 vs 类型别名

```typescript
✅ 推荐 - 对象结构使用接口
interface User {
  id: string;
  name: string;
  email: string;
}

✅ 推荐 - 联合类型使用类型别名
type Status = 'pending' | 'success' | 'error';
type EventHandler = (event: Event) => void;

❌ 避免
type User = {
  id: string;
  name: string;
  email: string;
};

interface Status = 'pending' | 'success' | 'error';
```

#### 泛型约束

```typescript
✅ 推荐
interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

function createApiClient<T extends Record<string, any>>(
  config: ApiConfig<T>
): ApiClient<T> {
  // ...
}

❌ 避免
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

function createApiClient<T>(config: any): any {
  // ...
}
```

#### 严格类型检查

```typescript
✅ 推荐
// 启用严格模式
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// 明确的类型注解
function processUser(user: User): ProcessedUser {
  return {
    id: user.id,
    displayName: user.name.toUpperCase(),
  };
}

❌ 避免
// 隐式 any 类型
function processUser(user: any): any {
  return {
    id: user.id,
    displayName: user.name.toUpperCase(),
  };
}
```

### 空值处理

```typescript
✅ 推荐
// 使用可选链和空值合并
const userName = user?.profile?.name ?? 'Unknown';

// 明确的空值检查
if (user && user.email) {
  sendEmail(user.email);
}

// 类型守卫
function isValidUser(user: unknown): user is User {
  return typeof user === 'object' && 
         user !== null && 
         'id' in user && 
         'name' in user;
}

❌ 避免
// 不安全的属性访问
const userName = user.profile.name || 'Unknown';

// 隐式类型转换
if (user.email) {
  sendEmail(user.email);
}
```

## ⚛️ React 规范

### 组件结构

```tsx
✅ 推荐
// 1. 导入语句
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import type { User } from '@/types/user';

// 2. 类型定义
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. 组件定义
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 4. 状态和副作用
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading } = useUserData(userId);

  // 5. 事件处理函数
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser: User) => {
    setIsEditing(false);
    onUpdate?.(updatedUser);
  };

  // 6. 早期返回
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // 7. 主要渲染逻辑
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Button onClick={handleEdit}>
        Edit Profile
      </Button>
    </div>
  );
}
```

### Hooks 使用

```tsx
✅ 推荐
// 自定义 Hook
function useUserForm(initialUser?: User) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUser = useCallback((userData: Partial<User>) => {
    const newErrors: Record<string, string> = {};
    
    if (!userData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!userData.email?.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  return {
    user,
    setUser,
    errors,
    validateUser,
  };
}

❌ 避免
// 在组件中直接处理复杂逻辑
function UserForm() {
  const [user, setUser] = useState(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // 复杂的验证逻辑直接在组件中...
}
```

### 条件渲染

```tsx
✅ 推荐
// 使用早期返回
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

// 简单条件渲染
{user && <UserProfile user={user} />}

// 复杂条件渲染使用函数
function renderUserStatus(status: UserStatus) {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'inactive':
      return <Badge variant="warning">Inactive</Badge>;
    case 'banned':
      return <Badge variant="danger">Banned</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

❌ 避免
// 嵌套的三元运算符
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} />
) : data ? (
  <UserProfile user={data} />
) : (
  <EmptyState />
)}
```

## 🎨 样式规范

### Tailwind CSS

```tsx
✅ 推荐
// 使用语义化的类名组合
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    User Management
  </h2>
  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
    Add User
  </Button>
</div>

// 提取复杂的类名组合
const cardStyles = "p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";

<div className={cardStyles}>
  {/* 内容 */}
</div>

❌ 避免
// 过长的类名字符串
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
```

### CSS Modules / Vanilla Extract

```typescript
✅ 推荐
// styles.css.ts (Vanilla Extract)
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
  
  selectors: {
    '&[data-variant="primary"]': {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    '&[data-variant="secondary"]': {
      backgroundColor: '#6b7280',
      color: 'white',
    },
  },
});

❌ 避免
// 内联样式
<button 
  style={{
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
  }}
>
  Click me
</button>
```

## 📁 文件组织

### 导入顺序

```typescript
✅ 推荐
// 1. React 相关
import React from 'react';
import { useState, useEffect } from 'react';

// 2. 第三方库
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 内部模块 (按层级排序)
import { Button } from '@/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { userApi } from '@/api/user';

// 4. 相对导入
import { UserForm } from './UserForm';
import { validateUser } from '../utils/validation';

// 5. 类型导入 (分组在最后)
import type { User } from '@/types/user';
import type { ComponentProps } from 'react';

❌ 避免
// 混乱的导入顺序
import type { User } from '@/types/user';
import { Button } from '@/ui/button';
import React from 'react';
import { UserForm } from './UserForm';
import { useQuery } from '@tanstack/react-query';
```

## 🔧 工具配置

### biome 配置

```json
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

## 📋 代码审查清单

### 提交前检查

- [ ] 代码通过 biome 检查
- [ ] 代码通过 TypeScript 类型检查
- [ ] 代码格式符合 biome 规范
- [ ] 所有测试通过
- [ ] 组件有适当的 TypeScript 类型
- [ ] 复杂逻辑有注释说明

### 代码审查要点

- [ ] 命名是否清晰明确
- [ ] 组件职责是否单一
- [ ] 是否有适当的错误处理
- [ ] 性能是否有优化空间
- [ ] 是否遵循项目架构规范
- [ ] 是否有安全隐患

## 🚀 最佳实践

### 性能优化

```tsx
✅ 推荐
// 使用 React.memo 优化组件
const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// 使用 useCallback 优化事件处理
function UserList({ users }: { users: User[] }) {
  const handleUserClick = useCallback((userId: string) => {
    // 处理用户点击
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={() => handleUserClick(user.id)}
        />
      ))}
    </div>
  );
}

❌ 避免
// 在渲染中创建新对象
function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          style={{ marginBottom: '8px' }} // 每次渲染都创建新对象
          onClick={() => {}} // 每次渲染都创建新函数
        />
      ))}
    </div>
  );
}
```

## 🛠️ 开发工具

### Biome 代码格式化和检查

项目使用 [Biome](https://biomejs.dev/) 作为代码格式化和 lint 工具，替代传统的 ESLint + Prettier 组合。

#### 配置文件

配置文件位于 <mcfile name="biome.json" path="biome.json"></mcfile>：

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
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
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "attributePosition": "auto"
    }
  }
}
```

#### 主要配置说明

| 配置项 | 值 | 说明 |
|--------|----|----- |
| `lineWidth` | `100` | 每行最大字符数 |
| `indentStyle` | `space` | 使用空格缩进 |
| `indentWidth` | `2` | 缩进宽度为 2 个空格 |
| `quoteStyle` | `single` | JavaScript 使用单引号 |
| `jsxQuoteStyle` | `double` | JSX 属性使用双引号 |
| `trailingCommas` | `all` | 所有地方都添加尾随逗号 |
| `semicolons` | `always` | 总是添加分号 |

#### 常用命令

```bash
# 检查代码格式和 lint 问题
pnpm lint

# 自动修复格式问题
pnpm format

# 只检查格式
pnpm biome format --check .

# 只检查 lint
pnpm biome lint .

# 同时格式化和 lint
pnpm biome check --write .
```

#### 禁用的规则

项目中禁用了以下规则：

- `noExplicitAny`: 允许使用 `any` 类型（在必要时）
- `useKeyWithClickEvents`: 允许在点击事件中不强制要求键盘事件

### Lefthook Git 钩子管理

项目使用 [Lefthook](https://github.com/evilmartians/lefthook) 管理 Git 钩子，确保代码质量。

#### 配置文件

配置文件位于 <mcfile name="lefthook.yml" path="lefthook.yml"></mcfile>：

```yaml
pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: pnpm biome format --write {staged_files}
      stage_fixed: true
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm biome lint --write {staged_files}
      stage_fixed: true
    type-check:
      glob: "*.{ts,tsx}"
      run: pnpm type-check

commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}
```

#### 钩子说明

##### pre-commit 钩子

在提交前自动执行以下检查：

1. **format**: 格式化暂存的文件
   - 作用范围：`*.{js,ts,jsx,tsx,json,md}`
   - 自动修复并重新暂存

2. **lint**: 检查和修复 lint 问题
   - 作用范围：`*.{js,ts,jsx,tsx}`
   - 自动修复并重新暂存

3. **type-check**: TypeScript 类型检查
   - 作用范围：`*.{ts,tsx}`
   - 只检查，不自动修复

##### commit-msg 钩子

检查提交信息格式：

- 使用 `commitlint` 验证提交信息
- 确保符合约定式提交规范

#### 安装和使用

```bash
# 安装 lefthook（项目已配置）
pnpm lefthook install

# 手动运行 pre-commit 钩子
pnpm lefthook run pre-commit

# 跳过钩子提交（不推荐）
git commit --no-verify -m "commit message"

# 查看钩子状态
pnpm lefthook version
```

#### 最佳实践

1. **不要跳过钩子**：钩子是为了保证代码质量，除非特殊情况，不要使用 `--no-verify`

2. **提交前检查**：虽然有钩子，但建议提交前手动运行检查：
   ```bash
   pnpm lint
   pnpm type-check
   ```

3. **分阶段提交**：如果文件很多，可以分批暂存和提交：
   ```bash
   git add src/components/
   git commit -m "feat: add new components"
   ```

### VS Code 集成

#### 推荐扩展

安装以下 VS Code 扩展以获得最佳开发体验：

```json
{
  "recommendations": [
    "biomejs.biome",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### 工作区设置

在 `.vscode/settings.json` 中配置：

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## 📚 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React TypeScript 最佳实践](https://react-typescript-cheatsheet.netlify.app/)
- [Biome 官方文档](https://biomejs.dev/)
- [Lefthook 官方文档](https://github.com/evilmartians/lefthook)
- [约定式提交规范](https://www.conventionalcommits.org/zh-hans/)

---

遵循这些代码风格规范，可以确保项目代码的一致性和可维护性。团队成员应该定期回顾和更新这些规范，以适应项目的发展需要。
