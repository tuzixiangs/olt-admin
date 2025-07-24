# 列设置组件 (Column Setting)

一个功能强大的表格列配置组件，支持拖拽排序、显示/隐藏控制、锁定字段和动态新增字段等功能。

## 功能特性

### 🎯 核心功能
- **拖拽排序** - 通过拖拽调整列的显示顺序
- **显示/隐藏控制** - 通过复选框控制列的显示状态
- **锁定字段** - 设置默认锁定的字段，无法隐藏或移动
- **新增字段** - 支持动态添加自定义字段
- **搜索过滤** - 快速搜索字段名称
- **配置持久化** - 将列配置保存到本地存储

### 🎨 交互体验
- **视觉反馈** - 拖拽过程中的实时视觉反馈
- **响应式设计** - 适配不同屏幕尺寸
- **键盘支持** - 支持键盘操作
- **无障碍访问** - 完善的可访问性支持

## 基本用法

### 1. 在 OltTable 中启用

```tsx
import OltTable from "@/components/olt-table";
import { type ProColumns } from "@ant-design/pro-components";

const columns: ProColumns[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 150,
  },
  {
    key: 'age',
    title: '年龄', 
    dataIndex: 'age',
    width: 100,
  },
  // ... 更多列配置
];

function MyTable() {
  return (
    <OltTable
      columns={columns}
      dataSource={data}
      enableColumnSetting={true}           // 启用列设置
      enableColumnStorage={true}           // 启用配置持久化
      defaultLockedColumns={['name']}      // 锁定姓名列
      columnStorageKey="my-table-columns"  // 自定义存储键名
    />
  );
}
```

### 2. 单独使用组件

```tsx
import { ColumnSetting } from "@/components/olt-table";
import { useState } from "react";

function MyComponent() {
  const [visible, setVisible] = useState(false);
  const [columns, setColumns] = useState(originalColumns);

  return (
    <>
      <Button onClick={() => setVisible(true)}>
        列设置
      </Button>
      
      <ColumnSetting
        visible={visible}
        columns={originalColumns}
        onColumnsChange={setColumns}
        onClose={() => setVisible(false)}
        defaultLockedColumns={['id', 'name']}
        enableStorage={true}
        storageKey="custom-table-columns"
      />
    </>
  );
}
```

## 属性配置

### OltTable 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enableColumnSetting` | `boolean` | `true` | 是否启用列设置功能 |
| `defaultLockedColumns` | `string[]` | `[]` | 默认锁定的列key列表 |
| `enableColumnStorage` | `boolean` | `false` | 是否启用配置持久化存储 |
| `columnStorageKey` | `string` | `olt-table-${pathname}` | 配置存储的键名 |

### ColumnSetting 属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `visible` | `boolean` | ✓ | 是否显示设置面板 |
| `columns` | `ProColumns[]` | ✓ | 原始列配置 |
| `onColumnsChange` | `(columns: ProColumns[]) => void` | ✓ | 列配置变更回调 |
| `onClose` | `() => void` | ✓ | 关闭面板回调 |
| `defaultLockedColumns` | `string[]` | | 默认锁定的列key |
| `enableStorage` | `boolean` | | 是否启用持久化存储 |
| `storageKey` | `string` | | 存储键名 |

## 字段类型

新增字段时支持以下类型：

| 类型 | 说明 | 默认渲染 |
|------|------|----------|
| `text` | 文本类型 | 直接显示文本内容 |
| `number` | 数字类型 | 格式化数字显示 |
| `date` | 日期类型 | 日期格式化显示 |
| `select` | 选择类型 | 下拉选择器 |
| `custom` | 自定义类型 | 需要自定义渲染函数 |

## 最佳实践

### 1. 合理设置锁定字段

```tsx
// 推荐锁定关键字段
<OltTable
  defaultLockedColumns={['id', 'name', 'actions']}
  // ...
/>
```

### 2. 自定义存储键名

```tsx
// 为不同页面使用不同的存储键
<OltTable
  columnStorageKey={`table-${pageId}-columns`}
  // ...
/>
```

### 3. 处理列配置变更

```tsx
const handleColumnsChange = useCallback((newColumns: ProColumns[]) => {
  // 可以在这里添加额外的逻辑
  console.log('列配置已更新:', newColumns);
  setColumns(newColumns);
}, []);

<OltTable
  columns={columns}
  onColumnsChange={handleColumnsChange}
  // ...
/>
```

## 样式定制

### CSS 类名

- `.column-setting-item` - 字段项容器
- `.drag-handle` - 拖拽手柄
- `.column-action-btn` - 操作按钮
- `.drag-over` - 拖拽悬停状态

### 自定义样式

```css
/* 自定义拖拽手柄颜色 */
.drag-handle {
  color: #1890ff;
}

/* 自定义锁定字段样式 */
.column-setting-item.locked {
  background-color: #f0f0f0;
  border-color: #d9d9d9;
}
```

## 注意事项

1. **列标识唯一性** - 确保每列都有唯一的 `key` 或 `dataIndex`
2. **锁定字段限制** - 锁定的字段无法隐藏、移动或删除
3. **存储容量** - 持久化存储会占用 localStorage 空间
4. **性能考虑** - 大量列时建议关闭实时预览
5. **浏览器兼容** - 拖拽功能需要现代浏览器支持

## 常见问题

### Q: 如何重置列配置？
A: 点击设置面板底部的"重置"按钮，或者清除对应的 localStorage 数据。

### Q: 新增的字段如何自定义渲染？
A: 新增字段后，可以通过修改返回的列配置中的 `render` 属性来自定义渲染。

### Q: 可以批量操作字段吗？
A: 目前不支持批量操作，每个字段需要单独设置。

### Q: 拖拽不生效怎么办？
A: 检查是否有其他拖拽库冲突，或者浏览器是否支持原生拖拽 API。 