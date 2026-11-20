# 五步搭建教学路线

## 1. 理解工作区

阅读根 package.json、pnpm-workspace.yaml，以及任意应用的 package.json。执行 `pnpm list -r --depth 0`，观察根项目和五个 workspace。解释为什么 `@demo/*` 依赖使用 `workspace:*`。

## 2. 从类型和纯函数开始

阅读 packages/types 与 packages/utils。运行 `pnpm test`，关注分组边界和百分比输入校验。

练习为工具包增加 `sum`，明确空数组和非有限数字的行为，先添加失败测试，再从包入口导出。工具函数不应知道课程 id。

## 3. 组合领域规则

阅读 packages/learning。画出 createStudyPlan 和 summarizeProgress 的输入输出，解释课程完成数量与课时完成比例为什么不同。

练习增加“剩余分钟数”，从 StudySummary 类型开始，修改领域包、报告应用和对应测试。不要在两个应用中复制计算逻辑。

## 4. 创建第二种消费方式

对比 apps/planner 与 apps/report：两个应用共享规则，但各自负责展示。构建后分别运行两个 start 命令。

练习新建 apps/checklist，消费已有领域包输出未完成课程。为新应用声明 workspace 依赖和独立 tsconfig，补充实际进程输出测试。

## 5. 验证架构约束

阅读 `scripts/check-workspace.mjs`、`scripts/check-imports.mjs` 和 `tests/workspaces.test.mjs`。在临时分支尝试给 `packages/utils` 声明对 `apps/report` 的依赖，再单独尝试从其他包的 `src` 相对导入文件。两种修改都应使 `pnpm run check:workspace` 失败。撤回练习改动后再验证。

执行 `pnpm run check && pnpm run demo:built`，确认从干净构建到示例运行的流程。最后阅读 CI，对照每个远程步骤的本地命令。

## 通关标准

能够解释应用层、领域层、工具层和类型层的边界；新增功能有明确公共入口与测试；修改不会通过关闭 strict、吞掉错误或复制业务逻辑掩盖问题。
