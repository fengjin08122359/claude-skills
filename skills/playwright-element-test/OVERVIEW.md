# 🎯 功能测试 Skill - 完整使用指南

## 📦 技能概览

本技能位于 `.kilocode/skills/playwright-element-test/`，是一个专注于**网页功能测试**的完整解决方案。

### 核心定位
- ✅ **打开任意网页链接**进行功能验证
- ✅ **模拟真实用户操作**：点击、输入、选择、上传等
- ✅ **多步骤流程测试**：登录、注册、购物、支付等
- ✅ **实时截图录像**：记录完整的操作过程
- ✅ **快速上手**：5 分钟即可开始编写测试

## 📁 完整目录结构

```
playwright-element-test/
│
├── 📘 QUICKSTART.md          # ⭐ 快速入门（5 分钟上手）
├── 📖 README.md              # 📖 项目说明和快速参考
├── 📚 SKILL.md               # 📚 完整技能文档（详细教程）
├── 📝 USAGE.md               # 💡 使用技巧和最佳实践
│
├── 📦 package.json           # npm 依赖配置
├── ⚙️ playwright.config.js   # Playwright 配置文件
├── 🔧 global-setup.js        # 全局设置脚本
├── 🧹 global-teardown.js     # 全局清理脚本
├── 🚫 .gitignore             # Git 忽略规则
│
├── 📂 pages/                 # Page Object 页面对象（可选）
│   └── LoginPage.js          # 登录页面对象示例
│
└── 📂 __tests__/             # 测试示例文件
    ├── quick-start.spec.js       # ⭐ 快速入门示例（10 个简单案例）
    ├── functional-demo.spec.js   # ⭐ 功能演示示例（8 个实战案例）
    ├── example.spec.js           # 基础功能测试示例
    ├── element-locator.spec.js   # 元素定位策略示例
    ├── login.spec.js             # Page Object 模式示例
    └── api-ui-combo.spec.js      # API+UI 组合测试示例
```

## 🚀 快速开始（3 步走）

### 第一步：安装
```bash
cd c:/work/monorepo-test/.kilocode/skills/playwright-element-test
npm install
npx playwright install chromium
```

### 第二步：运行示例
```bash
# 新手推荐：运行快速入门测试
npm run test:quick

# 运行功能演示测试
npm run test:functional
```

### 第三步：创建自己的测试
参考 `__tests__/quick-start.spec.js` 或 `__tests__/functional-demo.spec.js` 创建你的第一个测试！

## 🎯 核心功能特性

### 1. 真实的浏览器操作 👆

支持所有常见的用户交互：

#### 点击操作
```javascript
// 普通点击
await page.click('button');

// 双击
await page.dblclick('button');

// 右键
await page.click('button', { button: 'right' });

// 悬停
await page.hover('button');
```

#### 输入操作
```javascript
// 填写文本
await page.fill('input[name="username"]', '张三');

// 清空输入
await page.fill('input[name="username"]', '');

// 按 Enter 键
await page.press('input', 'Enter');

// 组合键 Ctrl+A
await page.press('input', 'Control+A');
```

#### 表单操作
```javascript
// 选择下拉框
await page.selectOption('select#city', 'beijing');

// 勾选复选框
await page.check('input[type="checkbox"]');

// 取消勾选
await page.uncheck('input[type="checkbox"]');

// 选择单选按钮
await page.check('input[value="male"]');
```

#### 文件操作
```javascript
// 上传文件
await page.setInputFiles('input[type="file"]', 'document.pdf');

// 下载文件
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#download-btn')
]);
await download.saveAs('./downloads/file.pdf');
```

### 2. 页面导航控制 🧭

```javascript
// 打开网页
await page.goto('https://example.com');

// 浏览器后退
await page.goBack();

// 浏览器前进
await page.goForward();

// 刷新页面
await page.reload();

// 打开新标签页
const newPage = await page.waitForEvent('popup');
await page.evaluate(() => window.open('https://example.com/about'));
```

### 3. 动态内容处理 ⏳

