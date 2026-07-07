---
name: best-practice-library
description: 最佳实践模式库，存储和管理项目开发中的最优模式和编码规范。提供模式检索、推荐、对比和使用指导。当 dev-advisor 需要参考项目规范或推荐最佳实践时调用此技能。
---

# 最佳实践模式库 (Best Practice Library)

一个结构化的最佳实践管理系统，用于记录、检索和应用项目开发中的优秀实践模式。

## 核心职责

- **模式存储**：持久化存储 BestPractice 记录
- **智能推荐**：根据技术栈和场景推荐适用模式
- **模式对比**：提供不同模式的权衡分析
- **使用跟踪**：统计模式使用频率和成功率
- **知识演进**：支持模式的更新、版本管理和废弃

## 数据模型

### BestPractice 结构

```typescript
type PracticeCategory = 
  | 'component-design'      // 组件设计
  | 'state-management'      // 状态管理
  | 'api-integration'        // API 集成
  | 'performance'            // 性能优化
  | 'styling'               // 样式方案
  | 'routing'               // 路由配置
  | 'testing'               // 测试策略
  | 'build-optimization';   // 构建优化

interface ApplicableScenario {
  description: string;
  useCases: string[];
  notApplicableWhen?: string[];
}

interface ImplementationRequirement {
  requirement: string;
  mandatory: boolean;
  verificationMethod: 'lint-rule' | 'code-review' | 'test' | 'manual';
  relatedRule?: string;
}

interface PerformanceMetric {
  metric: string;
  baseline: string;
  optimized: string;
  measurementMethod: string;
}

interface BestPractice {
  id: string;                    // 唯一标识符 (如: VUE-COMPOSITION-API-001)
  name: string;                  // 模式名称
  summary: string;               // 简短描述
  description: string;           // 详细说明
  
  category: PracticeCategory;    // 技术领域分类
  
  techStack: {                   // 技术栈要求
    vueVersion?: string;
    typescriptVersion?: string;
    requiredPackages?: string[];
    recommendedPackages?: string[];
  };
  
  scenarios: ApplicableScenario[]; // 适用场景
  
  implementation: {              // 实现指南
    principles: string[];        // 核心原则
    steps: Array<{
      step: number;
      action: string;
      codeExample?: string;
      notes?: string;
    }>;
    requirements: ImplementationRequirement[];
    examples: {
      standard: {                // 标准实现
        description: string;
        code: string;
        filePath?: string;
      };
      variants?: Array<{         // 变体示例
        name: string;
        description: string;
        code: string;
        whenToUse: string;
      }>;
    };
  };
  
  tradeoffs: {                   // 优势与权衡
    benefits: string[];
    drawbacks: string[];
    comparisons?: Array<{
      alternativePattern: string;
      whenToChooseThis: string;
      whenToChooseAlternative: string;
    }>;
  };
  
  performance?: {                // 性能影响
    metrics: PerformanceMetric[];
    optimizationTips?: string[];
  };
  
  relatedPatterns?: {            // 相关模式
    complementary?: string[];    // 互补模式
    alternatives?: string[];     // 替代模式
    prerequisites?: string[];    // 前置依赖
  };
  
  metadata: {                    // 元数据
    createdAt: string;
    updatedAt: string;
    source: string;              // 来源 (AGENTS.md / 团队共识)
    confidence: 'high' | 'medium' | 'low';
    usageCount: number;          // 使用频率
    successCases?: string[];     // 成功案例
    status: 'recommended' | 'experimental' | 'deprecated';
    tags?: string[];
    version: string;             // 版本号
  };
  
  references?: Array<{           // 参考资料
    title: string;
    type: 'internal-doc' | 'external-article' | 'official-doc' | 'team-discussion';
    url?: string;
    location?: string;
    summary: string;
  }>;
}
```

## API 接口

### 1. 查找相关实践

**调用方式**：
```typescript
const result = await invokeSkill('best-practice-library', {
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
  },
  options: {
    limit: 5,
    sortBy: 'relevance'
  }
});
```

**返回结果**：
```typescript
interface FindPracticesResult {
  practices: BestPractice[];
  relevanceScores: Array<{
    practiceId: string;
    score: number;
    matchedCriteria: string[];
  }>;
  recommendations: string[];
}
```

**处理逻辑**：
1. 根据技术栈过滤不兼容的模式
2. 根据任务描述匹配适用场景
3. 按置信度和使用频率排序
4. 返回最相关的 N 个模式

### 2. 添加新模式

**调用方式**：
```typescript
const result = await invokeSkill('best-practice-library', {
  action: 'add-practice',
  practice: {
    name: '优先使用 Composition API',
    summary: '新组件应优先使用 <script setup>',
    category: 'component-design',
    // ... 其他字段
  },
  options: {
    autoGenerateId: true,
    checkDuplicate: true,
    requireApproval: true
  }
});
```

### 3. 更新现有模式

