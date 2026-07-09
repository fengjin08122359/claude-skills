---
name: ci-integration
description: 配置 CI 流程，在 PRD 变更或代码提交时自动触发质量分析。支持前后端分离检查、文件路径过滤、artifact 存储、PR 评论集成和门禁检查。
---

# CI 集成入口

**目标：** 将质量闭环嵌入 CI/CD 流水线，实现自动化持续优化。支持前后端分离检查。

## 触发场景

| 触发场景 | 触发条件 | 执行动作 | 门禁 |
|---------|---------|---------|------|
| PRD 变更 | PRD 目录下 .md 文件变更 | 重新分析 + 生成报告 | 警告（不阻塞） |
| 代码提交 | src/ 下 .ts/.js/.vue 变更 | 检查规则覆盖 + 生成 Checklist | 覆盖率 ≥ 80% 才通过 |
| 测试提交 | test/ 下文件变更 | 更新覆盖矩阵 + 检查对齐 | 测试规则映射 ≥ 90% |
| PR 创建 | 新 PR | 生成审查报告 + PR 评论 | 无阻塞，仅提供信息 |

## 执行环境规范

### 临时工作目录

**所有中间产物必须在临时目录中生成**，不污染项目源码和 skill 目录。

```text
<项目根目录>/.temp/ci-integration-<YYYYMMDD-HHMMSS>/
```

### 环境感知

每次执行前，**必须先检测并记录当前环境信息**（操作系统、项目根目录、执行时间、Shell 类型），保存为 `.env.json` 放在临时目录根。

### 最终输出物保存位置

最终输出物**不保存在 skill 目录中**，而是保存到项目目录：`docs/quality-loop/<YYYYMMDD>/ci-report.md`。

### 清理规范

任务结束后**必须执行清理**：将最终输出物转移到项目目录 → 删除整个临时目录 → 输出清理确认日志。

### 异常处理

- 中断或失败时，临时目录**保留**（不清理），便于排查
- 保留 `.status.json` 记录执行状态（running / success / failed）

---

## CI 流水线配置

### GitHub Actions 示例

```yaml
# .github/workflows/quality-loop.yml
name: Quality Engineering Loop

on:
  pull_request:
    paths:
      - 'docs/prd/**/*.md'    # PRD 变更触发
      - 'src/**/*.ts'          # 代码变更触发
      - 'src/**/*.vue'
      - 'test/**/*.test.ts'    # 测试变更触发

jobs:
  # 阶段1: PRD 变更检测与分析
  prd-analysis:
    if: contains(github.event.pull_request.changed_files, 'docs/prd/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run PRD Structured Analysis
        run: |
          npx quality-loop analyze \
            --input docs/prd/ \
            --output .quality-reports/prd-analysis.json
      - name: Upload Analysis Artifact
        uses: actions/upload-artifact@v4
        with:
          name: prd-analysis
          path: .quality-reports/prd-analysis.json

  # 阶段2: 覆盖矩阵生成
  coverage-matrix:
    needs: prd-analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download PRD Analysis
        uses: actions/download-artifact@v4
        with:
          name: prd-analysis
      - name: Generate Coverage Matrix
        run: |
          npx quality-loop matrix \
            --prd-analysis .quality-reports/prd-analysis.json \
            --code-diff $(git diff --name-only origin/main) \
            --test-dir test/ \
            --output .quality-reports/coverage-matrix.json
      - name: Check Coverage Gate
        run: |
          COVERAGE=$(jq '.summary.coverage_rate' .quality-reports/coverage-matrix.json)
          if (( $(echo "$COVERAGE < 0.80" | bc -l) )); then
            echo "❌ Coverage rate $COVERAGE below 80% threshold"
            exit 1
          fi
      - name: Upload Matrix Artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-matrix
          path: .quality-reports/coverage-matrix.json

  # 阶段3: PR 评论
  pr-comment:
    needs: coverage-matrix
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download Reports
        uses: actions/download-artifact@v4
      - name: Post PR Comment
        uses: actions/github-script@v7
        with:
          script: |
            const matrix = require('./coverage-matrix/coverage-matrix.json');
            const body = generateCommentBody(matrix);
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
```

### GitLab CI 示例

```yaml
# .gitlab-ci.yml
quality-loop:
  stage: quality
  rules:
    - changes:
        - docs/prd/**/*.md
        - src/**/*.ts
        - test/**/*.test.ts
  script:
    - npx quality-loop analyze --input docs/prd/ --output .quality-reports/
    - npx quality-loop matrix --prd-analysis .quality-reports/prd-analysis.json
    - npx quality-loop check --threshold 0.80
  artifacts:
    paths:
      - .quality-reports/
    expire_in: 30 days
  allow_failure: false
```

### Gerrit 集成（适配当前项目）

