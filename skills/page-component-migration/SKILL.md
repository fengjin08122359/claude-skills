---
name: page-component-migration
description: 将 Vue 2 Options API 组件迁移到 Vue 3 Composition API + TypeScript 的 -page.vue 模式。用于支持 dui 模式切换，实现新旧组件平滑过渡。当用户需要创建或迁移页面组件时使用此技能。
---

# Page 组件迁移技能

## 概述

本技能提供将 Vue 2 Options API 组件迁移到 Vue 3 Composition API + TypeScript 的 `-page.vue` 文件模式的完整指南。该模式用于支持 dui 模式切换，实现新旧组件的平滑过渡。

## ⚠️ 重要原则：先规划，后执行

**在开始任何代码生成之前，必须严格遵循以下规划流程！**

### 第一步：需求理解与分析（5-10 分钟）

1. **确认任务目标**
   - [ ] 用户需要迁移哪个页面？（确定模块名和页面名）
   - [ ] 该页面属于哪个模块？（judicical、sincerity、announcement 等）
   - [ ] 是否需要保留旧版兼容？（通常需要）

2. **识别关键复杂度**
   - [ ] 是否包含 keyword_filter 智能搜索？
   - [ ] 是否有多个筛选项？
   - [ ] 是否有特殊的列渲染逻辑？
   - [ ] 是否涉及复杂的参数映射？

### 第二步：源文件调研（10-15 分钟）

**⚠️ 这是最关键的一步！不要跳过！**

1. **定位源文件**
   ```bash
   # 查找对应的 *.js 文件
   src/components/information/module/instance/{module}.js
   ```
   
2. **读取并分析源文件**
   - [ ] 找到对应的 PageModule 类
   - [ ] 定位 `initData()` 方法
   - [ ] 定位 `convertRequest()` 方法
   - [ ] 如果有 `convertResult()` 方法也要记录

3. **提取关键信息**
   
   **从 initData 中提取：**
   - [ ] `keywordFilter.placeholder` - 占位符文本
   - [ ] `keywordFilter.selected` - 默认选中的搜索类型
   - [ ] `keywordFilter.resetSearchParams([...])` - 支持的搜索类型列表
   - [ ] `keywordFilter.getPlaceholder()` - 动态占位符逻辑
   - [ ] `modelId` - 模型 ID
   - [ ] `tableRender.url` - API 地址

   **从 convertRequest 中提取：**
   - [ ] 参数解构列表（所有需要的字段名）
   - [ ] query_type 映射规则（每个 selected 对应的值）
   - [ ] 字段映射规则（每个 selected 如何映射到后端参数）
   - [ ] 特殊处理逻辑（如 inner_code、bond 等）

4. **创建规划文档**
   
   建议在生成代码前，先用文字记录提取的信息：
   
   ```markdown
   ## {页面名称} 迁移规划
   
   ### 源文件信息
   - 源文件路径：{path}.js
   - PageModule 类名：{ClassName}
   - modelId: {xxx}
   - API 地址：{url}
   
   ### keywordFilter 配置
   - placeholder: "{xxx}"
   - selected 默认值："{xxx}"
   - 支持的搜索类型：[type1, type2, ...]
   - getPlaceholder 逻辑：{
       type1 => "提示 1",
       type2 => "提示 2",
       ...
     }
   
   ### convertRequest 参数
   - 解构参数：[param1, param2, ...]
   - query_type 映射：{
       type1 => 1,
       type2 => 2,
       ...
     }
   - 字段映射：{
       type1: { to: "field1", key: "keyword/value" },
       type2: { to: "field2", key: "keyword/value" },
       ...
     }
   
   ### 其他筛选项
   - 列出所有 paramFilter.setParams 中的筛选项
   - 注意被注释掉的筛项不需要
   
   ### 列配置
   - 列出所有 column 配置
   - 标记需要自定义渲染的列
   ```

### 第三步：制定实施计划（3-5 分钟）

1. **分解任务步骤**
   - [ ] 创建 keyword_filter 组件（如果需要）
   - [ ] 创建 -page.vue 文件
   - [ ] 配置 keywordFilterFormPiece
   - [ ] 配置 param 对象
   - [ ] 编写 changeForm 逻辑
   - [ ] 配置其他筛选项
   - [ ] 配置 column 和 colValRender
   - [ ] 更新路由配置

2. **识别潜在风险**
   - [ ] 是否有不确定的字段映射？
   - [ ] 是否有需要确认的 API 调用？
   - [ ] 是否有特殊的渲染逻辑？

3. **准备验证清单**
   - [ ] 准备好 SKILL.md 中的验证清单
   - [ ] 准备对比源文件进行验证

### 第四步：与用户确认（可选但推荐）

对于复杂的页面，建议先输出规划，让用户确认：

```
我已经分析了 {module}.js 文件，以下是我的迁移规划：

1. keywordFilter 配置：
   - 支持的搜索类型：...
   - 默认选中：...
   - query_type 映射：...

2. param 字段：...

3. changeForm 逻辑：...

请确认这个规划是否正确？我是否可以开始生成代码？
```

### 第五步：执行代码生成

**只有在完成以上规划步骤后，才开始生成代码！**

1. **严格按照规划生成**
   - ✅ 使用从源文件提取的字段名
   - ✅ 遵循从 convertRequest 提取的映射逻辑
   - ✅ 按照 initData 配置 keywordFilter

2. **边生成边验证**
   - ✅ 每生成一部分，就对照源文件验证
   - ✅ 使用 SKILL.md 中的验证清单检查

3. **生成后的自检**
   - [ ] 检查所有字段名是否与源文件一致
   - [ ] 检查 query_type 映射是否正确
   - [ ] 检查 changeForm 逻辑是否覆盖了所有分支
   - [ ] 检查 param 是否包含了所有解构参数

### ❌ 禁止的行为

- ❌ **不读源文件就直接生成代码**
- ❌ **照搬示例代码而不根据源文件调整**
- ❌ **跳过规划步骤直接开始编码**
- ❌ **硬编码其他模块的字段名或逻辑**
- ❌ **凭记忆或猜测写字段名**

### ✅ 推荐的做法

- ✅ **花 15-20 分钟做完整的规划**
- ✅ **用文字记录从源文件提取的信息**
- ✅ **复杂页面向用户展示规划并确认**
- ✅ **严格按照规划生成代码**
- ✅ **使用验证清单进行自检**

---

**记住：磨刀不误砍柴工！好的规划是成功的一半！**

## 第六步：总结与知识沉淀（任务完成后）

**⚠️ 重要**：在功能修改完成后，必须执行以下步骤！

### 1. 回顾与反思

完成代码生成和测试后，花时间回顾整个过程：

- [ ] **是否遇到了新的问题？**
  - 这个问题之前没有遇到过吗？
  - 是如何解决的？
  
- [ ] **是否有新的发现？**
  - 发现了源文件中之前没注意到的配置吗？
  - 发现了新的字段类型或映射规则吗？
  - 发现了特殊的边界情况吗？

- [ ] **是否有优化空间？**
  - 有比 SKILL.md 中更好的实现方式吗？
  - 有更简洁的代码组织方式吗？
  - 有更高效的调研方法吗？

### 2. 识别需要补充的知识点

**以下情况需要补充到 SKILL.md：**

#### ✅ 新的模块类型

- 发现了一个新的模块（如 announcement、notice 等）
- 该模块有特殊的配置或字段
- 该模块有特殊的 query_type 映射规则

#### ✅ 新的字段类型

- 发现了新的后端参数字段（如 `inner_code`、`bond` 等）
- 该字段需要在 param、changeForm、requestData 中特殊处理
- 该字段容易被遗漏或出错

#### ✅ 特殊的映射规则

- 发现了特殊的参数映射逻辑
- 某个 selected 类型的映射与其他模块不同
- 需要额外的条件判断或数据转换

#### ✅ 常见错误的典型案例

- 遇到了一个容易犯的错误
- 这个错误可能在未来重复出现
- 有明确的检查方法或预防措施

#### ✅ 优化的工作流程

- 发现了一个更高效的调研方法
- 发现了一个更好的代码组织方式
- 发现了一个可以快速定位问题的技巧

#### ✅ 验证清单的补充

- 发现了一个之前遗漏的检查点
- 这个检查点可以防止未来的错误
- 这个检查点具有通用性

### 3. 如何补充到 SKILL.md

**步骤：**

1. **整理知识点**
   - 用简洁清晰的语言描述
   - 提供具体的代码示例（如果有）
   - 说明适用场景和注意事项

2. **找到合适的位置**
   - 新的模块类型 → "Sincerity 模块的 KeywordFilter 特殊配置"章节
   - 新的字段类型 → "步骤 3：应用到新页面"章节
   - 常见错误 → "关键要点总结"或"验证清单"章节
   - 工作流程优化 → "先规划，后执行"章节

3. **更新文档**
   - 使用 search_replace 工具修改 SKILL.md
   - 保持与现有内容一致的格式和风格
   - 添加必要的注释和警告标记

4. **验证更新**
   - 检查新增内容是否与现有内容冲突
   - 检查示例代码是否正确
   - 确保新增内容对未来的任务有帮助

### 4. 询问用户确认

**⚠️ 重要**：在补充到 SKILL.md 之前，必须询问用户！

**标准询问话术：**

```
我在这次任务中发现了一些新的知识点/规范：

1. 【知识点名称】
   - 发现背景：...
   - 具体内容：...
   - 适用场景：...

2. 【知识点名称】
   ...

我建议将这些内容补充到 SKILL.md 中，以便未来的迁移任务可以参考。

是否需要我立即更新 SKILL.md？
```

**为什么要询问：**

- ✅ 确保知识点的正确性和必要性
- ✅ 避免将个别案例过度泛化
- ✅ 获得用户的认可和反馈
- ✅ 可能引发更有价值的讨论

### 5. 持续改进

SKILL.md 是一个**活的文档**，应该随着实践经验的积累而不断演进：

