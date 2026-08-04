# Changelog

All notable changes to this plugin will be documented in this file.

## [1.0.0] - 2026-07-16

### Added

- 初始版本，包含 8 个协作 skill：
  - `quality-engineering-loop` — 组入口，串联完整闭环
  - `prd-structured-analysis` — PRD 结构化分析
  - `coverage-matrix` — 覆盖矩阵生成
  - `test-generation` — 测试用例对齐 & 生成
  - `code-review-checklist` — 代码审查 Checklist
  - `ci-integration` — CI 集成入口
  - `prd-quality-improver` — PRD 质量提升
  - `standards-backfill-engine` — 规范反向填充

### Features

- 支持 4 种使用场景（PRD 版本对比/PRD+测试/代码+测试/三方综合）
- 支持前后端职责划分（FE/BE/协作/UNKNOWN）
- 支持 CI 集成（GitHub Actions / GitLab CI / Gerrit）
- 支持 YAML frontmatter 格式的 Schema 定义
- 支持 hooks 预处理（大 PRD 文件摘要）
- 支持 monitors 后台监控（覆盖率趋势/过期报告/长期缺口）
- 3 个 subagent 定义（analyzer/reviewer/reporter）
- 4 个快捷命令（quick/status/prd-diff/coverage）
- 2 种输出样式（concise/detailed）
