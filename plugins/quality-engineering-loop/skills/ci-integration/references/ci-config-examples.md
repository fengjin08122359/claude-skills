# CI 集成 — 详细配置

## GitHub Actions 示例

```yaml
# .github/workflows/quality-loop.yml
name: Quality Engineering Loop

on:
  pull_request:
    paths:
      - 'docs/working/prd/**/*.md'
      - 'src/**/*.ts'
      - 'test/**/*.test.ts'

jobs:
  prd-analysis:
    if: contains(github.event.pull_request.changed_files, 'docs/working/prd/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run PRD Structured Analysis
        run: |
          npx quality-loop analyze \
            --input docs/working/prd/ \
            --output .quality-reports/prd-analysis.json
      - uses: actions/upload-artifact@v4
        with:
          name: prd-analysis
          path: .quality-reports/prd-analysis.json

  coverage-matrix:
    needs: prd-analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
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

  pr-comment:
    needs: coverage-matrix
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const matrix = require('./coverage-matrix/coverage-matrix.json');
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: generateCommentBody(matrix)
            });
```

## GitLab CI 示例

```yaml
quality-loop:
  stage: quality
  rules:
    - changes:
        - docs/working/prd/**/*.md
        - src/**/*.ts
        - test/**/*.test.ts
  script:
    - npx quality-loop analyze --input docs/working/prd/ --output .quality-reports/
    - npx quality-loop matrix --prd-analysis .quality-reports/prd-analysis.json
    - npx quality-loop check --threshold 0.80
  artifacts:
    paths:
      - .quality-reports/
    expire_in: 30 days
```

## Gerrit 集成

```bash
#!/bin/bash
PRD_FILES=$(git diff --name-only HEAD~1 | grep '^docs/working/prd/.*\.md$' || true)
CODE_FILES=$(git diff --name-only HEAD~1 | grep '^src/.*\.\(ts\|js\|vue\)$' || true)

if [ -n "$PRD_FILES" ]; then
  npx quality-loop analyze --input "$PRD_FILES" --output .quality-reports/prd-analysis.json
fi

if [ -n "$CODE_FILES" ]; then
  npx quality-loop matrix \
    --prd-analysis .quality-reports/prd-analysis.json \
    --code-diff "$CODE_FILES" \
    --test-dir test/ \
    --output .quality-reports/coverage-matrix.json

  COVERAGE=$(node -e "console.log(require('./.quality-reports/coverage-matrix.json').summary.coverage_rate)")
  if (( $(echo "$COVERAGE < 0.80" | bc -l) )); then
    echo "❌ 质量门禁未通过: 覆盖率 ${COVERAGE} < 0.80"
    exit 1
  fi
  echo "✅ 质量门禁通过: 覆盖率 ${COVERAGE}"
fi
```

## PR 评论模板

```markdown
## 🔄 Quality Loop 分析报告

**PRD 覆盖率:** {{coverage_rate}}% {{coverage_emoji}}
**CODE_GAP:** {{code_gap_count}} 个
**TEST_GAP:** {{test_gap_count}} 个

### 偏差详情

{{#if code_gaps}}
#### ⚠️ 代码未实现的规则
{{#each code_gaps}}
- **{{this.id}}** {{this.description}} — 请补充实现
{{/each}}
{{/if}}

### 建议的审查重点
{{#each review_focus}}
1. {{this}}
{{/each}}

---
*由 Quality Engineering Loop 自动生成*
```

## Artifact 存储结构

```text
.quality-reports/
├── prd-analysis.json
├── coverage-matrix.json
├── review-checklist.json
├── test-generation/
│   ├── bdd-scenarios.md
│   └── unit-test-scaffold.ts
├── summary.md
└── trend.json
```

## 趋势追踪

```json
{
  "history": [
    { "date": "2026-07-01", "coverage_rate": 0.65, "code_gaps": 5, "test_gaps": 8 },
    { "date": "2026-07-09", "coverage_rate": 0.82, "code_gaps": 2, "test_gaps": 3 }
  ]
}
```
