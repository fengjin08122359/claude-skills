---
name: init-workflow-context
description: 任务开始前初始化 memory 目录结构，按功能模块分类并加载现有记忆。识别模块关键词，创建缺失目录，输出初始化报告。
version: 1.0.0
triggers:
  - keyword: "开始工作"
  - keyword: "处理这个任务"
  - keyword: "帮我做一下"
  - pattern: ".*新.*开发.*任务.*"
dependencies: []
external_configs:
  - config/modules.yaml
---

# 初始化工作流上下文

**任务开始前的准备工作：初始化 memory 位置并加载现有记忆。**

## 触发时机

- 用户发起新的开发任务
- 用户说 "开始工作"、"处理这个需求"、"帮我做一下"
- 用户提到需要修改代码的任务

## ❌ 不触发场景

- 纯阅读/理解代码
- 问题诊断/分析
- 知识问答
- 搜索定位

## Memory 目录结构（按功能需求分类）

**核心原则：先按功能模块分类，再按难度子分类**

```
memory/
├── MEMORY.md                 # Memory 索引文件（必须存在）
├── modules/                  # 按功能模块分类（一级分类）
│   ├── [模块]-module/
│   │   ├── index.md          # 模块索引
│   │   ├── issues/           # 按难度二级分类
│   │   │   ├── low/          # ≤10分
│   │   │   ├── medium/       # 11-15分
│   │   │   ├── high/         # ≥16分（必须单元测试）
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/    # 单元测试计划
│   │   │   └── archived/
│   │   ├── decisions.md      # 模块级技术决策
│   │   └── learnings.md      # 模块级经验教训
│   └── [其他模块]/
└── project/                  # 项目级记忆
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

**文档位置参考：** 详见 `references/doc-locations.md`

---

## 执行步骤

### 步骤1：识别功能模块

**根据任务内容识别涉及的功能模块：**

模块关键词映射见 `config/modules.yaml`（外置配置）。

**模块识别输出：**

```markdown
## 🔍 功能模块识别

**任务关键词：** [从任务描述提取的关键词]
**涉及模块：** [识别出的模块名称]

| 关键词 | 模块目录 | 存在状态 |
|-------|---------|---------|
| [关键词] | [模块名]-module | 已存在/需创建 |
```

---

### 步骤2：检查 Memory 目录结构

| 目录/文件 | 检查操作 | 缺失处理 |
|----------|---------|---------|
| `memory/` | 目录存在？ | 创建目录 |
| `MEMORY.md` | 文件存在？ | 创建空索引文件 |
| `memory/modules/` | 目录存在？ | 创建目录 |
| `memory/modules/[模块]-module/` | 目录存在？ | 创建模块目录 |
| `memory/modules/[模块]-module/index.md` | 文件存在？ | 创建模块索引 |
| `memory/modules/[模块]-module/issues/` | 目录存在？ | 创建目录 + 各难度子目录 |
| `memory/modules/[模块]-module/requirements/` | 目录存在？ | 创建目录 + 各难度子目录 |
| `memory/modules/[模块]-module/requirements/high/tests/` | 目录存在？ | 创建目录 |
| `memory/project/` | 目录存在？ | 创建目录 + 索引 |

---

### 步骤3：加载现有记忆

**必须加载：**
1. `MEMORY.md` - 总索引
2. `memory/modules/[模块]-module/index.md` - 模块索引

**按需加载：**
- `decisions.md` - 模块级决策
- `learnings.md` - 模块级经验
- `project/conventions.md` - 项目约定
- `project/decisions.md` - 项目级决策

---

### 步骤4：输出初始化报告

```markdown
## 🔄 工作流上下文初始化

### ✅ Memory 目录状态
[目录检查结果表]

### 📚 已加载记忆
[已加载的记忆列表]

### 📋 Issues 分类状态
[按模块按难度的 issue 统计表]

---
**初始化完成，可以开始任务分析。**
```

---

## 初始化脚本模板

详见 `references/memory-templates.md`

---

## 注意事项

1. **先识别模块** — 根据任务关键词识别涉及的功能模块
2. **按模块创建目录** — 确保模块目录结构完整
3. **模块内按难度** — 每个模块内按难度二级分类
4. **高难度特殊处理** — `requirements/high/tests/` 目录必须存在
5. **按模块加载记忆** — 只加载当前任务相关模块的记忆
6. **保留项目记忆** — project/ 目录不按模块分类
