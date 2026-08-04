# 完成任务并整理记忆

调用 `finalize-workflow-context` skill，按模块更新 memory 并归档。

## 使用方式

```
/structured-dev-finalize
```

## 执行内容

1. 识别功能模块并收集信息（修改文件、TDD 结果、测试结果）
2. 按模块更新 issues 状态（存入对应难度目录）
3. 按模块更新需求文档
4. 更新模块级和项目级记忆（decisions.md、learnings.md）
5. 按模块压缩整理（自动归档过期已完成 issues）
6. 输出最终报告

## 归档策略（来自 `config/archive-policy.yaml`）

| 难度 | 归档条件 | 天数 |
|------|---------|------|
| 低 | completed | >7 天 |
| 中 | implemented | >14 天 |
| 高 | implemented + 测试通过 | >30 天 |

## 何时使用

- 任务完成后
- 用户说"完成了"、"总结一下"、"结束任务"
