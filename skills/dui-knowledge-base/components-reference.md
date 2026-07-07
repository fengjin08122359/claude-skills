# DUI Components 完整 API 参考

本文档提供所有 DUI 组件的完整 API 参考，基于 `dui-vue/package/types/ui/*.d.ts` 类型定义生成。

---

## 基础组件

### DIcon - 图标组件

**用途**: 显示矢量图标，支持自定义颜色、大小

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | string | - | 图标类型名称 |
| size | number \| string | - | 图标大小 |
| color | string | - | 图标颜色 |
| spin | boolean | false | 是否旋转动画 |

**示例**:
```vue
<d-icon type="search" :size="16" color="#666" />
<d-icon type="loading" spin />
```

---

### DTag - 标签组件

**用途**: 标记和分类的标签展示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | string | 'default' | 标签类型 |
| closable | boolean | false | 是否可关闭 |
| disable-transitions | boolean | false | 是否禁用过渡动画 |
| hit | boolean | false | 是否边框样式 |
| color | string | - | 背景色 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | (event: MouseEvent) | 关闭按钮点击 |
| click | (event: MouseEvent) | 标签点击 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 标签内容 |

**示例**:
```vue
<d-tag type="success">成功</d-tag>
<d-tag closable @close="handleClose">可关闭</d-tag>
```

---

### DProgress - 进度条

**用途**: 展示操作进度

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| percentage | number | 0 | 进度百分比 (0-100) |
| type | string | 'line' | 类型：line/circle/dashboard |
| stroke-width | number | - | 进度条宽度 |
| text-inside | boolean | false | 文字显示在内部 |
| status | string | - | 状态：success/exception/warning |
| color | string \| Function | - | 进度条颜色 |
| show-text | boolean | true | 是否显示文字 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 自定义进度文字 |

**示例**:
```vue
<d-progress :percentage="50" status="success" />
<d-progress type="circle" :percentage="75" />
```

---

### DEmpty - 空状态

**用途**: 数据为空时的占位提示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| image | string | - | 图片地址 |
| image-size | number | - | 图片大小 |
| description | string | '暂无数据' | 描述文字 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 底部内容 |
| image | 自定义图片 |
| description | 自定义描述 |

**示例**:
```vue
<d-empty description="暂无数据">
  <d-button type="primary">新建</d-button>
</d-empty>
```

---

### DNotice - 通知提示

**用途**: 全局通知提示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | string | - | 标题 |
| message | string \| VNode | - | 通知内容 |
| duration | number | 4500 | 显示时长(ms)，0 表示不自动关闭 |
| type | string | 'info' | 类型：success/warning/info/error |
| position | string | 'top-right' | 位置 |
| offset | number | 0 | 偏移量 |

**示例**:
```javascript
import { Notice } from 'dui-vue'

Notice({
  title: '提示',
  message: '这是一条通知消息',
  type: 'success',
  duration: 3000
})
```

---

### DTruncedTooltip - 截断提示框

**用途**: 文本溢出时显示 tooltip

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| tooltip | string | - | tooltip 内容 |
| placement | string | 'top' | 出现位置 |
| max-width | string | - | 最大宽度 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 触发元素 |

**示例**:
```vue
<d-trunced-tooltip tooltip="完整内容">
  <span>可能被截断的文本</span>
</d-trunced-tooltip>
```

---

## 表单组件

### DCascader - 级联选择器

**用途**: 多级关联数据选择，如省市区选择

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| options | Array | - | 可选项数据源 |
| value / v-model | Array | - | 选中值 |
| props | object | - | 配置选项 |
| size | string | 'medium' | 尺寸：medium/small/mini |
| placeholder | string | '请选择' | 输入框占位符 |
| disabled | boolean | false | 是否禁用 |
| clearable | boolean | false | 是否支持清空 |
| change-on-select | boolean | false | 是否选择任意一级选项 |
| filterable | boolean | false | 是否可搜索 |
| separator | string | '/' | 选项分隔符 |

**Props.config**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value | string | 'value' | 指定选项值的 key |
| label | string | 'label' | 指定选项标签的 key |
| children | string | 'children' | 指定选项子级的 key |
| disabled | string | 'disabled' | 指定选项禁用的 key |
| leaf | string | 'leaf' | 指定选项为叶子节点的 key |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value: Array) | 选中值变化时触发 |
| expand-change | (value: Array) | 展开项变化时触发 |
| visible-change | (visible: boolean) | 下拉框出现/隐藏 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 自定义触发内容 |

