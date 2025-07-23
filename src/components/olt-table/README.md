# OltTable 组件

ProTable 的二次封装组件，将常用的容器包装和自动高度功能集成在一起。

## 功能特性

- 🔧 **完全兼容**: 保持 ProTable 的所有原始 props
- 📦 **内置容器**: 自动包含 `page-container` 样式的外层容器
- 📏 **自动高度**: 可选的自动高度计算功能
- 🎯 **类型安全**: 完整的 TypeScript 类型支持

## 基础用法

```tsx
import OltTable from '@/components/pro-table';
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
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| autoHeight | `boolean` | `false` | 是否启用自动高度计算 |
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

## 何时使用 autoHeight

- ✅ 表格需要适应容器高度时
- ✅ 需要固定表头滚动时
- ❌ 表格高度固定或由内容决定时
- ❌ 在弹窗或抽屉中使用时（可能影响布局） 