```bash
#!/bin/bash
# scripts/quality-loop-gerrit.sh
# Gerrit hook: commit-msg 或 patchset-created

PRD_FILES=$(git diff --name-only HEAD~1 | grep '^docs/prd/.*\.md$' || true)
CODE_FILES=$(git diff --name-only HEAD~1 | grep '^src/.*\.\(ts\|js\|vue\)$' || true)
TEST_FILES=$(git diff --name-only HEAD~1 | grep '^test/.*\.test\.\(ts\|js\)$' || true)

if [ -n "$PRD_FILES" ]; then
  echo "🔍 PRD 变更检测: $PRD_FILES"
  npx quality-loop analyze --input "$PRD_FILES" --output .quality-reports/prd-analysis.json
fi

if [ -n "$CODE_FILES" ] || [ -n "$TEST_FILES" ]; then
  echo "📊 覆盖矩阵生成"
  npx quality-loop matrix \
    --prd-analysis .quality-reports/prd-analysis.json \
    --code-diff "$CODE_FILES" \
    --test-dir test/ \
    --output .quality-reports/coverage-matrix.json
  
  # 门禁检查
  COVERAGE=$(node -e "console.log(require('./.quality-reports/coverage-matrix.json').summary.coverage_rate)")
  THRESHOLD=0.80
  
  if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
    echo "❌ 质量门禁未通过: 覆盖率 ${COVERAGE} < ${THRESHOLD}"
    echo "   请补充缺失的测试用例或修复代码偏差"
    exit 1
  fi
  
  echo "✅ 质量门禁通过: 覆盖率 ${COVERAGE}"
fi
```

## 门禁规则配置

### 配置文件

```json
// .quality-loop.json
{
  "version": "1.0",
  "gates": {
    "coverage_rate": {
      "threshold": 0.80,
      "level": "error",
      "message": "PRD 规则覆盖率低于 80%"
    },
    "test_alignment_rate": {
      "threshold": 0.90,
      "level": "warning",
      "message": "测试对齐率低于 90%"
    },
    "code_gap_count": {
      "threshold": 0,
      "level": "error",
      "message": "存在 CODE_GAP: 代码未实现 PRD 规则"
    },
    "mismatch_count": {
      "threshold": 0,
      "level": "error",
      "message": "存在实现偏差: 代码与 PRD 不一致"
    }
  },
  "triggers": {
    "prd_change": {
      "paths": ["docs/prd/**/*.md"],
      "actions": ["analyze", "matrix"],
      "gate": false
    },
    "code_change": {
      "paths": ["src/**/*.ts", "src/**/*.vue"],
      "actions": ["matrix", "review"],
      "gate": true
    },
    "test_change": {
      "paths": ["test/**/*.test.ts"],
      "actions": ["matrix"],
      "gate": true
    }
  },
  "notifications": {
    "pr_comment": true,
    "slack": false,
    "artifact_retention_days": 30
  }
}
```

## Artifact 存储结构

```
.quality-reports/
├── prd-analysis.json           # PRD 结构化分析结果
├── coverage-matrix.json        # 覆盖矩阵
├── review-checklist.json       # 审查清单
├── test-generation/
│   ├── bdd-scenarios.md        # BDD 场景
│   └── unit-test-scaffold.ts   # 测试脚手架
└── summary.md                  # 人类可读的摘要报告
```

## PR 评论模板

```markdown
## 🔄 Quality Loop 分析报告

**PRD 覆盖率:** {{coverage_rate}}% {{coverage_emoji}}
**CODE_GAP:** {{code_gap_count}} 个
**TEST_GAP:** {{test_gap_count}} 个
**MISMATCH:** {{mismatch_count}} 个

### 偏差详情

{{#if code_gaps}}
#### ⚠️ 代码未实现的规则
{{#each code_gaps}}
- **{{this.id}}** {{this.description}} — 请补充实现
{{/each}}
{{/if}}

{{#if test_gaps}}
#### 📋 缺少测试的规则
{{#each test_gaps}}
- **{{this.id}}** {{this.description}} — 请补充测试
{{/each}}
{{/if}}

### 建议的审查重点

{{#each review_focus}}
1. {{this}}
{{/each}}

---
*由 Quality Engineering Loop 自动生成*
```

## 持续优化循环

```
PRD 变更 → 重新分析 → 更新矩阵 → 发现新偏差 → 触发修复
    ↑                                              ↓
    ←←←←←←← 修复完成 → 测试通过 → 合并 ←←←←←←←←←
```

**度量趋势追踪（CI artifact）：**

```json
// .quality-reports/trend.json
{
  "history": [
    {
      "date": "2026-07-01",
      "coverage_rate": 0.65,
      "code_gaps": 5,
      "test_gaps": 8,
      "prd_defect_rate": 0.35
    },
    {
      "date": "2026-07-09",
      "coverage_rate": 0.82,
      "code_gaps": 2,
      "test_gaps": 3,
      "prd_defect_rate": 0.18
    }
  ]
}
```

## 与其他技能的衔接

- **← prd-structured-analysis：** 接收分析结果
- **← coverage-matrix：** 接收矩阵 JSON
- **← code-review-checklist：** 接收 Checklist JSON
- **→ PR 评论/Slack/Artifact：** 输出报告和门禁结果
