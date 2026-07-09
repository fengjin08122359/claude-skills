---
name: code-review-checklist
description: 基于 PRD 结构化分析结果生成代码审查 Checklist，自动标记规则实现偏差、边界值遗漏和异常处理缺失。支持前后端分离审查、多目录代码扫描、手动审查和 CI 自动审查。
---

# 代码审查 Checklist

**目标：** 将 PRD 规则转化为审查项，让代码审查有据可依，而非凭经验。支持按前后端职责分别审查。

## 触发时机

- PR 创建时自动生成审查清单
- 代码审查前手动生成
- 发现 TEST_GAP/CODE_GAP 后定向审查

## 执行环境规范

### 临时工作目录

**所有中间产物必须在临时目录中生成**，不污染项目源码和 skill 目录。

```text
<项目根目录>/.temp/code-review-checklist-<YYYYMMDD-HHMMSS>/
```

### 环境感知

每次执行前，**必须先检测并记录当前环境信息**（操作系统、项目根目录、执行时间、Shell 类型），保存为 `.env.json` 放在临时目录根。

### 最终输出物保存位置

最终输出物**不保存在 skill 目录中**，而是保存到项目目录：`docs/quality-loop/<YYYYMMDD>/checklist.md`。

### 清理规范

任务结束后**必须执行清理**：将最终输出物转移到项目目录 → 删除整个临时目录 → 输出清理确认日志。

### 异常处理

- 中断或失败时，临时目录**保留**（不清理），便于排查
- 保留 `.status.json` 记录执行状态（running / success / failed）

---

## Checklist 生成流程

### Phase 1: 从 PRD 规则生成审查项

#### 计算规则 → 审查项

```text
PRD 规则: R001 实付 = 总额 - 优惠 + 运费
→ 审查项: 代码中是否有对应的计算公式？
→ 审查项: 计算顺序是否正确？（先减后加 vs 先加后减）
→ 审查项: 是否使用了安全的数值类型？（避免浮点精度问题）
```

#### 约束规则 → 审查项

```
PRD 规则: R003 实付 >= 0
→ 审查项: 是否有 Math.max(0, result) 或类似的下限保护？
→ 审查项: 是否所有计算路径都经过了约束检查？
```

#### 异常处理 → 审查项

```
PRD 规则: R004 地址为空 → 默认运费
→ 审查项: 地址参数是否有 null/undefined/空字符串 检查？
→ 审查项: 默认值是否可配置？
→ 审查项: 是否有日志记录降级发生？
```

#### 状态迁移 → 审查项

```
状态迁移: 已支付 → 取消 (非法)
→ 审查项: 是否有状态机校验逻辑？
→ 审查项: 非法迁移是否有明确的错误提示？
→ 审查项: 并发场景是否有分布式锁或幂等保护？
```

### Phase 2: Checklist 模板

```markdown
# 代码审查 Checklist

**PR:** #{{pr_number}}
**PRD:** {{prd_file}}
**分析版本:** {{version}}
**审查人:** {{reviewer}}

## 必检项（P0 - 必须通过）

### 计算规则审查

| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 1 | 实付计算公式是否正确 | R001 | `total - coupon + shipping` | ☐ |
| 2 | 实付下限保护 | R003 | `Math.max(0, ...)` 或等价逻辑 | ☐ |
| 3 | 运费计算逻辑 | R002 | 地址→运费映射是否完整 | ☐ |

### 异常处理审查

| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 4 | 地址为空降级 | R004 | null/undefined/空字符串检查 | ☐ |
| 5 | 降级日志记录 | R004 | 降级发生时是否有 warn 日志 | ☐ |
| 6 | 错误提示友好性 | — | 用户侧错误信息是否清晰 | ☐ |

### 状态机审查

| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 7 | 非法迁移拦截 | SM001 | 已支付→取消 是否有拦截 | ☐ |
| 8 | 并发竞态保护 | SM002 | 分布式锁或幂等设计 | ☐ |
| 9 | 超时处理 | SM003 | 30分钟超时逻辑是否正确 | ☐ |

## 建议检查项（P1 - 推荐通过）

| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 10 | 金额精度处理 | R001 | 使用 Decimal/分 而非浮点 | ☐ |
| 11 | 默认值可配置 | R004 | 默认运费是否来自配置 | ☐ |
| 12 | 索引检查 | QI002 | create_time 字段是否有索引 | ☐ |

## 审查摘要

| 维度 | 通过 | 未通过 | 未检查 |
|------|------|--------|--------|
| 计算规则 | 0/3 | 0/3 | 3/3 |
| 异常处理 | 0/3 | 0/3 | 3/3 |
| 状态机 | 0/3 | 0/3 | 3/3 |
| 建议项 | 0/3 | 0/3 | 3/3 |
```

