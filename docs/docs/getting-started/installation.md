# 安装指南

本指南将帮助您快速搭建 OLT Admin 的开发环境。

## 环境要求

在开始之前，请确保您的开发环境满足以下要求：

### Node.js 版本

- **Node.js**: >= 20.*
- **推荐版本**: Node.js 20.x LTS

您可以通过以下命令检查当前 Node.js 版本：

```bash
node --version
```

### 包管理器

项目使用 **pnpm** 作为包管理器，它提供了更快的安装速度和更好的磁盘空间利用率。

### pnpm 版本

- **pnpm**: >= 10.*

#### 安装 pnpm

如果您还没有安装 pnpm，可以通过以下方式安装：

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用 Chocolatey (Windows)
choco install pnpm
```

验证 pnpm 安装：

```bash
pnpm --version
```

## 项目安装

### 1. 克隆项目

```bash
git clone <repository-url>
cd olt-admin
```

### 2. 安装依赖

使用 pnpm 安装项目依赖：

```bash
pnpm install
```

:::tip 为什么使用 pnpm？

- **更快的安装速度**: 并行安装和链接优化
- **节省磁盘空间**: 全局存储，避免重复下载
- **严格的依赖管理**: 避免幽灵依赖问题
- **Monorepo 支持**: 原生支持 workspace
:::

### 3. 环境配置

项目提供了多个环境配置文件：

```
.env                 # 基础环境变量
.env.development     # 开发环境配置
.env.production      # 生产环境配置
```

您可以根据需要修改这些配置文件。

### 4. 启动开发服务器

```bash
pnpm dev
```

启动成功后，您可以在浏览器中访问：

- **主应用**: [http://localhost:3001](http://localhost:3001)
- **文档站点**: [http://localhost:3000](http://localhost:3000) (如果启动了文档服务)

## 验证安装

### 检查项目是否正常运行

1. 访问 [http://localhost:3001](http://localhost:3001)
2. 您应该能看到登录页面
3. 使用默认账号登录（如果有的话）

### 检查开发工具

项目集成了多个开发工具，您可以通过以下命令验证：

```bash
# 代码格式化和检查
pnpm lint

# 类型检查
pnpm type-check

# 构建项目
pnpm build
```

## 常见问题

### Node.js 版本不兼容

如果遇到 Node.js 版本问题，建议使用 Node.js 版本管理工具：

```bash
# 使用 volta(推荐)
volta install 20

# 或使用 nvm
nvm install 20
nvm use 20

# 或使用 fnm
fnm install 20
fnm use 20

```

### 为什么推荐 volta

[volta](https://volta.sh/) 不仅是一个 Node.js 版本管理工具，还可以管理 pnpm 包的版本, 以及更简单的版本管理和切换机制。使用 Volta，你可以一次性选择 Node 引擎和 pnpm 版本，然后无需再担心它。你可以在项目间切换，无需手动切换 Node 或 pnpm 版本。你可以在你的工具链中安装 npm 包二进制文件，无需定期重新安装或弄清楚它们为何停止工作。

### 依赖安装失败

如果 `pnpm install` 失败，可以尝试：

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### 端口冲突

如果默认端口被占用，您可以：

```bash
# 指定端口启动
pnpm dev --port 3001

# 或修改 vite.config.ts 中的端口配置
```

### 权限问题 (Windows)

在 Windows 系统上，如果遇到权限问题，可以：

1. 以管理员身份运行命令行
2. 或者配置 npm/pnpm 的全局安装目录

## 下一步

安装完成后，您可以：

1. 阅读 [快速开始](./quick-start) 了解基本使用
2. 查看 [项目结构](./project-structure) 了解代码组织
3. 探索 [架构设计](../architecture/feature-sliced-design) 了解设计理念

## 开发工具推荐

为了获得更好的开发体验，推荐安装以下 VS Code 扩展：

- **TypeScript Importer**: 自动导入 TypeScript 类型
- **Tailwind CSS IntelliSense**: Tailwind CSS 智能提示
- **vscode-styled-components**: Styled Components 支持
- **i18n Ally**: 国际化支持
- **Iconify IntelliSense**: 图标智能提示
- **Biome**: Biome 代码检查工具
- **ES7+ React/Redux/React-Native snippets**: React 代码片段
- **Auto Rename Tag**: 自动重命名标签
- **Bracket Pair Colorizer**: 括号配对着色
- **GitLens**: Git 增强工具

### 性能优化工具

- **React Scan**: React 性能检测工具，可自动检测和突出显示导致性能问题的渲染组件，无需更改代码即可使用。安装方式：
  ```bash
  # 使用 npm
  npm i react-scan
  
  # 或使用 pnpm
  pnpm add react-scan
  
  # 或使用 yarn
  yarn add react-scan
  ```
  
  使用方式（在你的应用入口文件中添加）：
  ```javascript
  import { scan } from 'react-scan';
  
  // 在开发环境中启动扫描
  if (process.env.NODE_ENV === 'development') {
    scan();
  }
  ```
  
  也可通过 CLI 方式使用：
  ```bash
  # 扫描本地运行的应用
  npx react-scan localhost:3000
  
  # 扫描任意网站
  npx react-scan https://example.com
  ```

---

如果您在安装过程中遇到任何问题，请查看我们的 [常见问题](../troubleshooting) 或联系开发团队。