**示例**:
```vue
<template>
  <d-cascader
    v-model="selectedValue"
    :options="options"
    :props="cascaderProps"
    placeholder="请选择地区"
    change-on-select
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedValue: [],
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      options: [
        {
          id: 1,
          name: '北京',
          children: [
            { id: 11, name: '朝阳区' },
            { id: 12, name: '海淀区' }
          ]
        }
      ]
    }
  },
  methods: {
    handleChange(value) {
      console.log('选中值:', value)
    }
  }
}
</script>
```

---

### DCascaderPanel - 级联面板

**用途**: 级联选择器的面板形式，适合嵌入其他容器

**Props**: 同 DCascader（不含 size、placeholder 等输入框相关属性）

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value: Array) | 选中值变化 |

**示例**:
```vue
<d-cascader-panel
  v-model="value"
  :options="options"
/>
```

---

### DQuickDatePicker - 快捷日期选择器

**用途**: 带快捷选项的日期范围选择器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | Array \| String | - | 绑定值 |
| type | string | 'daterange' | 类型：date/daterange/datetime |
| shortcuts | Array | - | 快捷选项配置 |
| format | string | 'yyyy-MM-dd' | 显示格式 |
| value-format | string | - | 绑定值格式 |
| start-placeholder | string | '开始日期' | 起始占位符 |
| end-placeholder | string | '结束日期' | 结束占位符 |

**shortcuts 配置**:
```javascript
[
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]
```

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |
| blur | (event) | 失去焦点 |

**示例**:
```vue
<d-quick-date-picker
  v-model="dateRange"
  :shortcuts="shortcuts"
  @change="handleDateChange"
/>
```

---

### DLabelSelect - 标签选择器

**用途**: 带标签的 select 选择器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | any | - | 绑定值 |
| options | Array | - | 选项列表 |
| label | string | - | 左侧标签文本 |
| label-width | string | 'auto' | 标签宽度 |
| placeholder | string | '请选择' | 占位符 |
| multiple | boolean | false | 是否多选 |
| clearable | boolean | false | 是否可清空 |
| disabled | boolean | false | 是否禁用 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| prefix | 前缀内容 |

**示例**:
```vue
<d-label-select
  v-model="selected"
  label="状态"
  :options="statusOptions"
  placeholder="请选择状态"
/>
```

---

### DTagSelect - 标签多选

**用途**: 以标签形式展示的多选组件

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | Array | - | 选中值数组 |
| options | Array | - | 选项列表 |
| max | number | - | 最多可选数量 |
| disabled | boolean | false | 是否禁用 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value: Array) | 选中值变化 |

**示例**:
```vue
<d-tag-select
  v-model="tags"
  :options="tagOptions"
  :max="5"
/>
```

---

### DTagFilter - 标签筛选

**用途**: 多条件标签筛选组件

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| filters | Array | - | 筛选项配置 |
| multiple | boolean | false | 是否多选 |
| show-more | boolean | true | 是否显示更多 |

**filters 结构**:
```javascript
[
  {
    label: '分类',
    key: 'category',
    options: [
      { label: '全部', value: '' },
      { label: '选项1', value: '1' }
    ]
  }
]
```

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (filters: Object) | 筛选条件变化 |

**示例**:
```vue
<d-tag-filter
  :filters="filterConfig"
  @change="handleFilter"
/>
```

---

### DCompanySearch - 公司搜索

**用途**: 企业级公司搜索选择器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | string \| Array | - | 选中值 |
| multiple | boolean | false | 是否多选 |
| limit | number | - | 最多选择数量 |
| placeholder | string | '请输入公司名称搜索' | 占位符 |
| search-api | Function | - | 自定义搜索 API |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |
| search | (keyword: string) | 搜索事件 |

**示例**:
```vue
<d-company-search
  v-model="companyId"
  placeholder="搜索公司"
  @change="handleCompanyChange"
/>
```

---

### DCompareCompanyPicker - 公司对比选择器

**用途**: 选择用于对比的公司列表

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | Array | - | 选中公司列表 |
| max-count | number | 5 | 最大选择数量 |
| min-count | number | 0 | 最小选择数量 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (companies: Array) | 选择变化 |

**示例**:
```vue
<d-compare-company-picker
  v-model="compareList"
  :max-count="3"
  @change="handleCompare"
/>
```