### Phase 3: 自动偏差检测

**当有代码 diff 时，自动对比规则实现：**

**参数说明：**

```text
--code-paths <path1>[,<path2>,<path3>...]
```

支持传入多个代码目录路径，用逗号分隔。例如：

- `--code-paths src/` - 单个目录
- `--code-paths src/,components/,utils/` - 多个目录
- `--code-paths packages/app/src,packages/shared/src` - monorepo 多包

**执行流程：**

```text
步骤1: 解析代码路径参数，支持多个目录
步骤2: 扫描各目录下相关代码文件
步骤3: 将 PRD 规则映射到代码实现
步骤4: 生成代码审查清单
步骤5: 输出 code-review-checklist.json
```

**代码扫描策略：**

| PRD 规则类型 | 扫描目标               | 搜索关键词                       |
| ------------ | ---------------------- | -------------------------------- |
| 计算规则     | 计算公式、函数         | 函数名、变量名、公式表达式       |
| 状态机       | 状态枚举、状态转换逻辑 | 状态名、switch/case、状态机      |
| 约束条件     | 校验逻辑、边界检查     | if/else、validate、check、assert |
| 查询规则     | 数据库查询、API 调用   | SQL、query、select、orderBy      |
| 异常处理     | try/catch、错误处理    | catch、error、fallback、retry    |
| 命名规则     | 常量定义、配置         | 标题生成、命名、format           |

**输出格式：**

```json
{
  "metadata": {
    "prdFile": "docs/prd/xxx.md",
    "codePaths": ["src/", "components/"],
    "scanTime": "2026-07-09T10:00:00Z",
    "totalRules": 45,
    "coveredRules": 32,
    "uncoveredRules": 13,
    "coverageRate": "71%"
  },
  "checklist": [
    {
      "ruleId": "NAM001",
      "ruleDescription": "报告样例标题命名",
      "codeLocation": {
        "file": "src/utils/reportNameGenerator.ts",
        "line": 42,
        "function": "generateSampleTitle"
      },
      "implementationFound": true,
      "matchStatus": "MATCHED",
      "notes": "实现与PRD一致"
    },
    {
      "ruleId": "NAM004",
      "ruleDescription": "报告标题唯一性校验",
      "codeLocation": null,
      "implementationFound": false,
      "matchStatus": "MISSING",
      "notes": "未在代码中找到唯一性校验逻辑"
    }
  ],
  "summary": {
    "matched": 28,
    "partial": 4,
    "missing": 8,
    "extra": 5
  }
}
```

**匹配状态说明：**

| 状态    | 含义                             | 审查建议                 |
| ------- | -------------------------------- | ------------------------ |
| MATCHED | 代码实现与 PRD 规则完全匹配      | ✅ 通过                  |
| PARTIAL | 代码实现部分匹配 PRD 规则        | ⚠️ 需检查遗漏部分        |
| MISSING | 代码中未找到对应实现             | ❌ 需补充实现            |
| EXTRA   | 代码中存在 PRD 未定义的逻辑      | 🔍 确认是否为隐性需求    |

**偏差检测示例：**

