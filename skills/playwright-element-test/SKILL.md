---
name: playwright-element-test
description: Browser automation testing with Playwright MCP for functional testing, element interaction, navigation, and visual verification
version: 1.0.0
---

# Playwright Browser Automation

Automated browser testing using Playwright MCP for functional verification, element interaction, and visual validation.

## When to Use

Use this skill when you need to:
- Open web pages and perform functional verification
- Simulate user interactions: clicks, form inputs, dropdowns, file uploads
- Test page navigation: forward, back, refresh, jumps
- Handle form submissions with validation
- Wait for and verify dynamic content
- Test multi-step workflows: registration, login, shopping, payment
- Capture screenshots and recordings for documentation

## Core Advantages

### 1. Real Browser Operations
True browser control through Playwright MCP:
- 🎯 **What You See Is What You Get**: Full operation visibility (supports headed mode)
- 🚀 **Fast Execution**: Automated repetitive operations for efficiency
- 📹 **Process Recording**: Automatic video and screenshot capture
- 🔍 **Real-time Verification**: Validate expectations at each step

### 2. Rich Operation Types
Supports all common browser operations:
- 👆 **Click**: Regular click, double-click, right-click, hover
- ⌨️ **Input**: Fill text, clear input, shortcuts, combinations
- 📋 **Form**: Dropdown selection, checkboxes, radio buttons
- 📁 **File**: Upload, download
- 🧭 **Navigation**: Open page, forward, back, refresh
- 🔍 **Assertions**: Element visibility, text content, attributes, URL validation

## 环境准备

### 前置要求

确保系统已安装：
- Node.js >= 16.x
- npm >= 8.x 或 pnpm >= 6.x
- Git

### 快速安装

#### 方式一：使用项目现有的自动化测试框架

```bash
# 进入项目根目录
cd c:/work/monorepo-test

# 检查自动化测试配置
npm run app-prepare

# 安装 Playwright 依赖（如果未安装）
npx playwright install --with-deps chromium
```

#### 方式二：独立安装

```bash
# 创建测试项目目录
mkdir -p automated-test/playwright
cd automated-test/playwright

# 初始化项目
npm init -y

# 安装 Playwright
npm install -D @playwright/test

# 安装浏览器
npx playwright install --with-deps chromium

# 安装 Playwright MCP Server（可选，用于 AI 辅助）
npm install -g playwright-mcp-server
```

### 配置文件

创建 `playwright.config.js`（如果不存在）：

```javascript
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  
  // 超时设置
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // 失败重试
  retries: process.env.CI ? 2 : 0,
  
  // 并行执行
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list']
  ],
  
  // 共享配置
  use: {
    // 浏览器上下文
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // 截图策略
    screenshot: 'only-on-failure',
    
    // 视频录制
    video: 'retain-on-failure',
    
    // 追踪录制
    trace: 'retain-on-failure',
    
    // 控制台日志
    contextOptions: {
      logger: {
        isEnabled: (name, severity) => true,
        log: (name, severity, message, args) => {
          console.log(`[${name}] ${severity}: ${message}`, args);
        }
      }
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  outputDir: 'test-results/',
});
```

## 操作步骤

### 步骤 1: 创建功能测试文件

参考以下模板创建功能测试文件：

```javascript
// __tests__/functional-demo.spec.js
const { test, expect } = require('@playwright/test');

test.describe('网页功能测试示例', () => {
  test('打开网页并执行基本操作', async ({ page }) => {
    // 1. 打开目标网页
    await page.goto('https://example.com');
    
    // 2. 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 3. 截图保存当前状态
    await page.screenshot({ path: 'screenshots/step1-initial.png' });
    
    // 4. 验证页面标题
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 5. 查找并点击某个元素
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.click();
      console.log('已点击按钮');
    }
    
    // 6. 再次截图
    await page.screenshot({ path: 'screenshots/step2-after-click.png' });
  });
});
```

### 步骤 2: 实际操作示例 - 表单填写

```javascript
// __tests__/form-interaction.spec.js
const { test, expect } = require('@playwright/test');

test.describe('表单交互测试', () => {
  test('完整的表单填写流程', async ({ page }) => {
    // 打开表单页面
    await page.goto('https://example.com/form');
    
    // 等待表单加载
    await page.waitForSelector('form');
    
    // 填写文本输入框
    await page.fill('[name="username"]', '张三');
    await page.fill('[name="email"]', 'zhangsan@example.com');
    
    // 选择下拉框
    await page.selectOption('select[name="country"]', 'CN');
    
    // 勾选复选框
    await page.check('input[name="agree"]');
    
    // 选择单选按钮
    await page.check('input[value="male"]');
    
    // 上传文件
    await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 等待提交结果
    await page.waitForLoadState('networkidle');
    
    // 验证提交成功
    const successMessage = page.locator('.success-message');
    await expect(successMessage).toBeVisible();
    
    // 截图保存
    await page.screenshot({ path: 'screenshots/form-submitted.png' });
  });
});
```

