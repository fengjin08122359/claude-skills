---
name: finalize-workflow-context
description: TRIGGER this skill AFTER completing a development task. Updates and compresses memory files organized by functional modules (user-module, import-module, etc.) first, then by difficulty (low/medium/high) within each module. Issues and requirements are stored in feature-module directories. Use when user says "完成了", "总结一下", "结束任务", or when the main development work is done. Essential for maintaining clean and useful memory across sessions.
---

# 后置工作流上下文整理

**任务完成后的收尾工作：按功能模块分类更新和压缩整理 memory 内容。**

## 触发时机

- 用户表示任务完成："完成了"、"好了"、"结束"
- 用户请求总结："总结一下"、"记录一下"
- 开发任务执行完毕，需要保存关键决策/经验

---

## Memory 分类结构（按功能模块）

**核心原则：先按功能模块分类，再按难度子分类**

```
memory/
├── modules/                  # 按功能模块分类（一级分类）
│   ├── user-module/          # 用户模块
│   │   ├── issues/
│   │   │   ├── low/          # 低难度 (≤10分)
│   │   │   ├── medium/       # 中难度 (11-15分)
│   │   │   ├── high/         # 高难度 (≥16分)
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/    # 单元测试计划
│   │   │   └── archived/
│   │   └── decisions.md      # 模块级决策
│   │
│   ├── [其他模块]-module/
│   │   └── ...
│
└── project/                  # 项目级记忆
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

---

## 执行步骤

### 步骤1：识别功能模块并收集信息

**从当前对话收集：**

| 收集项 | 内容 |
|--------|------|
| **功能模块** | 根据任务关键词识别的模块（如 user-module） |
| **难度等级** | 低/中/高 |
| **修改文件** | 涉及的文件列表 |
| **TDD 结果** | RED/GREEN/REFACTOR 循环 |
| **测试结果** | 单元测试覆盖率（高难度）、集成测试结果（中难度） |

**模块识别输出：**

```markdown
## 🔍 功能模块识别

**任务关键词：** [关键词]
**涉及模块：** [模块名]-module
**模块路径：** modules/[模块]-module/

| 关键词 | 模块目录 | 存在状态 |
|-------|---------|---------|
| user | user-module | 已存在 |
| import | import-module | 已存在 |
```

---

### 步骤2：按功能模块更新 Issues

**确定 Issues 存放目录：**

| 难度等级 | Issues 存放目录 |
|---------|----------------|
| 低难度 | `modules/[模块]-module/issues/low/` |
| 中难度 | `modules/[模块]-module/issues/medium/` |
| 高难度 | `modules/[模块]-module/issues/high/` |

**检查当前 Issues 状态：**

```markdown
## 📋 Issues 更新分析

### 功能模块分类

**主要模块：** [模块名]-module
**模块路径：** modules/[模块]-module/

### 本次任务涉及的 Issues

| Issue ID | 模块 | 难度目录 | 原状态 | 新状态 | TDD 结果 |
|----------|------|---------|--------|--------|---------|
| user-module/low-001 | user-module | issues/low/ | pending | completed | ✓ RED→GREEN→功能验证 |
| user-module/medium-002 | user-module | issues/medium/ | pending | implemented | ✓ RED→GREEN→集成测试 |
| user-module/high-003 | user-module | issues/high/ | pending | implemented | ✓ 单元测试通过，85% |

### 新创建的 Issues

| Issue ID | 模块 | 难度 | 存储路径 |
|----------|------|------|---------|
| user-module/low-004 | user-module | 低 | modules/user-module/issues/low/ |
| import-module/medium-005 | import-module | 中 | modules/import-module/issues/medium/ |

### 模块索引更新

- 更新 `modules/[模块]-module/index.md`
- 更新 `modules/[模块]-module/issues/index.md`
```

**执行更新：**

1. 更新涉及的 issue 文件（状态、TDD 结果）
2. 创建新 issue 文件（存入对应模块的对应难度目录）
3. 更新模块级索引文件
4. 更新总索引 `MEMORY.md`

---

### 步骤3：按功能模块更新需求文档

**确定需求文档目录：**

| 难度等级 | 需求文档目录 |
|---------|-------------|
| 低难度 | 通常不创建 |
| 中难度 | `modules/[模块]-module/requirements/medium/` |
| 高难度 | `modules/[模块]-module/requirements/high/` + `tests/` |

**检查需求文档状态：**

```markdown
## 📄 需求文档更新分析

### 功能模块分类

**主要模块：** [模块名]-module

### 需求文档处理

#### 低难度任务

- 不创建需求文档，仅更新 issues

#### 中难度任务

| 求 ID | 模块 | 存储路径 | 状态更新 |
|----------|------|---------|---------|
| user-medium-req-001 | user-module | modules/user-module/requirements/medium/ | approved → implemented |

#### 高难度任务

| 求 ID | 模块 | 存储路径 | 单元测试 | 覆盖率 |
|----------|------|---------|---------|--------|
| user-high-req-001 | user-module | modules/user-module/requirements/high/ | ✓ 通过 | 85% |

**单元测试计划更新：**

| 测试计划文件 | 模块 | 存储路径 | 更新内容 |
|-------------|------|---------|---------|
| test-plan-001.md | user-module | modules/user-module/requirements/high/tests/ | 添加实际结果 |
```

**执行更新：**

1. 更新需求文档状态
2. 更新测试计划文件（高难度）
3. 更新模块级索引文件

---

### 步骤4：更新模块级和项目级记忆

**模块级记忆：**

存放在 `modules/[模块]-module/`：

| 文件 | 内容 | 更新时机 |
|------|------|---------|
| `decisions.md` | 模块级技术决策 | 做出模块决策时 |
| `learnings.md` | 模块级经验教训 | 学习新知识时 |

**项目级记忆：**

存放在 `memory/project/`：

| 文件 | 内容 | 更新时机 |
|------|------|---------|
| `conventions.md` | 项目约定 | 发现新约定时 |
| `decisions.md` | 项目级决策 | 做出重要决策时 |
| `learnings.md` | 项目级经验教训 | 学习通用知识时 |

**更新内容：**

```markdown
## 📝 模块和项目记忆更新

