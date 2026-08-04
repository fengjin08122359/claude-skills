# 分析需求并拆分

调用 `analyze-and-split-requirements` skill，进行需求分析、难度评分和 issue 拆分。

## 使用方式

```
/structured-dev-analyze
```

## 执行内容

1. 5 维问题扫描（Who/What/Where/When/Why）
2. 功能模块识别（基于 `config/modules.yaml`）
3. 内容确认（检查现有文档、分类确认）
4. 记录决策结果（保存到 decisions.md）
5. 难度评分（基于 `config/difficulty-rules.yaml`）
6. 按难度拆分 issues（tracer-bullet 纵向切片）

## 何时使用

- 接收新的开发需求时
- 用户说"帮我实现 X"、"需要做 Y"
