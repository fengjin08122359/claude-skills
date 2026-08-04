---
name: visual-regression-test
description: 为页面生成 Playwright + VLM 视觉回归测试用例。当用户想要为某个页面添加视觉回归测试、截图对比、UI 回归检测时，主动使用此技能。即使用户只是提到"视觉测试"、"截图对比"、"UI 回归"、"页面长什么样"等关键词，也应主动建议使用此技能。
version: 4.0.0
author: team
---

# Visual Regression Test Generator

为页面生成基于 Playwright + VLM 的视觉回归测试用例。

**核心逻辑：当前实现截图 vs UED 设计图对比**

**核心标准：视觉回归不等于"像素级完全一致"，而是"结构一致性 + 设计令牌（Design Tokens）一致性"**

## 核心设计原则（必读）

在生成视觉回归测试前，必须理解以下三个核心原则：

### 原则 1：切片由用户手动提供，测试不自动截图

**正确理解**：
- **基线（UED 设计图）**：由设计师提供，是"正确 UI"的标准
- **切片（当前实现截图）**：由开发者/测试人员手动提供，是"待检测 UI"
- **测试职责**：只负责对比两者，**不应该自动访问页面并截图**

**错误理解**：
- ❌ 测试自动访问页面并截图（像传统的 E2E 测试）
- ❌ 需要认证状态来访问需要登录的页面
- ❌ 使用 `external-context` 自动截图

**正确做法**：
- ✅ 测试只读取已有的截图文件进行对比
- ✅ 用户使用浏览器插件手动截图放到 `test-results/visual/` 目录
- ✅ 测试不需要认证状态

### 原则 2：不要盲目复制现有测试代码

**常见错误**：
- 看到现有测试使用了 `external-context`，就机械地复制
- 没有理解背后的设计原则，导致生成错误的测试

**正确做法**：
- 先理解项目的设计意图和约定
- 确认现有测试是否遵循正确的设计原则
- 如有疑问，先阅读 skill 文档和 README

### 原则 3：从用户角度思考实际使用场景

**实际使用场景**：
1. 开发者修改了代码
2. 在浏览器中打开页面（已登录）
3. 使用浏览器插件截图（手动操作）
4. 运行测试对比（自动化）

**错误实现**：
- ❌ 测试需要认证状态（增加复杂性）
- ❌ 测试自动访问页面（截图可能不稳定）
-  违背"切片由用户提供"的原则

**正确实现**：
- ✅ 测试只对比已有截图，不访问页面
- ✅ 不需要认证状态
- ✅ 符合设计原则，简单可靠

## 视觉回归分层标准（UED 与开发共识）

> UED 和开发必须达成共识：**视觉回归不等于"像素级完全一致"，而是"结构一致性 + 设计令牌（Design Tokens）一致性"。**

### 通过层（Pass）

> 布局结构不变，组件间距、圆角、颜色、字体字号符合设计系统规范。

- 像素差异率 < `PASS_THRESHOLD`（默认 **5%**）
- DOM 结构完整，所有组件存在且位置正确
- 设计令牌（颜色、字号、间距、圆角）符合 Design Tokens 规范
- 文字内容不同但**布局结构一致**（如新闻标题/正文数据不同）

**判定结果**：✅ 通过，无需人工介入

### 警告层（Warn）

> 因文本长度变化导致换行、因数字位数不同导致容器撑大，但未破坏整体栅格。

- 像素差异率在 `PASS_THRESHOLD` ~ `WARN_THRESHOLD` 之间（默认 **5% ~ 10%**）
- 差异原因属于**数据驱动的可预期变更**：
  - 文本长度不同导致换行位置变化
  - 数字位数不同导致容器宽度变化
  - 图片/头像内容不同但尺寸一致
  - 日期/时间戳不同
- 整体栅格（Grid）未被破坏
- 组件未发生位移、缺失或重叠

**判定结果**：⚠️ 警告，自动标记为"数据变更"，建议 UED 确认是否需更新基线

### 失败层（Fail）

> DOM 结构错乱、组件缺失、样式类名丢失、Z-index 层级错误。

- 像素差异率 > `WARN_THRESHOLD`（默认 **10%**），或存在以下任一结构性问题（无论差异率大小）：
  - DOM 结构错乱（组件顺序变化、嵌套关系错误）
  - 组件缺失（按钮、标签、图标等 UI 元素消失）
  - 样式类名丢失（颜色、字号、间距偏离设计系统）
  - Z-index 层级错误（遮罩层、弹窗、下拉菜单层级混乱）
  - 布局崩溃（元素溢出容器、重叠、错位）
  - 响应式断点错误（移动端/桌面端布局混淆）

**判定结果**：❌ 失败，必须修复代码

### 动态忽略区域（Ignore Regions）

