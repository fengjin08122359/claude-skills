# AI 助手配置说明

## 📋 概述

本项目使用 **AGENTS.md** 作为 AI 助手的上下文配置机制，而非自定义的配置文件。

## ✅ 当前配置状态

### 已删除的文件

以下非官方标准的配置文件已被删除：

- ❌ `.lingma/config.json` (根目录)
- ❌ `workspaces/app-combination/.lingma/config.json` (子应用)
- ❌ `.lingma/verify-config.ps1` (验证脚本)
- ❌ `.lingma/VERIFICATION_GUIDE.md` (验证指南)
- ❌ `.lingma/CONFIGURATION_COMPLETE.md` (配置报告)
- ❌ `workspaces/app-combination/.lingma/SETUP_COMPLETE.md`
- ❌ `workspaces/app-combination/.lingma/REVIEW_REPORT.md`
- ❌ `workspaces/app-combination/.lingma/DOCUMENT_ANALYSIS.md`
- ❌ `workspaces/app-combination/.lingma/REFACTORING_COMPLETE.md`
- ❌ `workspaces/app-combination/.lingma/VERIFICATION_CHECKLIST.md`

### 保留的核心文件

#### 根目录
- ✅ `AGENTS.md` - AI 助手自动读取的项目配置文档
- ✅ `GLOBAL_TECHNICAL_SUMMARY.md` - 全局技术总结（999行）
- ✅ `DOCUMENTATION_SYSTEM.md` - 双层文档体系说明
- ✅ `.lingma/README.md` - Lingma 配置说明（已更新）
- ✅ `.lingma/agents/` - Agents 配置目录
- ✅ `.lingma/rules/` - Rules 配置目录
- ✅ `.lingma/skills/` - Skills 配置目录

#### 子应用 (app-combination)
- ✅ `workspaces/app-combination/AGENTS.md` - 子应用配置（226行）
- ✅ `workspaces/app-combination/.lingma/README.md` - 子应用配置说明（已更新）
- ✅ `workspaces/app-combination/.lingma/COLLABORATION_GUIDE.md` - 协作指南

## 🤖 AI 助手如何获取上下文

### 工作机制

AI 助手（包括 Lingma、Kilocode 等）通过以下方式获取项目上下文：

1. **自动读取 AGENTS.md**
   - AI 助手在项目根目录工作时会自动读取 AGENTS.md
   - AGENTS.md 包含 Monorepo 结构、技术栈、开发规范等核心信息

2. **文档引用链**
   ```
   AGENTS.md (根目录)
   ├── 引用 → GLOBAL_TECHNICAL_SUMMARY.md (全局技术规范)
   └── 引用 → workspaces/*/AGENTS.md (子应用配置)
   ```

3. **智能选择**
   - **根目录工作**: AI 助手读取根目录 AGENTS.md + GLOBAL_TECHNICAL_SUMMARY.md
   - **子应用目录工作**: AI 助手读取子应用 AGENTS.md

### AGENTS.md 关键章节

AGENTS.md 中包含以下与 AI 助手相关的章节：

1. **全局技术文档** (第 296-302 行)
   - 引用 GLOBAL_TECHNICAL_SUMMARY.md
   - 说明其作用和使用场景

2. **AI 助手文档引用** (第 304-318 行)
   - 说明 AI 助手如何获取上下文
   - 列出三种文档来源

3. **子应用技术文档** (第 328-335 行)
   - 列出各子应用的技术文档位置
   - 说明每个子应用的文档特点

## 📝 为新子应用添加文档

当需要为新的子应用（如 app-company, app-information 等）创建技术文档时：

### 步骤 1: 创建子应用 AGENTS.md

```bash
# 复制模板
cp workspaces/app-combination/AGENTS.md \
   workspaces/app-new-app/AGENTS.md

# 修改内容
# - 更新标题和应用名称
# - 替换为该子应用的业务模块
# - 调整 DUI 迁移目录结构
# - 更新特有配置和约束
```

### 步骤 2: 更新根目录 AGENTS.md

在 AGENTS.md 的"子应用技术文档"章节中添加：

```markdown
### 子应用技术文档

每个子应用在自己的目录下维护 `AGENTS.md` 文件，AI 助手进入子应用目录时会自动读取该文件。

**示例**：
- **app-combination**: `workspaces/app-combination/AGENTS.md`
  - 包含组合监控的业务模块、DUI 迁移规范、特有业务状态等
  - AI 助手在 app-combination 目录下工作时自动加载

- **app-new-app**: `workspaces/app-new-app/AGENTS.md`
  - 新子应用的技术总结描述
```

### 步骤 3: 创建 .lingma 目录（可选）

```bash
mkdir -p workspaces/app-new-app/.lingma

# 可以添加 README.md 说明
cat > workspaces/app-new-app/.lingma/README.md << EOF
# AI 助手配置说明

本目录下的 AGENTS.md 是 app-new-app 的配置文档。

AI 助手进入此目录时会自动读取 AGENTS.md。
EOF
```

### 步骤 4: 测试验证

在新子应用目录下向 AI 助手提问，验证文档是否正确加载：

```
请根据 app-new-app 的技术文档，帮我创建一个新的页面组件
```

## 💡 最佳实践

### 对于 AI 助手

1. **优先读取 AGENTS.md**
   - 理解项目整体架构
   - 掌握通用规范

2. **根据工作目录选择文档**
   - 根目录 → 根目录 AGENTS.md + GLOBAL_TECHNICAL_SUMMARY.md
   - 子应用目录 → 子应用 AGENTS.md

3. **结合两者生成回答**
   - 通用规范来自全局文档
   - 特定实现来自子应用文档

### 对于开发人员

1. **维护 AGENTS.md**
   - 确保文档引用准确
   - 及时添加新子应用的文档引用

2. **更新技术总结**
   - 全局规范变更 → 更新 GLOBAL_TECHNICAL_SUMMARY.md
   - 子应用特有内容 → 更新对应的 AGENTS.md

3. **避免使用自定义配置**
   - 不创建 `.lingma/config.json`
   - 依赖 AGENTS.md 的标准机制

## 🔄 变更历史

- **2026-04-29**: 删除非官方的 `.lingma/config.json` 配置
  - 原因：通义灵码官方不支持此配置格式
  - 替代方案：完全依赖 AGENTS.md 提供上下文
  - 影响：简化配置，符合官方标准

## 📞 支持和反馈

如有配置相关问题：

1. **查阅文档**
   - `.lingma/README.md` - Lingma 配置说明
   - `AGENTS.md` - 项目整体配置
   - `GLOBAL_TECHNICAL_SUMMARY.md` - 全局技术规范

2. **内部讨论** - 团队会议或即时通讯

3. **Issue 追踪** - 在项目仓库提出问题

---

**配置版本**: v2.0 (基于 AGENTS.md)  
**最后更新**: 2026-04-29  
**维护者**: Monorepo 开发团队
