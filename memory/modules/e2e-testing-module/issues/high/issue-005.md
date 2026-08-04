# Issue-005: Chart 组件测试 — SVG 渲染（Basic / Export / Fullscreen）

**难度：** 高（8分）
**类型：** HITL（需人工交互 — D3/Canvas mock 策略确认）
**切片：** 前 3 个 Chart 组件，依赖 SVG 渲染
**前置：** issue-001
**所属模块：** e2e-testing-module

---

## 目标

用 `@vue/test-utils` 测试 3 个基于 D3 SVG 的 Chart 组件。

## 难点分析

- Chart 组件依赖 `@module`（`gildata-zhimou-module`）中的 hooks：`useChartInfo`, `useChartD3`, `useChartDraw` 等
- D3 操作真实 DOM（SVG），jsdom 对 SVG 支持有限
- 需要 mock D3 或提供 SVG polyfill

## TDD 测试计划

### BasicChart（`test-harness/charts/BasicChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | 组件挂载 | mount 不报错，SVG 容器创建 |
| 2 | useChartInfo 初始化 | Node/Link 数据结构正确传入 |
| 3 | SVG 容器 | 渲染 `<svg>` 根元素 |
| 4 | 节点渲染 | 有数据时渲染 node 元素 |
| 5 | 连线渲染 | 有数据时渲染 link 元素 |
| 6 | 缩放 | zoom 事件触发 |

### ExportChart（`test-harness/charts/ExportChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 7 | saveAsPng mock | 调用导出 → saveAsPng 被调用 |
| 8 | SVG → Canvas 转换 | 转换流程可测试 |

### FullscreenChart（`test-harness/charts/FullscreenChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 9 | 进入全屏 | buildFullscreen 被调用 |
| 10 | 退出全屏 | Fullscreen API mock |
| 11 | 状态同步 | 全屏状态正确反映 |

#### 需要 mock

- `d3` → 完整 mock（select, append, attr 等）
- `@module/*` hooks → 使用简化的 mock 实现
- SVG DOM → jsdom 的 SVG 支持 + polyfill
- `saveAsPng` → jest.fn()

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `test-harness/charts/basicChart.test.ts` |
| 新建 | `test-harness/charts/exportChart.test.ts` |
| 新建 | `test-harness/charts/fullscreenChart.test.ts` |
| 新建 | `test-harness/__mocks__/d3.ts` |
| 新建 | `test-harness/__mocks__/module-hooks.ts` |

## 完成定义

- [ ] 11 个测试用例全部通过
- [ ] D3 mock 策略确认并文档化
- [ ] SVG 元素在 jsdom 中可正确查询
- [ ] `@module` hooks mock 不影响其他测试
