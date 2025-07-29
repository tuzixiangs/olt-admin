# OltModal 组件

## 使用方式

### 1. 基础 Hook 使用 - useModal

适用于简单的弹窗场景：

```tsx
import { useModal } from '@/components/olt-modal';
import PostEditForm from './edit-new';

function PostList() {
  // 创建编辑弹窗
  const editModal = useModal({
    defaultConfig: {
      type: 'modal',
      title: '编辑文章',
      width: 600,
    },
  });

  const showEditForm = (record?: IPost) => {
    editModal.open({
      title: record ? '编辑文章' : '新增文章',
      content: (
        <PostEditForm
          editData={record}
          onSuccess={editModal.close}
          onCancel={editModal.close}
        />
      ),
    });
  };

  return (
    <Button onClick={() => showEditForm()}>
      新增文章
    </Button>
  );
}
```

### 2. 高级 Hook 使用 - useDialog

适用于复杂的多弹窗场景：

```tsx
import { useDialog } from '@/components/olt-modal';

function PostList() {
  const dialog = useDialog();

  const showDetails = (record: IPost) => {
    const detailId = dialog.open({
      type: 'drawer',
      title: '文章详情',
      width: 800,
      content: <PostDetail postId={record.id} />,
    });

    // 可以后续更新弹窗
    setTimeout(() => {
      dialog.update(detailId, { title: '更新后的标题' });
    }, 2000);
  };

  return <div>...</div>;
}
```

### 3. 全局调用 - dialog

可以在任何地方调用，无需 Hook：

```tsx
import { dialog } from '@/components/olt-modal';

// 确认对话框
const handleDelete = async (record: IPost) => {
  const confirmed = await dialog.confirm({
    title: "确认删除",
    content: `确定要删除文章 "${record.title}" 吗？`,
    onOk: async () => {
      await deletePost(record.id);
    },
  });
};

// 信息提示
const showInfo = () => {
  dialog.info({
    title: "提示",
    content: "这是一条信息",
  });
};

// 自定义弹窗
const showCustomDialog = () => {
  dialog.open({
    type: 'modal',
    title: '自定义弹窗',
    content: <CustomComponent />,
    width: 800,
  });
};
```

### 4. 特定类型的 Hook

```tsx
import { useModalDialog, useDrawerDialog } from '@/components/olt-modal';

function MyComponent() {
  // Modal 类型弹窗
  const modal = useModalDialog({
    defaultConfig: {
      centered: true,
      width: 600,
    },
  });

  // Drawer 类型弹窗
  const drawer = useDrawerDialog({
    defaultConfig: {
      placement: 'right',
      width: 800,
    },
  });

  return (
    <div>
      <Button onClick={() => modal.open({ content: <div>Modal 内容</div> })}>
        打开 Modal
      </Button>
      <Button onClick={() => drawer.open({ content: <div>Drawer 内容</div> })}>
        打开 Drawer
      </Button>
    </div>
  );
}
```

### 5. 表单弹窗使用

```tsx
import { dialog } from '@/components/olt-modal';
import UserForm from './UserForm';

const showUserForm = () => {
  dialog.form({
    title: '用户信息',
    formComponent: <UserForm />,
    initialValues: { name: '', email: '' },
    onSubmit: async (values) => {
      await submitUser(values);
      message.success('提交成功');
    },
    okText: '提交',
    cancelText: '取消'
  });
};
```

### 6. 弹窗状态管理

```tsx
import { useModal } from '@/components/olt-modal';

function DataForm() {
  const modal = useModal();
  
  const handleSubmit = async () => {
    try {
      // 设置加载状态
      modal.setLoading(true);
      
      // 执行提交操作
      await submitData();
      
      // 关闭弹窗
      modal.close();
      
      // 显示成功消息
      message.success('提交成功');
    } catch (error) {
      // 处理错误
      message.error('提交失败');
    } finally {
      // 重置加载状态
      modal.setLoading(false);
    }
  };

  return (
    <div>
      {/* 表单内容 */}
      <Button 
        type="primary" 
        loading={modal.loading} 
        onClick={handleSubmit}
      >
        提交
      </Button>
    </div>
  );
}
```

## API 说明

### useModal Hook

用于管理单个弹窗的状态。

#### 参数

```typescript
interface UseModalOptions {
  defaultConfig?: Partial<DialogConfig>; // 默认配置
  onOpen?: () => void;                   // 打开时回调
  onClose?: () => void;                  // 关闭时回调
}
```

#### 返回值

