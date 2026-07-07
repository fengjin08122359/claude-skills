---
name: progress-tracker
description: 跨会话进度跟踪器，负责任务进度的持久化、恢复和管理。支持多任务并行跟踪、进度可视化和断点续传。当 step-executor 需要保存或恢复执行进度时调用此技能。
---

# 进度跟踪器 (Progress Tracker)

一个专业的进度管理系统，用于跟踪、持久化和恢复长期运行的任务进度。

## 核心职责

- **进度持久化**：将任务进度保存到文件系统
- **状态恢复**：从中断点恢复任务执行
- **多任务管理**：同时跟踪多个任务的进度
- **进度可视化**：提供清晰的进度展示和统计
- **生命周期管理**：管理任务从创建到完成的完整生命周期

## 数据模型

### TaskProgress 结构

```typescript
type TaskStatus = 
  | 'not-started'    // 未开始
  | 'in-progress'    // 进行中
  | 'paused'         // 已暂停
  | 'completed'      // 已完成
  | 'failed'         // 失败
  | 'cancelled';     // 已取消

type StepStatus = 
  | 'pending'        // 待执行
  | 'executing'      // 执行中
  | 'verifying'      // 验证中
  | 'completed'      // 已完成
  | 'failed'         // 失败
  | 'skipped';       // 已跳过

interface TaskStep {
  id: string;              // 步骤 ID
  number: number;          // 步骤序号
  title: string;           // 步骤标题
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: number;       // 耗时（秒）
  errorMessage?: string;
}

interface TaskProgress {
  taskId: string;          // 任务 ID
  planId: string;          // 关联的执行计划 ID
  title: string;           // 任务标题
  description?: string;    // 任务描述
  
  status: TaskStatus;      // 任务状态
  
  steps: TaskStep[];       // 步骤列表
  
  progress: {
    currentStep: number;   // 当前步骤索引（从0开始）
    totalSteps: number;    // 总步骤数
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    percentage: number;    // 完成百分比
  };
  
  timing: {
    createdAt: string;
    startedAt?: string;
    pausedAt?: string;
    resumedAt?: string;
    completedAt?: string;
    totalDuration?: number;    // 总耗时（秒）
    activeDuration?: number;   // 活跃耗时（排除暂停时间）
  };
  
  context: {               // 执行上下文
    workspaceRoot: string;
    currentBranch?: string;
    gitCommitHash?: string;  // 开始时的 Git commit
    relatedFiles: string[];
  };
  
  metadata: {
    createdBy: string;     // 创建者（skill 名称）
    lastUpdatedBy: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
  };
}
```

### SessionState 结构

```typescript
interface SessionState {
  sessionId: string;       // 会话 ID
  activeTasks: string[];   // 当前活跃任务 ID 列表
  lastActivity: string;    // 最后活动时间
  
  preferences: {
    autoSaveInterval: number;  // 自动保存间隔（秒）
    maxConcurrentTasks: number;
    notificationEnabled: boolean;
  };
}
```

## API 接口

### 1. 创建新任务

**调用方式**：
```typescript
const result = await invokeSkill('progress-tracker', {
  action: 'create-task',
  task: {
    taskId: 'task-123',
    planId: 'plan-456',
    title: '修复类型安全问题',
    description: '将 user-list.vue 中的 any 类型替换为明确接口',
    steps: [
      { id: 'step-001', number: 1, title: '创建类型定义', status: 'pending' },
      { id: 'step-002', number: 2, title: '更新 API 服务', status: 'pending' },
      // ...
    ],
    context: {
      workspaceRoot: '/path/to/project',
      currentBranch: 'feature/fix-types',
      relatedFiles: ['src/views/user-list/index.vue']
    }
  }
});
```

**返回结果**：
```typescript
interface CreateTaskResult {
  success: boolean;
  taskId: string;
  message?: string;
}
```

### 2. 更新任务进度

**调用方式**：
```typescript
await invokeSkill('progress-tracker', {
  action: 'update-step',
  taskId: 'task-123',
  stepId: 'step-001',
  updates: {
    status: 'completed',
    completedAt: new Date().toISOString(),
    duration: 3
  }
});
```

