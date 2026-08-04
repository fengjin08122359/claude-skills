# PRD 结构化分析 — 详细示例

## 模式1: 规则元组提取

**输入段落示例：**
> "订单实付金额 = 商品总额 - 优惠券抵扣 + 运费，运费根据收货地址动态计算，且实付金额不得小于0。"

**提取过程：**

```
步骤1: 识别等式关系 → 计算公式
步骤2: 识别函数映射 → 运费 = f(地址)
步骤3: 识别约束条件 → 实付 >= 0
步骤4: 识别异常处理 → 地址为空时的降级
```

**输出：**

```json
{
  "rules": [
    {
      "id": "R001",
      "description": "实付金额 = 商品总额 - 优惠券抵扣 + 运费",
      "type": "calculation",
      "formula": "payable = total - coupon + shipping",
      "constraints": [],
      "priority": "P0"
    },
    {
      "id": "R002",
      "description": "运费根据收货地址动态计算",
      "type": "function_mapping",
      "input": "address",
      "output": "shipping_fee",
      "constraints": ["address != null"],
      "priority": "P0"
    },
    {
      "id": "R003",
      "description": "实付金额不得小于0",
      "type": "boundary_constraint",
      "expression": "payable >= 0",
      "enforcement": "mandatory",
      "priority": "P0"
    },
    {
      "id": "R004",
      "description": "地址为空时使用默认运费",
      "type": "fallback",
      "condition": "address == null || address == ''",
      "default": "shipping_fee = DEFAULT_SHIPPING",
      "priority": "P1"
    }
  ]
}
```

## 模式2: 状态迁移表提取

**输入段落示例：**
> "订单支付后，状态从'待支付'变为'已支付'，若30分钟未支付则自动取消。"

**提取过程：**

```
步骤1: 识别状态节点 → 待支付、已支付、已取消
步骤2: 识别迁移动作 → 支付成功、超时取消
步骤3: 识别触发条件 → 支付回调、T+30min
步骤4: 推导非法迁移 → 已支付→已取消(非法)
步骤5: 识别并发风险 → 同时到达的竞态
```

**输出：**

```json
{
  "stateMachine": {
    "name": "order_payment",
    "states": ["待支付", "已支付", "已取消"],
    "transitions": [
      {
        "from": "待支付",
        "to": "已支付",
        "trigger": "支付成功回调",
        "condition": "amount_match",
        "legal": true
      },
      {
        "from": "待支付",
        "to": "已取消",
        "trigger": "超时30分钟",
        "condition": "auto",
        "legal": true
      },
      {
        "from": "已支付",
        "to": "已取消",
        "trigger": "取消请求",
        "legal": false,
        "reason": "已支付订单不允许取消"
      }
    ],
    "timeTriggers": [
      {
        "state": "待支付",
        "duration": "30min",
        "action": "auto_cancel",
        "raceConditions": [
          "支付回调在 T+29min59s 和 T+30min01s 同时到达"
        ]
      }
    ]
  }
}
```

## 模式3: 隐性规则显性化

**输入段落示例：**
> "用户查看订单列表，默认按时间倒序，仅展示最近3个月的订单。"

**输出：**

```json
{
  "explicitRules": [
    {
      "id": "Q001",
      "description": "按时间倒序排列",
      "sql": "ORDER BY create_time DESC",
      "index_required": true
    },
    {
      "id": "Q002",
      "description": "仅展示最近3个月",
      "sql": "WHERE create_time >= NOW() - INTERVAL 3 MONTH",
      "index_required": true
    }
  ],
  "implicitRules": [
    {
      "id": "QI001",
      "description": "必须支持分页",
      "reason": "3个月数据量可能极大，不分页导致性能问题",
      "risk": "HIGH",
      "verification": "LIMIT 检查 + 分页大小上限"
    },
    {
      "id": "QI002",
      "description": "必须有索引",
      "reason": "create_time 字段需要索引支持排序和过滤",
      "risk": "HIGH",
      "verification": "EXPLAIN 查询计划检查"
    },
    {
      "id": "QI003",
      "description": "数据权限隔离",
      "reason": "用户只能查看自己的订单",
      "risk": "HIGH",
      "verification": "WHERE user_id = current_user"
    }
  ]
}
```

## 异常处理模式识别

|PRD 关键词|异常类型|预期处理|验证方式|
|---|---|---|---|
|"如果…那么…"|条件分支|分支覆盖|单元测试|
|"超时"|超时异常|重试/降级|集成测试|
|"并发"|竞态条件|锁/幂等|并发测试|
|"为空"|空值异常|默认值/报错|边界测试|
|"不允许"|非法操作|拦截+提示|权限测试|
|"网络异常"|网络故障|重试+降级|故障注入|
|"数据不一致"|数据异常|事务回滚|数据完整性测试|

## Markdown 输出模板

```markdown
# PRD 结构化分析报告

**PRD 文件：** {{prd_file}}
**分析时间：** {{timestamp}}

## 1. 规则元组
| 规则ID | 规则描述 | 类型 | 约束 | 优先级 |
|--------|---------|------|------|--------|
{{rules_table}}

## 2. 状态迁移表
| 当前状态 | 触发动作 | 目标状态 | 条件 | 非法? |
|---------|---------|---------|------|-------|
{{state_table}}

## 3. 边界场景矩阵
| 场景ID | 场景描述 | 边界值 | 预期行为 | 风险等级 |
|--------|---------|--------|---------|---------|
{{boundary_table}}

## 4. 异常处理逻辑
| 异常ID | 异常类型 | 触发条件 | 预期处理 | 验证方式 |
|--------|---------|---------|---------|---------|
{{exception_table}}

## 5. 隐性规则
| 规则ID | 隐性规则 | 来源 | 风险等级 | 验证方式 |
|--------|---------|------|---------|---------|
{{implicit_table}}

## 6. 待确认问题
| 问题ID | 问题描述 | 影响范围 | 建议假设 |
|--------|---------|---------|---------|
{{questions_table}}
```

## 质量检查清单

- [ ] 所有 PRD 中的"必须"、"禁止"是否都提取为约束规则？
- [ ] 所有数值范围是否都有边界值？
- [ ] 所有状态流转是否都列出了合法/非法迁移？
- [ ] 所有外部依赖是否都有降级策略？
- [ ] 所有列表查询是否检查了分页和索引？
- [ ] 是否有并发场景需要处理竞态？
- [ ] 待确认问题是否已标记并通知产品？
