// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright测试配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // 测试目录
  testDir: './__tests__',

  // 超时设置
  timeout: 30 * 1000,          // 单个测试超时 30 秒
  expect: {
    timeout: 5000              // 断言超时 5 秒
  },

  // 失败重试配置
  retries: process.env.CI ? 2 : 0,  // CI 环境重试 2 次

  // 并行执行配置
  workers: process.env.CI ? 1 : undefined,  // CI 使用单 worker

  // 报告器配置
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list', { printSteps: true }],
    ['junit', { outputFile: 'junit-results.xml' }]
  ],

  // 全局共享配置
  use: {
    // 基础 URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // 浏览器上下文
    viewport: { width: 1920, height: 1080 },

    // 截图策略
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    // 视频录制策略
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    },

    // 追踪录制策略
    trace: 'retain-on-failure',

    // 动作超时
    actionTimeout: 10000,

    // 导航超时
    navigationTimeout: 30000,

    // 控制台日志捕获
    contextOptions: {
      logger: {
        isEnabled: (name, severity) => true,
        log: (name, severity, message, args) => {
          console.log(`[${name}] ${severity}: ${message}`, args);
        }
      }
    }
  },

  // 测试项目配置（多浏览器/多设备）
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // 移动设备
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },

    // 自定义配置示例
    {
      name: 'chromium-no-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined, // 不使用认证状态
      },
    },
  ],

  // 输出目录
  outputDir: 'test-results/',

  // 全局设置
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // 测试文件匹配模式
  testMatch: /.*\.spec\.js/,

  // 忽略的文件
  testIgnore: /.*\.skip\.spec\.js/,
});
