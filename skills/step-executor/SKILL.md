---
name: step-executor
description: 原子化步骤执行引擎，负责将执行计划拆解为可验证的最小动作单元并逐步执行。支持断点续传、并行验证、错误恢复和进度管理。当 dev-advisor 或其他 skill 需要执行多步骤任务时调用此技能。
---

# 步骤执行器 (Step Executor)

一个专业的原子化步骤执行引擎，专注于安全、可靠地执行代码变更任务。

## 核心职责

- **接收执行计划**：从 dev-advisor 或其他调用方接收结构化执行计划
- **原子化执行**：将复杂任务拆解为可独立验证的最小动作单元
- **验证保障**：每步执行后自动运行验证命令确保质量
- **错误恢复**：提供智能错误处理和多种恢复策略
- **进度管理**：支持断点续传和跨会话状态持久化
- **结果反馈**：返回详细的执行结果和统计信息

## 数据模型

### 执行计划结构

```typescript
interface ExecutionPlan {
  id: string;              // 计划 ID
  taskId: string;          // 关联的任务 ID
  title: string;           // 计划标题
  description: string;     // 计划描述
  
  steps: ExecutionStep[];  // 步骤列表
  
  context: {               // 执行上下文
    workspaceRoot: string; // 工作区根目录
    currentBranch?: string; // 当前 Git 分支
    relatedFiles: string[]; // 相关文件列表
  };
  
  metadata: {
    createdAt: string;
    estimatedTime: number; // 预估时间（分钟）
    complexity: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
  };
}
```

### 执行步骤结构

```typescript
type StepType = 
  | 'create-file'      // 创建新文件
  | 'modify-code'      // 修改现有代码
  | 'add-import'       // 添加导入语句
  | 'refactor'         // 重构（提取函数/组件）
  | 'config-change'    // 配置文件修改
  | 'delete-code'      // 删除废弃代码
  | 'rename'           // 重命名（变量/文件）
  | 'move-file';       // 移动文件位置

type StepStatus = 
  | 'pending'      // 待执行
  | 'executing'    // 执行中
  | 'verifying'    // 验证中
  | 'completed'    // 已完成
  | 'failed'       // 失败
  | 'skipped';     // 已跳过

interface ExecutionStep {
  id: string;              // 步骤 ID (如: step-001)
  number: number;          // 步骤序号
  totalSteps: number;      // 总步骤数
  
  type: StepType;          // 步骤类型
  title: string;           // 步骤标题
  description: string;     // 详细描述
  
  operation: {             // 具体操作
    action: StepType;
    targetFile?: string;   // 目标文件路径
    changes: CodeChange[]; // 代码变更
  };
  
  verification: {          // 验证配置
    commands: string[];    // 验证命令列表
    expectedOutput?: string; // 预期输出（可选）
    timeout?: number;      // 超时时间（毫秒）
  };
  
  rollback: {              // 回滚策略
    strategy: 'git-checkout' | 'manual' | 'none';
    backupPath?: string;   // 备份文件路径
    instructions?: string; // 手动回滚说明
  };
  
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;   // 错误信息（失败时）
  
  dependencies?: string[]; // 依赖的步骤 ID
}
```

### 执行结果结构

```typescript
interface ExecutionResult {
  planId: string;
  status: 'completed' | 'failed' | 'paused' | 'cancelled';
  
  summary: {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    totalTime: number; // 总耗时（秒）
  };
  
  changes: {
    createdFiles: string[];
    modifiedFiles: string[];
    deletedFiles: string[];
    addedLines: number;
    removedLines: number;
  };
  
  qualityChecks: {
    typescript: boolean;
    eslint: boolean;
    tests: {
      total: number;
      passed: number;
      failed: number;
    };
  };
  
  steps: Array<{
    id: string;
    number: number;
    title: string;
    status: StepStatus;
    duration?: number;
    errorMessage?: string;
  }>;
  
  recommendations?: string[]; // 后续建议
}
```

## 执行流程

### 1. 初始化阶段

```markdown
**输入**: ExecutionPlan 对象

**处理**:
1. 验证执行计划的完整性
2. 检查工作区状态（Git branch、未提交变更）
3. 加载或创建进度跟踪文件
4. 确认执行模式（批量/逐个）

**输出**: 
- 执行计划确认信息
- 风险提示（如有）
- 执行模式选择
```

### 2. 执行前确认

```markdown
## 📋 执行计划确认

**任务**: [计划标题]  
**步骤数**: N 步  
**预估时间**: X 分钟  
**风险等级**: 🟢低 / 🟡中 / 🔴高

### 步骤概览

- [ ] 步骤 1/N: [标题]
- [ ] 步骤 2/N: [标题]
- ...

### 执行模式

请选择执行方式：

🚀 **快速模式** - 批量执行低风险步骤，减少确认次数  
📋 **安全模式** - 每步都需确认，适合高风险操作  
⚙️ **自定义** - 指定哪些步骤批量执行

**其他选项**:
- 📝 查看详细信息
- ✏️ 调整执行计划
- ❌ 取消执行
```

