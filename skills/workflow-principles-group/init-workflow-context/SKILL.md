---
name: init-workflow-context
description: TRIGGER this skill BEFORE starting any development task. Initializes memory directory structure with feature-module classification and loads existing memories as context. Issues and requirements are organized by functional modules (user-module, import-module, etc.) first, then by difficulty (low/medium/high) within each module. Use when user says "开始工作", "处理这个任务", or any new development request. Essential for maintaining continuity across sessions.
---

# 初始化工作流上下文

**任务开始前的准备工作：初始化 memory 位置并加载现有记忆。**

## 触发时机

- 用户发起新的开发任务
- 用户说 "开始工作"、"处理这个需求"、"帮我做一下"
- 用户提到需要修改代码的任务

## ❌ 不触发场景

- 纯阅读/理解代码
- 问题诊断/分析
- 知识问答
- 搜索定位

## Memory 目录结构（按功能需求分类）

**核心原则：先按功能模块分类，再按难度子分类**

```
memory/
├── MEMORY.md                 # Memory 索引文件（必须存在）
│
├── modules/                  # 按功能模块分类（一级分类）
│   │
│   ├── user-module/          # 用户模块
│   │   ├── index.md          # 模块索引
│   │   │
│   │   ├── issues/           # 用户模块的 issues（按难度二级分类）
│   │   │   ├── index.md      # Issues 模块索引
│   │   │   ├── low/          # 低难度 issues (≤10分)
│   │   │   │   ├── index.md
│   │   │   │   ├── issue-*.md
│   │   │   │   └── archived/
│   │   │   ├── medium/       # 中难度 issues (11-15分)
│   │   │   │   ├── index.md
│   │   │   │   ├── issue-*.md
│   │   │   │   └── archived/
│   │   │   ├── high/         # 高难度 issues (≥16分)
│   │   │   │   ├── index.md
│   │   │   │   ├── issue-*.md  # 必须包含单元测试
│   │   │   │   └── archived/
│   │   │   └── archived/     # 模块归档
│   │   │
│   │   ├── requirements/     # 用户模块的需求文档（按难度二级分类）
│   │   │   ├── index.md      # Requirements 模块索引
│   │   │   ├── medium/       # 中难度需求
│   │   │   │   ├── index.md
│   │   │   │   ├── req-*.md
│   │   │   │   └── archived/
│   │   │   ├── high/         # 高难度需求（必须包含单元测试计划）
│   │   │   │   ├── index.md
│   │   │   │   ├── req-*.md
│   │   │   │   ├── tests/    # 单元测试计划目录
│   │   │   │   │   ├── test-plan-*.md
│   │   │   │   │   └── unit-test-*.md
│   │   │   │   └── archived/
│   │   │   └── archived/     # 模块归档
│   │   │
│   │   └── decisions.md      # 模块级技术决策
│   │   └── learnings.md      # 模块级经验教训
│   │
│   ├── import-module/        # 导入模块
│   │   ├── index.md
│   │   ├── issues/
│   │   │   ├── low/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/
│   │   │   └── archived/
│   │   └── decisions.md
│   │
│   ├── validation-module/    # 验证模块
│   │   ├── index.md
│   │   ├── issues/
│   │   ├── requirements/
│   │   └── decisions.md
│   │
│   ├── config-module/        # 配置模块
│   │   └── ...
│   │
│   ├── auth-module/          # 认证模块
│   │   └── ...
│   │
│   └── [other-modules]/      # 其他功能模块
│       └── ...
│
└── project/                  # 项目级记忆（不按模块分类）
    ├── index.md              # 项目索引
    ├── conventions.md        # 项目约定
    ├── decisions.md          # 项目级技术决策
    ├── learnings.md          # 项目级经验教训
    ├── patterns.md           # 设计模式
    └── architecture.md       # 架构文档
```

---

## 执行步骤

### 步骤1：识别功能模块

**根据任务内容识别涉及的功能模块：**

| 关键词 | 对应模块 |
|-------|---------|
| user, 用户, 登录, 注册, 权限 | user-module |
| import, 导入, 批量, upload | import-module |
| validation, 验证, 校验, 检查 | validation-module |
| config, 配置, setting, 环境变量 | config-module |
| auth, 认证, token, JWT | auth-module |
| init, 初始化, 启动, bootstrap | init-module |

