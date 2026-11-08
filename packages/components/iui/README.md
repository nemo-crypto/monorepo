# @xatom/iui

一套基于 antd 封装的通用 UI 组件库，适用于 React 项目。

## 目录结构

```
src/
  index.js                # 主入口，导出所有 UI 组件
  Button/                 # 按钮组件
  Input/                  # 输入框组件
  Select/                 # 下拉选择组件
  Switch/                 # 开关组件
  Tooltip/                # 气泡提示组件
  Slider/                 # 滑块组件
  Table/                  # 表格组件
  MobileTable/            # 移动端表格
  SimplePagination/       # 简易分页
  Empty/                  # 空状态
  ListView/               # 列表视图
  Footer/                 # 页脚
  Navbar/                 # 导航栏
  Dropdown/               # 下拉菜单
  Drawer/                 # 抽屉
  Modal/                  # 弹窗
  Checkbox/               # 复选框
  Radio/                  # 单选框
  ...                     # 其他辅助组件
```

## 安装

```bash
yarn add @xatom/iui
# 或
npm install @xatom/iui
```

## 使用方法

### 1. 按需引入组件

```js
import { Button, Input, Select, Switch, Tooltip } from '@xatom/iui';

<Button type="primary" size="large">主要按钮</Button>
<Input size="small" placeholder="请输入" />
<Select options={[{label: 'A', value: 'a'}]} />
<Switch type="primary" />
<Tooltip title="提示内容">悬停显示</Tooltip>
```

### 2. 支持的主要组件

- `Button` 按钮，支持 type/size
- `Input` 输入框，支持 size
- `Select` 下拉选择，支持 options/size/labelRender
- `Switch` 开关，支持 type/size
- `Tooltip` 气泡提示，支持 underline/maxWidth
- `Slider` 滑块，`TwoStageSlider` 双滑块
- `TableList` 表格，`MobileTable` 移动端表格
- `SimplePagination` 简易分页
- `Empty` 空状态
- `ListView` 列表视图
- `Footer` 页脚
- `Navbar` 导航栏
- `Dropdown` 下拉菜单
- `Drawer` 抽屉
- `Modal` 弹窗
- `Checkbox` 复选框
- `Radio` 单选框

### 3. 组件 API 示例

#### Button
```js
<Button type="primary" size="large">主要按钮</Button>
// type: primary/up/down/default/line/text
// size: max/large/default/small
```

#### Input
```js
<Input size="small" placeholder="请输入" />
// size: max/large/default/small
```

#### Select
```js
<Select options={[{label: 'A', value: 'a'}]} size="large" />
// 支持 labelRender 自定义渲染
```

#### Switch
```js
<Switch type="primary" size="small" />
// type: default/primary
// size: default/small
```

#### Tooltip
```js
<Tooltip title="提示内容" underline maxWidth="300px">悬停显示</Tooltip>
```

## 注意事项

- 需在全局引入 antd 相关样式。
- 组件 props 基本与 antd 保持一致，部分增加自定义扩展。
- 如需自定义样式，可覆盖各组件下的 less 文件。

## License

ISC

<!-- BEGIN chovy-readme-review -->
## 源码接入与验证条件

入口src/index.js包含MobileTable、Navbar、Footer、Drawer、Modal等移动业务组件。部分模块引用宿主路由、业务模块和国际化能力，接入时逐个核对所用组件，而不是一次性假定全部自包含。

[工作区说明](../../../README.md)，包含当前Lerna发现范围、实际根命令与未完成配置。

源码静态引用了以下当前目录未发现同名package.json的Xatom包：`@xatom/brand`、`@xatom/intl`、`@xatom/layers`、`@xatom/lists`、`@xatom/modular`、`@xatom/modules`、`@xatom/transfer`。它们可能由原宿主别名或外部私有包提供，不能假定安装本目录即可获得。

本模块没有独立的dev/build/test运行脚本；使用例子必须放在满足依赖的消费方中验证。文档中的npm安装写法只表示消费方式，本轮未确认公共或私有registry中的实际发布可用性。

本轮核对包入口、导出与跨模块引用，未运行原业务接口、原生桥接或发布流程。
<!-- END chovy-readme-review -->
