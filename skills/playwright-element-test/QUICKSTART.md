# 🚀 功能测试快速上手指南

## 5 分钟开始你的第一个功能测试

### 步骤 1: 安装（1 分钟）

```bash
# 进入技能目录
cd c:/work/monorepo-test/.kilocode/skills/playwright-element-test

# 安装依赖
npm install

# 安装浏览器（只需要第一次执行）
npx playwright install chromium
```

### 步骤 2: 运行第一个测试（1 分钟）

```bash
# 运行快速入门测试
npm run test:quick
```

你会看到类似这样的输出：
```
Running 10 tests using 1 worker

  ✓  __tests__/quick-start.spec.js (1) 最简单的测试：打开网页并截图 (523ms)
  ✓  __tests__/quick-start.spec.js (2) 点击按钮 (412ms)
  ✓  __tests__/quick-start.spec.js (3) 填写简单表单 (634ms)
  ...

  10 passed (3.2s)
```

### 步骤 3: 查看测试结果（1 分钟）

测试完成后，会在 `screenshots/` 目录下看到生成的截图：

```bash
# 查看截图（Windows）
explorer screenshots

# 或在 macOS/Linux 中用文件管理器打开
```

### 步骤 4: 修改并运行自己的测试（2 分钟）

创建你自己的测试文件 `my-first-test.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('我的第一个测试', () => {
  test('打开百度并搜索', async ({ page }) => {
    // 1. 打开百度
    await page.goto('https://www.baidu.com');
    
    // 2. 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 3. 在搜索框输入内容
    await page.fill('#kw', 'Playwright 自动化测试');
    
    // 4. 点击搜索按钮
    await page.click('#su');
    
    // 5. 等待搜索结果
    await page.waitForLoadState('networkidle');
    
    // 6. 截图
    await page.screenshot({ path: 'screenshots/my-search.png' });
    
    // 7. 验证有搜索结果
    const results = page.locator('.result');
    const count = await results.count();
    console.log(`找到 ${count} 条搜索结果`);
    
    // 8. 显示第一条结果标题
    if (count > 0) {
      const firstTitle = await results.first().locator('h3').textContent();
      console.log('第一条结果:', firstTitle);
    }
  });
});
```

运行你的测试：

```bash
# 运行你的测试
npx playwright test my-first-test.js

# 或者用有头模式（可以看到浏览器操作过程）
npx playwright test my-first-test.js --headed
```

## 📝 常用操作速查表

### 打开网页
```javascript
await page.goto('https://example.com');
```

### 点击元素
```javascript
// 点击按钮
await page.click('button');

// 点击链接
await page.click('a[href="/about"]');

// 点击特定文本的按钮
await page.click('text=提交');
```

### 填写表单
```javascript
// 填写文本框
await page.fill('input[name="username"]', '张三');

// 清空输入框
await page.fill('input[name="username"]', '');

// 选择下拉框
await page.selectOption('select#city', 'beijing');

// 勾选复选框
await page.check('input[type="checkbox"]');
```

### 获取信息
```javascript
// 获取页面标题
const title = await page.title();

// 获取元素文本
const text = await page.textContent('h1');

// 获取元素属性
const value = await page.getAttribute('input', 'value');
```

### 验证断言
```javascript
// 验证元素可见
await expect(page.locator('h1')).toBeVisible();

// 验证文本包含
await expect(page.locator('p')).toContainText('重要信息');

// 验证 URL
expect(page.url()).toContain('/success');
```

### 截图和录像
```javascript
// 全屏截图
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// 元素截图
await page.locator('#header').screenshot({ path: 'header.png' });
```

## 🎯 实际应用场景示例

### 场景 1: 测试网站登录
```javascript
test('测试网站登录', async ({ page }) => {
  // 打开登录页
  await page.goto('https://example.com/login');
  
  // 填写用户名和密码
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  
  // 点击登录
  await page.click('#login-btn');
  
  // 等待跳转
  await page.waitForLoadState('networkidle');
  
  // 验证登录成功
  await expect(page).toHaveURL(/\/dashboard/);
  
  // 截图
  await page.screenshot({ path: 'logged-in.png' });
});
```

