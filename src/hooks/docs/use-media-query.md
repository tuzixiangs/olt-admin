# useMediaQuery

响应式媒体查询的 React Hook，用于检测屏幕尺寸、设备特性和用户偏好。

## 📝 功能描述

`useMediaQuery` 提供了一个强大而灵活的接口来处理各种媒体查询需求：

- ✅ 支持屏幕尺寸检测（宽度、高度）
- ✅ 支持设备方向检测
- ✅ 支持用户偏好检测（深色模式、减少动画等）
- ✅ 支持设备能力检测（触摸、高分辨率等）
- ✅ 内置断点辅助函数
- ✅ 服务端渲染友好
- ✅ TypeScript 类型安全

## 🔧 API 文档

### 基本用法

```typescript
const matches = useMediaQuery(config: MediaQueryConfig | string)
```

### 参数

#### MediaQueryConfig

```typescript
interface MediaQueryConfig {
  minWidth?: number;           // 最小宽度（px）
  maxWidth?: number;           // 最大宽度（px）
  minHeight?: number;          // 最小高度（px）
  maxHeight?: number;          // 最大高度（px）
  orientation?: 'portrait' | 'landscape';  // 设备方向
  prefersColorScheme?: 'dark' | 'light';   // 颜色主题偏好
  prefersReducedMotion?: boolean;          // 是否偏好减少动画
  devicePixelRatio?: number;               // 设备像素比
  pointerType?: 'coarse' | 'fine';        // 指针类型
}
```

### 返回值

| 类型 | 描述 |
|------|------|
| `boolean` | 媒体查询是否匹配当前环境 |

### 辅助函数

```typescript
// 断点辅助函数
const up = (key: BreakpointsKeys) => MediaQueryConfig;      // 大于等于指定断点
const down = (key: BreakpointsKeys) => MediaQueryConfig;    // 小于指定断点  
const between = (start: BreakpointsKeys, end: BreakpointsKeys) => MediaQueryConfig; // 在两个断点之间
```

## 📚 使用示例

### 基础响应式检测

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  return (
    <div>
      <h1>当前设备类型</h1>
      {isMobile && <p>📱 移动设备</p>}
      {isTablet && <p>📱 平板设备</p>}
      {isDesktop && <p>🖥️ 桌面设备</p>}
    </div>
  );
}
```

### 使用预定义断点

```tsx
import React from 'react';
import { useMediaQuery, up, down, between } from '@/hooks';

function BreakpointExample() {
  const isLargeScreen = useMediaQuery(up('lg'));      // >= lg 断点
  const isSmallScreen = useMediaQuery(down('sm'));    // < sm 断点
  const isTabletRange = useMediaQuery(between('sm', 'md')); // sm 到 md 之间

  return (
    <div>
      <p>大屏幕: {isLargeScreen ? '是' : '否'}</p>
      <p>小屏幕: {isSmallScreen ? '是' : '否'}</p>
      <p>平板范围: {isTabletRange ? '是' : '否'}</p>
    </div>
  );
}
```

### 设备方向检测

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function OrientationExample() {
  const isPortrait = useMediaQuery({ orientation: 'portrait' });
  const isLandscape = useMediaQuery({ orientation: 'landscape' });

  return (
    <div>
      <h2>设备方向</h2>
      {isPortrait && <p>📱 竖屏模式</p>}
      {isLandscape && <p>📱 横屏模式</p>}
      
      {/* 根据方向调整布局 */}
      <div className={isPortrait ? 'flex-col' : 'flex-row'}>
        <div>内容区域 1</div>
        <div>内容区域 2</div>
      </div>
    </div>
  );
}
```

