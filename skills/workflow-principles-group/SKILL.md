---
name: workflow-principles-group
description: A skill group containing 3 independent workflow skills for structured development process with TDD principles and feature-module classification. Issues and requirements are organized by functional modules (user-module, import-module, etc.) first, then by difficulty within each module. Use individual skills as needed: init-workflow-context (before starting work), coding-principles (during coding), finalize-workflow-context (after completing work). Note: analyze-and-split-requirements has been promoted to a top-level skill and can be called directly as /analyze-and-split-requirements.
---

# Workflow Principles Skill Group

这个 skill 组包含 3 个独立的工作流 skill，用于规范开发流程，遵循 TDD 原则，**按功能模块分类管理 memory**。

> **注意：** `analyze-and-split-requirements` 已提升为顶层独立技能，可直接调用 `/analyze-and-split-requirements`。

## Skill 组成员

| Skill | 用途 | 触发时机 | 特殊功能 |
| ----- | ---- | -------- | -------- |
| **init-workflow-context** | 初始化 memory 目录，加载现有记忆 | 任务开始前 | 按功能模块识别 + 加载 |
| **coding-principles** | 4条代码修改基础原则 | 编写/修改代码时 | Think/Simplicity/Surgical/Goal-Driven |
| **finalize-workflow-context** | 更新和压缩整理 memory | 任务完成后 | 按功能模块分类整理 |

## 使用方式

每个 skill 可以独立调用：

```
/init-workflow-context   # 任务开始前调用（识别功能模块 + 加载记忆）
/analyze-and-split-requirements  # 分析新需求（顶层独立技能，可直接调用）
/coding-principles       # 编写代码时作为指导（4条原则）
/finalize-workflow-context  # 任务完成后调用（按模块分类整理 + 归档决策）
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
│   │
│   ├── import-module/        # 导入模块
│   ├── validation-module/    # 验证模块
│   ├── config-module/        # 配置模块
│   ├── auth-module/          # 认证模块
│   └── [其他模块]
│
└── project/                  # 项目级记忆（不按模块分类）
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

### 2. 功能模块识别

**根据任务关键词自动识别功能模块：**

| 关键词 | 功能模块 | 模块目录 |
|-------|---------|---------|
| user, 用户, 登录, 注册 | user-module | `modules/user-module/` |
| import, 导入, 批量 | import-module | `modules/import-module/` |
| validation, 验证, 校验 | validation-module | `modules/validation-module/` |
| config, 配置, 环境变量 | config-module | `modules/config-module/` |
| auth, 认证, token | auth-module | `modules/auth-module/` |
| init, 初始化, 启动 | init-module | `modules/init-module/` |

### 3. TDD 开发原则

**所有任务都必须遵循 TDD 原则：**

```
RED → GREEN → REFACTOR → 循环
```

- 测试验证行为，不验证实现细节
- 使用 tracer-bullet vertical slices
- 每个测试 → 每个实现 → 循环

### 4. 难度等级划分（二级分类）

| 总分 | 难度等级 | 测试要求 | Issues 存放路径 |
|-----|---------|---------|----------------|
| **≤10分** | 低难度 | TDD + 功能验证 | `modules/[模块]/issues/low/` |
| **11-15分** | 中难度 | TDD + 集成测试 | `modules/[模块]/issues/medium/` |
| **≥16分** | 高难度 | **必须单元测试** + TDD + 集成测试 | `modules/[模块]/issues/high/` |

### 5. Tracer-Bullet Vertical Slices

**参考 `/to-issues` skill 的拆分方法：**

- 每个 issue 是纵向切片（贯穿所有层）
- Issue 类型：AFK（可独立完成） / HITL（需人工交互）
- 优先 AFK，减少 HITL

### 6. 决策记录机制（新增）

**参考 `/to-prd` skill 的决策记录方式：**

所有关键决策都会记录到 memory 中，包括：

| 记录内容 | 说明 | 保存位置 |
|---------|------|---------|
| **决策背景** | 为什么做这个决策 | decisions.md |
| **建议方案** | AI的建议和理由 | decisions.md |
| **决策结果** | 最终选择的方案 | decisions.md |
| **决策原因** | 用户选择的原因 | decisions.md |
| **决策影响** | 决策的影响范围 | decisions.md |

**决策记录格式：**

```markdown
## Decision Records

