---
name: coverage-matrix
description: 生成 PRD-代码-测试 三维覆盖矩阵，自动标记偏差、遗漏和需求反哺点。支持手动输入和 Git diff 自动提取。
---

# 覆盖矩阵生成

**目标：** 将 PRD 规则、代码实现、测试用例三者进行交叉比对，发现偏差和遗漏。

## 触发时机

- PRD 分析完成后
- 代码提交后需要检查对齐
- 测试用例编写后需要检查覆盖
- 代码审查前

## 矩阵生成流程

### Phase 1: 数据收集

```
PRD 分析结果 ──→ 规则列表（PRD 轴）
代码 diff ──→ 实现方法列表（Code 轴）  
测试用例 ──→ 测试方法列表（Test 轴）
```

#### 代码轴提取方式

**方式1: Git diff 提取**

```bash
# 获取变更的方法列表
git diff --name-only HEAD~1 | grep -E '\.(ts|js|vue)$' | \
  xargs grep -E '(function|const|class|export)' | \
  grep -v 'test|spec|mock'
```

**方式2: AST 提取（推荐）**

解析代码文件的 AST，提取：
- 函数签名（入参、出参）
- 类方法
- 条件分支
- 异常抛出

**方式3: 手动映射**

开发者在代码注释中标注对应的规则 ID：

```typescript
// @rule R001 - 实付金额计算
function calculatePayable(total: number, coupon: number, shipping: number): number {
  return Math.max(0, total - coupon + shipping); // @rule R003 - 不小于0
}
```

#### 测试轴提取方式

**方式1: 测试方法名解析**

```typescript
// 从方法名提取条件
it('should_return_zero_when_coupon_exceeds_total', ...)
// → 对应规则: R003 (实付 >= 0)
```

**方式2: @Requirement 注解**

```typescript
@Test
@Requirement("R001")  // 直接绑定 PRD 规则
describe('calculatePayable', () => { ... })
```

**方式3: BDD Given-When-Then 解析**

```gherkin
Given 商品总额为 100，优惠券为 150  // → R003
When 计算实付金额
Then 实付金额应为 0  // → R003 边界验证
```

### Phase 2: 矩阵构建

#### 覆盖矩阵结构

```markdown
# PRD-代码-测试 覆盖矩阵

**需求:** {{requirement_id}}
**生成时间:** {{timestamp}}

## 覆盖矩阵

| 规则ID | 规则描述 | PRD | 代码 | 测试 | 状态 | 备注 |
|--------|---------|-----|------|------|------|------|
| R001 | 实付=总额-优惠+运费 | ✅ | ✅ | ✅ | **已覆盖** | |
| R002 | 运费=f(地址) | ✅ | ✅ | ❌ | **测试遗漏** | 需补充地址计算测试 |
| R003 | 实付>=0 | ✅ | ✅ | ✅ | **已覆盖** | |
| R004 | 地址为空默认运费 | ✅ | ❌ | ✅ | **代码缺陷** | 代码未实现降级 |
| R005 | 并发不重复扣款 | ❌ | ✅ | ✅ | **需求遗漏** | 建议补充到 PRD |

## 统计摘要

| 指标 | 数值 |
|------|------|
| 总规则数 | 5 |
| 已覆盖 | 3 (60%) |
| 测试遗漏 | 1 (20%) |
| 代码缺陷 | 1 (20%) |
| 需求遗漏 | 1 (需反哺 PRD) |
```

### Phase 3: 偏差标记

**偏差类型及严重程度：**

| 偏差类型 | 严重程度 | 标记 | 处理方式 |
|---------|---------|------|---------|
| 测试遗漏 | ⚠️ 中 | `TEST_GAP` | 补充测试用例 |
| 代码缺陷 | 🔴 高 | `CODE_GAP` | 修复代码实现 |
| 需求遗漏 | 💡 信息 | `PRD_GAP` | 反哺 PRD 文档 |
| 过度实现 | ⚠️ 中 | `OVER_IMPL` | 确认是否需要 |
| 实现偏差 | 🔴 高 | `MISMATCH` | 对齐 PRD 和代码 |

**偏差自动检测规则：**

```
规则存在于 PRD 但代码中无对应实现 → CODE_GAP
规则存在于 PRD 但测试中无对应用例 → TEST_GAP
规则存在于代码和测试但 PRD 中无 → PRD_GAP（需反哺）
代码实现与 PRD 规则语义不一致 → MISMATCH（需人工确认）
```

### Phase 4: 输出格式

#### JSON 格式（供 CI 消费）

```json
{
  "matrix_id": "matrix-001",
  "requirement_id": "REQ-001",
  "generated_at": "2026-07-09T10:00:00Z",
  "rules": [
    {
      "id": "R001",
      "description": "实付=总额-优惠+运费",
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
  "summary": {
    "total_rules": 5,
    "covered": 3,
    "test_gap": 1,
    "code_gap": 1,
    "prd_gap": 1,
    "coverage_rate": 0.6
  }
}
```

#### Markdown 格式（供人工消费）

见 Phase 2 的输出模板。

## 自动匹配策略

### 基于注解的精确匹配

```typescript
// 代码中的 @rule 注解
// @rule R001
function calculatePayable(...) { ... }

// 测试中的 @Requirement 注解
@Requirement("R001")
it('should_calculate_payable', ...)
```

### 基于语义的模糊匹配

当没有注解时，使用语义相似度：

```
规则描述: "实付金额不得小于0"
代码方法: Math.max(0, ...)  → 语义匹配: "下限约束"
测试名称: should_return_zero_when_negative  → 语义匹配: "零值边界"
```

### 基于命名的关键字匹配

```
规则关键词: "运费"
代码方法名: calculateShipping  → 关键字匹配: "shipping" ↔ "运费"
测试方法名: test_shipping_default  → 关键字匹配: "shipping"
```

## 持续更新

### PRD 变更时

```
PRD diff → 新增/修改/删除规则 → 更新矩阵 → 标记需重新验证的条目
```

### 代码变更时

```
git diff → 新增/修改/删除方法 → 更新矩阵 → 标记受影响的规则
```

### 测试变更时

```
测试 diff → 新增/修改/删除用例 → 更新矩阵 → 更新覆盖率
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 规则列表
- **→ test-generation：** 基于 TEST_GAP 生成缺失测试
- **→ code-review-checklist：** 基于 CODE_GAP 生成审查项
- **→ ci-integration：** 矩阵 JSON 供 CI 消费
