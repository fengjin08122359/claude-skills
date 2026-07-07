# Workspace Manager Skill

## 功能说明

管理 monorepo 中的 workspace 项目，提供依赖同步、版本管理、分支创建等功能。

## 核心能力

### 1. 创建工作区应用

```typescript
interface CreateWorkspaceOptions {
  name: string;              // 应用名称（如 app-bond）
  type: 'app' | 'iframe' | 'independent';  // 应用类型
  template?: string;         // 模板来源（默认 app-template）
  project?: string;          // 所属项目（如 sczq）
}

// 示例：创建债券 F9 子应用
await createWorkspace({
  name: 'sczq-bond',
  type: 'app',
  template: 'app-template',
  project: 'sczq'
});
```

**自动生成：**
- package.json（包含正确的 name 和 dependencies）
- README.md（项目名称和描述）
- 基础目录结构（src/, scripts/, public/）
- Git 分支配置

### 2. 同步 package.json 依赖

```typescript
interface SyncDependenciesOptions {
  workspaces: string[];      // 工作区列表（支持 glob 模式）
  deps?: {                   // 需要同步的依赖
    [name: string]: string;  // 依赖名 -> 版本号
  };
  syncDevDeps?: boolean;     // 是否同步开发依赖
  syncPeerDeps?: boolean;    // 是否同步对等依赖
}

// 示例：同步所有子应用的 Vue 版本
await syncDependencies({
  workspaces: ['workspaces/app-*'],
  deps: {
    'vue': '2.7.16',
    'element-ui': '^2.15.13'
  },
  syncDevDeps: true
});
```

**检查项：**
- 版本号一致性
- workspace:* 协议使用
- tgz 本地包路径正确性
- peerDependencies 兼容性

### 3. 依赖冲突检测

```typescript
interface ConflictReport {
  packageName: string;
  versions: {
    [workspace: string]: string;
  };
  severity: 'error' | 'warning';
  suggestion: string;
}

// 检测并报告冲突
const conflicts = await checkDependencyConflicts();
/*
返回示例：
[
  {
    packageName: 'echarts',
    versions: {
      'app-analysis': '^5.4.1',
      'app-bond': '^5.5.0'
    },
    severity: 'warning',
    suggestion: '建议统一使用 ^5.5.0'
  }
]
*/
```

### 4. 批量版本号更新

```typescript
interface VersionUpdateOptions {
  workspaces: string[];
  versionType: 'major' | 'minor' | 'patch';
  commitMessage?: string;
}

// 示例：补丁版本更新
await updateVersions({
  workspaces: ['workspaces/app-*'],
  versionType: 'patch',
  commitMessage: 'T202602103982 版本更新 - 修复已知问题'
});
```

**自动化流程：**
1. 读取当前版本号
2. 计算新版本号（遵循 semver）
3. 更新 package.json
4. 生成 git tag
5. 提交代码（可选）

### 5. Changeset 集成

```typescript
// 初始化 changeset
await initChangeset();

// 添加变更集
await addChangeset({
  workspaces: ['app-bond', 'app-company'],
  type: 'minor',
  summary: '新增债券对比功能'
});

// 应用变更集
await applyChangeset();
```

**生成的文件：**
```
.changeset/
├── config.json
└── smart-dolphins-hide.md  # 变更记录
```

### 6. Git 分支管理

```typescript
interface BranchOptions {
  baseBranch: string;        // 基础分支（如 app-bond）
  taskNumber: string;        // 任务编号（如 T202602103982）
  description?: string;      // 分支描述
}

// 创建开发分支
await createBranch({
  baseBranch: 'app-bond',
  taskNumber: 'T202602103982',
  description: '债券详情页优化'
});
// 生成：app-bond-T202602103982
```

**分支命名规范：**
- 开发分支：`{baseBranch}-{taskNumber}`
- Tag 版本：`{baseBranch}-{version}-{date}`
- 项目版本：`project-{name}-tag-{version}-{date}`

### 7. 提交消息生成

```typescript
interface CommitMessageOptions {
  taskNumber: string;        // 效能任务编号
  description: string;       // 修改内容
  type: 'feature' | 'fix' | 'refactor' | 'docs' | 'chore';
  needTest: boolean;         // 是否需要测试
  isAIGC: boolean;           // 是否 AIGC 生成
  aiTool?: string;           // AIGC 工具名称
}

// 生成符合规范的提交消息
const message = generateCommitMessage({
  taskNumber: 'T202602103982',
  description: 'saas-版本更新',
  type: 'feature',
  needTest: true,
  isAIGC: false
});
// 输出："[T202602103982] saas-版本更新 feature 需要测试"
```

### 8. Workspace 命令批量执行

```typescript
interface BatchCommandOptions {
  workspaces: string[];
  command: string;
  parallel?: boolean;
  continueOnError?: boolean;
}

// 示例：批量安装依赖
await runBatchCommand({
  workspaces: ['workspaces/app-*'],
  command: 'pnpm install',
  parallel: true,
  continueOnError: false
});

// 示例：批量 git 操作
await runBatchCommand({
  workspaces: ['workspaces/app-analysis', 'workspaces/app-bond'],
  command: 'git status',
  parallel: false
});
```

## 典型工作流

### 工作流 1：添加新子应用

