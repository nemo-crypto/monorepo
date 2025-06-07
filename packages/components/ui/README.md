# @xatom/ui

基于 antd 封装的简洁通用 UI 组件库，适用于 React 项目。

## 目录结构

```
src/
  index.js                # 主入口，导出所有 UI 组件
  Button/                 # 按钮组件
  Input/                  # 输入框组件
  Select/                 # 下拉选择组件
  Table/                  # 表格组件
  SimplePagination/       # 简易分页
  Empty/                  # 空状态
  Checkbox/               # 复选框
  Tips/                   # 小提示
  Tooltip/                # 气泡提示组件
  Slider/                 # 滑块组件
  toast/                  # 轻提示
  NotFound/               # 404 组件
  ...                     # 其他辅助组件
```

## 安装

```bash
yarn add @xatom/ui
# 或
npm install @xatom/ui
```

## 使用方法

### 1. 按需引入组件

```js
import { Button, Input, Select, Table, Tooltip, toast } from '@xatom/ui';

<Button type="primary">主要按钮</Button>
<Input placeholder="请输入" />
<Select options={[{label: 'A', value: 'a'}]} />
<Table columns={columns} dataSource={data} />
<Tooltip title="提示内容">悬停显示</Tooltip>
toast({ type: 'success', title: '操作成功' });
```

### 2. 支持的主要组件

- `Button` 按钮
- `Input` 输入框
- `Select` 下拉选择
- `Table` 表格
- `SimplePagination` 简易分页
- `Empty` 空状态
- `Checkbox` 复选框
- `Tips` 小提示
- `Tooltip` 气泡提示
- `Slider` 滑块，`TwoStageSlider` 双滑块
- `toast` 轻提示
- `NotFound` 404 组件

### 3. 组件 API 示例

#### Button
```js
<Button type="primary">主要按钮</Button>
```

#### Input
```js
<Input placeholder="请输入" />
```

#### Select
```js
<Select options={[{label: 'A', value: 'a'}]} />
```

#### Tooltip
```js
<Tooltip title="提示内容">悬停显示</Tooltip>
```

#### toast
```js
toast({ type: 'success', title: '操作成功' });
// type: success/info/warning/error
```

## 注意事项

- 需在全局引入 antd 相关样式。
- 组件 props 基本与 antd 保持一致，部分增加自定义扩展。
- 如需自定义样式，可覆盖各组件下的 less 文件。

## License

ISC 