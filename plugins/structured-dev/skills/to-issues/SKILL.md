---
name: to-issues
description: 将计划、PRD 或设计方案拆分为独立可领取的 issues，使用 tracer-bullet 纵向切片。支持 HITL/AFK 分类和依赖排序。
version: 1.0.0
triggers:
  - keyword: "拆分为issue"
  - keyword: "创建issue"
  - keyword: "拆分任务"
  - pattern: ".*拆.*issue.*"
dependencies: []
external_configs: []
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets).

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes an issue reference (issue number, URL, or path) as an argument, fetch it from the issue tracker and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

### 3. Draft vertical slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

**Vertical slice rules:**
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones

详见 `references/tracer-bullet-rules.md`

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses

Ask the user:
- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Publish the issues to the issue tracker

For each approved slice, publish a new issue. Publish issues in dependency order (blockers first).

**Issue template:** 详见 `references/issue-template.md`

## 按模块存储

拆分后的 issues 存入对应功能模块目录：

```
modules/[模块]-module/
├── issues/
│   ├── low/       # ≤10分
│   ├── medium/    # 11-15分
│   └── high/      # ≥16分（必须单元测试）
```

Do NOT close or modify any parent issue.