对于 UED 无法控制的数据字段，在对比时设置动态忽略区域：

| 忽略场景 | 示例 |
| --- | --- |
| 动态用户名/头像 | 用户昵称长度不同导致宽度变化 |
| 时间戳/日期 | "2025-07-07" vs "2024-11-24" |
| 动态数据内容 | 新闻标题、正文、数值不同 |
| 随机/唯一 ID | 动态生成的 ID、Token |
| 滚动条位置 | 滚动条导致的像素偏移 |

**实现方式**：在测试配置中声明 `ignoreRegions`，对比时跳过这些区域的像素差异。

```ts
ignoreRegions: [
  { name: '动态正文', selector: '.article-content' },
  { name: '时间戳', selector: '.publish-time' },
]
```

## 完整流程

```
┌─────────────────────────────────────────────────────────────────
│                        视觉回归测试流程                            │
└─────────────────────────────────────────────────────────────────

   创建测试             获取 UED             截取切片            ④ 运行测试
  ─────────            ─────────            ─────────            ────────
  Skill 生成测试   →  下载/截图 UED    →  截图当前页面    →  npm run visual:auto
  文件                放入 ued/           放入 test-results/  run
```

## 输入参数

| 参数 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- |
| pageUrl | 是 | 页面地址（完整 URL） | `https://zhimou.gildata.com/zhimoupre/iframe/app-warn-hs-ui#/report/edit/34` |
| scope | 是 | 测试范围描述 | "全页"、"报告内容区域"、"左侧导航" |

## 执行步骤

### 1. 解析输入

从用户请求中提取：

- **pageUrl**: 页面完整 URL
- **scope**: 测试范围（全页/局部区域）

生成测试文件名（kebab-case）：
- `/#/analysis/dashboard` → `analysis-dashboard`
- `/#/report/edit?id=1` → `report-edit`

### 2. 生成测试文件

**文件路径**: `packages/e2e/tests/visual/{page-name}.spec.ts`

**测试内容**: 仅全页截图与 UED 设计图对比，不预设具体功能测试场景。

**规范**:

1. **导入路径**:
   ```ts
   import { test } from '../../test-harness/external-context';
   import { vlmExpectScreenshot } from '../../lib/vlm-expect';
   ```
   通过 `skipScreenshot: true` 跳过自动截图，由用户手动提供切片。

2. **UED 目录**: `ued/{page-name}/`

3. **pageContext 编写规范**:
   - 中文描述页面整体布局和关键 UI 元素
   - 示例：`'经营分析报告编辑页面。顶部为系统导航栏，左侧为大纲导航面板，右侧为报告内容编辑区，底部为 AI 输入框。'`

4. **不自动访问页面**:
   - 测试通过 `skipScreenshot: true` 跳过自动截图
   - 切片由开发者/测试人员手动提供（浏览器插件或系统截图工具）
   - 使用 `vlmExpectScreenshot` 的 `skipScreenshot` 模式读取已有截图

### 3. 获取 UED 设计图（基线）

**方式 A：使用浏览器插件下载（推荐）**
1. 从设计工具（Figma/蓝湖/摹客）复制设计图导出链接
2. 点击浏览器工具栏中的"视觉回归测试工具"插件图标
3. 选择"📥 UED 下载"标签
4. 填写测试名称（例如：`business-analysis-report-edit`）
5. 粘贴 UED 设计图链接（每行一个 URL）
6. 点击"批量下载 UED"
7. 将下载的文件移动到 `ued/{测试名称}/` 目录

**方式 B：手动截图**
1. 打开设计稿（Figma/蓝湖/摹客等）
2. 使用浏览器插件的"页面截图"功能截取设计稿
3. 或使用系统截图工具（如 Snipaste、系统自带截图）
4. 将截图保存到 `ued/{测试名称}/` 目录

**方式 C：从设计工具导出**
1. 从设计工具导出 PNG 格式设计稿
2. 命名为 `{测试名称}-full-initial.png`
3. 放入 `ued/{测试名称}/` 目录

**示例**：
```bash
# 创建 UED 目录
mkdir -p packages/e2e/ued/business-analysis-report-edit

# 移动文件
mv ~/Downloads/design.png packages/e2e/ued/business-analysis-report-edit/business-analysis-report-edit-full-initial.png
```

**插件位置**: `packages/e2e/browser-extension/`
**安装说明**: 见 `packages/e2e/browser-extension/README.md`

### 4. 截取当前实现截图（切片）

**方式 A：使用浏览器插件截图（推荐）**
1. 在已登录的浏览器中打开目标页面
2. 点击浏览器工具栏中的"视觉回归测试工具"插件图标
3. 选择"📷 页面截图"标签
4. 填写切片名称（例如：`business-analysis-report-current`）
5. 点击"截取当前页面"
6. 将下载的截图移动到 `test-results/visual/` 目录