```javascript
// 等待元素出现
await page.waitForSelector('.content', { timeout: 10000 });

// 等待文本出现
await page.waitForFunction(() => {
  return document.body.innerText.includes('加载完成');
});

// 等待网络请求完成
await page.waitForLoadState('networkidle');

// 等待特定 API 响应
const [response] = await Promise.all([
  page.waitForResponse('/api/data'),
  page.click('#load-btn')
]);
```

### 4. 信息获取 📊

```javascript
// 获取页面标题
const title = await page.title();

// 获取当前 URL
const url = page.url();

// 获取元素文本
const text = await page.textContent('h1');

// 获取元素属性
const value = await page.getAttribute('input', 'value');

// 统计元素数量
const count = await page.locator('a').count();
```

### 5. 断言验证 ✅

```javascript
// 验证元素可见
await expect(page.locator('h1')).toBeVisible();

// 验证文本包含
await expect(page.locator('p')).toContainText('重要信息');

// 验证 URL
expect(page.url()).toContain('/success');

// 验证元素数量
expect(await page.locator('li').count()).toBe(5);
```

### 6. 截图和录像 📹

```javascript
// 全屏截图
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// 元素截图
await page.locator('#header').screenshot({ path: 'header.png' });

// 指定区域截图
await page.screenshot({ 
  path: 'clip.png',
  clip: { x: 100, y: 200, width: 800, height: 600 }
});
```

## 📚 学习路径推荐

### 🟢 零基础入门（30 分钟）

1. **阅读快速入门** [`QUICKSTART.md`](./QUICKSTART.md) (5 分钟)
2. **运行快速入门测试** (5 分钟)
   ```bash
   npm run test:quick
   ```
3. **查看示例代码** [`__tests__/quick-start.spec.js`](./__tests__/quick-start.spec.js) (10 分钟)
4. **修改并运行自己的第一个测试** (10 分钟)

### 🟡 初级进阶（1-2 小时）

1. **阅读功能演示** [`__tests__/functional-demo.spec.js`](./__tests__/functional-demo.spec.js)
2. **运行功能演示测试**
   ```bash
   npm run test:functional
   ```
3. **学习常用操作速查表** (参考 SKILL.md)
4. **尝试实际场景示例** (登录、搜索、表单提交等)

### 🔵 中级提升（半天）

1. **精读完整技能文档** [`SKILL.md`](./SKILL.md)
2. **学习 Page Object 模式** [`pages/LoginPage.js`](./pages/LoginPage.js)
3. **掌握动态内容处理** (等待、异步、iframe 等)
4. **了解调试技巧** (有头模式、调试模式、日志捕获)

### 🟣 高级应用（1-2 天）

1. **API + UI 组合测试** [`__tests__/api-ui-combo.spec.js`](./__tests__/api-ui-combo.spec.js)
2. **多步骤流程测试** (购物、支付等复杂场景)
3. **性能测试和视觉回归测试**
4. **建立完整的测试框架**

## 🎓 实战示例精选

### 示例 1: 百度搜索测试
```javascript
test('百度搜索测试', async ({ page }) => {
  // 打开百度
  await page.goto('https://www.baidu.com');
  
  // 输入搜索词
  await page.fill('#kw', 'Playwright 自动化测试');
  
  // 点击搜索
  await page.click('#su');
  
  // 等待结果
  await page.waitForLoadState('networkidle');
  
  // 截图
  await page.screenshot({ path: 'baidu-search.png' });
  
  // 验证结果
  const results = page.locator('.result');
  const count = await results.count();
  console.log(`找到 ${count} 条结果`);
  expect(count).toBeGreaterThan(0);
});
```

