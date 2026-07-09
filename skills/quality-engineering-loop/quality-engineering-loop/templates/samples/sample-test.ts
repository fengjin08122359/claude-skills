/**
 * 订单金额计算 - BDD 单元测试
 *
 * 基于 PRD-SAMPLE-001 结构化分析结果自动生成
 * PRD 规则覆盖率: 78%
 *
 * 测试-规则映射:
 * - R001: 正常计算 → describe('R001')
 * - R002: 运费计算 → describe('R002')
 * - R003: 下限约束 → describe('R003')
 * - R004: 满99免运费 → describe('R004')
 * - R005: 优惠券上限 → describe('R005')
 * - R007: 地址降级 → describe('R007')
 * - R008: 优惠券服务降级 → describe('R008')
 * - SM*: 状态机 → describe('状态流转')
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  calculatePayable,
  calculateShipping,
  validateCoupon,
} from '@/order/calculate';
import { OrderStateMachine } from '@/order/state-machine';

// ─────────────────────────────────────────────────────────────
// 规则 R001: 实付金额 = 商品总额 - 优惠券抵扣 + 运费
// ─────────────────────────────────────────────────────────────
describe('R001: 正常计算实付金额', () => {
  it('should_calculate_payable_when_all_values_normal', () => {
    // Given: 商品总额100，优惠20，运费10
    // When: 计算实付
    // Then: 100 - 20 + 10 = 90
    expect(calculatePayable({ total: 100, coupon: 20, shipping: 10 })).toBe(90);
  });

  it('should_calculate_payable_when_no_coupon', () => {
    // Given: 无优惠券
    // Then: 100 + 10 = 110
    expect(calculatePayable({ total: 100, coupon: 0, shipping: 10 })).toBe(110);
  });

  it('should_calculate_payable_when_free_shipping', () => {
    // Given: 免运费
    // Then: 100 - 20 = 80
    expect(calculatePayable({ total: 100, coupon: 20, shipping: 0 })).toBe(80);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R003: 实付金额 >= 0（边界值测试）
// ─────────────────────────────────────────────────────────────
describe('R003: 实付金额下限约束', () => {
  it('should_return_zero_when_coupon_exceeds_total', () => {
    // Given: 优惠券80 > 总额50
    // When: 50 - 80 + 10 = -20
    // Then: 取 0（但不加运费？取决于业务定义）
    // PRD: 实付 = 总额 - 优惠 + 运费, 实付 >= 0
    // 50 - 80 + 10 = -20 → Math.max(0, -20) = 0
    expect(calculatePayable({ total: 50, coupon: 80, shipping: 10 })).toBe(0);
  });

  it('should_return_shipping_when_coupon_equals_total', () => {
    // Given: 优惠券 = 总额
    // When: 100 - 100 + 10 = 10
    // Then: 10（运费仍需支付）
    expect(calculatePayable({ total: 100, coupon: 100, shipping: 10 })).toBe(10);
  });

  it('should_return_zero_not_negative_for_extreme_coupon', () => {
    // Given: 优惠券远大于总额
    expect(calculatePayable({ total: 10, coupon: 1000, shipping: 0 })).toBe(0);
    expect(calculatePayable({ total: 10, coupon: 1000, shipping: 0 })).toBeGreaterThanOrEqual(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R002: 运费 = f(城市等级)
// ─────────────────────────────────────────────────────────────
describe('R002: 运费动态计算', () => {
  it('should_charge_10_for_tier1_city', () => {
    // Given: 一线城市
    expect(calculateShipping({ city: '北京' })).toBe(10);
    expect(calculateShipping({ city: '上海' })).toBe(10);
    expect(calculateShipping({ city: '广州' })).toBe(10);
    expect(calculateShipping({ city: '深圳' })).toBe(10);
  });

  it('should_charge_15_for_tier2_city', () => {
    // Given: 二线城市
    expect(calculateShipping({ city: '成都' })).toBe(15);
    expect(calculateShipping({ city: '杭州' })).toBe(15);
  });

  it('should_charge_20_for_other_city', () => {
    // Given: 其他城市
    expect(calculateShipping({ city: '拉萨' })).toBe(20);
    expect(calculateShipping({ city: '某县城' })).toBe(20);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R004: 满99免运费（边界值测试）
// ─────────────────────────────────────────────────────────────
describe('R004: 满99免运费', () => {
  it('should_free_shipping_when_total_is_99', () => {
    // B003: 恰好99元
    expect(calculateShipping({ city: '上海', orderTotal: 99 })).toBe(0);
  });

  it('should_free_shipping_when_total_exceeds_99', () => {
    expect(calculateShipping({ city: '上海', orderTotal: 100 })).toBe(0);
    expect(calculateShipping({ city: '上海', orderTotal: 999 })).toBe(0);
  });

  it('should_charge_shipping_when_total_is_98_99', () => {
    // B004: 98.99元不免运费
    expect(calculateShipping({ city: '上海', orderTotal: 98.99 })).toBe(10);
  });

  it('should_charge_shipping_when_total_below_99', () => {
    expect(calculateShipping({ city: '上海', orderTotal: 50 })).toBe(10);
    expect(calculateShipping({ city: '成都', orderTotal: 80 })).toBe(15);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R007: 地址为空 → 默认运费
// ─────────────────────────────────────────────────────────────
describe('R007: 地址为空降级处理', () => {
  it('should_use_default_shipping_when_address_is_null', () => {
    expect(calculateShipping(null)).toBe(15);
  });

  it('should_use_default_shipping_when_address_is_undefined', () => {
    expect(calculateShipping(undefined)).toBe(15);
  });

  it('should_use_default_shipping_when_city_is_empty', () => {
    expect(calculateShipping({ city: '' })).toBe(15);
    expect(calculateShipping({ city: '', district: '' })).toBe(15);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R008: 优惠券服务不可用 → 降级无优惠
// ─────────────────────────────────────────────────────────────
describe('R008: 优惠券服务降级', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should_fallback_to_zero_coupon_when_service_timeout', async () => {
    // Given: 优惠券服务超时
    jest.spyOn(couponService, 'validate').mockRejectedValue(
      new Error('Service timeout')
    );

    // When: 计算金额
    const result = await calculatePayableWithCoupon({
      total: 100,
      couponCode: 'SAVE20',
      shipping: 10,
    });

    // Then: 降级为无优惠，实付 = 100 + 10 = 110
    expect(result.payable).toBe(110);
    expect(result.couponApplied).toBe(0);
    expect(result.degraded).toBe(true);
  });

  it('should_fallback_to_zero_coupon_when_service_error', async () => {
    jest.spyOn(couponService, 'validate').mockRejectedValue(
      new Error('Internal error')
    );

    const result = await calculatePayableWithCoupon({
      total: 100,
      couponCode: 'SAVE20',
      shipping: 10,
    });

    expect(result.payable).toBe(110);
    expect(result.degraded).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// 规则 R005: 优惠券面额不超过总额
// ─────────────────────────────────────────────────────────────
describe('R005: 优惠券面额约束', () => {
  it('should_cap_coupon_at_total_amount', () => {
    // Given: 优惠券80 > 总额50
    // Then: 实际抵扣 = min(80, 50) = 50
    const validated = validateCoupon({ faceValue: 80, orderTotal: 50 });
    expect(validated.effectiveValue).toBe(50);
  });

  it('should_keep_coupon_when_under_total', () => {
    const validated = validateCoupon({ faceValue: 20, orderTotal: 100 });
    expect(validated.effectiveValue).toBe(20);
  });
});

// ─────────────────────────────────────────────────────────────
// 状态机: 订单状态流转测试
// ─────────────────────────────────────────────────────────────
describe('订单状态流转', () => {
  let sm: OrderStateMachine;

  beforeEach(() => {
    sm = new OrderStateMachine();
  });

  // --- 合法迁移 ---
  describe('合法迁移', () => {
    it('SM001: should_transition_PENDING_to_PAID_on_payment_success', () => {
      sm.init('PENDING');
      sm.transition('PAID', { amount: 100, orderId: '001' });
      expect(sm.state).toBe('PAID');
    });

    it('SM002: should_transition_PENDING_to_CANCELLED_on_user_cancel', () => {
      sm.init('PENDING');
      sm.transition('CANCELLED', { reason: 'user_cancel' });
      expect(sm.state).toBe('CANCELLED');
    });

    it('SM003: should_transition_PENDING_to_CANCELLED_on_timeout', () => {
      sm.init('PENDING');
      sm.transition('CANCELLED', { reason: 'timeout_30min' });
      expect(sm.state).toBe('CANCELLED');
    });

    it('SM004: should_transition_PAID_to_SHIPPED', () => {
      sm.init('PAID');
      sm.transition('SHIPPED', { trackingNo: 'SF123' });
      expect(sm.state).toBe('SHIPPED');
    });

    it('SM006: should_transition_SHIPPED_to_COMPLETED_on_confirm', () => {
      sm.init('SHIPPED');
      sm.transition('COMPLETED', { confirmedBy: 'user' });
      expect(sm.state).toBe('COMPLETED');
    });

    it('SM007: should_auto_confirm_after_7_days', () => {
      sm.init('SHIPPED');
      sm.transition('COMPLETED', { reason: 'auto_confirm_7days' });
      expect(sm.state).toBe('COMPLETED');
    });
  });

  // --- 非法迁移 ---
  describe('非法迁移', () => {
    it('SM008: should_reject_any_transition_from_CANCELLED', () => {
      sm.init('CANCELLED');
      expect(() => sm.transition('PAID', {})).toThrow(
        '已取消的订单不能变更状态'
      );
    });

    it('should_reject_any_transition_from_COMPLETED', () => {
      sm.init('COMPLETED');
      expect(() => sm.transition('SHIPPED', {})).toThrow(
        '已完成的订单不能变更状态'
      );
    });

    it('should_reject_cancel_from_SHIPPED', () => {
      sm.init('SHIPPED');
      expect(() => sm.transition('CANCELLED', {})).toThrow(
        '已发货订单不能直接取消'
      );
    });
  });

  // --- 并发竞态 ---
  describe('并发竞态', () => {
    it('SM009: should_handle_payment_and_timeout_race_condition', async () => {
      sm.init('PENDING');

      // 模拟同时到达的支付回调和超时触发
      const results = await Promise.allSettled([
        sm.transition('PAID', { amount: 100 }),
        sm.transition('CANCELLED', { reason: 'timeout_30min' }),
      ]);

      // 只有一个应该成功（乐观锁/CAS）
      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      expect(succeeded).toBe(1);
    });

    it('SM010: should_handle_duplicate_payment_callback_idempotently', async () => {
      sm.init('PENDING');

      // 第一次支付成功
      await sm.transition('PAID', { amount: 100, txId: 'TX001' });
      expect(sm.state).toBe('PAID');

      // 重复回调（相同交易号）
      const result = await sm.transition('PAID', { amount: 100, txId: 'TX001' });
      expect(result.idempotent).toBe(true);
      expect(sm.state).toBe('PAID'); // 状态不变
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 隐性规则测试
// ─────────────────────────────────────────────────────────────
describe('隐性规则验证', () => {
  // QI001: 金额精度
  it('QI001: should_use_integer_cents_for_calculation', () => {
    // 传入分为单位的金额
    const result = calculatePayable({
      total: 9999,   // 99.99 元
      coupon: 2000,  // 20.00 元
      shipping: 1000 // 10.00 元
    });
    expect(result).toBe(8999); // 89.99 元
    expect(Number.isInteger(result)).toBe(true);
  });

  // QI005: 数据权限
  it('QI005: should_only_return_own_orders', async () => {
    const userA_orders = await getOrders({ userId: 'userA' });
    expect(userA_orders.every((o: any) => o.userId === 'userA')).toBe(true);
  });

  // QI003: 分页
  it('QI003: should_return_paginated_results', async () => {
    const page1 = await getOrders({ userId: 'userA', page: 1, limit: 50 });
    expect(page1.data.length).toBeLessThanOrEqual(50);
    expect(page1.total).toBeGreaterThanOrEqual(0);
  });
});