**方式 B：手动截图**
1. 在已登录的浏览器中打开目标页面
2. 使用系统截图工具（如 Snipaste、系统自带截图）
3. 或使用浏览器开发者工具截图（F12 → Ctrl+Shift+P → "Capture screenshot"）
4. 将截图保存到 `test-results/visual/` 目录

**示例**：
```bash
# 移动截图到测试目录
mv ~/Downloads/screenshot.png packages/e2e/test-results/visual/business-analysis-report-current.png
```

### 5. 运行测试

**方式 A：自动运行 + 自动判定（推荐）**

```bash
cd packages/e2e
npm run visual:auto tests/visual/{name}.spec.ts
```

此命令会：
1. 自动运行测试
2. 自动解析测试结果
3. 如有差异，自动调用 Claude Code 进行视觉判定
4. 输出判定报告

**方式 B：手动运行**

```bash
cd packages/e2e
npx playwright test --project=visual-external tests/visual/{name}.spec.ts
```

**注意**: 运行单个测试文件，不运行全量测试。

**测试结果（分层判定）**:

| 差异率 | 层级 | 结果 |
| --- | --- | --- |
| < 5% | Pass | ✅ 通过 |
| 5% ~ 10% | Warn | ️ 警告，需人工确认是否为数据变更 |
| > 10% | Fail |  失败，自动触发 VLM 判定 |

### 6. 判定差异（如有）

测试失败时输出提示符：

```
════════════════════════════════════════════════════════════
❌ [VLM] Fail：{name}
   像素差异率：9.88%
════════════════════════════════════════════════════════════

📋 请复制以下提示符，使用 Claude Code 进行分析：

────────────────────────────────────────────────────────────
请分析以下视觉回归测试的差异：

## 测试信息
- 测试名称：{name}
- 页面上下文：{pageContext}
- 像素差异率：9.88%

## 截图路径
- UED 设计稿：{uedPath}
- 当前实现截图：{currentPath}
- 差异图（红色标记差异）：{diffPath}

## 分层判定标准
- Pass（<5%）：结构一致，设计令牌符合规范 → ✅ 通过
- Warn（5%~10%）：数据驱动的可预期变更，栅格未破坏 → ⚠️ 警告
- Fail（>10%）：DOM错乱/组件缺失/样式丢失/Z-index错误 → ❌ 失败

## 请判定
1. 差异属于哪一层级（Pass/Warn/Fail）？
2. 是否为视觉回归问题（vs 可预期的数据变更）？
3. 严重程度如何（critical/major/minor）？

请读取上述图片进行分析。
────────────────────────────────────────────────────────────
```

## 测试用例模板

**注意**：模板必须遵循核心设计原则，不依赖认证状态，不自动访问页面。

```ts
/**
 * {页面名称} — 视觉回归测试
 *
 * UED 设计图目录：ued/{page-name}/
 *
 * 使用方式:
 *   1. 使用浏览器插件截取当前页面，放入 test-results/visual/ 目录
 *   2. 将 UED 设计稿放入 ued/{page-name}/ 目录
 *   3. 运行测试进行对比
 *
 * 注意: 本测试不依赖认证状态，切片由用户手动提供
 *
 * 分层标准:
 *   Pass (< 5%):  结构一致，设计令牌符合规范 → ✅ 通过
 *   Warn (5%~10%): 数据驱动变更，栅格未破坏 → ⚠️ 警告
 *   Fail (> 10%): DOM错乱/组件缺失/样式丢失 → ❌ 失败
 */
import { test } from '../../test-harness/external-context';
import { vlmExpectScreenshot } from '../../lib/vlm-expect';

// ── 常量定义 ──

/** UED 设计图目录 */
const UED_DIR = 'ued/{page-name}';

/** 通过层阈值（< 5% 直接通过） */
const PASS_THRESHOLD = 0.05;

/** 警告层阈值（5% ~ 10% 为警告，> 10% 为失败） */
const WARN_THRESHOLD = 0.10;

/**
 * 动态忽略区域 — UED 无法控制的数据字段
 *
 * 在对比时跳过这些区域的像素差异，避免因数据内容不同导致的误报。
 * 常见场景：动态用户名、时间戳、新闻正文、滚动条位置等。
 */
const IGNORE_REGIONS: Array<{ name: string; selector: string }> = [
  // 示例：忽略动态内容区域
  // { name: '动态正文', selector: '.article-content' },
  // { name: '时间戳', selector: '.publish-time' },
];

// ── 测试用例 ──

test.describe('{页面名称} — 视觉回归', () => {

  /**
   * 全页截图 — 与 UED 设计图对比（分层判定）
   *
   * 切片由用户手动提供（浏览器插件/系统截图），
   * 测试通过 skipScreenshot=true 跳过自动截图，
   * 直接读取 test-results/visual/ 中已有的截图文件进行对比。
   *
   * 三层判定：
   * - Pass（< 5%）：结构一致，直接通过
   * - Warn（5% ~ 10%）：可能为数据驱动变更，警告但不阻断
   * - Fail（> 10%）：可能存在视觉回归，阻断并输出 VLM 提示符
   */
  test('全页截图 — 初始加载', async ({ page }) => {
    const result = await vlmExpectScreenshot(page, {
      name: '{name}-full-initial',
      pageContext: '{pageContext}',
      uedDir: UED_DIR,
      passThreshold: PASS_THRESHOLD,
      warnThreshold: WARN_THRESHOLD,
      skipScreenshot: true,
      ignoreRegions: IGNORE_REGIONS,
    });

    // Fail 层阻断测试，Pass/Warn 层均通过
    if (!result.passed) {
      throw new Error(
        `视觉回归检测失败：${result.judgeResult.diffPercent} 超过失败阈值 ${(WARN_THRESHOLD * 100).toFixed(0)}%\n` +
        `请检查差异图：${result.diffPath}\n` +
        `分层结果：${result.layer}\n` +
        (result.judgeResult.judgment?.explanation || '')
      );
    }
  });

});
```

