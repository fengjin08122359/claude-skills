# Issue-003: Tabs + Steps 组件测试 — 纵向切片 #2

**难度：** 中（5分）
**类型：** AFK（可独立完成）
**切片：** 两个组件共享 UI 模式，一起测试
**前置：** issue-001
**所属模块：** e2e-testing-module

---

## 目标

用 `@vue/test-utils` 测试真实 Tabs 和 Steps Vue 组件。

## TDD 测试计划

### Tabs 组件（`uiComponents/src/tabs/index.vue`）

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | 渲染 tabs 列表 | options 数量 = DOM 中 tab 数量 |
| 2 | 激活状态 | active tab 有 active class |
| 3 | 点击切换 | 点击 tab → setActive → emit change |
| 4 | disabled tab | disabled tab 不可点击 |
| 5 | slot 渲染 | tab 内容区渲染 slot |

### Steps 组件（`uiComponents/src/steps/index.vue`）

| # | 用例 | 验证点 |
|---|------|--------|
| 6 | 渲染步骤列表 | store 数量 = DOM 中 step 数量 |
| 7 | 初始 active | 第一个 step type=1（current） |
| 8 | 点击切换 | click(idx) → 步骤状态更新 |
| 9 | 步骤类型样式 | type=0 → step-zero, type=1 → step-current, type=2 → step-normal |
| 10 | 图标渲染 | icon 属性正确渲染 |

#### 需要 mock

- `element-ui` → 如 Tabs 依赖 el-tabs/el-tab-pane

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `test-harness/ui-components/tabsSteps.test.ts` |

## 完成定义

- [ ] 10 个测试用例全部通过
- [ ] Tabs 组件 props/slots/事件 覆盖
- [ ] Steps 组件 props/方法/样式 覆盖
