# 国际化 (i18n)

OLT Admin 内置了完整的国际化支持，基于 `react-i18next` 实现，支持中英文切换和动态语言检测。

## 🌍 支持的语言

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | `zh_CN` | ✅ 完整支持 |
| English | `en_US` | ✅ 完整支持 |

## 🚀 快速开始

### 基本使用

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('sys.nav.dashboard')}</h1>
      <p>{t('common.okText')}</p>
    </div>
  );
}
```

### 使用 useLocale Hook

```tsx
import { useLocale } from '@/locales/use-locale';

function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <select 
      value={locale} 
      onChange={(e) => setLocale(e.target.value)}
    >
      <option value="zh_CN">简体中文</option>
      <option value="en_US">English</option>
    </select>
  );
}
```

## 📁 文件结构

```
src/locales/
├── i18n.ts                    # i18n 配置文件
├── use-locale.ts              # 语言切换 Hook
└── lang/                      # 语言包目录
    ├── zh_CN/                 # 中文语言包
    │   ├── index.ts          # 导出文件
    │   ├── common.json       # 通用文本
    │   └── sys.json          # 系统文本
    └── en_US/                 # 英文语言包
        ├── index.ts          # 导出文件
        ├── common.json       # 通用文本
        └── sys.json          # 系统文本
```

## ⚙️ 配置说明

### i18n 初始化配置

<mcfile name="i18n.ts" path="src/locales/i18n.ts"></mcfile> 文件包含了完整的 i18n 配置：

```typescript
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)        // 自动检测用户语言
  .use(initReactI18next)        // React 集成
  .init({
    debug: false,               // 生产环境关闭调试
    lng: defaultLng,            // 默认语言
    fallbackLng: 'en_US',       // 回退语言
    interpolation: {
      escapeValue: false,       // React 已自动转义
    },
    resources: {
      en_US: { translation: en_US },
      zh_CN: { translation: zh_CN },
    },
  });
```

### 语言检测策略

系统按以下优先级检测语言：

1. **LocalStorage** - `i18nextLng` 键值
2. **浏览器语言** - `navigator.language`
3. **回退语言** - `en_US`

## 📝 添加新的翻译

### 1. 添加翻译键值

在对应的语言包文件中添加翻译：

```json
// src/locales/lang/zh_CN/common.json
{
  "common": {
    "okText": "确认",
    "cancelText": "取消",
    "newFeature": "新功能"  // 新增
  }
}
```

```json
// src/locales/lang/en_US/common.json
{
  "common": {
    "okText": "OK",
    "cancelText": "Cancel",
    "newFeature": "New Feature"  // 新增
  }
}
```

### 2. 在组件中使用

```tsx
function MyComponent() {
  const { t } = useTranslation();

  return (
    <button>{t('common.newFeature')}</button>
  );
}
```

### 3. 类型安全支持

为了获得更好的类型提示，可以使用 `$t` 函数：

```tsx
import { $t } from '@/locales/i18n';

// 这样可以获得 IDE 的自动补全
const key = $t('common.newFeature');
const text = t(key);
```

## 🎯 最佳实践

### 1. 翻译键命名规范

```typescript
// ✅ 推荐：使用层级结构
'sys.nav.dashboard'
'common.button.submit'
'form.validation.required'

// ❌ 避免：扁平结构
'dashboardTitle'
'submitButton'
'requiredField'
```

### 2. 翻译文件组织

```typescript
// ✅ 推荐：按功能模块分组
{
  "sys": {
    "nav": { /* 导航相关 */ },
    "auth": { /* 认证相关 */ },
    "api": { /* API 相关 */ }
  },
  "common": {
    "button": { /* 按钮文本 */ },
    "message": { /* 消息文本 */ }
  }
}

// ❌ 避免：所有翻译放在一起
{
  "dashboardTitle": "仪表板",
  "loginButton": "登录",
  "submitButton": "提交",
  // ...
}
```

### 3. 参数化翻译

```json
{
  "message": {
    "welcome": "欢迎 {{name}}，今天是 {{date}}"
  }
}
```

```tsx
function Welcome({ userName }: { userName: string }) {
  const { t } = useTranslation();

  return (
    <h1>
      {t('message.welcome', { 
        name: userName, 
        date: new Date().toLocaleDateString() 
      })}
    </h1>
  );
}
```

### 4. 复数形式处理

```json
{
  "item": {
    "count_one": "{{count}} 个项目",
    "count_other": "{{count}} 个项目"
  }
}
```

```tsx
function ItemCount({ count }: { count: number }) {
  const { t } = useTranslation();

  return <span>{t('item.count', { count })}</span>;
}
```

## 🔧 与 Ant Design 集成

项目已配置 Ant Design 的国际化支持：

```tsx
import { useLocale } from '@/locales/use-locale';

function App() {
  const { antdLocale } = useLocale();

  return (
    <ConfigProvider locale={antdLocale}>
      {/* 应用内容 */}
    </ConfigProvider>
  );
}
```

支持的 Ant Design 组件：

- 日期选择器 (DatePicker)
- 分页组件 (Pagination)
- 表格组件 (Table)
- 上传组件 (Upload)
- 等等...

## 🛠️ 开发工具

### VS Code 扩展推荐

安装 `i18n Ally` 扩展获得更好的开发体验：

- 翻译键的自动补全
- 翻译内容的内联显示
- 缺失翻译的检测
- 翻译文件的可视化编辑

### 配置 i18n Ally

在 `.vscode/settings.json` 中添加：

```json
{
  "i18n-ally.localesPaths": ["src/locales/lang"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.defaultNamespace": "translation"
}
```

## 🚨 常见问题

### 1. 翻译不生效

**问题**：添加了翻译但页面没有更新

**解决方案**：
- 检查翻译键是否正确
- 确认语言包已正确导入
- 清除浏览器缓存

### 2. 类型错误

**问题**：TypeScript 报告翻译键不存在

**解决方案**：
- 使用 `$t` 函数获得类型提示
- 检查翻译键的拼写
- 重启 TypeScript 服务

### 3. 语言切换不生效

**问题**：调用 `setLocale` 后语言没有切换

**解决方案**：
- 检查 LocalStorage 中的 `i18nextLng` 值
- 确认新语言包已正确加载
- 刷新页面重新初始化

## 📚 相关资源

- [react-i18next 官方文档](https://react.i18next.com/)
- [i18next 配置选项](https://www.i18next.com/overview/configuration-options)
- [Ant Design 国际化](https://ant.design/docs/react/i18n)
- [i18n Ally VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)