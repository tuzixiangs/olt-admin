# Components 组件库

本目录包含了项目中使用的所有共享组件，这些组件在多个模块和页面中被复用。

## 组件目录

- [animate](./animate) - 动画组件库，基于 Framer Motion 实现
- [auth](./auth) - 认证和权限控制组件
- [enhanced-keep-alive](./enhanced-keep-alive) - 增强版 KeepAlive 组件，用于组件状态缓存
- [icon](./icon) - 图标组件，支持本地 SVG 和第三方图标库
- [loading](./loading) - 加载状态组件
- [olt-modal](./olt-modal) - 弹窗和对话框组件
- [olt-table](./olt-table) - 表格组件
- [olt-toast](./olt-toast) - 消息提示组件
- [olt-upload](./olt-upload) - 文件上传组件

## 组件设计原则

1. **可复用性** - 组件设计为可在多个地方复用
2. **可配置性** - 通过 props 提供灵活的配置选项
3. **类型安全** - 使用 TypeScript 提供完整的类型定义
4. **文档完善** - 每个组件都有清晰的使用说明
5. **样式统一** - 遵循项目的设计规范和主题系统

## 使用示例

```tsx
// 导入组件
import { Icon } from '@/components/icon';
import { CircularLoading } from '@/components/loading';
import OltTable from '@/components/olt-table';

// 在组件中使用
function MyComponent() {
  return (
    <div>
      <Icon icon="mdi:home" />
      <CircularLoading />
      <OltTable />
    </div>
  );
}
```

## 添加新组件

要添加新组件，请遵循以下步骤：

1. 在 `components` 目录下创建新组件文件夹
2. 实现组件功能
3. 导出组件到 `index.ts` 文件
4. 添加组件文档（可选但推荐）

## 组件更新和维护

- 定期检查组件的依赖更新
- 保持组件 API 的稳定性
- 根据项目需求迭代组件功能
- 确保组件文档与实现保持同步
