import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';
import { checkSourceImports, validateSourceImports } from '../scripts/check-imports.mjs';
import { validateWorkspaces } from '../scripts/check-workspace.mjs';
import { loadWorkspaces } from '../scripts/workspaces.mjs';

function workspace(name, dependencies = {}, group = 'packages') {
  return { group, manifest: { name, private: true, scripts: { build: 'tsc', typecheck: 'tsc --noEmit' }, dependencies } };
}

test('实际工作区依赖图有效', async () => {
  const workspaces = await loadWorkspaces();
  const graph = validateWorkspaces(workspaces);
  assert.deepEqual(graph.get('@demo/planner'), new Set(['@demo/learning']));
  assert.deepEqual(graph.get('@demo/report'), new Set(['@demo/learning', '@demo/utils']));
  await checkSourceImports(workspaces, graph);
});

test('拒绝循环依赖和缺失的工作区包', () => {
  assert.throws(() => validateWorkspaces([
    workspace('@demo/a', { '@demo/b': 'workspace:*' }),
    workspace('@demo/b', { '@demo/a': 'workspace:*' }),
  ]), /循环/);
  assert.throws(() => validateWorkspaces([workspace('@demo/a', { '@demo/missing': 'workspace:*' })]), /无效/);
});

test('共享包和应用都不能反向依赖其他应用', () => {
  for (const group of ['packages', 'apps']) {
    assert.throws(() => validateWorkspaces([
      workspace('@demo/a', { '@demo/app': 'workspace:*' }, group),
      workspace('@demo/app', {}, 'apps'),
    ]), /禁止依赖应用/);
  }
});

test('拒绝重复包名、隐式注册表版本和非私有包', () => {
  assert.throws(() => validateWorkspaces([workspace('@demo/a'), workspace('@demo/a')]), /重复/);
  assert.throws(() => validateWorkspaces([
    workspace('@demo/a', { '@demo/b': '^1.0.0' }), workspace('@demo/b'),
  ]), /无效/);
  const item = workspace('@demo/a');
  item.manifest.private = false;
  assert.throws(() => validateWorkspaces([item]), /private/);
});


test('源码只能通过声明过的依赖和包内模块访问代码', () => {
  const sourceRoot = resolve('apps/planner/src');
  const file = resolve(sourceRoot, 'helpers/plan.ts');
  const dependencies = new Set(['@demo/learning']);
  const validate = (source) => validateSourceImports(source, file, sourceRoot, dependencies);

  assert.doesNotThrow(() => validate(`
    export { createStudyPlan } from '@demo/learning';
    type Local = import('../model.js').Local;
  `));
  assert.throws(() => validate("import type { Lesson } from '@demo/types';"), /package.json/);
  assert.throws(() => validate("await import('@demo/learning/dist/study.js');"), /公共入口/);
  assert.throws(() => validate("export * from '../../../../packages/learning/src/study.js';"), /越过/);
  assert.throws(() => validate("import 'file:///example/study.js';"), /包内相对路径/);
});