- 📝 **每次任务都是学习机会**
- 🔄 **定期回顾和更新**
- 🎯 **去粗取精，去伪存真**
- 💡 **集体智慧，共同成长**

## 目录结构模式

### 标准目录结构

```
pages/${parentModule}/{module}/
├── {name}-page.vue      # 新版 Composition API + TypeScript 组件
├── {name}.vue           # 旧版 Options API 组件（保留兼容）
├── components/          # 模块专用组件
│   └── keyword_filter/
│       └── use.ts       # 可复用的表单组件配置
└── ...
```

### 文件命名规范

- **新版组件**: `{name}-page.vue` - 使用 Vue 3 Composition API + TypeScript
- **旧版组件**: `{name}.vue` - 保留 Options API 用于兼容

## 核心模板

### 基础模板结构

``vue
<template>
  <TableTemplate :table="table" class="{module}-{name}">
    <!-- 表单组件插槽 -->
    <template #comb_search_cascader="{ piece }">
      <comb_search_cascader :target="piece"></comb_search_cascader>
    </template>
    <template #comb_check="{ piece }">
      <comb_check :target="piece"></comb_check>
    </template>
    <template #comb_radio_dateRange="{ piece }">
      <comb_radio_dateRange :target="piece"></comb_radio_dateRange>
    </template>
    <template #combination="{ piece }">
      <FormPieceCombination :target="piece"></FormPieceCombination>
    </template>
  </TableTemplate>
</template>
```

### Script 模板

``typescript
<script lang="ts">
import TableTemplate from "@/components/dui/FormTable/TableTemplate.vue";
import { generateFormPiece } from "@/components/ui/instance/formPiece";
import { buriedPoint } from "@/utils/buriedPoint";
import moment from "moment";
import { onMounted, ref } from "vue";
import { TableConfig } from "@/components/dui/FormTable/types";

// 导入表单组件
import comb_search_cascader from "@/components/dui/formPiece/comb_search_cascader/index-page.vue";
import comb_check from "@/components/dui/formPiece/comb_check/index-page.vue";
import comb_radio_dateRange from "@/components/dui/formPiece/comb_radio_dateRange/index-page.vue";
import FormPieceCombination from "@/components/dui/formPiece/combination/index-page.vue";

// 导入常量配置
import { /* 常量 */ } from "@/constants/mock/{module}";

// 导入表格列渲染组件
import ComponentName from "@/components/TableSlot/TableCol/ComponentName.vue";

export default {
  name: "{ComponentName}Page",
  components: { 
    TableTemplate, 
    comb_search_cascader, 
    comb_check, 
    comb_radio_dateRange, 
    FormPieceCombination 
  },
  setup() {
    // 埋点
    onMounted(() => {
      buriedPoint.addBuriedPoint({
        name: "page",
        name_ZH: "{页面中文名}",
        type: "{module}_{name}",
        method: "page"
      });
    });

    // 表格配置
    const table = ref<TableConfig>({
      url: "/api/endpoint",
      param: {
        // 请求参数
      },
      changeForm(from, to) {
        // 表单值转换逻辑
      },
      pieces: [
        // 表单配置项
      ],
      column: [
        // 列配置
      ],
      colValRender: {
        // 列渲染函数
      }
    });

    return { table };
  }
};
</script>
```

## TableConfig 接口

``typescript
interface TableConfig {
  url?: string;                              // API 地址
  request?: Function;                        // 自定义请求函数
  param: Record<string, any>;               // 请求参数
  changeForm?: (from: any, to: any) => void; // 表单值转换
  pieces: FormPiece[];                       // 表单配置项
  column: ColumnConfig[];                    // 列配置
  colValRender?: Record<string, Function>;   // 列渲染函数
}
```

## 表单组件类型

### KeywordFilter 智能搜索组件

keyword_filter 是一个可复用的智能搜索筛选项，支持公司/证券/标题的统一搜索。

#### 文件结构
```
components/keyword_filter/
├── use.ts              # Hook 逻辑层，定义 FormPiece
└── index-page.vue      # UI 展示层，搜索框和结果列表
```

#### 基本用法
```typescript
import keyword_filter from "./components/keyword_filter/use";

const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "公司/证券/标题",
  searchAll: false,
  options: [  
    { value: "company_code", label: "公司" },
    { value: "secu_code", label: "证券" },
    { value: "keyword", label: "标题" }
  ],
  // 动态占位符（可选）- 根据选中的搜索类型显示不同的提示文本
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "company_code") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "executor_caseno") {
      return "请输入案件号";
    }
    return "公司/证券/标题";
  },
  requestData: async (keyword: string) => {
    const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: ""
    }).sync;

    const resBond = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: "bond"
    }).sync;
    
    const resStock = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: "stock"
    }).sync;
    
    return concat(
      (resCompany.data || []).map(item => ({
        title: `${item.company_name}`,
        key: "company_code",
        value: item.company_code
      })),
      (resStock.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "secu_code",
        value: item.secu_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      })),
      (resBond.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "secu_code",
        value: item.secu_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      }))
    ).filter(item => item.value);
  }
});
```

#### 配置要点

**1. options 配置规范**

- ✅ **必须参考 match.js**: options 的 `value` 和 `label` 必须对应 `match.js` 中的配置
- ✅ **title 不需要添加到 options**: title 搜索已经内置，用户直接输入关键词回车即触发
- ✅ **使用 match.js 的 label**: 确保 label 文本与 match.js 一致

**示例（裁判文书）**:
```typescript
// match.js 配置
{
  key: "documents_company_code_keyword",
  label: "当事人",
  url: "/companyinfo/companytabsearch"
}
{
  key: "executor_caseno",
  label: "案件号",
  url: "/legalnews/executeesearch",
  type: 2
}

// -page.vue 中的 options
options: [
  { value: "documents_company_code_keyword", label: "当事人" },  // ✅ 来自 match.js
  { value: "executor_caseno", label: "案件号" }                // ✅ 来自 match.js
]
```

**2. requestData 逻辑**

根据选中的搜索类型调用不同接口：

```typescript
requestData: async (keyword: string) => {
  const selectedType = keywordFilterFormPiece.state.value.selected;
  
  if (selectedType === "executor_caseno") {
    // 案件号搜索 - 使用 match.js 中的 executor_caseno 配置
    const res = await qsServe("/legalnews/executeesearch", {
      keyword,
      type: 2, // 2=案件号（来自 match.js 的 type 字段）
      size: 100
    }).sync;
    
    return (res.data?.case_number_array || []).map(item => ({
      title: item.case_number,      // res_label: "case_number"
      key: "executor_caseno",       // 与 options value 一致
      value: item.executee_id       // res_value: "executee_id"
    }));
  } else {
    // 公司/证券搜索 - documents_company_code_keyword
    const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
      keyword,
      page_count: 100,
      page_no: 1,
      source_name: ""
    }).sync;

    const resBond = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 100,
      page_no: 1,
      source_name: "bond"
    }).sync;
    
    const resStock = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 100,
      page_no: 1,
      source_name: "stock"
    }).sync;
    
    return concat(
      (resCompany.data || []).map(item => ({
        title: `${item.company_name}`,
        key: "documents_company_code_keyword",
        value: item.company_code
      })),
      (resStock.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "documents_company_code_keyword",
        value: item.company_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      })),
      (resBond.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "documents_company_code_keyword",
        value: item.company_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      }))
    ).filter(item => item.value);
  }
}
```

**3. changeForm 参数转换**

参考旧版 `judicical.js` 的 `convertRequest` 逻辑：

```typescript
changeForm(from, to) {
  // ... 其他转换逻辑
  
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    if (from.keyword_filter.key === "documents_company_code_keyword") {
      // 公司/证券搜索 - 对应旧代码的 company_code / issu
      to.company_code = from.keyword_filter.value || "";
      to.secu_code = from.keyword_filter.secu_code || "";
      to.secu_market = from.keyword_filter.secu_market || "";
      // 公司/证券搜索不设置 query_type，默认为 4
    } else if (from.keyword_filter.key === "executor_caseno") {
      // 案件号搜索 - 对应旧代码的 executor_caseno
      to.keyword = from.keyword_filter.value || "";
      to.query_type = 2; // 案号
    }
    // title 标题搜索已经在 requestData 中处理，直接返回关键词
  } else {
    to.company_code = from.combination?.result?.company_code || "";
    to.secu_code = "";
    to.secu_market = "";
    to.keyword = "";
    delete to.query_type;
  }
}
```

**query_type 映射表**:

| query_type | 含义 | 触发条件 |
|-----------|------|---------|
| 1 | 标题搜索 | 用户选择"标题"选项或直接输入关键词 |
| 2 | 案件号搜索 | 用户选择"案件号"选项 |
| 4 | 公司/证券搜索（默认） | 不设置 query_type 时 |

**4. getPlaceholder 动态占位符**

根据选中的搜索类型显示不同的提示文本：

```typescript
getPlaceholder: () => {
  const selectedType = keywordFilterFormPiece.state.value.selected;
  if (selectedType === "title") {
    return "请输入关键字";
  } else if (selectedType === "documents_company_code_keyword") {
    return "请输入公司名称/证券简称/证券代码";
  } else if (selectedType === "executor_caseno") {
    return "请输入案件号";
  }
  return "请输入公司名称/证券简称/证券代码"; // 默认值
}
```

#### changeForm 处理
```typescript
changeForm(from, to) {
  // keyword_filter 处理
  if (from.keyword_filter.key) {
    to.company_code = from.keyword_filter.key == "company_code" 
      ? from.keyword_filter.value 
      : "";
    to.secu_code = from.keyword_filter.key == "secu_code" 
      ? from.keyword_filter.value 
      : "";
    to.secu_market = from.keyword_filter.key == "secu_code" 
      ? from.keyword_filter.secu_market 
      : "";
    to.keyword = from.keyword_filter.key == "keyword" 
      ? from.keyword_filter.value 
      : "";
  } else {
    to.company_code = "";
    to.secu_code = "";
    to.secu_market = "";
    to.keyword = "";
  }
}
```

#### 两种搜索模式

**模式 A: 全量搜索（默认）**
- searchAll 为true
- 只有搜索框，无类型选择器
- 并发搜索所有类型（公司、证券、标题）
- 返回所有类型的结果

**模式 B: 单选搜索**
- 配置 `options` 数组
- 显示搜索框 + 类型选择器
- 用户可选择搜索范围（公司/证券/标题）
- 只返回选中类型的结果

#### 核心特性
- ✅ **三种搜索方式**: 关键词直搜、选择公司、选择证券
- ✅ **智能过滤**: 根据选中的类型自动过滤搜索结果
- ✅ **防抖机制**: 300ms 防抖避免频繁 API 请求
- ✅ **历史记录**: 自动保存最近 5 条搜索历史
- ✅ **结果高亮**: 搜索结果关键词高亮显示
- ✅ **状态管理**: 完整的 state 管理（title, value, key, result, query_type, keyword, searchAll, selected）

#### 数据流转
```
用户输入关键词
  ↓
