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

- 已有测试用例需要检查与 PRD 的对齐度
- 已有测试用例需要转化为可执行的单元测试代码
- 代码审查前需要确认测试覆盖
- 需要按前后端分离生成测试用例

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/test-generation-<YYYYMMDD-HHMMSS>/`

**输出位置：** `tests/quality-loop/<模块名>/`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## 输入

|输入|格式|来源|
|---|---|---|
|PRD 规则列表|JSON/Markdown|`prd-structured-analysis` 输出|
|已有测试用例|Excel/Markdown/文本|测试团队编写的手工用例|
|可选：已有单元测试|.test.ts/.spec.ts|代码仓库中已有的测试|

## Phase 1: 测试用例 ↔ PRD 对齐比较

### 步骤1: 提取测试用例结构

从各种格式的测试用例中提取结构化信息。

### 步骤2: 建立测试-规则映射

**匹配策略：**

|匹配方式|说明|示例|
|---|---|---|
|关键词匹配|测试名称/步骤中的关键词|"支付" → SM001|
|语义匹配|预期结果与规则约束匹配|"返回已支付" → SM010(幂等)|
|注解匹配|@Requirement 注解|@REQ(R001) → R001|

### 步骤3: 生成对齐报告

输出对齐矩阵、统计信息、缺口详情。

> 详细示例见 [references/generation-examples.md](references/generation-examples.md)

## Phase 2: 测试用例 → 单元测试代码

### 步骤1: 测试用例结构化

将手工用例转化为 GWT (Given-When-Then) 结构化描述。

### 步骤2: 生成 Jest/Vitest 代码

从结构化描述生成可执行的测试代码，包含 PRD 规则映射注释。

### 步骤3: 生成对齐统计注释

在生成的测试文件中包含对齐信息（覆盖率、缺口、冗余）。

## 输出物

|输出|格式|内容|
|---|---|---|
|对齐报告|Markdown|测试用例 ↔ PRD 规则的映射 + 缺口列表|
|单元测试代码|TypeScript|从测试用例转化的 Jest/Vitest 代码|
|缺口建议|Markdown|需要补充的测试用例描述|
|冗余标记|Markdown|无对应 PRD 规则的测试用例|

## 参数说明

|参数|说明|示例|
|---|---|---|
|`--scope`|测试范围：frontend/backend/integration/all|`--scope frontend`|
|`--fe-paths`|前端代码路径|`--fe-paths src/components`|
|`--be-paths`|后端代码路径|`--be-paths src/services`|
|`--align-only`|仅对齐比较，不生成代码|-|

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
- **← coverage-matrix：** 接收 TEST_GAP 列表
- **→ 测试团队：** 缺口建议反馈给测试团队
- **→ code-review-checklist：** 单元测试文件供代码审查参考