---

### DUserPicker - 用户选择器

**用途**: 用户选择组件，支持搜索、多选

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | string \| Array | - | 选中值 |
| multiple | boolean | false | 是否多选 |
| limit | number | - | 最多选择数量 |
| placeholder | string | '请选择用户' | 占位符 |
| api-version | string | - | API 版本 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |

**示例**:
```vue
<d-user-picker
  v-model="userId"
  multiple
  :limit="10"
/>
```

---

## 数据展示组件

### DCard - 卡片容器

**用途**: 通用卡片容器，支持标题、搜索、日期筛选

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | string | - | 卡片标题 |
| divider | boolean | true | 标题和内容间的分割线 |
| border | boolean | true | 是否显示边框 |
| shadow | string | - | 阴影显示：always/hover |
| background | boolean | false | 显示头部背景色 |
| input-search | boolean | false | 显示搜索框 |
| date-search | boolean | false | 显示日期搜索 |
| date-layout | string | 'w1,m1,m3,custom' | 日期布局 |
| input-placeholder | string | '输入关键字回车' | 搜索框占位符 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| input-enter | (e: InputEvent) | 搜索框回车 |
| input-change | (e: InputEvent) | 搜索框输入变化 |
| input-clear | (e: InputEvent) | 搜索框清空 |
| search-change | ({ dateRange, inputKey }) | 搜索条件变化 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 卡片内容 |
| title | 自定义标题 |
| extra | 右上角操作区 |
| right | 右侧内容 |

**示例**:
```vue
<template>
  <d-card
    title="数据概览"
    shadow="hover"
    input-search
    @search-change="handleSearch"
  >
    <template #extra>
      <d-button size="small">导出</d-button>
    </template>
    <p>卡片内容区域</p>
  </d-card>
</template>

<script>
export default {
  methods: {
    handleSearch({ dateRange, inputKey }) {
      console.log('搜索条件:', dateRange, inputKey)
    }
  }
}
</script>
```

---

### DCardLayout - 卡片布局

**用途**: 卡片式布局容器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| gutter | number | 16 | 间距 |
| span | number | 8 | 每列栅格数 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 卡片列表 |

**示例**:
```vue
<d-card-layout :gutter="16" :span="6">
  <d-card v-for="item in list" :key="item.id">
    {{ item.name }}
  </d-card>
</d-card-layout>
```

---

### DDataCard - 数据卡片

**用途**: 展示关键指标的卡片

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | string | - | 指标名称 |
| value | string \| number | - | 指标值 |
| unit | string | - | 单位 |
| trend | string | - | 趋势：up/down |
| trend-value | string | - | 趋势值 |
| loading | boolean | false | 加载状态 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| header | 自定义头部 |
| footer | 自定义底部 |

**示例**:
```vue
<d-data-card
  title="总销售额"
  :value="128000"
  unit="元"
  trend="up"
  trend-value="12%"
/>
```

---

### DList - 列表组件

**用途**: 通用列表展示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 列表数据 |
| loading | boolean | false | 加载状态 |
| empty-text | string | '暂无数据' | 空数据提示 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 列表项模板 |
| header | 列表头部 |
| footer | 列表底部 |
| empty | 自定义空状态 |

**示例**:
```vue
<d-list :data="items" :loading="loading">
  <template #default="{ item }">
    <div class="list-item">{{ item.name }}</div>
  </template>
</d-list>
```

---

### DTree - 树形控件

**用途**: 层级数据展示，支持复选、拖拽、异步加载

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 树形数据 |
| node-key | string | - | 节点唯一标识 |
| props | object | - | 配置选项 |
| render-after-expand | boolean | true | 展开后渲染子节点 |
| load | Function | - | 异步加载方法 |
| highlight-current | boolean | false | 高亮当前节点 |
| show-checkbox | boolean | false | 显示复选框 |
| check-strictly | boolean | false | 严格模式 |
| default-expanded-keys | Array | - | 默认展开节点 |
| default-checked-keys | Array | - | 默认选中节点 |
| accordion | boolean | false | 手风琴模式 |
| indent | number | 16 | 缩进像素 |
| icon-class | string | - | 自定义图标类 |

