# Components 组件库

本目录包含了项目中使用的所有共享组件，这些组件在多个模块和页面中被复用。每个组件都经过精心设计，以确保一致性和可维护性。

## 组件目录

- [animate](./animate) - 动画组件库，基于 Framer Motion 实现
- [auth](./auth) - 认证和权限控制组件
- [avatar-group](./avatar-group) - 头像组组件
- [editor](./editor) - 富文本编辑器组件
- [enhanced-keep-alive](./enhanced-keep-alive) - 增强版 KeepAlive 组件，用于组件状态缓存
- [icon](./icon) - 图标组件，支持本地 SVG 和第三方图标库
- [loading](./loading) - 加载状态组件
- [locale-picker](./locale-picker) - 语言切换组件
- [logo](./logo) - Logo 组件
- [nav](./nav) - 导航菜单组件
- [olt-modal](./olt-modal) - 弹窗和对话框组件
- [olt-steps](./olt-steps) - 步骤条组件
- [olt-table](./olt-table) - 表格组件
- [olt-toast](./olt-toast) - 消息提示组件
- [olt-upload](./olt-upload) - 文件上传组件

## 详细文档

以下组件有详细的使用说明文档：

| 组件 | 文档链接 | 简要说明 |
|------|----------|----------|
| animate | [文档](./animate/README.md) | 基于 Framer Motion 的动画组件库，包含容器动画、视口动画和滚动进度条等 |
| auth | [文档](./auth/README.md) | 权限认证组件，提供权限保护和检查功能 |
| enhanced-keep-alive | [文档](./enhanced-keep-alive/README.md) | 增强版 KeepAlive 组件，支持智能缓存管理 |
| icon | [文档](./icon/README.md) | 图标组件，支持本地 SVG 图标和第三方图标库 |
| loading | [文档](./loading/README.md) | 加载状态组件，包括线性加载、圆形加载和路由加载进度条 |
| nav | [文档](./nav/README.md) | 导航组件，支持垂直、水平和迷你三种导航模式 |
| olt-modal | [文档](./olt-modal/README.md) | 弹窗和对话框组件，提供统一的弹窗管理方案 |
| olt-steps | [文档](./olt-steps/README.md) | 步骤条组件，用于展示多步骤流程 |
| olt-table | [文档](./olt-table/README.md) | 表格组件，基于 Ant Design Pro Table 封装 |
| olt-toast | [文档](./olt-toast/README.md) | 消息提示组件，用于显示通知和提示信息 |
| olt-upload | [文档](./olt-upload/README.md) | 文件上传组件，专门针对图片上传场景优化 |

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