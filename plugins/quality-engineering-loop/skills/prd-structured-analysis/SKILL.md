---
name: prd-structured-analysis
description: 对 PRD 文档进行结构化分析，提取规则元组、状态迁移表、边界场景矩阵和异常处理逻辑。支持前后端职责划分，输出 JSON 或 Markdown 格式。
---

# PRD 结构化分析

**目标：** 将自然语言 PRD 转化为可计算、可比对的结构化规约，并明确前后端职责归属。

## 触发时机

- 收到新的 PRD 文档需要评审
- PRD 发生变更需要重新分析
- 需要生成测试用例前
- 代码审查前需要需求基线

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/prd-structured-analysis-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/analysis.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## 分析流程

### Phase 1: 文档预处理

**分类标记规则：**

|关键词模式|分类|提取模式|
|---|---|---|
|"计算"、"等于"、"公式"、"金额"|计算规则|规则元组|
|"状态"、"流转"、"变为"、"超时"|状态机|状态迁移表|
|"列表"、"查询"、"展示"、"排序"|查询规则|隐性规则显性化|
|"必须"、"禁止"、"不允许"|约束条件|约束规则|
|"异常"、"失败"、"降级"、"默认"|异常处理|降级规则|

### Phase 2: 模式提取

三种核心提取模式：

1. **规则元组** — 从计算/规则类需求提取最小规则单元（R001-R999）
2. **状态迁移表** — 从状态机/流转类需求提取合法/非法迁移（SM001-SM999）
3. **隐性规则显性化** — 从查询/列表类需求推导隐性约束（QI001-QI999）

> 详细示例见 [references/extraction-examples.md](references/extraction-examples.md)

### Phase 3: 异常处理逻辑提取

识别 PRD 中的异常模式，生成异常处理清单。

### Phase 4: 前后端职责划分（可选）

使用 `--fe-be-split` 参数启用，为每条规则标注归属：

|归属|判定标准|
|---|---|
|FE|用户可见的交互、展示逻辑|
|BE|数据存储、业务规则、调度|
|FE+BE|需要接口约定的协作|
|UNKNOWN|PRD 描述不清、需确认|

### Phase 5: 输出格式

支持 JSON（供下游 skill 消费）和 Markdown（供人工消费）两种格式。

## 参数说明

|参数|说明|示例|
|---|---|---|
|`<prd-file>`|PRD 文件路径|`docs/working/prd/订单模块.md`|
|`--fe-be-split`|启用前后端职责划分|-|
|`--output-format`|输出格式：json/markdown/both|`json`|

## 使用方式

```bash
/prd-structured-analysis docs/working/prd/订单模块.md
/prd-structured-analysis docs/working/prd/订单模块.md --fe-be-split
```

## 与下游技能的衔接

- **→ coverage-matrix：** 分析结果作为矩阵的 PRD 轴
- **→ test-generation：** 每条规则/边界/异常生成对应测试
- **→ code-review-checklist：** 规则和约束转化为审查项
