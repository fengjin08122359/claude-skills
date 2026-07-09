# Memory Index

## 功能模块索引

### Active Modules

### Project Memory

- [project](project/index.md) — 项目级约定、决策、经验

---

## Memory 结构说明

**一级分类：功能模块**
**二级分类：难度等级**

```
memory/
├── modules/                  # 一级分类：功能模块
│   ├── user-module/          # 用户模块
│   │   ├── issues/
│   │   │   ├── low/          # 二级分类：难度
│   │   │   ├── medium/
│   │   │   ├── high/         # 含单元测试
│   │   │   └── archived/
│   │   ├── requirements/
│   │   │   ├── medium/
│   │   │   ├── high/
│   │   │   │   └── tests/    # 单元测试计划
│   │   │   └── archived/
│   │   └── decisions.md      # 模块级决策
│   │
│   ├── import-module/        # 导入模块
│   ├── validation-module/    # 验证模块
│   ├── config-module/        # 配置模块
│   ├── auth-module/          # 认证模块
│   └── [其他模块]
│
└── project/                  # 项目级记忆（不按模块分类）
    ├── conventions.md
    ├── decisions.md
    └── learnings.md
```

---

## 历史记忆（未分类）

以下记忆在迁移到模块结构前保留：

- [默认 Issue Tracker 配置](default-issue-tracker.md) — 项目默认使用本地 markdown 管理 issues
- [Scripts 目录结构约定](gulp-scripts-directory-structure.md) — gulp 脚本重构统一放在 scripts/ 目录
- [集成测试计划](integration-test-plan.md) — workspaces, sync, project 模块的 TDD 集成测试计划
- [Gulp Publish 重构经验](gulp-publish-refactor-experience.md) — gulp-publish 模块重构的经验和最佳实践
- [Gulp Process 重构经验](gulp-process-refactor-experience.md) — gulp-process 模块重构的经验和最佳实践（2026-07-07）
