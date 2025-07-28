# useCopyToClipboard

复制文本到系统剪贴板的 React Hook。

## 📝 功能描述

`useCopyToClipboard` 提供了一个简单易用的接口来复制文本到用户的剪贴板。它包含以下特性：

- ✅ 自动检测浏览器剪贴板 API 支持
- ✅ 复制成功时显示成功提示
- ✅ 复制失败时显示警告信息
- ✅ 跟踪最后一次成功复制的内容
- ✅ TypeScript 类型安全

## 🔧 API 文档

### 返回值

```typescript
interface ReturnType {
  copyFn: (text: string) => Promise<boolean>;
  copiedText: string | null;
}
```

| 属性 | 类型 | 描述 |
|------|------|------|
| `copyFn` | `(text: string) => Promise<boolean>` | 复制函数，返回复制是否成功 |
| `copiedText` | `string \| null` | 最后一次成功复制的文本内容 |

### 类型定义

```typescript
type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;
```

## 📚 使用示例

### 基础用法

```tsx
import React from 'react';
import { useCopyToClipboard } from '@/hooks';

function CopyButton() {
  const { copyFn, copiedText } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copyFn('Hello World!');
    if (success) {
      console.log('复制成功:', copiedText);
    }
  };

  return (
    <button onClick={handleCopy}>
      复制文本
    </button>
  );
}
```

### 复制动态内容

```tsx
import React, { useState } from 'react';
import { useCopyToClipboard } from '@/hooks';

function DynamicCopyExample() {
  const [inputText, setInputText] = useState('');
  const { copyFn, copiedText } = useCopyToClipboard();

  const handleCopy = () => {
    copyFn(inputText);
  };

  return (
    <div>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="输入要复制的文本"
      />
      <button onClick={handleCopy} disabled={!inputText}>
        复制
      </button>
      {copiedText && (
        <p>已复制: {copiedText}</p>
      )}
    </div>
  );
}
```
