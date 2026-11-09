import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const root = new URL('../', import.meta.url);

// 与 pnpm-workspace.yaml 的两层目录约定保持一致。
export async function loadWorkspaces() {
  const workspaces = [];
  for (const group of ['apps', 'packages']) {
    for (const entry of await readdir(new URL(`${group}/`, root), { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const url = new URL(`${group}/${entry.name}/`, root);
      const manifest = JSON.parse(await readFile(new URL('package.json', url), 'utf8'));
      workspaces.push({ group, url, path: fileURLToPath(url), manifest });
    }
  }
  return workspaces;
}
