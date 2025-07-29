# 动画组件库

基于 Framer Motion 的动画组件和工具集合，旨在提供易于使用的动画解决方案。

## 目录结构

```
animate/
├── motion-container.tsx    # 通用动画容器组件
├── motion-lazy.tsx         # 懒加载动画组件
├── motion-viewport.tsx     # 视口动画组件
├── types.ts               # 类型定义
├── variants/              # 动画变体
└── scroll-progress/       # 滚动进度组件
```

## 组件文档

### MotionContainer 动画容器

一个通用的动画容器组件，用于包装内容并应用动画效果。

```tsx
import MotionContainer from '@/components/animate/motion-container';

// 使用示例
<MotionContainer>
  <YourComponent />
</MotionContainer>
```

功能特性：
- 自动应用初始、动画和退出状态
- 支持自定义 className 样式
- 使用 variants 系统实现动画
- 向子组件继承动画属性
- 在整个应用中提供一致的动画行为

Props 参数：
- `children`: 需要动画的 React 节点
- `className`: 可选的 CSS 类名
- `...MotionProps`: 支持所有 Framer Motion 属性

#### 带子元素动画的 MotionContainer

```tsx
import MotionContainer from '@/components/animate/motion-container';
import { m } from 'motion/react';
import { varFade } from '@/components/animate/variants';

// 使用交错子元素动画
<MotionContainer>
  <m.div variants={varFade().inUp}>
    <h1>第一个项目</h1>
  </m.div>
  <m.div variants={varFade().inUp}>
    <p>第二个项目</p>
  </m.div>
  <m.div variants={varFade().inUp}>
    <button>操作按钮</button>
  </m.div>
</MotionContainer>
```

### MotionLazy 懒加载动画

用于懒加载动画特性的组件，以减少包大小。

```tsx
import { MotionLazy } from '@/components/animate/motion-lazy';

// 使用示例
<MotionLazy>
  <YourComponent />
</MotionLazy>
```

功能特性：
- 按需动态加载动画特性
- 减少初始包大小
- 支持严格模式以获得更好的开发体验
- 将内容包装在全高度容器中
- 使用 domMax 特性以获得最佳性能

Props 参数：
- `children`: 需要包装在懒加载上下文中的 React 节点

### MotionViewport 视口动画

用于实现滚动触发动画的组件。

```tsx
import MotionViewport from '@/components/animate/motion-viewport';

// 使用示例
<MotionViewport>
  <YourComponent />
</MotionViewport>
```

功能特性：
- 当元素进入视口时触发动画
- 可配置的触发阈值（默认：0.3）
- 支持一次性动画触发
- 从容器继承动画变体
- 针对滚动性能进行优化

Props 参数：
- `children`: 需要动画的 React 节点
- `className`: 可选的 CSS 类名
- `viewport`: 视口配置对象
  - `once`: 布尔值，决定动画是否只触发一次
  - `amount`: 数字（0-1），触发阈值
- `...MotionProps`: 支持所有 Framer Motion 属性

#### 自定义配置的 MotionViewport

```tsx
import MotionViewport from '@/components/animate/motion-viewport';
import { m } from 'motion/react';
import { varFade } from '@/components/animate/variants';

// 使用自定义视口配置
<MotionViewport
  viewport={{ once: true, amount: 0.8 }}
  transition={{ duration: 0.5 }}
>
  <m.div variants={varFade().inUp}>
    <h2>当80%进入视口时将执行动画</h2>
  </m.div>
</MotionViewport>
```

## 动画变体

`variants` 目录包含了可与这些组件一起使用的预定义动画变体。这些变体在整个应用中提供一致的动画模式。

### 可用的动画类型

1. **Fade 淡入淡出**: 简单的透明度过渡
   - fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight
   - fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight

2. **Slide 滑动**: 位置过渡
   - slideInUp, slideInDown, slideInLeft, slideInRight
   - slideOutUp, slideOutDown, slideOutLeft, slideOutRight

3. **Zoom 缩放**: 带移动的缩放过渡
   - zoomIn, zoomInUp, zoomInDown, zoomInLeft, zoomInRight
   - zoomOut, zoomOutUp, zoomOutDown, zoomOutLeft, zoomOutRight

4. **Bounce 弹跳**: 弹性弹跳效果
   - bounceIn, bounceInUp, bounceInDown, bounceInLeft, bounceInRight
   - bounceOut, bounceOutUp, bounceOutDown, bounceOutLeft, bounceOutRight

