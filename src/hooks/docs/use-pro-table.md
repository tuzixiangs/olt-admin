# useProTable Hook

`useProTable` 是一个基于 `@tanstack/react-query` 实现的 React Hook，用于简化表格数据的获取、分页、搜索和缓存管理。它提供了完整的表格数据管理解决方案，适用于需要分页、搜索和缓存功能的场景。

## 导入

```typescript
import { useProTable } from '@/hooks/use-pro-table';
```

## 类型定义

### ServiceFunction

服务函数类型，用于获取表格数据：

```typescript
type ServiceFunction<TData = any, TParams = any> = (
  paginationParams: {
    current?: number;
    pageSize?: number;
    filters?: any;
    sorter?: any;
    extra?: any;
  },
  searchParams?: TParams,
) => Promise<{ list: TData[]; total: number }>;
```

### UseProTableOptions

Hook 选项类型：

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| defaultPageSize | `number` | `10` | 默认每页条数 |
| defaultParams | `[PaginationParams, TParams?]` | `undefined` | 默认查询参数 |
| defaultPaginationOptions | `PaginationOptions` | `{}` | 默认分页配置 |
| useCache | `boolean` | `false` | 是否使用参数缓存 |
| manual | `boolean` | `false` | 是否手动查询 |
| queryOptions | `UseQueryOptions` | `undefined` | 支持完整的 useQuery 配置 |
| queryKey | `any[]` | `[]` | 查询 key，用于 useQuery 缓存 |
| onSuccess | `(data: QueryResult) => void` | `undefined` | 查询成功回调 |
| onError | `(error: any) => void` | `undefined` | 查询失败回调 |

### UseProTableResult

Hook 返回值类型：

```typescript
interface UseProTableResult<TData = any, TParams = any> {
  tableProps: {
    dataSource: TData[];
    loading: boolean;
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      onChange: (page: number, pageSize?: number) => void;
      onShowSizeChange: (current: number, size: number) => void;
    };
    onChange: TableProps<TData>["onChange"];
  };
  search: {
    submit: (values?: any) => void;
    reset: () => void;
  };
  refresh: () => void;
  run: (newParams?: [PaginationParams, TParams?]) => void;
  params: [PaginationParams, TParams?];
  isPlaceholderData: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
```

## 使用方法

### 基本用法

```typescript
import { useProTable } from '@/hooks/use-pro-table';
import { ProTable } from '@ant-design/pro-components';

// 定义数据类型
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

// 定义搜索参数类型
interface UserSearchParams {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

// 定义服务函数
const userService = async (params: any) => {
  // 模拟 API 调用
  const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
  const data = await response.json();
  return {
    list: data.users,
    total: data.total
  };
};

const UserTable = () => {
  const { tableProps } = useProTable<User, UserSearchParams>(userService, {
    queryKey: ['users'],
    defaultPageSize: 20
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <ProTable<User>
      columns={columns}
      {...tableProps}
      rowKey="id"
    />
  );
};
```

### 带搜索功能的表格

```typescript
import { useProTable } from '@/hooks/use-pro-table';
import { ProTable, ProFormText, ProFormSelect } from '@ant-design/pro-components';

const UserSearchTable = () => {
  const { tableProps, search } = useProTable<User, UserSearchParams>(userService, {
    queryKey: ['users'],
    defaultPageSize: 20
  });

  const columns = [
    // ... 列定义
  ];

  return (
    <>
      <ProTable<User>
        columns={columns}
        {...tableProps}
        rowKey="id"
        toolbar={{
          search: {
            onSearch: (value: string) => {
              search.submit({ name: value });
            },
          },
        }}
        form={{
          autoFocusFirstInput: true,
          submitter: {
            resetButtonProps: {
              onClick: () => {
                search.reset();
              },
            },
          },
        }}
      />
    </>
  );
};
```

### 手动查询模式

```typescript
const ManualQueryTable = () => {
  const { tableProps, run } = useProTable<User, UserSearchParams>(userService, {
    queryKey: ['users'],
    manual: true, // 启用手动查询
    defaultParams: [
      { current: 1, pageSize: 20 },
      { status: 'active' }
    ]
  });

  // 组件挂载时手动触发查询
  useEffect(() => {
    run();
  }, [run]);

  const handleSearch = (values: UserSearchParams) => {
    run([
      { current: 1, pageSize: 20 },
      values
    ]);
  };

  return (
    <div>
      {/* 搜索表单 */}
      <SearchForm onSearch={handleSearch} />
      
      {/* 表格 */}
      <ProTable<User>
        columns={columns}
        {...tableProps}
        rowKey="id"
      />
    </div>
  );
};
```

