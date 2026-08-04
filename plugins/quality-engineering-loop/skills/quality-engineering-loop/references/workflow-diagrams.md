# 闭环工作流

## 基础流水线（单向）

```mermaid
graph TD
    Start([PRD 文档]) --> S1[阶段1: PRD 结构化分析]
    
    S1 --> S1a[提取规则元组]
    S1 --> S1b[构建状态迁移表]
    S1 --> S1c[识别边界场景]
    S1 --> S1d[提取异常处理逻辑]
    
    S1a & S1b & S1c & S1d --> S2[阶段2: 覆盖矩阵生成]
    
    S2 --> S2a[PRD规则 ↔ 代码映射]
    S2 --> S2b[PRD规则 ↔ 测试映射]
    S2 --> S2c[标记偏差与遗漏]
    
    S2a & S2b & S2c --> S3[阶段3: 测试用例生成]
    
    S3 --> S3a[BDD Given-When-Then 格式]
    S3 --> S3b[单元测试脚手架]
    S3 --> S3c[边界场景测试]
    
    S3a & S3b & S3c --> S4[阶段4: 代码审查]
    
    S4 --> S4a[基于规则的 Checklist]
    S4 --> S4b[偏差自动检测]
    
    S4a & S4b --> S5[阶段5: 反向填充]
    
    S5 --> S5a[测试→开发规范反向填充]
    S5 --> S5b[需求遗漏反哺 PRD]
    S5 --> S5c[代码缺陷标记]
    
    S5a & S5b & S5c --> End([输出: 质量报告])
```

## 4 种场景输入组合

```mermaid
graph LR
    subgraph 场景1
        PRD_V["PRD v1, v2, v3..."] --> |版本对比| Q1["分析质量优化"]
        Q1 --> |改进报告| PRD_NEXT["PRD v(n+1)"]
    end
    
    subgraph 场景2
        PRD_T["PRD + 测试用例"] --> |测试反哺| Q2["PRD 规范性提升"]
        Q2 --> |改进建议| PRD_FIX["PRD 补丁"]
    end
    
    subgraph 场景3
        CODE_T["代码 + 测试用例"] --> |模式提取| Q3["测试对齐 + 规范反哺"]
        Q3 --> |规范条目| STD["开发规范"]
    end
    
    subgraph 场景4
        ALL["代码 + PRD + 测试"] --> |三方验证| Q4["代码稳定性 + 范式"]
        Q4 --> |稳定性报告| PARADIGM["代码范式指南"]
    end
```

## 场景→子技能映射

|场景|输入|核心子技能|辅助子技能|输出|
|---|---|---|---|---|
|1. PRD版本迭代|PRD v1,v2,...|`prd-quality-improver`|`prd-structured-analysis`|版本 diff + 趋势报告|
|2. PRD+测试|PRD + 测试|`prd-quality-improver`|`coverage-matrix`|PRD 质量评分 + 改进建议|
|3. 代码+测试|代码 + 测试|`standards-backfill-engine`|`test-generation`|规范条目 + 覆盖矩阵更新|
|4. 三方综合|代码+PRD+测试|`standards-backfill-engine`|全部子技能|稳定性评估 + 范式建议|