### 3. 单步执行流程

#### 3.1 步骤准备

```markdown
### ▶️ 准备执行步骤 1/4: [步骤标题]

**类型**: create-file  
**目标**: `src/types/user.ts`

**操作预览**:
```typescript
export interface UserData {
  id: string;
  name: string;
  email: string;
}
```

**验证命令**:
- `pnpm vue-tsc --noEmit`
- `pnpm eslint src/types/user.ts`

**预计耗时**: 2 分钟

---

**确认执行？**
✅ 执行此步骤
❌ 跳过此步骤
⏸️ 暂停执行
📋 查看完整计划
```

#### 3.2 执行中

```markdown
⚙️ **正在执行步骤 1/4...**

1. ✅ 创建文件: `src/types/user.ts`
2. ⚙️ 运行验证: `pnpm vue-tsc --noEmit`

[等待命令执行...]
```

#### 3.3 执行成功

```markdown
✅ **步骤 1/4 完成**

**结果**:
- ✓ 文件创建成功 (68 bytes)
- ✓ TypeScript 编译通过
- ✓ ESLint 检查通过

**耗时**: 3 秒

---

**下一步**: 步骤 2/4 - [标题]

是否继续？
▶️ 继续执行
⏸️ 暂停
📊 查看进度
```

#### 3.4 执行失败

```markdown
❌ **步骤 2/4 执行失败**

**错误类型**: type-error  
**错误信息**:
```
src/services/user.ts:15:3 - error TS2322: 
Type 'ApiResponse<UserData>' is not assignable to type 'UserListResponse'.
```

**问题分析**:
API 返回类型与定义的 UserListResponse 不匹配

**恢复选项**:

🔧 **选项 A**: 调整接口定义（推荐）
   - 置信度: 85%
   - 操作: 将 page 和 pageSize 改为可选

🔧 **选项 B**: 使用类型断言
   - 置信度: 60%
   - 操作: 添加 as UserListResponse

📖 **选项 C**: 查看 API 文档
   - 操作: 打开 API 响应示例

↩️ **回滚**: 撤销此步骤的更改
🛑 **中止**: 停止整个执行计划
💬 **自定义**: 提供自己的修复方案

请选择操作：
```

### 4. 进度管理

#### 4.1 进度查看

```markdown
## 📊 执行进度

**任务**: [标题]  
**状态**: 🟡 进行中 (2/4 完成)  
**已用时**: 1 分 30 秒

### 步骤状态

✅ 步骤 1/4: 创建类型定义 - 完成 (3s)  
✅ 步骤 2/4: 更新 API 服务 - 完成 (5s)  
▶️ 步骤 3/4: 替换 any 类型 - 待执行  
⏳ 步骤 4/4: 运行测试 - 待执行

### 质量检查

- TypeScript: ✅ 通过
- ESLint: ✅ 通过
- 测试: ⏳ 待执行

---

**操作**:
▶️ 继续执行
⏸️ 暂停并保存
🔄 重试步骤 2
📋 导出报告
```

#### 4.2 断点续传

**暂停时**：
```typescript
// 保存到 .step-executor-progress.json
{
  "planId": "plan-123",
  "currentStep": 2,
  "stepStatuses": {
    "step-001": "completed",
    "step-002": "completed",
    "step-003": "pending",
    "step-004": "pending"
  },
  "gitCommitHash": "abc123",
  "pausedAt": "2026-04-14T10:30:00Z"
}
```

**恢复时**：
```markdown
⚠️ **检测到未完成的执行计划**

**任务**: 修复类型安全问题  
**上次暂停**: 10 分钟前  
**进度**: 2/4 步骤完成

是否继续执行？

▶️ 从步骤 3 继续
🔄 从步骤 2 重新开始
🗑️ 放弃此计划
```

### 5. 完成总结

```markdown
## 🎉 执行计划完成

**任务**: [标题]  
**最终状态**: ✅ 全部完成  
**总耗时**: 2 分 15 秒

### 执行摘要

✅ 步骤 1/4: 创建类型定义 - 成功 (3s)  
✅ 步骤 2/4: 更新 API 服务 - 成功 (5s)  
✅ 步骤 3/4: 替换 any 类型 - 成功 (1m 30s)  
✅ 步骤 4/4: 运行测试 - 成功 (37s)

### 变更统计

- 📄 新建文件: 1 个
- ✏️ 修改文件: 2 个
- 🗑️ 删除代码: 3 行
- ➕ 新增代码: 28 行

### 质量检查

- ✅ TypeScript 编译: 通过
- ✅ ESLint 检查: 无错误
- ✅ 单元测试: 45/45 通过
- 📈 代码覆盖率: 85% (+2%)

### 返回给调用方

执行结果已返回给 dev-advisor。

**操作**:
📝 查看详细变更
🔍 运行额外检查
💾 提交更改
🏠 返回首页
```