**props 配置**:
```javascript
{
  label: 'name',      // 节点标签字段
  children: 'children', // 子节点字段
  disabled: 'disabled', // 禁用字段
  isLeaf: 'leaf'       // 叶子节点字段
}
```

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| node-click | (data, node, instance) | 节点点击 |
| node-contextmenu | (event, data, node) | 右键菜单 |
| check-change | (data, checked) | 复选框变化 |
| check | (data, checkedInfo) | 复选框状态变化 |
| current-change | (currentData, prevData) | 当前节点变化 |
| node-expand | (data, node, instance) | 节点展开 |
| node-collapse | (data, node, instance) | 节点收起 |
| node-drag-start | (node, event) | 拖拽开始 |
| node-drag-end | (node, event) | 拖拽结束 |

**Methods**:
| 方法名 | 参数 | 说明 |
|--------|------|------|
| filter | (keyword) | 过滤节点 |
| getCheckedNodes | (leafOnly) | 获取选中节点 |
| setCheckedKeys | (keys) | 设置选中 keys |
| setCurrentKey | (key) | 设置当前节点 |
| getCurrentNode | - | 获取当前节点 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| - | 自定义节点内容，slot-scope: { node, data } |

**示例**:
```vue
<template>
  <d-tree
    ref="tree"
    :data="treeData"
    :props="treeProps"
    show-checkbox
    node-key="id"
    @node-click="handleNodeClick"
    @check-change="handleCheckChange"
  >
    <template #default="{ node, data }">
      <span class="custom-node">
        <d-icon :type="data.icon" />
        {{ node.label }}
      </span>
    </template>
  </d-tree>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: '一级节点',
          icon: 'folder',
          children: [
            { id: 2, label: '二级节点', icon: 'file' }
          ]
        }
      ],
      treeProps: {
        label: 'label',
        children: 'children'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log('点击节点:', data)
    },
    handleCheckChange(data, checked) {
      console.log('复选框变化:', data, checked)
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    }
  }
}
</script>
```

---

### DTreeSelect - 树形选择器

**用途**: 下拉树形选择器

**Props**: 继承 DTree 大部分属性，外加：
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | any | - | 绑定值 |
| placeholder | string | '请选择' | 占位符 |
| size | string | 'medium' | 尺寸 |
| clearable | boolean | false | 是否可清空 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |

**示例**:
```vue
<d-tree-select
  v-model="selectedId"
  :data="treeData"
  placeholder="请选择节点"
/>
```

---

### DNews - 新闻组件

**用途**: 新闻资讯展示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 新闻数据 |
| title-field | string | 'title' | 标题字段 |
| time-field | string | 'time' | 时间字段 |
| link-field | string | 'link' | 链接字段 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | (item) | 新闻点击 |

**示例**:
```vue
<d-news
  :data="newsList"
  @click="handleNewsClick"
/>
```

---

### DNewsStrip - 新闻条

**用途**: 滚动新闻条

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 新闻数据 |
| speed | number | 50 | 滚动速度 |
| direction | string | 'left' | 滚动方向 |

**示例**:
```vue
<d-news-strip :data="headlines" />
```

---

### DReports - 报告组件

**用途**: 报告列表展示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 报告数据 |
| loading | boolean | false | 加载状态 |

**示例**:
```vue
<d-reports :data="reportList" />
```

---

### DPublicOpinion - 舆情组件

**用途**: 舆情信息展示

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 舆情数据 |
| sentiment-type | string | - | 情感类型过滤 |

**示例**:
```vue
<d-public-opinion :data="opinionList" />
```

---

### DImageViewer - 图片预览

**用途**: 图片放大预览

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| url-list | Array | - | 图片地址列表 |
| initial-index | number | 0 | 初始索引 |
| visible | boolean | false | 是否可见 |
| z-index | number | 2000 | 层级 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | - | 关闭事件 |
| switch | (index) | 切换图片 |

**示例**:
```vue
<d-image-viewer
  :url-list="images"
  :visible="showViewer"
  @close="showViewer = false"
/>
```

---

## 布局组件

### DPageLayout - 页面布局

**用途**: 标准页面布局容器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| header-height | number | 60 | 头部高度 |
| sidebar-width | number | 200 | 侧边栏宽度 |
| collapsed | boolean | false | 侧边栏折叠 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| header | 页面头部 |
| sidebar | 侧边栏 |
| default | 主内容区 |
| footer | 页面底部 |

**示例**:
```vue
<d-page-layout>
  <template #header>
    <header>顶部导航</header>
  </template>
  <template #sidebar>
    <aside>侧边菜单</aside>
  </template>
  <main>主要内容</main>
</d-page-layout>
```