```typescript
interface UseModalReturn {
  open: (config?: Partial<DialogConfig>) => void; // 打开弹窗
  close: () => void;                              // 关闭弹窗
  toggle: () => void;                             // 切换弹窗状态
  isOpen: boolean;                                // 弹窗是否打开
  loading: boolean;                               // 加载状态
  setLoading: (loading: boolean) => void;         // 设置加载状态
}
```

### useDialog Hook

用于管理多个弹窗。

#### 返回值

```typescript
interface UseDialogReturn {
  open: (config: DialogConfig) => string;         // 打开弹窗，返回ID
  close: (id: string) => void;                    // 关闭指定弹窗
  closeAll: () => void;                           // 关闭所有弹窗
  update: (id: string, config: Partial<DialogConfig>) => void; // 更新弹窗配置
  getInstance: (id: string) => DialogInstance | undefined;    // 获取弹窗实例
}
```

### dialog 全局对象

提供全局调用方法。

#### 方法

- `open(config: DialogConfig): string` - 打开弹窗
- `close(id: string): void` - 关闭弹窗
- `closeAll(): void` - 关闭所有弹窗
- `update(id: string, updates: Partial<DialogConfig>): void` - 更新弹窗
- `setLoading(id: string, loading: boolean): void` - 设置加载状态
- `confirm(config: ConfirmConfig): Promise<boolean>` - 确认对话框
- `info(config: Omit<ConfirmConfig, "type">): Promise<boolean>` - 信息提示
- `success(config: Omit<ConfirmConfig, "type">): Promise<boolean>` - 成功提示
- `error(config: Omit<ConfirmConfig, "type">): Promise<boolean>` - 错误提示
- `warning(config: Omit<ConfirmConfig, "type">): Promise<boolean>` - 警告提示
- `form<T = any>(config: FormDialogConfig<T>): string` - 表单弹窗

## 配置项说明

### DialogConfig 弹窗配置

```typescript
interface BaseDialogConfig {
  id?: string;              // 弹窗ID
  title?: ReactNode;        // 标题
  content: ReactNode;       // 内容
  type?: DialogType;        // 类型: 'modal' | 'drawer'
  width?: string | number;  // 宽度
  onOk?: () => void | Promise<void>;     // 确定回调
  onCancel?: () => void;    // 取消回调
  onClose?: () => void;     // 关闭回调
  okText?: string;          // 确定按钮文本
  cancelText?: string;      // 取消按钮文本
  closable?: boolean;       // 是否显示关闭按钮
  maskClosable?: boolean;   // 是否允许点击遮罩关闭
  destroyOnClose?: boolean; // 关闭时是否销毁
  className?: string;       // 自定义类名
  style?: React.CSSProperties; // 自定义样式
  footer?: ReactNode;       // 自定义底部
}

// Modal 配置
interface ModalConfig extends BaseDialogConfig {
  type: "modal";
  centered?: boolean;       // 是否居中
  modalProps?: Omit<ModalProps, "open" | "onOk" | "onCancel">; // Antd Modal 属性
}

// Drawer 配置
interface DrawerConfig extends BaseDialogConfig {
  type: "drawer";
  placement?: "top" | "right" | "bottom" | "left"; // 抽屉位置
  drawerProps?: Omit<DrawerProps, "open" | "onClose">; // Antd Drawer 属性
}
```

## 最佳实践

### 1. 组件设计原则

- **单一职责**: 弹窗组件只负责渲染，不管理状态
- **纯组件**: 使用 `memo` 优化性能
- **Props 传递**: 通过 props 传递数据，而非命令式调用
- **回调处理**: 通过 props 传递成功/取消回调

### 2. 状态管理

- **局部状态**: 使用 `useModal` 管理单个弹窗
- **全局状态**: 使用 `dialog` 进行全局调用
- **复杂场景**: 使用 `useDialog` 管理多个弹窗

### 3. 错误处理

```tsx
const editModal = useModal({
  onClose: () => {
    // 弹窗关闭时的清理逻辑
  },
});

const handleSubmit = async () => {
  try {
    editModal.setLoading(true);
    await submitData();
    editModal.close();
  } catch (error) {
    // 错误处理，不关闭弹窗
    message.error('提交失败');
  } finally {
    editModal.setLoading(false);
  }
};
```

### 4. 性能优化

```tsx
// 对于复杂弹窗内容，使用 memo 优化
const MemoizedContent = memo(({ data }) => {
  return <ComplexComponent data={data} />;
});

// 合理使用 destroyOnClose 减少内存占用
const modal = useModal({
  defaultConfig: {
    destroyOnClose: true, // 关闭时销毁组件
  }
});
```