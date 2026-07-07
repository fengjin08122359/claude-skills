# Dev Advisor Skill 生态系统

> 面向高级开发者的智能代码顾问系统

## 📋 概述

这是一个基于微技能架构的代码质量提升系统，由多个协同工作的 skills 组成，专注于 TypeScript/Vue 项目的代码分析和优化。

## 🏗️ 架构

```
dev-advisor (主顾问)
    ↓ 调用
step-executor (执行引擎)
    ↓ 自动调用
progress-tracker (进度管理)

dev-advisor ↔ issue-knowledge-base (问题库)
dev-advisor ↔ best-practice-library (模式库)
```

## 📦 组成部分

### 1. dev-advisor
- **职责**: 代码分析、问题检测、计划生成
- **配置**: `config/dev-advisor.json`
- **触发**: 智能检测 + 手动调用

### 2. step-executor
- **职责**: 原子化步骤执行和验证
- **配置**: `config/step-executor.json`
- **特性**: 批量执行、并行验证、断点续传

### 3. issue-knowledge-base
- **职责**: 已知问题存储和匹配
- **配置**: `config/issue-knowledge-base.json`
- **功能**: 智能匹配、统计分析

### 4. best-practice-library
- **职责**: 最佳实践模式管理
- **配置**: `config/best-practice-library.json`
- **功能**: 智能推荐、模式对比

### 5. progress-tracker
- **职责**: 任务进度持久化
- **配置**: `config/progress-tracker.json`
- **功能**: 断点续传、进度可视化

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置文件

所有配置文件位于 `.lingma/skills/config/` 目录：
- `config/dev-advisor.json` - 主配置
- `config/step-executor.json` - 执行器配置
- `config/issue-knowledge-base.json` - 问题库配置
- `config/best-practice-library.json` - 模式库配置
- `config/progress-tracker.json` - 进度跟踪配置

📖 详细配置说明：[config/README.md](./config/README.md)

### 3. 使用示例

```typescript
// 在 IDE 中调用 dev-advisor
import { invokeSkill } from '@lingma/skills';

// 分析代码
const result = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/views/user-list/index.vue'
});

// 执行修复计划
if (result.issues.length > 0) {
  const plan = result.generatePlan();
  await invokeSkill('step-executor', {
    action: 'execute-plan',
    plan
  });
}
```

## 📁 项目结构

```
.lingma/skills/
├── types.ts                      # 共享类型定义
├── config/                       # 配置文件目录 ⭐
│   ├── README.md                 # 配置说明
│   ├── dev-advisor.json          # 主顾问配置
│   ├── step-executor.json        # 执行器配置
│   ├── issue-knowledge-base.json # 问题库配置
│   ├── best-practice-library.json# 最佳实践库配置
│   └── progress-tracker.json     # 进度跟踪配置
├── README.md                     # 快速开始指南
├── USAGE_EXAMPLES.md             # 详细使用示例 ⭐
├── IMPLEMENTATION_SUMMARY.md     # 实现总结
├── ECOSYSTEM.md                  # 生态系统文档
├── examples/                     # 代码示例目录 ⭐
│   ├── README.md                 # 示例说明
│   └── real-world-usage.ts       # 实际使用代码
├── dev-advisor/
│   └── SKILL.md
├── step-executor/
│   └── SKILL.md
├── issue-knowledge-base/
│   ├── SKILL.md
│   └── data/                     # 数据存储（已忽略）
├── best-practice-library/
│   ├── SKILL.md
│   └── data/                     # 数据存储（已忽略）
└── progress-tracker/
    ├── SKILL.md
    └── data/                     # 数据存储（已忽略）
```

## 🔧 配置说明

### dev-advisor 配置

```json
{
  "trigger": {
    "mode": "smart-prompt",  // smart-prompt | manual | on-save
    "patterns": ["**/*.ts", "**/*.vue"],
    "exclude": ["**/*.d.ts", "**/node_modules/**"]
  },
  "checks": {
    "typeSafety": { "enabled": true, "severity": "high" },
    "vueBestPractices": { "enabled": true, "severity": "medium" },
    "performance": { "enabled": true, "severity": "low" }
  }
}
```

### step-executor 配置

```json
{
  "execution": {
    "defaultMode": "safe",  // safe | fast | custom
    "autoSaveProgress": true
  },
  "verification": {
    "parallelEnabled": true,
    "commands": {
      "typescript": "pnpm vue-tsc --noEmit",
      "eslint": "pnpm eslint --fix"
    }
  }
}
```

## 💡 使用场景

### 场景 1: 代码审查

```bash
# 分析单个文件
/dev-advisor analyze src/components/UserList.vue

# 分析整个目录
/dev-advisor analyze src/views/
```

**📖 查看详细示例**: [USAGE_EXAMPLES.md - 代码审查示例](./USAGE_EXAMPLES.md#代码审查示例)

### 场景 2: 自动修复

```bash
# 修复类型安全问题
/dev-advisor fix --category type-safety

# 修复所有高优先级问题
/dev-advisor fix --severity high
```

**📖 查看详细示例**: [USAGE_EXAMPLES.md - 自动修复示例](./USAGE_EXAMPLES.md#自动修复示例)

### 场景 3: 最佳实践查询

```bash
# 查询 Composition API 最佳实践
/dev-advisor practices --query "composition api"

# 获取组件设计建议
/dev-advisor practices --category component-design
```

**📖 查看详细示例**: [USAGE_EXAMPLES.md - 最佳实践查询](./USAGE_EXAMPLES.md#最佳实践查询)

### 场景 4: 批量重构

**💻 查看代码示例**: [examples/real-world-usage.ts - 批量重构](./examples/real-world-usage.ts#L40-L106)

## 📊 数据管理

### 已知问题库

问题记录存储在 `.lingma/skills/issue-knowledge-base/data/issues/`

示例问题 ID 格式：`TS-ANY-TYPE-001`

### 最佳实践库

模式记录存储在 `.lingma/skills/best-practice-library/data/practices/`

示例模式 ID 格式：`VUE-COMPOSITION-API-001`

### 进度跟踪

任务进度存储在 `.lingma/skills/progress-tracker/data/tasks/`

## 🔍 常见问题

### Q: 如何添加新的已知问题？

A: 通过 dev-advisor 检测到时会自动提示添加，或手动调用：

```typescript
await invokeSkill('issue-knowledge-base', {
  action: 'add-issue',
  issue: { /* KnownIssue 数据 */ }
});
```

### Q: 如何自定义验证命令？

A: 修改 `config/step-executor.json` 中的 `verification.commands` 配置。

### Q: 进度丢失怎么办？

A: 检查 `.step-executor-progress.json` 文件，或从 Git 恢复。

### Q: 如何禁用某个检查规则？

A: 在 `config/dev-advisor.json` 中将对应规则的 `enabled` 设为 `false`。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📝 许可证

MIT License

## 📞 联系方式

- 问题反馈: GitHub Issues
- 文档: `.lingma/skills/ECOSYSTEM.md`
