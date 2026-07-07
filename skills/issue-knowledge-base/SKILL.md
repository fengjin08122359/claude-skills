---
name: issue-knowledge-base
description: 已知问题知识库，存储和管理常见问题模式与解决方案。提供问题匹配、检索、统计和预防建议。当 dev-advisor 检测代码或需要查询历史问题时调用此技能。
---

# 已知问题知识库 (Issue Knowledge Base)

一个结构化的问题管理系统，用于记录、检索和分析开发过程中遇到的常见问题。

## 核心职责

- **问题存储**：持久化存储 KnownIssue 记录
- **智能匹配**：根据代码模式自动匹配已知问题
- **统计分析**：提供问题频率、趋势等统计数据
- **预防建议**：基于历史数据提供编码规范建议
- **知识演进**：支持问题的更新、归档和废弃

## 数据模型

### KnownIssue 结构

```typescript
type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

type IssueCategory = 
  | 'type-safety'        // 类型安全
  | 'vue-anti-pattern'   // Vue 反模式
  | 'performance'        // 性能问题
  | 'memory-leak'        // 内存泄漏
  | 'security'           // 安全问题
  | 'maintainability'    // 可维护性
  | 'architecture'       // 架构问题
  | 'best-practice';     // 最佳实践

interface TriggerCondition {
  codePattern?: string;        // 代码模式（正则表达式）
  eslintRule?: string;         // ESLint 规则 ID
  tsErrorCode?: string;        // TypeScript 错误代码
  filePattern?: string;        // 文件路径模式
  detector?: string;           // 自定义检测函数名称
}

interface SolutionStep {
  description: string;
  action: 'create-file' | 'modify-code' | 'add-import' | 'refactor' | 'config-change';
  beforeCode?: string;
  afterCode?: string;
  verifyCommand?: string;
  expectedOutcome?: string;
}

interface RelatedResource {
  title: string;
  type: 'documentation' | 'example' | 'tool' | 'article';
  url: string;
  description?: string;
}

interface KnownIssue {
  id: string;                    // 唯一标识符 (如: TS-ANY-TYPE-001)
  title: string;                 // 问题标题
  description: string;           // 详细描述
  severity: IssueSeverity;       // 严重级别
  category: IssueCategory;       // 问题分类
  
  triggers: TriggerCondition[];  // 触发条件
  
  impact: {                      // 影响范围
    modules?: string[];
    fileTypes?: string[];
    consequences: string;
  };
  
  solution: {                    // 解决方案
    summary: string;
    steps: SolutionStep[];
    autoFixScript?: string;
  };
  
  prevention: {                  // 预防措施
    guidelines: string[];
    recommendedTools?: string[];
    reviewCheckpoints?: string[];
  };
  
  resources?: RelatedResource[]; // 相关资源
  
  metadata: {                    // 元数据
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    occurrenceCount: number;     // 出现频率
    lastOccurredAt?: string;
    tags?: string[];
    status: 'active' | 'deprecated' | 'resolved';
  };
  
  examples: {                    // 代码示例
    badExample: {
      code: string;
      explanation: string;
    };
    goodExample: {
      code: string;
      explanation: string;
    };
  };
}
```

## API 接口

### 1. 查找匹配的问题

**调用方式**：
```typescript
const result = await invokeSkill('issue-knowledge-base', {
  action: 'find-matching-issues',
  code: sourceCode,
  filePath: 'src/views/user-list/index.vue',
  options: {
    maxResults: 5,
    minSeverity: 'medium'
  }
});
```

**返回结果**：
```typescript
interface FindIssuesResult {
  matched: KnownIssue[];
  matchDetails: Array<{
    issueId: string;
    matchedTrigger: TriggerCondition;
    confidence: number;  // 匹配置信度 0-1
  }>;
}
```

**处理逻辑**：
1. 提取代码中的关键模式
2. 遍历所有 active 状态的问题
3. 检查每个问题的 triggers 是否匹配
4. 按置信度和严重程度排序
5. 返回最相关的 N 个问题

### 2. 添加新问题

**调用方式**：
```typescript
const result = await invokeSkill('issue-knowledge-base', {
  action: 'add-issue',
  issue: {
    title: '避免使用 any 类型',
    description: '...',
    severity: 'high',
    category: 'type-safety',
    triggers: [{ codePattern: ':\\s*any\\b' }],
    // ... 其他字段
  },
  options: {
    autoGenerateId: true,
    checkDuplicate: true
  }
});
```

