# 开发规范（由测试反向填充）

**来源:** Quality Engineering Loop 反向填充
**基于:** PRD-SAMPLE-001 分析 + 测试用例审查
**生成时间:** 2026-07-09
**维护者:** 技术团队

---

## 1. 金额计算安全规范

### 1.1 数值精度 [P0]

**规范条目:** 所有金额计算必须使用整数（分）或 Decimal 类型，禁止使用浮点数直接计算。

**来源:** QI001 — 浮点精度问题可能导致金额错误

```typescript
// ❌ 错误
const payable = total - coupon + shipping; // 浮点运算可能产生 0.1 + 0.2 = 0.30000000004

// ✅ 正确
const payable = totalCents - couponCents + shippingCents; // 整数运算
// 或者
const payable = new Decimal(total).minus(coupon).plus(shipping).toNumber();
```

### 1.2 下限约束 [P0]

**规范条目:** 金额计算结果必须有明确的上下限约束，使用 `Math.max` / `Math.min` 保护。

**来源:** R003 — 实付金额 >= 0

```typescript
// ❌ 错误 — 可能产生负数
return total - coupon + shipping;

// ✅ 正确 — 下限保护
return Math.max(0, total - coupon + shipping);
```

### 1.3 优惠券上限 [P1]

**规范条目:** 优惠券抵扣金额不得超过订单总额，超出部分作废。

**来源:** R005 — 优惠券面额不能超过商品总额

```typescript
// ✅ 统一在入口处裁剪
const effectiveCoupon = Math.min(couponFaceValue, orderTotal);
```

---

## 2. 外部依赖降级规范

### 2.1 必选降级 [P0]

**规范条目:** 所有外部服务调用（运费服务、优惠券服务、支付服务等）必须有降级策略。降级策略包括：
1. 返回默认值
2. 使用缓存值
3. 功能降级（非核心功能直接跳过）

**来源:** R007, R008, R009 — 多个服务不可用场景

```typescript
// ❌ 错误 — 无降级
const shipping = await shippingService.calculate(address);

// ✅ 正确 — 带降级
let shipping: number;
try {
  shipping = await shippingService.calculate(address);
} catch (error) {
  logger.warn('运费服务不可用，使用默认运费', { error, address });
  shipping = DEFAULT_SHIPPING_FEE; // 15 元
}
```

### 2.2 降级日志 [P1]

**规范条目:** 降级发生时，必须记录 WARN 级别日志，包含：
- 降级的服务名称
- 降级原因（错误信息）
- 使用的默认值
- 相关请求参数（脱敏）

```typescript
logger.warn('shipping_service_degraded', {
  reason: error.message,
  defaultValue: DEFAULT_SHIPPING_FEE,
  addressHash: hash(address), // 脱敏
});
```

### 2.3 空值防御 [P0]

**规范条目:** 所有外部输入参数必须做空值检查（null / undefined / 空字符串），并提供默认值或明确报错。

**来源:** R007 — 地址为空时的降级

```typescript
// ❌ 错误 — 直接解构可能为空的对象
function calculateShipping(address: Address) {
  const { city } = address; // address 可能为 null → 崩溃
}

// ✅ 正确 — 空值检查 + 降级
function calculateShipping(address?: Address | null): number {
  if (!address?.city) {
    return DEFAULT_SHIPPING_FEE;
  }
  return getShippingByCity(address.city);
}
```

---

## 3. 状态机规范

### 3.1 状态迁移白名单 [P0]

**规范条目:** 所有状态变更必须通过状态机模块，使用白名单模式（只有明确允许的迁移才能通过）。

**来源:** SM001~SM010 — 状态流转规则

```typescript
// ✅ 白名单迁移表
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'], // CANCELLED 仅限退款
  SHIPPED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

function validateTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
```

### 3.2 并发安全 [P0]

**规范条目:** 状态变更操作必须使用乐观锁（version 字段）或分布式锁，防止并发竞态。

**来源:** SM009 — 支付+超时竞态