## 高级功能

### 批量执行

当多个连续步骤都是低风险时，可以批量执行：

```markdown
🚀 **批量执行模式**

检测到步骤 1-3 都是低风险操作，是否批量执行？

- 步骤 1: 创建类型定义 (低风险)
- 步骤 2: 更新 API 服务 (低风险)
- 步骤 3: 替换 any 类型 (低风险)

批量执行将：
✓ 减少确认次数
✓ 加快执行速度
✓ 在每一步后仍然验证

**选择**:
🚀 批量执行步骤 1-3
📋 逐个确认执行
⚙️ 自定义批量范围
```

### 并行验证

某些验证命令可以并行执行：

```typescript
// 配置
{
  "parallelVerification": true,
  "maxParallelCommands": 2
}

// 执行
// 串行: 15s
pnpm vue-tsc --noEmit      // 8s
pnpm eslint src/           // 5s
pnpm test                  // 2s

// 并行: 8s
Promise.all([
  runCommand('pnpm vue-tsc --noEmit'),
  runCommand('pnpm eslint src/')
])
.then(() => runCommand('pnpm test'))
```

### 智能重试

对于临时性错误，自动重试：

```typescript
interface RetryStrategy {
  maxRetries: 3;
  backoffMultiplier: 2;
  initialDelay: 1000; // ms
  
  retryableErrors: [
    'network-timeout',
    'transient-error',
    'resource-busy'
  ];
}
```

## 错误处理策略

### 错误分类

```typescript
type ErrorCategory = 
  | 'syntax-error'       // 语法错误
  | 'type-error'         // 类型错误
  | 'test-failure'       // 测试失败
  | 'lint-error'         // Lint 错误
  | 'runtime-error'      // 运行时错误
  | 'dependency-error'   // 依赖问题
  | 'permission-error'   // 权限问题
  | 'unknown';
```

### 恢复策略矩阵

| 错误类型 | 自动修复 | 手动建议 | 回滚 | 中止 |
|---------|---------|---------|------|------|
| syntax-error | ✅ (高置信度) | ✅ | ✅ | ❌ |
| type-error | ⚠️ (中置信度) | ✅ | ✅ | ❌ |
| test-failure | ❌ | ✅ | ✅ | ⚠️ |
| lint-error | ✅ (高置信度) | ✅ | ❌ | ❌ |
| runtime-error | ❌ | ✅ | ✅ | ✅ |
| dependency-error | ⚠️ | ✅ | ❌ | ⚠️ |

## 与 dev-advisor 的协作

### 调用方式

```typescript
// dev-advisor 调用 step-executor
const result = await invokeSkill('step-executor', {
  action: 'execute-plan',
  plan: executionPlan,
  options: {
    mode: 'safe', // 'fast' | 'safe' | 'custom'
    autoRetry: true,
    parallelVerification: true
  }
});

// 处理返回结果
if (result.status === 'completed') {
  // 显示成功总结
  showCompletionSummary(result);
} else if (result.status === 'failed') {
  // 分析失败原因
  analyzeFailure(result);
} else if (result.status === 'paused') {
  // 保存进度
  saveProgress(result);
}
```

### 返回数据结构

```typescript
interface SkillResponse {
  success: boolean;
  data?: ExecutionResult;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## 配置文件

### config/step-executor.json

```json
{
  "execution": {
    "defaultMode": "safe",
    "autoSaveProgress": true,
    "progressFile": ".step-executor-progress.json"
  },
  "verification": {
    "parallelEnabled": true,
    "maxParallelCommands": 2,
    "defaultTimeout": 30000
  },
  "retry": {
    "enabled": true,
    "maxRetries": 3,
    "backoffMultiplier": 2,
    "initialDelay": 1000
  },
  "rollback": {
    "autoBackup": true,
    "backupDir": ".step-executor-backups",
    "strategy": "git-checkout"
  }
}
```

## 最佳实践

### 1. 原子性保证

- 每个步骤只做一个明确的变更
- 避免在一个步骤中修改多个不相关的文件
- 确保每步都可以独立验证

### 2. 验证充分性

- 至少包含一个验证命令
- 优先使用自动化验证（编译、测试、lint）
- 对于重要变更，添加多个验证点

### 3. 错误处理

- 为每个步骤定义清晰的回滚策略
- 提供多个恢复选项，让用户选择
- 记录详细的错误信息便于诊断

### 4. 用户体验

- 清晰的进度反馈
- 合理的超时设置
- 友好的错误提示
- 灵活的执行控制（暂停、恢复、中止）

## 注意事项

1. **始终验证**：每步执行后必须运行验证命令
2. **安全第一**：高风险操作默认使用安全模式
3. **进度持久化**：支持中断后恢复，避免重复工作
4. **明确回滚**：每个步骤都要有清晰的回滚策略
5. **详细日志**：记录执行过程便于问题排查
6. **用户控制**：提供充分的控制权（暂停、跳过、中止）
