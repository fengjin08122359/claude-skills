---
name: quality-engineering-loop
description: PRD→代码→测试用例 闭环质量工程技能组。通过结构化分析 PRD、生成覆盖矩阵、驱动 BDD 测试、反向填充开发规范，实现需求工程与质量效能的持续优化。支持前后端职责划分、手动触发和 CI 集成两种模式。
---

# Quality Engineering Loop（质量工程闭环）

**核心理念：PRD、代码、测试不是流水线，而是同一业务逻辑的三种正交视图。**

- **PRD**：业务逻辑的**语义**视图（What & Why）
- **代码**：业务逻辑的**实现**视图（How）
- **测试**：业务逻辑的**验证**视图（Correctness）

优化核心：**提取三方交集（核心规约）**，**自动/半自动标记差异（偏差与遗漏）**。

## 前后端职责划分

**每条规则/需求项都需明确归属：**

|归属|职责范围|典型内容|
|---|---|---|
|**前端 (FE)**|UI/交互/展示逻辑|组件渲染、状态联动、表单校验、路由跳转|
|**后端 (BE)**|数据/业务/调度|数据持久化、业务规则校验、定时调度、异常处理|
|**协作 (FE+BE)**|需要接口约定|状态同步、文件上传、数据校验、导出功能|

**划分原则：**

1. **用户可见的交互** → 前端
2. **数据存储与持久化** → 后端
3. **业务规则校验** → 后端（前端可做预检）
4. **状态同步机制** → 协作项
5. **未知/待确认** → 标记为 UNKNOWN，需产品/技术确认

## 技能组架构

所有子技能均为**顶层独立 skill**，可单独调用，也可通过本入口串联使用。

```text
quality-engineering-loop/          # 组入口（本文件）
├── prd-structured-analysis/       # 子技能1：PRD 结构化分析
├── coverage-matrix/               # 子技能2：覆盖矩阵生成
├── test-generation/               # 子技能3：测试用例生成（BDD）
├── code-review-checklist/         # 子技能4：代码审查 Checklist
├── ci-integration/                # 子技能5：CI 集成入口
├── prd-quality-improver/          # 子技能6：PRD 质量提升（场景1+2）
└── standards-backfill-engine/     # 子技能7：规范反向填充（场景3+4）
```

## 使用方式

### 手动触发

```bash
/prd-structured-analysis <prd-file.md>       # 1. PRD 结构化分析
/coverage-matrix <analysis-output>           # 2. 生成覆盖矩阵
/test-generation <analysis-output>           # 3. 生成测试用例
/code-review-checklist <analysis-output>     # 4. 生成代码审查清单
/prd-quality-improver <prd-file> <test-dir>  # 5. PRD 质量评估
/standards-backfill-engine <code> <tests>    # 6. 规范反向填充
```

### 按场景使用

```bash
# 场景1: 不同版本 PRD → 分析质量优化
/prd-quality-improver --versions v1,v2,v3 --compare

# 场景2: PRD + 测试用例 → PRD 规范性提升
/prd-quality-improver --prd <prd-file> --tests <test-dir>

# 场景3: 代码 + 测试用例 → 测试对齐 + 规范反哺
/standards-backfill-engine --code <src-dir> --tests <test-dir>

# 场景4: 代码 + PRD + 测试 → 代码稳定性评估
/standards-backfill-engine --code <src> --prd <prd> --tests <tests>

# 场景5: 前后端职责划分
/quality-engineering-loop <prd-file.md> --fe-be-split --fe-paths src/frontend --be-paths src/backend
```

### CI 集成

```bash
/ci-integration --trigger prd-change --path <prd-dir>
```

### 完整闭环（推荐）

```bash
/quality-engineering-loop <prd-file.md>
```

## 执行环境规范

### 临时工作目录

**所有中间产物必须在临时目录中生成**，不污染项目源码和 skill 目录。

```text
<项目根目录>/.scratch/quality-loop-<YYYYMMDD-HHMMSS>/
```

**生命周期：** 创建 → 写入 `.env.json` → 各阶段中间产物 → 最终输出转移到项目目录 → 删除临时目录

### 最终输出物保存位置

|输出物|保存路径|
|---|---|
|结构化分析报告|`docs/working/quality-loop/<YYYYMMDD>/analysis.md`|
|覆盖矩阵|`docs/working/quality-loop/<YYYYMMDD>/matrix.md`|
|BDD 测试用例|`tests/quality-loop/<模块名>/`|
|代码审查 Checklist|`docs/working/quality-loop/<YYYYMMDD>/checklist.md`|
|开发规范补充|`docs/working/quality-loop/<YYYYMMDD>/dev-standard.md`|
|质量报告（综合）|`docs/working/quality-loop/<YYYYMMDD>/report.md`|

### 清理与异常

- 任务结束后**必须清理**临时目录
- 中断/失败时**保留**临时目录，便于排查
- 用 `.status.json` 记录执行状态（running / success / failed）

## 闭环工作流

5 阶段流水线：PRD 分析 → 覆盖矩阵 → 测试生成 → 代码审查 → 反向填充

> 详细工作流图见 [references/workflow-diagrams.md](references/workflow-diagrams.md)

## 提取模式

三种核心提取模式：规则元组、状态迁移表、隐性规则显性化

> 详细说明见 [references/extraction-patterns.md](references/extraction-patterns.md)

## 输出物清单

|输出物|格式|用途|消费方|
|---|---|---|---|
|结构化分析报告|JSON/Markdown|需求评审、代码审查|产品、开发、测试|
|覆盖矩阵|Markdown 表格|偏差检测、遗漏标记|开发、测试|
|BDD 测试用例|TypeScript/Markdown|单元测试生成|开发、测试|
|代码审查 Checklist|Markdown|PR 审查|开发|
|开发规范补充|Markdown|规范反哺|开发|
|CI 分析摘要|JSON|自动流水线|CI/CD|

## 子技能详解

> 详见 [references/sub-skills.md](references/sub-skills.md)

## 预处理脚本

大 PRD 文件（>500 行）建议先用预处理脚本提取摘要：

```bash
# PRD 预处理（提取目录结构和关键规则）
bash scripts/prd-preprocess.sh <prd-file.md>

# 输出验证（检查是否符合 schema）
bash scripts/validate-output.sh <output-file> <schema-file>
```

## 样例文档

完整的端到端样例见 `templates/samples/` 目录：

|文件|内容|
|---|---|
|[sample-prd.md](templates/samples/sample-prd.md)|样例 PRD 输入（订单金额计算）|
|[sample-analysis.md](templates/samples/sample-analysis.md)|结构化分析输出|
|[sample-matrix.md](templates/samples/sample-matrix.md)|覆盖矩阵|
|[sample-test.ts](templates/samples/sample-test.ts)|BDD 单元测试|
|[sample-dev-standard.md](templates/samples/sample-dev-standard.md)|反向填充的开发规范|

## 参考信息

- 与其他 Skill 的关系 + 质量度量指标见 [references/metrics-and-relations.md](references/metrics-and-relations.md)
- 数据交换 Schema 定义见 [schemas/README.md](schemas/README.md)
