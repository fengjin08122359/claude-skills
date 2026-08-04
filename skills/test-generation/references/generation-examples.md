# 测试生成 — 详细示例

## 对齐报告模板

```markdown
# 测试用例-PRD 对齐报告

**PRD:** docs/working/prd/订单模块.md
**测试用例:** test-cases/订单测试用例.xlsx
**分析时间:** 2026-07-09

## 对齐矩阵
| PRD 规则 | 规则描述 | 对应用例 | 对齐状态 |
|---------|---------|---------|---------|
| R001 | 实付=总额-优惠+运费 | TC010, TC011 | ✅ 已覆盖 |
| R003 | 实付>=0 | — | 🔴 无对应用例 |
| SM001 | PENDING→PAID | TC001 | ✅ 已覆盖 |

## 统计
| 指标 | 数值 |
|------|------|
| PRD 规则总数 | 10 |
| 已有测试覆盖 | 6 (60%) |
| 测试缺口 | 4 |
| 冗余测试 | 2 |

## 缺口详情
### 🔴 需补充的测试用例
| 缺口 | 对应规则 | 建议用例名 | 建议场景 |
|------|---------|-----------|---------|
| GAP-1 | R003: 实付>=0 | 优惠券超过总额 | 总额50,优惠80,运费10 → 实付=0 |
```

## 测试用例结构化

```
输入（手工用例）:
| TC001 | 正常支付 | 已创建待支付订单 | 点击支付 | 订单变为已支付 | P0 |

输出（结构化）:
{
  "id": "TC001",
  "name": "正常支付",
  "given": "已创建待支付订单",
  "when": "点击支付（支付成功回调）",
  "then": "订单状态变为已支付",
  "priority": "P0",
  "mappedRules": ["SM001"]
}
```

## 生成的单元测试代码示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { OrderStateMachine } from '@/order/state-machine';

describe('订单状态流转', () => {
  // ─── TC001: 正常支付 ───
  // PRD规则: SM001 (PENDING→PAID)
  describe('TC001: 正常支付', () => {
    let sm: OrderStateMachine;
    beforeEach(() => { sm = new OrderStateMachine(); });

    it('should_transition_to_paid_on_success', async () => {
      // Given
      sm.init('PENDING');
      const orderId = 'ORDER-001';
      // When
      await sm.transition('PAID', { orderId, amount: 100, txId: 'TX-001' });
      // Then
      expect(sm.state).toBe('PAID');
    });
  });

  // ─── TC002: 超时取消 ───
  describe('TC002: 超时取消', () => {
    it('should_cancel_order_after_30min_timeout', async () => {
      const sm = new OrderStateMachine();
      sm.init('PENDING');
      sm.setCreatedAt(Date.now() - 31 * 60 * 1000);
      await sm.handleTimeoutCheck();
      expect(sm.state).toBe('CANCELLED');
    });
  });
});
```

## 对齐统计注释

```typescript
/**
 * 测试-PRD 对齐统计
 * ─────────────────────────────────────
 * 总用例数: 15
 * PRD 覆盖: 10/10 (100%)
 * 缺口:     0
 * 冗余:     2 (TC020, TC021 - 可能为 PRD 遗漏)
 *
 * @see docs/working/prd/订单模块.md
 */
```

## 匹配策略

|匹配方式|说明|示例|
|---|---|---|
|关键词匹配|测试名称/步骤中的关键词与规则描述匹配|"支付" → SM001|
|语义匹配|测试的预期结果与规则的约束匹配|"返回已支付" → SM010(幂等)|
|注解匹配|测试用例中标注的 @Requirement 注解|@REQ(R001) → R001|
