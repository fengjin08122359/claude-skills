# Skill 配置文件目录

本目录包含 Dev Advisor Skill 生态系统的所有配置文件。

## 📁 配置文件列表

### 1. dev-advisor.json
**原文件名**: `.dev-advisorrc.json`  
**用途**: 主顾问技能配置  
**配置项**:
- 触发机制（智能提示、防抖策略）
- 检查规则（类型安全、Vue 最佳实践、性能）
- 执行参数（验证命令、最大步骤数）

**示例**:
```json
{
  "trigger": {
    "mode": "smart-prompt",
    "patterns": ["**/*.ts", "**/*.vue"],
    "throttle": {
      "minIntervalSeconds": 300
    }
  },
  "checks": {
    "typeSafety": {
      "enabled": true,
      "severity": "high"
    }
  }
}
```

---

### 2. step-executor.json
**原文件名**: `.step-executorrc.json`  
**用途**: 步骤执行器配置  
**配置项**:
- 执行模式（safe/fast）
- 验证命令列表
- 重试策略
- 并行验证设置

**示例**:
```json
{
  "execution": {
    "defaultMode": "safe",
    "maxRetries": 3
  },
  "verification": {
    "commands": [
      "pnpm vue-tsc --noEmit",
      "pnpm eslint --fix"
    ],
    "parallel": true
  }
}
```

---

### 3. issue-knowledge-base.json
**原文件名**: `.issue-knowledge-baserc.json`  
**用途**: 已知问题库配置  
**配置项**:
- 存储路径
- 匹配权重
- 维护策略

**示例**:
```json
{
  "storage": {
    "issuesPath": "./data/issues",
    "indexPath": "./data/index.json"
  },
  "matching": {
    "codePatternWeight": 0.5,
    "eslintRuleWeight": 0.3
  }
}
```

---

### 4. best-practice-library.json
**原文件名**: `.best-practice-libraryrc.json`  
**用途**: 最佳实践库配置  
**配置项**:
- 推荐算法
- 版本管理
- 使用跟踪

**示例**:
```json
{
  "storage": {
    "practicesPath": "./data/practices",
    "indexPath": "./data/index.json"
  },
  "recommendation": {
    "algorithm": "weighted-scoring",
    "minConfidence": 0.7
  }
}
```

---

### 5. progress-tracker.json
**原文件名**: `.progress-trackerrc.json`  
**用途**: 进度跟踪器配置  
**配置项**:
- 自动保存间隔
- 数据保留策略
- 可视化设置

**示例**:
```json
{
  "storage": {
    "tasksPath": "./data/tasks",
    "indexPath": "./data/index.json"
  },
  "autoSave": {
    "enabled": true,
    "intervalSeconds": 30
  }
}
```

---

## 🔧 配置管理

### 团队共享配置

如果希望团队共享配置，将这些文件提交到 Git：

```bash
git add .lingma/skills/config/*.json
git commit -m "chore: 添加 skill 配置文件"
```

### 个人配置覆盖

如果需要个人配置，可以：

1. **方法 A**: 在本地创建 `.env` 文件覆盖特定配置
2. **方法 B**: 使用环境变量
3. **方法 C**: 创建 `.gitignore` 忽略特定文件

示例 `.gitignore`（在本目录）：
```gitignore
# 忽略个人配置
dev-advisor.local.json
*.local.json
```

---

## 📝 配置优先级

配置加载顺序（从高到低）：

1. 命令行参数（如果有）
2. 环境变量
3. 配置文件（本目录）
4. 默认值

---

## 🔄 迁移说明

### 从旧位置迁移

配置文件已从项目根目录移动到此处：

**之前**:
```
项目根目录/
├── .dev-advisorrc.json
├── .step-executorrc.json
├── ...
```

**现在**:
```
.lingma/skills/config/
├── dev-advisor.json
├── step-executor.json
├── ...
```

### 更新引用

如果代码中直接引用了配置文件路径，需要更新：

```typescript
// 旧路径
const config = loadConfig('.dev-advisorrc.json');

// 新路径
const config = loadConfig('.lingma/skills/config/dev-advisor.json');
```

---

## 📚 相关文档

- [dev-advisor/SKILL.md](../dev-advisor/SKILL.md) - 主顾问技能文档
- [step-executor/SKILL.md](../step-executor/SKILL.md) - 步骤执行器文档
- [ECOSYSTEM.md](../ECOSYSTEM.md) - 完整架构文档
- [README.md](../README.md) - 快速开始指南

---

## ⚠️ 注意事项

1. **JSON 格式**: 确保所有配置文件都是有效的 JSON 格式
2. **注释**: JSON 不支持注释，如需说明请使用单独的文档
3. **敏感信息**: 不要将 API 密钥等敏感信息放入配置文件
4. **版本控制**: 根据团队需求决定是否提交到 Git

---

**维护者**: Dev Advisor Team  
**最后更新**: 2026-04-14  
**配置版本**: 1.0.0
