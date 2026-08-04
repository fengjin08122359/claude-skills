# 查看自查清单

查看各类自查清单，帮助快速决策。

## 使用方式

```
/structured-dev-checklist [类型]
```

## 可用清单

### Jest Mock 自查清单

```
/structured-dev-checklist jest
```

**核心问题：**

| 检查项 | 判断 |
|--------|------|
| 这个 mock 是给外部 npm 包还是内部 workspace 包？ | 内部包不 mock |
| mock 文件放在 `__mocks__/` 下会不会泄漏到其他 package？ | 会 → 改用 `test-utils/` + `moduleNameMapper` |
| `setupFiles` 里的文件有没有 `jest.mock()` 调用？ | 没有就不生效 |
| 根配置跑测试时，`verdaccio/` 或其他目录会不会引入同名 `package.json`？ | 用 `modulePathIgnorePatterns` 排除 |
| 改 mock 返回值前，检查了所有测试的断言格式没有？ | 用 `grep` 搜索 `mock-id-`、`mock-uuid-` 等前缀 |

**详见：** `references/self-check-jest.md`

### 编码原则自查清单

```
/structured-dev-checklist principles
```

| 规则 | 问题 | 如果否 → |
|------|------|---------|
| 规则1 | 我思考过了吗？ | 先思考再编码 |
| 规则2 | 这是最简洁的吗？ | 删除多余代码 |
| 规则3 | 我只改了必须改的吗？ | 撤销顺便修改 |
| 规则4 | 成功标准达到了吗？ | 继续迭代 |

### 需求变更检测清单

```
/structured-dev-checklist change-detect
```

| 检查项 | 类型A（独立新需求） | 类型B（修改当前需求） |
|--------|-------------------|---------------------|
| 共享核心组件？ | 不共享 | 共享 |
| 同一数据流？ | 独立数据流 | 同一数据流 |
| 同一迭代？ | 可独立交付 | 需要协同 |
| 业务目标独立？ | 独立 | 同一目标 |