### 场景 2: 搜索商品并筛选
```javascript
test('搜索和筛选商品', async ({ page }) => {
  await page.goto('https://shop.example.com');
  
  // 搜索
  await page.fill('#search', '手机');
  await page.press('#search', 'Enter');
  await page.waitForLoadState('networkidle');
  
  // 筛选价格
  await page.fill('#min-price', '1000');
  await page.fill('#max-price', '3000');
  await page.click('#filter-btn');
  await page.waitForLoadState('networkidle');
  
  // 验证结果
  const products = page.locator('.product');
  const count = await products.count();
  console.log(`找到 ${count} 个商品`);
  
  // 截图
  await page.screenshot({ path: 'products.png' });
});
```

### 场景 3: 填写并提交表单
```javascript
test('填写联系表单', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  // 填写信息
  await page.fill('[name="name"]', '张三');
  await page.fill('[name="email"]', 'zhangsan@example.com');
  await page.fill('[name="phone"]', '13800138000');
  await page.fill('[name="message"]', '您好，我想咨询...');
  
  // 勾选同意条款
  await page.check('#agree-terms');
  
  // 提交
  await page.click('#submit-btn');
  
  // 等待提交成功
  await page.waitForSelector('.success-message');
  
  // 验证
  await expect(page.locator('.success-message')).toBeVisible();
  
  // 截图
  await page.screenshot({ path: 'form-submitted.png' });
});
```

## 🔍 调试技巧

### 1. 使用有头模式
```bash
# 真实打开浏览器，可以看到所有操作
npx playwright test my-test.js --headed
```

### 2. 使用调试模式
```bash
# 逐步执行，可以检查每步的结果
npx playwright test my-test.js --debug
```

### 3. 添加日志输出
```javascript
test('调试示例', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 打印页面标题
  const title = await page.title();
  console.log('页面标题:', title);
  
  // 打印当前 URL
  console.log('当前 URL:', page.url());
  
  // 统计元素数量
  const links = page.locator('a');
  const count = await links.count();
  console.log('链接数量:', count);
});
```

### 4. 监听控制台事件
```javascript
test('捕获页面日志', async ({ page }) => {
  // 监听页面 console.log
  page.on('console', msg => {
    console.log(`[页面日志] ${msg.type()}: ${msg.text()}`);
  });
  
  await page.goto('https://example.com');
  
  // 执行可能产生日志的操作
  await page.evaluate(() => {
    console.log('这是页面内的日志');
  });
});
```

## ⚡ 常见问题

### Q1: 如何测试本地 HTML 文件？
```javascript
test('测试本地文件', async ({ page }) => {
  await page.goto('file:///C:/Users/YourName/Desktop/test.html');
  // 或
  await page.goto('file:///home/user/test.html');
});
```

### Q2: 如何处理慢速页面？
```javascript
test('慢速页面处理', async ({ page }) => {
  // 增加超时时间
  await page.goto('https://slow-page.com', { 
    timeout: 60000,  // 60 秒
    waitUntil: 'networkidle' 
  });
});
```

### Q3: 如何等待特定元素？
```javascript
test('等待元素', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 等待元素出现
  await page.waitForSelector('.loaded-content', {
    state: 'visible',
    timeout: 10000
  });
  
  console.log('元素已加载');
});
```

### Q4: 如何在测试过程中暂停？
```javascript
test('手动控制节奏', async ({ page }) => {
  await page.goto('https://example.com');
  
  // 暂停 2 秒
  await page.waitForTimeout(2000);
  
  // 继续操作
  await page.click('button');
});
```

## 🎓 下一步

完成快速入门后，你可以：

1. ✅ 查看 [`__tests__/functional-demo.spec.js`](./__tests__/functional-demo.spec.js) 了解更多实际示例
2. ✅ 阅读 [SKILL.md](./SKILL.md) 学习完整的功能测试指南
3. ✅ 尝试修改现有测试，适配你的实际需求
4. ✅ 为你的项目编写专属的功能测试用例

## 📚 更多资源

- **快速入门测试**: [`__tests__/quick-start.spec.js`](./__tests__/quick-start.spec.js)
- **功能演示测试**: [`__tests__/functional-demo.spec.js`](./__tests__/functional-demo.spec.js)
- **完整技能文档**: [SKILL.md](./SKILL.md)
- **Playwright 官方文档**: https://playwright.dev/

祝你使用愉快！🚀
