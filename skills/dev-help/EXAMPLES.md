# Dev Help 使用示例

本文档提供真实场景下的使用示例,帮助你更好地理解如何使用 dev-help skill。

## 示例1: 简单功能开发

### 用户输入

```
@dev-help 我需要给组合管理页面添加一个导出功能,支持将当前列表数据导出为Excel文件
```

### Dev Help 响应

#### 第一阶段: 信息澄清

```
为了准确拆解任务,我需要确认几个问题:

1. **导出的数据范围是什么?**
   - A. 当前视图显示的数据(已分页)
   - B. 全部数据(不分页,可能很多)
   - C. 用户自定义筛选的数据

2. **Excel需要包含哪些列?**
   - A. 表格中显示的所有列
   - B. 用户可以选择的列
   - C. 固定的核心列(名称、经理、规模、收益率)

3. **是否需要异步导出?**
   - A. 数据量小(<1000条),前端直接生成
   - B. 数据量大,后端生成后下载
   - C. 不确定,需要评估

4. **文件名格式有要求吗?**
   - 例如: 组合列表_20240101.xlsx

请回答这些问题,我会据此拆解任务。
```

#### 用户回答

```
1. C - 用户自定义筛选的数据
2. C - 固定的核心列
3. B - 后端生成,因为可能有上万条数据
4. 组合列表_YYYYMMDD_HHmmss.xlsx
```

#### 第二阶段: 任务拆解

```markdown
# 组合导出功能开发任务计划

## 需求概述
为组合管理页面添加Excel导出功能,支持导出用户筛选后的数据,由后端生成Excel文件

## 技术方案
- 前端: 调用导出API,触发文件下载
- 后端: 根据筛选条件查询数据,生成Excel文件
- 权限: 需要export权限
- 异步: 大数据量时后台生成,完成后通知用户下载

## 任务列表

### Task 1: 设计导出API接口 (1h)

**描述**: 
定义导出接口的请求参数和响应格式

**涉及文件**:
- `src/api/combination.ts` - 添加exportCombination方法
- `src/types/combination.ts` - 添加ExportParams和ExportResult类型

**验收标准**:
- [ ] ExportParams包含筛选条件(filters)、排序(sortBy)
- [ ] ExportResult包含taskId或downloadUrl
- [ ] 添加完整的TypeScript类型定义
- [ ] 通过TypeScript编译检查

**依赖任务**: 无

---

### Task 2: 实现后端导出服务 (2h)

**描述**: 
实现组合数据的Excel导出逻辑,支持大数据量

**涉及文件**:
- `src/services/exportService.ts` - 新增导出服务类
- `src/utils/excelGenerator.ts` - Excel生成工具函数
- `package.json` - 添加exceljs依赖

**验收标准**:
- [ ] 能根据筛选条件查询数据
- [ ] 生成的Excel包含指定列
- [ ] 支持中文列名和数据
- [ ] 大数据量(>10000条)性能可接受(<10s)
- [ ] 添加错误处理和日志

**依赖任务**: Task 1

---

### Task 3: 添加前端导出按钮 (1h)

**描述**: 
在组合列表页面工具栏添加导出按钮

**涉及文件**:
- `src/views/combination/List.vue` - 修改列表页面

**验收标准**:
- [ ] 按钮位置合理(工具栏右侧,搜索框旁边)
- [ ] 按钮图标清晰(excel图标)
- [ ] 禁用状态正确(无数据时禁用)
- [ ] 点击后有loading反馈

**依赖任务**: 无

---

### Task 4: 实现前端导出逻辑 (1.5h)

**描述**: 
实现调用导出API并处理下载的逻辑

**涉及文件**:
- `src/hooks/useCombinationExport.ts` - 新增导出hook
- `src/utils/fileDownload.ts` - 文件下载工具(如不存在则创建)

**验收标准**:
- [ ] 能正确获取当前筛选条件
- [ ] 调用导出API并传递参数
- [ ] 处理异步导出流程( polling 或 webhook)
- [ ] 下载文件时使用正确的文件名
- [ ] 导出失败时显示友好错误提示

**依赖任务**: Task 1, Task 3

---

### Task 5: 添加导出进度提示 (1h)

**描述**: 
对于大数据量导出,显示进度提示

**涉及文件**:
- `src/components/ExportProgress.vue` - 进度提示组件
- `src/hooks/useCombinationExport.ts` - 集成进度组件

**验收标准**:
- [ ] 导出开始时显示"正在生成..."
- [ ] 支持显示进度百分比(如后端支持)
- [ ] 完成后自动关闭或显示"下载"按钮
- [ ] 支持取消导出操作

**依赖任务**: Task 4

---

### Task 6: 编写单元测试 (1.5h)

**描述**: 
为导出功能编写单元测试

**涉及文件**:
- `__tests__/unit/exportService.spec.ts`
- `__tests__/unit/useCombinationExport.spec.ts`
- `__tests__/unit/excelGenerator.spec.ts`

**验收标准**:
- [ ] 测试覆盖率 > 80%
- [ ] 覆盖正常导出场景
- [ ] 覆盖异常情况(网络错误、数据为空等)
- [ ] Mock外部依赖(API调用、文件生成)
- [ ] 所有测试通过

**依赖任务**: Task 2, Task 4

## 总体估算
- **任务数量**: 6个
- **预计总耗时**: 8小时
- **关键路径**: Task 1 → Task 2 → Task 4 → Task 5
- **可并行**: Task 3可与Task 1/2并行执行

## 风险提示
⚠️ **性能风险**: 如果数据量非常大(>10万条),可能需要优化查询和Excel生成逻辑
⚠️ **内存风险**: 大数据量导出可能占用较多内存,需要监控
```

