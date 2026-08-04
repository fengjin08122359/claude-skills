# Memory Index

## 功能模块索引

### Active Modules

- [prd-analysis-module](modules/prd-analysis-module/index.md) — PRD 分析与上下文总结
- [e2e-testing-module](modules/e2e-testing-module/index.md) — e2e 包组件测试（vue-jest + @vue/test-utils）
- [uiComponents-module](modules/uiComponents-module/index.md) — uiComponents 包单元测试补充

### Project Memory

- [project](project/index.md) — 项目级约定、决策、经验

---

## Memory 结构说明

**一级分类：功能模块**
**二级分类：难度等级**

```
memory/
├── modules/                  # 一级分类：功能模块
│   ├── prd-analysis-module/  # PRD 分析模块
│   │   ├── issues/
│   │   │   └── medium/       # 中难度 issues
│   │   ├── requirements/
│   │   │   └── medium/       # 中难度需求
│   │   └── decisions.md      # 模块级决策
│   └── [其他模块]
│
└── project/                  # 项目级记忆
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

