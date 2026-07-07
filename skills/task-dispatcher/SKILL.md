---
name: "task-dispatcher"
description: "Intelligent task router that dispatches to the correct workflow (Bug Fix, Feature Development, Refactoring, Task Breakdown). TRIGGER for ANY task request including: bug fixes, new features, code refactoring, complex task decomposition, or when user says '帮我做xxx', '修复bug', '开发功能', '重构代码', '拆分任务'. Automatically detects task type and routes to appropriate skill chain."
---

# Task Dispatcher - 智能任务分发器

## 🎯 核心定位

**统一的任务入口**，自动识别用户意图并路由到四种标准工作流之一。

## ⚡ 触发条件（必须全部支持）

### ✅ 显式触发
- 用户明确说："帮我修复 XXX bug"、"开发一个新功能"、"重构这段代码"
- 用户提出具体的技术任务请求
- 用户要求执行某项代码修改工作

### 🔄 模糊需求触发
- 用户描述问题但不确定如何处理（如"这里有点问题"、"需要优化一下"）
- 用户提出混合型需求（既包含 bug 又包含新功能）
- 用户表达改进意愿但未明确类型

### 💡 主动推荐触发
- 检测到用户正在讨论复杂任务但未使用结构化流程时
- 当用户的需求明显适合某种工作流但用户未主动调用时
- 在对话开始或新任务提出时，如果检测到可优化的流程机会

## 🔀 四大工作流路由矩阵

### 路由决策树

```
用户输入任务
    ↓
📊 [阶段1: 任务分类]
    ↓
判断主要特征？
    │
    ├─ 包含错误/异常/故障 → 🐛 Bug 修复工作流
    │   关键词：报错、bug、崩溃、异常、不工作、失败
    │
    ├─ 包含新增/添加/实现 → ✨ 新功能开发工作流
    │   关键词：新增、添加、实现、开发、做一个、支持
    │
    ├─ 包含优化/整理/迁移 → ♻️ 代码重构工作流
    │   关键词：优化、重构、整理、迁移、简化、改进架构
    │
    └─ 包含复杂/大型/拆分 → 📋 问题拆分工作流
        关键词：拆分、规划、分析、设计、EPIC、Sprint
```

### 详细分类规则

#### 🐛 **Bug 修复** (Bug Fix Workflow)

**识别信号：**
- ❌ 错误信息、异常堆栈
- ❌ 功能不符合预期
- ❌ 性能问题、崩溃
- ❌ 测试失败
- ❌ 用户反馈的问题

**典型用户表述：**
- "这个功能报错了"
- "帮我修复 XXX bug"
- "为什么这里会崩溃"
- "性能太慢了"

**路由目标 Skill 链：**

```text
structured-requirement-confirmation → ce-debug/diagnose → [修复] → tdd/jest-test-generator → TRAE-code-review → ce-commit
```

---

#### ✨ **新功能开发** (Feature Development Workflow)

**识别信号：**
- ➕ 新增功能、特性
- ➕ 实现新的业务逻辑
- ➕ 创建新页面/组件/API
- ➕ 支持新的用户场景

**典型用户表述：**
- "帮我实现 XXX 功能"
- "添加一个导出功能"
- "开发一个新的登录页面"
- "支持批量操作"

**路由目标 Skill 链：**

```text
[需求清晰？]
├─ 是 → structured-requirement-confirmation → dev-help → ce-plan → ce-work/lfg → [测试] → ce-commit-push-pr
└─ 否 → ce-brainstorm/ce-ideate → dev-help → ce-plan → ce-work → [测试] → ce-commit-push-pr
```

**特殊变体：**
- 小程序/H5 → `TRAE-generate-mini-app` 替代 `ce-work`
- UI 界面 → `ce-frontend-design` 参与设计阶段
- 全自动化简单需求 → 直接使用 `lfg`

---

#### ♻️ **代码重构** (Refactoring Workflow)

**识别信号：**
- 🔧 改善现有代码质量
- 🔧 技术栈升级/迁移
- 🔧 架构调整
- 🔧 代码清理和优化

**典型用户表述：**
- "帮我把 Options API 改成 Composition API"
- "优化一下这段代码"
- "迁移到 TypeScript"
- "重构这个模块"

**路由目标 Skill 链：**

```text
[重构规模判断]
├─ 小规模 → dev-advisor → ce-simplify-code → TRAE-code-review → ce-commit
├─ 中等规模 → improve-codebase-architecture → ce-plan → ce-work → [测试] → ce-commit-push-pr
└─ 大规模 → improve-codebase-architecture → to-issues → [逐个 Issue 执行]
```