onSearch(value, searchType)
  ↓
setValue({...})
  ↓
dispatch("requestData", keyword)
  ↓
返回搜索结果数组
  ↓
根据 selected 过滤（单选模式）
  ↓
changeForm 转换为后端参数
  ↓
发起 API 请求
```

#### 注意事项
1. **options 配置**: 直接作为 keyword_filter 的参数，不需要嵌套在 props 中
2. **value 命名**: 必须与 searchData 返回的 item.key 一致（company_code, secu_code, keyword）
3. **第一个非空选项**: 会被设为默认选中的类型
4. **向后兼容**: 不配置 options 时保持全量搜索模式
5. **导入路径**: 必须从 `use.ts` 导入，而不是从 `index-page.vue` 导入
6. **使用模式**: keyword_filter 是 Hook 函数，需要调用后返回 FormPiece 实例

#### 常见错误与解决方案

**❌ 错误方式 1: 从 index-page.vue 导入组件**
```typescript
// 错误！不要这样做
import keyword_filter from "./components/keyword_filter/index-page.vue";

// 然后在 template 中使用
<template #keyword_filter="{ piece }">
  <keyword_filter :target="piece"></keyword_filter>
</template>
```

**❌ 错误方式 2: 直接在 pieces 中配置对象**
```typescript
// 错误！不要这样做
pieces: [
  {
    type: "keyword_filter",
    key: "keyword",
    label: "搜索",
    placeholder: "请输入公司/证券/标题关键词"
  }
]
```

**✅ 正确方式：从 use.ts 导入 Hook 并调用**
```typescript
// 正确！从 use.ts 导入
import keyword_filter from "./components/keyword_filter/use";

// 调用 Hook 创建实例
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司/证券/标题关键词",
  selected: "",
  options: [
    { value: "", label: "全部" },
    { value: "party_company_code_keyword", label: "当事人" },
    { value: "info_title", label: "标题" }
  ],
  getPlaceholder: () => { ... },
  requestData: async (keyword: string) => { ... }
});
```

## Sincerity 模块的 KeywordFilter 特殊配置

### 核心原则：根据源文件规则修改

**重要**：KeywordFilter 的配置必须参考对应的旧版源文件（如 `sincerity.js`），而不是照搬其他页面的实现。

### 步骤 1：读取旧版源文件

以诚信模块为例，需要读取：
```
src/components/information/module/instance/sincerity.js
```

找到对应 PageModule 的 `convertRequest` 方法：

```javascript
// AllSincerityPageModule (line 128-162)
convertRequest({
  bond: inner_code,
  party_company_code: party_company_code,
  party_company_code_keyword: party_company_code_keyword,
  party_company_code_bond_keyword: party_company_code_bond_keyword,
  relata_company_code: relata_company_code,
  secu_market: secu_market,
  keyword = ""
}) {
  let params = {};
  inner_code && (params.inner_code = inner_code);
  party_company_code && (params.party_company_code = party_company_code);
  relata_company_code && (params.relata_company_code = relata_company_code);
  secu_market && (params.secu_market = secu_market);
  
  // 【关键】query_type 映射规则
  if (this.keywordFilter.selected === "title") {
    params.query_type = 1;
  } else if (this.keywordFilter.selected === "party_company_code_bond_keyword") {
    params.query_type = 2;
  } else if (this.keywordFilter.selected === "relata_company_code_bond_sincerity") {
    params.query_type = 3;
  }
  
  // 【关键】keyword 处理逻辑
  if (party_company_code_keyword) {
    params.keyword = party_company_code_keyword;
  }
  if (party_company_code_bond_keyword && this.keywordFilter.selected === "party_company_code_bond_keyword") {
    params.party_company_code = party_company_code_bond_keyword;
  }
  if (party_company_code_bond_keyword && this.keywordFilter.selected === "relata_company_code_bond_sincerity") {
    params.relata_company_code = party_company_code_bond_keyword;
  }
  if (keyword !== "") {
    params.keyword = keyword;
  }
  return params;
}
```

### 步骤 2：提取关键信息

从 `convertRequest` 中提取：

**1. options 配置（来自 initData 的 keywordFilter）**：
```javascript
// line 115-126
this.keywordFilter.resetSearchParams(["relata_company_code_bond_sincerity", "party_company_code_bond_keyword"]);
this.keywordFilter.selected = "relata_company_code_bond_sincerity";
this.keywordFilter.getPlaceholder = () => {
  if (this.keywordFilter.selected === "title") {
    return "请输入关键字";
  } else if (this.keywordFilter.selected === "relata_company_code_bond_sincerity") {
    return "请输入公司名称/证券简称/证券代码";
  } else if (this.keywordFilter.selected === "party_company_code_bond_keyword") {
    return "请输入当事人名称/证券简称/证券代码";
  }
  return this.keywordFilter.placeholder;
};
```

✅ **options 应该是**：
- `title`（标题）
- `party_company_code_bond_keyword`（当事人）
- `relata_company_code_bond_sincerity`（关联公司）

**2. query_type 映射**：
- `title` → `query_type = 1`
- `party_company_code_bond_keyword` → `query_type = 2`
- `relata_company_code_bond_sincerity` → `query_type = 3`

**3. 参数映射规则**：
- 当事人搜索：`party_company_code_bond_keyword` → `party_company_code`
- 关联公司搜索：`party_company_code_bond_keyword` → `relata_company_code`
- 标题搜索：直接使用 `keyword`

### 步骤 3：应用到新页面

**核心原则**：不要照搬示例代码！必须根据从源文件中提取的规则动态生成配置。

#### 3.1 生成 options 配置

根据步骤 2 中提取的 `initData` 里的 `keywordFilter` 配置生成 options：

```typescript
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: ""， // 来自源文件的 keywordFilter.placeholder
  selected: "",    // 来自源文件的 keywordFilter.selected
  options: [
    // 根据源文件中 resetSearchParams 的参数和实际使用的字段生成
    // 示例：如果源文件使用 title、relata_company_code_bond_sincerity、party_company_code_bond_keyword
    { value: "title", label: "标题" },
    { value: "relata_company_code_bond_sincerity", label: "关联公司" },
    { value: "party_company_code_bond_keyword", label: "当事人" }
  ],
  getPlaceholder: () => {
    // 根据源文件的 getPlaceholder 逻辑生成
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "relata_company_code_bond_sincerity") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "party_company_code_bond_keyword") {
      return "请输入当事人名称/证券简称/证券代码";
    }
    return "请输入公司/证券/关键字";
  },
  requestData: async (keyword: string) => {
    // 根据选中的搜索类型调用不同接口
    const selectedType = keywordFilterFormPiece.state.value.selected;

    if (selectedType === "title") {
      // 标题搜索 - 调用对应的 API
      const res = await qsServe("/gildatacompany/v1/legalaction/sinceritylist_new", {
        keyword,
        page_no: 0,
        page_count: 100,
        query_type: "1"
      }).sync;

      return (res.data?.list || []).map(item => ({
        title: item.info_title,
        key: "title",
        value: item.id
      }));
    } else {
      // 公司/证券搜索 - 根据源文件中使用的字段调用对应 API
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || [])
        .map(item => ({
          title: `${item.company_name}`,
          key: selectedType, // 使用选中的类型作为 key
          value: item.company_code,
          inner_code: item.inner_code // 如果源文件需要 inner_code，则添加
        }))
        .filter(item => item.value);
    }
  }
});
```

#### 3.2 生成 param 对象字段

**重要**：param 中的字段必须根据源文件的 `convertRequest` 方法的参数解构来确定！

```typescript
param: {
  sort: "",
  begin_date: "",
  end_date: "",
  // ... 其他字段根据源文件的 convertRequest 参数确定
  // 示例：如果 convertRequest 解构了以下参数：
  // convertRequest({ bond: inner_code, party_company_code, relata_company_code, secu_market, keyword })
  // 则 param 中必须包含这些字段：
  query_type: "3",           // 默认值根据 selected 确定
  keyword: "",
  party_company_code: "",    // 来自 convertRequest 参数
  relata_company_code: "",   // 来自 convertRequest 参数
  company_code: "",
  secu_code: "",
  secu_market: "",           // 来自 convertRequest 参数
  inner_code: ""             // 如果 convertRequest 有 bond: inner_code，则添加
}
```

#### 3.3 生成 changeForm 参数转换

**核心**：changeForm 中的 keyword_filter 处理逻辑必须严格遵循源文件的 `convertRequest` 方法！

```typescript
changeForm(from, to) {
  // ... 其他筛选项转换逻辑（根据源文件的 convertResult 或其他转换逻辑）
  
  // ✅ keyword_filter 处理 - 根据源文件的 convertRequest 方法生成
  if (from.keyword_filter.key) {
    // 【步骤 1】清空所有相关字段 - 根据 convertRequest 的参数确定
    to.keyword = "";
    to.party_company_code = "";
    to.relata_company_code = "";
    to.company_code = "";
    to.secu_market = "";
    to.inner_code = "";  // 如果 convertRequest 有 bond: inner_code，则添加
    
    // 【步骤 2】设置默认 query_type - 根据源文件的默认 selected 确定
    to.query_type = "3";

    // 【步骤 3】根据不同的 selected 生成不同的映射逻辑
    if (from.keyword_filter.selected === "title") {
      // 标题搜索 - 根据 convertRequest 中的 if (this.keywordFilter.selected === "title") 逻辑
      to.keyword = from.keyword_filter.keyword || "";
      to.query_type = "1";
    } else if (from.keyword_filter.selected === "party_company_code_bond_keyword") {
      // 当事人搜索 - 根据 convertRequest 中的对应逻辑
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.keyword || "";
      } else {
        to.party_company_code = from.keyword_filter.value || "";
        to.inner_code = from.keyword_filter.inner_code || "";  // 如果需要
      }
      to.query_type = "2";
    } else if (from.keyword_filter.selected === "relata_company_code_bond_sincerity") {
      // 关联公司搜索 - 根据 convertRequest 中的对应逻辑
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.keyword || "";
      } else {
        to.relata_company_code = from.keyword_filter.value || "";
        to.inner_code = from.keyword_filter.inner_code || "";  // 如果需要
      }
      to.query_type = "3";
    }
  } else {
    // 没有 keyword_filter 时使用 combination - 根据源文件逻辑
    to.party_company_code = from.combination?.result?.company_code || "";
    to.keyword = "";
    to.relata_company_code = "";
    to.company_code = "";
    to.secu_market = "";
    to.inner_code = "";
    to.query_type = "3";
  }
}
```

### 关键要点总结

**✅ 必须遵循的步骤**：

1. **读取源文件**：找到对应的旧版 `*.js` 文件（如 `sincerity.js`）
2. **定位方法**：找到对应 PageModule 的 `convertRequest` 和 `initData` 方法
3. **提取规则**：
   - **options 配置**：从 `initData` 的 `keywordFilter.resetSearchParams` 和实际使用的字段提取
   - **query_type 映射**：从 `convertRequest` 的 `if/else` 判断提取
   - **参数映射**：从 `convertRequest` 的赋值逻辑提取
   - **param 字段**：从 `convertRequest` 的参数解构提取
4. **动态生成配置**：根据提取的规则生成 `-page.vue` 的配置，不要照搬示例代码

**❌ 错误做法**：
- ❌ 直接复制示例代码，而不根据源文件调整
- ❌ 忽略 `convertRequest` 中的参数解构
- ❌ 随意更改 query_type 的值或映射关系
- ❌ 遗漏 convertRequest 中出现的字段

**⚠️ 注意事项**：

1. **每个模块可能不同**：
   - Judicical 模块：使用 `documents_company_code_keyword`、`executor_caseno`
   - Sincerity 模块：使用 `title`、`party_company_code_bond_keyword`、`relata_company_code_bond_sincerity`
   - **必须以实际源文件为准！**
   
2. **query_type 因模块而异**：
   - Sincerity: 1=标题，2=当事人，3=关联公司
   - Judicical: 1=标题，2=案号，4=公司/证券（默认）
   - **必须以源文件的 convertRequest 逻辑为准！**
   
3. **参数映射必须精确**：
   - 有些模块映射到 `party_company_code`
   - 有些模块映射到 `relata_company_code`
   - 有些模块可能需要 `inner_code`、`bond` 等字段
   - **必须根据源文件的 `convertRequest` 来确定！**

4. **param 字段检查清单**：
   - ✅ 列出 `convertRequest` 方法的所有解构参数
   - ✅ 确保 param 对象中包含所有这些字段
   - ✅ 检查是否有默认值需要设置（如 query_type）

```typescript
changeForm(from, to) {
  // ... 其他转换逻辑
  
  // keyword_filter 处理 - 根据 sincerity.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    to.keyword = "";
    to.company_code = "";
    to.relata_company_code = "";
    to.secu_market = "";
    to.party_company_code = "";
    to.query_type = "3";  // 默认值
    
    if (from.keyword_filter.selected === "title") {
      // 标题搜索 - query_type = 1
      to.keyword = from.keyword_filter.keyword || "";
      to.query_type = "1";
    } else if (from.keyword_filter.selected === "party_company_code_bond_keyword") {
      // 当事人搜索 - query_type = 2
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.keyword || "";
      } else {
        to.party_company_code = from.keyword_filter.value || "";
      }
      to.query_type = "2";
    } else if (from.keyword_filter.selected === "relata_company_code_bond_sincerity") {
      // 关联公司搜索 - query_type = 3
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.keyword || "";
      } else {
        to.relata_company_code = from.keyword_filter.value || "";
      }
      to.query_type = "3";
    }
  } else {
    to.keyword = "";
    to.company_code = "";
    to.relata_company_code = "";
    to.secu_market = "";
    to.party_company_code = "";
    to.query_type = "3";
  }
}
```

### query_type 映射表（Sincerity 模块）

| query_type | 含义 | 触发条件 | 对应旧版字段 |
|-----------|------|---------|-------------|
| 1 | 标题搜索 | 用户选择"标题"选项 | `title` |
| 2 | 当事人搜索 | 用户选择"当事人"选项 | `party_company_code_bond_keyword` |
| 3 | 关联公司搜索（默认） | 用户选择"关联公司"选项或不设置 | `relata_company_code_bond_sincerity` |

### 关键要点总结

1. **options 顺序**: 建议按源文件中出现的顺序排列
2. **query_type 设置**: 必须在 changeForm 中显式设置，不同搜索类型对应不同值（根据源文件的 convertRequest 逻辑）
3. **参数映射**: 根据源文件的 convertRequest 方法中的赋值逻辑确定
   - 示例：如果 convertRequest 中有 `params.party_company_code = party_company_code_bond_keyword`，则映射到 `party_company_code`
   - 示例：如果 convertRequest 中有 `params.relata_company_code = relata_company_code`，则映射到 `relata_company_code`
4. **默认值**: 根据源文件的 keywordFilter.selected 默认值确定
5. **代码格式化**: requestData 中的 map 和 filter 应分多行书写，提高可读性
6. **param 字段检查清单**：
   - ✅ 列出 `convertRequest` 方法的所有解构参数
   - ✅ 确保 param 对象中包含所有这些字段
   - ✅ 检查是否有默认值需要设置（如 query_type）
7. **changeForm 生成步骤**：
   - ✅ **步骤 1**：根据 convertRequest 的解构参数，清空所有相关字段
   - ✅ **步骤 2**：根据源文件的默认 selected 设置默认 query_type
   - ✅ **步骤 3**：遍历 convertRequest 中的所有 if/else 分支，为每个 selected 类型生成映射逻辑
   - ✅ **步骤 4**：在 else 分支中处理没有 keyword_filter 的情况（通常使用 combination）
// 添加到 pieces 数组
pieces: [
  keywordFilterFormPiece,  // ✅ 添加实例对象
  ...generateFormPiece.generateAll([...])
]
```

