# 🚀 KiloCode Skills 快速参考

## ✅ 已更新的技能 (7 个)

所有 SKILL.md 文件已按照 KiloCode 官方规范更新完成。

| # | 技能名称 | 功能描述 |
|---|---------|---------|
| 1 | **gulp-command-helper** | 执行 Gulp 命令管理 monorepo 项目 |
| 2 | **workspace-manager** | 管理工作区、依赖同步、版本更新 |
| 3 | **micro-app-route-config** | 生成微前端路由和权限配置 |
| 4 | **typescript-type-generator** | 自动生成 TypeScript 类型定义 |
| 5 | **api-mock-generator** | 使用 Faker.js 生成 Mock 数据 |
| 6 | **jest-test-generator** | 自动生成单元测试 |
| 7 | **echarts-chart-builder** | 生成 ECharts 图表配置 |

---

## 📋 格式变更要点

### 主要变化

✅ **添加 YAML Frontmatter**
```yaml
---
name: skill-name          # 必须与目录名一致
description: 清晰的英文描述     # 说明功能和使用时机
---
```

✅ **优化结构**
- "When to Use" - 使用场景
- "Core Functions" - 核心 API
- "Usage Examples" - 实际示例
- "Related Skills" - 相关技能引用

✅ **统一语言**
- 所有内容使用英文
- 描述简洁明了
- 代码示例完整

---

## 🔧 立即使用

### 1. 重载 VSCode
```
Cmd+Shift+P → "Developer: Reload Window"
```

### 2. 验证技能可用
询问 AI：
```
"Do you have access to gulp-command-helper?"
"What skills do you have available?"
```

### 3. 开始使用
自然语言调用：
```
"帮我切换到 sczq 项目"
"为 BondDetail 组件生成类型定义"
"创建债券 API 的 Mock 数据"
"生成收益率趋势图表"
```

---

## 💡 最佳实践

### 明确调用
直接说出技能名称总是有效：
- "Use the workspace-manager skill"
- "Run the typescript-type-generator skill"

### 自然描述
AI 会根据描述匹配技能：
- "Execute Gulp commands for building workspaces" → gulp-command-helper
- "Create type definitions for Vue components" → typescript-type-generator

### 组合使用
多个技能协同工作：
```
1. workspace-manager → 创建工作区
2. micro-app-route-config → 配置路由
3. typescript-type-generator → 生成类型
4. api-mock-generator → 创建 Mock
5. jest-test-generator → 生成测试
```

---

## ⚠️ 重要提醒

### 命名规则
`name` 字段必须与目录名完全一致：
```
✅ 正确：skills/gulp-command-helper/SKILL.md → name: gulp-command-helper
❌ 错误：skills/gulp-command-helper/SKILL.md → name: my-gulp-skill
```

### 描述质量
描述决定了 AI 何时使用技能：
- ✅ 具体明确："Execute Gulp commands for monorepo project management"
- ❌ 模糊不清："A useful tool for projects"

### 加载时机
技能在以下情况加载：
- VSCode 启动时
- 窗口重载后（Cmd+Shift+P → "Developer: Reload Window"）
- 添加新技能后需要重载

---

## 📖 详细文档

- [FORMAT-UPDATE-SUMMARY.md](./FORMAT-UPDATE-SUMMARY.md) - 格式更新总结
- [README.md](./README.md) - 技能库总览
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [SUMMARY.md](./SUMMARY.md) - 统计数据

---

## 🎯 下一步

1. ✅ 重载 VSCode
2. ✅ 验证技能可用性
3. ✅ 尝试使用第一个技能
4. ✅ 查看各技能的详细 README

---

*更新时间：2026-03-23*  
*技能数量：7 个*  
*格式版本：Kilo Code Agent Skills Spec v1.0*
