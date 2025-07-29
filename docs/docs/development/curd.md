# CRUD 示例 - Posts 模块

Posts 模块是一个完整的 CRUD 示例，展示了如何在项目中实现增删改查功能。该模块演示了多种高级功能的使用，包括路由管理、表格展示、动态标签页标题更新、模态框管理等。

## 目录结构

```
posts/
├── api/
│   └── index.ts        # API 接口定义
├── components/
│   ├── PostDetail.tsx  # 详情组件
│   └── PostEdit.tsx    # 编辑组件
├── hooks/
│   ├── constants.ts    # 常量定义
│   ├── index.ts        # hooks 导出
│   ├── mutations.ts    # react-query mutations
│   └── queries.ts      # react-query queries
├── detail-page.tsx     # 详情页面（基于路由）
├── edit-page.tsx       # 编辑页面（基于路由）
├── list-page.tsx       # 列表页面（基于路由）
├── list.tsx            # 列表组件（使用模态框）
├── types.ts            # 类型定义
└── README.md           # 本文档
```

## 架构分层

Posts 模块遵循清晰的架构分层原则，将不同职责的代码分离到不同的目录中：

### API 层（api 目录）

API 层负责纯数据获取逻辑，不包含任何 React Query 相关代码。所有 HTTP 请求都通过 `Client` 发送，并返回原生 Promise。

- `index.ts` `/posts/api/index.ts` - 导出所有 API 方法，如 `fetchPosts`、`fetchPost`、`createPost` 等
- 这些方法只负责与后端通信，不处理缓存、状态等逻辑

### React Query 层（hooks 目录）

React Query 层负责将 API 方法包装成 React Query 的 Queries 和 Mutations，管理数据缓存、状态和副作用。

- `queries.ts` `/posts/hooks/queries.ts` - 包含所有查询相关的 hooks，如 `usePosts`、`usePost`
- `mutations.ts` `/posts/hooks/mutations.ts` - 包含所有变更相关的 hooks，如 `useCreatePost`、`useUpdatePost`
- `constants.ts` `/posts/hooks/constants.ts` - 定义 React Query 的命名空间和查询键工厂

### 常量定义（hooks/constants.ts）

为避免与其他模块的查询键冲突，使用基于文件路径的命名空间：

```typescript
// 模块命名空间 - 基于文件路径，避免与其他模块冲突
export const MODULE_NAMESPACE = ["pages", "example", "curd", "posts"];

// 查询键工厂 - 使用命名空间前缀
export const createQueryKeys = () => ({
  all: () => [...MODULE_NAMESPACE],
  lists: () => [...MODULE_NAMESPACE, "list"],
  list: (params: any) => [...MODULE_NAMESPACE, "list", params],
  details: () => [...MODULE_NAMESPACE, "detail"],
  detail: (id: string) => [...MODULE_NAMESPACE, "detail", id],
});
```

## 功能特性

### 1. 路由管理

Posts 模块展示了两种不同的路由管理方式：

#### 基于路由的页面组件

`/posts/list-page.tsx`、`/posts/edit-page.tsx` 和 `/posts/detail-page.tsx` 是基于路由的页面组件，通过 URL 访问。

#### 路由 Loader

`/posts/edit-page.tsx` 中使用了路由 loader 来预加载数据：

```typescript
export const loader = async ({ params }: LoaderFunctionArgs): Promise<TabActionParams> => {
  const { id } = params as { id: string };
  if (!id) {
    return { editData: {} as IPost };
  }
  const editData = await getPost(id);
  // 利用 loader 中的 tabTitle 和 tabAction 动态更新 tab 的 title
  return { editData, tabTitle: editData?.title || "", tabAction: "join" };
};
```

Loader 会在页面加载前执行，预加载所需数据，并可以动态设置标签页标题。

### 2. OltTable 使用

`/posts/list-page.tsx` 展示了如何使用 OltTable 组件：

```typescript
const { tableProps, refresh } = useProTable<IPost, PostQueryParams>(getPosts, {
  queryKey: queryKeys.lists(),
  defaultPageSize: 10,
});

return (
  <OltTable<IPost>
    {...tableProps}
    columns={columns}
    rowKey="id"
    autoHeight={true}
    toolBarRender={() => [
      <Button type="primary" key="add" onClick={() => push("/curd/pagePosts/create")}>
        新增文章
      </Button>,
    ]}
    onRow={(record) => ({
      onClick: () => showDetail(record),
    })}
    rowClickable={true}
    bordered={true}
    stripe={true}
    options={{
      reload: () => refresh(),
    }}
  />
);
```