**关键区别**:
- keyword_filter 是一个**函数**，不是组件
- 需要从 `use.ts` 导入，而不是 `index-page.vue`
- 必须**调用函数**并传入配置对象
- 返回的是**FormPiece 实例**，直接添加到 pieces
- **不需要**在 template 中写插槽（Hook 会自动渲染）

---

### 完整示例：documents-page.vue

```vue
<template>
  <TableTemplate :table="table" class="judicical-documents" autoHeight>
    <template #keyword_filter="{ piece }">
      <keyword-filter :target="piece"></keyword-filter>
    </template>
  </TableTemplate>
</template>

<script lang="ts">
import TableTemplate from "@/components/dui/FormTable/TableTemplate.vue";
import { generateFormPiece } from "@/components/ui/instance/formPiece";
import { buriedPoint } from "@/utils/buriedPoint";
import { onMounted, ref } from "vue";
import { TableConfig } from "@/components/dui/FormTable/types";
import keyword_filter from "./components/keyword_filter/use";
import { concat } from "lodash";
import { qsServe } from "@/api/serve";

// 创建 keywordFilter FormPiece
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "公司/证券/标题",
  searchAll: false,  // 启用单选搜索模式
  options: [
    { value: "company_code", label: "公司" },
    { value: "secu_code", label: "证券" },
    { value: "keyword", label: "标题" }
  ],
  requestData: async (keyword: string) => {
    // 并发请求三个 API
    const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: ""
    }).sync;

    const resBond = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: "bond"
    }).sync;
    
    const resStock = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
      keyword,
      page_count: 20,
      page_no: 1,
      source_name: "stock"
    }).sync;
    
    // 合并结果并格式化
    return concat(
      (resCompany.data || []).map(item => ({
        title: `${item.company_name}`,
        key: "company_code",
        value: item.company_code
      })),
      (resStock.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "secu_code",
        value: item.secu_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      })),
      (resBond.data || []).map(item => ({
        title: `${item.secu_abbr}`,
        key: "secu_code",
        value: item.secu_code,
        secu_code: item.secu_code,
        secu_market: item.secu_market
      }))
    ).filter(item => item.value);
  }
});

export default {
  name: "JudicicalDocumentsPage",
  components: { TableTemplate },
  setup() {
    // 埋点
    onMounted(() => {
      buriedPoint.addBuriedPoint({
        name: "page",
        name_ZH: "裁判文书",
        type: "judicical_documents",
        method: "page"
      });
    });

    // 表格配置
    const table = ref<TableConfig>({
      url: "/gildatacompany/v1/legalaction/judgementdoclist",
      param: {
        sort: "",
        company_code: "",
        secu_code: "",
        secu_market: "",
        keyword: ""
      },
      changeForm(from, to) {
        // keyword_filter 值转换逻辑
        if (from.keyword_filter.key) {
          to.company_code = from.keyword_filter.key == "company_code" 
            ? from.keyword_filter.value 
            : "";
          to.secu_code = from.keyword_filter.key == "secu_code" 
            ? from.keyword_filter.value 
            : "";
          to.secu_market = from.keyword_filter.key == "secu_code" 
            ? from.keyword_filter.secu_market 
            : "";
          to.keyword = from.keyword_filter.key == "keyword" 
            ? from.keyword_filter.value 
            : "";
        } else {
          to.company_code = "";
          to.secu_code = "";
          to.secu_market = "";
          to.keyword = "";
        }
        
        // 其他筛选项转换...
        to.sort = from.sort || "";
      },
      pieces: [
        keywordFilterFormPiece,  // keyword_filter 筛选项
        ...generateFormPiece.generateAll([
          // 其他筛选项配置...
        ])
      ],
      column: [
        // 列配置...
      ],
      colValRender: {
        // 列渲染函数...
      }
    });

    return { table };
  }
};
</script>
```