### 用户偏好检测

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function UserPreferencesExample() {
  const prefersDark = useMediaQuery({ prefersColorScheme: 'dark' });
  const prefersReducedMotion = useMediaQuery({ prefersReducedMotion: true });

  return (
    <div className={prefersDark ? 'dark-theme' : 'light-theme'}>
      <h2>用户偏好</h2>
      <p>深色模式: {prefersDark ? '开启' : '关闭'}</p>
      <p>减少动画: {prefersReducedMotion ? '开启' : '关闭'}</p>
      
      {/* 根据偏好调整动画 */}
      <div 
        className={`transition-all ${
          prefersReducedMotion ? 'duration-0' : 'duration-300'
        }`}
      >
        动画元素
      </div>
    </div>
  );
}
```

### 设备能力检测

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function DeviceCapabilityExample() {
  const isTouchDevice = useMediaQuery({ pointerType: 'coarse' });
  const isHighDPI = useMediaQuery({ devicePixelRatio: 2 });

  return (
    <div>
      <h2>设备能力</h2>
      <p>触摸设备: {isTouchDevice ? '是' : '否'}</p>
      <p>高分辨率: {isHighDPI ? '是' : '否'}</p>
      
      {/* 根据设备能力调整交互 */}
      <button 
        className={isTouchDevice ? 'touch-friendly' : 'mouse-friendly'}
      >
        {isTouchDevice ? '触摸按钮' : '鼠标按钮'}
      </button>
    </div>
  );
}
```

### 复杂媒体查询

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function ComplexQueryExample() {
  // 平板横屏模式
  const isTabletLandscape = useMediaQuery({
    minWidth: 768,
    maxWidth: 1024,
    orientation: 'landscape'
  });

  // 高分辨率小屏设备
  const isHighDPISmall = useMediaQuery({
    maxWidth: 480,
    devicePixelRatio: 2
  });

  return (
    <div>
      {isTabletLandscape && (
        <div>平板横屏专用布局</div>
      )}
      
      {isHighDPISmall && (
        <div>高分辨率小屏优化</div>
      )}
    </div>
  );
}
```

### 原始媒体查询字符串

```tsx
import React from 'react';
import { useMediaQuery } from '@/hooks';

function RawQueryExample() {
  const isCustomQuery = useMediaQuery('(min-width: 600px) and (max-height: 800px)');
  const isPrintMode = useMediaQuery('print');

  return (
    <div>
      <p>自定义查询匹配: {isCustomQuery ? '是' : '否'}</p>
      {!isPrintMode && <p>这段文字不会在打印时显示</p>}
    </div>
  );
}
```

### 响应式导航菜单

```tsx
import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks';

function ResponsiveNavigation() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ['首页', '产品', '关于', '联系'];

  if (isMobile) {
    return (
      <nav>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰ 菜单
        </button>
        {isMenuOpen && (
          <ul className="mobile-menu">
            {menuItems.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </nav>
    );
  }

  return (
    <nav>
      <ul className="desktop-menu">
        {menuItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </nav>
  );
}
```

### 与其他 Hook 结合

```tsx
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks';

function AdaptiveDataDisplay() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 根据屏幕大小调整每页显示数量
  useEffect(() => {
    setItemsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  return (
    <div>
      <p>每页显示: {itemsPerPage} 项</p>
      {/* 数据列表组件 */}
    </div>
  );
}
```

## ⚠️ 注意事项

### 服务端渲染

- 在 SSR 环境中，初始值为 `false`
- 客户端激活后会更新为正确的值
- 可能会导致首次渲染不一致

### 性能考虑

- 每个 `useMediaQuery` 调用都会创建一个 `MediaQueryList` 监听器
- 避免在循环中使用
- 考虑将复杂查询提取为常量

### 浏览器兼容性

- 现代浏览器全面支持
- IE 需要 polyfill
- 移动端浏览器支持良好

## 🎯 最佳实践

### 1. 使用预定义断点

```tsx
// ✅ 推荐：使用预定义断点
const isMobile = useMediaQuery(down('md'));

// ❌ 不推荐：硬编码数值
const isMobile = useMediaQuery({ maxWidth: 768 });
```

### 2. 提取常用查询

```tsx
// ✅ 推荐：提取为常量
const MOBILE_QUERY = { maxWidth: 768 };
const DARK_MODE_QUERY = { prefersColorScheme: 'dark' };

function Component() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isDark = useMediaQuery(DARK_MODE_QUERY);
}
```

### 3. 避免过度使用

```tsx
// ❌ 不推荐：过多的媒体查询
function Component() {
  const isXS = useMediaQuery({ maxWidth: 480 });
  const isSM = useMediaQuery({ maxWidth: 768 });
  const isMD = useMediaQuery({ maxWidth: 1024 });
  const isLG = useMediaQuery({ maxWidth: 1200 });
  
  // 更好的方式是使用一个查询并计算状态
}
```