# Issue 模板

## 低难度 Issue

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
storage_path: modules/[模块]/issues/low/
---

# [标题]

## 功能模块信息

- **模块：** [模块名]-module
- **存储路径：** modules/[模块]-module/issues/low/

## What to build

[简洁描述要实现的功能]

## Why（业务价值）

[为什么要做这个功能]

## TDD 计划

- RED: 测试功能
- GREEN: 实现功能
- 功能验证: 验证可用

## Acceptance criteria

- [ ] TDD 测试通过
- [ ] 功能验证通过
- [ ] 无编译错误

## Blocked by

[blocking issue 或 "None"]
```

## 高难度 Issue

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
storage_path: modules/[模块]/issues/high/
---

# [标题]（Phase X）

## 功能模块信息

- **模块：** [模块名]-module
- **Phase：** Phase X
- **存储路径：** modules/[模块]-module/issues/high/

## What to build

[详细描述]

## Why（业务价值）

[业务目标、用户痛点]

## 单元测试要求

| 测试组 | 测试内容 | 测试文件 |
|-------|---------|---------|
| 组1 | [内容] | [文件] |

## Acceptance criteria

- [ ] 所有单元测试通过
- [ ] 代码覆盖率 ≥ 80%
- [ ] 功能验证通过
- [ ] 集成测试通过

## Blocked by

[blocking issue]
```
