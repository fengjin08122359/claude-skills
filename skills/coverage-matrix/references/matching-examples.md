# 覆盖矩阵 — 详细示例

## 代码轴提取方式

### 方式1: Git diff 提取

```bash
git diff --name-only HEAD~1 | grep -E '\.(ts|js|vue)$' | \
  xargs grep -E '(function|const|class|export)' | \
  grep -v 'test|spec|mock'
```

### 方式2: AST 提取（推荐）

解析代码文件的 AST，提取：函数签名、类方法、条件分支、异常抛出

### 方式3: 手动映射

```typescript
// @rule R001 - 实付金额计算
function calculatePayable(total: number, coupon: number, shipping: number): number {
  return Math.max(0, total - coupon + shipping); // @rule R003 - 不小于0
}
```

## 测试轴提取方式

### 方式1: 测试方法名解析

```typescript
it('should_return_zero_when_coupon_exceeds_total', ...)
// → 对应规则: R003 (实付 >= 0)
```

### 方式2: @Requirement 注解

```typescript
@Test
@Requirement("R001")
describe('calculatePayable', () => { ... })
```

### 方式3: BDD Given-When-Then 解析

```gherkin
Given 商品总额为 100，优惠券为 150  // → R003
When 计算实付金额
Then 实付金额应为 0  // → R003 边界验证
```

## 偏差类型及严重程度

|偏差类型|严重程度|标记|处理方式|
|---|---|---|---|
|测试遗漏|⚠️ 中|`TEST_GAP`|补充测试用例|
|代码缺陷|🔴 高|`CODE_GAP`|修复代码实现|
|需求遗漏|💡 信息|`PRD_GAP`|反哺 PRD 文档|
|过度实现|⚠️ 中|`OVER_IMPL`|确认是否需要|
|实现偏差|🔴 高|`MISMATCH`|对齐 PRD 和代码|

## JSON 输出格式

```json
{
  "matrix_id": "matrix-001",
  "requirement_id": "REQ-001",
  "generated_at": "2026-07-09T10:00:00Z",
  "feBeSplit": true,
  "rules": [
    {
      "id": "R001",
      "description": "实付=总额-优惠+运费",
      "ownership": {
        "primary": "BE",
        "feResponsibility": "展示计算结果",
        "beResponsibility": "执行计算、存储结果"
      },
      "prd": { "exists": true, "location": "PRD.md:L45" },
      "code": { "exists": true, "location": "src/order/calculate.ts:L12" },
      "test": { "exists": true, "location": "test/order/calculate.test.ts:L23" },
      "status": "COVERED",
      "confidence": 0.95
    },
    {
      "id": "R004",
      "description": "地址为空默认运费",
      "prd": { "exists": true, "location": "PRD.md:L48" },
      "code": { "exists": false, "location": null },
      "test": { "exists": true, "location": "test/order/shipping.test.ts:L15" },
      "status": "CODE_GAP",
      "severity": "HIGH",
      "action": "补充代码实现"
    }
  ],
  "feBeSummary": {
    "frontend": { "total": 15, "covered": 12, "gap": 3 },
    "backend": { "total": 25, "covered": 18, "gap": 7 },
    "collaboration": { "total": 5, "covered": 3, "gap": 2 },
    "unknown": 2
  },
  "summary": {
    "total_rules": 5,
    "covered": 3,
    "test_gap": 1,
    "code_gap": 1,
    "coverage_rate": 0.6
  }
}
```

## 自动匹配策略

### 基于注解的精确匹配

```typescript
// @rule R001
function calculatePayable(...) { ... }

@Requirement("R001")
it('should_calculate_payable', ...)
```

### 基于语义的模糊匹配

```
规则描述: "实付金额不得小于0"
代码方法: Math.max(0, ...)  → 语义匹配: "下限约束"
测试名称: should_return_zero_when_negative  → 语义匹配: "零值边界"
```

### 基于命名的关键字匹配

```
规则关键词: "运费"
代码方法名: calculateShipping  → 关键字匹配: "shipping" ↔ "运费"
```