**模块识别输出：**

```markdown
## 🔍 功能模块识别

**任务关键词：** [从任务描述提取的关键词]
**涉及模块：** [识别出的模块名称]

| 关键词 | 模块目录 | 存在状态 |
|-------|---------|---------|
| [关键词] | [模块名]-module | 已存在/需创建 |
```

---

### 步骤2：检查 Memory 目录结构

**检查逻辑：**

| 目录/文件 | 检查操作 | 缺失处理 |
|----------|---------|---------|
| `memory/` | 目录存在？ | 创建目录 |
| `MEMORY.md` | 文件存在？ | 创建空索引文件 |
| `memory/modules/` | 目录存在？ | 创建目录 |
| `memory/modules/[模块]-module/` | 根据任务识别的模块，目录存在？ | 创建模块目录 |
| `memory/modules/[模块]-module/index.md` | 文件存在？ | 创建模块索引 |
| `memory/modules/[模块]-module/issues/` | 目录存在？ | 创建目录 + 各难度子目录 |
| `memory/modules/[模块]-module/requirements/` | 目录存在？ | 创建目录 + 各难度子目录 |
| `memory/modules/[模块]-module/requirements/high/tests/` | 目录存在？ | 创建目录（单元测试计划） |
| `memory/project/` | 目录存在？ | 创建目录 + 索引 |

---

### 步骤3：加载现有记忆

**按功能模块加载记忆：**

**必须加载：**

1. **MEMORY.md** - 总索引，了解所有模块概况
2. **memory/modules/[模块]-module/index.md** - 模块索引，了解当前模块状态

**按模块加载：**

根据识别的功能模块，加载对应模块的记忆：

| 模块 | 需加载目录 |
|------|-----------|
| user-module | `modules/user-module/issues/[difficulty]/index.md`, `modules/user-module/requirements/[difficulty]/index.md` |
| import-module | `modules/import-module/issues/[difficulty]/index.md` |
| [其他模块] | 对应模块目录 |

**按需加载：**

- `memory/modules/[模块]-module/decisions.md` - 模块级决策
- `memory/modules/[模块]-module/learnings.md` - 模块级经验
- `memory/project/conventions.md` - 项目约定
- `memory/project/decisions.md` - 项目级决策

---

### 步骤4：输出初始化报告

**输出格式：**

```markdown
## 🔄 工作流上下文初始化

### ✅ Memory 目录状态

| 目录/文件 | 状态 | 操作 |
|----------|------|------|
| memory/ | ✅ 已存在 | 无需操作 |
| MEMORY.md | ✅ 已存在 | 加载总索引 |
| modules/ | ✅ 已存在 | 无需操作 |
| modules/[模块]-module/ | ✅ 已存在 | 加载模块索引 |
| modules/[模块]-module/issues/ | ✅ 已存在 | 检查各难度目录 |
| modules/[模块]-module/requirements/high/tests/ | ⚠️ 需创建 | 已创建（单元测试计划目录） |
| project/ | ✅ 已存在 | 加载项目记忆 |

### 📚 已加载记忆

**总索引：**
- MEMORY.md - X 个功能模块索引

**功能模块记忆：**

#### [模块名]-module

- **模块索引：** modules/[模块]-module/index.md
- **Issues 状态：**
  - 低难度：X 个 pending
  - 中难度：Y 个 pending
  - 高难度：Z 个 pending（含单元测试）
- **Requirements 状态：**
  - 中难度：A 个需求
  - 高难度：B 个需求（含测试计划）

**项目记忆：**
- project/conventions.md - 项目约定
- project/decisions.md - 项目级决策

### 📋 功能模块 Issues 分类状态

#### [模块名]-module Issues

| 难度 | Issue ID | 标题 | 状态 | TDD | 优先级 |
|------|----------|------|------|-----|--------|
| 低 | low-001 | 修改配置文件 | pending | test→impl | medium |
| 中 | medium-001 | 实现验证逻辑 | pending | test→impl→integrate | high |
| 高 | high-001 | 架构重构 | pending | 单元测试 + TDD | high |

---

**初始化完成，可以开始任务分析。**
```

---

## 初始化脚本模板

