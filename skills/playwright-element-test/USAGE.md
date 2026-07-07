# Playwright + Element Source Skill 使用指南

## 📦 技能结构

本技能位于 `.kilocode/skills/playwright-element-test/` 目录，包含以下文件：

```
playwright-element-test/
├── SKILL.md                 # ⭐ 主文档 - 完整的技能说明和使用指南
├── README.md                # 📖 快速开始指南
├── package.json             # 📦 npm 依赖配置
├── playwright.config.js     # ⚙️ Playwright 配置文件
├── global-setup.js          # 🔧 全局设置脚本
├── global-teardown.js       # 🧹 全局清理脚本
├── .gitignore               # 🚫 Git 忽略文件
├── pages/                   # 🎯 Page Object 页面对象
│   └── LoginPage.js         # 登录页面对象示例
└── __tests__/               # 🧪 测试文件目录
    ├── example.spec.js           # 基础示例
    ├── element-locator.spec.js   # 元素定位策略示例
    ├── login.spec.js             # Page Object 模式示例
    └── api-ui-combo.spec.js      # API+UI 组合测试示例
```

## 🎯 核心特性

### 1. Playwright MCP 集成

本技能集成了 **Playwright MCP (Model Context Protocol)**，提供：

- ✅ **智能浏览器控制**: 通过 MCP 协议实现结构化命令交互
- ✅ **AI 辅助测试**: 支持使用自然语言描述测试需求
- ✅ **高确定性执行**: 避免自然语言歧义，执行结果更可靠
- ✅ **便于调试**: 多客户端可共享一个浏览器上下文

### 2. Element Source 最佳实践

提供业界标准的元素定位策略：

**优先级排序：**
1. ✅ `getByTestId()` - 最稳定，不受 UI 变更影响
2. ✅ `getByRole()` - 语义化，符合无障碍标准
3. ✅ `getByLabel()` / `getByPlaceholder()` - 表单元素专用
4. ✅ `getByText()` - 文本内容匹配
5. ⚠️ CSS 选择器 - 仅在上述方法不可用时使用
6. ❌ XPath - 尽量避免，维护成本高

## 🚀 快速开始

### 步骤 1: 安装依赖

```bash
# 进入技能目录
cd c:/work/monorepo-test/.kilocode/skills/playwright-element-test

# 安装 npm 依赖
npm install

# 安装 Playwright 浏览器
npx playwright install --with-deps chromium
```

### 步骤 2: 运行测试

```bash
# 方式 1: 使用 npm 脚本
npm test

# 方式 2: 直接使用 Playwright CLI
npx playwright test

# 调试模式（推荐新手使用）
npm run test:debug

# UI 模式（交互式开发体验）
npm run test:ui

# 有头模式（可以看到浏览器操作过程）
npm run test:headed
```

### 步骤 3: 查看测试报告

```bash
# 生成并打开 HTML 报告
npm run test:report

# 或手动打开
npx playwright show-report
```

## 📚 学习路径

### 入门级 - 从零开始

1. **阅读主文档** [SKILL.md](./SKILL.md)
   - 了解 Playwright MCP 和 Element Source 的核心概念
   - 学习环境配置和安装步骤
   - 掌握基本操作步骤

2. **运行示例测试**
   ```bash
   # 运行基础示例
   npx playwright test __tests__/example.spec.js
   
   # 运行元素定位示例
   npx playwright test __tests__/element-locator.spec.js
   ```

3. **学习元素定位策略**
   - 参考 `__tests__/element-locator.spec.js`
   - 理解不同定位方式的优先级
   - 掌握动态内容、iframe、Shadow DOM 的处理

### 进阶级 - 设计模式

1. **Page Object 模式**
   - 阅读 `pages/LoginPage.js`
   - 运行 `__tests__/login.spec.js`
   - 学习如何提高测试可维护性

2. **API + UI 组合测试**
   - 阅读 `__tests__/api-ui-combo.spec.js`
   - 学习如何结合 API 和 UI 测试
   - 掌握测试数据管理技巧

### 高级级 - 最佳实践

1. **视觉回归测试**
   ```javascript
   test('视觉回归', async ({ page }) => {
     await page.goto('/');
     await expect(page).toHaveScreenshot('homepage.png');
   });
   ```

2. **性能测试**
   ```javascript
   test('页面加载性能', async ({ page }) => {
     const startTime = Date.now();
     await page.goto('/');
     const loadTime = Date.now() - startTime;
     expect(loadTime).toBeLessThan(3000);
   });
   ```

3. **可访问性测试**
   ```javascript
   test('可访问性检查', async ({ page }) => {
     await page.goto('/');
     const accessibilityScanResults = await page
       .locator('body')
       .evaluate(node => {
         // 使用 axe-core 或其他工具
       });
   });
   ```

## 🎓 代码示例

### 基础测试示例

```javascript
// __tests__/basic.spec.js
const { test, expect } = require('@playwright/test');

test.describe('基础测试', () => {
  test('应该成功加载首页', async ({ page }) => {
    await page.goto('/');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/首页/);
    
    // 检查关键元素
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
```

