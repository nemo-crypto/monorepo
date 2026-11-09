import { rm } from 'node:fs/promises';
import { loadWorkspaces } from './workspaces.mjs';

// 仅删除工作区生成目录；不依赖调用者的当前目录。
for (const workspace of await loadWorkspaces()) {
  await rm(new URL('dist/', workspace.url), { recursive: true, force: true });
}
