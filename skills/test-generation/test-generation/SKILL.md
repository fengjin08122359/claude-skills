---
name: test-generation
description: 基于 PRD 结构化分析结果，生成 BDD 格式测试用例和单元测试脚手架。支持 Given-When-Then 格式输出，直接对接 Jest/Vitest。
---

# 测试用例生成（BDD 驱动）

**目标：** 将 PRD 规则转化为可执行的测试用例，确保每条规则都有对应的验证。

## 触发时机

- PRD 分析完成、覆盖矩阵生成后
- 发现 TEST_GAP（测试遗漏）时
- 新需求开发需要编写测试时
- 反向从测试用例生成单元测试时

## 生成策略

### 策略1: 规则 → 测试映射

**每条 PRD 规则至少生成 3 个测试：**

| 测试类型 | 覆盖内容 | 示例 |
|---------|---------|------|
| 正常路径 | 合法输入的预期行为 | 总额100，优惠20 → 实付80 |
| 边界值 | 临界值的行为 | 优惠=总额 → 实付=0 |
| 异常路径 | 非法输入的处理 | 总额=-1 → 报错/降级 |

### 策略2: 状态迁移 → 测试映射

**每个合法迁移 + 每个非法迁移各生成测试：**

| 迁移类型 | 测试内容 | 示例 |
|---------|---------|------|
| 合法迁移 | 状态正确变更 | 待支付 → 支付成功 → 已支付 |
| 非法迁移 | 操作被拒绝 | 已支付 → 取消 → 抛出异常 |
| 并发迁移 | 竞态条件处理 | 同时支付+超时 → 只有一个生效 |

### 策略3: 隐性规则 → 测试映射

**每个隐性规则生成性能/安全测试：**

| 隐性规则 | 测试内容 | 示例 |
|---------|---------|------|
| 分页必需 | 大数据量分页 | 100万条数据分页查询 |
| 索引必需 | 查询性能 | EXPLAIN 检查索引使用 |
| 权限隔离 | 数据权限 | 用户A看不到用户B的订单 |

## 输出格式

### BDD Gherkin 格式

```gherkin
Feature: 订单金额计算
  作为下单用户
  我希望系统正确计算实付金额
  以便支付正确的金额

  Background:
    Given 系统默认运费为 10 元

  # 规则 R001: 实付 = 总额 - 优惠 + 运费
  Scenario: 正常计算实付金额
    Given 商品总额为 100 元
    And 优惠券抵扣为 20 元
    And 收货地址运费为 10 元
    When 计算实付金额
    Then 实付金额应为 90 元

  # 规则 R003: 实付 >= 0（边界值）
  Scenario: 优惠券超过商品总额时实付为0
    Given 商品总额为 50 元
    And 优惠券抵扣为 80 元
    And 收货地址运费为 10 元
    When 计算实付金额
    Then 实付金额应为 10 元

  Scenario: 优惠券+运费使结果为负时取0
    Given 商品总额为 10 元
    And 优惠券抵扣为 30 元
    And 收货地址运费为 0 元
    When 计算实付金额
    Then 实付金额应为 0 元

  # 规则 R004: 地址为空默认运费
  Scenario: 收货地址为空时使用默认运费
    Given 商品总额为 100 元
    And 优惠券抵扣为 20 元
    And 收货地址为空
    When 计算实付金额
    Then 运费使用默认值 10 元
    And 实付金额应为 90 元
```

### TypeScript 单元测试（Jest/Vitest）

