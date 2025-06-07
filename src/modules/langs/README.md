# @langs 模块使用说明

## 简介

`@langs` 模块用于多语言（国际化）管理，支持语言格式化、切换、获取支持语言列表、与 umi/locale 及后端语言映射等，适用于多语言前端项目。

---

## 主要功能

- 获取/设置当前语言
- 语言格式化与映射（前端、后端、三方组件等）
- 获取支持的语言列表
- 初始化页面多语言环境
- 语言切换与校验
- 提供多语言相关 API（如 changeLanguage、getLangList）

---

## API 说明

### 工具函数（`utils.js`）
- `getLang()`：获取当前语言（如 'en_US'）。
- `setLang(lang)`：设置当前语言。
- `formatLang(lang)`：格式化语言标识。
- `getLangs()`：获取支持的语言列表。
- `getServerLang()`：获取后端所需语言标识。
- `getTradingViewLang()`：获取 TradingView 组件所需语言。
- `getUmiLocale(lang)`：获取 umi/locale 所需语言。
- `getZendeskLang(lang)`：获取 Zendesk 文档语言。
- `getZELang()`：获取 Zendesk 客服语言。
- `getValidLangs()`：获取当前有效语言列表。
- `setValidLangs(langMap)`：设置有效语言列表。
- `isFaLang()`：判断是否为波斯语。

### 页面初始化（`pageInit.js`）
- `init()`：初始化页面多语言环境（自动识别 URL、storage、配置等）。
- `handleSimulatorLang(lang, langMap)`：多项目下的语言筛选。

### API 方法（`apis.js`）
- `changeLanguage({ query: { lang } })`：调用后端接口切换语言。
- `getLangList()`：获取后端支持的语言列表。

---

## 使用示例

### 1. 获取和设置当前语言
```js
import { getLang, setLang } from '@langs'
const lang = getLang()
setLang('ja_JP')
```

### 2. 页面多语言初始化
```js
import init from '@langs'
init()
```

### 3. 获取支持的语言列表
```js
import { getLangs } from '@langs'
const langs = getLangs()
```

### 4. 调用后端切换语言
```js
import { apis } from '@langs'
apis.changeLanguage({ query: { lang: 'en_US' } })
```

---

## 依赖
- @xatom/utils
- @xatom/modules/config
- umi/locale

---

如需更多帮助，请查阅源码或联系维护者。 