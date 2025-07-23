
## 使用方式

### 1. 基础 Hook 使用 - useModal

适用于简单的弹窗场景：

```tsx
import { useModal } from '@/components/dialog';
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
import { useDialog } from '@/components/dialog';

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
import { dialog } from '@/components/dialog';

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
import { useModalDialog, useDrawerDialog } from '@/components/dialog';

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