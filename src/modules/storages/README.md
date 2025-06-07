# @storages 模块使用说明

## 简介

`@storages` 模块用于统一管理本地存储（localStorage）数据，支持全局存储、作用域存储、模块化注册、版本校验等，适合多业务线、复杂前端项目的数据持久化需求。

---

## 主要功能

- 全局存储与作用域存储的统一管理
- 支持多模块注册与命名空间隔离
- 存储数据的版本校验与自动升级
- 支持通过路径（path）读写嵌套数据
- 提供模块化扩展能力

---

## API 说明

### 1. 类与实例
- `CacheModule`：基础存储模块抽象类。
- `StorageModule`：本地存储基础实现。
- `GlobalStorageModule`：全局存储实现，支持 path 读写。
- `ScopedStorageModule`：作用域存储实现，支持命名空间隔离、版本校验。
- `CacheData`：多模块统一管理器，支持注册、获取、设置、版本校验等。
- `cacheData`：默认导出实例，直接使用。

### 2. 主要方法
- `cacheData.init(options, config)`：初始化模块与配置。
- `cacheData.get(path, defaultValue)`：通过路径获取数据。
- `cacheData.set(path, value)`：通过路径设置数据。
- `cacheData.register({ name, Module, isDefault, scoped })`：注册自定义存储模块。

### 3. 工具方法
- `createStorageRequirement(project)`：生成 storages 初始化依赖（适用于全局初始化流程）。

---

## 使用示例

### 1. 获取和设置全局存储
```js
import storages from '@storages'
storages.set('user.token', 'xxx')
const token = storages.get('user.token')
```

### 2. 注册自定义模块
```js
import storages, { ScopedStorageModule } from '@storages'
storages.register({ name: 'custom', Module: ScopedStorageModule, scoped: true })
storages.set('custom.someKey', 'value')
```

### 3. 版本校验与自动升级
```js
import storages from '@storages'
// 初始化时传入 storages 配置，自动校验版本
storages.init({}, { preferences: { version: '1.0.1', data: { ... } } })
```

---

## 依赖
- localStorage
- @xatom/utils

---

如需更多帮助，请查阅源码或联系维护者。 