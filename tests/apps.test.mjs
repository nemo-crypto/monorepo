import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('学习计划应用从构建产物运行', () => {
  const path = fileURLToPath(new URL('../apps/planner/dist/index.js', import.meta.url));
  const output = execFileSync(process.execPath, [path], { encoding: 'utf8' });
  assert.match(output, /第 1 天：工作区与包管理、共享类型与公共入口/);
  assert.match(output, /第 2 天：依赖方向与拓扑构建、测试和持续集成/);
});

test('报告应用通过工作区包入口复用规则', () => {
  const path = fileURLToPath(new URL('../apps/report/dist/index.js', import.meta.url));
  const output = execFileSync(process.execPath, [path], { encoding: 'utf8' });
  assert.match(output, /完成课程：2\/4/);
  assert.match(output, /完成课时：45\/100 分钟/);
  assert.match(output, /课时进度：45\.0%/);
});
