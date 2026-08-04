---
name: ci-integration
description: 配置 CI 流程，在 PRD 变更或代码提交时自动触发质量分析。支持前后端分离检查、文件路径过滤、artifact 存储、PR 评论集成和门禁检查。
---

# CI 集成入口

**目标：** 将质量闭环嵌入 CI/CD 流水线，实现自动化持续优化。支持前后端分离检查。

## 触发场景

|触发场景|触发条件|执行动作|门禁|
|---|---|---|---|
|PRD 变更|PRD 目录下 .md 文件变更|重新分析 + 生成报告|警告（不阻塞）|
|代码提交|src/ 下 .ts/.js/.vue 变更|检查规则覆盖 + 生成 Checklist|覆盖率 ≥ 80%|
|测试提交|test/ 下文件变更|更新覆盖矩阵 + 检查对齐|测试映射 ≥ 90%|
|PR 创建|新 PR|生成审查报告 + PR 评论|仅提供信息|

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/ci-integration-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/ci-report.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## CI 流水线配置

支持 GitHub Actions、GitLab CI、Gerrit 三种集成方式。

> 详细配置示例见 [references/ci-config-examples.md](references/ci-config-examples.md)

## 门禁规则配置

在项目根目录创建 `.quality-loop.json`：

```json
{
  "version": "1.0",
  "gates": {
    "coverage_rate": { "threshold": 0.80, "level": "error" },
    "test_alignment_rate": { "threshold": 0.90, "level": "warning" },
    "code_gap_count": { "threshold": 0, "level": "error" },
    "mismatch_count": { "threshold": 0, "level": "error" }
  },
  "triggers": {
    "prd_change": { "paths": ["docs/working/prd/**/*.md"], "gate": false },
    "code_change": { "paths": ["src/**/*.ts", "src/**/*.vue"], "gate": true },
    "test_change": { "paths": ["test/**/*.test.ts"], "gate": true }
  }
}
```

## Artifact 存储结构

```text
.quality-reports/
├── prd-analysis.json
├── coverage-matrix.json
├── review-checklist.json
├── summary.md
└── trend.json
```

## 持续优化循环

```
PRD 变更 → 重新分析 → 更新矩阵 → 发现新偏差 → 触发修复
    ↑                                              ↓
    ←←←←←←← 修复完成 → 测试通过 → 合并 ←←←←←←←←←
```

## 使用方式

```bash
# 手动触发 CI 分析
/ci-integration --trigger prd-change --path docs/working/prd/
/ci-integration --trigger code-change --path src/
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收分析结果
- **← coverage-matrix：** 接收矩阵 JSON
- **← code-review-checklist：** 接收 Checklist JSON
- **→ PR 评论/Slack/Artifact：** 输出报告和门禁结果
