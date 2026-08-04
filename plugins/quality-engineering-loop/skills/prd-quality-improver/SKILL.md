---
name: prd-quality-improver
description: 通过测试用例和代码反馈反向提升 PRD 质量。覆盖 PRD 版本对比、边界场景完整性检查、规范性评估、改进建议生成、前后端职责划分检查。场景2的核心引擎。
---

# PRD 质量提升引擎

**目标：** 通过测试用例和代码实现的反馈，反向发现 PRD 的不足，提升 PRD 规范性和边界场景完整性。

## 覆盖场景

|场景|输入|输出|
|---|---|---|
|场景1: PRD 版本迭代|PRD v1, v2, v3...|版本 diff + 分析质量改进报告|
|场景2: PRD+测试→PRD改进|PRD + 测试用例|PRD 规范性评估 + 改进建议|

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/prd-quality-improver-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/prd-improvement.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## Phase 1: PRD 版本对比分析（场景1）

### 输入

```text
docs/working/prd/v1/订单模块.md   (或 git tag: prd-v1.0)
docs/working/prd/v2/订单模块.md
docs/working/prd/v3/订单模块.md   (当前版本)
```

### 分析流程

1. 结构化提取每个版本的规则集合
2. 计算规则集合的 diff（新增/修改/删除）
3. 对每条变更规则检查代码实现和测试覆盖
4. 生成版本演进趋势图
5. 识别"改进速度"（每版本提升的覆盖度）

### 输出

- 版本对比报告（规则变更追踪）
- 分析质量改进度量（趋势）

> 详细示例见 [references/improvement-examples.md](references/improvement-examples.md)

## Phase 2: 测试→PRD 改进建议（场景2）

### 输入

- PRD 文档（当前版本）
- 测试用例文件（已有测试）
- 可选：历史 Bug 列表

### PRD 质量评估维度

|维度|评估方式|
|---|---|
|**完整性**|PRD 规则数 vs 测试覆盖的场景数|
|**明确性**|PRD 中"可能"、"建议"、"尽量"等模糊词数量|
|**边界覆盖**|测试中的边界值 vs PRD 中的边界描述|
|**异常覆盖**|测试中的异常路径 vs PRD 中的异常描述|
|**一致性**|PRD 内部规则间是否有矛盾|
|**可测试性**|每条规则是否可生成测试用例|

### 分析流程

```
测试用例 → 提取测试覆盖的业务场景
  ↓
与 PRD 规则比对 → 发现 PRD 缺失/模糊之处
  ↓
生成 PRD 改进建议（按 P0/P1/P2 优先级排序）
```

### 输出

- PRD 质量评分（6 维 + 综合）
- 改进建议（按优先级排序，含建议文本）
- 版本趋势追踪

> 详细报告模板见 [references/improvement-examples.md](references/improvement-examples.md)

## 使用方式

```bash
# 场景1: 版本对比
/prd-quality-improver --versions v1,v2,v3 --compare

# 场景2: PRD+测试→改进
/prd-quality-improver --prd docs/working/prd/订单模块.md --tests test/order/
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 结构化分析结果
- **← test-generation：** 接收测试用例清单
- **← coverage-matrix：** 接收 PRD_GAP 列表
- **→ prd-structured-analysis（下一轮）：** 改进后的 PRD 重新进入分析
- **→ ci-integration：** 质量评分供 CI 门禁使用
