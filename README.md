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

### 6. Prettier 配置

```json:.prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2
}
```

### 7. 项目结构

```bash
my-monorepo/
├── apps/                    # 应用目录
│   ├── web/                # Web 应用
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   └── admin/              # 管理后台
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── packages/               # 公共包目录
│   ├── ui/                # UI 组件库
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   └── utils/             # 工具库
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── .eslintrc.js
└── .prettierrc
```

### 8. 示例包配置

```json:packages/ui/package.json
{
  "name": "@my-monorepo/ui",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --watch --dts",
    "lint": "eslint src/**/*.ts",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "tsup": "^6.0.0",
    "@types/react": "^18.0.0"
  }
}
```

### 9. 示例应用配置

```json:apps/web/package.json
{
  "name": "@my-monorepo/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src/**/*.{ts,tsx}",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@my-monorepo/ui": "workspace:*",
    "@my-monorepo/utils": "workspace:*",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.0.0",
    "vite": "^4.0.0"
  }
}
```

### 10. Git 配置

```gitignore:.gitignore
# Dependencies
node_modules
.pnpm-store

# Build
dist
build

# Cache
.turbo
.cache

# Logs
*.log

# Editor
.vscode
.idea

# System
.DS_Store
```

### 11. CI/CD 配置

```yaml:.github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 7
          
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Lint
        run: pnpm lint
        
      - name: Build
        run: pnpm build
        
      - name: Test
        run: pnpm test
```
