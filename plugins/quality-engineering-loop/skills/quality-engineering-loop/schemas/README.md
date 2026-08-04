# Schema 索引

所有 skill 间的数据交换契约定义。使用 **YAML frontmatter** 格式，便于人类阅读和编辑。

## Schema 清单

|Schema 文件|对应 Skill|用途|数据流向|
|---|---|---|---|
|`prd-analysis.schema.yaml`|`prd-structured-analysis`|PRD 结构化分析输出|出口 → 多个下游|
|`coverage-matrix.schema.yaml`|`coverage-matrix`|三维覆盖矩阵|出口 → CI/审查|
|`test-case-structured.schema.yaml`|`test-generation`|结构化测试用例（中间表示）|内部转换|
|`test-alignment.schema.yaml`|`test-generation`|测试-PRD 对齐报告|出口 → PRD改进|
|`quality-loop-config.schema.yaml`|`ci-integration`|CI 门禁配置文件|配置文件|
|`prd-quality-report.schema.yaml`|`prd-quality-improver`|PRD 质量评估报告|出口 → CI|
|`stability-trend.schema.yaml`|`standards-backfill-engine`|代码稳定性趋势|出口 → CI|

## 数据流图

```text
prd-structured-analysis
  │
  │  prd-analysis.schema.yaml
  │  { rules[], stateMachine, explicitRules[], implicitRules[] }
  │
  ├──→ coverage-matrix
  │      │
  │      │  coverage-matrix.schema.yaml
  │      │  { rules[{id, prd, code, test, status}], summary }
  │      │
  │      ├──→ ci-integration ──→ quality-loop-config.schema.yaml (配置)
  │      └──→ code-review-checklist
  │
  ├──→ test-generation
  │      │
  │      │  test-case-structured.schema.yaml (中间表示)
  │      │  { id, name, given, when, then, priority, mappedRules[] }
  │      │
  │      │  test-alignment.schema.yaml (对齐报告)
  │      │  { mappings[], unmappedTests[], statistics }
  │      │
  │      └──→ prd-quality-improver
  │
  ├──→ prd-quality-improver
  │      │
  │      │  prd-quality-report.schema.yaml
  │      │  { scores{6维}, suggestions[], version_trend{} }
  │      │
  │      └──→ ci-integration
  │
  └──→ standards-backfill-engine
         │
         │  stability-trend.schema.yaml
         │  { module, history[{date, score, risk, compliance}] }
         │
         └──→ ci-integration
```

## YAML Schema 格式说明

每个 `.schema.yaml` 文件顶部使用 YAML frontmatter 声明元数据：

```yaml
---
name: schema-name
title: 显示名称
skill: 对应技能名
purpose: 用途说明
data_flow: "数据流向"
---
```

主体部分使用 Markdown 表格描述字段定义，包括字段名、类型、是否必填、约束条件和说明。

## 数据流详细说明

### 1. prd-structured-analysis → 多个下游

```text
输出: prd-analysis.schema.yaml
├── rules[]              → coverage-matrix (PRD轴)
│                        → test-generation (对齐基准)
│                        → code-review-checklist (审查项来源)
├── stateMachine         → test-generation (状态机测试)
│                        → coverage-matrix (SM规则)
├── explicitRules[]      → coverage-matrix (查询规则)
└── implicitRules[]      → coverage-matrix (隐性规则验证)
```

### 2. coverage-matrix → CI/审查

```text
输出: coverage-matrix.schema.yaml
├── rules[].status = CODE_GAP  → code-review-checklist (定向审查)
├── rules[].status = TEST_GAP  → test-generation (缺口建议)
├── rules[].status = PRD_GAP   → prd-quality-improver (反哺PRD)
└── summary.coverage_rate      → ci-integration (门禁检查)
```

### 3. test-generation → PRD改进

```text
输出: test-alignment.schema.yaml
├── mappings[].status = GAP       → prd-quality-improver (测试缺口反馈)
├── unmappedTests[]               → prd-quality-improver (可能是PRD遗漏)
└── statistics.alignmentRate      → ci-integration (门禁检查)
```

### 4. prd-quality-improver → CI

```text
输出: prd-quality-report.schema.yaml
├── scores.overall         → ci-integration (质量门禁)
├── suggestions[]          → PRD作者 (改进建议)
└── version_trend          → 团队看板 (趋势追踪)
```

### 5. standards-backfill-engine → CI

```text
输出: stability-trend.schema.yaml
├── history[].stability_score       → ci-integration (稳定性门禁)
├── history[].standards_compliance  → ci-integration (规范符合率)
└── improvement_velocity            → 团队看板 (改进速度)
```

## 使用方式

### 验证输出

```bash
# 使用验证脚本
bash scripts/validate-output.sh output/report.json schemas/prd-analysis.schema.yaml
```

### 在 Skill 中引用

在各 SKILL.md 的输出格式部分添加 schema 引用：

```markdown
## 输出格式

**Schema:** [prd-analysis.schema.yaml](../quality-engineering-loop/schemas/prd-analysis.schema.yaml)
```

### 扩展 Schema

新增数据类型时：

1. 在 `schemas/` 下创建新的 `.schema.yaml` 文件
2. 更新本索引文件
3. 在对应 skill 的 SKILL.md 中引用
4. 确保上下游 skill 的 schema 兼容
