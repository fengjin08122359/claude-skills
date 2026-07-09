---
name: standards-backfill-engine
description: 从代码实现和测试用例中提取模式，反向填充开发规范。覆盖场景3（代码+测试→规范反哺）和场景4（代码+PRD+测试→代码范式）的核心引擎。
---

# 开发规范反向填充引擎

**目标：** 从代码和测试的模式中提取可复用的开发规范，持续提升团队代码稳定性和范式一致性。

## 覆盖场景

| 场景 | 输入 | 输出 |
|------|------|------|
| 场景3: 代码+测试→规范反哺 | 代码 + 测试用例 | 开发规范条目 + 覆盖矩阵更新 |
| 场景4: 代码+PRD+测试→代码范式 | 代码 + PRD + 测试 | 代码稳定性评估 + 范式建议 |

## Phase 1: 模式提取引擎（场景3）

### 从代码中提取模式

```
代码仓库 → AST 分析 → 模式识别 → 规范候选
```

#### 提取维度

| 维度 | 提取方式 | 规范候选示例 |
|------|---------|-------------|
| **错误处理** | 扫描 try-catch、error handler | "外部服务调用必须有降级策略" |
| **数值计算** | 扫描 Math.max/min、Decimal | "金额计算必须用整数分" |
| **空值处理** | 扫描 ?.、\|\|、?? | "外部入参必须做空值检查" |
| **状态管理** | 扫描状态机、枚举切换 | "状态变更必须通过白名单" |
| **并发控制** | 扫描 lock、version、CAS | "并发操作必须用乐观锁" |
| **数据查询** | 扫描 LIMIT、WHERE | "列表查询必须分页" |
| **日志规范** | 扫描 logger.warn/error | "降级必须记录 WARN 日志" |

#### 代码模式识别规则

```typescript
// 模式1: Math.max(0, ...) → 下限约束规范
if (code.contains('Math.max(0') || code.contains('Math.min(')) {
  suggest('boundary_constraint', '金额/数值计算必须有上下限保护');
}

// 模式2: try-catch + 默认值 → 降级规范
if (code.contains('try') && code.contains('catch') && hasDefaultValue) {
  suggest('fallback_pattern', '外部服务调用必须有降级策略');
}

// 模式3: null/undefined 检查 → 空值防御规范
if (code.contains('?.') || code.contains('??') || code.contains('|| default')) {
  suggest('null_defense', '外部入参必须做空值检查');
}

// 模式4: version/CAS → 并发安全规范
if (code.contains('version') && code.contains('WHERE')) {
  suggest('concurrency_safety', '并发状态变更必须用乐观锁');
}

// 模式5: LIMIT → 分页规范
if (code.contains('LIMIT') || code.contains('limit:')) {
  suggest('pagination_required', '列表查询必须有分页上限');
}
```

### 从测试中提取模式

```
测试文件 → 分析测试结构 → 提取测试范式 → 规范候选
```

#### 提取维度

| 维度 | 提取方式 | 规范候选示例 |
|------|---------|-------------|
| **测试命名** | 分析 describe/it 命名模式 | "测试命名: should_X_when_Y" |
| **BDD 结构** | 分析 Given-When-Then | "每个测试必须有 GWT 结构" |
| **边界测试** | 分析边界值测试比例 | "每条规则至少3个测试(正常/边界/异常)" |
| **Mock 策略** | 分析 jest.mock 使用 | "外部服务必须 mock，不依赖真实调用" |
| **断言规范** | 分析 expect 模式 | "必须验证具体值，不能只验证非空" |

### 反向填充流程

```
代码模式 + 测试模式
  ↓
去重合并 → 规范候选列表
  ↓
出现频率统计（≥3次 = 模式问题）
  ↓
与现有开发规范对比 → 新增/修改/删除
  ↓
生成规范变更建议
  ↓
人工评审确认
  ↓
写入开发规范文档
```

#### 规范变更报告

```markdown
# 开发规范反向填充报告

**分析范围:** src/order/, test/order/
**分析时间:** 2026-07-09

## 新增规范条目

### NS-001: 金额计算下限保护 [P0]

**来源:** 代码模式 `Math.max(0, ...)` 出现 5 次
**规范内容:** 金额计算结果必须有明确的上下限约束
**代码示例:**
```typescript
// ✅ 正确
return Math.max(0, total - coupon + shipping);