### Page Object 模式示例

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('submit-button');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// __tests__/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('登录测试', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user', 'pass');
});
```

### API + UI 组合测试示例

```javascript
test('完整流程测试', async ({ page, request }) => {
  // 通过 API 创建数据
  const response = await request.post('/api/users', {
    data: { username: 'test', email: 'test@example.com' }
  });
  const user = await response.json();

  // 使用数据进行 UI 测试
  await page.goto('/login');
  await page.fill('[data-testid="username"]', user.username);
  await page.click('[role="button"]');
  
  // 验证
  await expect(page).toHaveURL(/\/dashboard/);
});
```

## 🔧 常用命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx playwright test __tests__/example.spec.js

# 运行特定测试用例（模糊匹配）
npx playwright test -g "登录"

# 在特定浏览器上运行
npm run test:chromium
npm run test:firefox
npm run test:webkit

# 移动设备测试
npm run test:mobile

# 调试模式
npm run test:debug

# UI 模式（推荐）
npm run test:ui

# 有头模式
npm run test:headed

# 更新截图快照
npx playwright test --update-snapshots

# 查看报告
npm run test:report

# 安装浏览器
npm run install:browsers
```

## 🐛 常见问题解决方案

### 问题 1: 浏览器无法启动

**症状**: `Error: browserType.launch: Executable doesn't exist`

**解决方案**:
```bash
# 重新安装浏览器
npx playwright install --force chromium
npx playwright install --force firefox
npx playwright install --force webkit
```

### 问题 2: 元素定位失败

**症状**: `TimeoutError: locator.click: Timeout 30000ms exceeded`

**解决方案**:
```javascript
// 1. 等待元素可见
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();

// 2. 使用更稳定的选择器
await page.getByTestId('submit-btn').click(); // 推荐

// 3. 增加超时时间
await page.locator('button').click({ timeout: 60000 });
```

### 问题 3: 动态内容处理

**症状**: 页面内容异步加载，测试不稳定

**解决方案**:
```javascript
// 1. 等待特定元素
await page.waitForSelector('.data-loaded');

// 2. 等待网络空闲
await page.waitForLoadState('networkidle');

// 3. 等待 API 响应
const [response] = await Promise.all([
  page.waitForResponse('/api/data'),
  page.click('[data-testid="load-data"]')
]);
```

### 问题 4: 测试超时

**症状**: `TimeoutError: Test timeout of 30000ms exceeded`

**解决方案**:
```javascript
// 修改 playwright.config.js
module.exports = {
  timeout: 60000,        // 增加全局超时
  expect: { timeout: 10000 }  // 增加断言超时
};
```

## 📊 测试报告解读

测试完成后会生成多种格式的报告：

### HTML 报告（推荐）

位置：`playwright-report/index.html`

查看方式：
```bash
npm run test:report
```

包含信息：
- ✅ 测试执行状态（通过/失败）
- ✅ 执行时间统计
- ✅ 错误堆栈跟踪
- ✅ 截图和视频链接
- ✅ 控制台日志

### JSON 报告

位置：`test-results.json`

用于：
- CI/CD 集成
- 自定义分析
- 数据导出

### JUnit 报告

位置：`junit-results.xml`

用于：
- Jenkins 等 CI 工具集成
- 质量管理平台对接

## 🤖 与 AI 协作

### 使用 Playwright MCP

如果你安装了 Playwright MCP Server，可以使用自然语言描述测试需求：

```
请为登录页面创建一个完整的测试流程，包括：
1. 验证页面加载
2. 测试成功登录
3. 测试失败场景（错误密码、空输入）
4. 测试记住我功能
```

AI 会自动生成符合最佳实践的测试代码。

### 获取元素定位建议

```
请帮我找到这个元素的最佳定位方式：
<form class="login-form">
  <input id="username" name="username" placeholder="请输入用户名">
  <button type="submit">登录</button>
</form>
```

AI 会建议：
- ✅ `page.getByLabel('用户名')` 或 `page.getByPlaceholder('请输入用户名')`
- ✅ `page.getByRole('button', { name: '登录' })`

## 📚 进阶资源

### 官方文档

- [Playwright 官方文档](https://playwright.dev/)
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

### 社区资源

- [Awesome Playwright](https://github.com/microsoft/playwright#community)
- [Playwright Discord](https://aka.ms/playwright/discord)
- [Stack Overflow - Playwright](https://stackoverflow.com/questions/tagged/playwright)

### 相关技能

- `webapp-testing` - 通用 Web 应用测试技能
- `visual-regression` - 视觉回归测试技能
- `accessibility-testing` - 可访问性测试技能

## 💡 最佳实践总结

### 1. 测试命名规范

```javascript
// ❌ 不好的命名
test('测试 1', async () => {});

// ✅ 好的命名
test('用户输入正确的用户名和密码后应该成功登录', async () => {});
```

### 2. 测试隔离

```javascript
// 每个测试使用独立的浏览器上下文
test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/');
});
```

### 3. 有意义的断言

```javascript
// ❌ 弱断言
expect(await page.locator('button').count()).toBeGreaterThan(0);

// ✅ 强断言
await expect(page.getByRole('button', { name: '提交' })).toBeVisible();
await expect(page.getByText('操作成功')).toBeVisible();
```

### 4. 测试数据管理

```javascript
// 使用唯一值避免冲突
const testData = {
  username: `test_user_${Date.now()}`,
  email: `test_${Date.now()}@example.com`
};
```

### 5. 错误处理

```javascript
// 捕获并记录错误
try {
  await page.click('[data-testid="submit"]');
} catch (error) {
  console.error('点击失败:', error.message);
  await page.screenshot({ path: 'error.png' });
  throw error;
}
```

## 🎉 下一步

完成本技能学习后，你可以：

1. ✅ 编写稳定的 E2E 测试用例
2. ✅ 使用 Page Object 模式提高可维护性
3. ✅ 结合 API 和 UI 测试
4. ✅ 进行视觉回归测试
5. ✅ 在多浏览器和多设备上运行测试
6. ✅ 使用 AI 辅助生成测试代码

继续探索更多高级主题：
- 性能测试
- 可访问性测试
- 安全测试
- 自动化测试框架搭建

祝你测试愉快！🚀
