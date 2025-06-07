# @utils 模块使用说明

## 简介

`@utils` 模块为前端项目提供丰富的通用工具函数，涵盖对象、数组、字符串、数字、时间、环境、存储、网络、加密、类型判断、浏览器等常用场景，极大提升开发效率。

---

## 主要功能

- 对象、数组、字符串等数据结构处理
- 数字、时间、千分位、精度等格式化
- 本地存储、cookie、环境变量、路由等操作
- 网络请求、加密解密、类型判断、校验等
- 浏览器、用户代理、iframe、图片等工具
- 兼容 Umi、Dva 等主流前端框架

---

## API 说明

### 1. 常用工具
- `toSeprator(num)`：数字千分位格式化。
- `getNumPrecisionLength(num)`：获取小数位数。
- `getValueByPath(obj, path, defaultValue)`：按路径安全获取对象属性。
- `setValue(obj, path, value)`：按路径安全设置对象属性。
- `removeEmptyValues(obj)`：移除对象中的空值属性。

### 2. 目录结构与分类
- `object.js`：对象相关工具
- `array.js`：数组相关工具
- `number.js`：数字相关工具
- `time.js`：时间相关工具
- `env.js`：环境变量与判断
- `http.js`：网络请求封装
- `crypto.js`：加密解密工具
- `storage.js`：本地存储
- `cookie.js`：Cookie 操作
- `routeActions.js`：路由操作
- `useragent.js`：用户代理判断
- `browser.js`：浏览器相关
- `types.js`：类型判断
- `validator.js`：常用校验
- `file.js`：文件处理
- `image.js`：图片处理
- `mock.js`：Mock 工具
- `perf.js`：性能工具
- `umi.js`、`dva.js`：框架兼容

---

## 使用示例

### 1. 千分位格式化
```js
import { toSeprator } from '@utils'
toSeprator(1234567.89) // "1,234,567.89"
```

### 2. 按路径获取对象属性
```js
import { getValueByPath } from '@utils/object'
const value = getValueByPath(obj, 'a.b.c', '默认值')
```

### 3. 网络请求
```js
import request from '@utils/http'
request('/api/user', { method: 'get' })
```

---

## 依赖
- uuid

---

如需更多帮助，请查阅源码或联系维护者。 