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

**临时目录：** `<项目根目录>/.scratch/code-review-checklist-<YYYYMMDD-HHMMSS>/`

**输出位置：** `docs/working/quality-loop/<YYYYMMDD>/checklist.md`

**清理：** 任务结束后必须删除临时目录；中断时保留便于排查

## Checklist 生成流程

### Phase 1: 从 PRD 规则生成审查项

|PRD 规则类型|生成审查项|
|---|---|
|计算规则|计算公式是否正确？计算顺序？数值类型安全？|
|约束规则|是否有下限保护？所有路径是否经过约束检查？|
|异常处理|空值检查？默认值可配置？日志记录？|
|状态迁移|非法迁移拦截？错误提示？并发保护？|

### Phase 2: Checklist 模板

```markdown
## 必检项（P0）
### 计算规则审查
| # | 审查项 | 规则ID | 检查点 | 通过? |
|---|--------|--------|--------|------|
| 1 | 实付计算公式是否正确 | R001 | `total - coupon + shipping` | ☐ |
| 2 | 实付下限保护 | R003 | `Math.max(0, ...)` | ☐ |

### 异常处理审查
| 4 | 地址为空降级 | R004 | null/undefined检查 | ☐ |

### 状态机审查
| 7 | 非法迁移拦截 | SM001 | 已支付→取消 拦截 | ☐ |
```

> 详细模板见 [references/checklist-templates.md](references/checklist-templates.md)

### Phase 3: 自动偏差检测

当有代码 diff 时，自动对比规则实现。

**代码扫描策略：**

|PRD 规则类型|扫描目标|搜索关键词|
|---|---|---|
|计算规则|计算公式、函数|函数名、变量名|
|状态机|状态枚举、转换逻辑|状态名、switch/case|
|约束条件|校验逻辑、边界检查|if/else、validate|
|异常处理|try/catch、错误处理|catch、error、fallback|

**匹配状态：**

|状态|含义|审查建议|
|---|---|---|
|MATCHED|代码与 PRD 完全匹配|✅ 通过|
|PARTIAL|部分匹配|⚠️ 需检查遗漏|
|MISSING|代码中未找到|❌ 需补充实现|
|EXTRA|PRD 未定义的逻辑|🔍 确认隐性需求|

### Phase 4: 审查评论生成

自动生成 PR 评论，包含已实现/需关注/建议优化的分类。

## 反向填充开发规范

当审查中发现反复出现的模式问题（≥3次），反向填充开发规范。

> 详细示例见 [references/checklist-templates.md](references/checklist-templates.md)

## 参数说明

|参数|说明|示例|
|---|---|---|
|`<rules_file>`|PRD 结构化分析结果文件|`docs/working/prd/xxx.rules.json`|
|`--code-paths`|代码目录路径，多个用逗号分隔|`src/,components/`|
|`--diff-only`|仅扫描 diff 涉及的代码|-|
|`--output-format`|输出格式：json/markdown/both|`json`|

## 使用方式

```bash
# 基于 rules.json 生成审查清单
/code-review-checklist docs/working/prd/xxx.rules.json --code-paths src/

# 扫描多个代码目录
/code-review-checklist docs/working/prd/xxx.rules.json --code-paths src/,components/,packages/shared/

# 仅扫描 diff 涉及的代码
/code-review-checklist docs/working/prd/xxx.rules.json --code-paths src/ --diff-only
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收规则列表生成审查项
- **← coverage-matrix：** 接收 CODE_GAP/MISMATCH 定向审查
- **→ ci-integration：** Checklist JSON 供 CI 自动审查
- **→ 开发规范：** 模式问题反向填充规范