**自动更新**：
- 自动计算 progress.percentage
- 自动更新 completedSteps 计数
- 如果所有步骤完成，自动设置任务状态为 'completed'

### 3. 暂停任务

**调用方式**：
```typescript
await invokeSkill('progress-tracker', {
  action: 'pause-task',
  taskId: 'task-123',
  reason: '用户主动暂停'
});
```

**处理逻辑**：
1. 保存当前步骤状态
2. 记录 Git commit hash（用于回滚参考）
3. 更新任务状态为 'paused'
4. 记录暂停时间

### 4. 恢复任务

**调用方式**：
```typescript
const task = await invokeSkill('progress-tracker', {
  action: 'resume-task',
  taskId: 'task-123'
});
```

**返回结果**：
```typescript
interface ResumeTaskResult {
  task: TaskProgress;
  resumePoint: {
    nextStep: number;
    completedSteps: number[];
    canContinue: boolean;
  };
  recommendations: string[];
}
```

**处理逻辑**：
1. 加载任务进度
2. 检查工作区状态（Git branch、文件变更）
3. 确定恢复点（从失败的步骤或下一个待执行步骤）
4. 验证是否可以继续（依赖文件是否存在等）

### 5. 查询任务状态

**调用方式**：
```typescript
const task = await invokeSkill('progress-tracker', {
  action: 'get-task',
  taskId: 'task-123'
});
```

### 6. 列出所有任务

**调用方式**：
```typescript
const tasks = await invokeSkill('progress-tracker', {
  action: 'list-tasks',
  filters: {
    status: ['in-progress', 'paused'],
    createdBy: 'dev-advisor'
  },
  options: {
    sortBy: 'lastUpdated',
    limit: 10
  }
});
```

### 7. 删除任务

**调用方式**：
```typescript
await invokeSkill('progress-tracker', {
  action: 'delete-task',
  taskId: 'task-123',
  options: {
    archiveInstead: true  // 归档而非彻底删除
  }
});
```

### 8. 获取进度摘要

**调用方式**：
```typescript
const summary = await invokeSkill('progress-tracker', {
  action: 'get-summary',
  taskId: 'task-123'
});
```

**返回结果**：
```typescript
interface ProgressSummary {
  taskId: string;
  title: string;
  status: TaskStatus;
  percentage: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
  steps: Array<{
    number: number;
    title: string;
    status: StepStatus;
    duration?: number;
  }>;
}
```

### 9. 导出进度报告

**调用方式**：
```typescript
const report = await invokeSkill('progress-tracker', {
  action: 'export-report',
  taskId: 'task-123',
  format: 'markdown'  // 'markdown' | 'json' | 'html'
});
```

**返回结果（Markdown 格式）**：
```markdown
## 任务进度报告

**任务**: 修复类型安全问题  
**状态**: ✅ 已完成  
**总耗时**: 2 分 15 秒

### 步骤详情

✅ 步骤 1/4: 创建类型定义 - 完成 (3s)  
✅ 步骤 2/4: 更新 API 服务 - 完成 (5s)  
✅ 步骤 3/4: 替换 any 类型 - 完成 (1m 30s)  
✅ 步骤 4/4: 运行测试 - 完成 (37s)

### 统计信息

- 完成步骤: 4/4
- 成功率: 100%
- 平均步骤耗时: 33.75s
```

## 存储结构

### 文件组织

```
.lingma/skills/progress-tracker/
├── SKILL.md
├── data/
│   ├── tasks/             # 任务进度目录
│   │   ├── task-123.json
│   │   ├── task-456.json
│   │   └── ...
│   ├── archives/          # 已归档任务
│   │   └── ...
│   └── session.json       # 当前会话状态
└── schemas/
    └── task-progress.schema.json
```

### 任务文件格式

