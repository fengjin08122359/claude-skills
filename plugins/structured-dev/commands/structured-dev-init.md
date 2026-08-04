# 初始化工作流上下文

调用 `init-workflow-context` skill，初始化 memory 目录并加载模块记忆。

## 使用方式

```
/structured-dev-init
```

## 执行内容

1. 识别任务涉及的功能模块（基于 `config/modules.yaml` 关键词）
2. 检查 memory 目录结构，创建缺失目录
3. 加载模块索引和决策记忆
4. 输出初始化报告（目录状态、已加载记忆、issues 分类状态）

## 何时使用

- 开始新的开发任务前
- 用户说"开始工作"、"处理这个需求"
