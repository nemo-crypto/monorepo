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