# Monorepo 架构搭建教学 Demo

一个从零编写的 **pnpm workspace + TypeScript** 示例：两个独立应用复用同一组课程数据、领域规则、工具和类型，演示模块边界、工作区依赖、拓扑构建与自动化验证。

当前工作目录中的旧业务代码已移除，没有 legacy、备份源码或公司接口。示例只使用虚构课程数据，不访问外部业务服务。旧 Git 提交仍可能含历史内容；工作区替换不等于历史清除，详见 [替换范围](docs/replacement.md)。

<!-- BEGIN project-discovery -->
## 项目定位与实践入口

pnpm workspace + TypeScript monorepo tutorial with shared packages, dependency boundaries, topological builds and CI. 从零搭建多包仓库的架构教学 Demo。

适合从以下入口阅读实现与接入条件：

- [工作区依赖与架构](docs/architecture.md)
- [教学实践](docs/learning-path.md)
- [替换范围](docs/replacement.md)
<!-- END project-discovery -->

## 运行

使用 Node.js 24（最低 22）和 pnpm 10.32.0：

```sh
nvm use
# 尚未安装 pnpm 时，可执行：npm install -g pnpm@10.32.0
pnpm install --frozen-lockfile
pnpm run check
pnpm run demo
```

两个 Demo 均为命令行应用，不需要浏览器或后端：学习计划将四节课分为两天；进度报告展示完成 2/4 节课程、45/100 分钟、45.0% 课时进度。

## 目录

```text
monorepo/
├── apps/
│   ├── planner/            # 学习计划应用：消费领域包
│   └── report/             # 进度报告应用：消费领域包和工具包
├── packages/
│   ├── types/              # Lesson / StudySummary 数据契约
│   ├── utils/              # 分组与百分比等纯函数
│   └── learning/           # 教学数据与课程规则
├── scripts/                # 工作区边界检查、构建目录清理
├── tests/                  # 公开 API、类型、应用集成和依赖边界测试
├── docs/                   # 架构、教学路线和替换范围
├── .github/workflows/      # 与本地同命令的 CI
├── pnpm-workspace.yaml     # 工作区发现
├── pnpm-lock.yaml          # 固定外部依赖解析结果
└── tsconfig.base.json      # 共享严格类型配置
```

每个工作区都有自己的 package.json、tsconfig.json 和构建产物。所有包都是 private；整个仓库不提供发布、自动提交或推送脚本。

## 常用命令

| 命令 | 行为 |
| --- | --- |
| `pnpm run check:workspace` | 校验包名、private、内部依赖声明、循环依赖及分层方向 |
| `pnpm run build` | 检查工作区、清理 dist，按依赖拓扑构建全部包 |
| `pnpm run typecheck` | 先构建依赖声明，再检查各包类型 |
| `pnpm test` | 构建后运行消费方类型测试和自动化测试 |
| `pnpm run check` | 完整构建、各包类型检查和测试 |
| `pnpm run demo` | 构建后运行两个应用 |
| `pnpm run clean` | 仅清理各工作区的 dist |

构建后可单独执行：

```sh
pnpm --filter @demo/planner start
pnpm --filter @demo/report start
# ... 表示包含该应用所依赖的工作区包
pnpm --filter '@demo/report...' run build
```

根目录通过 devDependencies 显式声明测试所消费的 workspace 包；应用则在各自的 dependencies 中声明运行时依赖。不要依靠偶然提升到根目录的包。

## 推荐阅读

1. [架构设计](docs/architecture.md)：依赖方向与工程决策。
2. [教学路线](docs/learning-path.md)：从共享类型到独立应用，逐步添加功能。
3. [替换范围](docs/replacement.md)：旧内容的移除范围以及 Git 历史边界。

本示例聚焦框架组织，不附带 UI、登录、交易或国际化业务。未来需要浏览器页面时，可新增独立应用并消费这些包；不必先扩展成复杂的任务编排或发布平台。