### 步骤 3: 多步骤流程测试

```javascript
// __tests__/multi-step-flow.spec.js
const { test, expect } = require('@playwright/test');

test.describe('多步骤操作流程', () => {
  test('完整的购物流程', async ({ page }) => {
    // 步骤 1: 打开商城首页
    await page.goto('https://example-shop.com');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/flow-01-homepage.png' });
    
    // 步骤 2: 搜索商品
    await page.fill('#search-input', '手机');
    await page.click('#search-button');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/flow-02-search-results.png' });
    
    // 步骤 3: 选择第一个商品
    const firstProduct = page.locator('.product-item').first();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/flow-03-product-detail.png' });
    
    // 步骤 4: 添加到购物车
    await page.click('#add-to-cart-btn');
    await page.waitForSelector('.cart-badge');
    await page.screenshot({ path: 'screenshots/flow-04-added-to-cart.png' });
    
    // 步骤 5: 打开购物车
    await page.click('.cart-icon');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/flow-05-cart-page.png' });
    
    // 步骤 6: 结算
    await page.click('#checkout-btn');
    await page.waitForLoadState('networkidle');
    
    // 步骤 7: 填写收货信息
    await page.fill('#address', '北京市朝阳区 xx 街道');
    await page.fill('#phone', '13800138000');
    
    // 步骤 8: 提交订单
    await page.click('#submit-order-btn');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/flow-06-order-success.png' });
    
    // 验证订单提交成功
    const successTitle = page.locator('.success-title');
    await expect(successTitle).toContainText('订单提交成功');
  });
});
```

### 步骤 4: 导航和浏览器控制

```javascript
// __tests__/navigation-control.spec.js
const { test, expect } = require('@playwright/test');

test.describe('浏览器导航控制', () => {
  test('前进、后退、刷新操作', async ({ page }) => {
    // 打开第一个页面
    await page.goto('https://example.com/page1');
    await page.waitForLoadState('networkidle');
    console.log('当前 URL:', page.url());
    
    // 点击链接跳转到第二个页面
    await page.click('a[href="/page2"]');
    await page.waitForLoadState('networkidle');
    console.log('跳转后 URL:', page.url());
    
    // 浏览器后退
    await page.goBack();
    await page.waitForLoadState('networkidle');
    console.log('后退后 URL:', page.url());
    
    // 浏览器前进
    await page.goForward();
    await page.waitForLoadState('networkidle');
    console.log('前进后 URL:', page.url());
    
    // 刷新页面
    await page.reload();
    await page.waitForLoadState('networkidle');
    console.log('刷新后 URL:', page.url());
  });
});
```

### 步骤 5: 动态内容处理

```javascript
// __tests__/dynamic-content.spec.js
const { test, expect } = require('@playwright/test');

test.describe('动态内容加载测试', () => {
  test('等待异步数据加载', async ({ page }) => {
    await page.goto('https://example.com/dashboard');
    
    // 方法 1: 等待特定元素出现
    await page.waitForSelector('.data-loaded', { state: 'visible', timeout: 10000 });
    
    // 方法 2: 等待文本内容出现
    await page.waitForFunction(() => {
      return document.body.innerText.includes('加载完成');
    }, { timeout: 10000 });
    
    // 方法 3: 等待网络请求完成
    await page.waitForLoadState('networkidle');
    
    // 方法 4: 等待特定的 API 响应
    const [response] = await Promise.all([
      page.waitForResponse('/api/data'),
      page.click('#load-data-btn')
    ]);
    const data = await response.json();
    console.log('加载的数据:', data);
    
    // 验证数据已显示
    const dataList = page.locator('.data-list');
    await expect(dataList).not.toBeEmpty();
    
    await page.screenshot({ path: 'screenshots/data-loaded.png' });
  });
});
```

### 步骤 6: 常用操作速查表

#### 点击操作
```javascript
// 普通点击
await page.click('button');

// 双击
await page.dblclick('button');

// 右键点击
await page.click('button', { button: 'right' });

// 悬停（鼠标移入）
await page.hover('button');

// 带延迟的点击
await page.click('button', { delay: 100 });
```

