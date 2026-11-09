import assert from 'node:assert/strict';
import test from 'node:test';
import { validateWorkspaces } from '../scripts/check-workspace.mjs';
import { loadWorkspaces } from '../scripts/workspaces.mjs';

function workspace(name, dependencies = {}, group = 'packages') {
  return { group, manifest: { name, private: true, scripts: { build: 'tsc', typecheck: 'tsc --noEmit' }, dependencies } };
}

test('实际工作区依赖图有效', async () => {
  const workspaces = await loadWorkspaces();
  assert.equal(workspaces.length, 5);
  assert.doesNotThrow(() => validateWorkspaces(workspaces));
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