**特殊变体：**
- Vue 迁移 → `page-component-migration`
- TypeScript 优化 → `typescript-type-generator` + `dev-advisor`
- 性能优化 → `ce-optimize` + `diagnose`

---

#### 📋 **问题拆分** (Task Breakdown Workflow)

**识别信号：**
- 📊 复杂/大型任务需要分解
- 📊 EPIC/Sprint 规划
- 📊 团队协作任务分配
- 📊 不确定如何入手的模糊需求

**典型用户表述：**
- "这个需求太大，帮我拆分一下"
- "制定一个实施计划"
- "如何完成这个复杂项目"
- "帮我规划一下 Sprint"

**路由目标 Skill 链：**

```text
[拆分目的]
├─ 个人执行 → dev-help + ce-plan + progress-tracker
├─ 团队协作 → to-issues + triage + ce-doc-review
└─ 正式文档 → ce-brainstorm → to-prd → ce-proof
```

## 🎬 执行流程

### 阶段 1：智能识别（必须执行）

**步骤：**

1. **分析用户输入**
   - 提取关键词和意图
   - 判断任务类型置信度
   - 检测是否为混合型需求

2. **输出分类结果**

```markdown
## 🎯 任务识别结果

**任务类型：** [Bug 修复 / 新功能开发 / 代码重构 / 问题拆分]
**置信度：** [高/中/低]
**推荐工作流：** [对应的工作流名称]

**识别依据：**
- 关键词匹配：[列出匹配的关键词]
- 上下文分析：[简要说明判断理由]

**检测到的特殊需求：**
- [如有 UI 相关 → 标注需 ce-frontend-design]
- [如有小程序 → 标注需 TRAE-generate-mini-app]
- [如有测试需求 → 标注需 tdd/jest-test-generator]
```

3. **等待确认**
   - 使用 `AskUserQuestion` 让用户确认分类结果
   - 提供 4 个选项对应 4 种工作流
   - 允许用户手动修正分类

### 阶段 2：加载对应工作流

根据用户确认的类型，立即启动对应的 Skill 链：

| 用户选择 | 加载的 Skill 链 | 说明 |
|---------|----------------|------|
| **Bug 修复** | 见上方 Bug 修复链 | 优先诊断后修复 |
| **新功能开发** | 见上方新功能开发链 | 先规划后执行 |
| **代码重构** | 见上方代码重构链 | 小步快跑 |
| **问题拆分** | 见上方问题拆分链 | 层层分解 |

### 阶段 3：执行监控

在执行过程中：

1. **进度跟踪**
   - 使用 `progress-tracker` 记录关键里程碑
   - 定期输出状态更新

2. **质量门禁**
   - 每个阶段完成后调用 `TRAE-code-review`（代码修改类）
   - 测试验证（如适用）

3. **异常处理**
   - 发现需求变更 → 回到阶段 1 重新分类
   - 技术阻塞 → 建议替代方案或暂停等待

## 🔄 混合需求处理策略

### 场景 1：主次分明

**示例：** "修复登录 bug，顺便优化一下界面"

**处理方式：**
1. 主任务：Bug 修复（登录）
2. 次要任务：代码重构（UI 优化）
3. **顺序执行**：先修 bug → 再重构
4. **独立提交**：每个任务单独 commit

**输出格式：**

```markdown
## 🔀 混合需求拆解

**检测到多个任务类型：**

| 优先级 | 任务类型 | 任务描述 | 推荐工作流 |
|-------|---------|---------|-----------|
| 1 | 🐛 Bug 修复 | 登录功能异常 | Bug 修复工作流 |
| 2 | ♻️ 代码重构 | 登录页 UI 优化 | 代码重构工作流 |

**建议执行顺序：** 先修复 Bug → 再进行重构

**原因：** 基于稳定代码重构比基于 bug 代码更安全
```

### 场景 2：边界模糊

**示例：** "这个模块需要大改"

**处理方式：**
1. 先进入 **问题拆分** 工作流
2. 明确具体包含哪些子任务
3. 为每个子任务确定类型
4. 再逐一执行对应工作流

## 📋 快速参考卡片

### 决策速查表

