# Quality Engineering Loop Plugin

**PRD→代码→测试 闭环质量工程技能组**

## 简介

本 plugin 包含 8 个紧密协作的 skill，实现从 PRD 分析到测试生成的完整质量闭环：

```text
PRD 文档 → 结构化分析 → 覆盖矩阵 → 测试生成 → 代码审查 → 规范反哺
```

## 包含的 Skills

| Skill | 用途 | 调用方式 |
|-------|------|----------|
| **quality-engineering-loop** | 组入口，串联完整闭环 | `/quality-engineering-loop <prd.md>` |
| **prd-structured-analysis** | PRD 结构化分析 | `/prd-structured-analysis <prd.md>` |
| **coverage-matrix** | 生成覆盖矩阵 | `/coverage-matrix <analysis>` |
| **test-generation** | 测试用例对齐 & 生成 | `/test-generation <analysis>` |
| **code-review-checklist** | 代码审查 Checklist | `/code-review-checklist <analysis>` |
| **ci-integration** | CI 集成入口 | `/ci-integration --trigger prd-change` |
| **prd-quality-improver** | PRD 质量提升 | `/prd-quality-improver <prd> <tests>` |
| **standards-backfill-engine** | 规范反向填充 | `/standards-backfill-engine <code> <tests>` |

## 快速开始

```bash
# 一键执行完整闭环
/quality-engineering-loop docs/working/prd/my-feature.md

# 或分步执行
/prd-structured-analysis docs/working/prd/my-feature.md
/coverage-matrix output/analysis.json
/test-generation output/analysis.json
```

## 目录结构

```text
quality-engineering-loop/
├── .claude-plugin/
│   └── plugin.json           # Plugin 元数据
├── skills/                   # 8 个子技能
│   ├── quality-engineering-loop/
│   ├── prd-structured-analysis/
│   ├── coverage-matrix/
│   ├── test-generation/
│   ├── code-review-checklist/
│   ├── ci-integration/
│   ├── prd-quality-improver/
│   └── standards-backfill-engine/
├── hooks/
│   └── hooks.json            # Hook 配置
├── scripts/
│   └── run.sh                # 脚本入口
├── settings.json             # 默认设置
└── README.md                 # 本文件
```

## 配置

### settings.json

```json
{
  "quality-engineering-loop": {
    "defaultOutputDir": "docs/quality-loop",
    "coverageGateThreshold": 0.80,
    "testAlignmentGateThreshold": 0.90
  }
}
```

### CI 集成

在项目根目录创建 `.quality-loop.json`：

```json
{
  "gates": {
    "coverage_rate": { "threshold": 0.80, "level": "error" },
    "code_gap_count": { "threshold": 0, "level": "error" }
  },
  "triggers": {
    "prd_change": { "paths": ["docs/working/prd/**/*.md"] }
  }
}
```

## 使用场景

### 场景 1: PRD 评审前

```bash
/prd-structured-analysis docs/working/prd/feature.md
# 输出：规则元组、状态迁移表、边界场景
```

### 场景 2: 代码审查前

```bash
/coverage-matrix output/analysis.json
/code-review-checklist output/analysis.json
# 输出：覆盖矩阵 + 审查清单
```

### 场景 3: 测试补全

```bash
/test-generation output/analysis.json --scope backend
# 输出：BDD 测试用例
```

### 场景 4: 规范沉淀

```bash
/standards-backfill-engine src/ tests/
# 输出：开发规范条目
```

## Schema 定义

数据交换使用 YAML frontmatter 格式，定义在 `skills/quality-engineering-loop/schemas/`：

- `prd-analysis.schema.yaml` — PRD 分析输出
- `coverage-matrix.schema.yaml` — 覆盖矩阵
- `test-case-structured.schema.yaml` — 测试用例
- `test-alignment.schema.yaml` — 对齐报告
- `prd-quality-report.schema.yaml` — PRD 质量报告
- `stability-trend.schema.yaml` — 稳定性趋势
- `quality-loop-config.schema.yaml` — CI 配置

## Hooks

- **pre-skill-execution**: 大 PRD 文件预处理（>500 行自动提取摘要）
- **post-skill-execution**: 输出 schema 验证
- **on-prd-change**: PRD 文件变更通知
- **on-coverage-gap**: 覆盖率低于阈值告警

## 相关 Skill

- `workflow-principles-group` — 开发流程管理（互补）
- `jest-test-generator` — 本 plugin 输出可驱动此 skill
- `analyze-and-split-requirements` — 需求拆分后进入本 plugin

## License

MIT
