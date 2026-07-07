# Dev Help 数据模型定义

本文档定义了 dev-help skill 使用的核心数据模型。

## 概述

dev-help 使用以下核心数据模型来管理任务规划和执行:

1. **TaskPlan** - 任务计划(整体)
2. **TaskItem** - 任务项(单个任务)
3. **ComplexityScore** - 复杂度评分
4. **RiskAssessment** - 风险评估
5. **FileChange** - 文件变更

---

## 1. TaskPlan (任务计划)

### 定义

```typescript
interface TaskPlan {
  // 基本信息
  id: string;                    // 计划唯一ID (UUID)
  title: string;                 // 计划标题
  description: string;           // 需求描述
  createdAt: Date;               // 创建时间
  updatedAt?: Date;              // 更新时间
  
  // 任务列表
  tasks: TaskItem[];             // 任务项列表
  
  // 总体估算
  totalTasks: number;            // 任务总数
  estimatedHours: number;        // 总预计工时
  actualHours?: number;          // 总实际工时
  criticalPath: string[];        // 关键路径任务ID列表
  
  // 元数据
  status: TaskPlanStatus;        // 计划状态
  projectId?: string;            // 关联的项目ID
  tags?: string[];               // 标签列表
  
  // 统计信息
  statistics?: PlanStatistics;   // 统计数据
}
```

### TaskPlanStatus

```typescript
type TaskPlanStatus = 
  | 'draft'        // 草稿(未确认)
  | 'confirmed'    // 已确认
  | 'executing'    // 执行中
  | 'completed'    // 已完成
  | 'cancelled';   // 已取消
```

### PlanStatistics

```typescript
interface PlanStatistics {
  // 任务统计
  completedTasks: number;        // 已完成任务数
  pendingTasks: number;          // 待完成任务数
  inProgressTasks: number;       // 进行中任务数
  blockedTasks: number;          // 阻塞任务数
  
  // 时间统计
  progressPercentage: number;    // 进度百分比
  remainingHours: number;        // 剩余工时
  
  // 复杂度分布
  complexityDistribution: {
    low: number;                 // 低复杂度任务数
    medium: number;              // 中复杂度任务数
    high: number;                // 高复杂度任务数
  };
  
  // 风险分布
  riskDistribution: {
    low: number;                 // 低风险任务数
    medium: number;              // 中风险任务数
    high: number;                // 高风险任务数
  };
}
```

### 示例

```json
{
  "id": "plan-20240101-001",
  "title": "组合导出功能开发",
  "description": "为组合管理页面添加Excel导出功能",
  "createdAt": "2024-01-01T10:00:00Z",
  "tasks": [...],
  "totalTasks": 6,
  "estimatedHours": 8.5,
  "criticalPath": ["task-1", "task-2", "task-4"],
  "status": "confirmed",
  "statistics": {
    "completedTasks": 0,
    "pendingTasks": 6,
    "progressPercentage": 0,
    "complexityDistribution": {
      "low": 2,
      "medium": 3,
      "high": 1
    }
  }
}
```

---

## 2. TaskItem (任务项)

### 定义

```typescript
interface TaskItem {
  // 基本信息
  id: string;                    // 任务唯一ID
  number: number;                // 任务编号 (1, 2, 3...)
  title: string;                 // 任务标题
  description: string;           // 任务描述
  
  // 复杂度评估
  complexity: ComplexityScore;   // 复杂度评分
  riskLevel: RiskLevel;          // 风险等级
  
  // 时间估算
  estimatedHours: number;        // 预计工时
  bufferHours?: number;          // 缓冲时间
  actualHours?: number;          // 实际工时
  
  // 依赖关系
  dependencies: string[];        // 依赖的任务ID列表
  dependents: string[];          // 被依赖的任务ID列表
  
  // 验收标准
  acceptanceCriteria: string[];  // 验收标准列表
  
  // 涉及文件
  files: FileChange[];           // 涉及的文件变更
  
  // 执行状态
  status: TaskStatus;            // 任务状态
  startedAt?: Date;              // 开始时间
  completedAt?: Date;            // 完成时间
  
  // 技术要点
  technicalNotes?: string[];     // 技术注意事项
  references?: string[];         // 参考资源链接
  
  // 元数据
  createdAt: Date;               // 创建时间
  updatedAt?: Date;              // 更新时间
  tags?: string[];               // 标签
}
```

### RiskLevel

```typescript
type RiskLevel = 'low' | 'medium' | 'high';
```

### TaskStatus

```typescript
type TaskStatus = 
  | 'pending'      // 待执行
  | 'in-progress'  // 执行中
  | 'completed'    // 已完成
  | 'blocked';     // 阻塞
```

### 示例

