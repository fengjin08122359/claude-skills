# Gulp Command Helper Skill

## 功能说明

简化 monorepo 项目中的 Gulp 命令执行，提供智能化的工作区管理和构建流程。

## 核心能力

### 1. 项目切换与初始化

```bash
# 切换项目（带清理选项）
gulp project-change -p <project-name> [--force]

# 添加新项目
gulp project-add -p <project-name> [--force]

# 初始化目录和配置
gulp make
```

**使用场景：**
- 切换到客户项目（如 `project-sczq`, `project-wlzq`）
- 添加新的主应用/子应用分支
- 初始化开发环境

### 2. 工作区构建

```bash
# 构建全部工作区应用
gulp workspaces-build

# 构建工具箱应用
gulp packages-build

# 针对特定应用的命令
gulp workspaces-command -b <app-name> -c "<command>"
```

**使用场景：**
- 初次搭建环境后构建所有依赖
- 同步更新多个子应用
- 批量执行 git 命令或 npm 命令

### 3. 部署打包

```bash
# 打包全部应用
gulp publish-build [--env test|pre|prd]

# 打包全部子应用
gulp app-build [--frame iframe-saas]

# 打包主应用
gulp main-build [--env test|pre|prd]

# 打包独立应用
gulp independent-build
```

**使用场景：**
- 生产环境部署
- 测试环境发布
- 预发布环境验证

### 4. 文档管理

```bash
# 整理文档
gulp doc-prepare

# 生成 HTML 文档
gulp doc-build
```

**使用场景：**
- 更新 dev/doc 下的文档
- 生成 dist-doc 用于查阅

### 5. 色值转换

```bash
# 色值转色键
gulp color-convert -n <color-key> -w <workspace-name> [-v <color-value>]

# 色键转色值
gulp color-revert -n <color-key> -w <workspace-name> [-v <color-value>]

# 多键转换
gulp color-convert-with-mul-n -n <color-keys> -w <workspace-name>
```

**使用场景：**
- 主题切换时批量替换色值
- 统一调整品牌色

### 6. 版本管理

```bash
# 同步配置文件
gulp sync-config [-w true|false] [-b <branches>]

# 同步依赖版本
gulp sync-dep [-w true|false] [-b <branches>]

# 同步 lint-stage
gulp sync-lint [-w true|false] [-b <branches>]
```

**使用场景：**
- 批量更新 package.json 版本号
- 统一 ESLint 配置
- 保持依赖版本一致

## 典型工作流

### 工作流 1：切换到新客户项目

```bash
# 1. 切换项目
gulp project-change -p sczq

# 2. 切换到开发模式
gulp prepare-changeDev

# 3. 构建工作区应用
gulp workspaces-build

# 4. 进入具体应用开发
cd workspaces/iframe-sczq
npm run serve
```

### 工作流 2：版本发布

```bash
# 1. 使用 changeset 管理版本
pnpm changeset
pnpm changeset version

# 2. 同步版本信息
gulp workspaces-command -s -c "git pull --rebase"

# 3. 更新版本号
gulp workspaces-command -s -c "npm version patch --no-git-tag-version"

# 4. 生成子应用信息
gulp workspaces-command -s -c "npm run prepared"

# 5. 提交代码
gulp workspaces-command -s -c "git add ."
gulp workspaces-command -s -c "git commit -m 'T202602103982 saas-版本更新'"
gulp workspaces-change-push -s
gulp workspaces-command -s -c "git push"
```

### 工作流 3：生产部署

```bash
# 1. 打包全部应用（默认生产环境）
gulp publish-build

# 2. 复制到 dist 目录
gulp publish-dist

# 3. 生成部署文件
createDiffFiles
```

## 常用命令速查

| 命令 | 说明 | 参数示例 |
|------|------|----------|
| `gulp make` | 初始化目录和配置 | - |
| `gulp project-change` | 切换项目 | `-p sczq` |
| `gulp project-add` | 添加项目 | `-p newproject` |
| `gulp prepare-changeDev` | 切换到开发模式 | - |
| `gulp workspaces-build` | 构建工作区全部应用 | - |
| `gulp packages-build` | 构建工具箱 | - |
| `gulp publish-build` | 部署打包全部应用 | `--env prd` |
| `gulp app-build` | 打包全部子应用 | `--frame iframe-saas` |
| `gulp main-build` | 打包主应用 | `--env pre` |
| `gulp doc-prepare` | 文档整理 | - |
| `gulp doc-build` | 生成 HTML 文档 | - |
| `gulp color-convert` | 色值转换 | `-n primaryColor -w app-company` |
| `gulp sync-config` | 同步配置 | `-w true -b app-analysis,app-bond` |
| `gulp workspaces-command` | 工作区命令 | `-b app-* -c "git status"` |

## 环境变量

```bash
# 内存溢出时增加 Node.js 内存限制
export NODE_OPTIONS='--max-old-space-size=4096'

# Windows PowerShell
$env:NODE_OPTIONS='--max-old-space-size=4096'
```

## 注意事项

1. **首次运行 pnpm**：在 Linux/Mac 环境需要先运行 `pnpm setup` 并重启 terminal
2. **项目切换前备份**：使用 `--force` 参数会清理项目目录和工作区应用
3. **Gerrit 推送**：默认推送到 `refs/for/branch` 需要代码评审
4. **色值转换**：图片和 SVG 需要单独替换色值
5. **内存管理**：构建大型项目时注意监控内存使用

## 故障排查

### 问题 1：pnpm 安装失败
```bash
pnpm setup
source ~/.zshrc  # 或 source ~/.bashrc
pnpm i --shamefully-hoist --force
```

### 问题 2：工作区构建失败
```bash
# 清理缓存
pnpm clean

# 重新安装
pnpm i --shamefully-hoist --force --no-frozen-lockfile --unsafe-perm

# 重新构建
gulp workspaces-build
```

### 问题 3：内存溢出
```bash
# 临时解决方案
cross-env NODE_OPTIONS='--max-old-space-size=4096' gulp publish-build

# 永久解决：修改 package.json scripts
```

## 相关文档

- [开发工作区准备.md](../../dev/doc/开发工作区准备.md)
- [Gulp 命令集](../../dev/doc/开发工作区准备.md#gulp 命令集)
- [版本发布流程](../../AGENTS.md#版本发布流程)
