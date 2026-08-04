# PRD Diff — PRD 版本对比

对比不同版本的 PRD，生成变更报告。

## 用法

```
/quality-loop-prd-diff <version1> <version2>
```

## 参数

|参数|说明|
|---|---|
|`<version1>`|旧版本路径或 git tag|
|`<version2>`|新版本路径或 git tag|

## 执行流程

1. 提取两个版本的规则集合
2. 计算规则 diff（新增/修改/删除）
3. 检查每条变更的代码实现和测试覆盖
4. 生成版本对比报告

## 输出

```text
docs/working/quality-loop/<YYYYMMDD>/prd-diff.md
```
