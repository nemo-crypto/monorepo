import path from 'path';
import process from 'process';
import Module from 'module';

const builtins = Module.builtinModules;
const JS_EXTENSIONS = new Set(['.js', '.mjs']);
const JSON_EXTENSIONS = new Set(['.json']);

const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;

export function resolve(specifier, parentModuleURL = baseURL, defaultResolve) {
  if (builtins.includes(specifier)) {
    return {
      url: specifier,
      format: 'builtin'
    };
  }
  if (!/^\.{0,2}[/]/.test(specifier) && !specifier.startsWith('file:')) {
      // For node_modules support
      return defaultResolve(specifier, parentModuleURL)
  }
  const resolved = new URL(specifier, parentModuleURL);
  const ext = path.extname(resolved.pathname);
  if (!JS_EXTENSIONS.has(ext) && !JSON_EXTENSIONS.has(ext)) {
    throw new Error(
      `Cannot load file with non-JavaScript file extension ${ext}.`);
  }
  // 如果是*.js、*.mjs文件
  if (JS_EXTENSIONS.has(ext)) {
    return {
      url: resolved.href,
      format: 'esm'
    };
  }

  // 如果是*.json文件
  if (JSON_EXTENSIONS.has(ext)) {
    return {
      url: resolved.href,
      format: 'json'
    };
  }
}