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

<!-- BEGIN chovy-readme-review -->
## 源码接入与验证条件

本目录没有package.json，真实入口为index.js；getAppConfig与setAppConfig读写window.appConfig。它是浏览器内全局配置适配，不是服务端环境管理，SSR或Node场景必须先处理window依赖。

[工作区说明](../../../README.md)，包含当前Lerna发现范围、实际根命令与未完成配置。

本模块没有独立的dev/build/test运行脚本；使用例子必须放在满足依赖的消费方中验证。文档中的npm安装写法只表示消费方式，本轮未确认公共或私有registry中的实际发布可用性。

本轮核对包入口、导出与跨模块引用，未运行原业务接口、原生桥接或发布流程。
<!-- END chovy-readme-review -->