#### 输入操作
```javascript
// 填充文本
await page.fill('input[name="username"]', '张三');

// 清空输入框
await page.fill('input[name="username"]', '');

// 追加文本（不删除原有内容）
await page.type('textarea', '追加的内容');

// 按 Enter 键
await page.press('input', 'Enter');

// 组合键（Ctrl+A）
await page.press('input', 'Control+A');
```

#### 选择框操作
```javascript
// 通过值选择
await page.selectOption('select#country', 'CN');

// 通过文本选择
await page.selectOption('select#city', { label: '北京' });

// 多选
await page.selectOption('select#hobbies', ['reading', 'music']);
```

#### 复选框和单选
```javascript
// 勾选
await page.check('input[type="checkbox"]');

// 取消勾选
await page.uncheck('input[type="checkbox"]');

// 判断是否已勾选
const isChecked = await page.isChecked('input[type="checkbox"]');
```

#### 文件操作
```javascript
// 上传单个文件
await page.setInputFiles('input[type="file"]', 'file.pdf');

// 上传多个文件
await page.setInputFiles('input[type="file"]', ['file1.pdf', 'file2.jpg']);

// 下载文件
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#download-btn')
]);
await download.saveAs('./downloads/file.pdf');
```

#### 弹窗处理
```javascript
// 处理 alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept(); // 或 dialog.dismiss()
});
await page.click('#show-alert-btn');

// 处理新窗口
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('#open-new-window')
]);
await newPage.waitForLoadState();
console.log('新窗口 URL:', newPage.url());
```

#### iframe 操作
```javascript
// 获取 iframe
const frame = page.frame({ name: 'iframe-name' });
// 或
const frame = page.frame({ url: /iframe-url/ });

// 在 iframe 中操作
await frame.fill('input[name="username"]', 'test');
await frame.click('#submit-btn');
```

#### 截图和录像
```javascript
// 全屏截图
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// 指定区域截图
await page.screenshot({ 
  path: 'clip.png',
  clip: { x: 100, y: 200, width: 800, height: 600 }
});

// 元素截图
await page.locator('#chart').screenshot({ path: 'chart.png' });
```

### 步骤 7: 实际使用示例

#### 示例 1: 测试登录功能
```javascript
test('登录功能测试', async ({ page }) => {
  // 打开登录页
  await page.goto('https://example.com/login');
  
  // 填写用户名和密码
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  
  // 勾选记住我
  await page.check('#remember-me');
  
  // 点击登录按钮
  await page.click('#login-btn');
  
  // 等待跳转
  await page.waitForLoadState('networkidle');
  
  // 验证登录成功
  await expect(page).toHaveURL(/\/dashboard/);
  const welcomeMsg = page.locator('.welcome-message');
  await expect(welcomeMsg).toContainText('欢迎，testuser');
  
  // 截图
  await page.screenshot({ path: 'screenshots/logged-in.png' });
});
```

#### 示例 2: 搜索和筛选
```javascript
test('商品搜索和筛选', async ({ page }) => {
  await page.goto('https://example-shop.com');
  
  // 搜索
  await page.fill('#search', '笔记本电脑');
  await page.press('#search', 'Enter');
  await page.waitForLoadState('networkidle');
  
  // 筛选价格
  await page.fill('#min-price', '3000');
  await page.fill('#max-price', '5000');
  await page.click('#filter-btn');
  await page.waitForLoadState('networkidle');
  
  // 排序
  await page.selectOption('#sort', 'price-asc');
  await page.waitForLoadState('networkidle');
  
  // 验证第一个商品价格最低
  const prices = await page.locator('.price').allTextContents();
  console.log('价格列表:', prices);
  
  await page.screenshot({ path: 'screenshots/search-results.png' });
});
```

Element Source 帮助你找到最佳的元素定位方式：

```javascript
// __tests__/element-locator.spec.js
const { test, expect } = require('@playwright/test');

test('使用多种定位策略', async ({ page }) => {
  await page.goto('/login');

  // 策略 1: 优先使用 data-testid（最稳定）
  const usernameInput = page.getByTestId('username-input');
  await usernameInput.fill('test@example.com');

  // 策略 2: 使用 ARIA role（语义化）
  const submitButton = page.getByRole('button', { name: '登录' });
  await submitButton.click();

  // 策略 3: 使用 label 关联
  const passwordInput = page.getByLabel('密码');
  await passwordInput.fill('password123');

  // 策略 4: 使用 placeholder
  const emailInput = page.getByPlaceholder('请输入邮箱');
  await emailInput.fill('test@example.com');

  // 策略 5: 使用文本内容
  const link = page.getByText('忘记密码？').first();
  await link.click();

  // 验证导航
  await expect(page).toHaveURL(/.*forgot-password/);
});
```