### 3. 动态 Multi-Tabs 标签标题

Posts 模块展示了两种更新标签页标题的方式：

#### 在 Loader 中设置标题

在 `/posts/edit-page.tsx` 的 loader 中：

```typescript
export const loader = async ({ params }: LoaderFunctionArgs): Promise<TabActionParams> => {
  const { id } = params as { id: string };
  if (!id) {
    return { editData: {} as IPost };
  }
  const editData = await getPost(id);
  // 利用 loader 中的 tabTitle 和 tabAction 动态更新 tab 的 title
  return { editData, tabTitle: editData?.title || "", tabAction: "join" };
};
```

#### 在组件中动态更新标题

在 `/posts/detail-page.tsx` 中：

```typescript
const { updateTabTitle } = useMultiTabsContext();
const { pathname = "" } = useLocation();

<ProDescriptions
  request={async () => {
    try {
      const res = await getPost(id?.toString() || "");
      // 利用 hook 更新 tab 的 title
      updateTabTitle(pathname, res.title, "join");
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      // 错误处理
    }
  }}
  // ... 其他配置
/>
```

### 4. OltModal 使用

`/posts/list.tsx` 展示了如何使用 OltModal 进行弹窗管理：

```typescript
// 详情弹窗管理
const detailModal = useModal({
  defaultConfig: {
    type: "modal",
    title: "文章详情",
    width: 800,
    footer: null,
  },
});

// 编辑弹窗管理
const editModal = useModal({
  defaultConfig: {
    type: "modal",
    title: "编辑文章",
    width: 600,
    destroyOnClose: true,
    footer: null,
  },
});

// 显示详情
const showDetail = (record: IPost) => {
  detailModal.open({
    content: <PostDetail postId={record.id} />,
  });
};

// 显示编辑表单
const showEditForm = (record?: IPost) => {
  editModal.open({
    title: record ? "编辑文章" : "新增文章",
    content: (
      <PostEditForm
        editData={record}
        onSuccess={() => {
          editModal.close();
        }}
        onCancel={editModal.close}
      />
    ),
  });
};
```

### 5. 表单处理

`/posts/edit-page.tsx` 和 `/posts/edit.tsx` 展示了如何使用 BetaSchemaForm 处理表单：

```typescript
const postFormColumns: ProFormColumnsType<IPost>[] = [
  {
    title: "标题",
    dataIndex: "title",
    valueType: "text",
    fieldProps: {
      placeholder: "请输入标题",
    },
    formItemProps: {
      rules: [{ required: true, message: "请输入标题" }],
    },
  },
  // ... 其他字段
];

<BetaSchemaForm<IPost>
  layoutType="Form"
  columns={postFormColumns}
  initialValues={initialValues}
  onFinish={handleFinish}
  // ... 其他配置
/>
```

## 数据流

1. 使用 `useProTable` hook 管理表格数据获取和分页
2. 通过 `react-query` 进行数据缓存和状态管理
3. 使用 `useMutation` 处理创建、更新和删除操作
4. 通过 `fakeClient` 模拟 API 请求

## 使用示例

### 创建新文章

1. 点击列表页面的"新增文章"按钮
2. 跳转到编辑页面
3. 填写表单并提交
4. 数据保存后自动返回列表页面

### 编辑文章

1. 在列表中点击"编辑"按钮
2. 跳转到编辑页面，表单已填充当前数据
3. 修改数据并提交
4. 数据更新后自动返回列表页面

### 查看详情

#### 方式一：页面详情

1. 点击列表中的"详情"按钮
2. 跳转到详情页面
3. 页面加载后自动更新标签页标题

#### 方式二：模态框详情

1. 点击列表中的某一行
2. 弹出详情模态框
3. 查看文章详细信息

### 删除文章

1. 点击列表中的"删除"按钮
2. 弹出确认对话框
3. 确认删除后数据将被移除

## 注意事项

1. 页面组件和模态框组件是分离的，分别针对不同的使用场景
2. 使用 `useProTable` 简化了表格数据管理
3. 通过路由 loader 可以在页面加载前预加载数据
4. 动态标签页标题提升了用户体验
5. 使用 `react-query` 进行数据缓存和状态管理，提高性能
