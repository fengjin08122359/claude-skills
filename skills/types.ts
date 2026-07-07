/**
 * Dev Advisor Skill 生态系统 - 共享类型定义
 */

// ==================== 通用类型 ====================

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type Status = 'active' | 'deprecated' | 'resolved' | 'pending' | 'completed' | 'failed';

// ==================== Known Issue 类型 ====================

export type IssueCategory =
  | 'type-safety'
  | 'vue-anti-pattern'
  | 'performance'
  | 'memory-leak'
  | 'security'
  | 'maintainability'
  | 'architecture'
  | 'best-practice';

export interface TriggerCondition {
  codePattern?: string;
  eslintRule?: string;
  tsErrorCode?: string;
  filePattern?: string;
  detector?: string;
}

export interface SolutionStep {
  description: string;
  action: 'create-file' | 'modify-code' | 'add-import' | 'refactor' | 'config-change';
  beforeCode?: string;
  afterCode?: string;
  verifyCommand?: string;
  expectedOutcome?: string;
}

export interface RelatedResource {
  title: string;
  type: 'documentation' | 'example' | 'tool' | 'article';
  url: string;
  description?: string;
}

export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: IssueCategory;
  triggers: TriggerCondition[];
  impact: {
    modules?: string[];
    fileTypes?: string[];
    consequences: string;
  };
  solution: {
    summary: string;
    steps: SolutionStep[];
    autoFixScript?: string;
  };
  prevention: {
    guidelines: string[];
    recommendedTools?: string[];
    reviewCheckpoints?: string[];
  };
  resources?: RelatedResource[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    occurrenceCount: number;
    lastOccurredAt?: string;
    tags?: string[];
    status: 'active' | 'deprecated' | 'resolved';
  };
  examples: {
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

// ==================== Best Practice 类型 ====================

export type PracticeCategory =
  | 'component-design'
  | 'state-management'
  | 'api-integration'
  | 'performance'
  | 'styling'
  | 'routing'
  | 'testing'
  | 'build-optimization';

export interface ApplicableScenario {
  description: string;
  useCases: string[];
  notApplicableWhen?: string[];
}

export interface ImplementationRequirement {
  requirement: string;
  mandatory: boolean;
  verificationMethod: 'lint-rule' | 'code-review' | 'test' | 'manual';
  relatedRule?: string;
}

export interface PerformanceMetric {
  metric: string;
  baseline: string;
  optimized: string;
  measurementMethod: string;
}

export interface BestPractice {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: PracticeCategory;
  techStack: {
    vueVersion?: string;
    typescriptVersion?: string;
    requiredPackages?: string[];
    recommendedPackages?: string[];
  };
  scenarios: ApplicableScenario[];
  implementation: {
    principles: string[];
    steps: Array<{
      step: number;
      action: string;
      codeExample?: string;
      notes?: string;
    }>;
    requirements: ImplementationRequirement[];
    examples: {
      standard: {
        description: string;
        code: string;
        filePath?: string;
      };
      variants?: Array<{
        name: string;
        description: string;
        code: string;
        whenToUse: string;
      }>;
    };
  };
  tradeoffs: {
    benefits: string[];
    drawbacks: string[];
    comparisons?: Array<{
      alternativePattern: string;
      whenToChooseThis: string;
      whenToChooseAlternative: string;
    }>;
  };
  performance?: {
    metrics: PerformanceMetric[];
    optimizationTips?: string[];
  };
  relatedPatterns?: {
    complementary?: string[];
    alternatives?: string[];
    prerequisites?: string[];
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    source: string;
    confidence: 'high' | 'medium' | 'low';
    usageCount: number;
    successCases?: string[];
    status: 'recommended' | 'experimental' | 'deprecated';
    tags?: string[];
    version: string;
  };
  references?: Array<{
    title: string;
    type: 'internal-doc' | 'external-article' | 'official-doc' | 'team-discussion';
    url?: string;
    location?: string;
    summary: string;
  }>;
}

// ==================== Execution Plan 类型 ====================

export type StepType =
  | 'create-file'
  | 'modify-code'
  | 'add-import'
  | 'refactor'
  | 'config-change'
  | 'delete-code'
  | 'rename'
  | 'move-file';

export type StepStatus =
  | 'pending'
  | 'executing'
  | 'verifying'
  | 'completed'
  | 'failed'
  | 'skipped';

export interface CodeChange {
  type: 'add' | 'modify' | 'delete';
  path: string;
  content?: string;
  lineNumber?: number;
}

export interface ExecutionStep {
  id: string;
  number: number;
  totalSteps: number;
  type: StepType;
  title: string;
  description: string;
  operation: {
    action: StepType;
    targetFile?: string;
    changes: CodeChange[];
  };
  verification: {
    commands: string[];
    expectedOutput?: string;
    timeout?: number;
  };
  rollback: {
    strategy: 'git-checkout' | 'manual' | 'none';
    backupPath?: string;
    instructions?: string;
  };
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  dependencies?: string[];
}

export interface ExecutionPlan {
  id: string;
  taskId: string;
  title: string;
  description: string;
  steps: ExecutionStep[];
  context: {
    workspaceRoot: string;
    currentBranch?: string;
    relatedFiles: string[];
  };
  metadata: {
    createdAt: string;
    estimatedTime: number;
    complexity: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ExecutionResult {
  planId: string;
  status: 'completed' | 'failed' | 'paused' | 'cancelled';
  summary: {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    totalTime: number;
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
  recommendations?: string[];
}

// ==================== Task Progress 类型 ====================

export type TaskStatus =
  | 'not-started'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface TaskStep {
  id: string;
  number: number;
  title: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
}

export interface TaskProgress {
  taskId: string;
  planId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  steps: TaskStep[];
  progress: {
    currentStep: number;
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    percentage: number;
  };
  timing: {
    createdAt: string;
    startedAt?: string;
    pausedAt?: string;
    resumedAt?: string;
    completedAt?: string;
    totalDuration?: number;
    activeDuration?: number;
  };
  context: {
    workspaceRoot: string;
    currentBranch?: string;
    gitCommitHash?: string;
    relatedFiles: string[];
  };
  metadata: {
    createdBy: string;
    lastUpdatedBy: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
  };
}

// ==================== Skill 调用接口 ====================

export interface SkillInvocation<T = any> {
  skillName: string;
  action: string;
  params?: T;
  options?: Record<string, any>;
}

export interface SkillResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ==================== 统计类型 ====================

export interface IssueStatistics {
  totalIssues: number;
  bySeverity: Record<Severity, number>;
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

export interface PracticeStatistics {
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

export interface ProgressSummary {
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
