# @xatom/tradingview

基于 TradingView 封装的专业级 K 线图表组件，支持多市场、多主题、持仓/订单线等扩展，适用于 React 项目。

## 目录结构

```
src/
  index.js                # 主入口，导出 TradingViewWidget 组件
  index.less              # 样式文件
  ...                     # 其他辅助模块
```

## 安装

```bash
yarn add @xatom/tradingview
# 或
npm install @xatom/tradingview
```

## 使用方法

### 1. 引入主组件

```js
import TradingViewWidget from '@xatom/tradingview';

<TradingViewWidget kline={klineData} />
```

### 2. 主要 props 说明

- `kline`：K 线相关数据对象，必填
- `url`：K 线数据接口地址，默认 `/market/tradepair/tradeview/kline`
- `theme`：主题配置，支持自定义颜色、线条等
- `maList`：均线列表，如 `[5, 10, 20]`
- `mp`：是否显示 MP 线
- `positions`：持仓数据，支持在图表上绘制持仓线
- `menus`：自定义菜单项
- `storage`：自定义存储对象
- `deps`：依赖的 TradingView 脚本路径
- `tvConfig`：TradingView 原生配置扩展

### 3. 示例

```js
<TradingViewWidget
  kline={klineData}
  url="/api/kline"
  theme={{ tradingview: { up: '#00FF00', down: '#FF0000' } }}
  maList={[5, 10, 20, 30]}
  positions={positions}
  menus={[{ type: 'action', text: '指标', value: 'insertIndicator' }]}
/>
```

### 4. 样式覆盖

如需自定义样式，可覆盖 `index.less`。

## 注意事项

- 需确保页面已引入 TradingView 相关依赖脚本（如 charting_library.standalone.js、datafeed.js）。
- 组件 props 支持高度自定义，建议结合实际业务需求传递。
- 需在全局引入 antd 相关样式。
- 组件依赖 `@xatom/intl`、`@xatom/flex`、`@xatom/typo`、`@xatom/utils` 等基础包。

## License

ISC

<!-- BEGIN chovy-readme-review -->
## 源码接入与验证条件

默认导出TradingViewWidget React类组件。除了props，还依赖国际化、业务动作、市场数据和图表脚本；图表库脚本及datafeed需由实际宿主提供并核实授权，静态容器渲染不能作为行情联调通过依据。

[工作区说明](../../../README.md)，包含当前Lerna发现范围、实际根命令与未完成配置。

源码静态引用了以下当前目录未发现同名package.json的Xatom包：`@xatom/intl`、`@xatom/modular`。它们可能由原宿主别名或外部私有包提供，不能假定安装本目录即可获得。

本模块没有独立的dev/build/test运行脚本；使用例子必须放在满足依赖的消费方中验证。文档中的npm安装写法只表示消费方式，本轮未确认公共或私有registry中的实际发布可用性。

本轮核对包入口、导出与跨模块引用，未运行原业务接口、原生桥接或发布流程。
<!-- END chovy-readme-review -->
