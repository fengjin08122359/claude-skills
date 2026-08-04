# structured-dev

> 结构化开发全流程 plugin：需求分析 → 模块分类 → 难度评分 → TDD 实现 → 记忆归档

## 概述

`structured-dev` 是一个端到端的开发工作流 plugin，将 TDD 方法论、功能模块分类、难度评分、需求拆分和记忆管理整合为统一流程。

## 包含 Skill

| Skill | 用途 | 触发时机 |
|-------|------|----------|
| `structured-dev` | 组入口，描述全流程 | 显式调用 |
| `init-workflow-context` | 初始化 memory，加载模块记忆 | 任务开始前 |
| `coding-principles` | 4 条代码修改基础原则 | 编写/修改代码时 |
| `finalize-workflow-context` | 更新和压缩整理 memory | 任务完成后 |
| `analyze-and-split-requirements` | 需求分析、难度评分、拆分 issues | 接收新开发需求时 |
| `to-issues` | 将计划拆分为 tracer-bullet issues | 需要创建 issue 时 |
| `to-prd` | 从对话上下文生成 PRD | 需要生成 PRD 时 |
| `structured-requirement-confirmation` | 中低复杂度需求澄清 | 任意代码修改请求 |

## 快捷命令

```bash
/structured-dev-init        # 初始化工作流上下文
/structured-dev-analyze     # 分析需求并拆分
/structured-dev-code        # 开始编码（加载原则）
/structured-dev-finalize    # 完成任务，整理记忆
/structured-dev-status      # 查看当前工作流状态
/structured-dev-checklist   # 查看自查清单
```

## 核心特性

1. **功能模块分类** — Memory 先按模块分类，再按难度子分类
2. **TDD 驱动** — RED → GREEN → REFACTOR 循环
3. **难度评分** — 5 维度评分框架（≤10 低 / 11-15 中 / ≥16 高）
4. **外置配置** — 模块定义、评分规则、归档策略均为 YAML 配置文件
5. **Hooks 自动化** — pre-skill 自动加载模块记忆，post-skill 自动归档
6. **自查清单** — Jest mock 决策清单等快速参考

## 目录结构

```
memory/
├── modules/               # 一级分类：功能模块
│   └── [模块]-module/
│       ├── issues/        # 二级分类：低/中/高
│       ├── requirements/  # 需求文档
│       └── decisions.md   # 模块级决策
└── project/               # 项目级记忆
```

## 配置文件

| 文件 | 用途 |
|------|------|
| `config/modules.yaml` | 功能模块关键词映射 |
| `config/difficulty-rules.yaml` | 5 维评分规则 + 难度阈值 |
| `config/archive-policy.yaml` | 按难度归档天数与条件 |

## License

MIT
