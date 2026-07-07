# 使用示例总结

本文档总结了 Dev Advisor Skill 生态系统的所有使用示例。

## 📚 示例文档清单

### 1. [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - 完整使用指南

**内容**:
- ✅ 基础用法（IDE、命令行、VS Code 集成）
- ✅ 代码审查示例（类型安全、Vue 最佳实践）
- ✅ 自动修复示例（单文件修复、批量修复）
- ✅ 最佳实践查询（组件设计、方案对比）
- ✅ 问题库管理（添加问题、统计查询）
- ✅ 进度跟踪（任务管理、进度查看）
- ✅ 高级场景（CI/CD 集成、团队规范同步、自定义规则、批量迁移）

**特点**:
- 939 行详细说明
- 包含完整的 JSON 请求/响应示例
- 涵盖从基础到高级的所有场景
- 提供实际可运行的代码片段

---

### 2. [examples/real-world-usage.ts](./examples/real-world-usage.ts) - 实际代码示例

**内容**:
- ✅ 日常代码审查工作流
- ✅ 批量重构脚本
- ✅ Code Review 辅助工具
- ✅ 项目健康度报告生成器
- ✅ 持续学习系统
- ✅ 自定义质量工作流

**特点**:
- 499 行 TypeScript 代码
- 6 个完整的实际应用场景
- 展示了 API 的实际调用方式
- 包含工具函数和辅助方法

---

## 🎯 核心示例场景

### 场景 1: 智能代码审查

```typescript
// 保存文件时自动分析
const result = await invokeSkill('dev-advisor', {
  action: 'analyze',
  filePath: 'src/views/user-list/index.vue'
});

// 返回分级报告
{
  issues: [
    { severity: 'high', title: '...', suggestion: '...' },
    { severity: 'medium', title: '...', suggestion: '...' }
  ]
}
```

**适用**: 日常开发、Code Review

---

### 场景 2: 自动修复问题

```typescript
// 生成修复计划
const plan = await invokeSkill('dev-advisor', {
  action: 'generate-plan',
  issues: detectedIssues
});

// 执行修复
const result = await invokeSkill('step-executor', {
  action: 'execute-plan',
  plan,
  options: { mode: 'safe' }
});
```

**适用**: 快速修复常见问题

---

### 场景 3: 批量重构

```typescript
// 扫描整个项目
const files = await findFilesByPattern('**/*.vue');

// 分批执行重构
for (const batch of batches) {
  await invokeSkill('step-executor', {
    action: 'execute-batch',
    batch
  });
}
```

**适用**: 技术债务清理、框架升级

---

### 场景 4: 最佳实践推荐

```typescript
// 根据上下文推荐实践
const practices = await invokeSkill('best-practice-library', {
  action: 'find-relevant-practices',
  context: {
    taskDescription: '创建用户列表',
    techStack: { vue: '2.7' }
  }
});
```

**适用**: 新项目启动、技术方案选型

---

### 场景 5: 项目健康度监控

```typescript
// 生成健康度报告
const report = await generateHealthReport('./project');

// 包含评分、统计、建议
{
  healthScore: 85,
  statistics: { ... },
  recommendations: ['...', '...']
}
```

**适用**: 项目管理、质量监控

---

## 💡 使用建议

### 1. 渐进式采用

**第一周**: 
- 启用基础的代码审查
- 熟悉问题报告和修复流程

**第二周**:
- 配置自动触发规则
- 开始使用最佳实践查询

**第一个月**:
- 集成到 CI/CD 流程
- 建立团队知识库

**长期**:
- 持续优化配置
- 贡献新的最佳实践

---

### 2. 团队协作

**Code Review**:
```bash
# 在 PR 中自动添加评论
npx dev-advisor review-pr 123
```

**知识共享**:
```bash
# 同步团队最佳实践
npx dev-advisor sync-team-practices
```

**质量报告**:
```bash
# 每周生成健康度报告
npx dev-advisor health-report --weekly
```

---

### 3. 配置优化

**开发环境**:
```json
{
  "trigger": { "mode": "smart-prompt" },
  "autoFix": false,
  "severityThreshold": "high"
}
```

**CI/CD 环境**:
```json
{
  "trigger": { "mode": "manual" },
  "autoFix": false,
  "severityThreshold": "medium",
  "failOnCritical": true
}
```

**重构任务**:
```json
{
  "trigger": { "mode": "manual" },
  "autoFix": true,
  "batchSize": 5,
  "pauseBetweenBatches": true
}
```

---

## 📊 示例覆盖度

| 功能模块 | 示例数量 | 文档行数 | 代码行数 |
|---------|---------|---------|---------|
| 基础用法 | 3 | 100 | - |
| 代码审查 | 2 | 150 | 50 |
| 自动修复 | 2 | 200 | 80 |
| 最佳实践 | 2 | 100 | 40 |
| 问题库管理 | 2 | 80 | 30 |
| 进度跟踪 | 2 | 60 | 40 |
| 高级场景 | 4 | 249 | 254 |
| **总计** | **17** | **939** | **494** |

---

## 🔗 相关资源

- [ECOSYSTEM.md](../ECOSYSTEM.md) - 架构文档
- [README.md](../README.md) - 快速开始
- [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) - 实现总结
- [config/README.md](../config/README.md) - 配置参考

---

## 🚀 下一步

1. **阅读 USAGE_EXAMPLES.md** - 了解所有可用功能
2. **运行 real-world-usage.ts** - 查看实际代码实现
3. **尝试基础示例** - 从简单的代码审查开始
4. **配置你的项目** - 根据需求调整配置
5. **集成到工作流** - 添加到 CI/CD 或 IDE

---

## ❓ 需要帮助？

- 查看 [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) 中的详细示例
- 参考 [examples/real-world-usage.ts](./examples/real-world-usage.ts) 的代码
- 阅读各 Skill 的 SKILL.md 文档
- 查看配置文件中的注释说明

祝使用愉快！🎉
