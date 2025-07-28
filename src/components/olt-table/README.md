# OltTable 组件

ProTable 的二次封装组件，将常用的容器包装和自动高度功能集成在一起。

## 功能特性

- 🔧 **完全兼容**: 保持 ProTable 的所有原始 props
- 📦 **内置容器**: 自动包含 `page-container` 样式的外层容器
- 📏 **自动高度**: 可选的自动高度计算功能（待完善）
- 🎨 **样式增强**: 支持斑马纹、行点击效果等样式
- ⚙️ **列设置**: 内置自定义列设置功能，支持锁定列、列状态存储
- 🎯 **类型安全**: 完整的 TypeScript 类型支持

## 基础用法

```tsx
import OltTable from '@/components/olt-table';
import { type ProColumns } from '@ant-design/pro-components';

const columns: ProColumns<DataType>[] = [
  // 你的列定义
];

// 基础使用（不启用自动高度）
<OltTable
  columns={columns}
  dataSource={data}
  rowKey="id"
/>

// 启用自动高度
<OltTable
  columns={columns}
  dataSource={data}
  rowKey="id"
  autoHeight={true}
/>

// 启用样式增强功能
<OltTable
  columns={columns}
  dataSource={data}
  rowKey="id"
  stripe={true}
  rowClickable={true}
/>

// 启用列设置存储功能
<OltTable
  columns={columns}
  dataSource={data}
  rowKey="id"
  enableColumnStorage={true}
  columnStorageKey="my-table-columns"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| autoHeight | `boolean` | `false` | 是否启用自动高度计算 |
| stripe | `boolean` | `false` | 是否启用斑马纹样式 |
| rowClickable | `boolean` | `false` | 是否启用行点击效果 |
| defaultLockedColumns | `string[]` | `[]` | 默认锁定的列 dataIndex |
| enableColumnStorage | `boolean` | `false` | 是否启用列配置持久化存储 |
| columnStorageKey | `string` | - | 列配置存储键名，未指定时根据页面路径自动生成 |
| ...其他 | `ProTableProps` | - | 继承 ProTable 的所有原始属性 |

## 与原始 ProTable 的区别

### 之前
```tsx
const { scroll, tableContainerRef } = useTableScroll();

return (
  <div ref={tableContainerRef} className="page-container">
    <ProTable
      {...props}
      scroll={scroll}
    />
  </div>
);
```

### 现在
```tsx
return (
  <OltTable
    {...props}
    autoHeight={true}
  />
);
```

## 列设置功能

OltTable 内置了增强的列设置功能：

- 替换了 ProTable 默认的列设置组件
- 支持锁定某些列不被隐藏
- 支持将列设置状态持久化存储到 localStorage
- 可通过 [columnStorageKey](#props) 指定存储键名，或使用默认生成的键名