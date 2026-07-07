# Dev Advisor Skill 生态系统

本文档描述了 dev-advisor 及其配套 skills 组成的完整生态系统。

## 架构概览

```
┌─────────────────────────────────────────────┐
│           用户交互层                         │
│         (VS Code / IDE)                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          dev-advisor                        │
│       (主顾问 - 协调者)                      │
│                                             │
│  • 代码分析和检测                           │
│  • 问题识别和分级                           │
│  • 生成执行计划                             │
│  • 调用其他 skills                          │
│  • 汇总结果和建议                           │
└──┬────────────┬──────────────┬──────────────┬──────────────────┐
   │            │              │              │
   │ 调用       │ 查询         │ 查询         │ 查询
   ▼            ▼              ▼              ▼
┌──────────┐ ┌──────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ step-    │ │ issue-       │ │ best-practice-   │ │ dui-knowledge-   │
│ executor │ │ knowledge-   │ │ library          │ │ base             │
│          │ │ base         │ │                  │ │                  │
│ 执行引擎  │ │ 已知问题库    │ │ 最优模式库        │ │ DUI 组件知识库    │
└────┬─────┘ └──────────────┘ └──────────────────┘ └──────────────────┘
     │
     │ 自动调用
     ▼
┌──────────────────┐
│ progress-        │
│ tracker          │
│                  │
│ 进度跟踪器        │
└──────────────────┘
```

## Skills 详细说明

### 1. dev-advisor (主顾问)

**位置**: `.lingma/skills/dev-advisor/SKILL.md`

**职责**:
- 作为用户的主要交互入口
- 分析代码质量，检测问题
- 生成分级报告（高/中/低优先级）
- 创建结构化的执行计划
- 协调调用其他 skills
- 汇总结果并提供建议

**触发方式**:
- 显式：用户主动调用 `/dev-advisor analyze [file]`
- 隐式：保存文件时智能检测（可配置）

**核心特性**:
- 智能触发机制
- 分级报告系统
- 配置驱动（`.dev-advisorrc.json`）
- 与其他 skills 无缝协作

---

### 2. step-executor (步骤执行器)

**位置**: `.lingma/skills/step-executor/SKILL.md`

**职责**:
- 接收并执行 dev-advisor 生成的执行计划
- 将复杂任务拆解为原子化步骤
- 逐步执行并验证每个步骤
- 处理错误和异常情况
- 管理执行进度（通过 progress-tracker）

**步骤类型**:
- `create-file`: 创建新文件
- `modify-code`: 修改现有代码
- `add-import`: 添加导入语句
- `refactor`: 重构代码
- `config-change`: 修改配置
- `delete-code`: 删除代码
- `rename`: 重命名
- `move-file`: 移动文件

**核心特性**:
- 原子化执行（5-15分钟/步）
- 自动验证（TypeScript、ESLint、测试）
- 批量执行模式
- 并行验证优化
- 智能重试机制
- 断点续传支持

**配置文件**: `.step-executorrc.json`

---

### 3. issue-knowledge-base (已知问题库)

**位置**: `.lingma/skills/issue-knowledge-base/SKILL.md`

**职责**:
- 存储和管理 KnownIssue 记录
- 根据代码模式智能匹配已知问题
- 提供问题的详细解决方案
- 统计问题出现频率和趋势
- 生成预防建议

**数据模型**: `KnownIssue`
- 问题标题、描述、严重级别
- 触发条件（代码模式、ESLint 规则等）
- 影响范围和解决方案
- 预防措施和相关资源
- 元数据（出现次数、最后出现时间等）

**核心特性**:
- 智能匹配算法（多权重评分）
- 问题去重检查
- 频率统计和趋势分析
- 自动更新出现次数
- 归档过期问题

**配置文件**: `.issue-knowledge-baserc.json`

---

### 4. best-practice-library (最优模式库)

**位置**: `.lingma/skills/best-practice-library/SKILL.md`

**职责**:
- 存储和管理 BestPractice 记录
- 根据技术栈和场景推荐最佳实践
- 提供模式对比和权衡分析
- 跟踪模式使用情况和成功率
- 管理模式的版本演进

**数据模型**: `BestPractice`
- 模式名称、描述、分类
- 适用场景和技术栈要求
- 实现指南和代码示例
- 优势与权衡分析
- 性能指标和优化建议

**核心特性**:
- 智能推荐算法
- 模式对比功能
- 版本管理和历史记录
- 使用情况跟踪
- 团队审核流程

**配置文件**: `.best-practice-libraryrc.json`

---

### 5. progress-tracker (进度跟踪器)