### [决策ID] - [决策标题]

**决策日期：** YYYY-MM-DD
**决策模块：** [模块名]-module
**决策类型：** [功能保留 / 功能引入 / 配置合并 / 工具迁移]

#### 决策背景
[为什么要做这个决策？]

#### 建议方案
**AI建议：** [建议方案]
**建议理由：** [为什么建议这个方案]

#### 决策结果
**最终决策：** [用户选择的方案]
**决策原因：** [用户为什么选择这个方案]

#### 决策影响
**影响范围：** [影响的模块]
**影响内容：** [具体影响的内容]

#### 相关文件
[涉及的文件列表]
```

**决策记录的好处：**

- ✅ 记录决策历史，便于追溯
- ✅ 记录决策原因，便于理解
- ✅ 记录决策影响，便于评估风险
- ✅ 按模块分类，便于查找和维护
- ✅ 支持后续调整，便于优化方案

## 工作流程图

```mermaid
graph TD
    Start([用户请求]) --> Init[/init-workflow-context]
    Init --> Init_Identify[识别功能模块]
    Init_Identify --> Init_Check[检查模块目录结构]
    Init_Check --> Init_Load[按模块加载记忆]
    Init_Load --> Analyze[/analyze-and-split-requirements]
    
    Analyze --> Analyze_Module[确认功能模块]
    Analyze_Module --> Score[开发难度评分]
    Score --> Branch{难度等级?}
    
    Branch -- 高 --> High_Module[确定模块路径 modules/[模块]/]
    High_Module --> High_TDD[制定 TDD + 单元测试计划]
    High_TDD --> High_Split[拆分为多个子需求]
    High_Split --> High_Doc[创建需求文档 + 测试计划]
    High_Doc --> High_Confirm[用户确认拆分结果]
    High_Confirm --> High_Approve{用户批准?}
    High_Approve -- 否 --> High_Adjust[调整拆分方案]
    High_Adjust --> High_Split
    High_Approve -- 是 --> High_Save[保存到 modules/[模块]/requirements/high/]
    High_Save --> High_Issues[创建 issues 到 modules/[模块]/issues/high/]
    
    Branch -- 中 --> Medium_Module[确定模块路径 modules/[模块]/]
    Medium_Module --> Medium_TDD[制定 TDD + 集成测试计划]
    Medium_TDD --> Medium_Questions[提出澄清问题]
    Medium_Questions --> Medium_Answer{用户回答}
    Medium_Answer --> Medium_Tracer[使用 tracer-bullet 拆分]
    Medium_Tracer --> Medium_Save[保存到 modules/[模块]/]
    
    Branch -- 低 --> Low_Module[确定模块路径 modules/[模块]/]
    Low_Module --> Low_TDD[制定 TDD + 功能验证计划]
    Low_TDD --> Low_Tracer[使用 tracer-bullet 拆分 issues]
    Low_Tracer --> Low_Save[保存到 modules/[模块]/issues/low/]
    
    High_Issues --> Code[/coding-principles]
    Medium_Save --> Code
    Low_Save --> Code
    
    Code --> Code_Rule1[规则1: 编码前先思考]
    Code_Rule1 --> Code_Rule2[规则2: 简洁优先]
    Code_Rule2 --> Code_Rule3[规则3: 外科手术式修改]
    Code_Rule3 --> Code_Rule4[规则4: 目标驱动执行]
    Code_Rule4 --> Code_TDD[执行 TDD 循环]
    
    Code_TDD --> TDD_Red[RED: 写失败测试]
    TDD_Red --> TDD_Green[GREEN: 写最少代码]
    TDD_Green --> TDD_Refactor[REFACTOR: 重构优化]
    TDD_Refactor --> TDD_Verify{测试通过?}
    TDD_Verify -- 否 --> TDD_Red
    TDD_Verify -- 是 --> Final[/finalize-workflow-context]
    
    Final --> Final_Module[识别功能模块]
    Final_Module --> Final_Update[按模块分类更新]
    Final_Update --> Final_Issues[更新模块内 issues 状态]
    Final_Issues --> Final_Requirements[更新模块内需求文档]
    Final_Requirements --> Final_ModuleMemory[更新模块记忆]
    Final_ModuleMemory --> Final_ProjectMemory[更新项目记忆]
    Final_ProjectMemory --> Final_Compress[按模块分类压缩整理]
    Final_Compress --> Final_Archive[归档到模块内对应难度目录]
    Final_Archive --> Complete([任务完成])
