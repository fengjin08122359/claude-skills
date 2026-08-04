# PRD-代码-测试 覆盖矩阵

**需求:** PRD-SAMPLE-001 订单金额计算
**生成时间:** 2026-07-09T10:00:00Z
**分析版本:** v1.0

---

## 覆盖矩阵

### 计算规则覆盖

| 规则ID | 规则描述 | PRD | 代码 | 测试 | 状态 | 备注 |
|--------|---------|-----|------|------|------|------|
| R001 | 实付=总额-优惠+运费 | ✅ L45 | ✅ `calculatePayable()` | ✅ `should_calculate_payable_correctly` | ✅ 已覆盖 | |
| R002 | 运费=f(城市等级) | ✅ L52 | ✅ `calculateShipping()` | ✅ `should_calculate_shipping_by_address` | ✅ 已覆盖 | |
| R003 | 实付>=0 | ✅ L47 | ✅ `Math.max(0,...)` | ✅ `should_return_zero_when_coupon_exceeds_total` | ✅ 已覆盖 | |
| R004 | 满99免运费 | ✅ L56 | ⚠️ 未检查到逻辑 | ❌ 无测试 | 🔴 CODE_GAP + TEST_GAP | 需补充 `if(total>=99) shipping=0` |
| R005 | 优惠券<=总额 | ✅ L49 | ⚠️ 未见校验 | ❌ 无测试 | 🔴 CODE_GAP + TEST_GAP | 需补充校验逻辑 |
| R006 | 一单一券 | ✅ L50 | ✅ 参数为单张 | ✅ 参数设计即约束 | ✅ 已覆盖 | 接口层面约束 |

### 降级规则覆盖

| 规则ID | 规则描述 | PRD | 代码 | 测试 | 状态 | 备注 |
|--------|---------|-----|------|------|------|------|
| R007 | 地址为空→默认运费 | ✅ L55 | ❌ 未实现 | ✅ 测试已编写 | 🔴 CODE_GAP | 代码缺失降级逻辑 |
| R008 | 优惠券服务不可用→无优惠 | ✅ L72 | ⚠️ try-catch 但无降级 | ❌ 无测试 | 🔴 CODE_GAP + TEST_GAP | catch 中应 fallback |
| R009 | 运费服务不可用→默认运费 | ✅ L73 | ✅ `catch→15` | ✅ `should_use_default_on_service_error` | ✅ 已覆盖 | |
| R010 | 支付超时→重试3次 | ✅ L71 | ✅ `retry(3, 2s)` | ✅ `should_retry_on_timeout` | ✅ 已覆盖 | |

### 状态机覆盖

| 规则ID | 迁移 | PRD | 代码 | 测试 | 状态 | 备注 |
|--------|------|-----|------|------|------|------|
| SM001 | PENDING→PAID | ✅ | ✅ `handlePayment()` | ✅ `should_transition_on_success` | ✅ 已覆盖 | |
| SM002 | PENDING→CANCELLED(用户) | ✅ | ✅ `cancelOrder()` | ✅ `should_cancel_by_user` | ✅ 已覆盖 | |
| SM003 | PENDING→CANCELLED(超时) | ✅ | ✅ `handleTimeout()` | ✅ `should_cancel_on_timeout` | ✅ 已覆盖 | |
| SM004 | PAID→SHIPPED | ✅ | ✅ `shipOrder()` | ✅ `should_ship_order` | ✅ 已覆盖 | |
| SM005 | PAID→CANCELLED(退款) | ✅ | ✅ `refundOrder()` | ✅ `should_refund_with_approval` | ✅ 已覆盖 | |
| SM006 | SHIPPED→COMPLETED | ✅ | ✅ `confirmOrder()` | ✅ `should_confirm_order` | ✅ 已覆盖 | |
| SM007 | SHIPPED→COMPLETED(自动) | ✅ | ✅ `autoConfirm()` | ✅ `should_auto_confirm_7days` | ✅ 已覆盖 | |
| SM008 | CANCELLED→*(拒绝) | ✅ | ✅ 状态机拦截 | ✅ `should_reject_cancelled_order` | ✅ 已覆盖 | |
| SM009 | 并发: 支付+超时竞态 | ✅ L68 | ✅ 乐观锁 | ✅ `should_handle_race_condition` | ✅ 已覆盖 | |
| SM010 | 重复回调幂等 | ✅ L76 | ✅ 唯一键 | ✅ `should_idempotent_callback` | ✅ 已覆盖 | |

### 隐性规则覆盖

| 规则ID | 隐性规则 | PRD(隐含) | 代码 | 测试 | 状态 | 备注 |
|--------|---------|----------|------|------|------|------|
| QI001 | 金额用分(整数)计算 | 隐含 | ⚠️ 待确认 | ❌ | 🟡 待验证 | 需审查代码中数值类型 |
| QI002 | create_time 索引 | 隐含 | — | — | 🟡 需DBA确认 | 上线前 EXPLAIN |
| QI003 | 列表分页 | 隐含 | ✅ `LIMIT/OFFSET` | ✅ `should_paginate` | ✅ 已覆盖 | |
| QI005 | 数据权限隔离 | 隐含 | ✅ `WHERE user_id` | ✅ `should_filter_by_user` | ✅ 已覆盖 | |
| QI006 | 支付幂等键 | 隐含 | ✅ 唯一约束 | ✅ `should_prevent_duplicate` | ✅ 已覆盖 | |
| QI007 | 状态变更乐观锁 | 隐含 | ✅ `version` 字段 | ✅ `should_handle_concurrent_update` | ✅ 已覆盖 | |

---

## 统计摘要

| 指标 | 数值 | 状态 |
|------|------|------|
| **PRD 规则总数** | 27 | — |
| **已完全覆盖** | 21 (78%) | ⚠️ |
| **CODE_GAP (代码缺失)** | 3 | 🔴 需修复 |
| **TEST_GAP (测试缺失)** | 4 | 🔴 需补充 |
| **MISMATCH (实现偏差)** | 0 | ✅ |
| **PRD_GAP (需求遗漏)** | 0 | ✅ |
| **待验证项** | 2 | 🟡 需确认 |

## 行动项

### 🔴 必须处理（阻塞合并）

1. **R004 CODE_GAP** — 补充满99免运费逻辑
   - 文件: `src/order/calculate.ts`
   - 建议: `if (total >= 99) shipping = 0`
   
2. **R005 CODE_GAP** — 补充优惠券面额校验
   - 文件: `src/order/calculate.ts`
   - 建议: `coupon = Math.min(coupon, total)`

3. **R007 CODE_GAP** — 补充地址为空降级逻辑
   - 文件: `src/order/shipping.ts`
   - 建议: `if (!address?.city) return DEFAULT_SHIPPING`

### 🟡 建议处理（不阻塞，但建议本迭代完成）

4. **R004 TEST_GAP** — 补充满99免运费测试
5. **R005 TEST_GAP** — 补充优惠券超额测试
6. **R008 TEST_GAP** — 补充优惠券服务降级测试
7. **QI001 待验证** — 确认金额计算是否使用整数/Decimal

### 💡 后续优化

8. **QI002** — 上线前确认 create_time 索引
9. **P001** — 确认6个月边界行为并补充测试

---

*此矩阵由 Quality Engineering Loop 自动生成*
