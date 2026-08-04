# e2e-testing-module 索引

**创建日期：** 2026-07-14
**状态：** 进行中
**难度等级：** 高（18分）

## 模块概述

为 `packages/e2e` 引入 vue-jest + @vue/test-utils 组件测试，在现有 Playwright e2e 测试基础上补充组件级测试能力。

## Issues 列表

| ID      | 切片         | 描述                                    | 类型 | 状态     |
| ------- | ------------ | --------------------------------------- | ---- | -------- |
| issue-001 | 基础设施   | jest + vue-jest + @vue/test-utils 配置 | AFK  | ✅ 完成 |
| issue-002 | 纵向切片 #1 | Dialog 组件测试                        | AFK  | ✅ 完成 |
| issue-003 | 纵向切片 #2 | Tabs + Steps 组件测试                  | AFK  | ✅ 完成 |
| issue-004 | 纵向切片 #3 | Cascader + Swiper 组件测试             | AFK  | ✅ 完成 |
| issue-005 | Chart SVG   | Basic / Export / Fullscreen Chart 测试  | HITL | ✅ 完成 |
| issue-006 | Chart Canvas | DrawModel / Viewport / CanvasUtils 测试 | HITL | ✅ 完成 |
| issue-007 | 集成验证    | 全量测试 + npm script                  | AFK  | ✅ 完成 |

## 关键决策

见 [decisions.md](./decisions.md)
