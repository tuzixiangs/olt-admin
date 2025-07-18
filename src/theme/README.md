# 🤷‍♂️ 系统主题指南

本文档全面概述了项目的主题系统。该系统基于 [vanilla-extract](https://vanilla-extract.style/) 构建，旨在创建一个类型安全、高度灵活且易于维护的主题解决方案。其核心思想是使用 CSS 变量进行主题化，从而支持动态变更（如亮/暗模式切换）而不会产生运行时开销。

## 📂 文件夹与文件结构

以下是 `src/theme` 目录中文件和文件夹的详细说明：

-   **`adapter/`**: 此目录包含第三方 UI 库的适配器。目的是使其组件样式与我们项目的设计系统保持一致。
    -   `antd.adapter.tsx`: Ant Design 库的适配器。它使用 Ant Design 的 `ConfigProvider` 包裹子组件，并将我们的设计令牌映射到 Ant Design 的主题配置中。

-   **`hooks/`**: 包含与主题相关的自定义 React 钩子。
    -   `use-theme.ts`: 提供 `useTheme` 钩子，允许组件访问当前的主题模式、作为 JavaScript 对象的主题令牌，以及一个用于更改主题模式的函数。

-   **`tokens/`**: 这是我们设计系统的核心，定义了所有基本的设计值。
    -   `base.ts`: 定义不受主题模式影响的基础令牌，例如 `spacing` (间距)、`borderRadius` (圆角) 和 `zIndex` (层级)。
    -   `breakpoints.ts`: 定义响应式设计的断点 (例如 `sm`, `md`, `lg`)。
    -   `color.ts`: 定义调色板。它包含多种预设颜色，并为亮色 (`lightColorTokens`) 和暗色 (`darkColorTokens`) 模式分别指定了不同的颜色集。
    -   `shadow.ts`: 定义阴影样式，同样为亮色和暗色模式提供了不同的集合。
    -   `typography.ts`: 定义所有与排版相关的令牌，如 `fontFamily` (字体族)、`fontSize` (字号) 和 `fontWeight` (字重)。

-   **`theme-provider.tsx`**: 此文件导出主要的 `ThemeProvider` 组件。它应该包裹整个应用程序。它从全局状态 (`settingStore`) 读取当前的主题设置，并将相应的 `data-` 属性应用于 `<html>` 元素，以启用正确的 CSS 变量。

-   **`theme.css.ts`**: 这是 `vanilla-extract` 发挥其魔力的地方。
    -   它使用 `createThemeContract` 创建一个“主题契约” (`themeVars`)，作为我们主题变量的蓝图。
    -   然后，它使用 `createGlobalTheme` 根据 `<html>` 标签上的 `data-theme-mode` 和 `data-color-palette` 属性，为 `:root` 元素生成并应用实际的 CSS 变量。

-   **`type.ts`**: 包含与主题系统相关的所有 TypeScript 类型定义，确保了整个系统的类型安全。

## 🎨 设计令牌与变量

我们的主题系统以 CSS 变量的形式提供了一套丰富的设计令牌，这些变量被组织成一个契约 (`themeVars`)。您应该始终使用这些变量，而不是硬编码的值。

### 如何访问令牌

1.  **在 `.css.ts` 文件中 (推荐)**: 从 `../theme.css.ts` 导入 `themeVars` 并在您的样式中使用它们。
    ```typescript
    import { style } from '@vanilla-extract/css';
    import { themeVars } from '../theme.css';

    export const myComponentStyle = style({
      backgroundColor: themeVars.colors.background.paper,
      color: themeVars.colors.text.primary,
      padding: themeVars.spacing[4],
      borderRadius: themeVars.borderRadius.md,
    });
    ```
2.  **在组件文件中 (用于逻辑)**: 使用 `useTheme` 钩子。
    ```typescript
    import { useTheme } from '@/theme';

    function MyComponent() {
      const { themeTokens } = useTheme();
      // 如果 JS 逻辑需要，可以直接访问令牌值
      console.log(themeTokens.color.palette.primary.default);
      return <div />;
    }
    ```

### 可用令牌 (`themeVars`)

-   **颜色 (`themeVars.colors`)**:
    -   `palette`: 包含 primary, success, warning, error, info 和 gray 调色板。每种颜色都有 `lighter`, `light`, `default`, `dark`, `darker` 等变体。
    -   `common`: 基础颜色，如 `white` 和 `black`。
    -   `text`: 语义化的文本颜色，如 `primary`, `secondary`, `disabled`。
    -   `background`: 语义化的背景颜色，如 `default` (用于页面主体), `paper` (用于卡片类元素), `neutral` (用于细微的背景)。
-   **排版 (`themeVars.typography`)**:
    -   `fontFamily`: 字体族，如 `openSans` 和 `inter`。
    -   `fontSize`: 从 `xs` 到 `xl` 的字号。
    -   `fontWeight`: 字重，如 `light`, `normal`, `bold`。
    -   `lineHeight`: 文本的行高。
-   **间距 (`themeVars.spacing`)**: 从 `0` 到 `32` 的间距单位。用于 `margin`, `padding`, `gap` 等。
-   **圆角 (`themeVars.borderRadius`)**: 从 `none` 到 `full` 的预定义圆角值。
-   **阴影 (`themeVars.shadows`)**: 一系列的海拔阴影 (`sm`, `md`, `lg` 等) 以及特定的阴影，如 `card` 和 `dialog`。
-   **层级 (`themeVars.zIndex`)**: 为常用元素（如 `appBar`, `drawer`, `modal`）预定义的 z-index 值。
-   **屏幕 (`themeVars.screens`)**: 用于响应式设计的媒体查询断点。

## 🚀 如何使用

### 1. 应用程序设置

在 `src/App.tsx` 中的整个应用程序都被 `ThemeProvider` 包裹。这已经配置好了，并会自动处理主题的应用。

```tsx
// src/App.tsx
// ...
import { ThemeProvider } from '@/theme';
import { AntdAdapter } from '@/theme/adapter/antd.adapter';

function App() {
  return (
    <ThemeProvider adapters={[AntdAdapter]}>
      {/* ... 应用的其余部分 */}
    </ThemeProvider>
  );
}
```

### 2. 组件样式

在创建新组件时，最佳实践是使用 `vanilla-extract` 将样式放在一个共置的 `.css.ts` 文件中。

**示例：** 一个自定义卡片组件。

`src/components/custom-card/styles.css.ts`:
```typescript
import { style } from '@vanilla-extract/css';
import { themeVars } from '@/theme/theme.css';

export const card = style({
  padding: themeVars.spacing[4],
  backgroundColor: themeVars.colors.background.paper,
  color: themeVars.colors.text.primary,
  borderRadius: themeVars.borderRadius.lg,
  boxShadow: themeVars.shadows.card,
});

export const title = style({
  fontSize: themeVars.typography.fontSize.lg,
  fontWeight: themeVars.typography.fontWeight.bold,
  color: themeVars.colors.text.primary,
});
```

`src/components/custom-card/index.tsx`:
```typescript
import * as styles from './styles.css';

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
}

export function CustomCard({ title, children }: CustomCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

## 🤝 与其他样式技术集成

### Tailwind CSS

本项目已将主题系统与 Tailwind CSS 深度集成。`tailwind.config.ts` 文件将我们的设计令牌（颜色、间距、圆角等）映射为了 Tailwind 的工具类。

这意味着您可以直接在组件中使用原子化的工具类，并且它们的样式会根据当前主题（亮色、暗色、不同主题色）自动更新。因此，**推荐优先使用 Tailwind CSS 工具类**进行快速、一致的样式开发。

**使用示例:**
```tsx
function MyStyledComponent() {
  return (
    // bg-primary 会根据当前主题自动变化
    // text-text-primary 也会自动从深色变为浅色
    // rounded-lg 和 shadow-card 使用的也是我们定义的令牌值
    <div className="bg-primary text-text-primary p-4 rounded-lg shadow-card">
      Hello Tailwind with dynamic themes!
    </div>
  );
}
```

### 在纯 CSS/SCSS 文件中使用

由于 `vanilla-extract` 最终生成的是标准的 CSS 自定义属性（CSS Variables），因此您也可以在传统的 `.css` 或 `.scss` 文件中直接使用这些主题变量。

变量的名称遵循其在 `themeVars` 对象中的路径，并用 `-` 连接。

- `themeVars.colors.background.paper` → `var(--colors-background-paper)`
- `themeVars.spacing[4]` → `var(--spacing-4)`

**使用示例 (.scss):**
```scss
.my-custom-component {
  background-color: var(--colors-background-paper);
  color: var(--colors-text-primary);
  padding: var(--spacing-4);
}
```

> **注意**：直接在 CSS/SCSS 中使用变量会失去 `vanilla-extract` 提供的类型安全保障。如果变量名拼写错误，编译时不会收到任何提示。因此，此方法仅推荐用于无法使用 Tailwind 或 `vanilla-extract` 的特殊场景。

## ✅ 亮/暗模式最佳实践

为确保您的组件在所有主题（亮色、暗色和不同的颜色预设）下都能无缝工作，请遵循以下准则：

1.  **始终使用主题变量**: 绝不硬编码颜色、间距或字体值。始终使用来自 `theme.css.ts` 的 `themeVars`。
    
    ```diff
    - color: '#000000',
    - backgroundColor: 'white',
    + color: themeVars.colors.text.primary,
    - backgroundColor: themeVars.colors.background.paper,
    ```