**关键点说明**:
1. **导入组件**: 从 `./components/keyword_filter/use` 导入
2. **配置参数**: `searchAll: false` + `options` 启用单选模式
3. **requestData**: 并发请求三个 API（公司、债券、股票）并合并结果
4. **changeForm**: 根据 `keyword_filter.key` 判断类型并转换到后端参数
5. **pieces**: 将 `keywordFilterFormPiece` 添加到表单配置数组

---

### 基础表单组件（已注册）

| 类型 | 数据类路径 | 用途 |
|------|---------|------|
| `comb_search_cascader` | `@/components/ui/formPiece/components/comb_search_cascader/data` | 级联搜索选择器 |
| `comb_check` | `@/components/ui/formPiece/components/comb_check/data` | 多选复选框 |
| `comb_radio_dateRange` | `@/components/ui/formPiece/components/comb_radio_dateRange/data` | 日期范围选择器 |
| `comb_area_radio` | `@/components/ui/formPiece/components/comb_area_radio/data` | 区域选择器 |
| `combination` | `@/components/ui/formPiece/components/combination/data` | 组合监控选择器 |
| `comb_checkbox_cascader` | `@/components/ui/formPiece/components/comb_checkbox_cascader/data` | 复选框级联选择器 |
| `input` | `@/components/ui/formPiece/components/input/data` | 输入框 |
| `comb_radio` | `@/components/ui/formPiece/components/comb_radio/data` | 单选按钮组 |
| `comb_dateRange` | `@/components/ui/formPiece/components/comb_dateRange/data` | 日期范围 |
| `comb_infinit_dateRange` | `@/components/ui/formPiece/components/comb_infinit_dateRange/data` | 无限日期范围 |
| `sort_panel` | `@/components/ui/formPiece/components/sort_panel/data` | 排序面板 |
| `select_slot` | `@/components/ui/formPiece/components/select_slot/data` | 带插槽选择器 |

### dui 页面组件（index-page.vue）

| 类型 | 组件路径 |
|------|---------|
| `comb_search_cascader` | `@/components/dui/formPiece/comb_search_cascader/index-page.vue` |
| `comb_check` | `@/components/dui/formPiece/comb_check/index-page.vue` |
| `comb_radio_dateRange` | `@/components/dui/formPiece/comb_radio_dateRange/index-page.vue` |
| `comb_area_radio` | `@/components/dui/formPiece/comb_area_radio/index-page.vue` |
| `combination` | `@/components/dui/formPiece/combination/index-page.vue` |
| `comb_checkbox_cascader` | `@/components/dui/formPiece/comb_checkbox_cascader/index-page.vue` |
| `comb_check_slot` | `@/components/dui/formPiece/comb_check_slot/index-page.vue` |
| `input` | `@/components/dui/formPiece/input/index-page.vue` |

**注意**: 部分类型在 `modules.ts` 中注册但缺少对应的 `index-page.vue` 组件，使用时可暂时用基础类型替代。

## 关键配置规范

### 日期范围选择器

