# 压缩指南

## 何时压缩

- 任务完成后（`finalize-workflow-context`）
- 文件超过 500 行时
- 定期维护时

## 压缩策略

### 保留的 Section

始终保留以下内容，不压缩：
- Decision Records
- Acceptance criteria
- Test Results
- What to build
- Blocked by

### 压缩方法

1. **大文件裁剪** — 超过 500 行的文件，保留首 100 行 + 尾 100 行
2. **已完成 issue 归档** — 移至 `archived/` 目录
3. **合并重复** — 相似度 > 80% 的 issue 合并
4. **索引更新** — 压缩后更新所有相关 index.md

## 压缩前后对比

```
压缩前：
modules/user-module/issues/low/
├── issue-001.md (completed, 15 days ago)  → 归档
├── issue-002.md (completed, 10 days ago)  → 归档
├── issue-003.md (pending)                 → 保留
├── issue-004.md (pending)                 → 保留
└── archived/
    └── issue-old.md

压缩后：
modules/user-module/issues/low/
├── issue-003.md (pending)
├── issue-004.md (pending)
└── archived/
    ├── issue-001.md
    ├── issue-002.md
    └── issue-old.md
```
