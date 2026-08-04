# 与其他 Skill 的关系

|Skill|关系|说明|
|---|---|---|
|`workflow-principles-group`|互补|该 skill 管理开发流程，本 skill 管理质量闭环|
|`jest-test-generator`|下游|本 skill 输出可驱动 jest-test-generator|
|`analyze-and-split-requirements`|上游|需求拆分后进入本 skill 的分析流程|
|`gulp-command-helper`|工具|CI 集成可结合 gulp 命令|

# 质量度量指标

|指标|计算方式|目标值|
|---|---|---|
|规则覆盖率|已覆盖规则数 / 总规则数|≥ 95%|
|测试对齐率|PRD规则-测试映射数 / 总规则数|≥ 90%|
|偏差发现率|自动发现的偏差 / 总偏差|≥ 80%|
|反哺填充率|测试→规范条目数 / 测试发现的规范缺口|≥ 70%|
|PRD 缺陷率|PRD 相关 Bug / 总 Bug|≤ 20%|
