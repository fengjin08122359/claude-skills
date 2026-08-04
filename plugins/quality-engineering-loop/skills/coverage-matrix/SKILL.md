---
name: coverage-matrix
description: 生成 PRD-代码-测试 三维覆盖矩阵，自动标记偏差、遗漏和需求反哺点。支持前后端职责划分、手动输入和 Git diff 自动提取。
---

# 覆盖矩阵生成

**目标：** 将 PRD 规则、代码实现、测试用例三者进行交叉比对，发现偏差和遗漏，并明确前后端职责归属。

## 触发时机

- PRD 分析完成后
- 代码提交后需要检查对齐
- 测试用例编写后需要检查覆盖
- 代码审查前

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/coverage-matrix-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/matrix.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## 矩阵生成流程

### Phase 1: 数据收集

```text
PRD 分析结果 ──→ 规则列表（PRD 轴）
代码 diff ──→ 实现方法列表（Code 轴）  
测试用例 ──→ 测试方法列表（Test 轴）
```

**代码轴提取方式：**
1. Git diff 提取（自动）
2. AST 提取（推荐，解析函数签名、条件分支）
3. 手动映射（代码注释 `@rule R001`）

**测试轴提取方式：**
1. 测试方法名解析（`should_return_zero_when_...`）
2. `@Requirement` 注解（直接绑定 PRD 规则）
3. BDD Given-When-Then 解析

> 详细示例见 [references/matching-examples.md](references/matching-examples.md)

### Phase 2: 矩阵构建

|规则ID|规则描述|PRD|代码|测试|状态|备注|
|---|---|---|---|---|---|---|
|R001|实付=总额-优惠+运费|✅|✅|✅|已覆盖||
|R002|运费=f(地址)|✅|✅|❌|测试遗漏|需补充测试|
|R004|地址为空默认运费|✅|❌|✅|代码缺陷|未实现降级|
|R005|并发不重复扣款|❌|✅|✅|需求遗漏|建议补充PRD|

### Phase 3: 偏差标记

|偏差类型|严重程度|标记|处理方式|
|---|---|---|---|
|测试遗漏|⚠️ 中|`TEST_GAP`|补充测试用例|
|代码缺陷|🔴 高|`CODE_GAP`|修复代码实现|
|需求遗漏|💡 信息|`PRD_GAP`|反哺 PRD 文档|
|过度实现|⚠️ 中|`OVER_IMPL`|确认是否需要|
|实现偏差|🔴 高|`MISMATCH`|对齐 PRD 和代码|

### Phase 4: 输出格式

支持 JSON（供 CI 消费）和 Markdown（供人工消费）两种格式。

## 参数说明

|参数|说明|示例|
|---|---|---|
|`<prd-analysis>`|PRD 分析结果文件|`output/analysis.json`|
|`--code-diff`|代码 diff 文件或目录|`src/order/`|
|`--test-dir`|测试目录|`test/order/`|
|`--fe-be-split`|启用前后端职责划分|-|
|`--output-format`|输出格式|`json`|

## 使用方式

```bash
/coverage-matrix output/analysis.json --code-diff src/ --test-dir test/
/coverage-matrix output/analysis.json --code-diff src/ --fe-be-split
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 规则列表
- **→ test-generation：** 基于 TEST_GAP 生成缺失测试
- **→ code-review-checklist：** 基于 CODE_GAP 生成审查项
- **→ ci-integration：** 矩阵 JSON 供 CI 消费
