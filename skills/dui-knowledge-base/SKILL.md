---
name: dui-knowledge-base
description: DUI (Design UI) Vue 2.7 企业级组件库，基于 Ant Design Vue 1.7.8 和 vxe-table 3.7.3。提供 40+ 自研组件、Antdv 基础组件、vxe-table 高级表格的完整文档。当用户询问 DUI/GildataDesign 组件、Table 表格使用、Antdv 组件或需要代码示例时使用此技能。支持组件查询、分类浏览、API 参考。
---

# DUI Components Knowledge Base

DUI (Design UI) 是基于 **Vue 2.7**、**Ant Design Vue 1.7.8** 和 **vxe-table 3.7.3** 构建的企业级 UI 组件库，版本 3.0.25。

## 架构说明

DUI 组件库由三部分组成：

1. **DUI 自研组件** (40+ 个): 企业级业务组件
2. **Ant Design Vue 封装** (基础组件): Button, Input, Select, Form, Table 等
3. **vxe-table 集成** (高级表格): 高性能数据表格

本 Skill 提供完整的组件文档和使用指南。

## 快速开始

### 安装和使用

```vue
<template>
  <d-card title="示例卡片">
    <p>这是 DUI 组件内容</p>
  </d-card>
</template>

<script>
import { Card } from 'dui-vue'

export default {
  components: {
    DCard: Card
  }
}
</script>
```

### 全局注册

```javascript
import Vue from 'vue'
import DUI from 'dui-vue'
import 'dui-vue/lib/style/index.css'

Vue.use(DUI)
```

## 组件分类

### DUI 自研组件

#### 基础组件 (Basic)
- **Icon** - 图标组件
- **Tag** - 标签组件
- **Progress** - 进度条
- **Empty** - 空状态
- **Notice** - 通知提示
- **TruncedTooltip** - 截断提示框

#### 表单组件 (Form)
- **Cascader** - 级联选择器
- **CascaderPanel** - 级联面板
- **QuickDatePicker** - 快捷日期选择器
- **LabelSelect** - 标签选择器
- **TagSelect** - 标签多选
- **TagFilter** - 标签筛选
- **CompanySearch** - 公司搜索
- **CompareCompanyPicker** - 公司对比选择器
- **UserPicker** - 用户选择器

#### 数据展示 (Data Display)
- **Card** - 卡片容器
- **CardLayout** - 卡片布局
- **List** - 列表组件
- **News** - 新闻组件
- **NewsStrip** - 新闻条
- **Reports** - 报告组件
- **PublicOpinion** - 舆情组件
- **DataCard** - 数据卡片
- **ImageViewer** - 图片预览
- **Tree** - 树形控件
- **TreeSelect** - 树形选择器

#### 布局组件 (Layout)
- **PageLayout** - 页面布局
- **ItemLayout** - 条目布局
- **ItemLayoutV2** - 条目布局 V2
- **AnchorNav** - 锚点导航
- **Tabs** - 标签页
- **TabsMultiple** - 多标签页
- **Segmented** - 分段控制器
- **AutoScroll** - 自动滚动
- **VirtualList** - 虚拟列表
- **VtVirtualList** - VT 虚拟列表

#### 反馈组件 (Feedback)
- **Loading** - 加载状态
- **Modal** - 模态框
- **Drawer** - 抽屉
- **ErrorPage** - 错误页面
- **PageHeader** - 页面头部

### Ant Design Vue 基础组件

DUI 复用 Ant Design Vue 1.7.8 的基础组件，使用时直接从 `dui-vue` 导入：

```javascript
import { Button, Input, Select, Form, Table } from 'dui-vue'
```

**常用 Antdv 组件**:
- **Button** - 按钮
- **Input/TextArea** - 输入框
- **Select** - 选择器
- **Form/FormItem** - 表单
- **Dropdown** - 下拉菜单
- **Menu** - 导航菜单
- **Breadcrumb** - 面包屑
- **Avatar** - 头像
- **Badge** - 徽章
- **Timeline** - 时间线
- **Tooltip** - 文字提示
- **Popover** - 气泡卡片
- **Message** - 全局提示
- **Notification** - 通知提醒框
- **Modal** - 对话框（也可使用 DModal）