| 你听到... | 路由到... | 首个 Skill |
|-----------|----------|-----------|
| "报错/bug/崩溃/不工作" | 🐛 Bug 修复 | `ce-debug` |
| "新增/添加/实现/开发" | ✨ 新功能开发 | `dev-help` 或 `ce-brainstorm` |
| "优化/重构/迁移/整理" | ♻️ 代码重构 | `dev-advisor` 或 `improve-codebase-architecture` |
| "拆分/规划/设计/复杂" | 📋 问题拆分 | `dev-help` 或 `to-issues` |
| "全自动完成/不要问我" | 🚀 全自动化 | `lfg` |
| "帮我看看怎么做" | 💡 需求探索 | `ce-ideate` 或 `ce-brainstorm` |

### 特殊场景快捷路由

| 场景 | Skill 链 |
|-----|---------|
| **微信小程序** | `TRAE-generate-mini-app` → `ce-work` → PR |
| **Excel/PDF 处理** | `xlsx` / `pdf` → 处理逻辑 → `ce-commit` |
| **UI 界面设计** | `ce-frontend-design` → 实现 → `ce-demo-reel` → PR |
| **紧急生产 Bug** | `diagnose` → 快速修复 → `tdd` → `ce-commit`（跳过部分流程） |
| **架构级重构** | `improve-codebase-architecture` → `to-issues` → 逐个 `ce-work` |
| **Sprint 规划** | `dev-help` → `to-issues` → `triage` → `progress-tracker` |

## ⚙️ 高级配置

### 自定义路由规则（可选）

如果项目有特殊需求，可在本 Skill 的配置中添加自定义路由规则：

```yaml
custom_routes:
  - trigger: "数据库相关"
    workflow: "database-migration"
    skills: ["diagnose", "ce-plan", "ce-work"]
  - trigger: "API 接口"
    workflow: "api-development"
    skills: ["api-mock-generator", "ce-work", "jest-test-generator"]
```

### 工作流模板扩展

可以根据项目特点定义新的工作流模板：

```yaml
workflow_templates:
  name: "mobile-feature-development"
  description: "移动端功能开发专用流程"
  steps:
    - skill: "ce-brainstorm"
      condition: "需求模糊"
    - skill: "dev-help"
      always: true
    - skill: "ce-plan"
      always: true
    - skill: "ce-frontend-design"
      condition: "包含 UI 变更"
    - skill: "ce-work"
      always: true
    - skill: "playwright-element-test"
      condition: "需要端到端测试"
    - skill: "ce-commit-push-pr"
      always: true
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **始终从分类开始** - 不要假设用户意图，先明确再行动
2. **允许用户修正** - 分类结果仅是建议，用户拥有最终决定权
3. **保持透明度** - 输出分类依据，让用户理解路由逻辑
4. **灵活处理混合需求** - 不要强制归为一类，合理拆分
5. **记录决策过程** - 使用 `ce-compound` 记录特殊案例的路由决策

### ❌ 避免做法

1. **跳过分类直接执行** - 即使看起来很明显也要确认
2. **忽略用户的隐性需求** - 深入分析而不仅匹配关键词
3. **过度拆分简单任务** - 不要把简单任务复杂化
4. **频繁切换工作流** - 一旦确定就坚持执行，除非需求变更
5. **忘记质量门禁** - 每个工作流都有内置的质量检查点

## 📊 示例对话

### 示例 1：明确的 Bug 修复

**用户：** "登录页面点击按钮没反应"

**Task Dispatcher 输出：**

```markdown
## 🎯 任务识别结果

**任务类型：** 🐛 Bug 修复
**置信度：** 高（95%）
**推荐工作流：** Bug 修复工作流

**识别依据：**
- 关键词匹配："没反应" → 功能异常
- 上下文分析：明确的功能故障描述

**建议执行流程：**
1. `structured-requirement-confirmation` - 确认影响范围
2. `ce-debug` - 诊断根因
3. 修复代码
4. `jest-test-generator` - 补充回归测试
5. `TRAE-code-review` - 审查修改
6. `ce-commit` - 提交修复

请确认是否按此流程执行？
[✅ 确认执行] [🔧 修改为新功能] [♻️ 修改为重构] [📋 需要先拆分]
```

### 示例 2：模糊的新功能需求

**用户：** "我们需要一个数据导出功能"

**Task Dispatcher 输出：**

```markdown
## 🎯 任务识别结果

**任务类型：** ✨ 新功能开发
**置信度：** 中（70%）
**推荐工作流：** 新功能开发工作流

**识别依据：**
- 关键词匹配："需要一个...功能" → 新增功能
- 上下文分析：需求较模糊，缺少细节（格式？范围？权限？）

**检测到的待澄清点：**
- 导出格式？（Excel/PDF/CSV）
- 导出范围？（当前页/筛选结果/全量）
- 权限控制？（所有用户/特定角色）

