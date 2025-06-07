# @xatom/bridge

一个用于 WebView Javascript Bridge 的工具库，支持在 iOS 和 Android WebView 中与原生代码进行通信。

## 安装

```bash
npm install @xatom/bridge
```

## 使用说明

### 1. bridgeReady(schema?)
等待 Bridge 初始化完成，返回一个 Promise，resolve 后可安全调用原生方法。

**参数：**
- `schema`（可选）：iOS 下用于触发 bridge 初始化的 schema，默认值为 `ida`。

**示例：**
```js
import { bridgeReady } from '@xatom/bridge'

bridgeReady().then((bridgeInstance) => {
  // 可以安全调用原生方法
})
```

### 2. callApi(action, opt)
调用原生方法。

**参数：**
- `action`：字符串，格式为 `apiType.actionName`，如 `app.getUserInfo`
- `opt`：对象，传递给原生的参数

**返回：**
- Promise，resolve 为原生返回数据，reject 为错误信息

**示例：**
```js
import { callApi } from '@xatom/bridge'

callApi('app.getUserInfo', { foo: 'bar' })
  .then(data => {
    // 处理原生返回的数据
  })
  .catch(err => {
    // 处理错误
  })
```

### 3. registerApi(action, callback)
注册 JS 方法给原生调用。

**参数：**
- `action`：字符串，方法名
- `callback`：函数，接收原生传递的数据

**示例：**
```js
import { registerApi } from '@xatom/bridge'

registerApi('onCustomEvent', (err, data) => {
  if (!err) {
    // 处理原生传递的数据
  }
})
```

## 错误码
- `BRIDGE_TIMEOUT`：bridge 初始化超时
- `BRIDGE_NOTFOUND`：未找到 bridge
- `PARAMETER_ERROR`：参数错误
- `JSON_PARSE_ERROR`：JSON 解析失败
- `BRIDGE_FUNCTION_NOTFOUND`：未找到指定的原生方法

## License
ISC 