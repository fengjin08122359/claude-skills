# Page 组件迁移示例

## 完整示例：documents-page.vue

### 模板部分

```vue
<template>
  <TableTemplate :table="table" class="judicical-documents">
    <template #comb_search_cascader="{ piece }">
      <comb_search_cascader :target="piece"></comb_search_cascader>
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

### Script 部分

```typescript
<script lang="ts">
import TableTemplate from "@/components/dui/FormTable/TableTemplate.vue";
import { generateFormPiece } from "@/components/ui/instance/formPiece";
import { buriedPoint } from "@/utils/buriedPoint";
import moment from "moment";
import { onMounted, ref } from "vue";
import { TableConfig } from "@/components/dui/FormTable/types";

// 导入表单组件
import comb_search_cascader from "@/components/dui/formPiece/comb_search_cascader/index-page.vue";
import comb_radio_dateRange from "@/components/dui/formPiece/comb_radio_dateRange/index-page.vue";
import FormPieceCombination from "@/components/dui/formPiece/combination/index-page.vue";

// 导入常量配置
import { cause_code, court_level } from "@/constants/information/judicical";

// 导入表格列渲染组件
import JudicicalPartyArray from "@/components/TableSlot/TableCol/JudicicalPartyArray.vue";
import JudicicalInfoTitle from "@/components/TableSlot/TableCol/JudicicalInfoTitle.vue";
import JudicicalExecutorTarget from "@/components/TableSlot/TableCol/JudicicalExecutorTarget.vue";

export default {
  name: "DocumentsPage",
  components: { 
    TableTemplate, 
    comb_search_cascader, 
    comb_radio_dateRange, 
    FormPieceCombination 
  },
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
      url: "/legalaction/judgementlist",
      param: {
        sort: "",
        begin_date: "",
        end_date: "",
        cause_code: "",
        court_level: "",
        keyword: "",
        party_company_code: ""
      },
      changeForm(from, to) {
        to.begin_date = from.begin_date || "";
        to.end_date = from.end_date || "";
        to.cause_code = from.cause_code == "-1" ? "" : from.cause_code;
        to.court_level = from.court_level == "-1" ? "" : from.court_level;
        to.keyword = from.keyword || "";
        to.party_company_code = from.combination?.result?.company_code || "";
      },
      pieces: [
        ...generateFormPiece.generateAll([
          {
            type: "comb_search_cascader",
            key: "cause_code",
            options: cause_code.options,
            label: "案由",
            value: [-1]
          },
          {
            type: "comb_search_cascader",
            key: "court_level",
            options: court_level.options,
            label: "法院层级",
            value: [-1]
          },
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
            needAll: true,
            needLabel: true,
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
          },
          {
            type: "combination",
            label: "组合范围：",
            key: "combination",
            modelCode: "026",
            options: [
              { label: "不限", value: 1 },
              { label: "组合监控", value: 2 }
            ]
          }
        ])
      ],
      column: [
        { label: "发布日期", prop: "info_publ_date", width: 120, headerAlign: "center", align: "center" },
        { label: "当事人", prop: "party_array", minWidth: 300 },
        { label: "标题", prop: "info_title", minWidth: 400, className: "click" },
        { label: "案由", prop: "cause_name", minWidth: 150 },
        { label: "执行标的", prop: "execute_target", width: 120, headerAlign: "right", align: "right" }
      ],
      colValRender: {
        party_array(h, data, key, scope, table) {
          return h(JudicicalPartyArray, {
            props: { scope, rowKey: key, table }
          });
        },
        info_title(h, data, key, scope, table) {
          return h(JudicicalInfoTitle, {
            props: { scope, rowKey: key, table }
          });
        },
        execute_target(h, data, key, scope, table) {
          return h(JudicicalExecutorTarget, {
            props: { scope, rowKey: key, table }
          });
        }
      }
    });

    return { table };
  }
};
</script>
```

## 关键要点解析

### 1. 埋点配置

```typescript
onMounted(() => {
  buriedPoint.addBuriedPoint({
    name: "page",
    name_ZH: "裁判文书",
    type: "judicical_documents",  // 模块_页面名称
    method: "page"
  });
});
```

### 2. 表单值转换逻辑

```typescript
changeForm(from, to) {
  to.begin_date = from.begin_date || "";
  to.end_date = from.end_date || "";
  // 处理特殊值：-1 转换为空字符串
  to.cause_code = from.cause_code == "-1" ? "" : from.cause_code;
  to.court_level = from.court_level == "-1" ? "" : from.court_level;
  to.keyword = from.keyword || "";
  // 从组合监控中提取公司代码
  to.party_company_code = from.combination?.result?.company_code || "";
}
```

### 3. 使用 generateFormPiece.generateAll()

```typescript
pieces: [
  ...generateFormPiece.generateAll([
    {
      type: "comb_search_cascader",
      key: "cause_code",
      options: cause_code.options,
      label: "案由",
      value: [-1]  // 默认值为 -1（全部）
    },
    // ... 其他配置
  ])
]
```

### 4. colValRender 渲染函数

```typescript
colValRender: {
  party_array(h, data, key, scope, table) {
    return h(JudicicalPartyArray, {
      props: { scope, rowKey: key, table }
    });
  },
  // ... 其他渲染函数
}
```

**注意**: 
- 使用 `h()` 函数而非 JSX
- 传递必要的 props：`scope`, `rowKey`, `table`
- 根据 `tableConvert.js` 的映射关系配置渲染组件

## 更多示例

### 简单列表页面

```vue
<script lang="ts">
import TableTemplate from "@/components/dui/FormTable/TableTemplate.vue";
import { generateFormPiece } from "@/components/ui/instance/formPiece";
import { buriedPoint } from "@/utils/buriedPoint";
import { onMounted, ref } from "vue";
import { TableConfig } from "@/components/dui/FormTable/types";

