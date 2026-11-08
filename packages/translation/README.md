# @xatom/locales

用于集中管理和导出多语言（i18n）资源，适用于 React/Vue/小程序等多端国际化项目。

## 目录结构

```
locales/
  en-US.json   # 英文语言包
  zh-TW.json   # 繁体中文语言包
  ...         # 其他语言包
  en-US.js     # 对应 json 的导出
  ...
index.js       # （可选）入口文件
```

## 使用方法

### 1. 按需引入单个语言包
```js
import enUS from '@xatom/locales/locales/en-US.json'
// 或
import zhTW from '@xatom/locales/locales/zh-TW.json'
```

### 2. 通过 js 文件默认导出
```js
import enUS from '@xatom/locales/locales/en-US.js'
import zhTW from '@xatom/locales/locales/zh-TW.js'
```

### 3. 批量引入所有语言（推荐用于国际化框架）
```js
import messages from '@xatom/locales/locales/index-build.js'
// messages = { en_US, zh_TW, ... }
```

### 4. 语言包 JSON 示例
```json
{
  "Hello": "你好",
  "Welcome": "欢迎",
  "Logout": "退出登录"
}
```

## 注意事项
- 语言包文件名需与实际语言代码一致（如 en-US、zh-TW 等）
- 推荐通过 `index-build.js` 聚合导出，便于国际化框架（如 vue-i18n、react-intl）直接使用
- 支持直接引入 json 或 js 文件
- 如需扩展新语言，添加对应的 json 和 js 文件即可

## License

ISC

<!-- BEGIN chovy-readme-review -->
## 源码接入与验证条件

package.json的main指向index.js，但当前该文件为0字节。按路径读取locales下的JSON/JS资源是现有实现，不能按前文的可选聚合入口示意直接假定根导出已实现。新增语言需要核对JSON与JS两种入口及宿主语言码。

[工作区说明](../../README.md)，包含当前Lerna发现范围、实际根命令与未完成配置。

本模块没有独立的dev/build/test运行脚本；使用例子必须放在满足依赖的消费方中验证。文档中的npm安装写法只表示消费方式，本轮未确认公共或私有registry中的实际发布可用性。

本轮核对包入口、导出与跨模块引用，未运行原业务接口、原生桥接或发布流程。
<!-- END chovy-readme-review -->