```typescript
// ✅ 乐观锁示例
async function transitionOrder(orderId: string, newStatus: OrderStatus) {
  const order = await db.orders.findById(orderId);
  // ... 业务逻辑 ...
  const result = await db.orders.update(
    { id: orderId, version: order.version }, // WHERE version = current_version
    { status: newStatus, version: order.version + 1 }
  );
  if (result.affectedRows === 0) {
    throw new ConcurrentModificationError('订单已被其他操作修改');
  }
}
```

### 3.3 幂等处理 [P0]

**规范条目:** 所有可能被重复调用的操作（支付回调、消息队列消费等）必须实现幂等。

**来源:** SM010 — 重复支付回调

```typescript
// ✅ 使用唯一键实现幂等
async function handlePaymentCallback(callback: PaymentCallback) {
  const existing = await db.paymentRecords.findByTxId(callback.txId);
  if (existing) {
    logger.info('重复回调，幂等返回', { txId: callback.txId });
    return { success: true, idempotent: true };
  }
  // 正常处理逻辑...
  await db.paymentRecords.create({ txId: callback.txId, ... });
}
```

---

## 4. 查询安全规范

### 4.1 分页必需 [P0]

**规范条目:** 所有列表查询必须支持分页，且必须设置分页上限（默认 max 50，绝对上限 1000）。

**来源:** QI003 — 列表查询必须分页

```typescript
// ❌ 错误 — 无分页
const orders = await db.orders.findAll({ userId });

// ✅ 正确 — 强制分页
const MAX_PAGE_SIZE = 50;
const limit = Math.min(request.limit || 20, MAX_PAGE_SIZE);
const offset = (request.page - 1) * limit;
const orders = await db.orders.findPaginated({ userId, limit, offset });
```

### 4.2 索引检查 [P0]

**规范条目:** 所有查询条件中的字段必须有对应索引。排序字段必须有索引。上线前必须通过 EXPLAIN 验证。

**来源:** QI002 — ORDER BY create_time 需要索引

```sql
-- 必须确保以下索引存在
CREATE INDEX idx_orders_user_created ON orders(user_id, create_time DESC);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- 上线前验证
EXPLAIN SELECT * FROM orders WHERE user_id = ? ORDER BY create_time DESC LIMIT 50;
-- 确认 type != ALL（非全表扫描）
```

### 4.3 数据权限 [P0]

**规范条目:** 所有数据查询必须包含数据权限过滤（如 user_id），防止越权访问。

**来源:** QI005 — 用户只能查看自己的订单

```typescript
// ❌ 错误 — 缺少权限过滤
const orders = await db.orders.findPaginated({ limit, offset });

// ✅ 正确 — 强制用户隔离
const orders = await db.orders.findPaginated({
  userId: currentUser.id, // 必须带上
  limit,
  offset,
});
```

---

## 5. 重试规范

### 5.1 重试策略 [P1]

**规范条目:** 网络请求失败时的重试策略：
- 默认重试 3 次
- 重试间隔 2 秒（建议使用指数退避）
- 仅对可重试的错误进行重试（超时、网络错误），非幂等操作禁止重试

**来源:** R010 — 支付超时重试

```typescript
// ✅ 重试包装器
async function withRetry<T>(
  fn: () => Promise<T>,
  options = { retries: 3, delay: 2000 }
): Promise<T> {
  for (let i = 0; i <= options.retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === options.retries || !isRetryable(error)) throw error;
      logger.warn(`重试第 ${i + 1} 次`, { error });
      await sleep(options.delay * Math.pow(2, i)); // 指数退避
    }
  }
  throw new Error('unreachable');
}
```

---

## 规范维护说明

### 反向填充流程

```
测试发现覆盖缺口
  → 分析是否属于开发规范缺失
  → 如果是：提交规范补充 PR
  → 团队评审通过
  → 合并到本规范文档
  → 后续 Code Review 自动检查
```

### 规范等级说明

| 等级 | 含义 | 执行要求 |
|------|------|---------|
| **P0** | 必须遵守 | Code Review 不通过则不能合并 |
| **P1** | 强烈建议 | Code Review 建议遵守，特殊情况可豁免 |
| **P2** | 推荐遵守 | 最佳实践，不做强制要求 |

### 变更记录

| 日期 | 变更内容 | 来源 |
|------|---------|------|
| 2026-07-09 | 初始版本，基于 PRD-SAMPLE-001 分析填充 | Quality Engineering Loop |