#### 第三阶段: 任务确认

```
我已将需求拆分为 6 个任务,预计总耗时 8 小时。

请确认:
1. 任务拆分是否合理?
2. 是否有遗漏的功能点?
3. 优先级是否符合预期?
4. 时间估算是否准确?

如有调整意见,请告诉我具体需要修改的地方。
```

#### 用户确认后: 第四阶段执行

```
✅ 任务计划已确认,开始初始化进度跟踪...

📊 已注册项目: "组合导出功能"
📋 任务总数: 6个
⏱️ 预计耗时: 8小时

开始执行 Task 1: 设计导出API接口
```

---

## 示例2: Bug修复

### 用户输入

```
@dev-help 组合页面的树形菜单点击后没有反应,控制台显示"Cannot read property 'id' of undefined"错误
```

### Dev Help 响应

#### 第一阶段: 信息收集

```
我来帮你分析这个问题。首先让我了解一下情况:

1. **问题出现的时间?**
   - 一直存在还是最近才出现?
   - 如果是最近,最近修改了哪些代码?

2. **所有节点都没反应,还是特定层级?**
   - 根节点
   - 二级节点
   - 叶子节点
   - 所有节点

3. **能否提供更多信息?**
   - 控制台的完整错误堆栈
   - 相关的代码片段(如果有)
   - 浏览器和版本

4. **期望的行为是什么?**
   - 点击后展开/收起子节点
   - 点击后跳转到详情页
   - 其他?

请提供这些信息,我会据此定位问题并拆解修复任务。
```

#### 用户回答

```
1. 最近出现的,昨天重构了组合模块的代码
2. 只有叶子节点有问题,父节点可以正常展开
3. 错误发生在 CombinationTree.vue 第125行
4. 点击叶子节点应该跳转到组合详情页
```

#### 第二阶段: 任务拆解

