---
name: gulp-process-refactor-experience
description: gulp-process 模块重构经验（2026-07-07），从单体文件拆分为 processes/ 子模块模式
metadata:
  type: project
---

# gulp-process 重构经验

**日期：** 2026-07-07
**模块：** gulp-process
**相关文件：** [gulp-process/](c:\work\monorepo-test\gulp-process)

## 重构背景

gulp-process 目录包含 11 个 JS 文件，定义了项目工作区管理、构建、配置同步、文档生成等核心 Gulp 任务。主要问题：
- `workspaces.js`（605行）和 `doc-process/build.js`（419行）是大型单体文件
- 重复函数：`readPackageJson`/`changePackageJson`/`dependenciesSyncVersion`/`checkBranchExists` 在多个文件中重复
- 无 JSDoc 文档
- 命名错误：`sycn` → `sync`
- 代码 Bug：`changeProjectJson` 修改了 `res` 但写回了 `projectJsonData`

## 重构方案

参照 `gulp-publish` 模块的重构模式（frames/ 子模块），采用以下策略：

### 目录结构
- **`processes/`** 目录：存放共享子模块（类似 gulp-publish 的 `frames/`）
- **thin wrapper 模式**：保留原文件名作为 thin wrapper，确保 `index.js` 完全不变
- **任务按职责拆分**：`workspaces.js` → `workspace-build.js` + `workspace-manage.js`

### 提取的共享模块（6个）
1. **`processes/package-helpers.js`** — package.json 读写/依赖同步
   - 关键决策：创建两个函数 `dependenciesSyncVersion`（全量覆盖）和 `dependenciesSyncExistingVersion`（仅更新已存在的 key），因为原代码中有两种行为
2. **`processes/workspace-helpers.js`** — 分支采集/复制/检出（`getBranches`, `copyFromEmpty`, `checkoutFrom`）
3. **`processes/branch-utils.js`** — 分支检查（`checkBranchExists` 参数化 searchDir 消除差异）
4. **`processes/project-classifier.js`** — 项目分支分类（dealSaas/dealTemplate/dealProject 等）
5. **`processes/dist-builder.js`** — dist 目录创建/README 下载
6. **`processes/format-converter.js`** — MD→HTML/JSON 转换

### 兼容性保证
- `index.js` 的 require 路径不变（workspaces.js 作为 thin wrapper）
- 所有 28 个 gulp task 名称不变
- 通过 `npx gulp --tasks` 验证全部通过

## 关键经验

**Why:** 大型 gulp 任务文件难以维护，重复代码增加 bug 风险，无文档导致后续修改困难。

**How to apply:**
1. **提取共享函数到 processes/** — 消除跨文件重复
2. **thin wrapper 模式** — 原文件名保留为 thin wrapper（仅 require），确保入口不变
3. **任务按职责拆分** — 构建任务 vs 管理任务分离
4. **参数化消除差异** — `checkBranchExists` 通过 searchDir 参数统一两个实现
5. **先验证后重构** — 每个 processes/ 模块单独验证 require 是否成功
6. **保持 gulp task 名称不变** — 用户通过 task 名称调用，名称变化会破坏下游脚本
