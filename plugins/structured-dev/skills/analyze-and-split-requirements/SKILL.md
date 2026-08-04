---
name: analyze-and-split-requirements
description: 接收新开发需求时，进行 5 维问题扫描、内容确认、功能模块识别、难度评分、决策记录，并按 tracer-bullet 拆分为可执行 issues。
version: 1.0.0
triggers:
  - keyword: "帮我实现"
  - keyword: "需要做"
  - keyword: "开发"
  - pattern: ".*新.*需求.*"
dependencies:
  - init-workflow-context
  - coding-principles
  - finalize-workflow-context
external_configs:
  - config/modules.yaml
  - config/difficulty-rules.yaml
---

# 分析需求并拆分（需求开发场景）

**接收新需求时：澄清需求、识别功能模块、确认内容、记录决策、评估难度、拆分可执行的 issues，确保 TDD 开发流程。**

## 触发时机

- ✅ 用户提出新的开发需求："帮我实现 X"、"需要做 Y 功能"
- ✅ 用户提出需求描述文档（PRD、设计文档、迁移计划等）
- ✅ 用户要求处理某个开发任务："开发某个模块"、"合并代码"
- ✅ 用户提出涉及代码变更的任务

## 核心流程

```
接收新需求 → 加载模块记忆 → 识别功能模块 → 需求澄清(5维扫描) → 内容确认 → 难度评分 → 拆分 issues → TDD 实现
```

---

## 需求澄清阶段

### 5维问题扫描框架

| 维度 | 扫描问题 | 检查点 |
|------|---------|--------|
| **Who** | 谁是用户？谁是开发者？ | 用户角色、权限 |
| **What** | 需要做什么？ | 功能描述、输入输出、边界条件 |
| **Where** | 在哪里实现？ | 模块位置、文件路径、架构层次 |
| **When** | 何时使用？ | 使用时机、依赖关系 |
| **Why** | 为什么需要？ | 业务目标、用户痛点 |

详见 `references/5d-scan-framework.md`

---

## 内容确认阶段

### 为什么需要内容确认？

- ✅ 避免基于错误假设拆分任务
- ✅ 确保拆分方案符合实际需求
- ✅ 识别关键决策点，明确合并策略

### 确认流程

1. 检查是否有详细文档（PRD、迁移计划等）
2. 分类确认内容（配置文件/基础架构/新功能/现有功能/资源/工具）
3. 提出关键确认问题
4. 等待用户确认
5. **记录决策结果**（参考 `references/decision-records.md`）

---

## 功能模块识别

模块关键词映射从 `config/modules.yaml` 读取。

识别输出：
```markdown
## 🔍 功能模块识别

**任务类型：** [新功能开发 / 功能增强 / 代码重构 / 迁移合并 / Bug修复]
**主要模块：** [模块名]-module
**关联模块：** [其他模块]
**存储路径：** modules/[模块]-module/
```

---

## 开发难度评分框架

**评分规则从 `config/difficulty-rules.yaml` 读取。**

| 维度 | 1分 | 3分 | 5分 |
|-----|-----|-----|-----|
| 文件数量 | 1-2个 | 3-5个 | 6+个 |
| 依赖复杂度 | 独立模块 | 2-3模块交互 | 4+模块或核心架构 |
| 需求明确度 | 非常清晰 | 2-3模糊点 | 4+模糊点 |
| 技术风险 | 常规实现 | 新技术或重构 | 架构变更 |
| 业务复杂度 | 简单增删改 | 业务规则变更 | 核心流程 |

| 总分 | 难度 | 处理策略 | 测试要求 |
|-----|------|---------|---------|
| ≤10分 | 低 | 直接拆分 issues | TDD + 功能验证 |
| 11-15分 | 中 | 澄清后拆分 | TDD + 集成测试 |
| ≥16分 | 高 | 拆分子需求 + 用户确认 | **必须单元测试** + TDD + 集成测试 |

---

## Phase 拆分（高难度）

详见 `references/phase-splitting.md`

---

## Memory 存储路径

Issues 和 requirements 存入对应模块目录：

```
modules/[模块]-module/
├── issues/[low|medium|high]/
├── requirements/[medium|high]/
│   └── high/tests/    # 单元测试计划
└── decisions.md       # 决策记录
```

---

## Issue 文件模板

详见 `templates/issue-high.md` 和 `templates/requirement-high.md`

---

## 注意事项

1. **需求澄清优先** — 使用 5 维问题扫描框架
2. **模块识别** — 根据任务关键词识别功能模块
3. **Phase 拆分** — 高难度按 Phase 拆分，确保端到端可测试
4. **端到端切片** — 使用 tracer-bullet vertical slices
5. **按模块存储** — Issues 和 requirements 存入对应模块目录
6. **高难度必须单元测试** — 单元测试是高难度任务的硬性要求
7. **所有任务必须 TDD** — 无论难度等级
8. **记录业务价值** — 每个 Issue 都要记录 Why
