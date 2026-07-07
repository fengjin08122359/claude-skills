---
name: dev-advisor
description: 面向高级开发者的交互式代码顾问，通过智能检测和分步引导提升代码质量。自动检测 TypeScript 代码模式问题，提供分级报告和原子化修复方案。当需要代码审查、重构指导或技术方案对比时使用此技能。
---

# 开发顾问 (Dev Advisor)

面向高级开发者的智能代码顾问，专注于 TypeScript/Vue 项目的代码质量提升。

---

# 组件目录 (Component Index)

| 组件 | 职责 | 函数数量 |
|-----|------|---------|
| [TriggerManager](#triggermanager-触发管理器) | 触发机制管理 | 5 |
| [ReportGenerator](#reportgenerator-报告生成器) | 代码分析报告生成 | 5 |
| [StepExecutor](#stepexecutor-步骤执行器) | 分步执行引擎 | 6 |
| [VueSplitter](#vuesplitter-vue拆分器) | Vue组件拆分 | 8 |
| [TaskMonitor](#taskmonitor-任务监控器) | 任务监控监督 | 6 |
| [ErrorHandler](#errorhandler-错误处理器) | 错误处理策略 | 4 |
| [QualityChecker](#qualitychecker-质量检查器) | 代码质量检查 | 6 |

---

# TriggerManager（触发管理器）

## 组件说明

负责检测代码模式并触发分析，支持显式触发和智能提示触发两种模式。

## 函数清单

### 1. detectHighPriorityIssues(filePath: string)

**功能**：检测文件中的高优先级问题

**触发条件（满足任一）**：
- ✓ 保存文件时检测到高优先级问题
- ✓ TypeScript 编译失败
- ✓ 单元测试失败
- ✓ 检测到已知反模式（如 `any` 类型、Options/Composition API 混用）

### 2. checkAutoTriggerConditions(filePath: string)

**功能**：检查是否满足自动触发条件

**防抖策略**：
- 同文件在配置间隔内（默认 300 秒）不重复提示
- 低优先级问题不自动触发，仅累积记录

### 3. loadConfig(configPath: string)

**功能**：加载配置文件

**位置：** `.lingma/skills/config/dev-advisor.json`

### 4. applyThrottlePolicy(filePath: string)

**功能**：应用防抖策略

### 5. validateConfig(config: Config)

**功能**：验证配置有效性

---

# ReportGenerator（报告生成器）

## 组件说明

生成结构化的代码分析报告，按优先级分类展示问题。

## 函数清单

### 1. generateReport(issues: Issue[], filePath: string)

**功能**：生成完整分析报告

**输出格式**：
```markdown
## 🔍 代码分析报告: [文件名]
**扫描时间**: YYYY-MM-DD HH:mm:ss
**问题总数**: X (X高 X中 X低)
```

### 2. classifyBySeverity(issues: Issue[])

**功能**：按优先级分类问题

**分类标准**：
- 🔴 高优先级（阻塞性）：类型安全、内存泄漏、Vue反模式、编译错误
- 🟡 中优先级（性能/可维护性）：性能隐患、代码异味、缺少错误处理
- 🔵 低优先级（优化建议）：命名规范、魔法数字、注释缺失

### 3. formatIssue(issue: Issue)

**功能**：格式化单个问题描述

**输出字段**：
- 位置
- 规则
- 当前代码
- 建议修复
- 影响分析

### 4. calculateSeverity(codePattern: string)

**功能**：计算问题严重程度

### 5. generateNextSteps(issues: Issue[])

**功能**：生成下一步操作建议

---

# StepExecutor（步骤执行器）

## 组件说明

将复杂任务拆解为可验证的最小动作单元，支持断点续传和并行验证。

## 函数清单

### 1. decomposeTask(task: Task)

**功能**：拆解任务为原子化步骤

**最小动作单元定义**：
```
一个最小动作单元 = 一次可独立验证的代码变更
```

**判断标准**：
- ✓ 修改范围：单个文件内的单一职责变更
- ✓ 验证方式：可通过单一命令验证（编译/测试/lint）
- ✓ 回滚成本：Git 级别的可快速撤销
- ✓ 时间成本：5-15 分钟内完成
- ✓ 依赖关系：不依赖其他未完成步骤

### 2. executeStep(step: Step)

**功能**：执行单一步骤

### 3. verifyStep(step: Step)

**功能**：验证步骤执行结果

**验证命令**：
- `pnpm vue-tsc --noEmit`
- `pnpm eslint --fix`

### 4. rollbackStep(step: Step)

**功能**：回滚单一步骤

### 5. saveProgress(progress: Progress)

**功能**：保存执行进度

**存储位置：** `.dev-advisor-progress.json`

### 6. loadProgress(taskId: string)

**功能**：加载执行进度（断点续传）

---

# VueSplitter（Vue拆分器）

## 组件说明

当检测到 Vue 组件中 `<script>` 包含过多 TypeScript 逻辑时（超过 150 行），使用此组件将逻辑拆分为独立的 `.ts` 文件。

## 函数清单

### 阶段0：analyzeVueFile(filePath: string)

**功能**：分析 Vue 文件结构和依赖

**输出分析**：
- 类型定义区
- 响应式状态区
- 业务逻辑区
- 生命周期区
- 引用链路分析
- 拆分风险评估

### 阶段1.1：identifyModules(analysis: AnalysisResult)

**功能**：识别可拆分模块

**可拆分模块类型**：
| 模块 | 目标文件 | 说明 |
|-----|---------|------|
| 类型定义 | types/user.ts | 所有 interface 和 type |
| API 调用 | api/userApi.ts | fetchData 等接口调用 |
| 数据处理 | utils/dataProcessor.ts | formatUserData, validateInput |
| 业务逻辑 | composables/useUserList.ts | handleFilter 等业务逻辑 |

### 阶段1.2：designStructure(modules: Module[])

**功能**：设计新文件结构

**保留在 Vue 文件的内容**：
- 响应式状态声明 (ref/reactive/computed)
- 生命周期钩子 (onMounted/watch)
- 模板事件处理函数（简单委托）
- 组件导入和注册

### 阶段2.1：createTypeFile(definitions: TypeDefinition[])

**功能**：创建类型定义文件

```typescript
// types/user.ts
export interface UserData {
  id: string;
  name: string;
  email: string;
}
```

### 阶段2.2：createApiFile(functions: Function[])

**功能**：创建 API 调用文件

```typescript
// api/userApi.ts
import type { UserListResponse } from '../types/user';
import request from '@/utils/request';

export async function fetchUserList(params: any): Promise<UserListResponse> {
  return request.get('/api/users', { params });
}
```

### 阶段2.3：createUtilsFile(functions: Function[])

**功能**：创建工具函数文件

```typescript
// utils/dataProcessor.ts
export function formatUserData(raw: any): UserData {
  return { ... };
}

export function validateInput(input: string): boolean {
  return input.length > 0;
}
```

### 阶段2.4：createComposableFile(states: ReactiveState[], functions: Function[])

**功能**：创建 Composable 文件

```typescript
// composables/useUserList.ts
import { ref, computed } from 'vue';

export function useUserList() {
  const userList = ref<UserData[]>([]);
  const filteredList = computed(() => { ... });

  async function loadData() { ... }

  return { userList, filteredList, loadData };
}
```

### 阶段2.5：refactorVueFile(originalPath: string, structure: StructureDesign)

**功能**：精简 Vue 文件

```vue
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useUserList } from './composables/useUserList';

export default defineComponent({
  name: 'ComponentName',
  components: {},
  setup() {
    const { userList, filteredList, loadData } = useUserList();

    onMounted(() => {
      loadData();
    });

    return { userList, filteredList };
  }
});
</script>
```

### 阶段3：verifySplit(task: Task)

**功能**：全面验证拆分结果

**验证清单**：
- [ ] TypeScript 编译通过
- [ ] ESLint 检查通过
- [ ] 页面正常加载
- [ ] 数据正确显示
- [ ] 单元测试通过

---

# TaskMonitor（任务监控器）

## 组件说明

全程监控和质量保证，支持阶段性审查和进度跟踪。

## 函数清单

### 1. validateDecomposition(steps: Step[])

**功能**：验证任务分解质量

**检查项**：
- [ ] 每个步骤都是原子化的（单一职责）
- [ ] 步骤之间有清晰的依赖关系
- [ ] 每个步骤都有明确的验证方式
- [ ] 预估时间合理（单步 5-15 分钟）
- [ ] 风险等级评估准确

### 2. checkEnvironment()

**功能**：检查执行环境

**检查项**：
- [ ] Git 工作区干净
- [ ] 依赖已安装
- [ ] 测试环境可用
- [ ] 必要权限已获取

### 3. monitorStepExecution(step: Step)

**功能**：监控步骤执行

**质量控制**：
- [ ] 代码符合项目规范
- [ ] 类型检查通过
- [ ] Lint 检查无错误
- [ ] 单元测试通过
- [ ] 性能无明显退化

### 4. reviewMilestone(progress: Progress)

**功能**：阶段性审查

**每完成 3-5 个步骤后审查**：
- [ ] 整体进度符合预期
- [ ] 代码质量保持水准
- [ ] 没有累积的技术债务
- [ ] 文档同步更新

### 5. generateMonitorReport(taskId: string)

**功能**：生成监控报告

### 6. renderProgressReport(progress: Progress)

**功能**：渲染进度报告

---

# ErrorHandler（错误处理器）

## 组件说明

分类处理执行过程中的错误，提供恢复策略和修复建议。

## 函数清单

### 1. classifyError(error: Error)

**功能**：错误分类

**错误类型**：
- `syntax-error`: 语法错误
- `type-error`: 类型错误
- `test-failure`: 测试失败
- `lint-error`: Lint 错误
- `runtime-error`: 运行时错误
- `dependency-error`: 依赖问题

### 2. applyRecoveryStrategy(error: Error, context: Context)

**功能**：应用恢复策略

**恢复策略**：
1. **自动修复**：对于高置信度的简单错误，提供一键修复
2. **手动建议**：提供多个修复选项，由用户选择
3. **回滚**：必要时回滚到上一步或初始状态
4. **中止**：严重错误时中止整个计划

### 3. suggestFixes(error: Error)

**功能**：提供修复建议

**常见问题修复表**：
| 问题 | 原因 | 解决方案 |
|-----|-----|----------|
| `Property 'value' does not exist` | 在模板中访问 ref 未加 .value | Vue 模板中自动解包 ref，无需 .value |
| `Cannot find module` | 导入路径错误 | 检查相对路径是否正确 |
| `Circular dependency` | A 导入 B，B 又导入 A | 提取公共类型到独立文件 |
| `this is undefined` | 在纯函数中使用 this | 改为通过参数传入所需数据 |
| 响应式失效 | 在 composable 外修改 ref | 确保通过 composable 返回的方法修改状态 |

### 4. renderErrorReport(error: Error, context: Context)

**功能**：渲染错误报告

---

# QualityChecker（质量检查器）

## 组件说明

在完成代码修改或新功能开发后，使用此检查器进行自查。

## 函数清单

### 1. checkFunctionality()

**功能**：功能性检查

**检查项**：
- [ ] 功能是否按需求实现？
- [ ] 边界情况是否处理？(空数据、错误状态、加载状态)
- [ ] 是否有内存泄漏风险？(事件监听器、定时器、订阅)
- [ ] API 调用是否有错误处理和重试机制？

### 2. checkTypeSafety()

**功能**：TypeScript 类型安全检查

**检查项**：
- [ ] 避免使用 `any`，使用 `unknown` 或具体类型
- [ ] API 响应定义完整的 interface
- [ ] Props 和 Emits 有完整的类型定义
- [ ] 函数有明确的返回类型注解
- [ ] 使用泛型提高代码复用性

### 3. checkVueBestPractices()

**功能**：Vue 最佳实践检查

**检查项**：
- [ ] 优先使用 Composition API (`<script setup>`)
- [ ] 异步组件使用 `defineAsyncComponent`
- [ ] 响应式数据正确声明 (`ref`/`reactive`)
- [ ] 计算属性优于方法调用
- [ ] Watch 正确设置 `immediate` 和 `deep`

### 4. checkPerformance()

**功能**：性能优化检查

**检查项**：
- [ ] 大列表使用虚拟滚动 (`el-table-v2`)
- [ ] 图片使用懒加载 (`v-lazy`)
- [ ] 路由组件异步加载
- [ ] 避免不必要的重渲染 (`v-memo`, `shallowRef`)
- [ ] 防抖/节流处理高频事件

### 5. checkMaintainability()

**功能**：可维护性检查

**检查项**：
- [ ] 函数单一职责（不超过 50 行）
- [ ] 组件合理拆分（不超过 300 行）
- [ ] 命名符合规范 (camelCase/PascalCase/kebab-case)
- [ ] 魔法数字/字符串提取为常量
- [ ] 复杂逻辑有清晰的注释

### 6. checkSecurity()

**功能**：安全性检查

**检查项**：
- [ ] 用户输入进行 sanitization
- [ ] 敏感信息不硬编码（使用环境变量）
- [ ] API 调用有适当的权限验证
- [ ] XSS 防护（避免 v-html，或使用 DOMPurify）

---

# 数据模型 (Data Models)

## KnownIssue（已知问题）

```typescript
interface KnownIssue {
  id: string;                    // 唯一标识符 (如: TS-ANY-TYPE-001)
  title: string;                 // 问题标题
  description: string;           // 详细描述
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'type-safety' | 'vue-anti-pattern' | 'performance' | ...;

  triggers: Array<{              // 触发条件
    codePattern?: string;        // 代码模式（正则）
    eslintRule?: string;         // ESLint 规则
    tsErrorCode?: string;        // TS 错误代码
  }>;

  impact: {                      // 影响范围
    consequences: string;        // 潜在后果
  };

  solution: {                    // 解决方案
    summary: string;
    steps: Array<{               // 分步修复指南
      description: string;
      action: 'create-file' | 'modify-code' | ...;
      beforeCode?: string;       // 修复前代码
      afterCode?: string;        // 修复后代码
      verifyCommand?: string;    // 验证命令
    }>;
  };

  prevention: {                  // 预防措施
    guidelines: string[];        // 编码规范
    reviewCheckpoints?: string[]; // Code Review 检查点
  };

  examples: {                    // 代码示例
    badExample: { code: string; explanation: string; };
    goodExample: { code: string; explanation: string; };
  };

  metadata: {                    // 元数据
    createdAt: string;
    updatedAt: string;
    occurrenceCount: number;     // 出现频率
    lastOccurredAt?: string;
    status: 'active' | 'deprecated' | 'resolved';
  };
}
```

## BestPractice（最优模式）

```typescript
interface BestPractice {
  id: string;                    // 唯一标识符
  name: string;                  // 模式名称
  summary: string;               // 简短描述
  description: string;           // 详细说明

  category: 'component-design' | 'state-management' | 'api-integration' | ...;

  techStack: {                   // 技术栈要求
    vueVersion?: string;
    typescriptVersion?: string;
    requiredPackages?: string[];
  };

  scenarios: Array<{             // 适用场景
    description: string;
    useCases: string[];
    notApplicableWhen?: string[];
  }>;

  implementation: {              // 实现指南
    principles: string[];        // 核心原则
    steps: Array<{ step: number; action: string; codeExample?: string; }>;
    requirements: Array<{ requirement: string; mandatory: boolean; }>;
    examples: { standard: { code: string; }; variants?: Array<{ name: string; code: string; }>; };
  };

  tradeoffs: {                   // 优势与权衡
    benefits: string[];
    drawbacks: string[];
  };

  metadata: {                    // 元数据
    createdAt: string;
    updatedAt: string;
    source: string;
    confidence: 'high' | 'medium' | 'low';
    usageCount: number;
    status: 'recommended' | 'experimental' | 'deprecated';
    version: string;
  };
}
```

## Step（执行步骤）

```typescript
interface Step {
  id: string;
  title: string;
  description: string;
  actionType: 'create-file' | 'modify-code' | 'add-import' | 'refactor' | 'config-change' | 'delete-code' | 'rename' | 'move-file';
  targetFile: string;
  beforeCode?: string;
  afterCode?: string;
  verifyCommand?: string;
  dependencies?: string[];       // 前置步骤ID
}
```

## Task（任务）

```typescript
interface Task {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  currentStepIndex: number;
  createdAt: string;
  updatedAt: string;
}
```

## Progress（进度）

```typescript
interface Progress {
  taskId: string;
  completedSteps: string[];
  currentStep: string;
  status: 'pending' | 'in-progress' | 'completed' | 'paused';
  savedAt: string;
  gitHash?: string;              // 用于回滚参考
}
```

---

# 配置文件模板

```json
{
  "trigger": {
    "mode": "smart-prompt",
    "patterns": ["**/*.ts", "**/*.vue"],
    "exclude": ["**/*.d.ts", "**/node_modules/**"],
    "throttle": {
      "minIntervalSeconds": 300,
      "minChangePercent": 10
    },
    "threshold": {
      "autoPromptHighPriority": true,
      "autoPromptMediumCount": 3
    }
  },
  "checks": {
    "typeSafety": {
      "enabled": true,
      "severity": "high",
      "rules": ["no-any", "explicit-return-type", "no-implicit-any"]
    },
    "vueBestPractices": {
      "enabled": true,
      "severity": "medium",
      "rules": ["composition-api-preferred", "async-component", "proper-lifecycle"]
    },
    "performance": {
      "enabled": true,
      "severity": "low",
      "rules": ["virtual-scroll", "cleanup-side-effects", "computed-over-method"]
    }
  },
  "stepExecution": {
    "autoVerify": true,
    "verificationCommands": [
      "pnpm vue-tsc --noEmit",
      "pnpm eslint --fix"
    ],
    "maxStepsPerSession": 5,
    "parallelVerification": true,
    "maxParallelCommands": 2
  }
}
```

**配置位置：** `.lingma/skills/config/dev-advisor.json`

---

# 快速参考

## 调用方式

- 命令：`/dev-advisor analyze [file]`
- 选中代码后调用 skill
- IDE 右键菜单："使用 dev-advisor 分析"

## 优先级定义

| 级别 | 标识 | 问题类型 |
|-----|-----|---------|
| 🔴 高 | 阻塞性 | 类型安全、内存泄漏、Vue反模式、编译错误 |
| 🟡 中 | 性能/可维护性 | 性能隐患、代码异味、缺少错误处理 |
| 🔵 低 | 优化建议 | 命名规范、魔法数字、注释缺失 |

## 步骤类型

- `create-file`: 创建新文件
- `modify-code`: 修改现有代码
- `add-import`: 添加导入语句
- `refactor`: 重构（提取函数/组件）
- `config-change`: 配置文件修改
- `delete-code`: 删除废弃代码
- `rename`: 重命名（变量/文件）
- `move-file`: 移动文件位置