**模板要点**：
- ✅ 使用 `external-context` + `vlmExpectScreenshot`
- ✅ `skipScreenshot: true` 跳过自动截图，切片由用户手动提供
- ✅ 不需要认证状态
- ✅ 三层阈值：PASS_THRESHOLD=5%, WARN_THRESHOLD=10%
- ✅ Fail 层（>10%）才阻断测试，Warn 层仅警告
- ✅ 支持 `ignoreRegions` 配置动态忽略区域

## 关键 API

```ts
// 全页截图对比 UED 设计图（skipScreenshot 模式）
await vlmExpectScreenshot(page, {
  name: '截图名称',
  pageContext: '页面描述',
  uedDir: 'ued/xxx',
  passThreshold: 0.05,
  warnThreshold: 0.10,
  skipScreenshot: true,
  ignoreRegions: [
    { name: '动态正文', selector: '.article-content' },
    { name: '时间戳', selector: '.publish-time' },
  ],
});
```

## 最佳实践

### pageContext 编写

- **好的**: `'经营分析报告编辑页面。顶部为系统导航栏，左侧为大纲导航面板（4个章节），右侧为报告内容编辑区，底部为 AI 输入框和"报告生成"按钮。'`
- **差的**: `'报告页面'`

### 图片获取方式

| 图片类型 | 获取方式 | 目标目录 |
| --- | --- | --- |
| UED 设计图（基线） | 插件下载/手动截图/设计工具导出 | `ued/{name}/` |
| 当前实现截图（切片） | 插件截图/手动截图 | `test-results/visual/` |

### 差异处理

| 情况 | 层级 | 操作 |
| --- | --- | --- |
| 实现与设计一致 | Pass | ✅ 无需操作 |
| 文本长度/数字位数导致换行 | Warn | ️ 确认为数据变更后可忽略 |
| 数据内容变化（新闻、数值等） | Warn | ⚠️ 更新 UED 基线或使用 ignoreRegions |
| 布局/样式回归 | Fail | ❌ 修复代码 |
| DOM 结构错乱/组件缺失 | Fail | ❌ 紧急修复 |

## 输出检查清单

生成测试文件后，确认：

- [ ] 文件路径：`packages/e2e/tests/visual/{name}.spec.ts`
- [ ] 导入：`external-context` 和 `vlm-expect`
- [ ] UED 目录：`ued/{name}/`
- [ ] pageContext 中文描述且具体
- [ ] `skipScreenshot: true` 已设置
- [ ] 三层阈值配置正确（PASS_THRESHOLD=5%, WARN_THRESHOLD=10%）
- [ ] ignoreRegions 已配置动态忽略区域（如有）
- [ ] 提示用户获取 UED 设计图和当前截图（支持多种方式）

## 文件结构

```
packages/e2e/
├── browser-extension/                      # 浏览器插件
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── README.md
│   └── icons/
├── ued/                                    # UED 设计图（基线）
│   └── {page-name}/
│       └── {name}.png
├── tests/visual/                           # 测试文件（Skill 生成）
│   └── {page-name}.spec.ts
├── test-results/visual/                    # 当前实现截图（切片）
│   ├── {name}-current.png
│   └── {name}-diff.png
└── lib/
    ├── visual-judge.ts                     # 分层判定引擎（Pass/Warn/Fail）
    └── vlm-expect.ts                       # 断言封装 + 提示符生成
```