### 步骤 3: 运行测试

#### 基础运行命令

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test __tests__/example.spec.js

# 运行特定测试用例
npx playwright test -g "应该成功加载首页"

# 在特定浏览器上运行
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

#### 调试模式

```bash
# 有头模式（可以看到浏览器操作过程）
npx playwright test --debug

# 有头模式 + 特定测试
npx playwright test __tests__/example.spec.js --debug

# 使用 Playwright Inspector
PWDEBUG=1 npx playwright test
```

#### UI 模式（推荐用于交互式开发）

```bash
# 启动 UI 模式
npx playwright test --ui

# 指定端口
npx playwright test --ui-host=localhost --ui-port=9323
```

### 步骤 4: 捕获和分析结果

#### 截图和录像

```javascript
// __tests__/screenshot.spec.js
const { test, expect } = require('@playwright/test');

test('捕获测试截图', async ({ page }, testInfo) => {
  await page.goto('/dashboard');
  
  // 完整页面截图
  await page.screenshot({ 
    path: `screenshots/dashboard-${testInfo.title}.png`,
    fullPage: true 
  });
  
  // 特定元素截图
  const chart = page.locator('#main-chart');
  await chart.screenshot({ 
    path: `screenshots/chart-${testInfo.title}.png` 
  });
  
  // 验证截图已保存
  expect(await page.screenshot()).toBeTruthy();
});
```

#### 控制台日志捕获

```javascript
// __tests__/console-log.spec.js
const { test, expect } = require('@playwright/test');

test('捕获控制台日志', async ({ page }) => {
  const logs = [];
  
  // 监听控制台事件
  page.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  // 监听页面错误
  page.on('pageerror', error => {
    logs.push({
      type: 'error',
      text: error.message
    });
  });
  
  await page.goto('/');
  
  // 触发某些操作
  await page.click('[data-testid="action-button"]');
  
  // 验证没有错误日志
  const errors = logs.filter(log => log.type === 'error');
  expect(errors).toHaveLength(0);
  
  // 输出所有日志（用于调试）
  console.log('页面日志:', JSON.stringify(logs, null, 2));
});
```

### 步骤 5: 使用 Playwright MCP 进行 AI 辅助测试

如果你安装了 Playwright MCP Server，可以使用 AI 辅助生成测试：

```bash
# 启动 MCP Server
npx playwright-mcp-server

# 或在 Claude/Copilot 中配置 MCP
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["playwright-mcp-server"]
    }
  }
}
```

然后在对话中使用自然语言描述测试需求：
- "为登录页面创建一个完整的测试流程"
- "测试购物车的添加和删除功能"
- "检查响应式设计在不同设备上的表现"

## 高级用法

### 1. Page Object 模式

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByRole('button', { name: '登录' });
    this.errorMessage = page.getByText('用户名或密码错误');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };
```

```javascript
// __tests__/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('登录功能', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('成功登录', async ({ page }) => {
    await loginPage.login('valid_user', 'valid_password');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('失败登录 - 无效密码', async () => {
    await loginPage.login('valid_user', 'wrong_password');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('密码错误');
  });
});
```

### 2. API 测试 + UI 测试组合

```javascript
// __tests__/api-ui-combo.spec.js
const { test, expect } = require('@playwright/test');

test('API 准备数据 + UI 验证', async ({ page, request }) => {
  // 通过 API 创建测试数据
  const response = await request.post('/api/users', {
    data: {
      username: 'test_user',
      email: 'test@example.com',
      password: 'password123'
    }
  });
  
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  
  // 使用创建的数据进行 UI 测试
  await page.goto('/login');
  await page.getByTestId('username-input').fill(user.username);
  await page.getByTestId('password-input').fill('password123');
  await page.getByRole('button', { name: '登录' }).click();
  
  // 验证登录成功
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(`欢迎，${user.username}`)).toBeVisible();
});
```

### 3. 视觉回归测试

```javascript
// __tests__/visual-regression.spec.js
const { test, expect } = require('@playwright/test');

test('首页视觉回归测试', async ({ page }) => {
  await page.goto('/');
  
  // 等待所有内容加载完成
  await page.waitForLoadState('networkidle');
  
  // 截图并与基准对比
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // 允许的最大差异像素数
    fullPage: true
  });
});
```

### 4. 性能测试

```javascript
// __tests__/performance.spec.js
const { test, expect } = require('@playwright/test');

