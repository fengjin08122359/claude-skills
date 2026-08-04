# 文档位置参考

## Memory 目录结构

```
memory/
├── MEMORY.md                          # 总索引（必须存在）
├── modules/                           # 按功能模块分类（一级）
│   ├── user-module/                   # 用户模块
│   │   ├── index.md                   # 模块索引
│   │   ├── decisions.md               # 模块级决策
│   │   ├── learnings.md               # 模块级经验
│   │   ├── issues/                    # 按难度分类（二级）
│   │   │   ├── low/                   # ≤10分
│   │   │   │   ├── issue-*.md
│   │   │   │   └── archived/
│   │   │   ├── medium/                # 11-15分
│   │   │   │   ├── issue-*.md
│   │   │   │   └── archived/
│   │   │   └── high/                  # ≥16分（必须单元测试）
│   │   │       ├── issue-*.md
│   │   │       └── archived/
│   │   └── requirements/
│   │       ├── medium/
│   │       │   └── req-*.md
│   │       └── high/
│   │           ├── req-*.md
│   │           └── tests/             # 单元测试计划
│   │               └── test-plan-*.md
│   └── [其他模块]/
└── project/                           # 项目级记忆
    ├── index.md
    ├── conventions.md                 # 项目约定
    ├── decisions.md                   # 项目级决策
    ├── learnings.md                   # 项目级经验
    ├── patterns.md                    # 设计模式
    └── architecture.md                # 架构文档
```

## 关键文档说明

| 文档 | 路径 | 用途 | 何时读取 |
|------|------|------|---------|
| 总索引 | `memory/MEMORY.md` | 所有模块概况 | 每次初始化 |
| 模块索引 | `memory/modules/[模块]/index.md` | 当前模块状态 | 识别模块后 |
| 模块决策 | `memory/modules/[模块]/decisions.md` | 历史决策 | 需要上下文时 |
| 模块经验 | `memory/modules/[模块]/learnings.md` | 经验教训 | 需要上下文时 |
| 项目约定 | `memory/project/conventions.md` | 通用约定 | 编码前 |
| 项目决策 | `memory/project/decisions.md` | 跨模块决策 | 需要上下文时 |
| 项目经验 | `memory/project/learnings.md` | 通用经验 | 需要上下文时 |

## 文件命名规范

| 文件类型 | 命名格式 | 示例 |
|---------|---------|------|
| Issue | `issue-[ID].md` | `issue-001.md` |
| 需求文档 | `req-[ID].md` | `req-001.md` |
| 测试计划 | `test-plan-[ID].md` | `test-plan-001.md` |
| 单元测试 | `unit-test-[ID].md` | `unit-test-001.md` |
| 决策记录 | `decisions.md` | `decisions.md` |

## Plugin 配置文件位置

| 配置文件 | 路径 | 用途 |
|---------|------|------|
| 模块定义 | `plugins/structured-dev/config/modules.yaml` | 功能模块关键词映射 |
| 评分规则 | `plugins/structured-dev/config/difficulty-rules.yaml` | 5 维评分规则 + 难度阈值 |
| 归档策略 | `plugins/structured-dev/config/archive-policy.yaml` | 按难度归档天数与条件 |

## Issue 状态定义

| 状态 | 含义 | 适用难度 |
|------|------|---------|
| `pending` | 待开始 | 所有 |
| `in_progress` | 进行中 | 所有 |
| `testing` | 测试中 | 高难度 |
| `completed` | 已完成 | 低难度 |
| `implemented` | 已实现 | 中/高难度 |
| `archived` | 已归档 | 所有 |

## 归档条件（来自 archive-policy.yaml）

| 难度 | 归档条件 | 等待天数 |
|------|---------|---------|
| 低 | status == completed | >7 天 |
| 中 | status == implemented | >14 天 |
| 高 | status == implemented AND test_passed == true | >30 天 |
