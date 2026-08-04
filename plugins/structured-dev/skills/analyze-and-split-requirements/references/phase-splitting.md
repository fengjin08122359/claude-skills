# Phase 拆分策略

## 拆分原则

- 每个子需求独立可交付
- 子需求之间依赖关系清晰
- 每个子需求复杂度降低到中等以下
- **每个子需求必须包含单元测试**（高难度）
- 按功能模块分类存储

## Phase 拆分示例

| Phase | 子需求ID | 标题 | 模块 | 难度 | 单元测试 | 依赖 |
|-------|---------|------|------|------|---------|------|
| Phase 1 | req-001-a | 配置文件更新 | config-module | 高 | config.test.ts | 无 |
| Phase 1 | req-001-b | 基础架构引入 | migration-module | 高 | arch.test.ts | req-001-a |
| Phase 2 | req-001-c | 新功能模块引入 | migration-module | 中 | feature.test.ts | req-001-b |
| Phase 3 | req-001-d | 核心功能保留 | migration-module | 中 | core.test.ts | req-001-b |
| Phase 4 | req-001-e | 测试与验证 | test-module | 高 | e2e.test.ts | all |

## 拆分输出格式

```markdown
## 📋 需求拆分分析

### Phase 拆分方案

| Phase | 子需求数 | 主要任务 | 预估时间 | 难度 |
|-------|---------|---------|---------|------|
| Phase 1 | 2个 | 配置 + 基础架构 | 2-3天 | 高 |
| Phase 2 | 3个 | 新功能引入 | 2天 | 中 |
| Phase 3 | 2个 | 核心功能保留 | 1天 | 中 |
| Phase 4 | 3个 | 测试与验证 | 2-3天 | 高 |

### 功能模块分类存储

| 子需求 | Phase | 模块 | 存储路径 |
|--------|-------|------|---------|
| req-001-a | Phase 1 | config-module | modules/config-module/requirements/high/ |
| req-001-b | Phase 1 | migration-module | modules/migration-module/requirements/high/ |
```