**调用方式**：
```typescript
await invokeSkill('best-practice-library', {
  action: 'update-practice',
  practiceId: 'VUE-COMPOSITION-API-001',
  updates: {
    'metadata.usageCount': 157,
    'metadata.updatedAt': new Date().toISOString(),
    'implementation.examples.standard.code': '...'
  },
  options: {
    createNewVersion: true,
    previousVersion: '1.2.0'
  }
});
```

### 4. 查询模式详情

**调用方式**：
```typescript
const practice = await invokeSkill('best-practice-library', {
  action: 'get-practice',
  practiceId: 'VUE-COMPOSITION-API-001',
  options: {
    includeReferences: true,
    includeVariants: true
  }
});
```

### 5. 获取模式对比

**调用方式**：
```typescript
const comparison = await invokeSkill('best-practice-library', {
  action: 'compare-practices',
  practiceIds: ['VUE-COMPOSITION-API-001', 'OPTIONS-API-PATTERN'],
  aspects: ['performance', 'maintainability', 'learning-curve']
});
```

**返回结果**：
```typescript
interface PracticeComparison {
  practices: BestPractice[];
  comparisonMatrix: {
    aspect: string;
    ratings: Array<{
      practiceId: string;
      rating: number;  // 1-5
      explanation: string;
    }>;
  }[];
  recommendation: {
    preferredPractice: string;
    reasoning: string;
    whenToUseAlternative: string;
  };
}
```

### 6. 获取统计数据

**调用方式**：
```typescript
const stats = await invokeSkill('best-practice-library', {
  action: 'get-statistics',
  options: {
    timeRange: 'last-90-days',
    groupBy: 'category'
  }
});
```

**返回结果**：
```typescript
interface PracticeStatistics {
  totalPractices: number;
  byCategory: Record<PracticeCategory, number>;
  byStatus: Record<'recommended' | 'experimental' | 'deprecated', number>;
  mostUsed: Array<{
    practiceId: string;
    name: string;
    usageCount: number;
  }>;
  adoptionTrends: Array<{
    date: string;
    newAdoptions: number;
  }>;
}
```

### 7. 搜索模式

**调用方式**：
```typescript
const results = await invokeSkill('best-practice-library', {
  action: 'search-practices',
  query: 'composition api setup',
  filters: {
    category: ['component-design'],
    status: ['recommended'],
    minConfidence: 'high'
  },
  options: {
    limit: 10,
    sortBy: 'relevance'
  }
});
```

### 8. 记录使用情况

**调用方式**：
```typescript
await invokeSkill('best-practice-library', {
  action: 'record-usage',
  practiceId: 'VUE-COMPOSITION-API-001',
  usage: {
    projectId: 'app-company',
    componentName: 'UserList',
    outcome: 'success',
    feedback: '类型推断非常准确，开发效率提升明显'
  }
});
```

## 存储结构

### 文件组织

```
.lingma/skills/best-practice-library/
├── SKILL.md
├── data/
│   ├── practices/           # 模式记录目录
│   │   ├── index.json       # 索引文件
│   │   ├── VUE-COMPOSITION-API-001.json
│   │   ├── TYPESCRIPT-STRICT-001.json
│   │   └── ...
│   └── archives/            # 已废弃模式
│       └── ...
└── schemas/
    └── best-practice.schema.json
```