```text
检测项:
├── 规则 R001: 代码中是否有计算公式？
│   ├── ✅ 找到: calculatePayable() 包含 total - coupon + shipping
│   └── 偏差: 无
├── 规则 R003: 是否有下限保护？
│   ├── ✅ 找到: Math.max(0, ...)
│   └── 偏差: 无
├── 规则 R004: 是否有空值检查？
│   ├── ❌ 未找到: address 参数无 null 检查
│   └── 偏差: CODE_GAP - 缺少降级逻辑
└── 状态机: 是否有状态校验？
    ├── ✅ 找到: validateTransition() 方法
    └── 偏差: 无（但建议增加日志）
```

### Phase 4: 审查评论生成

**自动生成 PR 评论：**

```markdown
## 🔍 PRD 对齐审查结果

### ✅ 已正确实现

- **R001** 实付计算公式 — `calculatePayable()` 实现正确
- **R003** 实付下限约束 — 使用 `Math.max(0, ...)` 保护

### ⚠️ 需要关注

- **R004** 地址为空降级 — 代码中未找到空值检查逻辑
  - **建议：** 在 `calculateShipping()` 入口添加 `if (!address) return DEFAULT_SHIPPING`
  - **参考：** PRD 第48行 "地址为空时使用默认运费"

### 💡 建议优化

- **SM002** 并发竞态 — 当前实现使用乐观锁，建议确认超时+支付并发场景
  - **测试建议：** 添加 T+30min 同时触发的并发测试

### 📊 覆盖率

- PRD 规则覆盖率: 4/5 (80%)
- 缺失: R004 (地址降级)
```

## 反向填充开发规范

**当审查中发现反复出现的模式问题时，反向填充开发规范：**

| 发现的模式问题 | 反向填充的规范条目 | 规范位置 |
|--------------|-----------------|---------|
| 多处缺少空值降级 | "所有外部依赖入参必须有 null/undefined 检查" | 开发规范-异常处理 |
| 多处缺少下限保护 | "金额计算必须使用 Math.max/min 约束范围" | 开发规范-计算安全 |
| 多处无日志记录 | "降级/兜底逻辑必须记录 warn 级别日志" | 开发规范-日志规范 |
| 多处无分页上限 | "所有列表查询必须有 LIMIT 上限（默认100）" | 开发规范-查询安全 |
| 多处浮点计算 | "金额计算必须使用整数分或 Decimal 类型" | 开发规范-数值精度 |

**规范反哺流程：**

```
审查发现模式问题（≥3次）
  → 标记为"反复出现的模式"
  → 建议新增开发规范条目
  → 人工确认后写入开发规范文档
  → 后续审查自动检查该规范
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收规则列表生成审查项
- **← coverage-matrix：** 接收 CODE_GAP/MISMATCH 定向审查
- **← test-generation：** 测试名称作为审查参考
- **→ ci-integration：** Checklist JSON 供 CI 自动审查
- **→ 开发规范：** 模式问题反向填充规范

## 参数说明

| 参数                 | 说明                                                     | 示例                                |
| -------------------- | -------------------------------------------------------- | ----------------------------------- |
| `<rules_file>`       | PRD 结构化分析结果文件（必选）                           | `docs/prd/智能写作.v31.rules.json`  |
| `--code-paths`       | 代码目录路径，支持多个用逗号分隔（可选）                 | `src/,components/,utils/`           |
| `--diff-only`        | 仅扫描 diff 涉及的代码（可选）                           | -                                   |
| `--output-format`    | 输出格式：json/markdown/both（可选，默认 both）          | `json`                              |

## 使用示例

```bash
# 基于 rules.json 生成审查清单（扫描单个目录）
/code-review-checklist docs/prd/智能写作.v31.rules.json --code-paths src/

# 扫描多个代码目录
/code-review-checklist docs/prd/智能写作.v31.rules.json --code-paths src/,components/,packages/shared/

# 仅扫描 diff 涉及的代码
/code-review-checklist docs/prd/智能写作.v31.rules.json --code-paths src/ --diff-only

# monorepo 多包扫描
/code-review-checklist docs/prd/智能写作.v31.rules.json --code-paths packages/app/src,packages/shared/src,packages/utils/src
```