### 使用缓存参数

```typescript
const CachedParamsTable = () => {
  const { tableProps } = useProTable<User, UserSearchParams>(userService, {
    queryKey: ['users'],
    useCache: true, // 启用参数缓存
    defaultParams: [
      { current: 1, pageSize: 20 },
      { status: 'active' }
    ]
  });

  return (
    <ProTable<User>
      columns={columns}
      {...tableProps}
      rowKey="id"
    />
  );
};
```

### 自定义分页配置

```typescript
const CustomPaginationTable = () => {
  const { tableProps } = useProTable<User, UserSearchParams>(userService, {
    queryKey: ['users'],
    defaultPageSize: 10,
    defaultPaginationOptions: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total) => `共 ${total} 条记录`,
    }
  });

  return (
    <ProTable<User>
      columns={columns}
      {...tableProps}
      rowKey="id"
    />
  );
};
```

## 返回值详解

### tableProps

可以直接传递给 ProTable 组件的 props：

| 属性 | 类型 | 描述 |
|------|------|------|
| dataSource | `TData[]` | 表格数据 |
| loading | `boolean` | 是否正在加载数据 |
| pagination | `object` | 分页配置 |
| onChange | `TableProps<TData>["onChange"]` | 表格变化回调 |

### search

搜索相关方法：

| 方法 | 参数 | 描述 |
|------|------|------|
| submit | `(values?: TParams) => void` | 提交搜索 |
| reset | `() => void` | 重置搜索 |

### 其他方法和属性

| 属性/方法 | 类型 | 描述 |
|----------|------|------|
| refresh | `() => void` | 刷新数据 |
| run | `(newParams?: [PaginationParams, TParams?]) => void` | 手动运行查询 |
| params | `[PaginationParams, TParams?]` | 当前查询参数 |
| isPlaceholderData | `boolean` | 是否为占位数据 |
| isFetching | `boolean` | 是否正在获取数据 |
| isLoading | `boolean` | 是否为初始加载状态 |

## 完整示例

```tsx
import React, { useState } from 'react';
import { useProTable } from '@/hooks/use-pro-table';
import { 
  ProTable, 
  ProFormText, 
  ProFormSelect,
  PageContainer
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import type { User } from './types';

interface UserSearchParams {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

const fetchUsers = async (params: any) => {
  // 模拟 API 调用
  const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
  const data = await response.json();
  return {
    list: data.users,
    total: data.total
  };
};

const UserManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { 
    tableProps, 
    search, 
    refresh,
    isFetching 
  } = useProTable<User, UserSearchParams>(fetchUsers, {
    queryKey: ['users'],
    defaultPageSize: 10,
    useCache: true,
    onSuccess: (data) => {
      console.log('获取用户数据成功:', data);
    },
    onError: (error) => {
      console.error('获取用户数据失败:', error);
    }
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: {
        active: { text: '活跃', status: 'Success' },
        inactive: { text: '非活跃', status: 'Default' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<User>
        headerTitle="用户管理"
        columns={columns}
        {...tableProps}
        rowKey="id"
        toolBarRender={() => [
          <Button 
            key="add" 
            type="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            新建用户
          </Button>,
          <Button 
            key="refresh" 
            onClick={refresh}
            loading={isFetching}
          >
            刷新
          </Button>
        ]}
        search={{
          labelWidth: 'auto',
        }}
        form={{
          autoFocusFirstInput: true,
          submitter: {
            render: (_, dom) => <Space>{dom}</Space>,
            resetButtonProps: {
              onClick: () => {
                search.reset();
              },
            },
          },
        }}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default UserManagement;
```

## 注意事项

1. 服务函数需要返回具有 `list` 和 `total` 属性的对象
2. 当启用 `useCache` 时，查询参数会被缓存，页面刷新后会保留上次的查询条件
3. 在手动模式下`manual`，需要调用 `run()` 方法手动触发查询
4. `queryKey` 是必需的，用于 react-query 的缓存标识
5. 表格数据变化时会自动保持前一次的数据（占位数据），避免页面闪烁