```json
{
  "id": "task-001",
  "number": 1,
  "title": "设计导出API接口",
  "description": "定义导出接口的请求参数和响应格式",
  "complexity": {
    "technical": 2,
    "business": 1,
    "dependency": 1,
    "testing": 2,
    "total": 6,
    "reasons": {
      "technical": "需要定义TypeScript类型"
    }
  },
  "riskLevel": "low",
  "estimatedHours": 1.0,
  "bufferHours": 0.2,
  "dependencies": [],
  "dependents": ["task-002"],
  "acceptanceCriteria": [
    "ExportParams包含筛选条件",
    "ExportResult包含taskId或downloadUrl",
    "通过TypeScript编译检查"
  ],
  "files": [
    {
      "path": "src/api/combination.ts",
      "action": "modify",
      "description": "添加exportCombination方法"
    }
  ],
  "status": "pending",
  "technicalNotes": [
    "使用userCenterServe进行API调用"
  ]
}
```

---

## 3. ComplexityScore (复杂度评分)

### 定义

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
  reasons: ComplexityReasons;    // 各维度评分说明
}

interface ComplexityReasons {
  technical?: string;            // 技术复杂度说明
  business?: string;             // 业务复杂度说明
  dependency?: string;           // 依赖复杂度说明
  testing?: string;              // 测试复杂度说明
}
```

### 评分标准

#### Technical (技术复杂度)

| 分数 | 代码量 | 技术熟悉度 | 算法难度 |
|------|--------|-----------|---------|
| 1 | <100行 | 非常熟悉 | 简单CRUD |
| 2 | 100-300行 | 基本熟悉 | 有业务逻辑 |
| 3 | >300行 | 不熟悉/需学习 | 复杂算法 |

#### Business (业务复杂度)

| 分数 | 决策分支 | 状态数量 | 交互步骤 |
|------|---------|---------|---------|
| 1 | <3个 | <5个 | <3步 |
| 2 | 3-8个 | 5-15个 | 3-8步 |
| 3 | >8个 | >15个 | >8步 |

#### Dependency (依赖复杂度)

| 分数 | 外部依赖 | 内部依赖 | 数据结构 |
|------|---------|---------|---------|
| 1 | 0-1个 | 0-2个 | 简单对象 |
| 2 | 2-3个 | 3-5个 | 嵌套对象 |
| 3 | >3个 | >5个 | 图结构 |

#### Testing (测试复杂度)

| 分数 | 测试用例 | Mock难度 | 边界情况 |
|------|---------|---------|---------|
| 1 | <5个 | 简单 | <3个 |
| 2 | 5-15个 | 中等 | 3-8个 |
| 3 | >15个 | 复杂 | >8个 |

### 时间映射

| 总分 | 时间范围 | 建议 |
|------|---------|------|
| 4-5 | 0.5-1h | 简单任务 |
| 6-7 | 1-1.5h | 中等简单 |
| 8-9 | 1.5-2h | 中等复杂 |
| 10-11 | 2-3h | 复杂,建议拆分 |
| 12 | 3+h | 非常复杂,必须拆分 |

### 示例

```json
{
  "technical": 2,
  "business": 1,
  "dependency": 2,
  "testing": 2,
  "total": 7,
  "reasons": {
    "technical": "需要使用exceljs库,约200行代码",
    "business": "业务逻辑简单,就是导出数据",
    "dependency": "依赖API接口和文件下载工具",
    "testing": "需要测试正常/空数据/大数据量场景"
  }
}
```

---

## 4. RiskAssessment (风险评估)

### 定义

```typescript
interface RiskAssessment {
  // 风险等级
  level: RiskLevel;              // low/medium/high
  
  // 风险因素
  factors: RiskFactors;          // 风险因素详情
  
  // 应对策略
  mitigation: string;            // 缓解措施
  bufferPercentage: number;      // 缓冲百分比 (10/20/50)
  
  // 是否需要预研
  needsResearch: boolean;        // 是否需要预研任务
  researchTask?: string;         // 预研任务描述
}

interface RiskFactors {
  technologyMaturity?: string;   // 技术成熟度
  teamExperience?: string;       // 团队经验
  referenceAvailability?: string; // 参考案例
  impactScope?: string;          // 影响范围
  rollbackDifficulty?: string;   // 回滚难度
}
```

### 风险等级判断

#### Low Risk (🟢)
- 技术成熟稳定
- 团队有丰富经验
- 有多个成功案例
- 局部影响,易回滚
- **缓冲**: +10%

#### Medium Risk (🟡)
- 技术较新但有文档
- 团队有部分经验
- 有部分参考
- 模块级影响
- **缓冲**: +20%,先做POC

#### High Risk (🔴)
- 技术未验证/实验性
- 团队无经验
- 无参考,需探索
- 系统级影响,难回滚
- **缓冲**: +50%或拆分为预研+实施

### 示例

```json
{
  "level": "medium",
  "factors": {
    "technologyMaturity": "exceljs库成熟稳定",
    "teamExperience": "团队使用经验有限",
    "referenceAvailability": "有部分参考案例",
    "impactScope": "仅影响导出功能",
    "rollbackDifficulty": "容易回滚"
  },
  "mitigation": "先实现小规模POC验证可行性",
  "bufferPercentage": 20,
  "needsResearch": false
}
```

---

## 5. FileChange (文件变更)

### 定义

```typescript
interface FileChange {
  path: string;                  // 文件路径
  action: FileAction;            // 操作类型
  description: string;           // 变更描述
  lines?: {                      // 可选:变更行数
    added?: number;
    removed?: number;
  };
}