### 示例 2: 网站登录测试
```javascript
test('网站登录测试', async ({ page }) => {
  // 打开登录页
  await page.goto('https://example.com/login');
  
  // 填写用户名
  await page.fill('#username', 'testuser');
  
  // 填写密码
  await page.fill('#password', 'password123');
  
  // 勾选记住我
  await page.check('#remember-me');
  
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

### 示例 3: 表单提交流程
```javascript
test('联系表单提交', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  // 填写姓名
  await page.fill('[name="name"]', '张三');
  
  // 填写邮箱
  await page.fill('[name="email"]', 'zhangsan@example.com');
  
  // 填写电话
  await page.fill('[name="phone"]', '13800138000');
  
  // 填写留言
  await page.fill('[name="message"]', '您好，我想咨询...');
  
  // 勾选同意
  await page.check('#agree-terms');
  
  // 提交
  await page.click('#submit-btn');
  
  // 等待成功提示
  await page.waitForSelector('.success-message');
  
  // 验证
  await expect(page.locator('.success-message')).toBeVisible();
  
  // 截图
  await page.screenshot({ path: 'form-submitted.png' });
});
```

## 🔍 常用命令速查

```bash
# 运行测试
npm test                    # 运行所有测试
npm run test:quick         # 运行快速入门测试
npm run test:functional    # 运行功能演示测试

# 调试相关
npm run test:debug         # 调试模式
npm run test:ui            # UI 界面模式
npm run test:headed        # 有头模式（看浏览器）

# 特定浏览器
npm run test:chromium      # Chromium 浏览器
npm run test:firefox       # Firefox 浏览器
npm run test:webkit        # WebKit 浏览器

# 其他
npm run test:report        # 查看测试报告
npm run install:browsers   # 安装所有浏览器
```

## 💡 最佳实践建议

### 1. 从简单开始
先运行 `quick-start.spec.js`，理解基础后再尝试复杂示例

### 2. 使用有头模式
学习和调试时使用 `--headed` 参数，可以看到实际操作过程

### 3. 添加充分注释
在测试代码中添加注释，说明每一步的目的

### 4. 及时截图保存
关键步骤后截图，便于问题排查
```javascript
await page.screenshot({ path: 'step1-homepage.png' });
```

### 5. 使用有意义的命名
```javascript
// ❌ 不好的命名
test('测试 1', async () => {});

// ✅ 好的命名
test('用户使用正确的用户名密码应该成功登录', async () => {});
```

### 6. 添加日志输出
```javascript
console.log('正在打开登录页面...');
console.log('已填写用户名');
console.log('准备提交表单...');
```

## ⚠️ 常见问题

### Q1: 浏览器无法启动
```bash
# 重新安装浏览器
npx playwright install --force chromium
```

### Q2: 元素找不到或超时
```javascript
// 增加等待时间
await page.waitForSelector('button', { timeout: 10000 });

// 或使用有头模式查看实际情况
npx playwright test my-test.js --headed
```

### Q3: 页面加载太慢
```javascript
// 增加超时时间
await page.goto('https://slow-site.com', { 
  timeout: 60000,
  waitUntil: 'networkidle' 
});
```

### Q4: 如何测试本地 HTML 文件？
```javascript
await page.goto('file:///C:/Users/YourName/Desktop/test.html');
```

## 📖 文档索引

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | 5 分钟快速上手 | 所有人 |
| [README.md](./README.md) | 项目说明 | 第一次使用 |
| [SKILL.md](./SKILL.md) | 完整教程 | 系统学习 |
| [USAGE.md](./USAGE.md) | 使用技巧 | 进阶提升 |
| [__tests__/quick-start.spec.js](./__tests__/quick-start.spec.js) | 入门示例 | 初学者 |
| [__tests__/functional-demo.spec.js](./__tests__/functional-demo.spec.js) | 实战示例 | 有一定基础 |

## 🎉 总结

本技能提供：

✅ **完整的网页功能测试解决方案**  
✅ **从零开始的详细教程**  
✅ **丰富的实战示例代码**  
✅ **常用的操作速查表**  
✅ **调试技巧和问题解答**  

立即开始你的功能测试之旅吧！🚀

---

**位置**: `c:/work/monorepo-test/.kilocode/skills/playwright-element-test/`  
**版本**: 1.0.0  
**最后更新**: 2026-03-23