**位置**: `.lingma/skills/progress-tracker/SKILL.md`

**职责**:
- 持久化任务进度状态
- 支持中断后恢复执行
- 管理多个并发任务
- 提供进度可视化和报告
- 管理任务生命周期

**数据模型**: `TaskProgress`
- 任务 ID、标题、状态
- 步骤列表和进度统计
- 时间信息（创建、开始、完成时间）
- 执行上下文（Git branch、相关文件等）

**核心特性**:
- 跨会话进度持久化
- 自动保存机制
- 断点续传支持
- 进度可视化（进度条、状态图标）
- 历史统计分析
- 任务依赖管理

**配置文件**: `.progress-trackerrc.json`

---

### 6. dui-knowledge-base (DUI 组件知识库)

**位置**: `.lingma/skills/dui-knowledge-base/SKILL.md`

**职责**:
- 存储和管理 DUI 组件的元数据
- 提供组件搜索和查询功能
- 提供 API 文档和使用示例
- 支持最佳实践推荐

**数据模型**: `DuiComponent`
- 组件基本信息（名称、分类、版本）
- API 定义（Props, Events, Slots, Methods）
- 使用示例和最佳实践
- 相关组件链接

**核心特性**:
- 源代码自动解析
- 远程文档同步（可选）
- 模糊搜索和关键词匹配
- 智能评分系统（多字段加权）
- LRU 缓存优化
- 分类浏览和热门推荐
- 分面搜索支持

**配置文件**: `.dui-knowledge-baserc.json`

**与其他 Skills 的协作**:
- dev-advisor: 代码审查时查询组件 API，检测 DUI 组件使用问题
- page-component-migration: 迁移时参考 DUI 组件用法和 Composition API 示例
- best-practice-library: 共享 DUI 最佳实践和编码规范

---

## 协作流程示例

### 场景 1：代码审查和修复

```
用户: "帮我检查 user-list.vue 的代码质量"

1. dev-advisor 分析代码
   ├─ 检测到 3 个类型安全问题
   ├─ 查询 issue-knowledge-base
   │  └─ 找到匹配的已知问题 TS-ANY-TYPE-001
   ├─ 查询 best-practice-library
   │  └─ 获取 Composition API 最佳实践
   └─ 生成分级报告和执行计划

2. 用户确认修复
   └─ dev-advisor 调用 step-executor

3. step-executor 执行计划
   ├─ 调用 progress-tracker 创建任务
   ├─ 逐步执行 4 个步骤
   │  ├─ 每步完成后更新进度
   │  ├─ 运行验证命令
   │  └─ 遇到错误时提供恢复选项
   └─ 执行完成后标记任务完成

4. dev-advisor 汇总结果
   ├─ 显示执行摘要
   ├─ 更新 issue-knowledge-base 的问题计数
   ├─ 记录 best-practice-library 的使用情况
   └─ 提供后续建议
```

### 场景 2：发现新问题模式

```
用户: "这段代码有什么潜在问题？"

1. dev-advisor 分析代码
   ├─ 发现新的反模式（不在已知问题库中）
   └─ 提示用户："发现新的问题模式，是否添加到知识库？"

2. 用户确认添加
   └─ dev-advisor 调用 issue-knowledge-base
      └─ 创建新的 KnownIssue 记录

3. 后续使用时
   └─ 其他开发者遇到相同问题时
      └─ issue-knowledge-base 自动匹配并提供解决方案
```

### 场景 3：技术方案选型

```
用户: "我应该用 Options API 还是 Composition API？"

1. dev-advisor 理解需求
   └─ 调用 best-practice-library

2. best-practice-library 返回
   ├─ VUE-COMPOSITION-API-001 (推荐)
   ├─ OPTIONS-API-PATTERN (备选)
   └─ 两者的对比分析

3. dev-advisor 展示对比
   ├─ 性能差异
   ├─ 可维护性对比
   ├─ 学习曲线
   └─ 适用场景建议

4. 用户做出选择
   └─ dev-advisor 基于选择的模式生成代码模板
```

---

## 配置文件总览

### 项目根目录配置

```
project-root/
├── .dev-advisorrc.json          # dev-advisor 配置
├── .step-executorrc.json        # step-executor 配置
├── .issue-knowledge-baserc.json # issue-knowledge-base 配置
├── .best-practice-libraryrc.json # best-practice-library 配置
├── .progress-trackerrc.json     # progress-tracker 配置
└── .dui-knowledge-baserc.json   # dui-knowledge-base 配置
```

### 配置继承关系

