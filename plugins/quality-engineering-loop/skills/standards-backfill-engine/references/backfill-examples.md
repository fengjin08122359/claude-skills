# 规范反向填充 — 详细示例

## 代码模式识别规则

```typescript
// 模式1: Math.max(0, ...) → 下限约束规范
if (code.contains('Math.max(0')) {
  suggest('boundary_constraint', '金额/数值计算必须有上下限保护');
}

// 模式2: try-catch + 默认值 → 降级规范
if (code.contains('try') && code.contains('catch') && hasDefaultValue) {
  suggest('fallback_pattern', '外部服务调用必须有降级策略');
}

// 模式3: null/undefined 检查 → 空值防御规范
if (code.contains('?.') || code.contains('??')) {
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

## 提取维度

### 代码提取

|维度|提取方式|规范候选示例|
|---|---|---|
|错误处理|扫描 try-catch、error handler|"外部服务调用必须有降级策略"|
|数值计算|扫描 Math.max/min、Decimal|"金额计算必须用整数分"|
|空值处理|扫描 ?.、\|\|、??|"外部入参必须做空值检查"|
|状态管理|扫描状态机、枚举切换|"状态变更必须通过白名单"|
|并发控制|扫描 lock、version、CAS|"并发操作必须用乐观锁"|
|数据查询|扫描 LIMIT、WHERE|"列表查询必须分页"|
|日志规范|扫描 logger.warn/error|"降级必须记录 WARN 日志"|

### 测试提取

|维度|提取方式|规范候选示例|
|---|---|---|
|测试命名|分析 describe/it 命名模式|"测试命名: should_X_when_Y"|
|BDD 结构|分析 Given-When-Then|"每个测试必须有 GWT 结构"|
|边界测试|分析边界值测试比例|"每条规则至少3个测试"|
|Mock 策略|分析 jest.mock 使用|"外部服务必须 mock"|
|断言规范|分析 expect 模式|"必须验证具体值"|

## 规范变更报告模板

```markdown
# 开发规范反向填充报告

**分析范围:** src/order/, test/order/
**分析时间:** 2026-07-09

## 新增规范条目

### NS-001: 金额计算下限保护 [P0]
**来源:** 代码模式 `Math.max(0, ...)` 出现 5 次
**规范内容:** 金额计算结果必须有明确的上下限约束
**代码示例:**
// ✅ 正确: return Math.max(0, total - coupon + shipping);
// ❌ 错误: return total - coupon + shipping;

### NS-002: 降级日志记录 [P1]
**来源:** 测试发现 3 处降级无日志
**规范内容:** 降级发生时必须记录 WARN 级别日志

## 修改规范条目
### MS-001: 分页上限调整
**原规范:** 分页上限 100
**新规范:** 分页上限 50（默认 20）
**变更原因:** 团队实际惯例为 50

## 规范冲突检测
| 新规范 | 冲突规范 | 冲突类型 | 建议 |
|--------|---------|---------|------|
| NS-003: 所有异常必须 throw | 现有: 降级时返回默认值 | 矛盾 | 区分 P0/P1 异常 |
```

## 代码稳定性评估维度

|维度|评估方式|指标|
|---|---|---|
|规则一致性|PRD 规则 ↔ 代码实现 是否一致|一致率|
|测试完备性|每条规则是否有正常+边界+异常测试|完备率|
|防御性|代码是否有空值/边界/异常保护|防御度|
|幂等性|可重复操作是否幂等|幂等覆盖率|
|可观测性|关键路径是否有日志/指标|可观测度|
|范式一致性|代码是否遵循团队约定模式|范式符合率|

## 稳定性报告模板

```markdown
# 代码稳定性评估报告

**模块:** order/
**评估时间:** 2026-07-09

## 稳定性评分
| 维度 | 评分 | 等级 | 关键发现 |
|------|------|------|---------|
| 规则一致性 | 85/100 | 🟢 | R004 未实现 |
| 测试完备性 | 72/100 | 🟡 | 正常100%，边界60% |
| 防御性 | 68/100 | 🟡 | 3处缺少空值检查 |
| 幂等性 | 90/100 | 🟢 | 支付回调已幂等 |
| 可观测性 | 55/100 | 🔴 | 降级日志仅覆盖50% |
| 范式一致性 | 80/100 | 🟢 | 基本遵循团队模式 |
| **综合** | **75/100** | **🟡** | |

## 风险项
### 🔴 高风险
1. **降级可观测性不足** — 位置: shipping.ts, coupon-service.ts

### 🟡 中风险
2. **边界测试不足** — 缺失: R004 的边界值测试
```

## 范式建议

### 统一错误处理模式

```typescript
// 建议统一为: withFallback 包装器
const shipping = await withFallback(
  () => shippingService.calculate(address),
  DEFAULT_SHIPPING_FEE,
  'shipping_calculate'  // 用于日志标识
);
```

### 统一测试结构

```typescript
describe('规则ID: 规则描述', () => {
  describe('正常路径', () => { /* 至少1个 */ });
  describe('边界值', () => { /* 至少2个 */ });
  describe('异常路径', () => { /* 至少1个 */ });
});
```

## 稳定性趋势 JSON

```json
{
  "module": "order/",
  "history": [
    { "date": "2026-07-01", "stability_score": 62, "risk_items": 8, "standards_compliance": 0.65 },
    { "date": "2026-07-09", "stability_score": 75, "risk_items": 3, "standards_compliance": 0.80 }
  ],
  "improvement_velocity": "+13分/周"
}
```
