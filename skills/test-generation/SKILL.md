---
name: test-generation
description: 将已有测试用例与 PRD 规则进行对齐比较，发现覆盖缺口；并将测试用例转化为可执行的单元测试代码（Jest/Vitest）。支持按前后端范围生成测试。不凭空生成测试用例。
---

# 测试用例对齐 & 单元测试生成

**核心定位：不凭空生成测试用例，而是：**

1. **测试用例 ↔ PRD 对齐比较** — 已有测试是否覆盖了 PRD 规则？
2. **测试用例 → 单元测试代码** — 将测试用例转化为可执行的 Jest/Vitest 代码
3. **前后端测试分离** — 按 FE/BE/Integration 范围生成测试

## 触发时机

- 已有测试用例（手工用例/Excel/Markdown），需要检查与 PRD 的对齐度
- 已有测试用例描述，需要转化为可执行的单元测试代码
- 代码审查前需要确认测试覆盖
- 需要按前后端分离生成测试用例

## 执行环境规范

### 临时工作目录

**所有中间产物必须在临时目录中生成**，不污染项目源码和 skill 目录。

```text
<项目根目录>/.temp/test-generation-<YYYYMMDD-HHMMSS>/
```

### 环境感知

每次执行前，**必须先检测并记录当前环境信息**（操作系统、项目根目录、执行时间、Shell 类型），保存为 `.env.json` 放在临时目录根。

### 最终输出物保存位置

最终输出物**不保存在 skill 目录中**，而是保存到项目目录：`tests/quality-loop/<模块名>/`。

### 清理规范

任务结束后**必须执行清理**：将最终输出物转移到项目目录 → 删除整个临时目录 → 输出清理确认日志。

### 异常处理

- 中断或失败时，临时目录**保留**（不清理），便于排查
- 保留 `.status.json` 记录执行状态（running / success / failed）

---

## 输入

| 输入 | 格式 | 来源 |
| --- | --- | --- |
| PRD 规则列表 | JSON/Markdown | `prd-structured-analysis` 输出 |
| 已有测试用例 | Excel/Markdown/文本 | 测试团队编写的手工用例 |
| 可选：已有单元测试 | .test.ts/.spec.ts | 代码仓库中已有的测试 |

## 参数说明

| 参数 | 说明 | 示例 |
| ---- | ---- | ---- |
| `--scope` | 测试范围：frontend/backend/integration/all | `--scope frontend` |
| `--fe-paths` | 前端代码路径（scope=frontend 时使用） | `--fe-paths src/components` |
| `--be-paths` | 后端代码路径（scope=backend 时使用） | `--be-paths src/services` |

## Phase 1: 测试用例 ↔ PRD 对齐比较

### 步骤1: 提取测试用例结构

从各种格式的测试用例中提取结构化信息：

```markdown
## 输入测试用例（手工用例示例）

| 用例ID | 用例名称 | 前置条件 | 操作步骤 | 预期结果 | 优先级 |
|--------|---------|---------|---------|---------|--------|
| TC001 | 正常支付 | 已创建待支付订单 | 点击支付 | 订单变为已支付 | P0 |
| TC002 | 超时取消 | 订单创建超过30分钟 | 系统自动检查 | 订单变为已取消 | P0 |
| TC003 | 重复支付 | 订单已支付 | 再次调用支付 | 返回已支付 | P1 |
```

### 步骤2: 建立测试-规则映射

```
测试用例 → 提取关键词 → 与 PRD 规则匹配 → 生成映射表
```

**匹配策略：**

| 匹配方式 | 说明 | 示例 |
|---------|------|------|
| 关键词匹配 | 测试名称/步骤中的关键词与规则描述匹配 | "支付" → SM001(支付迁移) |
| 语义匹配 | 测试的预期结果与规则的约束匹配 | "返回已支付" → SM010(幂等) |
| 注解匹配 | 测试用例中标注的 @Requirement 注解 | @REQ(R001) → R001 |

### 步骤3: 生成对齐报告

```markdown
# 测试用例-PRD 对齐报告

**PRD:** docs/prd/订单模块.md
**测试用例:** test-cases/订单测试用例.xlsx
**分析时间:** 2026-07-09

## 对齐矩阵

| PRD 规则 | 规则描述 | 对应用例 | 对齐状态 |
|---------|---------|---------|---------|
| R001 | 实付=总额-优惠+运费 | TC010, TC011 | ✅ 已覆盖 |
| R002 | 运费=f(城市) | TC012 | ✅ 已覆盖 |
| R003 | 实付>=0 | — | 🔴 无对应用例 |
| R004 | 满99免运费 | — | 🔴 无对应用例 |
| R005 | 优惠券<=总额 | — | 🔴 无对应用例 |
| R007 | 地址为空→默认运费 | TC015 | ✅ 已覆盖 |
| SM001 | PENDING→PAID | TC001 | ✅ 已覆盖 |
| SM002 | PENDING→CANCELLED | TC002 | ✅ 已覆盖 |
| SM009 | 支付+超时竞态 | — | 🔴 无对应用例 |
| SM010 | 重复回调幂等 | TC003 | ✅ 已覆盖 |

## 统计

| 指标 | 数值 |
|------|------|
| PRD 规则总数 | 10 |
| 已有测试覆盖 | 6 (60%) |
| 测试缺口 | 4 (R003, R004, R005, SM009) |
| 冗余测试 | 2 (TC020, TC021 无对应 PRD 规则) |

## 缺口详情

### 🔴 需补充的测试用例

| 缺口 | 对应规则 | 建议用例名 | 建议场景 |
|------|---------|-----------|---------|
| GAP-1 | R003: 实付>=0 | 优惠券超过总额 | 总额50,优惠80,运费10 → 实付=0 |
| GAP-2 | R004: 满99免运费 | 恰好99元免运费 | 总额99 → 运费=0 |
| GAP-3 | R005: 优惠券<=总额 | 超额优惠券 | 面额200,总额100 → 抵扣100 |
| GAP-4 | SM009: 并发竞态 | 支付+超时同时 | 同时触发 → 仅一个生效 |

### 💡 冗余测试（无对应 PRD 规则）

| 用例 | 描述 | 建议 |
|------|------|------|
| TC020 | 导出订单为Excel | 确认是否为 PRD 遗漏 |
| TC021 | 订单备注功能 | 确认是否为 PRD 遗漏 |
```

