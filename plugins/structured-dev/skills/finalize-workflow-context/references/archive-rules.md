# 归档规则指南

## 归档条件

| 难度 | 状态条件 | 等待天数 | 归档目录 |
|------|---------|---------|---------|
| 低 | completed | >7 天 | `modules/[模块]/issues/low/archived/` |
| 中 | implemented | >14 天 | `modules/[模块]/issues/medium/archived/` |
| 高 | implemented + test_passed | >30 天 | `modules/[模块]/issues/high/archived/` |

## 需求文档归档

| 难度 | 状态条件 | 等待天数 | 归档目录 |
|------|---------|---------|---------|
| 中 | implemented | >14 天 | `modules/[模块]/requirements/medium/archived/` |
| 高 | implemented + test_passed | >30 天 | `modules/[模块]/requirements/high/archived/` |

**注意：** 高难度的测试计划（`tests/test-plan-*.md`）即使需求归档后仍保留在原位供参考。

## 合并策略

- 标题相似度 > 80% 的 issue 建议合并
- 合并后文件名格式：`issue-{first-id}-merged.md`
- 合并后更新模块索引

## 自动归档（Hook）

`hooks/post-skill-execution.sh` 在 `finalize-workflow-context` 完成时自动执行归档。