详细文档参考：[Ant Design Vue 1.x](https://1x.antdv.com/docs/vue/introduce-cn/)

### vxe-table / vxe-grid 高级表格

DUI 集成了 vxe-table 3.7.3，提供高性能数据表格。**推荐使用 vxe-grid**（高级封装）：

```javascript
import { VXETable } from 'dui-vue'

// vxe-grid - 推荐（集成表格+分页+工具栏+表单）
// <vxe-grid v-bind="gridOptions" />

// vxe-table - 基础组件
// <vxe-table :data="tableData">...</vxe-table>
```

**vxe-grid 特性** ⭐推荐:
- ✅ 集成表格、分页、工具栏、搜索表单
- ✅ 自动处理数据请求和响应
- ✅ 完整的 CRUD 操作支持
- ✅ 适合数据管理页面

**vxe-table 特性**:
- 高性能大数据表格（支持 10万+ 数据）
- 虚拟滚动
- 可编辑表格
- 树形表格
- 分组表格
- 导出 Excel
- 打印功能

详细文档参考：[antd-vxe-integration.md](antd-vxe-integration.md)

## 使用 Skill

### 搜索组件

当用户询问特定组件时，提供：
1. 组件基本用途
2. Props 完整列表（含类型、默认值、说明）
3. Events 列表
4. Slots 列表
5. 使用示例

### 示例查询格式

```
用户：如何使用 DCard 组件？
用户：DTree 有哪些 Props？
用户：给我一个 Cascader 的使用示例
用户：表单组件都有哪些？
```

## 组件文档结构

每个组件文档应包含：

```markdown
## D[ComponentName]

**用途**: [一句话描述]

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| propName | type | default | description |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| eventName | (param: type) | description |

### Slots

| 插槽名 | 说明 |
|--------|------|
| slotName | description |

### 示例

```vue
<template>
  <d-component-name prop="value">
    content
  </d-component-name>
</template>
```
```

## 核心组件速查

### DCard - 卡片容器

**用途**: 通用卡片容器，支持标题、搜索、日期筛选

**关键 Props**:
- `title`: string - 卡片标题
- `border`: boolean (default: true) - 是否显示边框
- `shadow`: 'always' | 'hover' - 阴影显示时机
- `inputSearch`: boolean - 是否显示搜索框
- `dateSearch`: boolean - 是否显示日期搜索

**Events**:
- `input-enter`: 搜索框回车事件
- `search-change`: 搜索条件变化

**Slots**:
- `default`: 卡片内容
- `title`: 自定义标题
- `extra`: 右上角操作区

### DTree - 树形控件

**用途**: 层级数据展示，支持复选、拖拽、异步加载

**关键 Props**:
- `data`: Array - 树形数据
- `showCheckbox`: boolean - 是否显示复选框
- `nodeKey`: string - 节点唯一标识 key
- `props`: object - 配置选项
- `load`: Function - 异步加载方法

**Events**:
- `node-click`: 节点点击
- `check-change`: 复选框状态变化
- `node-expand`: 节点展开

### DCascader - 级联选择器

**用途**: 多级关联数据选择

**关键 Props**:
- `options`: Array - 可选项数据
- `value`: Array - 选中值
- `props`: object - 配置选项
- `change-on-select`: boolean - 是否选择任意一级

**Events**:
- `change`: 选中值变化
- `visible-change`: 下拉框出现/隐藏

## 最佳实践

### 1. 表格组件选择

#### vxe-table（高性能表格）

适用于大数据量（1000+ 条）、需要虚拟滚动、可编辑等高级功能：

```vue
<template>
  <vxe-table
    :data="tableData"
    :loading="loading"
    border
    stripe
    height="600"
  >
    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="name" title="姓名" />
    <vxe-column field="age" title="年龄" />
    <vxe-column title="操作" width="150">
      <template #default="{ row }">
        <vxe-button size="mini" @click="handleEdit(row)">
          编辑
        </vxe-button>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: []
    }
  }
}
</script>
```

**选择建议**:
- 数据量 < 1000 → 使用 `a-table` (Antdv)
- 数据量 1000-10000 → 使用 `vxe-table` + 分页
- 数据量 > 10000 → 使用 `vxe-table` + 虚拟滚动
- 需要可编辑 → 使用 `vxe-table`
- 需要树形表格 → 使用 `vxe-table`

### 2. 按需引入

```javascript
// 推荐：按需引入减小打包体积
import { Card, Tree, Cascader } from 'dui-vue'

export default {
  components: {
    DCard: Card,
    DTree: Tree,
    DCascader: Cascader
  }
}
```

### 3. 主题定制

```javascript
Vue.use(DUI, {
  themeVersion: 'v2',
  theme: {
    radiusBase: '8px',
    colorPrimary: '#1890ff'
  }
})
```

### 4. API 版本配置

```javascript
Vue.use(DUI, {
  apiVersion: 'v2'  // 某些组件依赖的接口版本
})
```

### 5. 性能优化

- 大数据列表使用 `VirtualList` 或 `VtVirtualList`
- 大数据表格使用 `vxe-table` 虚拟滚动
- 树形数据开启 `lazy` 异步加载
- 频繁切换的内容使用 `keep-alive`

## 相关资源

- DUI 自研组件类型定义：`dui-vue/package/types/ui/*.d.ts`
- Ant Design Vue 文档：https://1x.antdv.com/docs/vue/introduce-cn/
- vxe-table 文档：https://vxetable.cn/#/table/start/install
- 完整导出列表参见：`dui-vue/package/types/ui/dui-vue.d.ts`
- 样式文件：`dui-vue/lib/style/index.css`
- **详细集成指南**：查看 [antd-vxe-integration.md](antd-vxe-integration.md)

## 常见问题

### Q: 组件样式不生效？
A: 确保引入了 CSS 文件：`import 'dui-vue/lib/style/index.css'`

### Q: 如何自定义组件样式？
A: 使用 CSS 变量覆盖或添加自定义 class

### Q: TypeScript 支持？
A: 完整 TypeScript 类型定义在 `types/` 目录

## 更新记录

- 版本：3.0.25
- Vue 版本：2.7.16
- 组件数量：40+
