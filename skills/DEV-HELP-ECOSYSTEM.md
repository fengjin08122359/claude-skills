# Dev Help Skill 生态系统

本文档描述了 dev-help 及其配套 skills 组成的完整任务规划生态系统。

## 架构概览

```
┌─────────────────────────────────────────────┐
│           用户交互层                         │
│         (VS Code / IDE)                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          dev-help                           │
│       (主规划师 - 协调者)                    │
│                                             │
│  • 需求分析和澄清                           │
│  • 任务拆解和评估                           │
│  • 生成任务计划                             │
│  • 调用其他 skills                          │
│  • 跟踪执行进度                             │
└──┬────────────┬──────────────┬──────────────┘
   │ 调用       │ 查询         │ 调用
   ▼            ▼              ▼
┌──────────┐ ┌──────────────┐ ┌──────────────────┐
│ step-    │ │ best-        │ │ progress-        │
│ executor │ │ practice-    │ │ tracker          │
│          │ │ library      │ │                  │
│ 执行引擎  │ │ 最佳实践库    │ │ 进度跟踪器        │
└──────────┘ └──────────────┘ └──────────────────┘
     │                              │
     │ 可选调用                      │ 自动调用
     ▼                              ▼
┌──────────────────┐      ┌──────────────────┐
│ dev-advisor      │      │ (持久化存储)      │
│                  │      │                  │
│ 代码质量审查      │      │ 进度数据存储      │
└──────────────────┘      └──────────────────┘
```

## Skills 详细说明

### 1. dev-help (主规划师)

**位置**: `.lingma/skills/dev-help/SKILL.md`

**职责**:
- 作为用户需求分析和任务规划的主要入口
- 深入理解用户需求,识别模糊点
- 将复杂需求拆分为2小时可完成的任务单元
- 评估任务复杂度和风险
- 生成结构化的任务计划
- 协调调用其他 skills
- 跟踪任务执行进度

**触发方式**:
- 显式：用户主动调用 `@dev-help [需求描述]`
- 隐式：检测到关键词(实现、添加、修复、重构等)

**核心特性**:
- 交互式需求澄清
- 四维度复杂度评估(技术/业务/依赖/测试)
- 风险评估和缓冲时间计算
- 任务模板库支持
- 与 progress-tracker 集成

**输出格式**:
- Markdown 格式的任务计划
- 包含复杂度评分和时间估算
- 标注任务依赖关系
- 提供风险提示和建议

**配置文件**: `.dev-helprc.json` (可选)

---

### 2. progress-tracker (进度跟踪器)

**位置**: `.lingma/skills/progress-tracker/SKILL.md`

**职责**:
- 接收并存储 dev-help 生成的任务计划
- 跟踪每个任务的执行状态
- 支持跨会话进度恢复
- 生成进度报告和统计
- 管理任务生命周期

**数据模型**: `ProjectProgress`
- 项目ID和名称
- 任务列表及状态
- 开始时间和预计完成时间
- 实际耗时统计
- 进度百分比

**核心特性**:
- 跨会话持久化
- 断点续传支持
- 进度可视化
- 历史数据分析
- 导出进度报告

**调用时机**:
- dev-help 在第四阶段(逐步执行)开始时自动调用
- 每个任务完成后更新进度
- 用户查询进度时读取数据

---

### 3. step-executor (步骤执行器)

**位置**: `.lingma/skills/step-executor/SKILL.md`

**职责**:
- 接收 dev-help 生成的任务计划
- 将任务拆解为更细的原子化步骤
- 逐步执行并验证每个步骤
- 处理执行中的错误和异常
- 向 progress-tracker 报告进度

**与 dev-help 的关系**:
- **可选组件**: dev-help 可以只负责任务规划,不执行
- **完整模式**: dev-help + step-executor 实现从规划到执行的闭环
- **灵活切换**: 用户可以选择不执行,只获取任务计划

**调用场景**:
- 用户确认任务计划后,选择"开始执行"
- dev-help 调用 step-executor 执行具体任务
- step-executor 自动调用 progress-tracker 更新进度

---

### 4. best-practice-library (最佳实践库)

**位置**: `.lingma/skills/best-practice-library/SKILL.md`

**职责**:
- 存储和管理项目开发的最佳实践模式
- 根据任务类型推荐合适的实施方案
- 提供参考模板和代码示例
- 帮助 dev-help 生成更准确的任务计划

**与 dev-help 的协作**:
- dev-help 在任务拆解时查询最佳实践
- 根据技术栈和场景匹配推荐模式
- 使用推荐的模板生成任务描述