type FileAction = 
  | 'create'    // 创建
  | 'modify'    // 修改
  | 'delete';   // 删除
```

### 示例

```json
{
  "path": "src/api/combination.ts",
  "action": "modify",
  "description": "添加exportCombination方法和ExportParams类型",
  "lines": {
    "added": 50,
    "removed": 0
  }
}
```

---

## 数据存储

### 存储位置

```
.lingma/skills/dev-help/data/
├── plans/                    # 任务计划
│   ├── plan-001.json
│   ├── plan-002.json
│   └── ...
├── templates/                # 任务模板
│   └── index.json
└── statistics/               # 统计数据
    └── history.json
```

### 索引文件

```json
// data/plans/index.json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-01T10:00:00Z",
  "plans": [
    {
      "id": "plan-001",
      "title": "组合导出功能",
      "status": "completed",
      "createdAt": "2024-01-01T10:00:00Z",
      "totalTasks": 6,
      "estimatedHours": 8.5
    }
  ],
  "statistics": {
    "totalPlans": 10,
    "completedPlans": 7,
    "averageAccuracy": 0.85
  }
}
```

---

## 数据验证

### TaskPlan 验证规则

```typescript
function validateTaskPlan(plan: TaskPlan): ValidationResult {
  const errors: string[] = [];
  
  // 必填字段
  if (!plan.id) errors.push('缺少计划ID');
  if (!plan.title) errors.push('缺少计划标题');
  if (!plan.tasks || plan.tasks.length === 0) {
    errors.push('任务列表不能为空');
  }
  
  // 任务验证
  plan.tasks.forEach((task, index) => {
    const taskErrors = validateTaskItem(task, index);
    errors.push(...taskErrors);
  });
  
  // 依赖验证
  validateDependencies(plan.tasks);
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### TaskItem 验证规则

```typescript
function validateTaskItem(task: TaskItem, index: number): string[] {
  const errors: string[] = [];
  
  // 必填字段
  if (!task.id) errors.push(`Task ${index}: 缺少任务ID`);
  if (!task.title) errors.push(`Task ${index}: 缺少任务标题`);
  if (!task.description) errors.push(`Task ${index}: 缺少任务描述`);
  
  // 复杂度验证
  if (task.complexity.total < 4 || task.complexity.total > 12) {
    errors.push(`Task ${index}: 复杂度总分应在4-12之间`);
  }
  
  // 时间验证
  if (task.estimatedHours <= 0) {
    errors.push(`Task ${index}: 预计工时必须大于0`);
  }
  if (task.estimatedHours > 2) {
    errors.push(`Task ${index}: 预计工时超过2小时,建议拆分`);
  }
  
  // 验收标准
  if (!task.acceptanceCriteria || task.acceptanceCriteria.length === 0) {
    errors.push(`Task ${index}: 缺少验收标准`);
  }
  
  return errors;
}
```

---

## 数据转换

### TaskPlan → Markdown

```typescript
function taskPlanToMarkdown(plan: TaskPlan): string {
  let markdown = `# ${plan.title}\n\n`;
  markdown += `## 需求概述\n${plan.description}\n\n`;
  markdown += `## 任务列表\n\n`;
  
  plan.tasks.forEach(task => {
    markdown += taskItemToMarkdown(task);
    markdown += '\n---\n\n';
  });
  
  markdown += `## 总体估算\n`;
  markdown += `- 任务数量: ${plan.totalTasks}个\n`;
  markdown += `- 预计总耗时: ${plan.estimatedHours}小时\n`;
  
  return markdown;
}
```

### Markdown → TaskPlan

```typescript
function markdownToTaskPlan(markdown: string): TaskPlan {
  // 解析Markdown生成TaskPlan
  // 实现略
}
```

---

## API 接口

### 创建任务计划

```typescript
interface CreatePlanRequest {
  title: string;
  description: string;
  requirements: string;        // 用户需求
}

interface CreatePlanResponse {
  plan: TaskPlan;
  suggestions: string[];       // 建议和问题
}
```

### 更新任务状态

```typescript
interface UpdateTaskStatusRequest {
  planId: string;
  taskId: string;
  status: TaskStatus;
  actualHours?: number;
  notes?: string;
}

interface UpdateTaskStatusResponse {
  success: boolean;
  updatedTask: TaskItem;
  planStatistics: PlanStatistics;
}
```

### 查询进度

```typescript
interface GetProgressRequest {
  planId: string;
}

interface GetProgressResponse {
  plan: TaskPlan;
  progress: {
    percentage: number;
    completedTasks: number;
    remainingTasks: number;
    estimatedCompletionDate?: Date;
  };
}
```

---

## 版本历史

- **v1.0.0** (2024-01-XX): 初始版本
  - 定义核心数据模型
  - 建立验证规则
  - 提供API接口规范

---

**相关文档**:
- [ECOSYSTEM.md](../DEV-HELP-ECOSYSTEM.md)
- [task-breakdown-guide.md](references/task-breakdown-guide.md)
- [complexity-assessment.md](references/complexity-assessment.md)