```json
{
  "taskId": "task-123",
  "planId": "plan-456",
  "title": "修复类型安全问题",
  "status": "paused",
  "steps": [
    {
      "id": "step-001",
      "number": 1,
      "title": "创建类型定义",
      "status": "completed",
      "startedAt": "2026-04-14T10:00:00Z",
      "completedAt": "2026-04-14T10:00:03Z",
      "duration": 3
    },
    {
      "id": "step-002",
      "number": 2,
      "title": "更新 API 服务",
      "status": "completed",
      "startedAt": "2026-04-14T10:00:03Z",
      "completedAt": "2026-04-14T10:00:08Z",
      "duration": 5
    },
    {
      "id": "step-003",
      "number": 3,
      "title": "替换 any 类型",
      "status": "pending"
    }
  ],
  "progress": {
    "currentStep": 2,
    "totalSteps": 4,
    "completedSteps": 2,
    "failedSteps": 0,
    "skippedSteps": 0,
    "percentage": 50
  },
  "timing": {
    "createdAt": "2026-04-14T10:00:00Z",
    "startedAt": "2026-04-14T10:00:00Z",
    "pausedAt": "2026-04-14T10:00:08Z",
    "totalDuration": 8
  },
  "context": {
    "workspaceRoot": "/path/to/project",
    "currentBranch": "feature/fix-types",
    "gitCommitHash": "abc123def456",
    "relatedFiles": ["src/views/user-list/index.vue"]
  }
}
```

## 与 step-executor 的协作

### 集成流程

```typescript
// step-executor 在执行过程中自动调用 progress-tracker

class StepExecutor {
  private taskId: string;
  
  async executePlan(plan: ExecutionPlan) {
    // 1. 创建任务跟踪
    this.taskId = await invokeSkill('progress-tracker', {
      action: 'create-task',
      task: {
        taskId: generateTaskId(),
        planId: plan.id,
        title: plan.title,
        steps: plan.steps.map(s => ({
          id: s.id,
          number: s.number,
          title: s.title,
          status: 'pending'
        })),
        context: plan.context
      }
    });
    
    // 2. 执行每个步骤
    for (const step of plan.steps) {
      // 更新步骤状态为 executing
      await this.updateStepStatus(step.id, 'executing');
      
      try {
        // 执行步骤
        await this.executeStep(step);
        
        // 更新为 completed
        await this.updateStepStatus(step.id, 'completed');
      } catch (error) {
        // 更新为 failed
        await this.updateStepStatus(step.id, 'failed', error.message);
        
        // 自动暂停任务
        await this.pauseTask();
        throw error;
      }
    }
    
    // 3. 完成任务
    await this.completeTask();
  }
  
  private async updateStepStatus(
    stepId: string, 
    status: StepStatus, 
    errorMessage?: string
  ) {
    await invokeSkill('progress-tracker', {
      action: 'update-step',
      taskId: this.taskId,
      stepId,
      updates: {
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        errorMessage
      }
    });
  }
  
  private async pauseTask() {
    await invokeSkill('progress-tracker', {
      action: 'pause-task',
      taskId: this.taskId,
      reason: '步骤执行失败'
    });
  }
  
  private async completeTask() {
    await invokeSkill('progress-tracker', {
      action: 'update-task-status',
      taskId: this.taskId,
      status: 'completed'
    });
  }
}
```

### 断点续传示例

```typescript
// step-executor 启动时检查未完成的任务
async function initialize() {
  // 1. 查找暂停的任务
  const pausedTasks = await invokeSkill('progress-tracker', {
    action: 'list-tasks',
    filters: { status: ['paused'] }
  });
  
  if (pausedTasks.length > 0) {
    // 2. 提示用户恢复
    const choice = await askUser({
      message: `发现 ${pausedTasks.length} 个未完成的任务，是否继续？`,
      options: pausedTasks.map(t => t.title).concat(['取消'])
    });
    
    if (choice !== '取消') {
      // 3. 恢复选中的任务
      const task = await invokeSkill('progress-tracker', {
        action: 'resume-task',
        taskId: pausedTasks[0].taskId
      });
      
      // 4. 从恢复点继续执行
      await resumeFromPoint(task);
    }
  }
}
```

## 进度可视化

### 文本进度条

```typescript
function renderProgressBar(percentage: number, width: number = 30): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage.toFixed(1)}%`;
}