**建议执行流程：**
1. `ce-brainstorm` - 讨论需求细节
2. `dev-help` - 拆分为可执行任务
3. `ce-plan` - 制定实施计划
4. `ce-work` - 开发实现
5. [测试验证]
6. `ce-commit-push-pr` - 交付

或者，如果你已经想清楚了所有细节，我可以直接进入 `structured-requirement-confirmation` 开始执行。

请选择：
[💬 先讨论需求] [▶️ 直接开始执行] [📋 需要先拆分任务] [🔧 这其实是修复某个问题]
```

### 示例 3：复杂的混合需求

**用户：** "用户中心模块需要大改，既要修复已知的权限 bug，又要重新设计 UI，还要支持多租户"

**Task Dispatcher 输出：**

```markdown
## 🎯 任务识别结果

**任务类型：** 📋 问题拆分（优先）+ 混合需求
**置信度：** 高（90%）
**推荐工作流：** 先拆分再逐个执行

**识别依据：**
- 关键词匹配："大改"、"既要...又要...还要..." → 复杂多维度需求
- 上下文分析：涉及 Bug 修复 + UI 重构 + 新功能，且提到"用户中心模块"（影响面广）

## 🔀 混合需求拆解

**检测到 3 个子任务：**

| 优先级 | 任务类型 | 任务描述 | 影响范围估计 |
|-------|---------|---------|-------------|
| 1 | 🐛 Bug 修复 | 权限控制异常 | 中（可能影响安全性）|
| 2 | ♻️ 代码重构 | UI 重新设计 | 中-高（用户体验相关）|
| 3 | ✨ 新功能开发 | 多租户支持 | 高（架构级变更）|

**建议执行策略：**

**方案 A（推荐）：先拆分再执行**
1. `dev-help` + `to-issues` - 将 3 个子任务拆为独立 Issue
2. `triage` - 确定优先级和依赖关系
3. 逐个 Issue 执行对应工作流
4. 每个完成后 `ce-commit`，最后统一 PR

**方案 B：快速路径（如果时间紧）**
1. `improve-codebase-architecture` - 整体评估影响
2. 按 Bug → 重构 → 新功能 顺序串行执行
3. 风险较高，可能需要返工

请选择执行方案：
[📋 方案A：先拆分（推荐）] [⚡ 方案B：快速执行] [💬 我想先讨论下方案]
```

## 🔗 与其他 Skill 的关系

### 上游 Skill（可能调用本 Skill）
- 无（本 Skill 是顶层入口）

### 下游 Skill（本 Skill 会调用）
- **核心工作流 Skills：**
  - `ce-debug`, `diagnose` - Bug 诊断
  - `ce-work`, `lfg` - 任务执行
  - `dev-advisor`, `improve-codebase-architecture` - 重构分析
  - `dev-help`, `to-issues` - 任务拆分

- **辅助 Skills：**
  - `structured-requirement-confirmation` - 需求确认
  - `ce-brainstorm`, `ce-ideate` - 需求探索
  - `ce-plan` - 规划
  - `tdd`, `jest-test-generator`, `playwright-element-test` - 测试
  - `TRAE-code-review`, `TRAE-security-review` - 审查
  - `ce-commit`, `ce-commit-push-pr` - 提交交付
  - `progress-tracker` - 进度跟踪
  - `ce-compound` - 知识沉淀

### 协作 Skills（并行或互补）
- `ce-sessions` - 查询历史经验
- `issue-knowledge-base` - 查询已知问题
- `best-practice-library` - 参考最佳实践

## 📈 度量与反馈

### 成功指标
- **分类准确率** ≥ 90%（用户确认的分类与最终执行一致）
- **路由效率** - 平均在 2 轮对话内进入正确的工作流
- **用户满意度** - 用户很少需要手动修正分类

### 反馈收集
每次任务完成后，记录：
1. 初始分类 vs 最终执行的差异
2. 用户是否手动修正了分类
3. 是否有遗漏的特殊需求未被检测到
4. 使用 `ce-compound` 记录典型案例，持续优化路由规则

## 🚀 未来扩展方向

### 可能的新工作流
- **性能优化专项** - 针对 CPU/内存/网络优化的专门流程
- **安全加固专项** - 安全审计和漏洞修复的标准流程
- **技术债务偿还** - 系统化处理技术债务的工作流
- **DevOps 流水线** - CI/CD 配置和基础设施代码的开发流程

### 智能化增强
- 基于历史数据的路由预测
- 项目特定的路由规则学习
- 自动检测混合需求的最佳拆分策略
