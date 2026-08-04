# 项目级技术决策

> 记录影响全局的技术选型和架构方案。模块级决策见 `modules/[模块]/decisions.md`。

---

### DEC-P001 — 框架版本锁定 Vue 2.7

**决策日期：** 项目启动时
**决策类型：** 框架选型

**背景：** Vue 3 已发布，但项目生态（Element UI、自研微前端、客户定制项目）深度依赖 Vue 2。

**决策：** 锁定 Vue 2.7.16，利用其原生 Composition API 支持，不迁移 Vue 3。

**影响：**
- 新代码可使用 `<script setup>` 和 Composition API 风格
- 第三方库选型需兼容 Vue 2.7
- 无 Vue 3 迁移计划

---

### DEC-P002 — Monorepo 采用 pnpm workspace

**决策日期：** 项目启动时
**决策类型：** 工具链

**背景：** 73+ 子应用 + 50+ 客户项目，需要统一的包管理方案。

**决策：** 使用 pnpm@6.35.1 workspace 模式。

**影响：**
- 共享包通过 `packages/` 目录直接引用
- 子应用依赖在 `workspaces/` 独立管理
- 锁文件为 `pnpm-lock.yaml`，不使用 npm/yarn

---

### DEC-P003 — 微前端采用自研 hui-micro-app

**决策日期：** 项目启动时
**决策类型：** 架构方案

**背景：** 需要支持主应用 + 多子应用的微前端架构，iframe 隔离是核心需求。

**决策：** 使用自研 `hui-micro-app`，基于 iframe 方案。

**影响：**
- 主应用为 `iframe-saas`、`iframe-standard`
- 子应用通过 `workspaces/app-*` 独立部署
- 子应用间通信通过 `packages/module` 提供的通讯类

---

### DEC-P004 — 测试框架采用 Jest + ts-jest

**决策日期：** 2026-07-14（e2e 模块引入组件测试时确认）
**决策类型：** 测试选型

**背景：** 项目已有 Jest 基础设施，e2e 包需引入 vue-jest + @vue/test-utils 补充组件测试。

**决策：** 统一使用 Jest + ts-jest，组件测试通过 vue-jest 处理 `.vue` 文件。Playwright 仅用于端到端测试。

**影响：**
- 单元测试配置：`jest.config.js` + `ts-jest`
- 组件测试：`vue-jest` + `@vue/test-utils`
- e2e 测试：Playwright（独立配置）
- 高难度 issue（≥16分）必须包含单元测试

---

### DEC-P005 — 文档分 knowledge / working 两层

**决策日期：** 项目中期
**决策类型：** 知识管理

**背景：** 稳定知识和进行中工作混在一起，skill 检索时难以区分。

**决策：**
- `docs/knowledge/` — 稳定参考知识（AGENTS-FULL.md、ADR、组件库文档），可被 skill 引用
- `docs/working/` — 进行中工作产物（PRD、Issue、操作记录），完成后归档或删除

**影响：**
- `local-knowledge-base` skill 检索 `docs/knowledge/`
- 新文档默认放 `docs/working/`，稳定后迁移到 `docs/knowledge/`

---

### DEC-P006 — 代码质量工具采用 Oxlint + ESLint 混合模式

**决策日期：** 项目中期
**决策类型：** 工具链

**背景：** ESLint 性能不足，Oxlint 速度快但规则覆盖不全。

**决策：** Oxlint 负责高性能检查，ESLint 处理 TypeScript 语义规则，两者混合使用。格式化用 Oxfmt + Prettier。

**影响：**
- 提交前通过 Husky + lint-staged 触发检查
- 不单独依赖 ESLint 做全量扫描
- Prettier 配置与 Oxfmt 保持一致
