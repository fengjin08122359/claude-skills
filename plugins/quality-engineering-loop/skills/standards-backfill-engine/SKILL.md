---
name: standards-backfill-engine
description: 从代码实现和测试用例中提取模式，反向填充开发规范。支持前后端分别提取规范。覆盖场景3（代码+测试→规范反哺）和场景4（代码+PRD+测试→代码范式）的核心引擎。
---

# 开发规范反向填充引擎

**目标：** 从代码和测试的模式中提取可复用的开发规范，持续提升团队代码稳定性和范式一致性。

## 覆盖场景

|场景|输入|输出|
|---|---|---|
|场景3: 代码+测试→规范反哺|代码 + 测试用例|开发规范条目 + 覆盖矩阵更新|
|场景4: 代码+PRD+测试→代码范式|代码 + PRD + 测试|代码稳定性评估 + 范式建议|

## 执行环境规范

**临时目录：** `<项目根目录>/.scratch/standards-backfill-engine-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/dev-standard.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## Phase 1: 模式提取引擎（场景3）

### 从代码中提取模式

```text
代码仓库 → AST 分析 → 模式识别 → 规范候选
```

**提取维度：**

|维度|提取方式|规范候选示例|
|---|---|---|
|错误处理|扫描 try-catch|"外部服务调用必须有降级策略"|
|数值计算|扫描 Math.max/min|"金额计算必须用整数分"|
|空值处理|扫描 ?.、??|"外部入参必须做空值检查"|
|状态管理|扫描状态机|"状态变更必须通过白名单"|
|并发控制|扫描 lock、version|"并发操作必须用乐观锁"|
|数据查询|扫描 LIMIT|"列表查询必须分页"|

### 从测试中提取模式

|维度|提取方式|规范候选示例|
|---|---|---|
|测试命名|分析 describe/it 命名|"测试命名: should_X_when_Y"|
|BDD 结构|分析 Given-When-Then|"每个测试必须有 GWT 结构"|
|边界测试|分析边界值测试比例|"每条规则至少3个测试"|

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
生成规范变更建议 → 人工评审确认 → 写入规范文档
```

> 详细示例见 [references/backfill-examples.md](references/backfill-examples.md)

## Phase 2: 代码稳定性评估（场景4）

### 三方综合评估

当同时有 PRD + 代码 + 测试时，进行综合评估。

### 稳定性评估维度

|维度|评估方式|指标|
|---|---|---|
|规则一致性|PRD 规则 ↔ 代码实现|一致率|
|测试完备性|正常+边界+异常测试|完备率|
|防御性|空值/边界/异常保护|防御度|
|幂等性|可重复操作是否幂等|幂等覆盖率|
|可观测性|日志/指标覆盖|可观测度|
|范式一致性|团队约定模式遵循|范式符合率|

### 输出

- 稳定性评分（6 维 + 综合）
- 风险项（高/中/低）
- 范式建议
- 稳定性趋势追踪

> 详细报告模板见 [references/backfill-examples.md](references/backfill-examples.md)

## 使用方式

```bash
# 场景3: 代码+测试→规范反哺
/standards-backfill-engine --code src/order/ --tests test/order/

# 场景4: 代码+PRD+测试→稳定性评估
/standards-backfill-engine --code src/ --prd docs/working/prd/订单.md --tests test/
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收 PRD 规则
- **← coverage-matrix：** 接收覆盖矩阵
- **← test-generation：** 接收测试用例清单
- **← code-review-checklist：** 接收代码审查发现
- **→ 开发规范文档：** 输出规范变更建议
- **→ ci-integration：** 稳定性评分供 CI 门禁使用