---

### DItemLayout - 条目布局

**用途**: 表单项布局

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| label | string | - | 标签文本 |
| label-width | string | 'auto' | 标签宽度 |
| required | boolean | false | 是否必填 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 表单内容 |
| label | 自定义标签 |

**示例**:
```vue
<d-item-layout label="用户名" required>
  <d-input v-model="username" />
</d-item-layout>
```

---

### DItemLayoutV2 - 条目布局 V2

**用途**: 增强版条目布局，支持更复杂的布局

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| label-items | Array | - | 标签项配置 |
| action-items | Array | - | 操作项配置 |

**示例**:
```vue
<d-item-layout-v2
  :label-items="labels"
  :action-items="actions"
/>
```

---

### DAnchorNav - 锚点导航

**用途**: 页面内锚点导航

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| anchors | Array | - | 锚点配置 |
| active-anchor | string | - | 当前激活锚点 |
| offset-top | number | 0 | 偏移量 |

**anchors 结构**:
```javascript
[
  { key: 'section1', title: '第一部分', target: '#section1' }
]
```

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (key) | 锚点变化 |

**示例**:
```vue
<d-anchor-nav
  :anchors="anchorList"
  @change="handleAnchorChange"
/>
```

---

### DTabs - 标签页

**用途**: 标签页切换

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | string \| number | - | 激活的 tab |
| type | string | - | 风格类型 |
| closable | boolean | false | 是否可关闭 |
| addable | boolean | false | 是否可增加 |
| editable | boolean | false | 是否可编辑 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| tab-click | (tab) | tab 被点击 |
| tab-remove | (name) | tab 被移除 |
| tab-add | - | 新增 tab |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| - | d-tab-pane 组件 |

**示例**:
```vue
<d-tabs v-model="activeTab">
  <d-tab-pane label="用户管理" name="users">
    用户列表
  </d-tab-pane>
  <d-tab-pane label="角色管理" name="roles">
    角色列表
  </d-tab-pane>
</d-tabs>
```

---

### DTabsMultiple - 多标签页

**用途**: 多标签页管理，类似浏览器标签

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| tabs | Array | - | 标签列表 |
| active-tab | string | - | 当前激活标签 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (tab) | 标签切换 |
| remove | (tab) | 标签关闭 |

**示例**:
```vue
<d-tabs-multiple
  :tabs="openTabs"
  :active-tab="currentTab"
  @change="handleTabChange"
  @remove="handleTabRemove"
/>
```

---

### DSegmented - 分段控制器

**用途**: 分段选择控制器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| value / v-model | any | - | 选中值 |
| options | Array | - | 选项列表 |
| block | boolean | false | 是否块级显示 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (value) | 选中值变化 |

**示例**:
```vue
<d-segmented
  v-model="viewType"
  :options="[
    { label: '列表', value: 'list' },
    { label: '网格', value: 'grid' }
  ]"
/>
```

---

### DAutoScroll - 自动滚动

**用途**: 内容自动滚动容器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| step | number | 1 | 滚动步长 |
| limit-step | number | 15 | 限制步数 |
| single-height | number | 0 | 单行高度 |
| wait-time | number | 1000 | 等待时间(ms) |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 滚动内容 |

**示例**:
```vue
<d-auto-scroll :wait-time="2000">
  <div v-for="item in list">{{ item }}</div>
</d-auto-scroll>
```

---

### DVirtualList - 虚拟列表

**用途**: 大数据量虚拟滚动列表

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | - | 数据列表 |
| item-height | number | - | 每项高度 |
| visible-count | number | 10 | 可见数量 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 列表项，slot-scope: { item, index } |

**示例**:
```vue
<d-virtual-list
  :data="largeList"
  :item-height="50"
  :visible-count="20"
>
  <template #default="{ item }">
    <div class="list-item">{{ item.name }}</div>
  </template>
</d-virtual-list>
```

---

### DVtVirtualList - VT 虚拟列表

**用途**: 基于 vue-virtual-scroller 的虚拟列表

**Props**: 类似 DVirtualList

**示例**:
```vue
<d-vt-virtual-list :items="items">
  <template #default="{ item }">
    {{ item.name }}
  </template>
</d-vt-virtual-list>
```

---

## 反馈组件

### DLoading - 加载服务

**用途**: 全局或局部加载状态

**使用方式**:

指令方式：
```vue
<div v-loading="loading">内容</div>
```

服务方式：
```javascript
import { Loading } from 'dui-vue'

const loadingInstance = Loading.service({
  fullscreen: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)'
})

// 关闭
loadingInstance.close()
```

**Options**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| fullscreen | boolean | false | 全屏遮罩 |
| text | string | - | 加载文案 |
| spinner | string | - | 自定义加载图标类名 |
| background | string | - | 遮罩背景色 |
| lock | boolean | false | 禁止滚动 |
| target | HTMLElement | - | 加载区域 DOM 节点 |

---

### DModal - 模态框

**用途**: 对话框/弹窗

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| visible / v-model | boolean | false | 是否显示 |
| title | string | - | 标题 |
| width | string \| number | 50% | 宽度 |
| fullscreen | boolean | false | 是否全屏 |
| modal | boolean | true | 是否显示遮罩 |
| close-on-click-modal | boolean | true | 点击遮罩关闭 |
| show-close | boolean | true | 显示关闭按钮 |
| before-close | Function | - | 关闭前回调 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| open | - | 打开事件 |
| opened | - | 打开动画结束 |
| close | - | 关闭事件 |
| closed | - | 关闭动画结束 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 对话框内容 |
| title | 自定义标题 |
| footer | 自定义底部 |

**示例**:
```vue
<template>
  <d-modal v-model="dialogVisible" title="编辑">
    <p>对话框内容</p>
    <template #footer>
      <d-button @click="dialogVisible = false">取消</d-button>
      <d-button type="primary" @click="handleConfirm">确定</d-button>
    </template>
  </d-modal>
</template>
```

---

### DDrawer - 抽屉

**用途**: 侧边抽屉面板

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| visible / v-model | boolean | false | 是否显示 |
| title | string | - | 标题 |
| placement | string | 'rtl' | 出现位置：ltr/rtl/ttb/btt |
| size | string \| number | 30% | 宽度/高度 |
| modal | boolean | true | 是否显示遮罩 |
| close-on-click-modal | boolean | true | 点击遮罩关闭 |

**Events**: 同 DModal

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 抽屉内容 |
| title | 自定义标题 |

**示例**:
```vue
<d-drawer v-model="drawerVisible" title="详情" placement="rtl">
  <p>抽屉内容</p>
</d-drawer>
```

---

### DErrorPage - 错误页面

**用途**: 错误状态页面（404、500 等）

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| code | number | 404 | 错误码 |
| title | string | - | 错误标题 |
| description | string | - | 错误描述 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| default | 自定义内容 |

**示例**:
```vue
<d-error-page
  :code="404"
  title="页面未找到"
  description="您访问的页面不存在"
>
  <d-button type="primary" @click="$router.push('/')">返回首页</d-button>
</d-error-page>
```

---

### DPageHeader - 页面头部

**用途**: 页面标题和面包屑导航

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | string | - | 页面标题 |
| subtitle | string | - | 副标题 |
| breadcrumb | Array | - | 面包屑数据 |

**Events**:
| 事件名 | 参数 | 说明 |
|--------|------|------|
| back | - | 返回按钮点击 |

**Slots**:
| 插槽名 | 说明 |
|--------|------|
| title | 自定义标题 |
| extra | 右侧操作区 |

**示例**:
```vue
<d-page-header
  title="用户管理"
  subtitle="管理系统用户"
  @back="$router.back()"
>
  <template #extra>
    <d-button type="primary">新建用户</d-button>
  </template>
</d-page-header>
```

---

## 其他组件

### DLoading - 加载状态组件

**用途**: 内联加载指示器

**Props**:
| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| spinning | boolean | true | 是否旋转 |
| tip | string | - | 加载文案 |

**示例**:
```vue
<d-loading spinning tip="加载中...">
  <p>内容区域</p>
</d-loading>
```

---

### DNotice - 通知组件实例

见前面"基础组件"部分的服务方式使用。

---

## 工具类和辅助功能

### 主题变量

DUI 提供 CSS 变量用于主题定制：

```css
:root {
  --color-primary: #1890ff;
  --radius-base: 4px;
  --font-size-base: 14px;
}
```

### 响应式断点

```javascript
// 内置断点
{
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
}
```

---

## 版本信息

- DUI 版本: 3.0.25
- Vue 版本: 2.7.16
- TypeScript 支持: 完整类型定义
- 组件总数: 40+
