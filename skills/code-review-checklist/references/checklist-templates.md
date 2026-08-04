# 代码审查 Checklist — 详细示例

## Checklist 模板

```markdown
# 代码审查 Checklist

**PR:** #{{pr_number}}
**PRD:** {{prd_file}}
**审查人:** {{reviewer}}

## 必检项（P0）

### 计算规则审查
| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 1 | 实付计算公式是否正确 | R001 | `total - coupon + shipping` | ☐ |
| 2 | 实付下限保护 | R003 | `Math.max(0, ...)` | ☐ |

### 异常处理审查
| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 4 | 地址为空降级 | R004 | null/undefined/空字符串检查 | ☐ |
| 5 | 降级日志记录 | R004 | warn 日志 | ☐ |

### 状态机审查
| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 7 | 非法迁移拦截 | SM001 | 已支付→取消 拦截 | ☐ |
| 8 | 并发竞态保护 | SM002 | 分布式锁或幂等 | ☐ |

## 建议检查项（P1）
| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 10 | 金额精度处理 | R001 | Decimal/分 而非浮点 | ☐ |
```

## 代码扫描策略

|PRD 规则类型|扫描目标|搜索关键词|
|---|---|---|
|计算规则|计算公式、函数|函数名、变量名、公式表达式|
|状态机|状态枚举、状态转换逻辑|状态名、switch/case|
|约束条件|校验逻辑、边界检查|if/else、validate、check|
|查询规则|数据库查询、API 调用|SQL、query、select|
|异常处理|try/catch、错误处理|catch、error、fallback|

## JSON 输出格式

```json
{
  "metadata": {
    "prdFile": "docs/working/prd/xxx.md",
    "codePaths": ["src/", "components/"],
    "totalRules": 45,
    "coveredRules": 32,
    "coverageRate": "71%"
  },
  "checklist": [
    {
      "ruleId": "NAM001",
      "ruleDescription": "报告样例标题命名",
      "codeLocation": { "file": "src/utils/reportNameGenerator.ts", "line": 42 },
      "implementationFound": true,
      "matchStatus": "MATCHED"
    },
    {
      "ruleId": "NAM004",
      "ruleDescription": "报告标题唯一性校验",
      "codeLocation": null,
      "implementationFound": false,
      "matchStatus": "MISSING"
    }
  ],
  "summary": { "matched": 28, "partial": 4, "missing": 8, "extra": 5 }
}
```

## 匹配状态

|状态|含义|审查建议|
|---|---|---|
|MATCHED|代码实现与 PRD 规则完全匹配|✅ 通过|
|PARTIAL|代码实现部分匹配 PRD 规则|⚠️ 需检查遗漏部分|
|MISSING|代码中未找到对应实现|❌ 需补充实现|
|EXTRA|代码中存在 PRD 未定义的逻辑|🔍 确认是否为隐性需求|

## PR 评论模板

```markdown
## 🔍 PRD 对齐审查结果

### ✅ 已正确实现
- **R001** 实付计算公式 — `calculatePayable()` 实现正确
- **R003** 实付下限约束 — 使用 `Math.max(0, ...)` 保护

### ⚠️ 需要关注
- **R004** 地址为空降级 — 代码中未找到空值检查逻辑
  - **建议：** 在 `calculateShipping()` 入口添加 `if (!address) return DEFAULT_SHIPPING`

### 📊 覆盖率
- PRD 规则覆盖率: 4/5 (80%)
```

## 反向填充开发规范

|发现的模式问题|反向填充的规范条目|
|---|---|
|多处缺少空值降级|"所有外部依赖入参必须有 null/undefined 检查"|
|多处缺少下限保护|"金额计算必须使用 Math.max/min 约束范围"|
|多处无日志记录|"降级/兜底逻辑必须记录 warn 级别日志"|
|多处无分页上限|"所有列表查询必须有 LIMIT 上限（默认100）"|
|多处浮点计算|"金额计算必须使用整数分或 Decimal 类型"|
