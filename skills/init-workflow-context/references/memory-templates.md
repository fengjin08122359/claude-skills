# Memory 模板文件

## MEMORY.md 模板（总索引）

```markdown
# Memory Index

## 功能模块索引

### Active Modules

- [user-module](modules/user-module/index.md) — 用户管理相关功能
- [import-module](modules/import-module/index.md) — 批量导入相关功能

### Project Memory

- [project](project/index.md) — 项目级约定、决策、经验

---

## Memory 结构说明

**一级分类：功能模块**
**二级分类：难度等级**
```

## modules/[模块]-module/index.md 模板

```markdown
# [模块名] Module Index

## 模块描述

[模块功能描述]

## Issues 状态

| 难度 | Pending | In Progress | Completed | 归档 |
|------|---------|-------------|-----------|------|
| 低 | X | Y | Z | N |
| 中 | X | Y | Z | N |
| 高 | X | Y | Z | N |

## Requirements 状态

| 难度 | Draft | Approved | Implemented | 归档 |
|------|-------|----------|-------------|------|
| 中 | X | Y | Z | N |
| 高 | X | Y | Z | N |

## 模块记忆

- [decisions.md](decisions.md) — 模块级技术决策
- [learnings.md](learnings.md) — 模块级经验教训

## 统计

- Issues 总数：X
- Requirements 总数：Y
- 最近更新：[日期]
```

## Issue 文件模板（低难度）

```markdown
---
id: low-XXX
title: [标题]
module: [模块名]-module
difficulty: low
score: [≤10分]
type: AFK | HITL
blocked_by: [issue-YYY] 或 "None"
status: pending | completed
tdd_required: true
---

# [标题]

## What to build

[简洁描述]

## TDD 计划

- RED: 测试功能
- GREEN: 实现功能
- 功能验证: 验证可用

## Acceptance criteria

- [ ] TDD 测试通过
- [ ] 功能验证通过
```

## Issue 文件模板（高难度）

```markdown
---
id: high-XXX
title: [标题]
phase: [Phase X]
module: [模块名]-module
difficulty: high
score: [≥16分]
type: AFK | HITL
blocked_by: [issue-YYY]
status: pending | testing | implemented
unit_test_required: true
coverage_target: 80%
---

# [标题]（Phase X）

## What to build

[详细描述]

## 单元测试要求

| 测试组 | 测试内容 | 测试文件 |
|-------|---------|---------|
| 组1 | [内容] | [文件] |

## Acceptance criteria

- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥ 80%
- [ ] 集成测试通过
```