```typescript
// 1. 创建工作区
await createWorkspace({
  name: 'sczq-subject',
  type: 'app',
  template: 'app-template',
  project: 'sczq'
});

// 2. 同步依赖版本
await syncDependencies({
  workspaces: ['workspaces/sczq-subject'],
  deps: {
    'vue': '2.7.16',
    'element-ui': '^2.15.13',
    'GildataDesign': '../../tgz/GildataDesign-3.0.16.tgz'
  }
});

// 3. 创建开发分支
await createBranch({
  baseBranch: 'sczq-subject',
  taskNumber: 'T202602103982'
});

// 4. 初始化 git
await initGitRepo({
  remote: 'http://10.105.10.117:8090/zhimou1.0/saas-micro-app'
});
```

### 工作流 2：批量更新依赖

```typescript
// 1. 检测冲突
const conflicts = await checkDependencyConflicts();
if (conflicts.length > 0) {
  console.warn('发现依赖冲突:', conflicts);
}

// 2. 更新指定依赖
await syncDependencies({
  workspaces: ['workspaces/app-*'],
  deps: {
    'echarts': '^5.5.0',
    'moment': '^2.29.4'
  },
  syncDevDeps: true
});

// 3. 强制重新安装
await runBatchCommand({
  workspaces: ['workspaces/app-*'],
  command: 'pnpm i --shamefully-hoist --force --no-frozen-lockfile'
});
```

### 工作流 3：版本发布

```typescript
// 1. 添加 changeset
await addChangeset({
  workspaces: ['app-bond', 'app-company'],
  type: 'minor',
  summary: '新增数据导出功能'
});

// 2. 应用 changeset
await applyChangeset();

// 3. 批量提交
await runBatchCommand({
  workspaces: ['workspaces/app-bond', 'workspaces/app-company'],
  command: 'git add . && git commit -m "版本更新"'
});

// 4. 推送到 Gerrit
await runBatchCommand({
  workspaces: ['workspaces/app-bond', 'workspaces/app-company'],
  command: 'git push origin HEAD:refs/for/branch'
});
```

## API 参考

### createWorkspace(options)

创建新的工作区应用

**参数：**
- `options.name` (string): 应用名称
- `options.type` ('app' | 'iframe' | 'independent'): 应用类型
- `options.template` (string, optional): 模板来源
- `options.project` (string, optional): 所属项目

**返回：** Promise<void>

### syncDependencies(options)

同步依赖版本

**参数：**
- `options.workspaces` (string[]): 工作区列表
- `options.deps` (Record<string, string>): 依赖版本映射
- `options.syncDevDeps` (boolean, optional): 是否同步开发依赖
- `options.syncPeerDeps` (boolean, optional): 是否同步对等依赖

**返回：** Promise<{updated: number, skipped: number}>

### checkDependencyConflicts()

检测依赖冲突

**返回：** Promise<ConflictReport[]>

### updateVersions(options)

批量更新版本号

**参数：**
- `options.workspaces` (string[]): 工作区列表
- `options.versionType` ('major' | 'minor' | 'patch'): 版本类型
- `options.commitMessage` (string, optional): 提交消息

**返回：** Promise<{updated: string[], failed: string[]}>

### createBranch(options)

创建 Git 分支

**参数：**
- `options.baseBranch` (string): 基础分支
- `options.taskNumber` (string): 任务编号
- `options.description` (string, optional): 分支描述

**返回：** Promise<string> (新分支名)

### generateCommitMessage(options)

生成提交消息

**参数：**
- `options.taskNumber` (string): 效能任务编号
- `options.description` (string): 修改内容
- `options.type` (string): 变更类型
- `options.needTest` (boolean): 是否需要测试
- `options.isAIGC` (boolean): 是否 AIGC 生成

**返回：** string

### runBatchCommand(options)

批量执行命令

**参数：**
- `options.workspaces` (string[]): 工作区列表
- `options.command` (string): 执行的命令
- `options.parallel` (boolean, optional): 是否并行
- `options.continueOnError` (boolean, optional): 错误时是否继续

**返回：** Promise<{success: string[], failed: string[]}>

## 配置文件

### workspace-config.json

```json
{
  "defaultTemplate": "app-template",
  "maintainedWorkspaces": [
    "app-analysis",
    "app-bond",
    "app-combination",
    "app-company"
  ],
  "dependencyRules": {
    "required": ["vue", "element-ui"],
    "forbidden": ["react", "angular"],
    "versions": {
      "vue": "^2.7.16",
      "typescript": "^4.9.4"
    }
  },
  "branchNaming": {
    "dev": "{baseBranch}-{taskNumber}",
    "tag": "{baseBranch}-{version}-{date}",
    "project": "project-{name}-tag-{version}-{date}"
  }
}
```

## 注意事项

1. **Workspace 协议**：本地包使用 `workspace:*` 协议
2. **TGZ 包路径**：确保相对路径正确（../../tgz/*.tgz）
3. **Gerrit 推送**：默认推送到 `refs/for/branch`
4. **版本一致性**：核心依赖（Vue、Element UI）保持版本一致
5. **分支清理**：定期清理已合并的开发分支

## 相关文档

- [命名规范](../../dev/doc/开发工作区准备.md#命名规范)
- [工作区命令](../../dev/doc/开发工作区准备.md#工作区命令)
- [版本发布流程](../../AGENTS.md#版本发布流程)