``typescript
{
  type: "comb_radio_dateRange",
  key: "daterange",
  label: "发布日期",
  allLabel: "全部",
  options: [
    { label: "近 7 天", value: 7, v: 7 * 24 * 60 * 60 * 1000 },
    { label: "近 14 天", value: 14, v: 14 * 24 * 60 * 60 * 1000 },
    { label: "自定义", value: 0 }
  ],
  needAll: true,    // 显示"全部"选项
  needLabel: true,  // 显示标签
  value: {
    radio: 7,
    dateRange: [moment().subtract(7, "day").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
  },
  convertKV(_, value) {
    const result: Record<string, any> = {};
    if (value && value.radio != -1) {
      if (value.radio == 0) {
        result.begin_date = value.begin_date;
        result.end_date = value.end_date;
      } else {
        result.begin_date = value.begin_date;
        result.end_date = "";
      }
    }
    return result;
  }
}
```

**重要**: 当 `needAll: true` 时，不要在 `options` 中添加 `{ label: "全部", value: -1 }`，组件会自动添加。

### 组合监控

``typescript
{
  type: "combination",
  label: "组合范围：",
  key: "combination",
  modelCode: "026",  // 组合模型代码
  options: [
    { label: "不限", value: 1 },
    { label: "组合监控", value: 2 }
  ]
}
```

### colValRender 渲染函数

使用 `h()` 函数创建 VNode，不要使用 JSX 语法：

``typescript
colValRender: {
  column_prop(h, data, key, scope, table) {
    return h(ComponentName, {
      props: {
        scope: scope,
        rowKey: key,
        table: table
      }
    });
  },
  
  // 条件渲染
  conditional_column(h, data, key, scope, table) {
    if (scope.row.some_condition) {
      return h(SpecialComponent, {
        props: { scope, rowKey: key, table }
      });
    }
    return h("span", scope.row[key]);
  }
}
```

### 常用渲染组件

#### judicical 模块

| 组件名 | 路径 |
|--------|------|
| `JudicicalPartyArray` | `@/components/TableSlot/TableCol/JudicicalPartyArray.vue` |
| `JudicicalInfoTitle` | `@/components/TableSlot/TableCol/JudicicalInfoTitle.vue` |
| `JudicicalExecutorTarget` | `@/components/TableSlot/TableCol/JudicicalExecutorTarget.vue` |
| `JudicicalPeopleEnforced` | `@/components/TableSlot/TableCol/JudicicalPeopleEnforced.vue` |
| `JudicicalExecuteState` | `@/components/TableSlot/TableCol/JudicicalExecuteState.vue` |
| `JudicicalRid` | `@/components/TableSlot/TableCol/JudicicalRid.vue` |
| `JudicicalEquityAmount` | `@/components/TableSlot/TableCol/JudicicalEquityAmount.vue` |
| `JudicicalNoticeCode` | `@/components/TableSlot/TableCol/JudicicalNoticeCode.vue` |
| `JudicicalExecuteNumber` | `@/components/TableSlot/TableCol/JudicicalExecuteNumber.vue` |
| `JudicicalDetails` | `@/components/TableSlot/TableCol/JudicicalDetails.vue` |
| `JudicicalExecution` | `@/components/TableSlot/TableCol/JudicicalExecution.vue` |
| `JudicicalOutstandingAmount` | `@/components/TableSlot/TableCol/JudicicalOutstandingAmount.vue` |
| `JudicicalCaseStatus` | `@/components/TableSlot/TableCol/JudicicalCaseStatus.vue` |
| `JudicicalStartingPrice` | `@/components/TableSlot/TableCol/JudicicalStartingPrice.vue` |
| `JudicicalAppraisalValue` | `@/components/TableSlot/TableCol/JudicicalAppraisalValue.vue` |
| `JudicicalRelatedPartyName` | `@/components/TableSlot/TableCol/JudicicalRelatedPartyName.vue` |

#### sincerity 模块

| 组件名 | 路径 |
|--------|------|
| `SincerityPartyCompanyName` | `@/components/TableSlot/TableCol/SincerityPartyCompanyName.vue` |
| `SincerityInfoTitle` | `@/components/TableSlot/TableCol/SincerityInfoTitle.vue` |
| `SincerityArray` | `@/components/TableSlot/TableCol/SincerityArray.vue` |
| `NumberConvert` | `@/components/TableSlot/TableCol/NumberConvert.vue` |
| `SincerityCompanyArray` | `@/components/TableSlot/TableCol/SincerityCompanyArray.vue` |

**重要**: `colValRender` 配置需根据 `@/components/TableSlot/tableConvert.js` 中的映射关系设置，不需要在 `TableConfig` 中添加 `modelId` 属性。

## 路由配置

### loadComponent 模式

``typescript
// router/data.ts
import { loadComponent } from "@/router/utils";

export default [
  {
    path: "announcement",
    name: "InformationAnnouncement",
    component: () => import("./home.vue"),
    children: [
      {
        path: "announcement",
        name: "Announcement",
        component: loadComponent(
          () => import("./announcement/announcement-page.vue"),
          () => import("./announcement/announcement.vue")
        )
      }
    ]
  }
];
```

### loadComponent 函数

``typescript
// router/utils.ts
export function loadComponent(newComponent: () => Promise<any>, oldComponent: () => Promise<any>) {
  return async () => {
    const store = useMainStore();
    if (store.dui) {
      return (await newComponent()).default;
    }
    return (await oldComponent()).default;
  };
}
```

## 迁移工作流

### 步骤 1: 文件创建

- [ ] 创建 `{name}-page.vue` 文件
- [ ] 使用 Vue 3 Composition API + TypeScript
- [ ] 导入 `TableTemplate` 和表单组件
- [ ] 配置 `TableConfig`

### 步骤 2: 表单配置

- [ ] 从旧组件提取 `pieces` 配置
- [ ] 使用 `generateFormPiece.generateAll()` 生成配置
- [ ] 检查 `comb_radio_dateRange` 的 `needAll` 选项
- [ ] 配置 `changeForm` 转换逻辑
- [ ] **重要**: 对比源文件的 `paramFilter.setParams` 或常量文件中的参数定义
- [ ] **注意**: 如果源文件中某些筛选项被注释掉，`-page.vue` 中也不需要添加
- [ ] **验证**: 确保 `param` 中的所有字段都有对应的筛选项（除非故意留空）

### 步骤 3: 列配置

- [ ] 从旧组件提取 `column` 配置
- [ ] 根据 `tableConvert.js` 配置 `colValRender`
- [ ] 导入所需的渲染组件
- [ ] 使用 `h()` 函数而非 JSX
- [ ] **重要**: 确保每一列都在 `colValRender` 中有对应的渲染函数（如果该列需要自定义渲染）
- [ ] **验证**: 对比源文件和 `-page.vue` 的 `column` 数组，确保所有列都已迁移
- [ ] **检查**: 对于需要数据转换的列（如金额、数字），确认已添加对应的渲染组件

### 步骤 4: 路由更新

- [ ] 在路由配置中使用 `loadComponent`
- [ ] 保持旧组件路径不变
- [ ] 新组件作为 dui 模式替代

### 步骤 5: 测试验证

- [ ] 验证表单筛选功能
- [ ] 验证表格数据展示
- [ ] 验证列渲染组件
- [ ] 验证分页功能
- [ ] 验证埋点数据

## 常见问题

### Q1: TypeScript 报错 "modelId 不在类型 TableConfig 中"

**A**: 不需要添加 `modelId` 属性。只需根据 `tableConvert.js` 的映射关系配置 `colValRender`。

### Q2: 日期选择器显示两个"全部"选项

**A**: 当 `needAll: true` 时，不要在 `options` 中手动添加 `{ label: "全部", value: -1 }`。

### Q3: colValRender 中使用 JSX 报错

**A**: 使用 `h()` 函数替代 JSX 语法：

``typescript
// 错误
return <span>{scope.row[key]}</span>;

// 正确
return h("span", scope.row[key]);
```

### Q4: 如何处理特殊的列渲染逻辑

**A**: 在 `colValRender` 函数中添加条件判断：
``typescript
special_column(h, data, key, scope, table) {
  if (scope.row.type === "special") {
    return h(SpecialComponent, { props: { scope, rowKey: key, table } });
  }
  return h("span", scope.row[key]);
}
```

### Q5: 页面缺少某些列或列渲染不正确

**A**: 这是常见的遗漏问题。请按以下步骤检查：

1. **对比 column 数组**: 确保 `-page.vue` 的 `column` 数组包含源文件中的所有列
2. **检查 colValRender**: 对于需要自定义渲染的列，确保在 `colValRender` 中有对应的函数
3. **验证组件导入**: 确认所有渲染组件都已正确导入
4. **参考 tableConvert.js**: 查看 `@/components/TableSlot/tableConvert.js` 中的映射关系，确认使用了正确的渲染组件

**示例**:
```typescript
// 源文件有这一列
{ label: "执行标的 (万元)", prop: "execute_target", width: 105 }

// -page.vue 中也必须有，并且需要配置渲染
const table = ref<TableConfig>({
  column: [
    { label: "执行标的 (万元)", prop: "execute_target", width: 105 }
  ],
  colValRender: {
    execute_target(h, data, key, scope, table) {
      return h(ExecutorNumberConvert, {
        props: { scope, rowKey: key, table, billion: false, decimal: 2, comma: true }
      });
    }
  }
});
```

### Q6: 如何判断是否需要添加某个筛选项

**A**: 按以下步骤判断：

1. **检查源文件**: 查看旧版组件的 `paramFilter.setParams` 或常量文件（如 `DocumentsParams`）
2. **注意注释状态**: 如果源文件中筛选项被注释掉，则不需要添加
3. **对比 param**: 检查 `-page.vue` 的 `param` 对象，确认字段是否已有对应筛选项
4. **参考 changeForm**: 如果 `changeForm` 中处理了某个字段，通常应该有对应的筛选项

**示例**:
```javascript
// 源文件：judicical.js
export let DocumentsParams = [
  { type: "comb_check", key: "executeTarget", label: "执行标的" } // 被注释掉
];

// documents-page.vue
const table = ref<TableConfig>({
  param: {
    min_execute_target: "",  // ✅ param 中有
    max_execute_target: ""   // ✅ param 中有
  },
  pieces: [
    // ❌ 不需要添加 executeTarget 筛选项（因为源文件中被注释）
  ]
});
```

## 完整示例

**重要提示**：以下示例代码仅供参考！实际开发中必须根据源文件的 `convertRequest` 和 `initData` 方法动态生成配置，不要照搬示例代码。

每个模块的字段名、query_type 映射、参数映射都可能不同，必须严格按照以下步骤操作：

1. ✅ **读取源文件**：找到对应的 `*.js` 文件（如 `judicical.js`、`sincerity.js`）
2. ✅ **定位方法**：找到对应 PageModule 的 `convertRequest` 和 `initData`
3. ✅ **提取规则**：从 `convertRequest` 的参数解构、if/else 判断、赋值逻辑中提取
4. ✅ **动态生成**：根据提取的规则生成配置，而不是复制示例代码

### 示例 1: documents-page.vue (裁判文书)

查看 [`documents-page.vue`](../../dev/doc/page-component-migration-guide.md#完整示例-documents-pagevue) 完整示例。

### 示例 2: dishonestyExecutor-page.vue (失信被执行人)

**⚠️ 注意**：以下示例基于 judicical.js L593-609 的配置，其他模块需要根据实际源文件调整！

```typescript
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  selected: "executor_name",  // ⚠️ 根据源文件的 initData 中的 keywordFilter.selected 确定
  options: [
    // ⚠️ 根据源文件的 initData 中的 resetSearchParams 参数和实际字段确定
    { value: "executor_name", label: "被执行人" },
    { value: "faith_executor_caseno", label: "案件号" }
  ],
  // ⚠️ 根据源文件的 initData 中的 getPlaceholder 逻辑生成
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "executor_name") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "faith_executor_caseno") {
      return "请输入案件号";
    }
    return "请输入公司名称/证券简称/证券代码";
  },
  requestData: async (keyword: string) => {
    // ⚠️ 根据选中的搜索类型调用对应 API（根据源文件的 match.js 或实际接口确定）
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "faith_executor_caseno") {
      // 案件号搜索
      const res = await qsServe("/legalnews/executeesearch", {
        keyword,
        type: 2,
        size: 100
      }).sync;
      
      return (res.data?.case_number_array || []).map(item => ({
        title: item.case_number,
        key: "faith_executor_caseno",
        value: item.executee_id
      }));
    } else if (selectedType === "title") {
      // 标题搜索 - 直接返回关键词
      return [{
        title: keyword,
        key: "title",
        value: keyword
      }];
    } else {
      // 被执行人搜索
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || []).map(item => ({
        title: `${item.company_name}`,
        key: "executor_name",
        value: item.company_code
      })).filter(item => item.value);
    }
  }
});

// ⚠️ changeForm 处理必须根据源文件的 convertRequest 方法生成
changeForm(from, to) {
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    // ⚠️ 清空所有字段 - 根据 convertRequest 的参数解构确定
    to.keyword = "";
    to.company_code = "";
    
    // ⚠️ 根据不同的 selected 生成不同的映射 - 根据 convertRequest 的 if/else 分支
    if (from.keyword_filter.selected === "executor_name") {
      // 被执行人搜索 - 对应旧代码的 executor_name
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
      } else {
        to.company_code = from.keyword_filter.value || "";
      }
    } else if (from.keyword_filter.selected === "faith_executor_caseno") {
      // 案件号搜索 - 对应旧代码的 executor_caseno
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
      } else {
        to.keyword = from.keyword_filter.value || "";
      }
    } else if (from.keyword_filter.selected === "title") {
      // 标题搜索
      to.keyword = from.keyword_filter.value || "";
    }
  } else {
    to.company_code = from.combination?.result?.company_code || "";
    to.secu_code = "";
    to.secu_market = "";
    to.keyword = "";
  }
  
  // ⚠️ 其他筛选项转换根据源文件的 convertResult 或其他逻辑
  to.info_publ_begin_date = from.info_publ_begin_date || "";
  to.info_publ_end_date = from.info_publ_end_date || "";
  to.company_code = from.combination?.result?.company_code || to.company_code;
  to.keyword = from.keyword || to.keyword;
}
```

### 示例 3: endCase-page.vue (终本案件)

**⚠️ 注意**：以下示例基于 judicical.js L658-683 的配置，其他模块需要根据实际源文件调整！

```typescript
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  selected: "executor_name_limit",
  options: [
    { value: "executor_name_limit", label: "被执行人" },
    { value: "executor_caseno", label: "案件号" }
  ],
  // 动态占位符
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "executor_name_limit") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "executor_caseno") {
      return "请输入案件号";
    }
    return "请输入公司名称/证券简称/证券代码";
  },
  requestData: async (keyword: string) => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "executor_caseno") {
      // 案件号搜索
      const res = await qsServe("/legalnews/executeesearch", {
        keyword,
        type: 2,
        size: 100
      }).sync;
      
      return (res.data?.case_number_array || []).map(item => ({
        title: item.case_number,
        key: "executor_caseno",
        value: item.executee_id
      }));
    } else if (selectedType === "title") {
      // 标题搜索 - 直接返回关键词
      return [{
        title: keyword,
        key: "title",
        value: keyword
      }];
    } else {
      // 被执行人搜索
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || []).map(item => ({
        title: `${item.company_name}`,
        key: "executor_name_limit",
        value: item.company_code
      })).filter(item => item.value);
    }
  }
});

// changeForm 处理（filter_type）
changeForm(from, to) {
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    to.keyword = "";
    
    if (from.keyword_filter.selected === "executor_name_limit") {
      // 被执行人搜索
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 0;
      } else {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 0;
      }
    } else if (from.keyword_filter.selected === "executor_caseno") {
      // 案件号搜索
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 1;
      } else {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 1;
      }
    } else if (from.keyword_filter.selected === "title") {
      // 标题搜索
      to.keyword = from.keyword_filter.value || "";
    }
  } else {
    to.company_code = from.combination?.result?.company_code || "";
    to.secu_code = "";
    to.secu_market = "";
    to.keyword = "";
  }
  
  to.begin_date = from.begin_date || "";
  to.end_date = from.end_date || "";
  to.company_code = from.combination?.result?.company_code || to.company_code;
  to.keyword = from.keyword || to.keyword;
}
```

### 示例 4: fileInformation-page.vue (立案信息)

**⚠️ 注意**：以下示例基于 judicical.js L733-758 的配置（实际生产代码优化版），其他模块需要根据实际源文件调整！

```typescript
import { qsServe } from "@/api/serve";

