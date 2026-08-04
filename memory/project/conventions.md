# 项目约定

## 技术栈约定

| 类别 | 选型 | 版本约束 |
| ---- | ---- | -------- |
| 框架 | Vue 2.7（支持 Composition API） | 2.7.16，不迁移 Vue 3 |
| 语言 | TypeScript | ^4.9.4 |
| 构建 | Webpack 5 + Vue CLI | 5.83.1 |
| UI 库 | Element UI + DUI + umy-ui + GildataDesign | Element UI ^2.15.13 |
| 图表 | ECharts | ^5.4.1 |
| 状态管理 | Vuex + Vuex Class | 3.6.2 |
| 路由 | Vue Router | 3.5.0 |
| 测试 | Jest + ts-jest | ^29.3.1 |
| 代码质量 | Oxlint + ESLint（混合模式）、Oxfmt、Prettier | — |
| 微前端 | hui-micro-app（自研） | — |
| 包管理 | pnpm workspace | 6.35.1 |

## 目录结构约定

```text
monorepo/
├── packages/          # 共享包（hsComponent / module / uiComponents / utils）
├── workspaces/        # 工作空间（73+ 子应用，app-* / iframe-* / independent-*）
├── docs/
│   ├── knowledge/     # 稳定参考知识（AGENTS-FULL.md、ADR、组件库文档）
│   └── working/       # 进行中工作产物（PRD、Issue、操作记录）
├── dev/               # 客户定制项目（50+）
├── automated-test/    # AI 自动化测试
├── dist/              # 部署包输出
└── tgz/               # 本地 tgz 包
```

**文档分工：**
- `docs/knowledge/` — 稳定知识，可被 skill 引用（如 `local-knowledge-base`）
- `docs/working/` — 进行中的工作产物，随任务完成归档

**Memory 结构（`.claude/memory/`）：**
- 一级分类：功能模块（`modules/[name]-module/`）
- 二级分类：难度等级（`issues/low|medium|high/`）
- 高难度（≥16分）：必须有单元测试，`requirements/high/tests/` 目录必须存在
- 项目级记忆：`project/`（不按模块分类）

## 编码原则（12 条，来自 AGENTS.md）

1. **编码前先思考** — 明确假设，不确定要提问，暴露权衡
2. **简洁优先** — 最少代码，不写投机性功能，不为单次使用做抽象
3. **外科手术式修改** — 只触碰必须修改的地方，匹配现有风格
4. **目标驱动执行** — 定义成功标准，循环验证
5. **确定性逻辑禁止交给模型** — 重试/路由/阈值必须写成显式代码
6. **硬性 Token 预算** — 预算耗尽立即停止
7. **暴露冲突，不要折中** — 矛盾模式等待人类决策
8. **先读再写** — 已有重复实现直接使用，不创建第二个版本
9. **测试必须有，但不是目的** — 验证有意义的行为属性
10. **长任务需要检查点** — 每步总结，失败回滚
11. **惯例优先于新颖** — 遵从现有惯例
12. **失败必须显性化** — 错误严禁吞掉

## 领域上下文约定（grill-with-docs 生态）

- 多上下文 monorepo：根目录 `CONTEXT-MAP.md` 指向各工作区 `CONTEXT.md`
- `CONTEXT.md` 只含领域词汇表，不含实现细节
- 编码前读取对应工作区的 `CONTEXT.md`，命名与术语保持一致
- 架构决策记录存放于 `docs/knowledge/adr/`（按模块分目录）