### MEMORY.md 模板（总索引）

```markdown
# Memory Index

<!-- Memory 总索引文件 -->

## 功能模块索引

<!-- 按功能模块分类 -->
<!-- 格式：- [模块名](modules/[模块]-module/index.md) — 一行描述 -->

### Active Modules

- [user-module](modules/user-module/index.md) — 用户管理相关功能
- [import-module](modules/import-module/index.md) — 批量导入相关功能
- [validation-module](modules/validation-module/index.md) — 数据验证相关功能
- [config-module](modules/config-module/index.md) — 配置管理相关功能

### Project Memory

- [project](project/index.md) — 项目级约定、决策、经验

---

## Memory 结构说明

**一级分类：功能模块**
**二级分类：难度等级**

```
memory/modules/[模块]-module/
├── issues/
│   ├── low/      (≤10分)
│   ├── medium/   (11-15分)
│   └── high/     (≥16分, 必须单元测试)
├── requirements/
│   ├── medium/
│   ├── high/     (含 tests/ 目录)
```
```

### modules/[模块]-module/index.md 模板

```markdown
# [模块名] Module Index

<!-- 模块索引 -->

## 模块描述

[模块功能描述]

## Issues 状态

| 难度 | Pending | In Progress | Completed | 归档 |
|------|---------|-------------|-----------|------|
| 低 | X | Y | Z | N |
| 中 | X | Y | Z | N |
| 高 | X | Y | Z | N |

**Issues 目录：** [issues/](issues/index.md)

## Requirements 状态

| 难度 | Draft | Approved | Implemented | 归档 |
|------|-------|----------|-------------|------|
| 中 | X | Y | Z | N |
| 高 | X | Y | Z | N |

**Requirements 目录：** [requirements/](requirements/index.md)

## 模块记忆

- [decisions.md](decisions.md) — 模块级技术决策
- [learnings.md](learnings.md) — 模块级经验教训

## 统计

- Issues 总数：X
- Requirements 总数：Y
- 最近更新：[日期]
```

### modules/[模块]-module/issues/index.md 模板

```markdown
# Issues Index - [模块名] Module

<!-- [模块名] Issues 索引 -->

## 难度分类结构

| 难度 | 目录 | 测试要求 |
|------|------|---------|
| 低难度 | [low/](low/index.md) | TDD + 功能验证 |
| 中难度 | [medium/](medium/index.md) | TDD + 集成测试 |
| 高难度 | [high/](high/index.md) | **必须单元测试** + TDD + 集成测试 |

## 统计

- 低难度：X 个 pending
- 中难度：Y 个 pending
- 高难度：Z 个 pending（含单元测试）

## 归档

所有已完成 issues 移至对应难度目录的 [archived/](archived/)
```

### modules/[模块]-module/requirements/high/tests/test-plan-*.md 模板

```markdown
# 单元测试计划 - [模块名]-[需求ID]

## 需求关联

- 需求文档：[req-XXX](../req-XXX.md)
- Issue：[issue-XXX](../../issues/high/issue-XXX.md)
- 模块：[模块名]-module
- 难度等级：高（≥16分）

## 测试策略

**必须单元测试 + TDD + 集成测试**

## 单元测试范围

| 测试组 | 测试内容 | 测试文件 |
|-------|---------|---------|
| 组1 | 初始化测试 | init.test.ts |
| 组2 | 核心功能测试 | core.test.ts |
| 组3 | 边界条件测试 | boundary.test.ts |

## TDD 执行计划

| 步骤 | RED | GREEN | REFACTOR |
|-----|-----|-------|---------|
| 1 | 写初始化测试 | 实现初始化 | - |
| 2 | 写功能测试 | 实现功能 | 提取公共逻辑 |

## 覆盖率目标

- 目标：≥ 80%
```

---

## 注意事项

1. **先识别模块** - 根据任务关键词识别涉及的功能模块
2. **按模块创建目录** - 确保模块目录结构完整
3. **模块内按难度** - 每个模块内按难度二级分类
4. **高难度模块特殊处理** - `requirements/high/tests/` 目录必须存在
5. **按模块加载记忆** - 只加载当前任务相关模块的记忆
6. **保留项目记忆** - project/ 目录不按模块分类