import input from "@/components/dui/formPiece/input/index-page.vue";
import comb_check from "@/components/dui/formPiece/comb_check/index-page.vue";

export default {
  name: "SimpleListPage",
  components: { TableTemplate, input, comb_check },
  setup() {
    onMounted(() => {
      buriedPoint.addBuriedPoint({
        name: "page",
        name_ZH: "简单列表",
        type: "module_simplelist",
        method: "page"
      });
    });

    const table = ref<TableConfig>({
      url: "/api/list",
      param: { keyword: "" },
      pieces: [
        ...generateFormPiece.generateAll([
          {
            type: "input",
            key: "keyword",
            label: "关键词",
            placeholder: "请输入关键词",
            value: ""
          },
          {
            type: "comb_check",
            key: "status",
            label: "状态",
            options: [
              { label: "正常", value: 1 },
              { label: "异常", value: 0 }
            ],
            value: []
          }
        ])
      ],
      column: [
        { label: "名称", prop: "name" },
        { label: "状态", prop: "status" }
      ]
    });

    return { table };
  }
};
</script>
```

### 带自定义请求的页面

```typescript
const table = ref<TableConfig>({
  request: async (param) => {
    // 自定义请求逻辑
    const response = await fetch('/api/custom', {
      method: 'POST',
      body: JSON.stringify(param)
    });
    return await response.json();
  },
  param: {},
  pieces: [],
  column: []
});
```

## 使用场景

### 何时使用此技能

- 需要创建新的 `-page.vue` 组件
- 将现有的 Options API 组件迁移到 Composition API
- 支持 dui 模式切换
- 实现 TypeScript 类型安全

### 何时无需使用

- 不需要 dui 模式切换的简单组件
- 非表格类页面（如纯展示页面）
- 已经使用 Composition API 的组件

## 迁移对比检查清单

在迁移完成后，务必进行以下对比检查：

### 1. 对比 column 数组

**步骤**: 逐一对比源文件和 `-page.vue` 的 `column` 配置

```typescript
// 源文件：@/components/TableSlot/information/judicical.js
export const DocumentsColumn = [
  { label: "发布日期", prop: "pub_date", width: 120 },
  { label: "标题", prop: "info_title", minWidth: 250, className: "click" },
  { label: "执行标的 (万元)", prop: "execute_target", width: 105 } // ⚠️ 不要遗漏
  // ... 其他列
];

// -page.vue 中必须包含所有列
const table = ref<TableConfig>({
  column: [
    { label: "发布日期", prop: "pub_date", width: 120 },
    { label: "标题", prop: "info_title", minWidth: 250, className: "click" },
    { label: "执行标的 (万元)", prop: "execute_target", width: 105 } // ✅ 必须有
    // ... 其他列
  ]
});
```

### 2. 检查 colValRender 配置

**步骤**: 对于需要自定义渲染的列，必须配置对应的渲染函数

```typescript
const table = ref<TableConfig>({
  column: [
    { label: "执行标的 (万元)", prop: "execute_target", width: 105 }
  ],
  colValRender: {
    // ⚠️ 如果缺少这个函数，列数据将无法正常显示
    execute_target(h, data, key, scope, table) {
      return h(ExecutorNumberConvert, {
        props: { scope, rowKey: key, table, billion: false, decimal: 2, comma: true }
      });
    }
  }
});
```

### 3. 验证组件导入

**步骤**: 确保所有渲染组件都已正确导入

```typescript
import ExecutorNumberConvert from "@/components/TableSlot/TableCol/ExecutorNumberConvert.vue";
import Parties2JudgmentDoc from "@/components/TableSlot/TableCol/Parties2JudgmentDoc.vue";
import DocumentsTitle from "@/components/TableSlot/TableCol/DocumentsTitle.vue";
```

### 4. 参考 tableConvert.js 映射关系

**步骤**: 查看 `@/components/TableSlot/tableConvert.js` 确认正确的渲染组件

```javascript
// tableConvert.js
new TableCol({
  moduleId: "2018",
  key: "execute_target",
  convert(h, data, key, scope, col, table) {
    return h(ExecutorNumberConvert, {
      props: { scope, rowKey: col.key, table, billion: false, decimal: 2, comma: true }
    });
  }
})
```

### 5. 完整对比流程示例

以 `documents-page.vue` 为例：

1. **打开源文件**: `@/components/TableSlot/information/judicical.js`
2. **找到配置**: 定位到 `DocumentsColumn` 数组
3. **核对列**: 逐一核对 `-page.vue` 中的 `column` 配置
4. **检查映射**: 查看 `tableConvert.js` 中的渲染映射
5. **配置渲染**: 在 `-page.vue` 中配置对应的 `colValRender` 函数
6. **确认导入**: 确保所有渲染组件已导入