const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  selected: "party_company_code_keyword",
  options: [
    { value: "party_company_code_keyword", label: "当事人" },
    { value: "executor_caseno", label: "案件号" }
  ],
  // 动态占位符 - 移除 title 选项的提示
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "party_company_code_keyword") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "executor_caseno") {
      return "请输入案件号";
    }
    return "请输入公司名称/证券简称/证券代码"; // 默认值
  },
  requestData: async (keyword: string) => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "executor_caseno") {
      // 案件号搜索 - 使用/gildatabond/v1/legalnews/executeesearch 接口
      const res = await qsServe("/gildatabond/v1/legalnews/executeesearch", {
        keyword,
        page_no: 0,
        page_count: 100,
        query_type: 2
      }).sync;

      return (res.data?.case_number_array || []).map(item => ({
        title: item.case_number,
        key: "executor_caseno",
        value: item.executee_id
      }));
    } else {
      // 当事人搜索 - 返回 inner_code 用于债券代码
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || [])
        .map(item => ({
          title: `${item.company_name}`,
          key: "party_company_code_keyword",
          value: item.company_code,
          inner_code: item.inner_code // 重要：包含 inner_code 用于债券代码
        }))
        .filter(item => item.value);
    }
  }
});

// changeForm 处理（filter_type）- 简化版本
changeForm(from, to) {
  // 提前初始化固定字段
  to.begin_date = from.begin_date || "";
  to.end_date = from.end_date || "";
  to.case_state = from.case_state == "-1" ? "" : from.case_state;
  
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    to.keyword = "";
    to.company_code = "";
    to.filter_type = "";

    if (from.keyword_filter.selected === "party_company_code_keyword") {
      // 当事人搜索 - 对应旧代码的 party_company_code_keyword
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 0;
      } else {
        to.company_code = from.keyword_filter.value || "";
        to.filter_type = 0;
      }
    } else if (from.keyword_filter.selected === "executor_caseno") {
      // 案件号搜索 - 对应旧代码的 executor_caseno
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 1;
      } else {
        to.keyword = from.keyword_filter.value || "";
        to.filter_type = 1;
      }
    }
    // 注意：移除了 title 选项的处理
  } else {
    to.company_code = from.combination?.result?.company_code || "";
    to.keyword = "";
    to.filter_type = "";
  }
}
```

**关键优化点**:
1. ✅ **移除 title 选项**: getPlaceholder 中不再判断 `selectedType === "title"`
2. ✅ **API 路径优化**: 案件号搜索使用 `/gildatabond/v1/legalnews/executeesearch`（带版本号）
3. ✅ **参数格式调整**: 使用 `page_no: 0` 替代 `type: 2`，添加 `query_type: 2`
4. ✅ **inner_code 支持**: 公司搜索结果包含 `inner_code` 字段用于债券代码
5. ✅ **changeForm 简化**: 提前初始化固定字段，避免在 else 分支重复赋值
6. ✅ **移除冗余代码**: 删除了 `to.secu_code`、`to.secu_market` 等不需要的字段

### 示例 5: judicialAuction-page.vue (司法拍卖)

**⚠️ 注意**：以下示例基于 judicical.js L879-913 的配置（实际生产代码优化版），其他模块需要根据实际源文件调整！

```typescript
import { qsServe } from "@/api/serve";

const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  selected: "party_company_code_keyword",
  // 注意：title 排在前面，作为默认选项
  options: [
    { value: "title", label: "项目名称" },
    { value: "party_company_code_keyword", label: "当事人" }
  ],
  // 动态占位符
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "party_company_code_keyword") {
      return "请输入公司名称/证券简称/证券代码";
    }
    return "请输入公司名称/证券简称/证券代码";
  },
  requestData: async (keyword: string) => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "title") {
      // 标题搜索 - 直接返回关键词
      return [
        {
          title: keyword,
          key: "title",
          value: keyword
        }
      ];
    } else {
      // 当事人搜索
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || [])
        .map(item => ({
          title: `${item.company_name}`,
          key: "party_company_code_keyword",
          value: item.company_code
        }))
        .filter(item => item.value);
    }
  }
});

// changeForm 处理（filter_type）- 使用 keyword_filter.keyword
changeForm(from, to) {
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    if (from.keyword_filter.selected === "party_company_code_keyword") {
      // 当事人搜索 - 对应旧代码的 party_company_code_keyword
      if (from.keyword_filter.key === "keyword") {
        to.keyword = from.keyword_filter.keyword || ""; // 使用 keyword 而非 value
        to.filter_type = 0;
      } else {
        to.company_code = from.keyword_filter.value || "";
        to.filter_type = 0;
      }
    } else if (from.keyword_filter.selected === "title") {
      // 标题搜索 - 使用 keyword_filter.keyword
      to.keyword = from.keyword_filter.keyword || "";
      to.filter_type = 1;
    }
  } else {
    to.company_code = from.combination?.result?.company_code || "";
    to.keyword = "";
  }
}
```

**关键优化点**:
1. ✅ **options 顺序调整**: title 排在第一位，作为默认选中项
2. ✅ **使用 keyword_filter.keyword**: 关键词直搜时使用 `from.keyword_filter.keyword` 而非 `from.keyword_filter.value`
3. ✅ **简化 param 配置**: 移除 begin_date、end_date、secu_code、secu_market 等不需要的字段
4. ✅ **移除冗余 pieces**: 只保留 keywordFilterFormPiece，移除 comb_radio_dateRange 和 combination
5. ✅ **API 路径优化**: 使用完整路径 `/gildatacompany/v1/legalaction/auctioninfo`

### 示例 6: limitHighConsumption-page.vue (限制高消费)

**⚠️ 注意**：以下示例基于 judicical.js L808-845 的配置（实际生产代码优化版），其他模块需要根据实际源文件调整！

```typescript
import { qsServe } from "@/api/serve";

const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  selected: "executor_name_limit",
  options: [
    { value: "executor_name_limit", label: "被执行人" },
    { value: "relata_company_code_limit", label: "关联企业" },
    { value: "execute_apply_name", label: "申请执行人" },
    { value: "executor_caseno", label: "案件号" }
  ],
  // 动态占位符 - 移除 title 选项
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "executor_name_limit") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "relata_company_code_limit") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "execute_apply_name") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "executor_caseno") {
      return "请输入案件号";
    }
    return "请输入公司名称/证券简称/证券代码";
  },
  requestData: async (keyword: string) => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "executor_caseno") {
      // 案件号搜索 - 使用 /gildatabond/v1/legalnews/executeesearch
      const res = await qsServe("/gildatabond/v1/legalnews/executeesearch", {
        keyword,
        type: 2,
        size: 100
      }).sync;
      
      return (res.data?.case_number_array || []).map(item => ({
        title: item.case_number,
        key: "executor_caseno",
        value: item.case_number // 使用 case_number 而非 executee_id
      }));
    } else if (selectedType === "title") {
      // 标题搜索 - 保留但不在 getPlaceholder 中显示
      return [
        {
          title: keyword,
          key: "title",
          value: keyword
        }
      ];
    } else {
      // 公司/证券搜索（支持多种类型）
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      return (resCompany.data || [])
        .map(item => ({
          title: `${item.company_name}`,
          key: selectedType, // executor_name_limit / relata_company_code_limit / execute_apply_name
          value: item.company_name // 使用 company_name 而非 company_code
        }))
        .filter(item => item.value);
    }
  }
});

// changeForm 处理（多 filter_type）- 大幅简化
changeForm(from, to) {
  // keyword_filter 处理 - 根据 judicical.js convertRequest 逻辑
  if (from.keyword_filter.key) {
    to.keyword = "";
    to.filter_type = "";

    if (from.keyword_filter.selected === "executor_name_limit") {
      // 被执行人搜索 - 直接使用 keyword_filter.keyword
      to.keyword = from.keyword_filter.keyword || "";
      to.filter_type = 0;
    } else if (from.keyword_filter.selected === "relata_company_code_limit") {
      // 关联企业搜索
      to.keyword = from.keyword_filter.keyword || "";
      to.filter_type = 1;
    } else if (from.keyword_filter.selected === "execute_apply_name") {
      // 申请执行人搜索
      to.keyword = from.keyword_filter.keyword || "";
      to.filter_type = 2;
    } else if (from.keyword_filter.selected === "executor_caseno") {
      // 案件号搜索
      to.keyword = from.keyword_filter.keyword || "";
      to.filter_type = 99;
    }
    // 注意：移除了 title 选项的处理
  } else {
    to.keyword = "";
    to.filter_type = "";
  }

  to.begin_date = from.begin_date || "";
  to.end_date = from.end_date || "";
  // 注意：移除了 combination 相关的赋值
}
```

**关键优化点**:
1. ✅ **getPlaceholder 简化**: 移除 title 选项的提示文本
2. ✅ **value 字段调整**: 公司搜索返回 `item.company_name` 而非 `item.company_code`
3. ✅ **案件号搜索优化**: 返回 `item.case_number` 作为 value
4. ✅ **changeForm 大幅简化**: 
   - 移除所有 `if (from.keyword_filter.key === "keyword")` 的双层判断
   - 直接使用 `from.keyword_filter.keyword` 进行关键词直搜
   - 移除 `to.company_code`、`to.secu_code`、`to.secu_market` 等字段
   - 移除 combination 相关的赋值
5. ✅ **API 路径优化**: 使用完整路径 `/gildatacompany/v1/legalaction/limithighconsume`
6. ✅ **pieces 精简**: 移除 comb_radio_dateRange 和 combination，只保留 keywordFilterFormPiece

### 示例 2: 完整配置模板（含 keywordFilter）

```vue
<template>
  <TableTemplate :table="table" class="judicical-documents" autoHeight>
    <!-- keyword_filter 会自动渲染，不需要手动写插槽 -->
  </TableTemplate>
