---
sidebar_position: 1
---

# React Scan

## 简介

React Scan 是一款专为 React 开发者设计的性能检测工具，致力于帮助开发者自动化检测并优化 React 应用的性能问题。与传统工具相比，React Scan 提供了更加直观和易用的方式来识别和解决 React 组件渲染性能问题。

### 主要特性

- **零代码侵入性**：无需更改现有代码即可使用
- **可视化高亮**：精确高亮显示需要优化的组件
- **直观的工具栏**：通过页面上的工具栏访问所有功能
- **多种使用方式**：支持脚本标签、npm 包、CLI 等多种使用方式

## 安装

### 通过包管理器安装

```bash
# 使用 npm
npm install react-scan

# 使用 pnpm
pnpm add react-scan

# 使用 yarn
yarn add react-scan

# 使用 bun
bun add react-scan
```

### 通过 CLI 使用

```bash
# 扫描本地运行的应用
npx react-scan localhost:3000

# 扫描任意网站
npx react-scan https://example.com
```

## 使用方法

### 在项目中集成

在你的应用入口文件（如 `main.tsx` 或 `index.tsx`）中添加以下代码：

```javascript
import { scan } from 'react-scan';

// 仅在开发环境中启用
if (process.env.NODE_ENV === 'development') {
  scan();
}
```

### CLI 方式使用

你也可以通过命令行直接扫描正在运行的应用：

```bash
# 扫描本地开发服务器
npx react-scan localhost:3000

# 扫描任意网站
npx react-scan https://react.dev
```

### 配合开发服务器使用

你可以在 `package.json` 中添加一个并行执行的脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "scan": "vite & npx react-scan@latest localhost:3000"
  }
}
```

## 核心功能

### 工具栏

React Scan 的所有功能都通过页面右下角的工具栏访问。你可以将工具栏拖拽到页面的任意角落。

### 渲染轮廓

默认情况下，React Scan 会在组件渲染时在组件上显示轮廓线，帮助你直观地看到哪些组件正在重新渲染。

### 组件渲染分析

通过点击工具栏最左侧的图标，然后点击你想检查的组件，可以查看该组件重新渲染的原因。工具会显示哪些 props、state 或 context 在上次渲染中发生了变化。

### 性能分析

React Scan 的性能分析器可以通过工具栏中的铃铛图标访问，是一个始终开启的分析器，会在出现 FPS 下降或慢速交互（点击、输入）时提醒你。

性能分析包含三个部分：

1. **Ranked（排名）**：显示组件渲染时间的排名
2. **Overview（概览）**：提供性能问题的高层次摘要
3. **Prompts（提示）**：生成可用于 LLM 的提示信息

## API 参考

### scan(options)

启动扫描的命令式 API。

```typescript
import { scan } from 'react-scan';

scan({
  // 启用/禁用扫描
  enabled: process.env.NODE_ENV === 'development',
  
  // 强制在生产环境中运行（不推荐）
  dangerouslyForceRunInProduction: false,
  
  // 将渲染信息记录到控制台
  log: false,
  
  // 显示工具栏
  showToolbar: true,
  
  // 动画速度
  animationSpeed: 'fast',
  
  // 跟踪不必要的渲染
  trackUnnecessaryRenders: false
});
```

### useScan(options)

启动扫描的 Hook API。

```typescript
import { useScan } from 'react-scan';

function App() {
  useScan({
    enabled: process.env.NODE_ENV === 'development'
  });
  
  return <div>My App</div>;
}
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| enabled | boolean | true | 启用/禁用扫描 |
| dangerouslyForceRunInProduction | boolean | false | 强制在生产环境中运行（不推荐） |
| log | boolean | false | 将渲染信息记录到控制台 |
| showToolbar | boolean | true | 显示工具栏 |
| animationSpeed | "slow" \| "fast" \| "off" | "fast" | 动画速度 |
| trackUnnecessaryRenders | boolean | false | 跟踪不必要的渲染 |

## 最佳实践

### 1. 仅在开发环境中启用

```javascript
import { scan } from 'react-scan';

if (process.env.NODE_ENV === 'development') {
  scan({
    log: true // 开发时可以开启日志
  });
}
```

### 2. 与现有开发流程集成

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "dev:scan": "concurrently \"vite\" \"npx react-scan@latest localhost:3000\""
  }
}
```

### 3. 针对特定场景配置

```javascript
import { scan } from 'react-scan';

scan({
  enabled: process.env.NODE_ENV === 'development',
  // 在复杂页面中关闭动画以获得更好的性能
  animationSpeed: 'off',
  // 跟踪不必要的渲染以进行深度分析
  trackUnnecessaryRenders: true
});
```

## 常见问题

### 1. 工具栏遮挡了页面元素怎么办？

你可以拖拽工具栏到页面的其他角落，或者将其隐藏到页面边缘。只需将工具栏拖拽到页面边缘，它就会自动收缩，需要时再拖出即可。

### 2. 如何在生产环境中使用？

虽然可以在生产环境中使用，但强烈不推荐，因为这可能会影响用户体验。如果确实需要，可以设置 `dangerouslyForceRunInProduction: true` 选项。

### 3. 扫描对性能有影响吗？

在开发环境中使用扫描对性能的影响很小，但在频繁重新渲染的应用中开启 `log` 选项可能会显著增加开销。

## 相关资源

- [GitHub 仓库](https://github.com/aidenybai/react-scan)
- [官方文档](https://react-scan.dev/)
- [Discord 社区](https://discord.gg/)

通过使用 React Scan，你可以更轻松地识别和解决 React 应用中的性能问题，提升用户体验。