# @auth 模块使用说明

## 简介

`@auth` 模块用于处理用户认证、登录状态管理、用户信息存储与刷新、登录/注册跳转等功能，适用于前端项目中需要用户登录态的场景。

---

## 主要功能

- 判断用户是否已登录
- 获取、设置、移除用户信息
- 跳转登录/注册页
- 处理 token 失效
- 刷新用户信息和 token
- KYC 状态获取
- 登录/未登录组件渲染
- App 环境下用户同步

---

## API 说明

### 工具函数（`utils.js`）

- `isLoged()`：判断当前用户是否已登录。
- `getUser()`：获取当前用户信息。
- `setUser(user)`：设置/更新用户信息。
- `removeUser()`：移除本地用户信息。
- `logout(path)`：登出并跳转到指定页面。
- `gotoLogin(path, query)`：跳转到登录页。
- `gotoRegister(query)`：跳转到注册页。
- `getUserName()`：获取当前用户的脱敏用户名（邮箱/手机号）。
- `tokenInvalidHandle()`：处理 token 失效，清除用户并刷新页面。
- `doWithAuth(callback)`：高阶函数，未登录时自动跳转登录。
- `initAppUserConfig(callback)`：App 环境下同步用户信息。

### API 方法（`apis.js`）

- `refreshToken(payload)`：刷新 token。
- `refreshUser()`：刷新用户信息。
- `getkyc(userKyc)`：获取 KYC 状态。

### 组件（`containers.js`）

- `<Loged>{children}</Loged>`：已登录时渲染 children，支持 render props。
- `<UnLoged>{children}</UnLoged>`：未登录时渲染 children。

---

## 使用示例

### 1. 判断登录状态
```js
import { isLoged, getUser } from '@auth'
if (isLoged()) {
  const user = getUser()
  // ...
}
```

### 2. 跳转登录/注册
```js
import { gotoLogin, gotoRegister } from '@auth'
gotoLogin()
gotoRegister()
```

### 3. 组件用法
```jsx
import { Loged, UnLoged } from '@auth'

<Loged>{({ user }) => <div>欢迎，{user.loginId}</div>}</Loged>
<UnLoged><div>请先登录</div></UnLoged>
```

### 4. App 环境下初始化
```js
import { initAppUserConfig } from '@auth'
initAppUserConfig(() => {
  // 初始化完成后的回调
})
```

---

## 依赖
- @xatom/antd/Notify
- @xatom/intl
- @xatom/utils
- @xatom/bridge

---

如需更多帮助，请查阅源码或联系维护者。 