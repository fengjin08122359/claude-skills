# 质量工程闭环 Skill 设计决策

**决策日期:** 2026-07-09
**决策模块:** prd-analysis-module
**决策类型:** 功能设计

## 决策背景

需要构建一套需求工程与质量效能的 skill，实现 PRD→代码→测试用例→开发规范的闭环优化。

## 决策结果

**最终决策:** 创建 `quality-engineering-loop` skill 技能组（5 个子技能 + 端到端样例）

**决策原因:**

- 技能组模式复用 `workflow-principles-group` 的成熟架构
- 7 个子技能覆盖 4 种场景，可独立调用
- 端到端样例（订单金额计算）验证了完整流程的可行性

## 技能组结构

```text
quality-engineering-loop/
├── SKILL.md                          # 主入口（闭环工作流 + 三种提取模式）
├── prd-structured-analysis/SKILL.md  # 子技能1: PRD 结构化分析
├── coverage-matrix/SKILL.md          # 子技能2: 覆盖矩阵生成
├── test-generation/SKILL.md          # 子技能3: BDD 测试用例生成
├── code-review-checklist/SKILL.md    # 子技能4: 代码审查 Checklist
├── ci-integration/SKILL.md           # 子技能5: CI 集成入口
└── templates/
    ├── .quality-loop.json            # CI 配置模板
    └── samples/
        ├── sample-prd.md             # 样例 PRD 输入
        ├── sample-analysis.md        # 结构化分析输出
        ├── sample-matrix.md          # 覆盖矩阵
        ├── sample-test.ts            # BDD 单元测试
        └── sample-dev-standard.md    # 反向填充开发规范
```

## 核心设计决策

### 决策1: 三种正交视图模型

PRD/代码/测试视为同一业务逻辑的三种视图，而非流水线传递。

### 决策2: 三种提取模式

- 规则元组（计算类/规则类）
- 状态迁移表（状态机/流转类）
- 隐性规则显性化（查询/列表类）

### 决策3: 覆盖矩阵驱动

所有偏差通过 CODE_GAP/TEST_GAP/PRD_GAP/MISMATCH 四类标记。

### 决策4: CI 双模式

- 手动触发（评审前）
- CI 自动触发（PRD/代码/测试变更时）

## 影响范围

- prd-analysis-module: 关联新 skill
- CI 流水线: 增加质量门禁
- 开发规范: 支持反向填充

## 相关文件

- `.trae/skills/quality-engineering-loop/` (skill 目录)
- `.claude/memory/modules/prd-analysis-module/index.md` (模块索引)
