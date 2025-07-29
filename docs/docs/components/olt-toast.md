# OltToast 组件

基于 [Sonner](https://sonner.emilkowal.ski/) 的 Toast 组件封装，提供了更加符合项目风格的样式和增强功能。

## 功能特性

- 🎨 **定制样式**: 使用项目主题色和设计风格
- 🎯 **双模式**: 支持 Toast 和 Notification 两种显示模式
- 🧩 **类型安全**: 完整的 TypeScript 类型支持
- ⚙️ **灵活配置**: 支持背景色、持续时间等自定义配置
- 🌈 **多种类型**: 支持成功、错误、警告、信息等多种类型提示

## 基础用法

```tsx
import { toast } from '@/components/olt-toast';

// 基础提示
toast('这是一条普通提示');

// 成功提示
toast.success('操作成功');

// 错误提示
toast.error('操作失败');

// 警告提示
toast.warning('请注意');

// 信息提示
toast.info('这是一条信息');

// 加载提示
const toastId = toast.loading('加载中...');
// 更新加载提示
toast.success('加载完成', { id: toastId });
```

## 使用模式

OltToast 提供两种显示模式：Toast 模式和 Notification 模式。

### Toast 模式（默认）

简洁的提示模式，适用于简短的消息提示。

```tsx
toast('这是一条普通提示', { mode: 'toast' });
toast.success('操作成功', { mode: 'toast' });
```

### Notification 模式

更丰富的通知模式，适用于需要展示更多信息的场景。

```tsx
toast('这是一条通知', { 
  mode: 'notification',
  description: '这是通知的详细描述信息'
});
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| mode | `'toast' \| 'notification'` | `'toast'` | 显示模式 |
| enableBackground | `boolean` | `true` | 是否启用背景色 |
| backgroundColor | `string` | 根据类型自动选择 | 自定义背景色 |
| position | `ToastPosition` | `'top-center'` | 显示位置 |
| duration | `number` | `3000` | 持续时间（毫秒），0 表示永久显示 |
| description | `ReactNode` | - | 描述信息 |
| action | `ReactNode` | - | 操作按钮 |
| cancel | `ReactNode` | - | 取消按钮 |
| ...其他 | `ExternalToast` | - | Sonner 的其他原始属性 |

## 高级用法

### 自定义持续时间

```tsx
// 5秒后自动关闭
toast.success('5秒后关闭', { duration: 5000 });

// 永久显示
toast.info('永久显示', { duration: 0 });
```

### 添加描述信息

```tsx
toast.success('操作成功', {
  description: '您的数据已保存',
  mode: 'notification'
});
```

### 添加操作按钮

```tsx
toast.info('有新版本可用', {
  action: {
    label: '立即更新',
    onClick: () => console.log('更新中...')
  }
});
```

### Promise 支持

```tsx
const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

toast.promise(promise, {
  loading: '加载中...',
  success: '加载成功',
  error: '加载失败'
});
```

### 自定义背景色

```tsx
toast.success('自定义背景色', {
  backgroundColor: '#ff5722'
});
```

### withBackground 快捷方法

```tsx
// 使用默认背景色的快捷方法
toast.withBackground('带背景的通知', {
  type: 'success',
  description: '这是描述信息'
});
```

## 样式差异

### Toast 模式
- 紧凑布局
- 图标较小（18px）
- 内边距: 10px 12px

### Notification 模式
- 宽松布局
- 图标较大（24px）
- 内边距: 16px
- 支持 description 描述信息
- 图标和内容垂直排列

## 主题支持

OltToast 组件会根据项目的主题模式（浅色/深色）自动切换样式，无需额外配置。