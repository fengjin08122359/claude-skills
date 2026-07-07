# Dev Help Skill 配置指南

## 📦 技能位置

```
.lingma/skills/dev-help/
├── SKILL.md                    # 技能主文件(必需)
├── README.md                   # 完整使用文档
├── QUICK_REFERENCE.md          # 快速参考卡片
├── EXAMPLES.md                 # 使用示例
├── references/
│   ├── task-templates.md      # 任务模板库
│   └── task-breakdown-guide.md # 任务拆解指南
└── evals/
    └── evals.json              # 测试用例
```

## ✅ 自动启用

这个技能已经放置在 `.lingma/skills/` 目录下,Lingma 会自动加载并识别。

**无需额外配置!**

## 🔍 验证技能已加载

你可以通过以下方式验证技能是否正常工作:

### 方法1: 直接调用

在对话中输入:
```
@dev-help 我需要添加一个新功能
```

如果技能正常,你会看到需求分析的响应。

### 方法2: 查看可用技能

询问 Lingma:
```
有哪些可用的技能?
```

应该能看到 `dev-help` 在列表中。

### 方法3: 触发测试

提到以下关键词,看是否自动触发:
- "帮我规划一下开发任务"
- "这个功能怎么拆分?"
- "添加XXX功能"

## 🎯 技能触发机制

### 自动触发场景

技能会在以下场景自动触发:

1. **新功能开发**
   - "实现XXX功能"
   - "添加XXX"
   - "创建XXX模块"

2. **Bug修复**
   - "修复XXX问题"
   - "XXX报错了"
   - "XXX不工作了"

3. **代码重构**
   - "重构XXX"
   - "迁移到XXX"
   - "优化XXX"

4. **任务规划**
   - "怎么拆分这个任务?"
   - "制定开发计划"
   - "规划XXX的开发"

### 手动触发

你也可以显式调用:
```
@dev-help [你的需求描述]
```

## 🔧 自定义配置(可选)

如果你想调整技能的行为,可以修改 `SKILL.md` 文件。

### 调整任务时间粒度

默认每个任务 ≤ 2小时,如需调整:

编辑 `SKILL.md`,找到"拆解原则"部分:

```markdown
**时间粒度**
- 每个任务应该在2小时内可完成  ← 修改这里
- 如果任务过大,继续拆分
- 如果任务过小(<30分钟),考虑合并
```

### 调整输出格式

如果需要不同的任务格式,编辑 `SKILL.md` 的"任务模板"部分。

### 添加自定义模板

在 `references/task-templates.md` 中添加新的任务模板。

## 🔄 与其他技能协作

### Progress Tracker (必需)

Dev Help 依赖 `progress-tracker` skill 进行进度管理。

**确保已安装**:
```
.lingma/skills/progress-tracker/
```

如果没有,需要先创建或获取 progress-tracker skill。

### Dev Advisor (可选)

可以在任务执行过程中调用 dev-advisor 进行代码审查:

```
@dev-advisor 审查刚才完成的代码
```

## 📊 监控技能效果

### 查看使用统计

定期检查:
- 任务拆解的准确度
- 时间估算的准确性
- 用户满意度

### 收集反馈

如果发现:
- 任务拆分不合理
- 时间估算偏差大
- 缺少某种场景的支持

请记录具体问题,用于后续优化。

## 🐛 常见问题排查

### 问题1: 技能不触发

**可能原因**:
1. 技能文件位置不正确
2. SKILL.md 格式有误
3. description 不够明确

**解决方法**:
```bash
# 检查文件是否存在
ls -la .lingma/skills/dev-help/SKILL.md

# 检查YAML frontmatter格式
head -5 .lingma/skills/dev-help/SKILL.md
```

确保 frontmatter 格式正确:
```yaml
---
name: dev-help
description: ...
tools: Read, Write, Edit, Bash, Grep, Glob
---
```

### 问题2: 技能行为不符合预期

**可能原因**:
1. 需求描述不够详细
2. 技能理解有偏差
3. 需要调整工作流程

**解决方法**:
- 提供更详细的需求描述
- 回答澄清问题时更具体
- 在任务确认阶段提出调整意见

### 问题3: 与 progress-tracker 集成失败

**可能原因**:
1. progress-tracker skill 不存在
2. 调用方式不正确

**解决方法**:
```bash
# 检查 progress-tracker 是否存在
ls -la .lingma/skills/progress-tracker/SKILL.md

# 如果不存在,需要先创建
```

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 初始版本发布
- ✅ 支持需求分析和任务拆解
- ✅ 集成 progress-tracker
- ✅ 提供任务模板库
- ✅ 包含使用示例

## 🚀 下一步

1. **试用技能**
   ```
   @dev-help 我需要添加一个组合导出功能
   ```

2. **阅读文档**
   - [快速参考](QUICK_REFERENCE.md)
   - [完整文档](README.md)
   - [使用示例](EXAMPLES.md)

3. **提供反馈**
   - 哪些地方好用?
   - 哪些地方需要改进?
   - 还缺什么功能?

## 📞 支持和反馈

如有问题或建议:
1. 查看 [README.md](README.md) 的FAQ部分
2. 查看 [EXAMPLES.md](EXAMPLES.md) 的使用示例
3. 记录具体问题和使用场景
4. 提出改进建议

## 🔗 相关资源

- [Progress Tracker Skill](../progress-tracker/)
- [Dev Advisor Skill](../dev-advisor/)
- [项目技术规范](../../../AGENTS.md)
- [全局技术文档](../../../GLOBAL_TECHNICAL_SUMMARY.md)

---

**祝使用愉快! 🎉**
