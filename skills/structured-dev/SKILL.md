---
name: structured-dev
description: 结构化开发全流程入口：初始化→需求分析→模块分类→难度评分→TDD实现→记忆归档。整合 8 个 skill 的完整工作流。
version: 1.0.0
triggers:
  - keyword: "structured-dev"
  - keyword: "结构化开发"
  - keyword: "全流程"
dependencies:
  - init-workflow-context
  - analyze-and-split-requirements
  - coding-principles
  - finalize-workflow-context
  - to-issues
  - to-prd
  - structured-requirement-confirmation
external_configs:
  - config/modules.yaml
  - config/difficulty-rules.yaml
  - config/archive-policy.yaml
---

# Structured Dev — 结构化开发全流程 Plugin

这个 plugin 整合了完整的开发工作流，遵循 TDD 原则，**按功能模块分类管理 memory**。

## Skill 组成员

| Skill | 用途 | 触发时机 |
|-------|------|----------|
| **init-workflow-context** | 初始化 memory，加载现有记忆 | 任务开始前 |
| **coding-principles** | 4 条代码修改基础原则 | 编写/修改代码时 |
| **finalize-workflow-context** | 更新和压缩整理 memory | 任务完成后 |
| **analyze-and-split-requirements** | 需求分析 + 难度评分 + 拆分 issues | 接收新需求时 |
| **to-issues** | 将计划拆分为 tracer-bullet issues | 需要创建 issue 时 |
| **to-prd** | 从对话上下文生成 PRD | 需要生成 PRD 时 |
| **structured-requirement-confirmation** | 中低复杂度需求澄清 | 任意代码修改请求 |

## 快捷命令

```bash
/structured-dev-init        # 初始化工作流上下文
/structured-dev-analyze     # 分析需求并拆分
/structured-dev-code        # 开始编码（加载原则）
/structured-dev-finalize    # 完成任务，整理记忆
/structured-dev-status      # 查看当前工作流状态
/structured-dev-checklist   # 查看自查清单
```

## 核心特性

### 1. 按功能模块分类（一级分类）

**Memory 先按功能模块分类，再按难度二级分类**

```
memory/
├── modules/                  # 一级分类：功能模块
│   ├── user-module/          # 用户模块
│   │   ├── issues/
│   │   │   ├── low/          # 二级分类：难度
│   │   │   ├── medium/
│   │   │   ├── high/         # 含单元测试
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/    # 单元测试计划
│   │   │   └── archived/
│   │   └── decisions.md      # 模块级决策
│   └── [其他模块]/
└── project/                  # 项目级记忆
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

**模块关键词映射见：** `config/modules.yaml`

### 2. TDD 开发原则

```
RED → GREEN → REFACTOR → 循环
```

- 测试验证行为，不验证实现细节
- 使用 tracer-bullet vertical slices
- 每个测试 → 每个实现 → 循环

### 3. 难度等级划分（二级分类）

| 总分 | 难度等级 | 测试要求 | Issues 存放路径 |
|-----|---------|---------|----------------|
| **≤10分** | 低难度 | TDD + 功能验证 | `modules/[模块]/issues/low/` |
| **11-15分** | 中难度 | TDD + 集成测试 | `modules/[模块]/issues/medium/` |
| **≥16分** | 高难度 | **必须单元测试** + TDD + 集成测试 | `modules/[模块]/issues/high/` |

**评分规则见：** `config/difficulty-rules.yaml`
**归档策略见：** `config/archive-policy.yaml`

### 4. Tracer-Bullet Vertical Slices

- 每个 issue 是纵向切片（贯穿所有层）
- Issue 类型：AFK（可独立完成） / HITL（需人工交互）
- 优先 AFK，减少 HITL

### 5. 决策记录机制

所有关键决策记录到 `decisions.md`，包括：决策背景、AI建议、最终决策、决策原因、决策影响。

## 工作流程图

详见 `references/workflow-diagrams.md`

## 4 条编码原则

### 规则 1：编码前先思考 (Think Before Coding)

> 明确陈述假设；不确定的地方要提问而不是靠猜；暴露权衡，列出多种方案的优缺点。

### 规则 2：简洁优先 (Simplicity First)

> 只写能解决问题的最少代码；不写投机性功能；不为单次使用的代码做抽象。

### 规则 3：外科手术式修改 (Surgical Changes)

> 只触碰必须修改的地方；不要顺便"优化"无关的代码、注释或格式。

### 规则 4：目标驱动执行 (Goal-Driven Execution)

> 定义成功标准并循环直到验证成功；能用更少步骤达成就用更少步骤。

## 与其他资源的关系

- **TDD 参考：** `/tdd`
- **Issue 参考：** `/to-issues`
- **需求确认：** `/structured-requirement-confirmation`
- **决策记录：** `/to-prd`
