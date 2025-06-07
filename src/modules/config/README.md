# @config 模块使用说明

## 简介

`@config` 模块用于全局应用配置的获取与设置，支持通过路径获取嵌套配置项，常用于前端项目中全局配置的管理。

---

## 主要功能

- 获取全局配置（支持路径获取嵌套属性）
- 设置全局配置

---

## API 说明

### `getAppConfig(path, defaultValue)`
- **参数：**
  - `path`：可选，字符串或数组，配置项路径（如 'user.info.name'）。
  - `defaultValue`：可选，未找到时返回的默认值。
- **返回值：**
  - 指定路径下的配置值，或整个配置对象。
- **说明：**
  - 若不传 path，则返回整个 `window.appConfig`。

### `setAppConfig(config)`
- **参数：**
  - `config`：对象，新的全局配置。
- **说明：**
  - 会直接覆盖 `window.appConfig`。

---

## 使用示例

### 1. 获取全局配置
```js
import { getAppConfig } from '@config'
const allConfig = getAppConfig()
const apiBase = getAppConfig('api.baseUrl')
const userName = getAppConfig(['user', 'name'], '默认用户名')
```

### 2. 设置全局配置
```js
import { setAppConfig } from '@config'
setAppConfig({ api: { baseUrl: 'https://api.example.com' }, user: { name: '张三' } })
```

---

## 依赖
- `getValueByPath`（位于 `src/modules/utils/src/object.js`）

---

如需更多帮助，请查阅源码或联系维护者。 