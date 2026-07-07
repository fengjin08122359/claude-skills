# Playwright + Element Source 功能测试技能

本技能提供基于 Playwright MCP 的完整**网页功能测试**解决方案，专注于实际的浏览器操作和用户交互模拟。

## 📁 目录结构

```
playwright-element-test/
├── SKILL.md                 # 技能说明文档（主入口）
├── package.json             # npm 依赖配置
├── playwright.config.js     # Playwright 配置文件
├── global-setup.js          # 全局设置脚本
├── global-teardown.js       # 全局清理脚本
├── pages/                   # Page Object 页面对象
│   └── LoginPage.js         # 登录页面对象示例
└── __tests__/               # 测试文件目录
    ├── example.spec.js           # 基础示例
    ├── element-locator.spec.js   # 元素定位策略示例
    ├── login.spec.js             # Page Object 模式示例
    └── api-ui-combo.spec.js      # API+UI 组合测试示例
```

## 🚀 快速开始

### 安装依赖

```bash
# 进入技能目录
cd .kilocode/skills/playwright-element-test

# 安装 npm 依赖
npm install

# 安装浏览器
npx playwright install --with-deps chromium
```

### 运行测试

#### 新手推荐：从简单示例开始

```bash
# 运行快速入门测试（5 分钟上手）
npm run test:quick

# 运行功能测试演示
npm run test:functional
```

#### 标准运行方式

```bash
# 运行所有测试
npm test

# 调试模式运行（可以看到浏览器操作）
npm run test:debug

# UI 模式运行（交互式界面）
npm run test:ui

# 有头模式运行（真实打开浏览器）
npm run test:headed
```
# 在特定浏览器上运行
npm run test:chromium
npm run test:firefox
npm run test:webkit

# 移动设备测试
npm run test:mobile

# 查看测试报告
npm run test:report
```

## 📖 核心功能

### 1. Playwright MCP 集成

通过 MCP(Model Context Protocol) 协议实现智能浏览器控制：

- ✅ **快速响应**: 基于结构化命令，交互更轻量
- ✅ **高确定性**: 避免自然语言歧义
- ✅ **易于集成**: 支持 Copilot、Cursor 等 AI 工具
- ✅ **便于调试**: 多客户端共享浏览器上下文

### 2. Element Source 最佳实践

提供精确的元素定位策略：

- 🔍 **智能选择器**: 自动生成最优定位策略
- 📋 **源码映射**: 关联组件源代码位置
- 🏷️ **属性分析**: 基于 data-testid、role、aria 等
- ♻️ **抗重构**: 优先使用语义化选择器

### 3. 完整的测试示例

包含多种测试场景的完整示例：

- ✅ 基础功能测试 (`example.spec.js`)
- ✅ 元素定位策略 (`element-locator.spec.js`)
- ✅ Page Object 模式 (`login.spec.js`)
- ✅ API+UI 组合测试 (`api-ui-combo.spec.js`)

## 🎯 元素定位优先级

按照以下优先级选择元素定位策略：

1. ✅ `getByTestId()` - 最稳定，不受 UI 变更影响
2. ✅ `getByRole()` - 语义化，符合无障碍标准
3. ✅ `getByLabel()` / `getByPlaceholder()` - 表单元素专用
4. ✅ `getByText()` - 文本内容匹配
5. ⚠️ CSS 选择器 - 仅在上述方法不可用时使用
6. ❌ XPath - 尽量避免，维护成本高

## 🛠️ 高级用法

### Page Object 模式

```javascript
const { LoginPage } = require('./pages/LoginPage');

test('登录测试', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user', 'pass');
});
```

### API + UI 组合测试

```javascript
test('完整流程测试', async ({ page, request }) => {
  // 通过 API 创建数据
  const response = await request.post('/api/data', { data: {...} });
  const data = await response.json();
  
  // 使用数据进行 UI 测试
  await page.goto('/page');
  await page.fill('[data-testid="input"]', data.value);
});
```

### 视觉回归测试

```javascript
test('视觉回归', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## 📊 测试报告

测试完成后会生成多种格式的报告：

- **HTML 报告**: `playwright-report/index.html`
- **JSON 报告**: `test-results.json`
- **JUnit 报告**: `junit-results.xml`

查看 HTML 报告：

```bash
npm run test:report
```

## 🔧 配置说明

主要配置项在 `playwright.config.js` 中：

- `timeout`: 超时设置
- `retries`: 失败重试次数
- `workers`: 并行 worker 数量
- `reporter`: 报告器配置
- `projects`: 多浏览器/多设备配置
- `use`: 全局共享配置（截图、视频、追踪等）

## 🐛 常见问题

### 浏览器无法启动

```bash
# 重新安装浏览器
npx playwright install --force chromium
```

### 元素定位失败

```javascript
// 等待元素可见
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();
```

### 测试超时

修改 `playwright.config.js`:

```javascript
module.exports = {
  timeout: 60000,
  expect: { timeout: 10000 }
};
```

## 📚 学习资源

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Element Source 最佳实践](https://testing-library.com/docs/queries/about)
- [完整技能文档](./SKILL.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