test('页面加载性能测试', async ({ page }) => {
  // 启用性能监控
  await page.route('**/*', route => {
    route.continue();
  });
  
  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;
  
  // 验证加载时间
  expect(loadTime).toBeLessThan(3000); // 3 秒内加载完成
  
  // 检查 Lighthouse 指标（需要安装插件）
  const metrics = await page.metrics();
  console.log('JS Heap Size:', metrics.JSHeapUsedSize);
});
```

## 常见问题与解决方案

### Q1: 元素定位失败

**问题**: `Error: locator.click: Timeout 30000ms exceeded`

**解决方案**:
```javascript
// 1. 等待元素可见
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();

// 2. 使用更稳定的选择器
await page.getByTestId('submit-btn').click(); // 推荐
await page.getByRole('button', { name: '提交' }).click();

// 3. 增加超时时间
await page.locator('button').click({ timeout: 60000 });
```

### Q2: 动态内容处理

**问题**: 页面内容异步加载，测试不稳定

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

### Q3: iframe 处理

**问题**: 无法定位 iframe 内的元素

**解决方案**:
```javascript
// 获取 iframe frame
const frame = page.frame({ name: 'iframe-name' });
// 或
const frame = page.frame({ url: /iframe-url/ });

// 在 frame 中操作
await frame.locator('button').click();
```

### Q4: 文件上传下载

**问题**: 如何处理文件上传和下载

**解决方案**:
```javascript
// 文件上传
await page.locator('input[type="file"]').setInputFiles([
  {
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('test content')
  }
]);

// 文件下载
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('[data-testid="download-btn"]')
]);
const filePath = await download.path();
console.log('文件下载到:', filePath);
```

## 最佳实践

### 1. 元素定位优先级

按照以下优先级选择元素定位策略：
1. ✅ `getByTestId()` - 最稳定，不受 UI 变更影响
2. ✅ `getByRole()` - 语义化，符合无障碍标准
3. ✅ `getByLabel()` / `getByPlaceholder()` - 表单元素专用
4. ✅ `getByText()` - 文本内容匹配
5. ⚠️ CSS 选择器 - 仅在上述方法不可用时使用
6. ❌ XPath - 尽量避免，维护成本高

### 2. 测试数据管理

```javascript
// 使用 fixtures 创建测试数据
test.use({
  userData: async ({}, use) => {
    // 创建测试数据
    const user = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    await use(user);
    
    // 清理测试数据
    // await cleanupUser(user);
  }
});
```

### 3. 测试隔离

```javascript
// 每个测试使用独立的浏览器上下文
test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  // 每个测试前重置状态
  await page.context().clearCookies();
  await page.goto('/');
});
```

### 4. 有意义的测试名称

```javascript
// ❌ 不好的命名
test('测试 1', async () => {});

// ✅ 好的命名
test('用户输入正确的用户名和密码后应该成功登录', async () => {});
```

## 在项目中的使用

### 结合现有自动化测试框架

本项目已有自动化测试框架位于 `automated-test` 目录，可以通过以下方式集成：

```bash
# 运行现有的自动化测试
cd automated-test
npm test

# 或使用项目根目录的命令
npm run test
```

### 创建新的 Playwright测试

```bash
# 在 automated-test 目录下创建 Playwright测试
mkdir -p automated-test/__tests__/playwright
touch automated-test/__tests__/playwright/example.spec.js
```

### 配置 CI/CD

在 `.github/workflows/test.yml` 中添加：

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm ci
          npx playwright install --with-deps chromium
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 相关资源

- 📚 [Playwright 官方文档](https://playwright.dev/)
- 🔧 [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- 🎯 [Element Source 最佳实践](https://testing-library.com/docs/queries/about)
- 📖 [自动化测试模式](https://martinfowler.com/articles/practical-test-pyramid.html)

## 故障排除

### 常见问题

1. **浏览器无法启动**
   ```bash
   # 重新安装浏览器
   npx playwright install --force chromium
   ```

2. **依赖冲突**
   ```bash
   # 清理并重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **测试超时**
   ```javascript
   // 在配置文件中增加超时
   module.exports = {
     timeout: 60000,
     expect: { timeout: 10000 }
   };
   ```

## 总结

本技能提供了完整的 Playwright + Element Source 自动化测试解决方案，通过遵循本文档的最佳实践和指南，你可以：

- ✅ 快速搭建稳定的自动化测试框架
- ✅ 编写可维护的测试用例
- ✅ 使用 AI 辅助提高测试开发效率
- ✅ 实现持续集成和部署

如有问题或建议，欢迎反馈！
