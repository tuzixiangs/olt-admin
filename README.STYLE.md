# 代码风格指南规范

本文档定义了项目中的代码风格规范，包括文件夹命名、文件命名以及其他相关规范，以确保代码的一致性和可维护性。

## 1. 文件夹命名规范

### 1.1 基本原则

- 使用小写字母
- 多个单词之间使用连字符（kebab-case）分隔
- 使用具有描述性的名称
- 避免使用特殊字符和空格

### 1.2 示例

```
// ✅ 推荐
components/
pages/
utils/
api-services/
user-profile/

// ❌ 不推荐
Components/
Pages/
UTILS/
apiServices/
user_profile/
```

### 1.3 特殊文件夹

- `_` 前缀：用于特殊用途的文件夹，如 `_[mock](/src/_mock/)`（模拟数据）
- `.` 前缀：用于隐藏文件夹，如 [.git/](/.git/), [.vscode/](/.vscode/)

## 2. 文件命名规范

### 2.1 TypeScript/JavaScript 文件

- 使用小写字母
- 多个单词之间使用连字符（kebab-case）分隔
- 组件文件使用 PascalCase 命名并以 `.tsx` 结尾

```
// ✅ 推荐
user-service.ts
api-client.ts
user-profile.tsx
navigation-menu.tsx

// ❌ 不推荐
userService.ts
ApiClient.ts
user_profile.tsx
navigationMenu.tsx
```

### 2.2 组件文件命名

- React 组件文件使用 PascalCase 命名
- 组件文件以 `.tsx` 结尾
- 组件名称应与文件名一致

```typescript
// 文件名: UserCard.tsx
export default function UserCard() {
  // 组件实现
}

// 文件名: navigation-menu.tsx (非组件文件)
export const navigationMenu = () => {
  // 实现
};
```

### 2.3 配置和声明文件

- 配置文件使用全小写，多个单词用连字符分隔
- 声明文件以 `.d.ts` 结尾

```
// ✅ 推荐
vite.config.ts
tailwind.config.ts
global.d.ts
types.d.ts

// ❌ 不推荐
ViteConfig.ts
tailwind-config.ts
global.d.tsx
```

## 3. 导出和索引文件

### 3.1 index 文件

- 每个文件夹可以包含一个 `index.ts` 文件用于统一导出
- `index.ts` 文件应只包含导出语句，不包含实际逻辑

```typescript
// components/button/index.ts
export { default as Button } from './button';
export { default as IconButton } from './icon-button';
export type { ButtonProps } from './button';
```

### 3.2 命名导出 vs 默认导出

- 组件使用默认导出
- 工具函数、常量等使用命名导出
- 类型定义使用命名导出

```typescript
// ✅ 推荐
// button.tsx
export default function Button() { /* ... */ }

// utils.ts
export const formatDate = () => { /* ... */ };
export const validateEmail = () => { /* ... */ };

// types.ts
export interface User { /* ... */ }
export type Status = 'active' | 'inactive';
```

## 4. 代码组织和结构

### 4.1 组件组织

- 每个组件应有独立的文件夹（复杂组件）
- 相关的组件、样式、测试文件放在同一文件夹下
- 简单组件可以直接放在父级目录中

```
// 复杂组件
components/
  data-table/
    data-table.tsx
    data-table.styles.ts
    data-table.types.ts
    data-table.test.ts
    index.ts

// 简单组件
components/
  button.tsx
  icon.tsx
```

### 4.2 页面组织

- 页面组件放在 [/src/pages/](/src/pages/) 目录下
- 每个功能模块有自己的文件夹
```
pages/
  user/
    list.tsx
    create.tsx
    edit.tsx
    detail.tsx
    components/
    api.ts
    types.ts
```

## 5. 注释和文档

### 5.1 文件头注释

- 每个文件应包含简要的文件说明
- 复杂文件应包含使用示例

```typescript
/**
 * 用户服务模块
 * 提供用户相关的 API 接口封装
 * 
 * @example
 * ```typescript
 * import { getUser } from '@/api/user-service';
 * 
 * const user = await getUser(1);
 * ```
 */
```

### 5.2 函数和组件注释

- 导出的函数和组件应包含 JSDoc 注释
- 注释应包含参数说明、返回值和使用示例

```typescript
/**
 * 格式化日期
 * @param date - 需要格式化的日期
 * @param format - 格式化字符串
 * @returns 格式化后的日期字符串
 * 
 * @example
 * ```typescript
 * formatDate(new Date(), 'YYYY-MM-DD'); // "2023-01-01"
 * ```
 */
export const formatDate = (date: Date, format: string): string => {
  // 实现
};
```

## 6. TypeScript 规范

### 6.1 类型定义

- 优先使用接口（interface）而不是类型别名（type）
- 类型定义放在单独的 `types.ts` 文件中
- 类型名称使用 PascalCase

```typescript
// ✅ 推荐
// types.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type Status = 'active' | 'inactive';

// ❌ 不推荐
type User = {
  id: number;
  name: string;
  email: string;
};
```

### 6.2 泛型使用

- 合理使用泛型提高代码复用性
- 泛型参数使用描述性名称

```typescript
// ✅ 推荐
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ❌ 不推荐
interface ApiResponse<T> {
  data: T;
  status: number;
  msg: string; // 不清晰的命名
}
```

## 7. CSS 和样式规范

### 7.1 样式文件命名

- CSS 文件使用 kebab-case 命名
- 样式文件与组件文件放在同一目录

```
components/
  button/
    button.tsx
    button.styles.ts  // 或 button.css
```

### 7.2 CSS 类名命名

- 使用 BEM 命名规范
- 使用 kebab-case

```css
/* ✅ 推荐 */
.user-card { }
.user-card__header { }
.user-card__avatar { }
.user-card--large { }

/* ❌ 不推荐 */
.userCard { }
.user-card-header { }
.UserCard__avatar { }
```

## 8. Git 提交规范

### 8.1 提交信息格式

使用 conventional commits 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 8.2 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `chore`: 构建过程或辅助工具的变动
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 重构（即不是新增功能，也不是修改 bug）
- `perf`: 性能优化
- `test`: 增加测试

### 8.3 提交示例

```
// ✅ 推荐
feat(user): 添加用户列表页面
fix(button): 修复按钮点击事件不触发的问题
docs(readme): 更新项目说明文档
style(button): 调整按钮样式
refactor(api): 重构用户服务模块

// ❌ 不推荐
更新
修复 bug
添加了一些东西
```