### 模块记忆更新

**模块：** [模块名]-module

| 文件 | 更新内容 |
|------|---------|
| decisions.md | 模块级技术决策 |
| learnings.md | 模块级经验教训 |

### 项目记忆更新

| 文件 | 更新内容 |
|------|---------|
| decisions.md | 项目级决策 |
| learnings.md | 项目级经验教训 |
```

---

### 步骤5：按功能模块压缩整理

**压缩策略（按模块内难度）：**

| 难度等级 | 归档目录 | 归档条件 |
|---------|---------|---------|
| 低难度 | `modules/[模块]/issues/low/archived/` | completed + >7天 |
| 中难度 | `modules/[模块]/issues/medium/archived/` | implemented + >14天 |
| 高难度 | `modules/[模块]/issues/high/archived/` | implemented + 测试通过 + >30天 |

**归档操作：**

```markdown
## 🔄 Memory 压缩整理

### 按功能模块归档

#### user-module 归档

| 难度目录 | 归档数量 | 归档条件 |
|---------|---------|---------|
| issues/low/ | 3 个 | completed + >7天 |
| issues/medium/ | 2 个 | implemented + >14天 |
| issues/high/ | 1 个 | implemented + 测试通过 + >30天 |
| requirements/medium/ | 1 个 | implemented + >14天 |
| requirements/high/ | 1 个 | implemented + 测试通过 + >30天 |

**归档路径：**
- issues → `modules/user-module/issues/[难度]/archived/`
- requirements → `modules/user-module/requirements/[难度]/archived/`
- 测试计划保留在 `modules/user-module/requirements/high/tests/`（供参考）

#### import-module 归档

| 难度目录 | 归档数量 | 归档条件 |
|---------|---------|---------|
| issues/low/ | 1 个 | completed + >7天 |

**归档路径：**
- issues → `modules/import-module/issues/low/archived/`

### 合并重复（按模块）

| 模块 | 目录 | 合并数量 | 合并方式 |
|------|------|---------|---------|
| user-module | issues/low/ | 2 个 | 标题相似 → 合并 |
| import-module | issues/medium/ | 1 个 | 功能相似 → 合并 |

### 索引更新

- 更新各模块的 `index.md`
- 更新各模块的 `issues/index.md`
- 更新各模块的 `requirements/index.md`
- 更新总索引 `MEMORY.md`
```

---

### 步骤6：输出最终报告

**输出格式：**

```markdown
## 📝 工作流上下文整理完成

### ✅ Issues 更新（按功能模块）

#### user-module Issues

| 难度 | 操作 | 数量 | 详情 |
|------|------|------|------|
| 低 | 状态更新 | 2 | low-001 → completed, low-002 → completed |
| 低 | 新创建 | 1 | low-004 (添加错误提示) |
| 低 | 归档 | 3 | >7天 completed |
| 中 | 状态更新 | 1 | medium-001 → implemented |
| 中 | 归档 | 2 | >14天 implemented |
| 高 | 状态更新 | 1 | high-001 → implemented (单元测试通过) |
| 高 | 归档 | 1 | >30天 + 测试通过 |

**user-module Issues 当前状态：**
- 低难度：5 pending, 10 completed
- 中难度：3 pending, 5 implemented
- 高难度：2 pending (含单元测试), 3 implemented

#### import-module Issues

| 难度 | 操作 | 数量 | 详情 |
|------|------|------|------|
| 低 | 状态更新 | 1 | low-001 → completed |
| 低 | 归档 | 1 | >7天 completed |

**import-module Issues 当前状态：**
- 低难度：2 pending, 5 completed

### ✅ 需求文档更新（按功能模块）

#### user-module Requirements

| 难度 | 操作 | 数量 | 详情 |
|------|------|------|------|
| 中 | 状态更新 | 1 | medium-req-001 → implemented |
| 中 | 归档 | 1 | >14天 implemented |
| 高 | 状态更新 | 1 | high-req-001 → implemented |
| 高 | 测试计划更新 | 1 | test-plan-001 添加结果 (覆盖率 85%) |
| 高 | 归档 | 1 | >30天 + 测试通过 (测试计划保留) |

#### import-module Requirements

- 无需求文档（低难度任务）

### ✅ 模块和项目记忆更新

#### 模块记忆

| 模块 | 文件 | 更新内容 |
|------|------|---------|
| user-module | decisions.md | 模块级技术决策 |
| user-module | learnings.md | 模块级经验教训 |

#### 项目记忆

| 文件 | 更新内容 |
|------|---------|
| decisions.md | 项目级决策 |
| learnings.md | 项目级经验教训 |

### 📊 Memory 整理结果

- 各模块索引已更新
- 按模块归档已完成
- 合并重复已完成
- Memory 保持简洁有序，按功能模块分类清晰

---

**整理完成，Memory 已按功能模块分类更新。**
```

---

## 注意事项

1. **按模块分类更新** - 不同模块存入不同目录
2. **模块内按难度** - 在模块目录内按难度二级分类
3. **高难度特殊处理** - 测试计划保留供参考
4. **归档条件不同** - 低难度 7天，中难度 14天，高难度 30天
5. **索引同步更新** - 模块索引 + 总索引都要更新
6. **模块记忆更新** - decisions.md 和 learnings.md 按模块存储