**应用场景**:
- "如何实现XXX功能?" → 查询最佳实践
- "这个任务应该怎么做?" → 获取推荐方案
- "有没有参考示例?" → 查看代码模板

---

### 5. dev-advisor (代码顾问)

**位置**: `.lingma/skills/dev-advisor/SKILL.md`

**职责**:
- 在任务执行过程中提供代码质量审查
- 检测潜在问题和改进机会
- 提供重构建议和优化方案

**与 dev-help 的协作**:
- **独立使用**: dev-help 规划任务,dev-advisor 审查代码
- **协同工作**: 在任务执行中调用 dev-advisor 进行质量检查
- **反馈循环**: dev-advisor 发现的问题可以作为新任务加入计划

**调用场景**:
- 用户完成一个任务后,调用 dev-advisor 审查
- dev-help 发现代码质量问题,建议调用 dev-advisor
- dev-advisor 的建议转化为新的优化任务

---

## 数据模型定义

### TaskPlan (任务计划)

```typescript
interface TaskPlan {
  // 基本信息
  id: string;                    // 计划唯一ID
  title: string;                 // 计划标题
  description: string;           // 需求描述
  createdAt: Date;               // 创建时间
  
  // 任务列表
  tasks: TaskItem[];             // 任务项列表
  
  // 总体估算
  totalTasks: number;            // 任务总数
  estimatedHours: number;        // 总预计工时
  criticalPath: string[];        // 关键路径任务ID列表
  
  // 元数据
  status: 'draft' | 'confirmed' | 'executing' | 'completed';
  projectId?: string;            // 关联的项目ID
}
```

### TaskItem (任务项)

```typescript
interface TaskItem {
  // 基本信息
  id: string;                    // 任务唯一ID
  number: number;                // 任务编号
  title: string;                 // 任务标题
  description: string;           // 任务描述
  
  // 复杂度评估
  complexity: ComplexityScore;   // 复杂度评分
  riskLevel: 'low' | 'medium' | 'high';  // 风险等级
  
  // 时间估算
  estimatedHours: number;        // 预计工时
  bufferHours?: number;          // 缓冲时间
  
  // 依赖关系
  dependencies: string[];        // 依赖的任务ID列表
  dependents: string[];          // 被依赖的任务ID列表
  
  // 验收标准
  acceptanceCriteria: string[];  // 验收标准列表
  
  // 涉及文件
  files: FileChange[];           // 涉及的文件变更
  
  // 执行状态
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  actualHours?: number;          // 实际工时
  completedAt?: Date;            // 完成时间
  
  // 技术要点
  technicalNotes?: string[];     // 技术注意事项
  references?: string[];         // 参考资源链接
}
```

### ComplexityScore (复杂度评分)

```typescript
interface ComplexityScore {
  // 四维度评分 (1-3分)
  technical: number;             // 技术复杂度
  business: number;              // 业务复杂度
  dependency: number;            // 依赖复杂度
  testing: number;               // 测试复杂度
  
  // 综合评分
  total: number;                 // 总分 (4-12分)
  
  // 评分理由
  reasons: {
    technical?: string;          // 技术复杂度说明
    business?: string;           // 业务复杂度说明
    dependency?: string;         // 依赖复杂度说明
    testing?: string;            // 测试复杂度说明
  };
}
```

### RiskAssessment (风险评估)

```typescript
interface RiskAssessment {
  // 风险等级
  level: 'low' | 'medium' | 'high';
  
  // 风险因素
  factors: {
    technologyMaturity?: string; // 技术成熟度
    teamExperience?: string;     // 团队经验
    referenceAvailability?: string; // 参考案例
    impactScope?: string;        // 影响范围
    rollbackDifficulty?: string; // 回滚难度
  };
  
  // 应对策略
  mitigation: string;            // 缓解措施
  bufferPercentage: number;      // 缓冲百分比 (10/20/50)
  
  // 是否需要预研
  needsResearch: boolean;        // 是否需要预研任务
}
```

### FileChange (文件变更)

```typescript
interface FileChange {
  path: string;                  // 文件路径
  action: 'create' | 'modify' | 'delete';  // 操作类型
  description: string;           // 变更描述
}
```

---

## 配置文件规范

### .dev-helprc.json

可选的配置文件,用于自定义 dev-help 的行为。

