# Issue-001: 基础设施 — jest + vue-jest + @vue/test-utils

**难度：** 高（6分）
**类型：** AFK（可独立完成）
**切片：** 基础设施层（所有后续切片的依赖）
**所属模块：** e2e-testing-module

---

## 目标

在 `packages/e2e` 中搭建完整的 Jest 组件测试基础设施，使得可以 `import` 真实 `.vue` 组件并渲染。

## TDD 测试计划

### 验收标准（RED → GREEN）

1. **安装依赖**（npm）
   - `jest@^29` — 测试框架
   - `ts-jest@^29` — TypeScript 支持
   - `vue-jest@^3` — Vue 2 SFC transform
   - `@vue/test-utils@^1` — Vue 2 组件测试工具
   - `@vue/vue2-jest@^29` 或兼容版本
   - `identity-obj-proxy` — CSS/Less mock
   - `babel-jest` + `@babel/preset-env` — JS transform
   - `vue-template-compiler@2.7.16` — 匹配 Vue 版本

2. **创建 `jest.config.ts`**
   ```
   位置：packages/e2e/jest.config.ts
   内容：
   - testEnvironment: "jsdom"
   - testMatch: ["<rootDir>/test-harness/**/*.test.ts"]
   - transform: .vue → vue-jest, .ts → ts-jest, .js → babel-jest
   - moduleNameMapper:
     - @uiComponents/(.*) → ../../uiComponents/src/$1
     - @module/(.*) → ../../module/src/$1
     - \.(css|less)$ → identity-obj-proxy
     - gildata-zhimou-utils → mock
   - moduleFileExtensions: ["ts", "js", "vue", "json"]
   ```

3. **创建 mocks**
   - `test-harness/__mocks__/uiComponents.ts` — mock uiComponents 中未测试的依赖
   - `test-harness/__mocks__/gildata-zhimou-utils.ts` — 与 uiComponents 包保持一致

4. **创建 `test-harness/tsconfig.test.json`**
   - 继承根 tsconfig.json
   - 添加 jest types
   - 添加测试文件 include

5. **npm scripts 更新**
   - `package.json` 添加 `"test:unit": "jest"` 和 `"test:all": "npm run test:unit && npm run test"`

6. **冒烟测试**
   - 创建 `test-harness/__tests__/smoke.test.ts`
   - 验证 jest 能正确加载 .vue 文件
   - 验证 module alias 解析正常
   - 验证 CSS mock 正常

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `jest.config.ts` |
| 新建 | `test-harness/tsconfig.test.json` |
| 新建 | `test-harness/__mocks__/uiComponents.ts` |
| 新建 | `test-harness/__mocks__/gildata-zhimou-utils.ts` |
| 新建 | `test-harness/__tests__/smoke.test.ts` |
| 修改 | `package.json`（添加依赖 + scripts） |
| 修改 | `tsconfig.json`（添加 jest types） |

## 完成定义

- [ ] `npm install` 成功
- [ ] `npm run test:unit` 执行冒烟测试通过
- [ ] 能正确 import `.vue` 文件
- [ ] `@uiComponents/*` 路径别名解析正常
- [ ] CSS/Less 文件被正确 mock
- [ ] 不影响现有 Playwright 测试（`npm test` 仍正常）
