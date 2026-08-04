---
name: finalize-workflow-context
description: 任务完成后按功能模块更新 memory，归档已完成 issues，压缩整理记忆。支持低/中/高难度不同归档条件。
version: 1.0.0
triggers:
  - keyword: "完成了"
  - keyword: "总结一下"
  - keyword: "结束任务"
  - keyword: "好了"
dependencies: []
external_configs:
  - config/archive-policy.yaml
  - config/modules.yaml
---

# 后置工作流上下文整理

**任务完成后的收尾工作：按功能模块分类更新和压缩整理 memory 内容。**

## 触发时机

- 用户表示任务完成："完成了"、"好了"、"结束"
- 用户请求总结："总结一下"、"记录一下"
- 开发任务执行完毕，需要保存关键决策/经验

---

## Memory 分类结构

```
memory/
├── modules/                  # 按功能模块分类
│   ├── [模块]-module/
│   │   ├── issues/
│   │   │   ├── low/          # ≤10分
│   │   │   ├── medium/       # 11-15分
│   │   │   ├── high/         # ≥16分
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/    # 单元测试计划
│   │   │   └── archived/
│   │   └── decisions.md
│   └── [其他模块]/
└── project/                  # 项目级记忆
```

---

## 执行步骤

### 步骤1：识别功能模块并收集信息

| 收集项 | 内容 |
|--------|------|
| **功能模块** | 根据任务关键词识别的模块 |
| **难度等级** | 低/中/高 |
| **修改文件** | 涉及的文件列表 |
| **TDD 结果** | RED/GREEN/REFACTOR 循环 |
| **测试结果** | 覆盖率（高难度）、集成测试结果（中难度） |

### 步骤2：按功能模块更新 Issues

| 难度等级 | Issues 存放目录 |
|---------|----------------|
| 低难度 | `modules/[模块]-module/issues/low/` |
| 中难度 | `modules/[模块]-module/issues/medium/` |
| 高难度 | `modules/[模块]-module/issues/high/` |

执行：更新 issue 状态 → 创建新 issue → 更新模块索引 → 更新 MEMORY.md

### 步骤3：按功能模块更新需求文档

| 难度等级 | 需求文档目录 |
|---------|-------------|
| 低难度 | 通常不创建 |
| 中难度 | `modules/[模块]-module/requirements/medium/` |
| 高难度 | `modules/[模块]-module/requirements/high/` + `tests/` |

### 步骤4：更新模块级和项目级记忆

| 级别 | 文件 | 更新时机 |
|------|------|---------|
| 模块级 | `decisions.md` | 做出模块决策时 |
| 模块级 | `learnings.md` | 学习新知识时 |
| 项目级 | `conventions.md` | 发现新约定时 |
| 项目级 | `decisions.md` | 做出重要决策时 |
| 项目级 | `learnings.md` | 学习通用知识时 |

### 步骤5：按功能模块压缩整理

**归档策略（从 `config/archive-policy.yaml` 读取）：**

| 难度等级 | 归档目录 | 归档条件 |
|---------|---------|---------|
| 低难度 | `modules/[模块]/issues/low/archived/` | completed + >7天 |
| 中难度 | `modules/[模块]/issues/medium/archived/` | implemented + >14天 |
| 高难度 | `modules/[模块]/issues/high/archived/` | implemented + 测试通过 + >30天 |

### 步骤6：输出最终报告

```markdown
## 📝 工作流上下文整理完成

### ✅ Issues 更新（按功能模块）
### ✅ 需求文档更新（按功能模块）
### ✅ 模块和项目记忆更新
### 📊 Memory 整理结果
```

---

## 注意事项

1. **按模块分类更新** — 不同模块存入不同目录
2. **模块内按难度** — 在模块目录内按难度二级分类
3. **高难度特殊处理** — 测试计划保留供参考
4. **归档条件不同** — 低难度 7天，中难度 14天，高难度 30天
5. **索引同步更新** — 模块索引 + 总索引都要更新
6. **模块记忆更新** — decisions.md 和 learnings.md 按模块存储
