# Auth 认证组件

认证组件库提供了一套完整的权限和角色检查机制，用于控制 React 应用中组件的访问权限。

## 目录结构

```
auth/
├── auth-guard.tsx     # 权限保护组件
├── use-auth.ts        # 权限检查钩子
└── index.ts           # 导出文件
```

## 组件和钩子

### AuthGuard 权限保护组件

`AuthGuard` 是一个高阶组件，用于根据用户的权限或角色来条件性地渲染子组件。

#### Props 参数

- `children`: ReactNode - 用户具有所需权限/角色时渲染的内容
- `fallback`: ReactNode - 用户不具有所需权限/角色时渲染的后备内容（默认：null）
- `check`: string - 需要检查的单个权限/角色
- `checkAny`: string[] - 需要检查的多个权限/角色（满足其中一个即可）
- `checkAll`: string[] - 需要检查的多个权限/角色（需要全部满足）
- `baseOn`: "role" | "permission" - 检查类型：角色或权限（默认：permission）

#### 使用示例

##### 检查单个权限
```tsx
import { AuthGuard } from '@/components/auth';

// 检查单个权限
<AuthGuard check="user.create">
  <button>创建用户</button>
</AuthGuard>
```

##### 检查多个权限（满足其中一个）
```tsx
// 检查多个权限（满足其中一个即可）
<AuthGuard checkAny={["user.create", "user.edit"]}>
  <button>编辑用户</button>
</AuthGuard>
```

##### 检查多个权限（需要全部满足）
```tsx
// 检查多个权限（需要全部满足）
<AuthGuard checkAll={["user.create", "user.edit"]}>
  <button>高级编辑</button>
</AuthGuard>
```

##### 使用后备内容
```tsx
// 使用后备内容
<AuthGuard check="admin" baseOn="role" fallback={<div>访问被拒绝</div>}>
  <AdminPanel />
</AuthGuard>
```

### useAuthCheck 权限检查钩子

`useAuthCheck` 是一个自定义 React 钩子，提供程序化的方式检查用户权限或角色。

#### 参数

- `baseOn`: "role" | "permission" - 检查类型：角色或权限（默认：permission）

#### 返回值

钩子返回一个包含以下方法的对象：

- `check(item: string): boolean` - 检查单个权限/角色
- `checkAny(items: string[]): boolean` - 检查多个权限/角色（满足其中一个即可）
- `checkAll(items: string[]): boolean` - 检查多个权限/角色（需要全部满足）

#### 使用示例

##### 权限检查
```tsx
import { useAuthCheck } from '@/components/auth';

// 权限检查
const { check, checkAny, checkAll } = useAuthCheck('permission');

// 检查单个权限
const canCreate = check('user.create');

// 检查多个权限（满足其中一个）
const canEdit = checkAny(['user.create', 'user.edit']);

// 检查多个权限（需要全部满足）
const isAdminUser = checkAll(['user.create', 'user.edit']);
```

##### 角色检查
```tsx
// 角色检查
const { check, checkAny, checkAll } = useAuthCheck('role');

// 检查单个角色
const isAdmin = check('admin');

// 检查多个角色（满足其中一个）
const isPrivileged = checkAny(['admin', 'editor']);

// 检查多个角色（需要全部满足）
const isSuperUser = checkAll(['admin', 'editor']);
```

#### 在组件中使用钩子进行条件渲染

```tsx
import { useAuthCheck } from '@/components/auth';

export default function UserProfile() {
  const { check } = useAuthCheck('permission');
  
  const canEditProfile = check('profile.edit');
  const canDeleteAccount = check('account.delete');
  
  return (
    <div>
      <h1>用户资料</h1>
      {canEditProfile && <button>编辑资料</button>}
      {canDeleteAccount && <button>删除账户</button>}
    </div>
  );
}
```

#### 在路由守卫中使用

```tsx
import { useAuthCheck } from '@/components/auth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { check } = useAuthCheck('permission');
  
  if (!check('access.dashboard')) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

## 工作原理

1. **权限存储**：权限和角色信息存储在用户状态管理中（userStore）
2. **访问检查**：组件或钩子根据传入的参数检查用户是否具有相应的权限或角色
3. **条件渲染**：根据检查结果决定是否渲染受保护的内容或显示后备内容
4. **无权限处理**：未登录用户或无权限用户将无法访问受保护的内容

## 最佳实践

1. **合理使用检查类型**：
   - 使用 `check` 检查单个权限/角色
   - 使用 `checkAny` 实现"或"逻辑
   - 使用 `checkAll` 实现"与"逻辑

2. **提供友好的后备内容**：
   ```tsx
   <AuthGuard 
     check="admin" 
     baseOn="role" 
     fallback={<div className="text-red-500">需要管理员权限才能访问此功能</div>}
   >
     <AdminPanel />
   </AuthGuard>
   ```

3. **组合使用**：
   ```tsx
   <AuthGuard check="user.view">
     <AuthGuard checkAny={["user.create", "user.edit"]} baseOn="permission">
       <UserManagement />
     </AuthGuard>
   </AuthGuard>
   ```

4. **在自定义钩子中封装业务逻辑**：
   ```tsx
   // hooks/use-user-permissions.ts
   import { useAuthCheck } from '@/components/auth';
   
   export const useUserPermissions = () => {
     const { check } = useAuthCheck('permission');
     
     return {
       canViewUsers: check('user.view'),
       canCreateUsers: check('user.create'),
       canEditUsers: check('user.edit'),
       canDeleteUsers: check('user.delete'),
     };
   };
   ```