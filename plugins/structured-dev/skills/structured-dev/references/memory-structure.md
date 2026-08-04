# Memory 结构指南

## 两级分类原则

**一级分类：功能模块** — 根据任务关键词识别
**二级分类：难度等级** — 根据 5 维评分结果

```
memory/modules/[模块]-module/
├── issues/
│   ├── low/      (≤10分, TDD + 功能验证)
│   ├── medium/   (11-15分, TDD + 集成测试)
│   └── high/     (≥16分, 必须单元测试)
├── requirements/
│   ├── medium/
│   └── high/     (含 tests/ 目录)
└── decisions.md
```

## 创建新模块时

1. 创建 `modules/[模块名]-module/` 目录
2. 创建 `index.md`（模块索引）
3. 创建 `issues/{low,medium,high}/` 子目录
4. 创建 `requirements/{medium,high}/` 子目录
5. 创建 `requirements/high/tests/` 子目录
6. 创建 `decisions.md`（模块决策）
7. 更新 `MEMORY.md` 总索引
