import { pathToFileURL } from 'node:url';
import { checkSourceImports } from './check-imports.mjs';
import { loadWorkspaces } from './workspaces.mjs';

const dependencySections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

export function validateWorkspaces(workspaces) {
  const byName = new Map();
  for (const workspace of workspaces) {
    const { group, manifest } = workspace;
    if (group !== 'apps' && group !== 'packages') throw new Error(`未知工作区层级: ${group}`);
    if (!manifest.name?.startsWith('@demo/') || byName.has(manifest.name)) {
      throw new Error(`包名无效或重复: ${manifest.name}`);
    }
    if (manifest.private !== true) throw new Error(`教学包必须 private: ${manifest.name}`);
    if (!manifest.scripts?.build || !manifest.scripts?.typecheck) {
      throw new Error(`缺少 build/typecheck: ${manifest.name}`);
    }
    byName.set(manifest.name, workspace);
  }

  const graph = new Map();
  for (const { manifest } of workspaces) {
    const edges = new Set();
    for (const section of dependencySections) {
      for (const [name, version] of Object.entries(manifest[section] ?? {})) {
        if (!name.startsWith('@demo/') && !version.startsWith('workspace:')) continue;
        const target = byName.get(name);
        if (!target || version !== 'workspace:*') throw new Error(`工作区依赖无效: ${manifest.name} -> ${name}`);
        if (target.group === 'apps') throw new Error(`禁止依赖应用: ${manifest.name} -> ${name}`);
        edges.add(name);
      }
    }
    graph.set(manifest.name, edges);
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(name) {
    if (visiting.has(name)) throw new Error(`循环依赖: ${name}`);
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of graph.get(name)) visit(dependency);
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of graph.keys()) visit(name);
  return graph;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const workspaces = await loadWorkspaces();
  const graph = validateWorkspaces(workspaces);
  await checkSourceImports(workspaces, graph);
  console.log(`工作区检查通过：${workspaces.length} 个包，依赖声明、分层方向与源码导入有效。`);
}
