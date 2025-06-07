# @xatom/uikits

一套基于 antd、@xatom/flex、@xatom/typo 等基础包封装的通用 UI 组件库，适用于 React 项目。

## 目录结构

```
src/
  index.js                # 主入口，导出所有 UI 组件
  flex/                   # Flex 布局组件（Cols、Stacks、Cell 等）
  typo/                   # 字体排版组件（Title、Text 等）
  antd/                   # antd 二次封装组件（Button、Form、Input、Select、Tabs、Tag、Tooltip 等）
  ...                     # 其他辅助组件
```

## 安装

```bash
yarn add @xatom/uikits
# 或
npm install @xatom/uikits
```

## 使用方法

### 1. 按需引入组件

```js
import { Cols, Stacks, Button, Input, Select, Title, Text, Tag, Tabs, Tooltip } from '@xatom/uikits';

<Cols between>
  <div>左侧</div>
  <div>右侧</div>
</Cols>
<Stacks>
  <div>上</div>
  <div>下</div>
</Stacks>
<Button type="primary">主要按钮</Button>
<Title level={2}>标题</Title>
<Text type="secondary">说明文字</Text>
<Tag color="success">标签</Tag>
<Tabs defaultActiveKey="1" />
<Tooltip title="提示">悬停显示</Tooltip>
```

### 2. 支持的主要组件

- 布局类：`Cols`、`Stacks`、`Cell`、`Fluid`、`Scroll`、`Auto`
- 字体类：`Title`、`Text`
- antd 封装：`Button`、`Icon`、`Form`、`Field`、`Select`、`Input`、`NumberInput`、`Tag`、`Tabs`、`Tooltip`、`Spin`
- 反馈类：`toast`、`notify`

### 3. 组件 API 示例

#### Cols/Stacks
```js
<Cols between><div>左</div><div>右</div></Cols>
<Stacks><div>上</div><div>下</div></Stacks>
```

#### Button
```js
<Button type="primary">主要按钮</Button>
```

#### Title/Text
```js
<Title level={2}>标题</Title>
<Text type="secondary">说明文字</Text>
```

#### Tag/Tabs/Tooltip
```js
<Tag color="success">标签</Tag>
<Tabs defaultActiveKey="1" />
<Tooltip title="提示">悬停显示</Tooltip>
```

#### toast/notify
```js
toast({ type: 'success', title: '操作成功' });
notify({ type: 'info', title: '通知', content: '内容' });
```

## 注意事项

- 需在全局引入 antd 相关样式。
- 组件 props 基本与 antd 保持一致，部分增加自定义扩展。
- 布局组件（Cols/Stacks/Cell 等）支持丰富的布局属性，详见源码。
- 如需自定义样式，可覆盖各组件下的 less 文件。

## License

ISC 