### 索引文件格式

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-04-14T10:00:00Z",
  "practices": [
    {
      "id": "VUE-COMPOSITION-API-001",
      "name": "优先使用 Composition API",
      "category": "component-design",
      "confidence": "high",
      "usageCount": 156,
      "status": "recommended",
      "version": "1.2.0",
      "filePath": "./practices/VUE-COMPOSITION-API-001.json",
      "tags": ["vue", "composition-api", "typescript"]
    }
  ],
  "statistics": {
    "totalPractices": 15,
    "byCategory": {
      "component-design": 5,
      "state-management": 3,
      "performance": 4,
      "testing": 3
    },
    "byStatus": {
      "recommended": 12,
      "experimental": 2,
      "deprecated": 1
    }
  }
}
```

## 智能推荐算法

### 推荐策略

1. **技术栈匹配**（权重 0.4）
   ```typescript
   // 检查技术栈兼容性
   if (practice.techStack.vueVersion) {
     const semverMatch = checkSemverCompatibility(
       currentVueVersion,
       practice.techStack.vueVersion
     );
     if (semverMatch) score += 0.4;
   }
   ```

2. **场景匹配**（权重 0.3）
   ```typescript
   // 匹配适用场景
   for (const scenario of practice.scenarios) {
     if (scenarioMatches(scenario, taskContext)) {
       score += 0.3;
       break;
     }
   }
   ```

3. **使用频率**（权重 0.2）
   ```typescript
   // 高频使用的模式优先
   const frequencyScore = Math.min(practice.metadata.usageCount / 100, 1);
   score += 0.2 * frequencyScore;
   ```

4. **置信度**（权重 0.1）
   ```typescript
   const confidenceMap = { high: 1, medium: 0.6, low: 0.3 };
   score += 0.1 * confidenceMap[practice.metadata.confidence];
   ```

### 相关性评分

```typescript
function calculateRelevance(
  practice: BestPractice,
  context: {
    techStack: any;
    taskDescription: string;
    complexity: string;
  }
): number {
  let score = 0;
  
  // 技术栈匹配
  if (isTechStackCompatible(practice.techStack, context.techStack)) {
    score += 0.4;
  }
  
  // 场景匹配
  if (matchesScenario(practice.scenarios, context.taskDescription)) {
    score += 0.3;
  }
  
  // 使用频率
  const frequencyScore = Math.min(practice.metadata.usageCount / 100, 1);
  score += 0.2 * frequencyScore;
  
  // 置信度
  const confidenceMap = { high: 1, medium: 0.6, low: 0.3 };
  score += 0.1 * confidenceMap[practice.metadata.confidence];
  
  return Math.min(score, 1.0);
}
```

## 与 dev-advisor 的协作

### 场景 1：代码审查时参考

```typescript
// dev-advisor 审查代码时
async function reviewCode(filePath: string, code: string) {
  // 1. 识别代码模式
  const detectedPatterns = detectPatterns(code);
  
  // 2. 查询相关的最佳实践
  const relevantPractices = await invokeSkill('best-practice-library', {
    action: 'find-relevant-practices',
    context: {
      detectedPatterns,
      techStack: { vue: '2.7', typescript: '4.9' }
    }
  });
  
  // 3. 检查代码是否符合最佳实践
  const complianceCheck = relevantPractices.practices.map(practice => ({
    practice: practice.name,
    compliant: checkCompliance(code, practice),
    suggestions: getImprovementSuggestions(code, practice)
  }));
  
  return complianceCheck;
}
```

### 场景 2：生成代码建议

```typescript
// dev-advisor 生成代码时
async function generateComponentSuggestion(task: string) {
  // 1. 查找适用的最佳实践
  const practices = await invokeSkill('best-practice-library', {
    action: 'find-relevant-practices',
    context: {
      taskDescription: task,
      techStack: { vue: '2.7' }
    }
  });
  
  // 2. 基于最佳实践生成代码模板
  const template = generateTemplateFromPractices(practices.practices);
  
  return {
    template,
    appliedPractices: practices.practices.map(p => ({
      id: p.id,
      name: p.name,
      reason: p.summary
    }))
  };
}
```

### 场景 3：技术方案对比

```typescript
// dev-advisor 进行技术选型时
async function compareApproaches(options: string[]) {
  // 1. 查找每个选项对应的最佳实践
  const practices = await Promise.all(
    options.map(opt => 
      invokeSkill('best-practice-library', {
        action: 'search-practices',
        query: opt
      })
    )
  );
  
  // 2. 对比不同方案
  const comparison = await invokeSkill('best-practice-library', {
    action: 'compare-practices',
    practiceIds: practices.map(p => p.practices[0]?.id).filter(Boolean),
    aspects: ['performance', 'maintainability', 'complexity']
  });
  
  return comparison;
}
```

## 最佳实践

### 1. 模式记录规范

- **名称清晰**：直接表达模式的核心思想
- **示例完整**：提供可直接运行的代码示例
- **权衡明确**：清楚说明优缺点和适用场景
- **版本管理**：重要变更增加版本号
- **来源标注**：注明模式的来源和依据

### 2. 分类体系

- 使用一致的分类标准
- 避免分类重叠
- 定期审查和调整分类

### 3. 质量控制

- **团队审核**：新模式需经团队讨论确认
- **实践验证**：至少在一个项目中成功应用
- **文档完整**：包含完整的实现指南和示例
- **持续更新**：根据反馈不断优化

### 4. 推广策略

- 在新项目中主动推荐
- Code Review 时引用相关模式
- 定期分享成功案例
- 建立模式采用激励机制

## 配置文件

### config/best-practice-library.json

```json
{
  "storage": {
    "practicesDir": ".lingma/skills/best-practice-library/data/practices",
    "archivesDir": ".lingma/skills/best-practice-library/data/archives",
    "indexFile": "index.json"
  },
  "recommendation": {
    "minConfidence": "medium",
    "maxResults": 5,
    "enableUsageWeighting": true
  },
  "versioning": {
    "autoIncrement": true,
    "keepHistory": true,
    "maxVersions": 10
  },
  "maintenance": {
    "reviewIntervalDays": 90,
    "deprecateUnusedAfterDays": 365,
    "requireApprovalForNew": true
  }
}
```

## 注意事项

1. **避免教条主义**：最佳实践不是绝对规则，要根据实际情况灵活应用
2. **持续演进**：随着技术发展及时更新模式
3. **上下文敏感**：考虑项目规模、团队能力等因素
4. **平衡取舍**：没有完美的方案，只有最适合的方案
5. **团队共识**：确保团队成员理解并认同这些实践
6. **实证导向**：基于实际数据和反馈调整模式
