# @abtest 模块使用说明

## 简介

`@abtest` 模块用于前端项目中的 A/B 测试策略获取与管理，支持从后端拉取策略并本地存储，便于在业务代码中灵活读取和应用不同实验分组。

---

## 主要功能

- 拉取并存储当前用户/全局的 A/B 测试策略
- 通过 key 获取指定的 A/B 测试策略值
- 支持登录/未登录用户的策略区分

---

## API 说明

### `initAbtest()`
- 异步方法，拉取最新的 A/B 测试策略并存储到本地（storage）。
- 登录用户请求 `/content/user/abtest/check-strategy`，未登录用户请求 `/content/public/abtest/check-strategy`。

### `getAbtest(key, defaultValue)`
- 获取本地存储的指定 key 的 A/B 测试策略值。
- `key`：策略名称。
- `defaultValue`：可选，未命中时的默认值，默认为 `false`。
- 返回：策略值（通常为布尔值）。

---

## 使用示例

### 1. 初始化并拉取策略
```js
import { initAbtest } from '@xatom/abtest'
initAbtest()
```

### 2. 获取某个实验策略
```js
import { getAbtest } from '@xatom/abtest'
const isNewFeatureEnabled = getAbtest('new_feature')
if (isNewFeatureEnabled) {
  // 展示新功能
}
```

---

## 依赖
- @xatom/utils
- @xatom/auth

---

如需更多帮助，请查阅源码或联系维护者。 