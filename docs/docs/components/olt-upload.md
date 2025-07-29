# OltUpload 组件

图片上传组件，基于 Ant Design 的 Upload 组件进行封装，提供了更加符合项目需求的图片上传和预览功能。

## 功能特性

- 🖼️ **图片上传**: 专门针对图片上传场景进行优化
- 👁️ **图片预览**: 内置图片预览功能
- 📏 **尺寸限制**: 支持文件大小和格式限制
- 🎨 **自定义样式**: 使用项目统一的设计风格
- 🧩 **类型安全**: 完整的 TypeScript 类型支持
- 🌍 **国际化**: 支持多语言提示

## 基础用法

```tsx
import { OltImageUpload } from '@/components/olt-upload';

// 基础使用
<OltImageUpload 
  fileList={fileList}
  onChange={handleChange}
/>

// 限制上传数量和文件大小
<OltImageUpload 
  fileList={fileList}
  onChange={handleChange}
  maxCount={5}
  maxSize={10} // 10MB
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| maxCount | `number` | `9` | 最大上传数量 |
| maxSize | `number` | `5` | 最大文件大小（MB） |
| preview | `boolean` | `false` | 是否为预览模式（只读） |
| onRemove | `(file: UploadFile) => void` | - | 删除文件时的回调 |
| fileList | `UploadFile[]` | - | 已上传的文件列表 |
| onChange | `(info: UploadChangeParam<UploadFile>) => void` | - | 上传状态改变时的回调 |
| accept | `string` | `"image/jpeg,image/png,image/webp"` | 接受的文件类型 |
| ...其他 | `UploadProps` | - | Ant Design Upload 组件的其他属性 |

## 使用示例

### 基础图片上传

```tsx
import { OltImageUpload } from '@/components/olt-upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

const MyComponent = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <OltImageUpload
      fileList={fileList}
      onChange={handleChange}
    />
  );
};
```

### 限制上传参数

```tsx
<OltImageUpload
  fileList={fileList}
  onChange={handleChange}
  maxCount={3}           // 最多上传3张图片
  maxSize={2}            // 单个文件最大2MB
  accept="image/png"     // 只接受PNG格式
/>
```

### 预览模式

```tsx
// 只读模式，隐藏删除按钮
<OltImageUpload
  fileList={fileList}
  preview={true}
/>
```

### 自定义上传处理

```tsx
<OltImageUpload
  fileList={fileList}
  onChange={handleChange}
  action="/api/custom-upload"  // 自定义上传地址
  headers={{ Authorization: 'Bearer token' }} // 自定义请求头
/>
```

## 功能说明

### 文件验证

组件会自动验证上传的文件：
- 文件类型：默认支持 JPEG、PNG、WebP 格式
- 文件大小：默认限制为 5MB

当文件不符合要求时，会显示相应的错误提示。

### 状态显示

组件会根据上传状态显示不同的界面：
- **上传中**：显示加载动画和进度
- **上传成功**：显示图片预览
- **上传失败**：显示错误提示

### 操作功能

- **预览**：点击眼睛图标可查看大图
- **删除**：点击删除图标可移除已上传的图片

在 `preview` 模式下，删除功能会被隐藏。