</template>

<script lang="ts">
import TableTemplate from "@/components/dui/FormTable/TableTemplate.vue";
import { generateFormPiece } from "@/components/ui/instance/formPiece";
import { buriedPoint } from "@/utils/buriedPoint";
import moment from "moment";
import { onMounted, ref } from "vue";
import { TableConfig } from "@/components/dui/FormTable/types";
import keyword_filter from "./components/keyword_filter/use";
import { concat } from "lodash";
import { qsServe } from "@/api/serve";

// 创建 keywordFilter FormPiece
const keywordFilterFormPiece = keyword_filter({
  label: "",
  key: "keyword_filter",
  placeholder: "请输入公司名称/证券简称/证券代码",
  options: [
    { value: "documents_company_code_keyword", label: "当事人" },
    { value: "executor_caseno", label: "案件号" }
  ],
  // 动态占位符
  getPlaceholder: () => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    if (selectedType === "title") {
      return "请输入关键字";
    } else if (selectedType === "documents_company_code_keyword") {
      return "请输入公司名称/证券简称/证券代码";
    } else if (selectedType === "executor_caseno") {
      return "请输入案件号";
    }
    return "请输入公司名称/证券简称/证券代码";
  },
  requestData: async (keyword: string) => {
    const selectedType = keywordFilterFormPiece.state.value.selected;
    
    if (selectedType === "executor_caseno") {
      // 案件号搜索
      const res = await qsServe("/legalnews/executeesearch", {
        keyword,
        type: 2,
        size: 100
      }).sync;
      
      return (res.data?.case_number_array || []).map(item => ({
        title: item.case_number,
        key: "executor_caseno",
        value: item.executee_id
      }));
    } else {
      // 公司/证券搜索
      const resCompany = await qsServe("/gildatacompany/v1/companyinfo/companytabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: ""
      }).sync;

      const resBond = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: "bond"
      }).sync;
      
      const resStock = await qsServe("/gildatacompany/v1/companyinfo/secutabsearch", {
        keyword,
        page_count: 100,
        page_no: 1,
        source_name: "stock"
      }).sync;
      
      return concat(
        (resCompany.data || []).map(item => ({
          title: `${item.company_name}`,
          key: "documents_company_code_keyword",
          value: item.company_code
        })),
        (resStock.data || []).map(item => ({
          title: `${item.secu_abbr}`,
          key: "documents_company_code_keyword",
          value: item.company_code,
          secu_code: item.secu_code,
          secu_market: item.secu_market
        })),
        (resBond.data || []).map(item => ({
          title: `${item.secu_abbr}`,
          key: "documents_company_code_keyword",
          value: item.company_code,
          secu_code: item.secu_code,
          secu_market: item.secu_market
        }))
      ).filter(item => item.value);
    }
  }
});

export default {
  name: "JudicicalDocumentsPage",
  components: { TableTemplate },
  setup() {
    onMounted(() => {
      buriedPoint.addBuriedPoint({
        name: "page",
        name_ZH: "裁判文书",
        type: "judicical_documents",
        method: "page"
      });
    });

    const table = ref<TableConfig>({
      url: "/gildatacompany/v1/legalaction/judgementlist",
      param: {
        sort: "",
        begin_date: "",
        end_date: "",
        verdict_type: "",
        subject_matter_code: "",
        party_kind: "",
        company_code: "",
        secu_code: "",
        secu_market: "",
        keyword: "",
        min_execute_target: "",
        max_execute_target: "",
        amount_screen_type: ""
      },
      changeForm(from, to) {
        // keyword_filter 处理
        if (from.keyword_filter.key) {
          if (from.keyword_filter.key === "documents_company_code_keyword") {
            to.company_code = from.keyword_filter.value || "";
            to.secu_code = from.keyword_filter.secu_code || "";
            to.secu_market = from.keyword_filter.secu_market || "";
          } else if (from.keyword_filter.key === "executor_caseno") {
            to.keyword = from.keyword_filter.value || "";
            to.query_type = 2;
          }
        } else {
          to.company_code = from.combination?.result?.company_code || "";
          to.secu_code = "";
          to.secu_market = "";
          to.keyword = "";
          delete to.query_type;
        }
        
        // 其他筛选项转换...
        to.begin_date = from.begin_date || "";
        to.end_date = from.end_date || "";
        to.verdict_type = from.verdict_type == "-1" ? "" : from.verdict_type;
      },
      pieces: [
        keywordFilterFormPiece,
        ...generateFormPiece.generateAll([
          {
            type: "comb_radio_dateRange",
            key: "daterange",
            label: "发布日期",
            allLabel: "全部",
            options: [
              { label: "3 个月", value: 3 },
              { label: "自定义", value: 0 }
            ],
            needAll: true,
            needLabel: true,
            value: { radio: 3 },
            convertKV(_, value) {
              const result: Record<string, any> = {};
              if (value && value.radio != -1) {
                if (value.radio == 0) {
                  result.begin_date = value.begin_date;
                  result.end_date = value.end_date;
                } else if (value.radio == 3) {
                  result.begin_date = moment().subtract(3, "months").format("YYYY-MM-DD");
                  result.end_date = moment().format("YYYY-MM-DD");
                }
              }
              return result;
            }
          }
        ])
      ],
      column: [
        { label: "发布日期", prop: "pub_date", width: 120 },
        { label: "标题", prop: "info_title", minWidth: 250 },
        { label: "当事人", prop: "party_array", minWidth: 190 },
        { label: "案由", prop: "subject_matter", minWidth: 120 }
      ],
      colValRender: {
        info_title(h, data, key, scope, table) {
          return h(DocumentsTitle, {
            props: { scope, rowKey: key, table, source_name: "stock" }
          });
        }
      }
    });

    return { table };
  }
};
</script>
```

**关键点说明**:
1. **导入组件**: 从 `./components/keyword_filter/use` 导入
2. **配置参数**: 
   - `options`: 来自 match.js 的配置
   - `getPlaceholder`: 动态占位符函数
   - `requestData`: 根据 selectedType 调用不同接口
3. **changeForm**: 根据 `keyword_filter.key` 判断类型并转换到后端参数
4. **pieces**: 将 `keywordFilterFormPiece` 添加到表单配置数组
5. **query_type**: 案件号搜索时设置为 2，公司/证券搜索不设置（默认为 4）

## KeywordFilter 配置验证清单

在生成 KeywordFilter 配置后，必须对照以下清单验证：

### ✅ 源文件分析检查

- [ ] **已读取源文件**：找到对应的 `*.js` 文件（如 `judicical.js`、`sincerity.js`）
- [ ] **已定位方法**：找到对应 PageModule 的 `convertRequest` 和 `initData` 方法
- [ ] **已提取参数**：列出了 `convertRequest` 的所有解构参数
- [ ] **已提取映射**：记录了 `convertRequest` 中所有的 if/else 分支和赋值逻辑
- [ ] **已提取默认值**：记录了 `initData` 中的 keywordFilter.selected 默认值

### ✅ options 配置检查

- [ ] **来源正确**：options 来自源文件的 `resetSearchParams` 参数或实际使用的字段
- [ ] **包含 title**：如果源文件支持标题搜索，options 中包含 `{ value: "title", label: "标题" }`
- [ ] **顺序合理**：options 的顺序与源文件中出现的顺序一致
- [ ] **label 准确**：每个 option 的 label 与源文件或 match.js 中的描述一致

### ✅ param 字段检查

- [ ] **完整列出**：param 包含 `convertRequest` 中所有解构参数对应的字段
- [ ] **无遗漏**：没有遗漏任何在 convertRequest 中出现的字段
- [ ] **默认值正确**：query_type 等字段的默认值与源文件的默认 selected 对应

### ✅ changeForm 逻辑检查

- [ ] **清空字段**：在 if (from.keyword_filter.key) 分支开始时清空所有相关字段
- [ ] **默认 query_type**：设置了正确的默认 query_type（根据源文件的默认 selected）
- [ ] **覆盖所有分支**：遍历了 convertRequest 中所有的 if/else 分支
- [ ] **映射正确**：每个 selected 类型的字段映射与 convertRequest 中的赋值逻辑一致
- [ ] **else 处理**：正确处理了没有 keyword_filter 的情况（通常使用 combination）

### ✅ requestData 检查

- [ ] **API 正确**：每个搜索类型调用的 API 与源文件或 match.js 一致
- [ ] **参数完整**：API 调用参数包含了必要的字段（如 type、query_type、page_no 等）
- [ ] **返回格式**：返回的数据格式统一，包含 title、key、value 字段
- [ ] **包含扩展字段**：如果源文件需要 inner_code 等字段，在搜索结果中也包含

### ✅ 常见错误避免

- [ ] **未照搬示例**：配置是根据源文件动态生成的，不是照搬示例代码
- [ ] **字段名匹配**：使用的字段名与源文件的 convertRequest 参数完全一致
- [ ] **query_type 正确**：不同搜索类型的 query_type 值与源文件一致
- [ ] **无硬编码**：没有硬编码其他模块特有的字段名或逻辑

### ✅ 任务完成后的反思

在验证完成后，花 5 分钟反思：

- [ ] **是否有新发现？** 发现了之前不知道的字段、规则或技巧吗？
- [ ] **是否有踩坑？** 遇到了什么容易犯的错误吗？
- [ ] **是否有优化？** 有比 SKILL.md 中更好的实现方式吗？
- [ ] **是否需要补充？** 这些新发现值得补充到 SKILL.md 吗？

**如果答案是肯定的，请立即执行「第六步：总结与知识沉淀」！**

## 相关文档

- 详细文档：[`dev/doc/page-component-migration-guide.md`](../../dev/doc/page-component-migration-guide.md)