// 输出示例: [███████████████░░░░░░░░░░░░░] 50.0%
```

### 步骤状态图标

```typescript
const statusIcons = {
  'pending': '⏳',
  'executing': '⚙️',
  'verifying': '🔍',
  'completed': '✅',
  'failed': '❌',
  'skipped': '⏭️'
};

function renderStepList(steps: TaskStep[]): string {
  return steps.map(step => 
    `${statusIcons[step.status]} 步骤 ${step.number}: ${step.title}` +
    (step.duration ? ` (${step.duration}s)` : '')
  ).join('\n');
}
```

### 完整进度展示

```markdown
## 📊 任务进度

**任务**: 修复类型安全问题  
**状态**: 🟡 进行中  
**进度**: [███████████████░░░░░░░░░░░░░] 50.0%

### 步骤详情

✅ 步骤 1/4: 创建类型定义 - 完成 (3s)  
✅ 步骤 2/4: 更新 API 服务 - 完成 (5s)  
▶️ 步骤 3/4: 替换 any 类型 - 执行中  
⏳ 步骤 4/4: 运行测试 - 待执行

### 时间统计

- 已用时: 8 秒
- 预计剩余: 约 2 分钟
- 平均步骤耗时: 4 秒
```

## 高级功能

### 1. 自动保存

```typescript
// 配置自动保存
{
  "autoSave": {
    "enabled": true,
    "interval": 5,  // 每 5 秒保存一次
    "onStepComplete": true,
    "beforePause": true
  }
}
```

### 2. 任务依赖

```typescript
interface TaskDependency {
  taskId: string;
  type: 'blocks' | 'requires' | 'optional';
}

// 任务 B 依赖任务 A 完成
{
  "taskId": "task-B",
  "dependencies": [
    { "taskId": "task-A", "type": "blocks" }
  ]
}
```

### 3. 进度通知

```typescript
// 关键节点发送通知
{
  "notifications": {
    "onStepComplete": false,
    "onTaskComplete": true,
    "onTaskFailed": true,
    "onPause": false
  }
}
```

### 4. 历史统计

```typescript
// 获取历史统计数据
const stats = await invokeSkill('progress-tracker', {
  action: 'get-history-stats',
  timeRange: 'last-30-days',
  metrics: [
    'averageCompletionTime',
    'successRate',
    'mostCommonFailureReasons',
    'peakActivityHours'
  ]
});
```

## 配置文件

### config/progress-tracker.json

```json
{
  "storage": {
    "tasksDir": ".lingma/skills/progress-tracker/data/tasks",
    "archivesDir": ".lingma/skills/progress-tracker/data/archives",
    "sessionFile": "session.json"
  },
  "autosave": {
    "enabled": true,
    "intervalSeconds": 5,
    "onStepComplete": true
  },
  "retention": {
    "archiveAfterDays": 30,
    "deleteArchivedAfterDays": 90,
    "maxTasksPerUser": 100
  },
  "notifications": {
    "enabled": true,
    "events": ["task-complete", "task-failed"]
  }
}
```

## 最佳实践

### 1. 任务粒度

- 每个任务应该有明确的开始和结束
- 任务时长建议在 5-60 分钟之间
- 过长的任务应该拆分为子任务

### 2. 状态更新频率

- 每个步骤开始时立即更新状态
- 步骤完成后立即记录耗时
- 关键操作前后保存进度

### 3. 错误处理

- 失败时记录详细的错误信息
- 保存失败时的上下文状态
- 提供清晰的恢复建议

### 4. 资源清理

- 任务完成后及时归档
- 定期清理过期任务
- 避免积累大量历史数据

### 5. 并发控制

- 限制同时进行的任务数量
- 检测和处理任务冲突
- 合理分配系统资源

## 注意事项

1. **数据一致性**：确保进度状态的原子性更新
2. **性能优化**：避免频繁的磁盘 I/O 操作
3. **隐私保护**：不存储敏感的业务数据
4. **容错能力**：处理文件损坏、权限问题等异常
5. **向后兼容**：保持数据格式的兼容性
6. **用户体验**：提供清晰的进度反馈和控制选项