```typescript
// order-calculate.test.ts
// 基于 PRD 规则自动生成
// PRD: sample-prd.md
// 分析版本: v1.0

import { calculatePayable, calculateShipping } from '@/order/calculate';

describe('订单金额计算', () => {
  // ─── 规则 R001: 实付 = 总额 - 优惠 + 运费 ───
  describe('规则 R001: 正常计算', () => {
    it('should_calculate_payable_correctly', () => {
      // Given
      const total = 100;
      const coupon = 20;
      const shipping = 10;
      
      // When
      const result = calculatePayable(total, coupon, shipping);
      
      // Then
      expect(result).toBe(90); // 100 - 20 + 10 = 90
    });
  });

  // ─── 规则 R003: 实付 >= 0（边界值测试）───
  describe('规则 R003: 实付下限约束', () => {
    it('should_return_zero_when_coupon_exceeds_total', () => {
      const result = calculatePayable(50, 80, 10);
      expect(result).toBe(0); // Math.max(0, 50 - 80 + 10) = 0
    });

    it('should_return_zero_when_result_negative', () => {
      const result = calculatePayable(10, 30, 0);
      expect(result).toBe(0);
    });

    it('should_return_zero_not_negative_for_large_coupon', () => {
      const result = calculatePayable(100, 200, 0);
      expect(result).toBe(0);
      expect(result).toBeGreaterThanOrEqual(0); // 显式验证约束
    });
  });

  // ─── 规则 R002: 运费 = f(地址) ───
  describe('规则 R002: 运费动态计算', () => {
    it('should_calculate_shipping_by_address', () => {
      const shipping = calculateShipping({ city: '上海', district: '浦东' });
      expect(shipping).toBeGreaterThan(0);
    });

    it('should_return_different_shipping_for_different_address', () => {
      const shipping1 = calculateShipping({ city: '上海' });
      const shipping2 = calculateShipping({ city: '北京' });
      // 不同城市运费可能不同
      expect(typeof shipping1).toBe('number');
      expect(typeof shipping2).toBe('number');
    });
  });

  // ─── 规则 R004: 地址为空默认运费 ───
  describe('规则 R004: 地址为空降级', () => {
    it('should_use_default_shipping_when_address_is_null', () => {
      const shipping = calculateShipping(null);
      expect(shipping).toBe(10); // 默认运费
    });

    it('should_use_default_shipping_when_address_is_empty', () => {
      const shipping = calculateShipping({ city: '', district: '' });
      expect(shipping).toBe(10);
    });

    it('should_use_default_shipping_when_address_is_undefined', () => {
      const shipping = calculateShipping(undefined);
      expect(shipping).toBe(10);
    });
  });
});

// ─── 状态机测试（状态迁移表驱动）───
describe('订单状态流转', () => {
  describe('合法迁移', () => {
    it('should_transition_from_pending_to_paid_on_success', () => {
      // Given: 待支付订单
      const order = createOrder({ status: 'PENDING' });
      
      // When: 支付成功
      handlePaymentCallback(order.id, { status: 'SUCCESS', amount: order.amount });
      
      // Then: 状态变为已支付
      expect(getOrder(order.id).status).toBe('PAID');
    });

    it('should_transition_from_pending_to_cancelled_on_timeout', () => {
      const order = createOrder({ status: 'PENDING', createdAt: now() - 31min });
      
      handleTimeoutCheck();
      
      expect(getOrder(order.id).status).toBe('CANCELLED');
    });
  });

  describe('非法迁移', () => {
    it('should_reject_cancel_when_already_paid', () => {
      const order = createOrder({ status: 'PAID' });
      
      expect(() => cancelOrder(order.id)).toThrow('已支付订单不允许取消');
    });
  });

  describe('并发竞态', () => {
    it('should_handle_payment_and_timeout_race_condition', () => {
      const order = createOrder({ status: 'PENDING', createdAt: now() - 30min });
      
      // 同时触发支付回调和超时检查
      await Promise.all([
        handlePaymentCallback(order.id, { status: 'SUCCESS' }),
        handleTimeoutCheck()
      ]);
      
      // 只有一个应该生效（幂等性）
      const finalStatus = getOrder(order.id).status;
      expect(['PAID', 'CANCELLED']).toContain(finalStatus);
      // 不能同时是两种状态
    });
  });
});
```

### 测试覆盖率映射表

```markdown
## 测试-规则覆盖映射

| 规则ID | 正常路径 | 边界值 | 异常路径 | 并发 | 覆盖率 |
|--------|---------|--------|---------|------|--------|
| R001 | ✅ | ✅ | ❌ | — | 66% |
| R002 | ✅ | ❌ | ❌ | — | 33% |
| R003 | — | ✅ | ✅ | — | 100% |
| R004 | ✅ | — | ✅ | — | 100% |
| SM001 | ✅ | — | — | ✅ | 100% |
```

## 与 jest-test-generator 的衔接

生成的测试可以直接作为 `jest-test-generator` 的输入：

```typescript
// 将 BDD 场景转化为 jest-test-generator 格式
await generateComponentTest({
  componentName: 'OrderCalculate',
  testCases: [
    {
      description: 'R001: 正常计算实付金额',
      input: { total: 100, coupon: 20, shipping: 10 },
      expected: 90
    },
    {
      description: 'R003: 优惠券超过总额时实付为0',
      input: { total: 50, coupon: 80, shipping: 10 },
      expected: 0
    }
  ]
});
```

## 测试命名规范

**格式：** `should_[预期行为]_when_[条件]`

| PRD 规则 | 测试方法名 |
|---------|-----------|
| R001: 正常计算 | `should_calculate_payable_correctly` |
| R003: 下限约束 | `should_return_zero_when_coupon_exceeds_total` |
| R004: 默认运费 | `should_use_default_shipping_when_address_is_null` |

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收规则/边界/异常
- **← coverage-matrix：** 接收 TEST_GAP 列表
- **→ code-review-checklist：** 测试名称作为审查参考
- **→ ci-integration：** 测试文件供 CI 执行