**返回结果**：
```typescript
interface AddIssueResult {
  success: boolean;
  issueId?: string;
  message?: string;
  duplicateFound?: KnownIssue;
}
```

**处理逻辑**：
1. 验证问题数据的完整性
2. 检查是否有重复问题（基于 title + category）
3. 自动生成 ID（如果未提供）
4. 保存到文件系统
5. 更新索引文件

### 3. 更新现有问题

**调用方式**：
```typescript
await invokeSkill('issue-knowledge-base', {
  action: 'update-issue',
  issueId: 'TS-ANY-TYPE-001',
  updates: {
    'metadata.occurrenceCount': 16,
    'metadata.lastOccurredAt': new Date().toISOString()
  }
});
```

### 4. 查询问题详情

**调用方式**：
```typescript
const issue = await invokeSkill('issue-knowledge-base', {
  action: 'get-issue',
  issueId: 'TS-ANY-TYPE-001'
});
```

### 5. 删除/归档问题

**调用方式**：
```typescript
await invokeSkill('issue-knowledge-base', {
  action: 'archive-issue',
  issueId: 'TS-ANY-TYPE-001',
  reason: '已不再适用'
});
```

### 6. 获取统计数据

**调用方式**：
```typescript
const stats = await invokeSkill('issue-knowledge-base', {
  action: 'get-statistics',
  options: {
    timeRange: 'last-30-days',
    groupBy: 'category'
  }
});
```

**返回结果**：
```typescript
interface IssueStatistics {
  totalIssues: number;
  bySeverity: Record<IssueSeverity, number>;
  byCategory: Record<IssueCategory, number>;
  byStatus: Record<'active' | 'deprecated' | 'resolved', number>;
  topFrequent: Array<{
    issueId: string;
    title: string;
    occurrenceCount: number;
  }>;
  recentTrends: Array<{
    date: string;
    count: number;
  }>;
}
```

### 7. 搜索问题

**调用方式**：
```typescript
const results = await invokeSkill('issue-knowledge-base', {
  action: 'search-issues',
  query: 'any type',
  filters: {
    category: ['type-safety'],
    severity: ['high', 'critical'],
    status: ['active']
  },
  options: {
    limit: 10,
    sortBy: 'relevance'
  }
});
```

## 存储结构

### 文件组织

```
.lingma/skills/issue-knowledge-base/
├── SKILL.md
├── data/
│   ├── issues/              # 问题记录目录
│   │   ├── index.json       # 索引文件
│   │   ├── TS-ANY-TYPE-001.json
│   │   ├── VUE-MEMORY-LEAK-001.json
│   │   └── ...
│   └── archives/            # 已归档问题
│       └── ...
└── schemas/
    └── known-issue.schema.json
```

