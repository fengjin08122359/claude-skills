# Jest Mock 自查清单

## 新增/调整 Jest mock 前，问自己：

### 1. Mock 对象判断

| 检查项 | 判断 | 结论 |
|--------|------|------|
| 这个 mock 是给**外部 npm 包**还是**内部 workspace 包**？ | 内部包 | ❌ 不 mock，用真实实现 |
| mock 文件放在 `__mocks__/` 下会不会**泄漏到其他 package**？ | 会 | ❌ 改用 `test-utils/` + `moduleNameMapper` |
| `setupFiles` 里的文件有没有 `jest.mock()` 调用？ | 没有 | ❌ 不生效，移到 `setupFilesAfterEnv` |
| 根配置跑测试时，`verdaccio/` 或其他目录会不会引入**同名 package.json**？ | 会 | ❌ 用 `modulePathIgnorePatterns` 排除 |
| 改 mock 返回值前，检查了所有测试的**断言格式**没有？ | 没有 | ⚠️ 用 `grep` 搜索 `mock-id-`、`mock-uuid-` 等前缀 |

### 2. 应该 Mock 的场景

- [ ] 外部 API（支付、邮件、第三方服务）
- [ ] 数据库操作（如果不用测试数据库）
- [ ] 时间/随机数（`Date.now()`, `Math.random()`）
- [ ] 文件系统操作（如果不用临时测试文件）
- [ ] 环境变量（`process.env.XXX`）
- [ ] 网络请求（`fetch`, `axios`）

### 3. 不应该 Mock 的场景

- [ ] 你自己的类/模块（测试真实行为）
- [ ] 内部协作者（测试实现细节，重构时会断）
- [ ] 你控制的一切（使用真实实现）

### 4. Mock 设计原则

#### 4.1 只在系统边界 Mock

```typescript
// ✅ 正确：在边界 mock
jest.mock('../api/client');  // 外部 API

// ❌ 错误：mock 内部逻辑
jest.mock('../utils/formatDate');  // 你自己的工具函数
```

#### 4.2 使用依赖注入

```typescript
// ✅ 正确：通过参数注入依赖
function processOrder(order: Order, paymentGateway: PaymentGateway) {
  return paymentGateway.charge(order.total);
}

// 测试时传入 mock
const mockGateway = { charge: jest.fn().mockResolvedValue({ success: true }) };
await processOrder(order, mockGateway);
```

#### 4.3 Mock 返回固定形状（不在 mock 里写条件逻辑）

```typescript
// ✅ 正确：返回简单固定形状
jest.mock('./api', () => ({
  fetchUser: () => Promise.resolve({ id: 'mock-id-001', name: 'Test User' }),
}));

// ❌ 错误：mock 里有复杂条件逻辑
jest.mock('./api', () => ({
  fetchUser: (id: string) => {
    if (id === 'admin') return Promise.resolve({ role: 'admin' });
    if (id === 'guest') return Promise.resolve({ role: 'guest' });
    // ...
  },
}));
```

### 5. 测试编写原则

#### 测试行为，不测试实现

```typescript
// ✅ 正确：测试行为
expect(await login('user', 'pass')).toEqual({ success: true, token: expect.any(String) });

// ❌ 错误：测试实现细节
expect(mockApi.post).toHaveBeenCalledWith('/login', { user: 'user', pass: 'pass' });
```

#### 通过公共接口测试

```typescript
// ✅ 正确：通过公共接口
const result = await userService.createUser(data);
expect(result.id).toBeDefined();

// ❌ 错误：测试私有方法
expect(userService['validateInput'](data)).toBe(true);
```

### 6. 快速决策流程图

```
需要 Mock?
  → 外部服务/API?          → YES (使用 DI)
  → 你自己的代码?          → NO  (用真实实现)
  → 时间/随机?             → YES (固定值)
  → 数据库?                → 考虑测试数据库优先，否则 mock
  → 文件系统?              → 考虑临时目录优先，否则 mock
```

### 7. 常见陷阱

| 陷阱 | 说明 | 正确做法 |
|------|------|---------|
| Mock 过多 | 在测试 mock 而不是行为 | 只 mock 外部边界 |
| Mock 内部 | 重构时会断 | 用真实实现 |
| Mock 返回值复杂 | 难以维护 | 保持简单固定形状 |
| 测试私有方法 | 实现细节会变化 | 只测公共 API |
| 验证调用次数 | 这是验证实现不是行为 | 验证行为结果 |
| `__mocks__/` 泄漏 | 影响其他 package | 用 `moduleNameMapper` 精确控制 |

### 8. 修改 mock 前的检查步骤

```bash
# 1. 搜索所有使用了该 mock 前缀的测试
grep -r "mock-id-\|mock-uuid-\|mock-user-" --include="*.test.*" src/

# 2. 检查是否有测试依赖特定的 mock 返回值格式
grep -r "mockResolvedValue\|mockReturnValue" --include="*.test.*" src/

# 3. 检查 moduleNameMapper 配置
grep -A 10 "moduleNameMapper" jest.config.* package.json
```
