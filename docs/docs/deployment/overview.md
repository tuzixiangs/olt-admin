# 部署指南

本指南将帮助您将 OLT Admin 项目部署到各种环境中。

## 构建准备

### 环境要求
- Node.js >= 20.0.0
- pnpm >= 10.0.0

### 构建项目

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm type-check

# 代码检查和格式化
pnpm lint:fix
pnpm format

# 构建生产版本
pnpm build
```

构建完成后，生产文件将位于 `dist/` 目录中。

## 部署选项

### 1. Vercel 部署（推荐）

Vercel 是部署 React 应用的最佳选择之一，支持自动部署和优化。

#### 自动部署
1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. Vercel 会自动检测 Vite 配置并部署

#### 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

#### Vercel 配置文件
创建 `vercel.json`：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify 部署

#### 自动部署
1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令：`pnpm build`
3. 设置发布目录：`dist`

#### 手动部署
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 部署
netlify deploy --prod --dir=dist
```

#### Netlify 配置文件
创建 `netlify.toml`：

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages 部署

#### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 10
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. Docker 部署

#### Dockerfile
```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### 构建和运行
```bash
# 构建镜像
docker build -t olt-admin .

# 运行容器
docker run -p 80:80 olt-admin
```

### 5. 传统服务器部署

#### Apache 配置
创建 `.htaccess` 文件：

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/olt-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 环境变量配置

### 生产环境变量
创建 `.env.production`：

```bash
# API 基础 URL
VITE_API_BASE_URL=https://api.yourdomain.com

# 应用标题
VITE_APP_TITLE=OLT Admin

# 是否启用分析
VITE_ENABLE_ANALYTICS=true

# 其他配置
VITE_ENABLE_MOCK=false
```

## 性能优化

### 1. 代码分割
项目已配置自动代码分割，无需额外配置。

### 2. 资源压缩
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          utils: ['lodash-es', 'dayjs']
        }
      }
    }
  }
});
```

### 3. CDN 配置
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

## 监控和分析

### 1. Vercel Analytics
```typescript
// main.tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.render(
  <App />
  <Analytics />
);
```

### 2. 错误监控
推荐使用 Sentry 进行错误监控：

```bash
pnpm add @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
});
```

## 故障排除

### 常见问题

1. **路由 404 错误**
   - 确保服务器配置了 SPA 回退规则

2. **环境变量未生效**
   - 检查变量名是否以 `VITE_` 开头
   - 确认 `.env` 文件位置正确

3. **构建失败**
   - 检查 Node.js 版本是否符合要求
   - 清除缓存：`pnpm store prune`

4. **静态资源 404**
   - 检查 `base` 配置是否正确
   - 确认资源路径配置

## 下一步

- [了解监控配置](./monitoring)
- [查看性能优化指南](./performance)
- [学习安全最佳实践](./security)