### 索引文件格式

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-04-14T10:00:00Z",
  "issues": [
    {
      "id": "TS-ANY-TYPE-001",
      "title": "避免使用 any 类型",
      "severity": "high",
      "category": "type-safety",
      "triggers": [":\\s*any\\b"],
      "filePath": "./issues/TS-ANY-TYPE-001.json",
      "occurrenceCount": 15,
      "lastOccurredAt": "2026-04-13T15:30:00Z",
      "status": "active"
    }
  ],
  "statistics": {
    "totalIssues": 25,
    "bySeverity": {
      "critical": 2,
      "high": 8,
      "medium": 10,
      "low": 5
    },
    "byCategory": {
      "type-safety": 10,
      "vue-anti-pattern": 5,
      "performance": 6,
      "memory-leak": 4
    },
    "byStatus": {
      "active": 20,
      "deprecated": 3,
      "resolved": 2
    }
  }
}
```

## 智能匹配算法

### 匹配策略

1. **代码模式匹配**（权重 0.5）
   ```typescript
   // 使用正则表达式匹配代码
   const regex = new RegExp(trigger.codePattern);
   if (regex.test(code)) {
     score += 0.5;
   }
   ```

2. **ESLint 规则匹配**（权重 0.3）
   ```typescript
   // 检查 ESLint 报告的问题
   if (eslintErrors.some(e => e.ruleId === trigger.eslintRule)) {
     score += 0.3;
   }
   ```

3. **文件路径匹配**（权重 0.1）
   ```typescript
   // 检查文件路径是否符合模式
   if (trigger.filePattern && filePath.match(trigger.filePattern)) {
     score += 0.1;
   }
   ```

4. **历史频率加权**（权重 0.1）
   ```typescript
   // 高频问题优先
   const frequencyScore = Math.min(issue.metadata.occurrenceCount / 100, 1);
   score += 0.1 * frequencyScore;
   ```

### 置信度计算

```typescript
function calculateConfidence(
  issue: KnownIssue,
  code: string,
  filePath: string,
  eslintErrors: any[]
): number {
  let score = 0;
  
  for (const trigger of issue.triggers) {
    if (trigger.codePattern && new RegExp(trigger.codePattern).test(code)) {
      score += 0.5;
    }
    
    if (trigger.eslintRule && eslintErrors.some(e => e.ruleId === trigger.eslintRule)) {
      score += 0.3;
    }
    
    if (trigger.filePattern && filePath.match(trigger.filePattern)) {
      score += 0.1;
    }
  }
  
  // 频率加权
  const frequencyScore = Math.min(issue.metadata.occurrenceCount / 100, 1);
  score += 0.1 * frequencyScore;
  
  return Math.min(score, 1.0);
}
```

## 与 dev-advisor 的协作

### 场景 1：代码分析时查询

```typescript
// dev-advisor 检测到代码问题时
async function analyzeCode(filePath: string, code: string) {
  // 1. 查询已知问题
  const matchedIssues = await invokeSkill('issue-knowledge-base', {
    action: 'find-matching-issues',
    code,
    filePath
  });
  
  // 2. 如果有匹配的问题，直接使用已知解决方案
  if (matchedIssues.matched.length > 0) {
    return {
      type: 'known-issue',
      issues: matchedIssues.matched,
      suggestions: matchedIssues.matched.map(i => i.solution)
    };
  }
  
  // 3. 否则进行常规分析
  return performRegularAnalysis(code);
}
```

### 场景 2：发现新模式时添加

```typescript
// dev-advisor 发现新的问题模式
async function reportNewIssue(issueData: Partial<KnownIssue>) {
  // 提示用户确认
  const confirmed = await askUser({
    message: `发现新的问题模式: "${issueData.title}"，是否添加到知识库？`,
    options: ['添加', '忽略', '稍后提醒']
  });
  
  if (confirmed === '添加') {
    await invokeSkill('issue-knowledge-base', {
      action: 'add-issue',
      issue: issueData
    });
  }
}
```

### 场景 3：生成预防建议

```typescript
// 基于历史数据生成团队级别的预防建议
async function generatePreventionReport() {
  const stats = await invokeSkill('issue-knowledge-base', {
    action: 'get-statistics',
    options: { timeRange: 'last-90-days' }
  });
  
  // 找出最高频的问题
  const topIssues = stats.topFrequent.slice(0, 5);
  
  return {
    title: 'Q2 代码质量改进建议',
    topIssues,
    recommendations: topIssues.map(issue => ({
      issue: issue.title,
      guideline: issue.prevention.guidelines[0],
      tool: issue.prevention.recommendedTools?.[0]
    }))
  };
}
```

## 最佳实践

### 1. 问题记录规范

- **标题简洁明确**：直接说明问题本质
- **描述详细完整**：包含背景、影响、解决方案
- **示例对比清晰**：bad example vs good example
- **触发条件准确**：确保能正确匹配到问题代码
- **解决方案可执行**：提供具体的修复步骤

### 2. 分类和标签

- 使用一致的分类体系
- 添加相关标签便于搜索
- 定期审查和调整分类

### 3. 维护策略

- **定期清理**：归档过时或已解决的问题
- **去重检查**：添加新问题时检查重复
- **更新频率**：每次问题出现时更新 occurrenceCount
- **质量审查**：定期检查问题记录的准确性

### 4. 性能优化

- 使用索引文件加速查找
- 缓存常用查询结果
- 异步加载大型问题文件
- 限制单次返回结果数量

## 配置文件

### config/issue-knowledge-base.json

```json
{
  "storage": {
    "issuesDir": ".lingma/skills/issue-knowledge-base/data/issues",
    "archivesDir": ".lingma/skills/issue-knowledge-base/data/archives",
    "indexFile": "index.json"
  },
  "matching": {
    "minConfidence": 0.3,
    "maxResults": 5,
    "enableFrequencyWeighting": true
  },
  "maintenance": {
    "autoArchiveAfterDays": 365,
    "duplicateCheckEnabled": true,
    "statisticsUpdateInterval": 3600
  }
}
```

## 注意事项

1. **隐私保护**：不要存储敏感代码或业务逻辑
2. **质量控制**：新问题需要经过审核才能加入
3. **版本管理**：重要变更应记录版本号
4. **备份策略**：定期备份问题库数据
5. **团队协作**：建立问题提交和审查流程
6. **持续演进**：根据使用情况优化匹配算法
