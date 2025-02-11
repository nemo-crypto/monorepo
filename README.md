# 从0到1搭建前端 Monorepo 项目：

### 1. 项目初始化

```bash
# 创建项目目录
mkdir my-monorepo
cd my-monorepo

# 初始化 pnpm
pnpm init

# 安装必要的开发依赖
pnpm add -D typescript @types/node turbo prettier eslint
```


### 2. 基础配置文件

```json:package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

```json:pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