```

## 4 条编码原则

### 规则 1：编码前先思考 (Think Before Coding)

> 明确陈述假设；不确定的地方要提问而不是靠猜；暴露权衡，列出多种方案的优缺点；如果存在更简单的方法，要予以反驳。

### 规则 2：简洁优先 (Simplicity First)

> 只写能解决问题的最少代码；不写投机性功能；不为单次使用的代码做抽象；如果资深工程师会觉得过度复杂——简化它。

### 规则 3：外科手术式修改 (Surgical Changes)

> 只触碰必须修改的地方；不要顺便"优化"无关的代码、注释或格式；不重构没坏的东西；匹配现有风格。

### 规则 4：目标驱动执行 (Goal-Driven Execution)

> 定义成功标准并循环直到验证成功；不要告诉 Claude 执行步骤，而是定义"成功是什么样"，让它自己迭代；能用更少步骤达成就用更少步骤。

## Memory 存储路径示例

**高难度任务（用户模块）：**

```
modules/user-module/
├── issues/high/
│   └── issue-001.md         # 高难度 issue（必须单元测试）
├── requirements/high/
│   ├── req-001.md           # 高难度需求文档
│   └── tests/
│       └── test-plan-001.md # 单元测试计划
├── decisions.md             # 模块级决策记录 ⭐新增
└── index.md                 # 模块索引
```

**中难度任务（导入模块）：**

```
modules/import-module/
├── issues/medium/
│   └── issue-001.md         # 中难度 issue（TDD + 集成测试）
├── requirements/medium/
│   └── req-001.md           # 中难度需求文档
├── decisions.md             # 模块级决策记录 ⭐新增
└── index.md                 # 模块索引
```

**低难度任务（配置模块）：**

```
modules/config-module/
├── issues/low/
│   └── issue-001.md         # 低难度 issue（TDD + 功能验证）
├── decisions.md             # 模块级决策记录 ⭐新增
└── index.md                 # 模块索引
```

## 与其他 Skill 的关系

- **TDD 参考：** `/tdd` - TDD 开发流程详细指导
- **Issue 参考：** `/to-issues` - Tracer-bullet vertical slices 详细方法
- **需求确认：** `/structured-requirement-confirmation` - 中低复杂度需求澄清流程
- **决策记录参考：** `/to-prd` - 决策记录格式和方法（Implementation Decisions + Testing Decisions）

## 快速使用指南

### 任务开始

```bash
/init-workflow-context
# 识别功能模块（如 user-module）
# 检查模块目录结构
# 按模块加载现有记忆
```

### 分析需求

```bash
/analyze-and-split-requirements
# 需求澄清（5维问题扫描）
# 功能模块识别
# 内容确认阶段（提出关键确认问题）
# 用户回答确认问题
# 记录决策结果（保存到 decisions.md）
# 评分开发难度（低/中/高）
# 制定 TDD 测试计划
# 使用 tracer-bullet 拆分 issues
# 保存到对应模块目录
```

### 编写代码

```bash
/coding-principles
# 遵循 4 条原则
# 执行 TDD 循环（RED→GREEN→REFACTOR）
# 验证测试通过
```

### 任务完成

```bash
/finalize-workflow-context
# 识别功能模块
# 按模块更新 issues 状态
# 按模块更新需求文档
# 归档决策记录（整理 decisions.md）
# 更新模块和项目记忆
# 按模块分类归档整理
```