# Quick Start — 完整闭环

执行完整的 PRD→代码→测试 质量闭环。

## 用法

```
/quality-loop-quick <prd-file>
```

## 参数

|参数|说明|
|---|---|
|`<prd-file>`|PRD 文件路径|

## 执行流程

1. `/prd-structured-analysis` — PRD 结构化分析
2. `/coverage-matrix` — 生成覆盖矩阵
3. `/test-generation` — 生成测试用例
4. `/code-review-checklist` — 生成审查清单

## 输出

```text
docs/working/quality-loop/<YYYYMMDD>/
├── analysis.md
├── matrix.md
├── checklist.md
└── report.md
tests/quality-loop/<模块名>/
```