```markdown
# 树形菜单点击问题修复任务计划

## 问题分析
- **症状**: 叶子节点点击无反应
- **错误**: Cannot read property 'id' of undefined
- **位置**: CombinationTree.vue:125
- **原因推测**: 昨天重构时可能改变了数据结构,但点击事件处理未同步更新

## 任务列表

### Task 1: 复现问题并定位根因 (1h)

**描述**: 
在开发环境复现问题,定位具体的代码问题

**涉及文件**:
- `src/components/CombinationTree.vue` - 检查第125行附近代码
- Chrome DevTools - 调试查看数据结构

**验收标准**:
- [ ] 能在本地环境稳定复现
- [ ] 找到导致undefined的具体原因
- [ ] 记录问题根因(数据结构变化/事件绑定错误/其他)
- [ ] 截图保存错误信息

**依赖任务**: 无

---

### Task 2: 修复点击事件处理逻辑 (1h)

**描述**: 
根据Task 1的定位结果,修复点击事件处理

**涉及文件**:
- `src/components/CombinationTree.vue` - 修复handleNodeClick方法

**验收标准**:
- [ ] 叶子节点点击能正确获取node.id
- [ ] 不破坏父节点的展开/收起功能
- [ ] 代码逻辑清晰,添加注释说明
- [ ] 通过TypeScript类型检查

**依赖任务**: Task 1

---

### Task 3: 添加边界情况处理 (0.5h)

**描述**: 
增强代码健壮性,处理各种边界情况

**涉及文件**:
- `src/components/CombinationTree.vue` - 添加防御性代码

**验收标准**:
- [ ] 处理node为undefined的情况
- [ ] 处理node.id不存在的情况
- [ ] 添加友好的错误提示
- [ ] 不会导致页面崩溃

**依赖任务**: Task 2

---

### Task 4: 添加回归测试 (1h)

**描述**: 
为树形菜单点击功能添加测试,防止再次出现类似问题

**涉及文件**:
- `__tests__/unit/CombinationTree.spec.ts` - 新增测试用例

**验收标准**:
- [ ] 测试父节点展开/收起
- [ ] 测试叶子节点点击跳转
- [ ] 测试边界情况(undefined node)
- [ ] 所有测试通过

**依赖任务**: Task 2

---

### Task 5: 验证修复效果 (0.5h)

**描述**: 
在多个场景下验证修复是否彻底

**涉及文件**:
- 无(手动测试)

**验收标准**:
- [ ] 本地开发环境测试通过
- [ ] 不同浏览器测试(Chrome/Firefox/Safari)
- [ ] 不同数据量测试(空/少量/大量)
- [ ] 确认没有其他副作用

**依赖任务**: Task 2, Task 3

## 总体估算
- **任务数量**: 5个
- **预计总耗时**: 4小时
- **关键路径**: Task 1 → Task 2 → Task 3 → Task 5
- **可并行**: Task 4可与Task 3并行

## 预防措施建议
💡 建议在重构后添加自动化测试
💡 建议添加运行时类型检查(runtime validation)
💡 建议使用TypeScript严格模式捕获此类错误
```

---

## 示例3: 代码重构

### 用户输入

```
@dev-help 我想把CombinationHome组件从Options API迁移到Composition API,并添加完整的TypeScript类型
```

### Dev Help 响应

#### 第一阶段: 信息收集

```
好的,这是一个常见的Vue 2.7迁移任务。让我先了解一下现状:

1. **CombinationHome组件的复杂度?**
   - 大约多少行代码?
   - 有多少data属性?
   - 有多少methods/computed/watch?

2. **是否有现有的测试?**
   - 有单元测试吗?
   - 测试覆盖率如何?

3. **迁移的目标是什么?**
   - 仅迁移语法(保持功能不变)
   - 同时优化代码结构(提取composables)
   - 添加完整的TypeScript类型

4. **是否有参考的其他已迁移组件?**
   - 项目中是否有类似的成功案例?
   - 是否需要遵循特定的迁移模式?

请提供这些信息,我会制定详细的迁移计划。
```

#### 用户回答

```
1. 约500行代码,8个data,12个methods,5个computed,3个watch
2. 有单元测试,覆盖率60%
3. 迁移语法+添加类型,暂时不重构结构
4. 参考AppAnalysis组件,它已经迁移完成了
```

#### 第二阶段: 任务拆解

```markdown
# CombinationHome组件迁移任务计划

## 迁移目标
- 从Options API迁移到Composition API (defineComponent + setup)
- 添加完整的TypeScript类型定义
- 保持功能完全等价
- 参考AppAnalysis组件的迁移模式

## 技术方案
- 使用Vue 2.7的Composition API
- 保持模板不变(只修改script部分)
- 逐步迁移:data → ref/reactive, methods → functions, computed → computed, watch → watch
- 添加props/emits的类型定义

## 任务列表

### Task 1: 分析现有组件结构 (1h)

**描述**: 
详细分析CombinationHome的现有结构,制定迁移策略

**涉及文件**:
- `src/views/combination/Home.vue` - 阅读现有代码
- `src/views/analysis/AppAnalysis.vue` - 参考已迁移组件

**验收标准**:
- [ ] 列出所有data属性及其类型
- [ ] 列出所有methods及其签名
- [ ] 列出所有computed及其依赖
- [ ] 列出所有watch及其监听对象
- [ ] 列出所有生命周期钩子
- [ ] 绘制迁移对照表

**依赖任务**: 无

**输出示例**:
```typescript
// 迁移对照表
data: {
  combinationList: [] → const combinationList = ref<Combination[]>([])
  loading: false → const loading = ref(false)
}

