# Dev Advisor 使用示例

本文档提供了完整的使用示例，帮助你快速上手 Dev Advisor Skill 生态系统。

## 📋 目录

- [基础用法](#基础用法)
- [代码审查示例](#代码审查示例)
- [自动修复示例](#自动修复示例)
- [最佳实践查询](#最佳实践查询)
- [问题库管理](#问题库管理)
- [进度跟踪](#进度跟踪)
- [高级场景](#高级场景)

---

## 基础用法

### 1. 在 IDE 中调用

```typescript
// 导入 skill 调用函数
import { invokeSkill } from '@lingma/skills';

// 分析单个文件
async function analyzeFile() {
  const result = await invokeSkill('dev-advisor', {
    action: 'analyze',
    filePath: 'src/views/user-list/index.vue'
  });
  
  console.log('发现的问题:', result.issues);
  console.log('建议的修复方案:', result.suggestions);
}
```

### 2. 命令行调用

```bash
# 分析文件
npx dev-advisor analyze src/components/UserCard.vue

# 分析整个目录
npx dev-advisor analyze src/views/ --recursive

# 指定检查规则
npx dev-advisor analyze src/ --rules type-safety,vue-best-practices

# 输出 JSON 格式
npx dev-advisor analyze src/ --format json
```

### 3. VS Code 集成

```json
// .vscode/settings.json
{
  "devAdvisor.enabled": true,
  "devAdvisor.triggerOnSave": true,
  "devAdvisor.autoFix": false,
  "devAdvisor.severityThreshold": "medium"
}
```

---

## 代码审查示例

### 示例 1: 检测类型安全问题

**待审查代码**:
```typescript
// src/services/user.ts
export async function getUsers() {
  const response = await fetch('/api/users');
  const data: any = await response.json(); // ❌ 使用 any
  return data;
}
```

**调用 dev-advisor**:
```typescript
const result = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/services/user.ts'
});
```

**返回结果**:
```json
{
  "issues": [
    {
      "id": "TS-ANY-TYPE-001",
      "title": "避免使用 any 类型",
      "severity": "high",
      "category": "type-safety",
      "location": {
        "file": "src/services/user.ts",
        "line": 3,
        "column": 8
      },
      "message": "使用了 any 类型，失去类型安全检查",
      "suggestion": {
        "summary": "定义明确的接口代替 any",
        "steps": [
          {
            "description": "创建 User 接口",
            "code": "interface User {\n  id: string;\n  name: string;\n  email: string;\n}"
          },
          {
            "description": "使用泛型指定返回类型",
            "code": "const data: User[] = await response.json();"
          }
        ]
      }
    }
  ],
  "statistics": {
    "total": 1,
    "high": 1,
    "medium": 0,
    "low": 0
  }
}
```

### 示例 2: Vue 组件最佳实践检查

**待审查代码**:
```vue
<!-- src/views/user-list/index.vue -->
<script>
export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    async fetchUsers() {
      const res = await fetch('/api/users')
      this.users = await res.json()
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>
```

**调用 dev-advisor**:
```typescript
const result = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/views/user-list/index.vue',
  options: {
    checkVueBestPractices: true
  }
});
```

**返回结果**:
```json
{
  "issues": [
    {
      "id": "VUE-OPTIONS-API-001",
      "title": "优先使用 Composition API",
      "severity": "medium",
      "category": "vue-anti-pattern",
      "message": "检测到 Options API，建议使用 <script setup>",
      "suggestion": {
        "summary": "迁移到 Composition API",
        "referencePractice": "VUE-COMPOSITION-API-001"
      }
    }
  ]
}
```

---

## 自动修复示例

### 示例 1: 修复类型安全问题

**步骤 1: 生成修复计划**

```typescript
// 分析问题并生成计划
const analysis = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/services/user.ts'
});

const plan = await invokeSkill('dev-advisor', {
  action: 'generate-plan',
  issues: analysis.issues,
  options: {
    autoApprove: false,  // 需要用户确认
    maxSteps: 5
  }
});

console.log('执行计划:', plan);
```

**生成的计划**:
```json
{
  "id": "plan-abc123",
  "title": "修复 user.ts 的类型安全问题",
  "steps": [
    {
      "id": "step-001",
      "number": 1,
      "type": "create-file",
      "title": "创建 User 类型定义",
      "targetFile": "src/types/user.ts",
      "operation": {
        "action": "create-file",
        "content": "export interface User {\n  id: string;\n  name: string;\n  email: string;\n}\n"
      }
    },
    {
      "id": "step-002",
      "number": 2,
      "type": "modify-code",
      "title": "更新 getUsers 函数",
      "targetFile": "src/services/user.ts",
      "operation": {
        "action": "modify-code",
        "changes": [
          {
            "type": "modify",
            "lineNumber": 1,
            "oldCode": "import { ... }",
            "newCode": "import { ... } from '...';\nimport { User } from '@/types/user';"
          },
          {
            "type": "modify",
            "lineNumber": 3,
            "oldCode": "const data: any = await response.json();",
            "newCode": "const data: User[] = await response.json();"
          }
        ]
      }
    }
  ]
}
```

**步骤 2: 执行修复计划**

```typescript
// 调用 step-executor 执行
const executionResult = await invokeSkill('step-executor', {
  action: 'execute-plan',
  plan: plan,
  options: {
    mode: 'safe',        // 安全模式：每步确认
    autoRetry: true,     // 自动重试
    parallelVerify: true // 并行验证
  }
});

console.log('执行结果:', executionResult);
```

**执行过程**:
```
▶️ 准备执行步骤 1/2: 创建 User 类型定义

**将要执行的操作**:
1. 创建文件 src/types/user.ts
2. 写入 User 接口定义

**验证命令**:
- pnpm vue-tsc --noEmit

确认执行？(yes/no)
> yes

⚙️ 正在执行步骤 1/2...
1. ✅ 创建文件: src/types/user.ts
2. ⚙️ 运行验证: pnpm vue-tsc --noEmit

✅ 步骤 1/2 完成
- 文件创建成功 (95 bytes)
- TypeScript 编译通过
- 耗时: 2 秒

是否继续执行步骤 2/2？
> yes

⚙️ 正在执行步骤 2/2...
1. ✅ 修改文件: src/services/user.ts
2. ⚙️ 运行验证: pnpm vue-tsc --noEmit

✅ 步骤 2/2 完成
- 文件修改成功
- TypeScript 编译通过
- 耗时: 3 秒

🎉 执行计划完成
总耗时: 5 秒
```

**执行结果**:
```json
{
  "status": "completed",
  "summary": {
    "totalSteps": 2,
    "completedSteps": 2,
    "failedSteps": 0,
    "totalTime": 5
  },
  "changes": {
    "createdFiles": ["src/types/user.ts"],
    "modifiedFiles": ["src/services/user.ts"],
    "addedLines": 8,
    "removedLines": 1
  },
  "qualityChecks": {
    "typescript": true,
    "eslint": true,
    "tests": {
      "total": 10,
      "passed": 10,
      "failed": 0
    }
  }
}
```

### 示例 2: 批量修复多个文件

```typescript
// 分析整个目录
const analysis = await invokeSkill('dev-advisor', {
  action: 'analyze-directory',
  directory: 'src/services/',
  filters: {
    severity: ['high'],
    category: ['type-safety']
  }
});

// 生成批量修复计划
const batchPlan = await invokeSkill('dev-advisor', {
  action: 'generate-batch-plan',
  issues: analysis.issues,
  options: {
    groupByFile: true,
    maxFilesPerBatch: 5
  }
});

// 执行批量修复
for (const subPlan of batchPlan.plans) {
  const result = await invokeSkill('step-executor', {
    action: 'execute-plan',
    plan: subPlan,
    options: {
      mode: 'fast',  // 快速模式：批量执行
      autoRetry: true
    }
  });
  
  console.log(`子计划 ${subPlan.id} 完成:`, result.status);
}
```

---

## 最佳实践查询

### 示例 1: 查询组件设计最佳实践

```typescript
// 查询 Composition API 相关实践
const practices = await invokeSkill('best-practice-library', {
  action: 'find-relevant-practices',
  filters: {
    category: 'component-design',
    techStack: {
      vue: '2.7',
      typescript: '4.9'
    }
  },
  context: {
    taskDescription: '创建用户列表页面组件',
    complexity: 'medium'
  }
});

console.log('推荐的最佳实践:', practices.practices);
```

**返回结果**:
```json
{
  "practices": [
    {
      "id": "VUE-COMPOSITION-API-001",
      "name": "优先使用 Composition API",
      "summary": "新组件应优先使用 <script setup> 语法",
      "confidence": "high",
      "usageCount": 156,
      "implementation": {
        "principles": [
          "使用 <script setup> 语法糖",
          "逻辑按功能组织",
          "提取可复用的 composables"
        ],
        "examples": {
          "standard": {
            "code": "<script setup lang=\"ts\">\nimport { ref, onMounted } from 'vue';\n\nconst users = ref<User[]>([]);\n\nonMounted(() => {\n  fetchUsers();\n});\n</script>"
          }
        }
      }
    }
  ]
}
```

### 示例 2: 对比不同方案

```typescript
// 对比 Options API 和 Composition API
const comparison = await invokeSkill('best-practice-library', {
  action: 'compare-practices',
  practiceIds: [
    'VUE-COMPOSITION-API-001',
    'VUE-OPTIONS-API-PATTERN'
  ],
  aspects: ['performance', 'maintainability', 'learning-curve']
});

console.log('对比结果:', comparison);
```

**返回结果**:
```json
{
  "comparisonMatrix": [
    {
      "aspect": "performance",
      "ratings": [
        {
          "practiceId": "VUE-COMPOSITION-API-001",
          "rating": 5,
          "explanation": "更好的 tree-shaking，更小的打包体积"
        },
        {
          "practiceId": "VUE-OPTIONS-API-PATTERN",
          "rating": 3,
          "explanation": "标准性能，无特殊优化"
        }
      ]
    },
    {
      "aspect": "maintainability",
      "ratings": [
        {
          "practiceId": "VUE-COMPOSITION-API-001",
          "rating": 5,
          "explanation": "逻辑复用更灵活，代码组织更清晰"
        },
        {
          "practiceId": "VUE-OPTIONS-API-PATTERN",
          "rating": 3,
          "explanation": "简单场景下易于理解"
        }
      ]
    }
  ],
  "recommendation": {
    "preferredPractice": "VUE-COMPOSITION-API-001",
    "reasoning": "对于新项目和中大型组件，Composition API 提供更好的类型支持和代码组织能力",
    "whenToUseAlternative": "小型展示组件或团队成员不熟悉 Composition API 时"
  }
}
```

---

## 问题库管理

### 示例 1: 添加新问题

```typescript
// 发现新的问题模式
const newIssue = {
  title: '避免在模板中使用复杂表达式',
  description: '模板中的复杂表达式难以维护和测试',
  severity: 'medium',
  category: 'maintainability',
  triggers: [
    {
      codePattern: '\\{\\{.*[+\\-*/].*\\}\\}'
    }
  ],
  solution: {
    summary: '提取为 computed 属性',
    steps: [
      {
        description: '创建 computed 属性',
        beforeCode: '{{ firstName + \" \" + lastName }}',
        afterCode: '{{ fullName }}',
        verifyCommand: 'pnpm vue-tsc --noEmit'
      }
    ]
  },
  examples: {
    badExample: {
      code: '{{ user.firstName + " " + user.lastName }}',
      explanation: '模板中包含字符串拼接'
    },
    goodExample: {
      code: '<script setup>\nconst fullName = computed(() => `${user.firstName} ${user.lastName}`);\n</script>\n<template>{{ fullName }}</template>',
      explanation: '使用 computed 属性'
    }
  }
};

// 添加到知识库
const result = await invokeSkill('issue-knowledge-base', {
  action: 'add-issue',
  issue: newIssue,
  options: {
    autoGenerateId: true,
    checkDuplicate: true
  }
});

console.log('新问题 ID:', result.issueId);
```

### 示例 2: 查询统计信息

```typescript
// 获取问题统计
const stats = await invokeSkill('issue-knowledge-base', {
  action: 'get-statistics',
  options: {
    timeRange: 'last-30-days',
    groupBy: 'category'
  }
});

console.log('问题统计:', stats);
```

**返回结果**:
```json
{
  "totalIssues": 25,
  "byCategory": {
    "type-safety": 10,
    "vue-anti-pattern": 5,
    "performance": 6,
    "memory-leak": 4
  },
  "topFrequent": [
    {
      "issueId": "TS-ANY-TYPE-001",
      "title": "避免使用 any 类型",
      "occurrenceCount": 15
    },
    {
      "issueId": "VUE-MEMORY-LEAK-001",
      "title": "未清理事件监听器",
      "occurrenceCount": 8
    }
  ]
}
```

---

## 进度跟踪

### 示例 1: 手动管理任务进度

```typescript
// 创建任务
const task = await invokeSkill('progress-tracker', {
  action: 'create-task',
  task: {
    taskId: 'task-refactor-user-list',
    planId: 'plan-abc123',
    title: '重构用户列表组件',
    steps: [
      { id: 'step-1', number: 1, title: '迁移到 Composition API', status: 'pending' },
      { id: 'step-2', number: 2, title: '添加类型定义', status: 'pending' },
      { id: 'step-3', number: 3, title: '编写单元测试', status: 'pending' }
    ]
  }
});

// 更新步骤状态
await invokeSkill('progress-tracker', {
  action: 'update-step',
  taskId: 'task-refactor-user-list',
  stepId: 'step-1',
  updates: {
    status: 'completed',
    duration: 120  // 2分钟
  }
});

// 暂停任务
await invokeSkill('progress-tracker', {
  action: 'pause-task',
  taskId: 'task-refactor-user-list',
  reason: '需要开会'
});

// 恢复任务
const resumedTask = await invokeSkill('progress-tracker', {
  action: 'resume-task',
  taskId: 'task-refactor-user-list'
});

console.log('恢复点:', resumedTask.resumePoint);
```

### 示例 2: 查看进度摘要

```typescript
// 获取进度摘要
const summary = await invokeSkill('progress-tracker', {
  action: 'get-summary',
  taskId: 'task-refactor-user-list'
});

console.log('进度摘要:', summary);
```

**返回结果**:
```json
{
  "taskId": "task-refactor-user-list",
  "title": "重构用户列表组件",
  "status": "in-progress",
  "percentage": 33.3,
  "currentStep": "添加类型定义",
  "steps": [
    {
      "number": 1,
      "title": "迁移到 Composition API",
      "status": "completed",
      "duration": 120
    },
    {
      "number": 2,
      "title": "添加类型定义",
      "status": "executing"
    },
    {
      "number": 3,
      "title": "编写单元测试",
      "status": "pending"
    }
  ]
}
```

---

## 高级场景

### 场景 1: CI/CD 集成

```yaml
# .github/workflows/code-quality.yml
name: Code Quality Check

on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run dev-advisor analysis
        run: |
          npx dev-advisor analyze src/ \
            --format json \
            --output report.json \
            --severity-threshold high
      
      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: code-quality-report
          path: report.json
      
      - name: Check for critical issues
        run: |
          if jq '.statistics.critical > 0' report.json; then
            echo "❌ Found critical issues!"
            exit 1
          fi
```

### 场景 2: 团队规范同步

```typescript
// scripts/sync-team-practices.ts
import { invokeSkill } from '@lingma/skills';
import * as fs from 'fs';

async function syncTeamPractices() {
  // 1. 从中央仓库拉取最新实践
  const remotePractices = await fetchFromRemote('https://team-repo/practices.json');
  
  // 2. 合并到本地库
  for (const practice of remotePractices) {
    await invokeSkill('best-practice-library', {
      action: 'add-practice',
      practice,
      options: {
        checkDuplicate: true,
        updateIfExists: true
      }
    });
  }
  
  // 3. 生成变更报告
  const report = await invokeSkill('best-practice-library', {
    action: 'get-change-report',
    timeRange: 'last-7-days'
  });
  
  // 4. 通知团队
  await notifyTeam({
    title: '最佳实践库已更新',
    changes: report.newPractices,
    link: 'http://internal-docs/best-practices'
  });
}

syncTeamPractices();
```

### 场景 3: 自定义检测规则

```typescript
// custom-rules/my-rule.ts
import { registerCustomRule } from '@lingma/skills/dev-advisor';

// 注册自定义检测规则
registerCustomRule({
  id: 'CUSTOM-NO-CONSOLE-LOG',
  name: '禁止使用 console.log',
  severity: 'low',
  category: 'code-quality',
  
  detector: (code: string, filePath: string) => {
    const matches = code.match(/console\.log\(/g);
    return matches ? matches.length : 0;
  },
  
  suggestion: {
    summary: '使用专业的日志工具代替 console.log',
    steps: [
      {
        description: '替换为 logger 工具',
        beforeCode: 'console.log("debug info");',
        afterCode: 'logger.debug("debug info");'
      }
    ]
  }
});

// 现在 dev-advisor 会自动应用这个规则
const result = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/main.ts',
  options: {
    includeCustomRules: true
  }
});
```

### 场景 4: 批量迁移旧项目

```typescript
// scripts/migrate-legacy-project.ts
import { invokeSkill } from '@lingma/skills';

async function migrateLegacyProject(projectPath: string) {
  console.log('🚀 开始迁移遗留项目...');
  
  // 1. 扫描所有 Vue 文件
  const vueFiles = await scanDirectory(projectPath, '*.vue');
  console.log(`找到 ${vueFiles.length} 个 Vue 文件`);
  
  // 2. 分析每个文件
  const analysisResults = [];
  for (const file of vueFiles) {
    const result = await invokeSkill('dev-advisor', {
      action: 'analyze',
      filePath: file,
      options: {
        focusOn: ['vue-anti-pattern', 'type-safety']
      }
    });
    
    if (result.issues.length > 0) {
      analysisResults.push({ file, issues: result.issues });
    }
  }
  
  console.log(`发现 ${analysisResults.length} 个需要迁移的文件`);
  
  // 3. 生成迁移计划
  const migrationPlan = await invokeSkill('dev-advisor', {
    action: 'generate-migration-plan',
    files: analysisResults,
    strategy: 'incremental'  // 渐进式迁移
  });
  
  // 4. 执行迁移（分批）
  const batchSize = 5;
  for (let i = 0; i < migrationPlan.steps.length; i += batchSize) {
    const batch = migrationPlan.steps.slice(i, i + batchSize);
    
    console.log(`\n执行批次 ${Math.floor(i / batchSize) + 1}...`);
    
    const result = await invokeSkill('step-executor', {
      action: 'execute-batch',
      steps: batch,
      options: {
        mode: 'safe',
        pauseBetweenBatches: true
      }
    });
    
    console.log(`批次完成: ${result.completedSteps}/${result.totalSteps}`);
    
    // 等待用户确认继续
    await waitForUserConfirmation();
  }
  
  console.log('✅ 迁移完成！');
}

migrateLegacyProject('./legacy-project');
```

---

## 💡 最佳实践提示

### 1. 渐进式采用

不要试图一次性修复所有问题，而是：
- 先从高优先级问题开始
- 在新文件中应用最佳实践
- 逐步重构旧代码

### 2. 团队协作

- 定期同步最佳实践库
- Code Review 时引用相关实践
- 分享成功案例和经验

### 3. 持续改进

- 根据反馈调整配置
- 定期清理过时的规则
- 记录新的问题和解决方案

### 4. 性能优化

- 使用批量操作减少 I/O
- 缓存常用查询结果
- 异步处理长时间任务

---

## 📚 相关资源

- [ECOSYSTEM.md](./ECOSYSTEM.md) - 完整架构文档
- [README.md](./README.md) - 快速开始指南
- [config/README.md](./config/README.md) - 配置选项详解

---

## ❓ 常见问题

### Q: 如何禁用某个检查规则？

A: 在 `config/dev-advisor.json` 中设置：
```json
{
  "checks": {
    "typeSafety": {
      "enabled": false
    }
  }
}
```

### Q: 如何自定义验证命令？

A: 修改 `config/step-executor.json`：
```json
{
  "verification": {
    "commands": {
      "typescript": "pnpm vue-tsc --noEmit",
      "custom": "my-custom-command"
    }
  }
}
```

### Q: 进度文件在哪里？

A: 默认在 `.step-executor-progress.json`，可在配置中修改。

### Q: 如何备份数据？

A: 定期备份以下目录：
- `.lingma/skills/issue-knowledge-base/data/`
- `.lingma/skills/best-practice-library/data/`
- `.lingma/skills/progress-tracker/data/`
