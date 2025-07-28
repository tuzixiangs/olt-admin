# Loading 加载组件

一套完整的加载组件库，包含线性加载、圆形加载和路由加载进度条，用于在应用中显示各种加载状态。

## 目录结构

```
loading/
├── circular-loading.tsx    # 圆形加载组件（TODO：待完成）
├── line-loading.tsx        # 线性加载组件
├── route-loading.tsx       # 路由加载进度条组件
├── line-loading.css        # 线性加载样式
├── styles.ts               # 圆形加载样式
└── index.tsx               # 导出文件
```

## 组件说明

### LineLoading 线性加载组件

显示一个水平线性加载动画，常用于页面整体加载状态。

#### 使用示例

```tsx
import { LineLoading } from '@/components/loading';

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <LineLoading />
      ) : (
        <div>页面内容</div>
      )}
    </>
  );
}
```

#### 特点

- 响应式设计，占满全屏
- 根据主题模式（亮色/暗色）自动调整颜色
- 使用 CSS 动画实现流畅的加载效果
- 适用于页面级加载状态

### CircularLoading 圆形加载组件

显示一个旋转的圆形加载动画，适用于局部加载状态。

#### Props 参数

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| size | number | 30 | 加载图标大小（像素） |
| color | string | "#1976d2" | 加载图标颜色 |
| className | string | "" | 自定义 CSS 类名 |

#### 使用示例

```tsx
import { CircularLoading } from '@/components/loading';

// 基础使用
<CircularLoading />

// 自定义大小和颜色
<CircularLoading size={40} color="#ff4d4f" />

// 在按钮中使用
<Button disabled>
  <CircularLoading size={16} className="mr-2" />
  加载中...
</Button>

// 在卡片中使用
<Card>
  <CardContent>
    {loading ? (
      <div className="flex justify-center items-center h-32">
        <CircularLoading />
      </div>
    ) : (
      <div>内容</div>
    )}
  </CardContent>
</Card>
```

#### 特点

- 可自定义大小和颜色
- 轻量级组件，适合局部加载
- 使用 styled-components 实现样式
- 支持内联使用和容器包装

### RouteLoadingProgress 路由加载进度条

显示页面路由切换时的加载进度条，提升用户体验。

#### 使用示例

```tsx
import { RouteLoadingProgress } from '@/components/loading';

function App() {
  return (
    <div>
      {/* 在应用根组件中使用 */}
      <RouteLoadingProgress />
      
      {/* 其他应用内容 */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
```

#### 特点

- 自动监听路由变化
- 平滑的进度条动画
- 支持浏览器前进后退操作
- 固定在页面顶部显示
- 使用 Progress 组件实现

## 样式说明

### 线性加载样式 (line-loading.css)

```css
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-loading {
  animation: loading 1.5s ease-in-out infinite;
}
```

### 圆形加载样式 (styles.ts)

使用 styled-components 定义了旋转动画和样式：

```tsx
const CircularLoadingStyled = styled.div<CircularLoadingStyledProps>`
  @keyframes spinLoading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .circular-loading {
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    border-radius: 50%;
    border: 3px solid transparent;
    border-top: 3px solid ${({ color }) => color};
    animation: spinLoading 1s linear infinite;
  }
`;
```

## 高级使用

### 组合使用多种加载状态

```tsx
import { LineLoading, CircularLoading, RouteLoadingProgress } from '@/components/loading';

function ComplexPage() {
  const [pageLoading, setPageLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  return (
    <div>
      {/* 路由加载进度条 */}
      <RouteLoadingProgress />
      
      {pageLoading ? (
        /* 页面级加载 */
        <LineLoading />
      ) : (
        <div>
          <h1>页面标题</h1>
          
          {dataLoading ? (
            /* 数据加载状态 */
            <div className="flex justify-center my-4">
              <CircularLoading />
            </div>
          ) : (
            <div>数据内容</div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 自定义加载组件

```tsx
import { LineLoading } from '@/components/loading';

// 自定义线性加载组件
function CustomLineLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LineLoading />
      <p className="mt-4 text-gray-500">正在加载，请稍候...</p>
    </div>
  );
}

// 自定义圆形加载组件
function CustomCircularLoading({ text = "加载中..." }) {
  return (
    <div className="flex flex-col items-center">
      <CircularLoading size={24} />
      <span className="mt-2 text-sm text-gray-500">{text}</span>
    </div>
  );
}
```

## 最佳实践

### 1. 选择合适的加载组件

- **页面级加载**：使用 LineLoading
- **局部加载**：使用 CircularLoading
- **路由切换**：使用 RouteLoadingProgress

### 2. 性能优化

```tsx
// 在应用根组件中只引入一次 RouteLoadingProgress
function App() {
  return (
    <div>
      <RouteLoadingProgress />
      {/* 其他组件 */}
    </div>
  );
}

// 避免在多个组件中重复引入
```

### 3. 用户体验优化

```tsx
// 添加加载文本提升用户体验
function LoadingWithText() {
  return (
    <div className="flex flex-col items-center">
      <CircularLoading />
      <p className="mt-2 text-sm text-gray-500">正在加载数据...</p>
    </div>
  );
}
```

### 4. 响应式设计

```tsx
// 确保加载组件在不同屏幕尺寸下表现良好
function ResponsiveLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <CircularLoading />
    </div>
  );
}
```

### 5. 主题适配

```tsx
// LineLoading 组件已自动适配主题
// CircularLoading 可以通过 props 自定义颜色
function ThemedCircularLoading() {
  const { themeMode } = useSettings();
  
  return (
    <CircularLoading 
      color={themeMode === 'dark' ? '#ffffff' : '#000000'} 
    />
  );
}
```

## 常见问题

### 1. 加载动画卡顿

确保：
- 使用 CSS 动画而非 JavaScript 动画
- 避免在加载过程中执行重计算样式操作
- 在生产环境中构建优化

### 2. 颜色不匹配主题

- LineLoading 组件已自动适配主题
- CircularLoading 需要手动设置颜色或通过状态管理获取主题色

### 3. 路由加载进度条不显示

确保：
- RouteLoadingProgress 组件放置在应用根组件中
- 页面确实发生了路由跳转
- 没有阻止 DOM 变化的操作

## 使用建议

1. **统一加载体验**：在整个应用中保持一致的加载状态样式
2. **合理使用**：避免过度使用加载动画，影响用户体验
3. **提供反馈**：在长时间加载时提供进度反馈或取消选项
4. **测试兼容性**：在不同设备和浏览器中测试加载效果