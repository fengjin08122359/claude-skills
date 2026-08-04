---
name: to-prd
description: 将当前对话上下文和代码理解转化为 PRD 文档，包含问题陈述、解决方案、用户故事、实现决策和测试决策。
version: 1.0.0
triggers:
  - keyword: "生成PRD"
  - keyword: "写PRD"
  - keyword: "产品需求文档"
  - pattern: ".*创建.*PRD.*"
dependencies: []
external_configs: []
---

# To PRD

Turn the current conversation context into a PRD and publish it to the project issue tracker.

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can.

Check with the user that these seams match their expectations.

3. Write the PRD using the template below, then publish it to the project issue tracker.

## PRD Template

详见 `references/prd-template.md`

### 模板结构

- **Problem Statement** — 用户视角的问题描述
- **Solution** — 用户视角的解决方案
- **User Stories** — 大量编号的用户故事（As an ..., I want ..., so that ...）
- **Implementation Decisions** — 实现决策（模块、接口、架构、Schema、API 等）
- **Testing Decisions** — 测试决策（测试策略、模块、先例）
- **Out of Scope** — 超出范围的内容
- **Further Notes** — 其他备注

### 决策记录

所有决策记录保存到对应模块的 `decisions.md`，格式参考 `/analyze-and-split-requirements` 的决策记录机制。

## 按模块存储

PRD 关联的需求存入对应功能模块：

```
modules/[模块]-module/
├── requirements/
│   ├── medium/
│   └── high/
│       └── tests/    # 单元测试计划
```
