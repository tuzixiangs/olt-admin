# 快速开始

本指南将帮助您在 5 分钟内快速上手 OLT Admin，了解基本功能和开发流程。

## 🚀 启动项目

假设您已经完成了[安装指南](./installation)，现在让我们启动项目：

```bash
# 启动开发服务器
pnpm dev
```

## 🎯 第一次使用

### 1. 访问应用

在浏览器中打开 `http://localhost:3001`，您将看到登录页面。

### 2. 登录系统

使用默认账号登录：

```
用户名: admin
密码: admin123
```

:::tip 开发模式
在开发模式下，项目可以使用 Mock Service Worker (MSW) 提供模拟数据，无需真实的后端服务。这对于快速开发和测试非常方便。
:::

### 3. 探索界面

登录后，您将进入主界面，包含：

- **侧边导航**: 功能模块导航
- **顶部栏**: 用户信息、主题切换、语言切换
- **主内容区**: 页面内容展示
- **多页签**: 支持多页面同时打开

## 📁 项目结构概览

让我们快速了解项目的核心目录结构：

```
src/
├── pages/           # 页面模块（Feature-Sliced Design）
│   ├── dashboard/   # 仪表盘
│   ├── example/     # 示例模块
│   └── sys/         # 系统模块
├── components/     # 全局组件
├── hooks/          # 全局自定义 Hooks
├── api/            # 全局 API 接口
├── routes/         # 路由配置
└── ui/             # 基础 UI 组件
```

## 🛠️ 开发工作流

### 1. 创建新页面

让我们创建一个简单的用户管理页面：

```bash
# 在 src/pages 下创建新模块
mkdir -p src/pages/user-management
```

创建页面组件：

```tsx title="src/pages/user-management/index.tsx"
import React from 'react';

export default function UserManagement() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">用户管理</h1>
      <p>这是一个新的用户管理页面</p>
    </div>
  );
}
```

### 2. 添加路由

在路由配置中添加新页面：

```tsx title="src/pages/user-management/routes/index.tsx"
const UserManagement = lazy(() => import('@/pages/user-management'));

// 在路由配置中添加
{
  path: 'user-management',
  Components: <UserManagement />,
}
```

## 🎨 使用组件库

项目提供了丰富的组件库，让我们看看如何使用：

### 表格组件

```tsx
import OltTable from '@/components/olt-table';

function UserList() {
  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '状态', dataIndex: 'status' },
  ];

  return (
    <OltTable
      columns={columns}
      request={async () => {
        // 获取数据的异步函数
        return { data: [], total: 0 };
      }}
    />
  );
}
```

### 表单组件

```tsx
import { ProForm, ProFormText } from '@ant-design/pro-components';

function UserForm() {
  return (
    <ProForm
      onFinish={async (values) => {
        console.log('表单数据:', values);
      }}
    >
      <ProFormText
        name="name"
        label="用户名"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        rules={[{ required: true, type: 'email' }]}
      />
    </ProForm>
  );
}
```

## 🎣 使用 Hooks

项目提供了多个实用的自定义 Hooks：

### 复制到剪贴板

```tsx
import { useCopyToClipboard } from '@/hooks';

function CopyExample() {
  const { copyFn } = useCopyToClipboard();

  return (
    <button onClick={() => copyFn('Hello World!')}>
      复制文本
    </button>
  );
}
```

### 响应式查询

```tsx
import { useMediaQuery } from '@/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div>
      当前设备: {isMobile ? '移动端' : '桌面端'}
    </div>
  );
}
```

## 🎯 状态管理

### 全局状态 (Zustand)

```tsx
import { useUserStore } from '@/store/userStore';

function UserProfile() {
  const { user, updateUser } = useUserStore();

  return (
    <div>
      <p>当前用户: {user?.name}</p>
      <button onClick={() => updateUser({ name: '新名称' })}>
        更新用户
      </button>
    </div>
  );
}
```

### 服务端状态 (TanStack Query)

```tsx
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/user';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🎨 样式系统

项目使用 Tailwind CSS 和 Vanilla Extract：

### Tailwind CSS

```tsx
function StyledComponent() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        标题
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        内容文本
      </p>
    </div>
  );
}
```

### Vanilla Extract

```ts title="styles.css.ts"
import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '0.5rem',
});
```

## 🔧 开发工具

### 代码格式化

```bash
# 格式化代码
pnpm lint

# 自动修复
pnpm lint:fix
```

### 类型检查

```bash
# TypeScript 类型检查
pnpm type-check
```

### 构建项目

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📚 下一步

现在您已经了解了基本使用方法，可以继续探索：

1. **[项目结构](./project-structure)** - 深入了解代码组织
2. **[Feature-Sliced Design](../architecture/feature-sliced-design)** - 学习架构模式
3. **[组件库](../components/overview)** - 探索所有可用组件
4. **[Hooks](../hooks/overview)** - 了解自定义 Hooks
5. **[开发指南](../development/code-style)** - 学习最佳实践
