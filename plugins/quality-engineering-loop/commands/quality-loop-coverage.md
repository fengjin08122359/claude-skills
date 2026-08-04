# Coverage Check — 覆盖率检查

快速检查当前代码的 PRD 规则覆盖率。

## 用法

```
/quality-loop-coverage [--threshold 0.80]
```

## 参数

|参数|说明|默认值|
|---|---|---|
|`--threshold`|覆盖率阈值|0.80|
|`--code-paths`|代码路径|src/|
|`--test-dir`|测试目录|test/|

## 输出

```markdown
## 覆盖率报告

- 规则总数: 27
- 已覆盖: 22 (81%)
- CODE_GAP: 2
- TEST_GAP: 3
- ✅ 通过（≥ 80%）
```
