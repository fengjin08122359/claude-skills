# Skills 数据目录说明

本目录包含 Dev Advisor Skill 生态系统的数据文件。

## 📁 目录结构

```
data/
├── index.json                    # ✅ 提交到 Git - 索引和统计信息
├── issues/                       # ❌ 忽略 - 已知问题详细数据
│   ├── *.json
│   └── ...
└── practices/                    # ❌ 忽略 - 最佳实践详细数据
    ├── *.json
    └── ...
```

## 📋 Git 追踪策略

### ✅ 需要提交的文件

- `index.json` - 索引文件，包含所有记录的元数据和统计信息
- 此文件的变更应该被追踪，用于：
  - 了解知识库的增长趋势
  - Code Review 时查看新增的问题/实践
  - 团队协作时同步知识更新

### ❌ 忽略的文件

- `issues/*.json` - 具体的已知问题记录
- `practices/*.json` - 具体的最佳实践记录
- 这些文件被忽略是因为：
  - 可能包含敏感的项目特定信息
  - 文件数量会快速增长
  - 通过 index.json 已经可以了解整体情况
  - 团队成员可以通过 skill 调用动态获取

## 🔄 数据同步流程

### 添加新问题/实践

1. **创建数据文件**
   ```bash
   # 在 issues/ 或 practices/ 目录下创建新的 JSON 文件
   touch data/issues/MY-NEW-ISSUE-001.json
   ```

2. **更新索引**
   ```bash
   # 手动或通过脚本更新 index.json
   # 添加新记录到 issues/practices 数组
   # 更新 statistics
   ```

3. **提交索引变更**
   ```bash
   git add data/index.json
   git commit -m "chore: 添加新的已知问题 MY-NEW-ISSUE-001"
   ```

### 团队同步

其他团队成员拉取代码后：
1. 获得最新的 `index.json`
2. 看到新增问题的元数据
3. 通过 skill 调用自动下载详细数据（如果需要）

## 🛠️ 管理工具

### 初始化数据

```bash
# 运行初始化脚本（如果提供）
npm run init-skill-data
```

### 验证数据完整性

```bash
# 检查索引和数据的一致性
npm run validate-skill-data
```

### 生成报告

```bash
# 生成知识库统计报告
npm run generate-skill-report
```

## 📊 当前状态

参见 [DATA_INITIALIZATION_REPORT.md](../../DATA_INITIALIZATION_REPORT.md)

- 已知问题: 2 条
- 最佳实践: 2 条
- 最后更新: 2026-04-14

## 🔗 相关文档

- [ECOSYSTEM.md](../../ECOSYSTEM.md) - 完整架构说明
- [USAGE_EXAMPLES.md](../../USAGE_EXAMPLES.md) - 使用示例
- [issue-knowledge-base/SKILL.md](../issue-knowledge-base/SKILL.md) - 问题库技能文档
- [best-practice-library/SKILL.md](../best-practice-library/SKILL.md) - 最佳实践库技能文档

## ⚠️ 注意事项

1. **不要直接编辑 index.json**
   - 应该通过 skill API 或管理脚本更新
   - 确保统计数据与实际文件一致

2. **定期备份**
   ```bash
   # 备份整个数据目录
   cp -r data/ data-backup-$(date +%Y%m%d)/
   ```

3. **冲突解决**
   - 如果多人同时添加问题，可能导致 index.json 冲突
   - 解决方法：合并 changes，重新生成 statistics

4. **性能考虑**
   - index.json 应该保持轻量
   - 避免在索引中存储大量详情
   - 详细信息放在单独的文件中

## 🚀 未来改进

- [ ] 自动化索引更新脚本
- [ ] 数据验证工具
- [ ] 可视化统计面板
- [ ] 增量同步机制
- [ ] 冲突检测和自动合并

---

**维护者**: Dev Advisor Team  
**最后更新**: 2026-04-14
