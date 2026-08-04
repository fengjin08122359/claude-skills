# e2e-testing-module 决策记录

## Decision Records

### DEC-001 - 测试目标选择

**决策日期：** 2026-07-14
**决策模块：** e2e-testing-module
**决策类型：** 功能引入

#### 决策背景
e2e 包目前仅有 Playwright e2e 测试，缺少组件级测试能力。需要引入 vue-jest + @vue/test-utils。

#### 建议方案
**AI建议：** 直接测试 `uiComponents/src/*.vue` 真实组件
**建议理由：** 与 uiComponents 包已有测试保持一致，测试真实渲染行为

#### 决策结果
**最终决策：** 真实 Vue 组件
**决策原因：** 用户确认

#### 决策影响
**影响范围：** 所有测试文件
**影响内容：** 测试文件需要 import 跨包的 .vue 文件，路径别名需正确配置

---

### DEC-002 - 覆盖范围

**决策日期：** 2026-07-14
**决策模块：** e2e-testing-module
**决策类型：** 功能引入

#### 决策背景
e2e 包共有 9 个组件需要测试：3 个 UI + 6 个 Chart。

#### 决策结果
**最终决策：** 全部 9 个组件
**决策原因：** 用户确认

#### 决策影响
**影响范围：** 5 个 issue（issue-002 ~ issue-006）
**影响内容：** Chart 组件需要 D3/Canvas mock，难度较高

---

### DEC-003 - 测试目录位置

**决策日期：** 2026-07-14
**决策模块：** e2e-testing-module
**决策类型：** 配置合并

#### 决策背景
测试文件可以放在 `__tests__/`、`tests/unit/` 或 `test-harness/`。

#### 决策结果
**最终决策：** `test-harness/` 目录
**决策原因：** 用户确认，测试文件与 harness 文件同目录

#### 决策影响
**影响范围：** jest.config.ts 的 testMatch 配置
**影响内容：** `testMatch: ["<rootDir>/test-harness/**/*.test.ts"]`
