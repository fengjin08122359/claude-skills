# Progress Tracker 数据目录

本目录存储任务执行进度数据。

## 📁 目录结构

```
data/
├── index.json          # ✅ 提交到 Git - 任务索引和统计
└── tasks/              # ❌ 忽略 - 具体任务详情
    └── *.json
```

## 📋 Git 追踪策略

### ✅ 需要提交
- `index.json` - 任务列表和统计数据

### ❌ 忽略
- `tasks/*.json` - 具体任务的详细进度（通过 .gitignore 规则忽略）

## 🔄 数据管理

### 自动创建
当 step-executor 开始执行新任务时，会自动：
1. 在 `tasks/` 目录下创建任务文件
2. 更新 `index.json` 中的任务列表
3. 保存初始进度状态

### 定期清理
建议每周清理已完成超过 7 天的任务：
```bash
# 运行清理脚本（如果提供）
npm run cleanup-old-tasks -- --older-than=7d
```

## 📊 当前状态

- 总任务数: 0
- 进行中: 0
- 已完成: 0
- 最后更新: 2026-04-14

## 🔗 相关文档

- [progress-tracker/SKILL.md](../SKILL.md) - 技能文档
- [config/progress-tracker.json](../../../config/progress-tracker.json) - 配置文件
- [step-executor/SKILL.md](../../step-executor/SKILL.md) - 调用方文档

---

**维护者**: Dev Advisor Team  
**最后更新**: 2026-04-14
