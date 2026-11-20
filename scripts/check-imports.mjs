import { readdir, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export function validateSourceImports(source, file, sourceRoot, dependencies) {
  for (const { fileName: specifier } of ts.preProcessFile(source, true, true).importedFiles) {
    if (specifier.startsWith('@demo/')) {
      const packageName = specifier.split('/').slice(0, 2).join('/');
      if (specifier !== packageName) {
        throw new Error(`${file}: 请使用工作区包的公共入口 ${packageName}，当前导入为 ${specifier}`);
      }
      if (!dependencies.has(packageName)) {
        throw new Error(`${file}: 请先在当前包的 package.json 中声明 ${packageName}`);
      }
    }

    if (isAbsolute(specifier) || specifier.startsWith('file:')) {
      throw new Error(`${file}: 请使用包入口或包内相对路径，当前导入为 ${specifier}`);
    }

    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const target = relative(sourceRoot, resolve(dirname(file), specifier));
      if (target === '..' || target.startsWith(`..${sep}`) || isAbsolute(target)) {
        throw new Error(`${file}: 相对导入越过当前包的 src 边界：${specifier}`);
      }
    }
  }
}

export async function checkSourceImports(workspaces, graph) {
  for (const { path, manifest } of workspaces) {
    const sourceRoot = join(path, 'src');
    const dependencies = graph.get(manifest.name);
    const entries = await readdir(sourceRoot, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.ts')) continue;
      const file = join(entry.parentPath, entry.name);
      validateSourceImports(await readFile(file, 'utf8'), file, sourceRoot, dependencies);
    }
  }
}