methods: {
  loadCombinations() → function loadCombinations() {}
  handleFilter() → function handleFilter() {}
}
```

---

### Task 2: 创建TypeScript类型定义 (1h)

**描述**: 
为组件的所有数据和方法创建类型定义

**涉及文件**:
- `src/types/combination.ts` - 新增或补充类型定义
- `src/views/combination/Home.vue` - 准备类型导入

**验收标准**:
- [ ] Combination接口定义完整
- [ ] FilterParams接口定义
- [ ] ApiResponse泛型类型可用
- [ ] 所有props有明确类型
- [ ] 所有emits有类型定义

**依赖任务**: 无

---

### Task 3: 迁移data和methods (2h)

**描述**: 
将data属性和methods迁移到setup函数

**涉及文件**:
- `src/views/combination/Home.vue` - 重构script部分

**验收标准**:
- [ ] 所有data转换为ref/reactive
- [ ] 所有methods转换为普通函数
- [ ] 保持响应式语义不变
- [ ] 模板中的引用无需修改(自动解包)
- [ ] 通过TypeScript类型检查

**依赖任务**: Task 2

**迁移示例**:
```vue
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    // data → ref
    const combinationList = ref<Combination[]>([])
    const loading = ref(false)
    
    // methods → function
    const loadCombinations = async () => {
      loading.value = true
      // ...
    }
    
    return {
      combinationList,
      loading,
      loadCombinations
    }
  }
})
</script>
```

---

### Task 4: 迁移computed和watch (1.5h)

**描述**: 
将computed属性和watch迁移到setup函数

**涉及文件**:
- `src/views/combination/Home.vue` - 继续重构

**验收标准**:
- [ ] 所有computed转换为computed()
- [ ] 所有watch转换为watch()
- [ ] 保持计算逻辑不变
- [ ] 正确处理依赖追踪
- [ ] 通过TypeScript类型检查

**依赖任务**: Task 3

**迁移示例**:
```typescript
import { computed, watch } from 'vue'

const filteredList = computed(() => {
  return combinationList.value.filter(...)
})

watch(filterParams, (newVal) => {
  loadCombinations()
}, { deep: true })
```

---

### Task 5: 迁移生命周期钩子 (0.5h)

**描述**: 
将生命周期钩子迁移到setup函数

**涉及文件**:
- `src/views/combination/Home.vue` - 完成迁移

**验收标准**:
- [ ] beforeMount → onBeforeMount
- [ ] mounted → onMounted
- [ ] beforeDestroy → onBeforeUnmount
- [ ] 保持执行顺序不变
- [ ] 清理逻辑正确

**依赖任务**: Task 4

---

### Task 6: 运行测试并修复问题 (1.5h)

**描述**: 
运行现有测试,修复迁移引入的问题

**涉及文件**:
- `__tests__/unit/CombinationHome.spec.ts` - 运行测试
- `src/views/combination/Home.vue` - 修复问题

**验收标准**:
- [ ] 所有原有测试通过
- [ ] 功能完全等价(手动验证)
- [ ] 无TypeScript类型错误
- [ ] 无控制台警告
- [ ] 性能无明显下降

**依赖任务**: Task 5

---

### Task 7: 代码审查和优化 (1h)

**描述**: 
审查迁移后的代码,进行必要的优化

**涉及文件**:
- `src/views/combination/Home.vue` - 最终优化

**验收标准**:
- [ ] 代码结构清晰
- [ ] 变量命名合理
- [ ] 添加必要的注释
- [ ] 考虑是否需要提取composables(可选)
- [ ] 符合项目代码规范

**依赖任务**: Task 6

## 总体估算
- **任务数量**: 7个
- **预计总耗时**: 8.5小时
- **关键路径**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7
- **风险**: 低(参考已有成功案例)

## 注意事项
⚠️ 保持模板不变,只修改script部分
⚠️ ref在模板中自动解包,无需修改模板代码
⚠️ 注意this的引用,migration后不能使用this
⚠️ 保留原有注释,必要时补充迁移说明
```

---

## 示例4: 复杂需求(需要先澄清)

### 用户输入

```
@dev-help 我要做一个智能预警系统,能监控各种指标并在异常时发送通知
```

### Dev Help 响应

#### 第一阶段: 深度澄清

