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

### 3. Turborepo 配置

```json:turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 4. TypeScript 配置

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@my-monorepo/*": ["packages/*/src"]
    }
  },
  "exclude": ["node_modules"]
}
```

### 5. ESLint 配置

```javascript:.eslintrc.js
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  rules: {
    // 自定义规则
  }
};
```
