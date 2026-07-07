# ⚠️ Kilocode 技能加载说明

## 🔧 已修复的问题

SKILL.md 文件中的 `name` 字段已更新为与文件夹名一致：
- ✅ **文件夹名**: `playwright-element-test`
- ✅ **SKILL.md name**: `playwright-element-test`

## 📋 技能加载检查清单

### 1. 确保 SKILL.md 格式正确

SKILL.md 必须包含以下必需字段：

```yaml
---
name: playwright-element-test          # ✅ 必须与文件夹名一致
description: 基于 Playwright MCP 的功能测试指南...  # 必填
user-invokable: true                    # 推荐填写
disable-model-invocation: false         # 推荐填写
version: 1.0.0                          # 推荐填写
---
```

### 2. 检查文件结构

确保目录结构如下：
```
.kilocode/skills/playwright-element-test/
├── SKILL.md              # ⭐ 必需（技能定义文件）
├── README.md             # 可选（但推荐）
├── package.json          # 可选（如果有 npm 依赖）
└── ...其他文件
```

### 3. Kilocode 中加载技能的步骤

#### 方式一：重启 Kilocode（推荐）
1. 完全关闭 Kilocode
2. 重新打开 Kilocode
3. 技能应该自动出现在技能列表中

#### 方式二：刷新技能缓存
1. 在 Kilocode 中打开命令面板（Ctrl+Shift+P 或 Cmd+Shift+P）
2. 搜索并执行 "Reload Window" 或 "Developer: Reload Window"
3. 技能列表会重新加载

#### 方式三：手动触发技能扫描
如果 Kilocode 支持手动扫描：
1. 打开命令面板
2. 搜索 "Skill" 相关命令
3. 执行 "Scan Skills" 或 "Reload Skills"

## 🎯 验证技能是否加载成功

### 方法 1: 查看技能列表
在 Kilocode 聊天界面中：
1. 输入 `/` 查看可用命令列表
2. 查找 `/functional-test` 或 `/browser-action`
3. 或者查找 `playwright-element-test`

### 方法 2: 使用技能描述
在聊天中输入技能名称或描述：
```
请使用 playwright 功能测试技能
```
或
```
帮我打开网页进行测试
```

### 方法 3: 检查技能状态
如果 Kilocode 有技能管理界面：
1. 打开技能管理/设置页面
2. 查看 `playwright-element-test` 是否在列表中
3. 检查状态是否为 "已启用" 或 "Active"

## ❌ 常见问题排查

### 问题 1: 技能仍然不显示

**解决方案：**
```bash
# 1. 检查 SKILL.md 是否存在
ls .kilocode/skills/playwright-element-test/SKILL.md

# 2. 验证 name 字段
head -5 .kilocode/skills/playwright-element-test/SKILL.md

# 3. 检查 YAML front matter 格式
# 确保以 --- 开始和结束
```

### 问题 2: YAML 格式错误

**检查点：**
- ✅ 第一行必须是 `---`
- ✅ `name:` 后面必须有值
- ✅ 使用正确的缩进（2 个空格）
- ✅ 最后一行也必须有 `---`

**正确的格式示例：**
```yaml
---
name: playwright-element-test
description: 基于 Playwright MCP 的功能测试指南
version: 1.0.0
---

# 技能正文内容...
```

### 问题 3: 文件夹权限问题

**Windows 系统：**
```powershell
# 检查文件夹权限
Get-Acl .kilocode\skills\playwright-element-test | Format-List

# 确保当前用户有读取权限
```

### 问题 4: Kilocode 配置问题

**检查 Kilocode 设置：**
1. 打开 Kilocode 设置
2. 查找 "Skills" 或 "技能" 相关配置
3. 确认技能功能已启用
4. 检查是否有路径限制或黑名单

## 🛠️ 手动测试技能

### 创建测试脚本
在技能目录下创建测试文件：

```javascript
// test-skill.js
const { test, expect } = require('@playwright/test');

test('技能加载测试', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  console.log('页面标题:', title);
});
```

运行测试：
```bash
cd .kilocode/skills/playwright-element-test
npm install
npx playwright test test-skill.js
```

## 📝 技能元数据说明

### 必需字段
- `name`: 技能唯一标识（必须与文件夹名一致）
- `description`: 技能用途描述

### 推荐字段
- `version`: 版本号
- `author`: 作者信息
- `tags`: 标签列表
- `user-invokable`: 是否可在聊天菜单中显示
- `disable-model-invocation`: 是否禁止自动加载

### 高级字段（OpenClaw 兼容）
```yaml
metadata:
  openclaw:
    main: "index.js"           # 入口脚本
    timeout: 300               # 超时时间（秒）
    slash_commands:            # 斜杠命令
      - name: "functional-test"
        description: "执行网页功能测试"
    requires:
      bins: ["node", "npx"]    # 依赖的二进制文件
      npm: ["@playwright/test"] # npm 依赖
    permissions:               # 权限声明
      - "exec"
      - "browser"
      - "file.read"
```

## 🔄 更新技能后的操作

每次修改 SKILL.md 或其他配置文件后：

1. **保存所有文件**
2. **重启 Kilocode** 或 **重载窗口**
3. **验证技能更新**

## 💡 最佳实践

### 1. 保持文件名一致
```
文件夹名：playwright-element-test
SKILL.md 中的 name: playwright-element-test
```

### 2. 提供清晰的描述
```yaml
description: 基于 Playwright MCP 的功能测试指南，用于打开网页链接并执行实际的浏览器操作（点击、输入、导航、验证等）
```

### 3. 添加多个标签
```yaml
tags:
  - 功能测试
  - 自动化
  - Playwright
  - 浏览器操作
  - MCP
```

### 4. 提供完整的文档
- ✅ SKILL.md - 完整技能文档
- ✅ README.md - 快速开始指南
- ✅ QUICKSTART.md - 5 分钟上手教程
- ✅ OVERVIEW.md - 技能总览

## 📞 获取帮助

如果以上方法都不奏效：

1. **查看 Kilocode 日志**
   - 打开开发者工具
   - 查看控制台输出
   - 寻找技能加载相关的错误或警告

2. **检查 Kilocode 版本**
   ```bash
   # 某些旧版本可能不支持技能功能
   ```

3. **参考 Kilocode 官方文档**
   - 查看技能开发文档
   - 了解最新的技能格式要求

## ✅ 当前技能状态

**技能名称**: `playwright-element-test`  
**位置**: `c:/work/monorepo-test/.kilocode/skills/playwright-element-test/`  
**状态**: ✅ 配置正确，等待 Kilocode 加载  

**下一步操作**:
1. 重启 Kilocode
2. 在聊天中输入 `/` 查看技能列表
3. 或直接使用自然语言描述测试需求

---

**更新时间**: 2026-03-23  
**文档版本**: 1.0.0
