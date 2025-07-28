# Icon 图标组件

一个基于 Iconify 的通用图标组件，支持本地 SVG 图标、URL 图标和第三方图标库。

## 目录结构

```
icon/
├── icon.tsx              # 图标组件主文件
├── register-icons.ts     # 本地图标注册工具
└── index.ts              # 导出文件
```

## 组件说明

### Icon 图标组件

通用图标组件，支持多种图标来源。

#### Props 参数

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| icon | string | - | 图标名称或路径 |
| size | string \| number | '1em' | 图标大小 |
| color | string | 'currentColor' | 图标颜色 |
| className | string | '' | 自定义 CSS 类名 |
| style | CSSProperties | {} | 自定义样式 |
| ...props | IconifyIconProps | - | 其他 Iconify 支持的属性 |

#### 图标类型支持

1. **本地 SVG 图标**：使用 `local:icon-name` 格式
2. **URL SVG 图标**：使用 `url:https://example.com/icon.svg` 格式
3. **第三方图标库**：直接使用图标名称，如 `mdi:home`

#### 使用示例

##### 基础使用

```tsx
import { Icon } from '@/components/icon';

// 使用第三方图标库
<Icon icon="mdi:home" />
<Icon icon="mdi:user" size={24} color="#1890ff" />

// 使用本地 SVG 图标
<Icon icon="local:logo" size="2em" />

// 使用 URL SVG 图标
<Icon icon="url:https://example.com/icon.svg" size={32} />
```

##### 在按钮中使用

```tsx
import { Button } from 'antd';
import { Icon } from '@/components/icon';

<Button icon={<Icon icon="mdi:plus" />}>
  添加用户
</Button>

<Button icon={<Icon icon="local:download" />}>
  下载
</Button>
```

##### 在菜单中使用

```tsx
import { Menu } from 'antd';
import { Icon } from '@/components/icon';

<Menu>
  <Menu.Item key="1" icon={<Icon icon="mdi:home" />}>
    首页
  </Menu.Item>
  <Menu.Item key="2" icon={<Icon icon="mdi:user" />}>
    用户管理
  </Menu.Item>
  <Menu.Item key="3" icon={<Icon icon="local:settings" />}>
    设置
  </Menu.Item>
</Menu>
```

### registerLocalIcons 本地图标注册

自动导入并注册本地 SVG 图标到 Iconify 集合中。

#### 功能说明

- 自动扫描 `src/assets/icons/` 目录下的所有 SVG 文件
- 将 SVG 文件解析为 Iconify 图标格式
- 注册为 `local` 前缀的图标集合
- 支持缓存，避免重复注册

#### 使用方式

```tsx
// 在应用入口文件中注册本地图标
import { registerLocalIcons } from '@/components/icon';

// 注册本地图标
registerLocalIcons();

// 然后就可以在应用中使用本地图标
<Icon icon="local:icon-name" />
```

#### 本地图标目录结构

```
src/
├── assets/
│   └── icons/
│       ├── home.svg
│       ├── user.svg
│       ├── settings.svg
│       └── logo.svg
```

使用时对应：
- `local:home`
- `local:user`
- `local:settings`
- `local:logo`

#### SVG 图标要求

1. SVG 文件应该只包含一个根 `<svg>` 元素
2. 推荐包含 viewBox 属性以便正确缩放
3. 避免使用内联样式，推荐使用 CSS 类

示例 SVG 文件：
```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
</svg>
```

## 高级使用

### 自定义图标大小和颜色

```tsx
// 不同大小
<Icon icon="mdi:home" size={16} />
<Icon icon="mdi:home" size="1em" />
<Icon icon="mdi:home" size="24px" />

// 不同颜色
<Icon icon="mdi:home" color="#ff4d4f" />
<Icon icon="mdi:home" color="rgb(24, 144, 255)" />
<Icon icon="mdi:home" color="rgba(40, 167, 69, 0.8)" />
```

### 样式定制

```tsx
// 使用 className
<Icon icon="mdi:home" className="custom-icon" />

// 使用 style
<Icon 
  icon="mdi:home" 
  style={{ 
    margin: '0 8px',
    transform: 'rotate(90deg)'
  }} 
/>
```

### 动态图标

```tsx
import { useState } from 'react';
import { Icon } from '@/components/icon';

function ToggleIcon() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Icon 
      icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer"
    />
  );
}
```

## 最佳实践

### 1. 图标选择建议

- **界面图标**：使用 Material Design Icons (mdi:*)
- **本地图标**：放置在 `src/assets/icons/` 目录下
- **第三方图标**：选择流行的图标库如 `mdi`、`fa`、`bx` 等

### 2. 性能优化

```tsx
// 推荐：在应用启动时注册一次本地图标
// main.tsx 或 App.tsx
import { registerLocalIcons } from '@/components/icon';

registerLocalIcons();

// 不推荐：在组件中重复注册
function MyComponent() {
  // ❌ 不要在组件中调用注册函数
  registerLocalIcons(); 
  // ...
}
```

### 3. 错误处理

```tsx
// 图标加载失败时的处理
import { Icon } from '@/components/icon';

function SafeIcon({ icon, fallback = "mdi:help" }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <Icon icon={fallback} />;
  }
  
  return (
    <Icon 
      icon={icon} 
      onError={() => setHasError(true)} 
    />
  );
}
```

### 4. 类型安全

```tsx
// 定义常用图标类型
type AppIconName = 
  | "local:logo"
  | "mdi:home"
  | "mdi:user"
  | "mdi:settings";

interface AppIconProps {
  icon: AppIconName;
  size?: string | number;
  color?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ icon, ...props }) => {
  return <Icon icon={icon} {...props} />;
};
```

## 常见问题

### 1. 本地图标不显示

确保：
- SVG 文件放置在 `src/assets/icons/` 目录下
- 已调用 `registerLocalIcons()` 函数
- 图标名称正确（不包含 .svg 扩展名）

### 2. 图标颜色无法更改

- 对于本地 SVG，确保使用 `currentColor` 或无固定颜色填充
- 检查 SVG 文件是否包含内联样式

### 3. 图标大小异常

- 确保 SVG 文件包含正确的 viewBox 属性
- 检查是否设置了固定宽高属性

## 支持的图标库

组件基于 Iconify，支持超过 100 个图标集，包括：

- Material Design Icons (`mdi:*`)
- Font Awesome (`fa:*`)
- Boxicons (`bx:*`)
- Ionicons (`ion:*`)
- And many more...

完整列表请参考 [Iconify 图标搜索](https://icon-sets.iconify.design/)