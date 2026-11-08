# Xatom 前端模块与组件集合

当前目录集中存放React业务组件、WebView桥接、多语言资源、翻译转换和认证/存储工具等源码，根目录采用Lerna 3的包发现配置。

原README中的pnpm/Turborepo/TypeScript搭建教程保留在 [Monorepo设计笔记](docs/monorepo-design-notes.md)。这些是学习方案，当前根目录没有对应的turbo配置、pnpm工作区或统一dev/build/test门禁，不能直接照教程命令启动整个仓库。

## 包与模块导航

| 模块 | 内容 | 文档 |
|---|---|---|
| translation | 多语言JSON与JS资源 | [语言资源](packages/translation/README.md) |
| translang | XLSX转换为语言JSON的CLI | [转换工具](packages/translang/README.md) |
| bridge | iOS/Android WebView桥接 | [桥接模块](packages/bridge/README.md) |
| abtest | 策略请求与会话缓存 | [A/B实验](packages/abtest/README.md) |
| components | ui、iui、uikits、TradingView | [UI](packages/components/ui/README.md) / [IUI](packages/components/iui/README.md) / [UIKit](packages/components/uikits/README.md) / [图表](packages/components/tradingview/README.md) |
| auth / langs | 登录、用户及国际化适配 | [认证](src/modules/auth/README.md) / [语言](src/modules/langs/README.md) |
| config / storages / utils | 全局配置、缓存与工具 | [配置](src/modules/config/README.md) / [存储](src/modules/storages/README.md) / [工具](src/modules/utils/README.md) |

## 当前工作区与命令

[lerna.json](lerna.json) 配置independent版本管理，发现范围为 `packages/widgets/*`、`packages/components/*`、`packages/translation`、`src`。这与磁盘上的全部模块并不等价：bridge、abtest、translang和src/modules不会自动全部成为根工作区包。

```bash
npm install
npm run versions
```

`versions` 实际执行 `lerna ls --long`。`npm run diff` 只查看Git历史。根目录没有start/dev/build/test/lint脚本，不存在统一启动应用。

根脚本 `i18n` 引用了 `build/custom-loader.mjs` 和 `build/build-i18n.js`，当前目录缺少build目录，应先恢复实际实现再运行。

## 消费与接入条件

多数包以源码为main入口，包含JSX、Less、浏览器API及 `@xatom/*` 依赖，需要宿主构建器、别名和配套模块。package.json未完整声明所有源码依赖，不应将每个目录视为可直接从公共npm安装的独立成品。

阅读模块README后，还应核对包入口和实际export。认证、A/B策略与国际化使用业务接口；桥接需要原生宿主；TradingView需要相应图表资源与datafeed。UI模块不能靠根目录安装自动补齐这些条件。

## 维护与验收

修改按包边界进行，并同步更新导出、消费方配置与文档。翻译CLI会覆盖目标资源，使用副本核实输入表头、sheet和输出目录。实际发布与许可应以各包配置和授权为准。

本轮逐项查看根配置及第一方模块入口，补充其独立运行条件与已知缺口；未安装依赖、执行发布或验证业务后端。详细记录见父目录 [README检查清单](https://github.com/nemo-crypto/nemo-crypto/blob/main/docs/workspace/README-AUDIT.md)。