```
这是一个比较大的需求,我需要了解更多细节才能准确拆解任务。

## 📊 监控指标相关

1. **需要监控哪些指标?**
   - 组合收益率波动?
   - 持仓集中度?
   - 信用评级变化?
   - 舆情负面新闻?
   - 其他业务指标?

2. **异常的判断标准是什么?**
   - 固定阈值(如收益率<-5%)
   - 动态阈值(如偏离均值2个标准差)
   - 规则引擎(可配置的组合规则)
   - AI模型预测?

3. **监控频率是多少?**
   - 实时(秒级)
   - 准实时(分钟级)
   - 定时(每小时/每天)

## 🔔 通知方式相关

4. **通过什么方式发送通知?**
   - 站内消息
   - 邮件
   - 短信
   - 企业微信/钉钉
   - App推送
   - 多种方式的组合?

5. **通知的内容和格式?**
   - 简单的文本提醒
   - 详细的分析报告
   - 包含图表和数据
   - 可交互的操作按钮?

6. **通知的接收人是谁?**
   - 组合经理
   - 风控人员
   - 上级领导
   - 根据预警级别不同?

## ⚙️ 系统架构相关

7. **数据存储和展示?**
   - 需要存储历史预警记录吗?
   - 需要预警 dashboard 吗?
   - 需要预警统计分析吗?

8. **预警的管理功能?**
   - 需要配置预警规则吗?
   - 需要启用/禁用预警吗?
   - 需要设置免打扰时段吗?

9. **性能和规模要求?**
   - 大概多少个组合同时监控?
   - 可接受的延迟是多少?
   - 预期的并发量?

## 💰 优先级和范围

10. **MVP(最小可行产品)包含哪些功能?**
    - 先做哪几个指标?
    - 先用哪种通知方式?
    - 后续迭代计划?

请尽可能详细地回答这些问题,或者告诉我哪些方面你已经有明确想法,哪些方面还需要讨论。
```

#### 用户回答(部分)

```
1. 主要监控: 收益率波动、持仓集中度、信用评级
2. 固定阈值+规则引擎,可配置
3. 准实时,每5分钟检查一次
4. 站内消息+邮件
5. 详细内容,包含数据和简要分析
6. 组合经理+风控人员
7. 需要存储历史记录和dashboard
8. 需要配置规则和启用/禁用
9. 约500个组合,延迟<10分钟
10. MVP先做收益率波动预警,站内消息
```

#### 第二阶段: 分阶段任务规划

```markdown
# 智能预警系统开发任务计划

## 需求总结
基于你的回答,我将这个系统分为两个阶段:

**Phase 1 (MVP)**: 收益率波动预警 + 站内消息  
**Phase 2**: 扩展到其他指标 + 邮件通知 + 规则配置 + Dashboard

下面先拆解 Phase 1 的任务:

## Phase 1: MVP任务列表

### Task 1: 设计预警数据模型 (1.5h)

**描述**: 
设计预警规则、预警记录的数据结构

**涉及文件**:
- `src/types/alert.ts` - 新增类型定义
- 数据库schema设计文档

**验收标准**:
- [ ] AlertRule接口(指标类型、阈值、接收人等)
- [ ] AlertRecord接口(触发时间、当前值、阈值等)
- [ ] 支持收益率波动指标
- [ ] 可扩展到其他指标

**依赖任务**: 无

---

### Task 2: 实现预警规则配置API (2h)

**描述**: 
实现预警规则的CRUD接口

**涉及文件**:
- `src/api/alert.ts` - API方法
- `src/services/alertService.ts` - 业务逻辑

**验收标准**:
- [ ] 创建预警规则
- [ ] 查询预警规则列表
- [ ] 更新预警规则
- [ ] 删除/禁用预警规则
- [ ] 完整的TypeScript类型

**依赖任务**: Task 1

---

[后续任务省略...]

## Phase 2: 扩展功能(待Phase 1完成后规划)
- 持仓集中度预警
- 信用评级变化预警
- 邮件通知
- 规则配置UI
- 预警Dashboard
- 统计分析

## 总体估算
- **Phase 1**: 约12小时(6个任务)
- **Phase 2**: 待评估(预计20-30小时)

## 建议
💡 建议先完成Phase 1并上线验证
💡 根据Phase 1的使用反馈调整Phase 2的设计
💡 考虑使用消息队列处理大量预警
```

---

## 总结

通过这些示例,你可以看到 dev-help 的工作方式:

1. **简单需求** → 直接拆解任务
2. **Bug修复** → 先定位再修复
3. **代码重构** → 系统化迁移
4. **复杂需求** → 深度澄清后分阶段规划

关键是:**提供足够的需求细节**,技能才能给出准确的任务计划!