5. **Flip 翻转**: 3D 翻转旋转
   - flipInX, flipInY
   - flipOutX, flipOutY

6. **Scale 缩放**: 简单的缩放效果
   - scaleInX, scaleInY
   - scaleOutX, scaleOutY

7. **Rotate 旋转**: 旋转效果
   - rotateIn, rotateOut

8. **Background 背景**: 背景动画
   - kenburnsTop, kenburnsBottom, kenburnsLeft, kenburnsRight
   - panTop, panBottom, panLeft, panRight
   - color2x, color3x, color4x, color5x

### 使用动画变体

```tsx
import { varFade, varSlide, varZoom } from '@/components/animate/variants';
import { m } from 'motion/react';

// 使用淡入淡出变体
<m.div variants={varFade().inUp}>
  <p>从底部淡入</p>
</m.div>

// 使用滑动变体
<m.div variants={varSlide().inLeft}>
  <h3>从左侧滑入</h3>
</m.div>

// 使用缩放变体
<m.div variants={varZoom().in}>
  <div>放大进入</div>
</m.div>
```

### 自定义动画变体

```tsx
import { varFade } from '@/components/animate/variants';

// 自定义变体属性
const customFadeInUp = varFade({ durationIn: 0.8, distance: 200 }).inUp;
const slowFadeIn = varFade({ durationIn: 2 }).in;

<m.div variants={customFadeInUp}>
  <p>自定义淡入动画</p>
</m.div>
```

## 滚动进度组件

### ScrollProgress 滚动进度条

根据滚动位置显示进度条的组件。

```tsx
import { ScrollProgress } from '@/components/animate/scroll-progress/scroll-progress';
import { useScrollProgress } from '@/components/animate/scroll-progress/use-scroll-progress';

// 基本用法
const { scrollYProgress } = useScrollProgress();

<ScrollProgress scrollYProgress={scrollYProgress} />
```

Props 参数：
- `scrollYProgress`: MotionValue: number - 必需的滚动进度值
- `height`: number - 进度条高度（像素，默认值：4）
- `color`: string - 进度条颜色（默认值：主题主色）

### useScrollProgress 钩子

提供滚动进度值的自定义钩子。

```tsx
import { useScrollProgress } from '@/components/animate/scroll-progress/use-scroll-progress';

// 用于文档滚动跟踪
const { scrollYProgress } = useScrollProgress();

// 用于容器滚动跟踪
const { scrollYProgress, elementRef } = useScrollProgress('container');

<div ref={elementRef}>
  <p>可滚动内容</p>
</div>
```

### 完整的滚动进度示例

```tsx
import { m } from 'motion/react';
import { ScrollProgress } from '@/components/animate/scroll-progress/scroll-progress';
import { useScrollProgress } from '@/components/animate/scroll-progress/use-scroll-progress';
import { varFade } from '@/components/animate/variants';

export default function ScrollExample() {
  const { scrollYProgress } = useScrollProgress();
  
  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} height={6} />
      
      <m.div
        variants={varFade().inUp}
        whileInView="animate"
        initial="initial"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1>滚动到此处时内容淡入</h1>
      </m.div>
    </>
  );
}
```

## 高级使用示例

### 组合多个动画组件

```tsx
import MotionContainer from '@/components/animate/motion-container';
import MotionViewport from '@/components/animate/motion-viewport';
import { m } from 'motion/react';
import { varFade, varSlide } from '@/components/animate/variants';

export default function ComplexAnimation() {
  return (
    <MotionContainer>
      <MotionViewport>
        <m.div variants={varFade().inUp}>
          <h1>带动画的标题</h1>
        </m.div>
        <m.div variants={varSlide().inUp}>
          <p>带动画的描述</p>
        </m.div>
      </MotionViewport>
    </MotionContainer>
  );
}
```

### 创建交错动画

```tsx
import MotionContainer from '@/components/animate/motion-container';
import { m } from 'motion/react';
import { varFade } from '@/components/animate/variants';

export default function StaggeredList() {
  const items = ['项目 1', '项目 2', '项目 3', '项目 4'];
  
  return (
    <MotionContainer>
      {items.map((item, index) => (
        <m.div key={index} variants={varFade().inUp}>
          <div>{item}</div>
        </m.div>
      ))}
    </MotionContainer>
  );
}
```