## Phase 2: 测试用例 → 单元测试代码

### 步骤1: 测试用例结构化

将手工测试用例转化为结构化的测试描述：

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

### 步骤2: 生成单元测试代码

**将结构化的测试用例转化为 Jest/Vitest 代码：**

```typescript
// order-state-machine.test.ts
// 基于测试用例自动生成
// 用例来源: test-cases/订单测试用例.xlsx
// PRD 对齐: coverage-matrix.json

import { describe, it, expect, beforeEach } from 'vitest';
import { OrderStateMachine } from '@/order/state-machine';

describe('订单状态流转', () => {

  // ─── TC001: 正常支付 ───
  // PRD规则: SM001 (PENDING→PAID)
  // 优先级: P0
  describe('TC001: 正常支付', () => {
    let sm: OrderStateMachine;

    beforeEach(() => {
      sm = new OrderStateMachine();
    });

    it('should_transition_to_paid_on_success', async () => {
      // Given: 已创建待支付订单
      sm.init('PENDING');
      const orderId = 'ORDER-001';

      // When: 支付成功回调
      await sm.transition('PAID', {
        orderId,
        amount: 100,
        txId: 'TX-001'
      });

      // Then: 订单状态变为已支付
      expect(sm.state).toBe('PAID');
    });
  });

  // ─── TC002: 超时取消 ───
  // PRD规则: SM003 (PENDING→CANCELLED on timeout)
  // 优先级: P0
  describe('TC002: 超时取消', () => {
    it('should_cancel_order_after_30min_timeout', async () => {
      // Given: 订单创建超过30分钟
      const sm = new OrderStateMachine();
      sm.init('PENDING');
      sm.setCreatedAt(Date.now() - 31 * 60 * 1000); // 31分钟前

      // When: 系统自动检查超时
      await sm.handleTimeoutCheck();

      // Then: 订单变为已取消
      expect(sm.state).toBe('CANCELLED');
    });
  });

  // ─── TC003: 重复支付 ───
  // PRD规则: SM010 (幂等)
  // 优先级: P1
  describe('TC003: 重复支付幂等', () => {
    it('should_return_paid_when_already_paid', async () => {
      // Given: 订单已支付
      const sm = new OrderStateMachine();
      sm.init('PAID');

      // When: 再次调用支付（相同交易号）
      const result = await sm.transition('PAID', {
        txId: 'TX-001',
        amount: 100
      });

      // Then: 幂等返回，状态不变
      expect(result.idempotent).toBe(true);
      expect(sm.state).toBe('PAID');
    });
  });
});
```

### 步骤3: 生成对齐统计注释

在生成的测试文件中包含对齐信息：

```typescript
/**
 * 测试-PRD 对齐统计
 * ─────────────────────────────────────
 * 总用例数: 15
 * PRD 覆盖: 10/10 (100%)
 * 缺口:     0
 * 冗余:     2 (TC020, TC021 - 可能为 PRD 遗漏)
 *
 * 用例映射:
 *   TC001 → SM001 ✅
 *   TC002 → SM003 ✅
 *   TC003 → SM010 ✅
 *   TC010 → R001  ✅
 *   ...
 *
 * @see docs/prd/订单模块.md
 * @see .quality-reports/coverage-matrix.json
 */
```

## 输出物

| 输出 | 格式 | 内容 |
|------|------|------|
| 对齐报告 | Markdown | 测试用例 ↔ PRD 规则的映射 + 缺口列表 |
| 单元测试代码 | TypeScript | 从测试用例转化的 Jest/Vitest 可执行代码 |
| 缺口建议 | Markdown | 需要补充的测试用例描述 |
| 冗余标记 | Markdown | 无对应 PRD 规则的测试用例（可能是 PRD 遗漏） |

## 使用方式

```bash
# 场景1: 对齐比较（不生成代码）
/test-generation --prd rules.json --test-cases test-cases.xlsx --align-only

# 场景2: 生成单元测试代码
/test-generation --test-cases test-cases.xlsx --output test/order/

# 场景3: 对齐比较 + 生成代码
/test-generation --prd rules.json --test-cases test-cases.xlsx --output test/order/
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 规则列表作为对齐基准
- **← coverage-matrix：** 接收 TEST_GAP 列表（哪些规则缺测试）
- **→ 测试团队：** 缺口建议反馈给测试团队补充用例
- **→ code-review-checklist：** 单元测试文件供代码审查参考
- **→ standards-backfill-engine：** 测试模式供规范提取
