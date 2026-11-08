# @xatom/translang

用于将指定格式的 xlsx 文件自动转换为项目中的多语言 json 文件，适用于多语言项目的批量翻译管理。

## 功能简介
- 支持从 Excel（.xlsx）文件批量生成/更新多语言 json 文件
- 自动合并历史翻译，保留未覆盖的旧数据
- 通过--sheets逐次选择sheet，支持表头声明的语言列

## xlsx 文件格式要求
| Key  | en-US | zh-CN |
|------|-------|-------|
| name | name  | 姓名  |

- 第一行为表头，第一列为 Key，后续每列为不同语言（如 en-US、zh-CN 等）
- 每行为一个翻译项

## 安装

```bash
npm install -g @xatom/translang
```

## 使用方法

```bash
translang --xlsx="/绝对路径/language.xlsx" --sheets="Sheet1" --locales="/绝对路径/your_project/locales"
```

### 参数说明
- `--xlsx`    xlsx 文件的绝对路径（必填）
- `--sheets`  需要处理的 sheet 名称（必填）
- `--locales` 语言 json 文件所在目录的绝对路径（必填）

### 示例
假设有如下 xlsx 文件：

| Key  | en-US | zh-CN |
|------|-------|-------|
| name | name  | 姓名  |
| age  | age   | 年龄  |

执行命令：

```bash
translang --xlsx="/Users/xxx/language.xlsx" --sheets="Sheet1" --locales="/Users/xxx/project/locales"
```

会自动生成/更新：
- `/Users/xxx/project/locales/en-US.json`
- `/Users/xxx/project/locales/zh-CN.json`

## 注意事项
- 仅支持 xlsx 格式，且需保证表头格式正确
- 运行前请备份原有语言文件，避免数据丢失
- 仅会覆盖/新增 xlsx 中存在的 key，未覆盖的 key 保留原值
- 依赖 [xlsx](https://www.npmjs.com/package/xlsx) 包

## 常见问题
- **Q:** 支持多 sheet 吗？
  **A:** 支持，通过 `--sheets` 指定 sheet 名称
- **Q:** 语言文件不存在会怎样？
  **A:** 输出目录存在时可写入新的 json 文件；脚本不自动创建目录
- **Q:** 只更新部分 key 会怎样？
  **A:** 只会覆盖 xlsx 中有的 key，其他 key 保留原值

## License

ISC

<!-- BEGIN chovy-readme-review -->
## 源码接入与验证条件

真正执行入口是bin/index.js，按一次调用选择一个sheet，读取XLSX并同步写入语言JSON。它不会自动创建输出目录；目录必须预先存在，单元格应为符合实现预期的文本。package.json的bin路径写作/bin/index.js，本轮未核实打包后可执行链接行为，源码阅读可直接定位该文件。

[工作区说明](../../README.md)，包含当前Lerna发现范围、实际根命令与未完成配置。

本模块没有独立的dev/build/test运行脚本；使用例子必须放在满足依赖的消费方中验证。文档中的npm安装写法只表示消费方式，本轮未确认公共或私有registry中的实际发布可用性。

本轮核对包入口、导出与跨模块引用，未运行原业务接口、原生桥接或发布流程。
<!-- END chovy-readme-review -->