所有配置文件都位于项目根目录，**不支持 workspace 级别的覆盖**，确保整个 monorepo 使用统一的规范和行为。

---

## 数据存储结构

```
.lingma/skills/
├── dev-advisor/
│   └── SKILL.md
├── step-executor/
│   ├── SKILL.md
│   └── data/
│       └── backups/           # 执行备份
├── issue-knowledge-base/
│   ├── SKILL.md
│   └── data/
│       ├── issues/            # 问题记录
│       │   ├── index.json
│       │   └── *.json
│       └── archives/          # 已归档问题
├── best-practice-library/
│   ├── SKILL.md
│   └── data/
│       ├── practices/         # 模式记录
│       │   ├── index.json
│       │   └── *.json
│       └── archives/          # 已废弃模式
├── progress-tracker/
│   ├── SKILL.md
│   └── data/
│       ├── tasks/             # 任务进度
│       │   └── *.json
│       ├── archives/          # 已归档任务
│       └── session.json       # 会话状态
└── dui-knowledge-base/
    ├── SKILL.md
    ├── README.md
    ├── QUICKSTART.md
    └── data/
        ├── components/        # 组件 JSON 文件
        │   └── *.json
        └── index.json         # 索引文件
```

---

## 扩展指南

### 添加新的配套 Skill

如果需要扩展功能，可以创建新的 skill：

1. **确定职责**：新 skill 应该负责什么？
2. **定义接口**：如何与其他 skills 交互？
3. **设计数据模型**：需要存储什么数据？
4. **实现 API**：提供哪些操作接口？
5. **更新文档**：在 ECOSYSTEM.md 中记录

### 示例：添加 code-metrics skill

```typescript
// code-metrics skill 职责
- 收集代码度量数据（复杂度、覆盖率等）
- 生成质量报告
- 追踪质量趋势

// 与 dev-advisor 的协作
dev-advisor 在代码审查时调用 code-metrics
获取量化指标，辅助质量评估
```

---

## 最佳实践

### 1. Skill 设计原则

- **单一职责**：每个 skill 只负责一个明确的功能领域
- **松耦合**：skills 之间通过明确的接口交互
- **可组合**：skills 可以灵活组合使用
- **可扩展**：易于添加新的 skills

### 2. 数据管理

- **结构化存储**：使用 JSON Schema 验证数据格式
- **索引优化**：为频繁查询的数据建立索引
- **定期清理**：归档或删除过期数据
- **备份策略**：重要数据定期备份

### 3. 性能优化

- **缓存机制**：缓存常用查询结果
- **异步加载**：大数据量时异步加载
- **懒加载**：按需加载详细信息
- **批量操作**：减少 I/O 次数

### 4. 用户体验

- **清晰反馈**：每个操作都有明确的状态反馈
- **进度可见**：长时间操作显示进度
- **错误友好**：提供清晰的错误信息和解决建议
- **灵活控制**：用户可以随时暂停、恢复或中止

---

## 故障排查

### 常见问题

1. **Skill 无法调用**
   - 检查 skill 是否正确注册
   - 验证 SKILL.md 格式是否正确
   - 查看日志中的错误信息

2. **数据丢失**
   - 检查文件权限
   - 验证 JSON 格式是否正确
   - 从备份恢复数据

3. **进度无法恢复**
   - 检查工作区状态是否改变
   - 验证 Git commit 是否存在
   - 手动调整任务状态

4. **匹配不准确**
   - 调整触发条件的正则表达式
   - 增加更多示例代码
   - 优化匹配算法权重

---

## 未来规划

### 短期目标（1-3个月）

- [ ] 实现所有 skills 的核心功能
- [ ] 完善数据迁移工具
- [ ] 添加单元测试和集成测试
- [ ] 编写用户使用手册

### 中期目标（3-6个月）

- [ ] 添加更多配套 skills（code-metrics, refactoring-assistant）
- [ ] 实现 Web UI 管理界面
- [ ] 支持团队协作和知识共享
- [ ] 集成 CI/CD 流程

### 长期目标（6-12个月）

- [ ] AI 驱动的自动优化建议
- [ ] 跨项目知识迁移
- [ ] 实时协作编辑支持
- [ ] 插件生态系统

---

## 贡献指南

欢迎贡献新的 skills 或改进现有功能！

1. Fork 项目
2. 创建功能分支
3. 实现功能并添加测试
4. 更新文档
5. 提交 Pull Request

---

## 许可证

本项目采用 MIT 许可证。

---

## 联系方式

- 问题反馈：GitHub Issues
- 讨论交流：Discussions
- 邮件联系：dev-advisor@example.com