// ❌ 错误
return total - coupon + shipping;
```
**测试验证:** `should_return_zero_when_coupon_exceeds_total`

### NS-002: 降级日志记录 [P1]

**来源:** 测试发现 3 处降级无日志
**规范内容:** 降级发生时必须记录 WARN 级别日志
**代码示例:**
```typescript
logger.warn('shipping_service_degraded', {
  reason: error.message,
  defaultValue: DEFAULT_SHIPPING_FEE,
});
```

## 修改规范条目

### MS-001: 分页上限调整

**原规范:** 分页上限 100
**新规范:** 分页上限 50（默认 20）
**来源:** 测试发现 5 个列表查询中 4 个使用 50 条上限
**变更原因:** 团队实际惯例为 50，规范应对齐实际

## 规范冲突检测

| 新规范 | 冲突规范 | 冲突类型 | 建议 |
|--------|---------|---------|------|
| NS-003: 所有异常必须 throw | 现有: 降级时返回默认值 | 矛盾 | 区分 P0/P1 异常 |
```

## Phase 2: 代码稳定性评估（场景4）

### 三方综合评估

当同时有 PRD + 代码 + 测试时，进行综合评估：

```
PRD 规则 ──┐
代码实现 ──┼──→ 三方交叉验证 → 稳定性评估
测试用例 ──┘
```

### 稳定性评估维度

| 维度 | 评估方式 | 指标 |
|------|---------|------|
| **规则一致性** | PRD 规则 ↔ 代码实现 是否一致 | 一致率 |
| **测试完备性** | 每条规则是否有正常+边界+异常测试 | 完备率 |
| **防御性** | 代码是否有空值/边界/异常保护 | 防御度 |
| **幂等性** | 可重复操作是否幂等 | 幂等覆盖率 |
| **可观测性** | 关键路径是否有日志/指标 | 可观测度 |
| **范式一致性** | 代码是否遵循团队约定模式 | 范式符合率 |

### 代码稳定性报告

```markdown
# 代码稳定性评估报告

**模块:** order/
**评估时间:** 2026-07-09

## 稳定性评分

| 维度 | 评分 | 等级 | 关键发现 |
|------|------|------|---------|
| 规则一致性 | 85/100 | 🟢 | R004 未实现，其余一致 |
| 测试完备性 | 72/100 | 🟡 | 正常路径100%，边界60%，异常40% |
| 防御性 | 68/100 | 🟡 | 3处缺少空值检查 |
| 幂等性 | 90/100 | 🟢 | 支付回调已幂等 |
| 可观测性 | 55/100 | 🔴 | 降级日志仅覆盖50% |
| 范式一致性 | 80/100 | 🟢 | 基本遵循团队模式 |
| **综合稳定性** | **75/100** | **🟡** | |

## 风险项

### 🔴 高风险

1. **降级可观测性不足**
   - 位置: shipping.ts, coupon-service.ts
   - 问题: 降级发生时无日志
   - 影响: 线上问题难以定位
   - 建议: 所有 catch 块添加 logger.warn

### 🟡 中风险

2. **边界测试不足**
   - 缺失: R004(满99免运费) 的边界值测试
   - 缺失: 0元订单测试
   - 建议: 补充边界场景测试

3. **异常路径覆盖不全**
   - 覆盖率: 40%（6个异常路径仅覆盖2个）
   - 缺失: 优惠券过期、支付金额不匹配
   - 建议: 补充异常路径测试

## 范式建议

### 统一错误处理模式

**当前问题:** 代码中错误处理方式不统一

```typescript
// 模式A: try-catch + 默认值（shipping.ts）
try { ... } catch { return DEFAULT; }

// 模式B: try-catch + throw（payment.ts）
try { ... } catch(e) { throw new AppError(e); }

// 模式C: Promise.catch（coupon.ts）
service.call().catch(() => DEFAULT);
```

**建议统一为:**

```typescript
// 统一模式: withFallback 包装器
const shipping = await withFallback(
  () => shippingService.calculate(address),
  DEFAULT_SHIPPING_FEE,
  'shipping_calculate'  // 用于日志标识
);
```

### 统一测试结构

**建议所有测试遵循:**

```typescript
describe('规则ID: 规则描述', () => {
  describe('正常路径', () => { /* 至少1个 */ });
  describe('边界值', () => { /* 至少2个 */ });
  describe('异常路径', () => { /* 至少1个 */ });
});
```
```

## 稳定性趋势追踪

```json
// .quality-reports/stability-trend.json
{
  "module": "order/",
  "history": [
    {
      "date": "2026-07-01",
      "stability_score": 62,
      "risk_items": 8,
      "standards_compliance": 0.65
    },
    {
      "date": "2026-07-09",
      "stability_score": 75,
      "risk_items": 3,
      "standards_compliance": 0.80
    }
  ],
  "improvement_velocity": "+13分/周"
}
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 规则
- **← coverage-matrix：** 接收覆盖矩阵（识别缺口）
- **← test-generation：** 接收测试用例清单
- **← code-review-checklist：** 接收代码审查发现
- **→ 开发规范文档：** 输出规范变更建议
- **→ ci-integration：** 稳定性评分供 CI 门禁使用
- **→ prd-quality-improver：** 代码发现反哺 PRD 改进
