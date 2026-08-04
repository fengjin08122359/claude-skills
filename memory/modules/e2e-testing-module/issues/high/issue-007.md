# Issue-007: 全量测试验证 + npm script 集成

**难度：** 低（3分）
**类型：** AFK（可独立完成）
**切片：** 收尾集成，确保所有测试协同运行
**前置：** issue-001 ~ issue-006
**所属模块：** e2e-testing-module

---

## 目标

确保所有组件测试 + Playwright 测试可以协同运行，互不干扰。

## TDD 测试计划

### 集成验证

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | `npm run test:unit` | 所有组件测试通过 |
| 2 | `npm test` | Playwright 测试不受影响 |
| 3 | 测试隔离 | jest 测试不启动 webpack-dev-server |
| 4 | 覆盖率报告 | 可选：生成覆盖率报告 |
| 5 | CI 脚本 | 可在 CI 中运行 |

### npm scripts 最终配置

```json
{
  "scripts": {
    "test": "playwright test",
    "test:unit": "jest --no-cache",
    "test:unit:watch": "jest --watch",
    "test:unit:coverage": "jest --coverage",
    "test:all": "npm run test:unit && npm test",
    "test:harness": "webpack serve --config webpack.config.ts --port 3100"
  }
}
```

### 文档更新

- 更新 `README.md`：添加组件测试说明
- 添加测试运行指南

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 修改 | `package.json`（最终 scripts） |
| 修改 | `README.md`（测试文档） |
| 可选 | `.gitignore`（添加 coverage/） |

## 完成定义

- [ ] `npm run test:unit` 所有 50+ 组件测试通过
- [ ] `npm test` Playwright 测试正常
- [ ] 两者不冲突（不同端口/进程）
- [ ] README 有清晰的测试运行说明
- [ ] 无遗留 TODO 或 skip 测试