```json
{
  // 时间配置
  "timebox": {
    "maxHoursPerTask": 2,        // 每个任务最大工时
    "minHoursPerTask": 0.5,      // 每个任务最小工时
    "defaultBufferPercentage": 20 // 默认缓冲百分比
  },
  
  // 评估配置
  "assessment": {
    "enableComplexityScoring": true,  // 启用复杂度评分
    "enableRiskAssessment": true,     // 启用风险评估
    "adjustmentCoefficients": {       // 调整系数
      "familiarTechnology": 0.8,
      "unfamiliarTechnology": 1.2,
      "hasReference": 0.9,
      "noReference": 1.1
    }
  },
  
  // 输出配置
  "output": {
    "format": "markdown",        // 输出格式
    "includeComplexityScore": true,  // 包含复杂度评分
    "includeRiskAssessment": true,   // 包含风险评估
    "includeAcceptanceCriteria": true // 包含验收标准
  },
  
  // 集成配置
  "integration": {
    "autoCallProgressTracker": true,   // 自动调用进度跟踪器
    "autoCallStepExecutor": false,     // 自动调用步骤执行器
    "suggestDevAdvisor": true          // 建议调用代码顾问
  }
}
```

---

## 协作流程

### 流程1: 纯任务规划模式

```
用户 → dev-help → 任务计划 → 用户手动执行

1. 用户提出需求
2. dev-help 分析需求并澄清
3. dev-help 拆解任务并评估
4. dev-help 生成任务计划
5. 用户确认计划
6. 用户自行执行任务
```

**适用场景**: 用户只需要任务规划,自己执行

---

### 流程2: 规划+执行模式

```
用户 → dev-help → 任务计划 → step-executor → progress-tracker

1. 用户提出需求
2. dev-help 分析并生成任务计划
3. 用户确认计划
4. dev-help 调用 step-executor
5. step-executor 逐步执行任务
6. step-executor 调用 progress-tracker 更新进度
7. 完成后汇报结果
```

**适用场景**: 需要自动化执行任务

---

### 流程3: 规划+执行+审查模式

```
用户 → dev-help → step-executor → dev-advisor → progress-tracker

1. 用户提出需求
2. dev-help 生成任务计划
3. step-executor 执行任务
4. 每完成一个任务,调用 dev-advisor 审查
5. dev-advisor 发现问题,生成新任务
6. 继续执行直到所有任务完成
```

**适用场景**: 高质量要求,需要代码审查

---

## 数据流

### 任务计划数据流

```
dev-help (生成)
    ↓
TaskPlan (数据结构)
    ↓
progress-tracker (存储)
    ↓
文件系统 (.progress-data/)
    ↓
跨会话恢复
```

### 进度更新数据流

```
step-executor (执行任务)
    ↓
更新 TaskItem.status
    ↓
调用 progress-tracker.update()
    ↓
持久化到文件系统
    ↓
dev-help 查询进度
```

---

## 扩展指南

### 添加新的任务模板

1. 在 `references/task-templates.md` 中添加模板
2. 定义模板的适用场景
3. 提供示例和验收标准

### 自定义评估规则

1. 修改 `.dev-helprc.json` 配置
2. 调整调整系数
3. 定义新的风险因素

### 集成新的技能

1. 在 SKILL.md 中添加协作说明
2. 定义数据交换格式
3. 更新 ECOSYSTEM.md 文档

---

## 最佳实践

### 1. 渐进式采用

- **阶段1**: 只使用 dev-help 进行任务规划
- **阶段2**: 集成 progress-tracker 跟踪进度
- **阶段3**: 使用 step-executor 自动执行
- **阶段4**: 集成 dev-advisor 进行质量审查

### 2. 配置优先

- 使用 `.dev-helprc.json` 自定义行为
- 根据团队习惯调整评估规则
- 定期回顾和优化配置

### 3. 数据驱动

- 记录每次估算和实际耗时
- 分析偏差原因
- 持续优化评估准确性

### 4. 团队协作

- 共享任务模板库
- 统一评估标准
- 建立团队基准数据

---

## 版本信息

- **生态系统版本**: v1.0.0
- **创建日期**: 2024-01-XX
- **维护状态**: Active

---

**相关文档**:
- [Dev Help SKILL.md](dev-help/SKILL.md)
- [Progress Tracker SKILL.md](progress-tracker/SKILL.md)
- [Step Executor SKILL.md](step-executor/SKILL.md)
- [Dev Advisor SKILL.md](dev-advisor/SKILL.md)
- [Best Practice Library SKILL.md](best-practice-library/SKILL.md)
