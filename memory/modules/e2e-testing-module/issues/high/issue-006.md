# Issue-006: Chart 组件测试 — Canvas 交互（DrawModel / Viewport / CanvasUtils）

**难度：** 高（9分）
**类型：** HITL（需人工交互 — Canvas API mock 策略确认）
**切片：** 后 3 个 Chart 组件，依赖 Canvas 2D API
**前置：** issue-005
**所属模块：** e2e-testing-module

---

## 目标

用 `@vue/test-utils` 测试 3 个基于 Canvas 的 Chart 组件。

## 难点分析

- jsdom 不支持 Canvas 2D API
- 需要完整 mock `canvas.getContext('2d')` 的方法链
- DrawModel 测试自定义 drawNode/drawLink 回调
- Viewport 测试视口裁剪算法（filterInWindow）
- CanvasUtils 测试底层绘制函数

## TDD 测试计划

### DrawModelChart（`test-harness/charts/DrawModelChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | 自定义 drawNode | 传入 drawNode 回调 → 被调用 |
| 2 | 自定义 drawLink | 传入 drawLink 回调 → 被调用 |
| 3 | DrawStatus 状态 | 绘制状态正确流转 |
| 4 | 数据更新 | update data → 重新绘制 |
| 5 | 移除元素 | remove all → 画布清空 |

### ViewportChart（`test-harness/charts/ViewportChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 6 | filterInWindow | 在视口内的节点被过滤出来 |
| 7 | 缩放影响 | zoom in → 可见节点减少 |
| 8 | 平移影响 | pan → 可见节点变化 |
| 9 | 边界视口 | 完全在视口外 → 0 个可见节点 |

### CanvasUtilsChart（`test-harness/charts/CanvasUtilsChart.ts`）

| # | 用例 | 验证点 |
|---|------|--------|
| 10 | drawCircleCanvas | 调用 drawCircle → canvas 2d API 被调用 |
| 11 | drawWrapTextCanvas | 文字换行绘制 |
| 12 | drawLineArrowCanvas | 箭头线条绘制 |
| 13 | drawTextWithLineCanvas | 文字+线条组合 |
| 14 | 全部绘制 | 组合调用所有绘制函数 |

#### 需要 mock

- `CanvasRenderingContext2D` → 完整方法链 mock
  - `fillRect`, `strokeRect`, `beginPath`, `moveTo`, `lineTo`, `arc`, `fill`, `stroke`, `fillText`, `measureText`, `save`, `restore`, `translate`, `rotate`, `scale`, `clip`, `setTransform`
- `HTMLCanvasElement.getContext` → 返回 mock context
- `@module/*` hooks → 复用 issue-005 的 mock

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `test-harness/charts/drawModelChart.test.ts` |
| 新建 | `test-harness/charts/viewportChart.test.ts` |
| 新建 | `test-harness/charts/canvasUtilsChart.test.ts` |
| 新建 | `test-harness/__mocks__/canvas.ts` |

## 完成定义

- [ ] 14 个测试用例全部通过
- [ ] Canvas 2D mock 覆盖所有使用到的 API
- [ ] filterInWindow 算法正确性验证
- [ ] 自定义绘制回调可测试
