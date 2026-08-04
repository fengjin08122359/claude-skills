# 子技能详解

## 1. PRD 结构化分析

**输入：** Markdown PRD 文件
**输出：** 结构化分析结果（规则元组/状态表/边界矩阵）
**详见：** [prd-structured-analysis/SKILL.md](../prd-structured-analysis/SKILL.md)

## 2. 覆盖矩阵生成

**输入：** PRD 分析结果 + 代码 diff + 测试用例
**输出：** PRD-代码-测试 三维覆盖矩阵
**详见：** [coverage-matrix/SKILL.md](../coverage-matrix/SKILL.md)

## 3. 测试用例生成

**输入：** PRD 分析结果中的规则/边界/异常
**输出：** BDD 格式测试用例 + 单元测试脚手架
**详见：** [test-generation/SKILL.md](../test-generation/SKILL.md)

## 4. 代码审查 Checklist

**输入：** PRD 分析结果
**输出：** 基于规则的审查清单
**详见：** [code-review-checklist/SKILL.md](../code-review-checklist/SKILL.md)

## 5. CI 集成入口

**触发：** PRD 文件变更 / 代码提交 / 测试提交
**输出：** 自动化分析报告 + PR 评论
**详见：** [ci-integration/SKILL.md](../ci-integration/SKILL.md)

## 6. PRD 质量提升引擎（场景1+2）

**输入：** 不同版本 PRD / PRD + 测试用例
**输出：** PRD 版本对比报告 / PRD 质量评估 + 改进建议
**覆盖场景：**

- 场景1: 不同版本 PRD → 分析质量优化（版本 diff + 趋势追踪）
- 场景2: PRD + 测试用例 → PRD 规范性提升（6维质量评估 + 改进建议）

**详见：** [prd-quality-improver/SKILL.md](../prd-quality-improver/SKILL.md)

## 7. 开发规范反向填充引擎（场景3+4）

**输入：** 代码 + 测试用例 / 代码 + PRD + 测试
**输出：** 开发规范条目 / 代码稳定性评估 + 范式建议
**覆盖场景：**

- 场景3: 代码 + 测试 → 测试对齐 + 反向填充开发规范（模式提取 + 规范生成）
- 场景4: 代码 + PRD + 测试 → 代码稳定性评估（6维稳定性评分 + 范式建议）

**详见：** [standards-backfill-engine/SKILL.md](../standards-backfill-engine/SKILL.md)
