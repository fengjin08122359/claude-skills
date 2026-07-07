# DUI 中的 Ant Design Vue 和 vxe-table 集成

DUI 组件库基于 **Ant Design Vue 1.7.8** 和 **vxe-table 3.7.3** 构建，提供了完整的企业级 UI 解决方案。

---

## 架构说明

```
DUI (Design UI) 3.0.25
├── DUI 自研组件 (40+)
│   ├── Card, Tree, Cascader, Modal...
│   └── 企业级业务组件
│
├── Ant Design Vue 1.7.8 (基础组件)
│   ├── Button, Input, Select, Form
│   ├── Table (基础表格)
│   ├── Dropdown, Menu, Breadcrumb
│   └── Message, Notification, etc.
│
└── vxe-table 3.7.3 (高级表格)
    ├── 高性能数据表格
    ├── 虚拟滚动
    ├── 可编辑表格
    └── 树形/分组表格
```

---

## Ant Design Vue 组件使用

### 引入方式

从 `dui-vue` 直接导入 Antdv 组件：

```javascript
import { Button, Input, Select, Form, Table } from 'dui-vue'

export default {
  components: {
    AButton: Button,
    AInput: Input,
    ASelect: Select,
    AForm: Form,
    AFormItem: Form.Item,
    ATable: Table
  }
}
```

### 全局注册

DUI 安装时会自动注册所有 Antdv 组件：

```javascript
import Vue from 'vue'
import DUI from 'dui-vue'

Vue.use(DUI)

// 现在可以直接使用 <a-button>, <a-input> 等
```

### 常用组件列表

#### 表单类
```vue
<!-- 按钮 -->
<a-button type="primary" @click="handleClick">按钮</a-button>

<!-- 输入框 -->
<a-input v-model="value" placeholder="请输入" />
<a-textarea v-model="text" :rows="4" />

<!-- 选择器 -->
<a-select v-model="selected" placeholder="请选择">
  <a-select-option value="1">选项1</a-select-option>
  <a-select-option value="2">选项2</a-select-option>
</a-select>

<!-- 表单 -->
<a-form :model="form" :rules="rules">
  <a-form-item label="用户名" name="username">
    <a-input v-model="form.username" />
  </a-form-item>
</a-form>

<!-- 单选框 -->
<a-radio-group v-model="radioValue">
  <a-radio value="1">选项1</a-radio>
  <a-radio value="2">选项2</a-radio>
</a-radio-group>

<!-- 复选框 -->
<a-checkbox-group v-model="checkValues">
  <a-checkbox value="1">选项1</a-checkbox>
  <a-checkbox value="2">选项2</a-checkbox>
</a-checkbox-group>

<!-- 日期选择器 -->
<a-date-picker v-model="date" />
<a-range-picker v-model="dateRange" />

<!-- 时间选择器 -->
<a-time-picker v-model="time" />

<!-- 上传 -->
<a-upload :action="uploadUrl" :file-list="fileList">
  <a-button icon="upload">上传文件</a-button>
</a-upload>
```

#### 数据展示类
```vue
<!-- 表格（基础） -->
<a-table
  :columns="columns"
  :data-source="data"
  :pagination="pagination"
  row-key="id"
/>

<!-- 标签页 -->
<a-tabs v-model="activeTab">
  <a-tab-pane key="1" tab="标签1">内容1</a-tab-pane>
  <a-tab-pane key="2" tab="标签2">内容2</a-tab-pane>
</a-tabs>

<!-- 折叠面板 -->
<a-collapse v-model="activeKeys">
  <a-collapse-panel key="1" header="标题1">内容1</a-collapse-panel>
</a-collapse>

<!-- 卡片 -->
<a-card title="标题">
  内容
</a-card>

<!-- 列表 -->
<a-list :data-source="list">
  <a-list-item slot="renderItem" slot-scope="item">
    {{ item.name }}
  </a-list-item>
</a-list>

<!-- 描述列表 -->
<a-descriptions title="用户信息">
  <a-descriptions-item label="姓名">张三</a-descriptions-item>
  <a-descriptions-item label="年龄">25</a-descriptions-item>
</a-descriptions>

<!-- 头像 -->
<a-avatar src="avatar.png" />
<a-avatar icon="user" />

<!-- 徽章 -->
<a-badge :count="5">
  <span>消息</span>
</a-badge>

<!-- 时间线 -->
<a-timeline>
  <a-timeline-item>创建成功</a-timeline-item>
  <a-timeline-item>审核通过</a-timeline-item>
</a-timeline>

<!-- 树 -->
<a-tree :tree-data="treeData" @select="handleSelect" />
```

#### 导航类
```vue
<!-- 面包屑 -->
<a-breadcrumb>
  <a-breadcrumb-item>首页</a-breadcrumb-item>
  <a-breadcrumb-item>列表</a-breadcrumb-item>
</a-breadcrumb>

<!-- 下拉菜单 -->
<a-dropdown>
  <a-button>更多 <a-icon type="down" /></a-button>
  <a-menu slot="overlay">
    <a-menu-item key="1">操作1</a-menu-item>
    <a-menu-item key="2">操作2</a-menu-item>
  </a-menu>
</a-dropdown>

<!-- 菜单 -->
<a-menu v-model="selectedKeys" mode="inline">
  <a-menu-item key="1">菜单1</a-menu-item>
  <a-menu-sub-menu key="2" title="子菜单">
    <a-menu-item key="2-1">子菜单1</a-menu-item>
  </a-menu-sub-menu>
</a-menu>

<!-- 分页 -->
<a-pagination
  :current="currentPage"
  :total="total"
  @change="handlePageChange"
/>
```

#### 反馈类
```vue
<!-- 消息提示 -->
<script>
this.$message.success('操作成功')
this.$message.error('操作失败')
this.$message.warning('请注意')
this.$message.info('提示信息')
</script>

<!-- 通知 -->
<script>
this.$notification.open({
  message: '通知标题',
  description: '通知内容',
  duration: 3
})
</script>

<!-- 对话框 -->
<a-modal
  v-model="visible"
  title="标题"
  @ok="handleOk"
  @cancel="handleCancel"
>
  <p>对话框内容</p>
</a-modal>

<!-- 确认框 -->
<script>
this.$confirm({
  title: '确认删除',
  content: '此操作不可恢复，确定要删除吗？',
  onOk() {
    // 确认
  },
  onCancel() {
    // 取消
  }
})
</script>

<!-- 加载中 -->
<a-spin :spinning="loading">
  <div>内容</div>
</a-spin>

<!-- 进度条 -->
<a-progress :percent="50" />

<!-- 警告提示 -->
<a-alert message="警告信息" type="warning" show-icon />
```

#### 其他
```vue
<!-- 图标 -->
<a-icon type="search" />
<a-icon type="plus" />

<!-- 分割线 -->
<a-divider />

<!-- 回到顶部 -->
<a-back-top />

<!-- 锚点 -->
<a-anchor>
  <a-anchor-link href="#section1" title="第一部分" />
  <a-anchor-link href="#section2" title="第二部分" />
</a-anchor>
```

---

## vxe-table 高级表格使用

### 引入方式

```javascript
import { VXETable } from 'dui-vue'

// 或使用全局注册的组件
// <vxe-table>, <vxe-grid>, <vxe-column>, <vxe-pager> 等
```

### vxe-grid vs vxe-table

**vxe-grid** 是 vxe-table 的高级封装，集成了表格、分页、工具栏、表单等功能，**推荐在大多数场景使用**。

| 特性 | vxe-table | vxe-grid |
|------|-----------|----------|
| 基础表格 | ✅ | ✅ |
| 分页集成 | ❌ 需手动配置 | ✅ 内置 |
| 工具栏 | ❌ 需单独组件 | ✅ 内置 |
| 表单查询 | ❌ 需手动配置 | ✅ 内置 |
| 复杂度 | 低 | 中 |
| 适用场景 | 简单表格 | 复杂数据管理页面 |

**选择建议**:
- 简单展示表格 → 使用 `vxe-table`
- 带搜索、分页、工具栏的完整页面 → 使用 `vxe-grid` ⭐推荐

---

### vxe-grid 完整示例（推荐）

```vue
<template>
  <vxe-grid
    ref="xGrid"
    v-bind="gridOptions"
    @page-change="handlePageChange"
    @form-submit="handleSearch"
    @form-reset="handleReset"
  >
    <!-- 自定义工具栏按钮 -->
    <template #toolbar_buttons>
      <vxe-button status="primary" icon="fa fa-plus" @click="handleAdd">
        新增
      </vxe-button>
      <vxe-button
        status="danger"
        icon="fa fa-trash"
        :disabled="!selectedRows.length"
        @click="handleBatchDelete"
      >
        批量删除
      </vxe-button>
    </template>

    <!-- 操作列 -->
    <template #action_default="{ row }">
      <vxe-button size="mini" @click="handleEdit(row)">编辑</vxe-button>
      <vxe-button size="mini" status="danger" @click="handleDelete(row)">
        删除
      </vxe-button>
    </template>
  </vxe-grid>
</template>

<script>
export default {
  data() {
    return {
      selectedRows: [],
      gridOptions: {
        // 边框、斑马纹
        border: true,
        stripe: true,
        
        // 高度
        height: 'auto',
        
        // 加载状态
        loading: false,
        
        // 表单配置（搜索表单）
        formConfig: {
          titleWidth: 100,
          titleAlign: 'right',
          items: [
            {
              field: 'keyword',
              title: '关键词',
              span: 6,
              itemRender: {
                name: '$input',
                props: { placeholder: '请输入关键词' }
              }
            },
            {
              field: 'status',
              title: '状态',
              span: 6,
              itemRender: {
                name: '$select',
                options: [
                  { label: '全部', value: '' },
                  { label: '启用', value: 'active' },
                  { label: '禁用', value: 'inactive' }
                ]
              }
            },
            {
              align: 'right',
              span: 12,
              itemRender: {
                name: '$buttons',
                children: [
                  { props: { type: 'submit', content: '搜索' } },
                  { props: { type: 'reset', content: '重置' } }
                ]
              }
            }
          ]
        },
        
        // 工具栏配置
        toolbarConfig: {
          slots: { buttons: 'toolbar_buttons' }
        },
        
        // 复选框配置
        checkboxConfig: {
          onChange: ({ records }) => {
            this.selectedRows = records
          }
        },
        
        // 分页配置
        pagerConfig: {
          pageSize: 20,
          pageSizes: [10, 20, 50, 100]
        },
        
        // 列配置
        columns: [
          { type: 'checkbox', width: 60 },
          { type: 'seq', width: 60, title: '序号' },
          { field: 'name', title: '姓名', width: 120 },
          { field: 'email', title: '邮箱' },
          { field: 'phone', title: '电话', width: 150 },
          {
            field: 'status',
            title: '状态',
            width: 100,
            formatter: ({ cellValue }) => cellValue === 'active' ? '启用' : '禁用'
          },
          { field: 'createTime', title: '创建时间', width: 180 },
          { title: '操作', width: 200, fixed: 'right', slots: { default: 'action_default' } }
        ],
        
        // 数据
        data: [],
        
        // 代理配置（自动处理请求）
        proxyConfig: {
          autoLoad: true,
          ajax: {
            query: ({ page, form }) => {
              return fetchList({
                pageNum: page.currentPage,
                pageSize: page.pageSize,
                ...form
              }).then(res => {
                return {
                  result: res.data.list,
                  page: {
                    total: res.data.total
                  }
                }
              })
            }
          }
        }
      }
    }
  },
  methods: {
    handlePageChange({ currentPage, pageSize }) {
      console.log('分页变化', currentPage, pageSize)
    },
    handleSearch() {
      // 刷新表格
      this.$refs.xGrid.commitProxy('reload')
    },
    handleReset() {
      // 重置后自动刷新
    },
    handleAdd() {
      console.log('新增')
    },
    handleEdit(row) {
      console.log('编辑', row)
    },
    handleDelete(row) {
      console.log('删除', row)
    },
    handleBatchDelete() {
      console.log('批量删除', this.selectedRows)
    }
  }
}
</script>
```

---

### vxe-table 基础示例

适用于简单表格场景：

```vue
<template>
  <vxe-table
    :data="tableData"
    border
    stripe
    height="600"
  >
    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="name" title="姓名" width="120" />
    <vxe-column field="age" title="年龄" width="100" />
    <vxe-column field="address" title="地址" />
  </vxe-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, name: '张三', age: 25, address: '北京' },
        { id: 2, name: '李四', age: 30, address: '上海' }
      ]
    }
  }
}
</script>
```

### 带分页的表格

```vue
<template>
  <vxe-table
    :data="tableData"
    :loading="loading"
    border
    height="500"
  >
    <vxe-column type="checkbox" width="60" />
    <vxe-column field="name" title="姓名" />
    <vxe-column field="age" title="年龄" />
    <vxe-column title="操作" width="150">
      <template #default="{ row }">
        <vxe-button size="mini" @click="handleEdit(row)">
          编辑
        </vxe-button>
        <vxe-button size="mini" type="danger" @click="handleDelete(row)">
          删除
        </vxe-button>
      </template>
    </vxe-column>
  </vxe-table>

  <vxe-pager
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @page-change="handlePageChange"
  />
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const { data, total } = await getList({
          page: this.currentPage,
          pageSize: this.pageSize
        })
        this.tableData = data
        this.total = total
      } finally {
        this.loading = false
      }
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.fetchData()
    },
    handleEdit(row) {
      console.log('编辑', row)
    },
    handleDelete(row) {
      console.log('删除', row)
    }
  }
}
</script>
```

### 虚拟滚动（大数据）

```vue
<template>
  <vxe-table
    :data="largeData"
    :scroll-y="{ enabled: true, gt: 100 }"
    height="600"
    border
  >
    <vxe-column type="seq" width="60" title="序号" />
    <vxe-column field="name" title="姓名" width="120" />
    <vxe-column field="value" title="数值" />
  </vxe-table>
</template>

<script>
export default {
  data() {
    return {
      // 支持 10万+ 数据
      largeData: Array.from({ length: 100000 }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        value: Math.random() * 1000
      }))
    }
  }
}
</script>
```

### 可编辑表格

```vue
<template>
  <vxe-table
    ref="xTable"
    :data="tableData"
    :edit-config="{ trigger: 'click', mode: 'row' }"
    border
  >
    <vxe-column field="name" title="姓名" :edit-render="{ name: 'input' }" />
    <vxe-column field="age" title="年龄" :edit-render="{ name: 'input' }" />
    <vxe-column field="status" title="状态" :edit-render="{ name: 'select', options: statusOptions }" />
    <vxe-column title="操作" width="150">
      <template #default="{ row }">
        <vxe-button size="mini" @click="$refs.xTable.toggleRowEdit(row)">
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
      tableData: [
        { id: 1, name: '张三', age: 25, status: 'active' }
      ],
      statusOptions: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
}
</script>
```

### 树形表格

```vue
<template>
  <vxe-table
    :data="treeData"
    :tree-config="{ children: 'children', expandAll: false }"
    border
  >
    <vxe-column type="expand" width="60" />
    <vxe-column field="name" title="名称" tree-node />
    <vxe-column field="value" title="数值" />
  </vxe-table>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
        {
          id: 1,
          name: '部门A',
          children: [
            { id: 11, name: '员工1', value: 100 },
            { id: 12, name: '员工2', value: 200 }
          ]
        }
      ]
    }
  }
}
</script>
```

### 表格工具栏

```vue
<template>
  <vxe-toolbar>
    <template #buttons>
      <vxe-button @click="handleAdd">新增</vxe-button>
      <vxe-button @click="handleBatchDelete" :disabled="!selectedRows.length">
        批量删除
      </vxe-button>
    </template>
    <template #tools>
      <vxe-button icon="fa fa-refresh" @click="refresh" />
    </template>
  </vxe-toolbar>

  <vxe-table
    ref="xTable"
    :data="tableData"
    :checkbox-config="{ checkField: 'checked' }"
    @checkbox-change="handleCheckboxChange"
    border
  >
    <vxe-column type="checkbox" width="60" />
    <vxe-column field="name" title="姓名" />
  </vxe-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      selectedRows: []
    }
  },
  methods: {
    handleCheckboxChange({ records }) {
      this.selectedRows = records
    },
    handleAdd() {
      // 新增
    },
    handleBatchDelete() {
      // 批量删除
    },
    refresh() {
      this.fetchData()
    }
  }
}
</script>
```

### 导出 Excel

```vue
<template>
  <vxe-toolbar>
    <template #tools>
      <vxe-button @click="exportData">导出 Excel</vxe-button>
    </template>
  </vxe-toolbar>

  <vxe-table ref="xTable" :data="tableData">
    <vxe-column field="name" title="姓名" />
    <vxe-column field="age" title="年龄" />
  </vxe-table>
</template>

<script>
export default {
  methods: {
    exportData() {
      this.$refs.xTable.exportData({
        type: 'xlsx',
        filename: '导出数据',
        sheetName: 'Sheet1'
      })
    }
  }
}
</script>
```

---

## 组件选择指南

### 表格选择决策树

```
需要表格组件
│
├─ 数据量 < 1000？
│  └─ 是 → 使用 a-table (Antdv)
│
├─ 数据量 1000-10000？
│  └─ 是 → 使用 vxe-table + 分页
│
├─ 数据量 > 10000？
│  └─ 是 → 使用 vxe-table + 虚拟滚动
│
├─ 需要可编辑？
│  └─ 是 → 使用 vxe-table
│
├─ 需要树形表格？
│  └─ 是 → 使用 vxe-table
│
└─ 需要导出 Excel？
   └─ 是 → 使用 vxe-table
```

### 表单组件选择

```
需要表单项
│
├─ 简单输入 → a-input (Antdv)
├─ 下拉选择 → a-select (Antdv)
├─ 级联选择 → d-cascader (DUI)
├─ 公司选择 → d-company-search (DUI)
├─ 用户选择 → d-user-picker (DUI)
├─ 日期选择 → d-quick-date-picker (DUI) 或 a-date-picker (Antdv)
└─ 复杂表单布局 → d-item-layout (DUI)
```

---

## 混合使用示例

### 典型后台管理页面（使用 vxe-grid）

```vue
<template>
  <d-page-layout>
    <!-- 页面头部 -->
    <template #header>
      <d-page-header title="用户管理" />
    </template>

    <!-- 主内容 -->
    <main class="content">
      <!-- vxe-grid 完整解决方案 -->
      <vxe-grid
        ref="xGrid"
        v-bind="gridOptions"
        @form-submit="handleSearch"
        @toolbar-button-click="handleToolbarClick"
      >
        <!-- 工具栏按钮 -->
        <template #toolbar_buttons>
          <vxe-button status="primary" icon="fa fa-plus" @click="handleAdd">
            新增用户
          </vxe-button>
        </template>

        <!-- 状态列自定义 -->
        <template #status_default="{ row }">
          <a-badge
            :status="row.status === 'active' ? 'success' : 'default'"
            :text="row.status === 'active' ? '启用' : '禁用'"
          />
        </template>

        <!-- 操作列 -->
        <template #action_default="{ row }">
          <a-button size="small" @click="handleEdit(row)">编辑</a-button>
          <a-button
            size="small"
            type="danger"
            style="margin-left: 8px"
            @click="handleDelete(row)"
          >
            删除
          </a-button>
        </template>
      </vxe-grid>
    </main>

    <!-- 编辑弹窗（DUI Modal + Antdv Form） -->
    <d-modal
      v-model="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <a-form
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="姓名" name="name">
          <a-input v-model="formData.name" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model="formData.email" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model="formData.phone" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model="formData.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </a-button>
      </template>
    </d-modal>
  </d-page-layout>
</template>

<script>
export default {
  data() {
    return {
      modalVisible: false,
      isEdit: false,
      submitting: false,
      formData: {
        name: '',
        email: '',
        phone: '',
        status: 'active'
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名' }],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      gridOptions: {
        border: true,
        stripe: true,
        height: 'auto',
        loading: false,
        
        // 搜索表单
        formConfig: {
          titleWidth: 80,
          titleAlign: 'right',
          items: [
            {
              field: 'keyword',
              title: '关键词',
              span: 8,
              itemRender: {
                name: '$input',
                props: { placeholder: '搜索姓名/邮箱' }
              }
            },
            {
              field: 'status',
              title: '状态',
              span: 8,
              itemRender: {
                name: '$select',
                options: [
                  { label: '全部', value: '' },
                  { label: '启用', value: 'active' },
                  { label: '禁用', value: 'inactive' }
                ]
              }
            },
            {
              align: 'right',
              span: 8,
              itemRender: {
                name: '$buttons',
                children: [
                  { props: { type: 'submit', content: '搜索' } },
                  { props: { type: 'reset', content: '重置' } }
                ]
              }
            }
          ]
        },
        
        // 工具栏
        toolbarConfig: {
          slots: { buttons: 'toolbar_buttons' }
        },
        
        // 分页
        pagerConfig: {
          pageSize: 20,
          pageSizes: [10, 20, 50, 100]
        },
        
        // 列配置
        columns: [
          { type: 'seq', width: 60, title: '序号' },
          { field: 'name', title: '姓名', width: 120 },
          { field: 'email', title: '邮箱', minWidth: 180 },
          { field: 'phone', title: '电话', width: 150 },
          { field: 'status', title: '状态', width: 100, slots: { default: 'status_default' } },
          { field: 'createTime', title: '创建时间', width: 180 },
          { title: '操作', width: 200, fixed: 'right', slots: { default: 'action_default' } }
        ],
        
        // 代理配置（自动处理请求）
        proxyConfig: {
          autoLoad: true,
          ajax: {
            query: ({ page, form }) => {
              return getUserList({
                pageNum: page.currentPage,
                pageSize: page.pageSize,
                keyword: form.keyword,
                status: form.status
              }).then(res => {
                return {
                  result: res.data.list,
                  page: { total: res.data.total }
                }
              })
            }
          }
        }
      }
    }
  },
  methods: {
    handleSearch() {
      // vxe-grid 会自动刷新
    },
    handleToolbarClick({ code }) {
      console.log('工具栏点击', code)
    },
    handleAdd() {
      this.isEdit = false
      this.formData = { name: '', email: '', phone: '', status: 'active' }
      this.modalVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.formData = { ...row }
      this.modalVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm({
          title: '确认删除',
          content: `确定要删除用户"${row.name}"吗？`,
          onOk: async () => {
            await deleteUser(row.id)
            this.$message.success('删除成功')
            this.$refs.xGrid.commitProxy('reload')
          }
        })
      } catch (error) {
        // 用户取消
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async (errors) => {
        if (!errors) {
          this.submitting = true
          try {
            if (this.isEdit) {
              await updateUser(this.formData.id, this.formData)
              this.$message.success('更新成功')
            } else {
              await createUser(this.formData)
              this.$message.success('创建成功')
            }
            this.modalVisible = false
            this.$refs.xGrid.commitProxy('reload')
          } finally {
            this.submitting = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding: 24px;
}
</style>
```

---

### 典型后台管理页面（使用 vxe-table + 手动分页）

```vue
<template>
  <d-page-layout>
    <!-- 页面头部 -->
    <template #header>
      <d-page-header title="用户管理">
        <template #extra>
          <a-button type="primary" icon="plus" @click="handleAdd">
            新增用户
          </a-button>
        </template>
      </d-page-header>
    </template>

    <!-- 主内容 -->
    <main class="content">
      <!-- 筛选区（DUI Card + Antdv Form） -->
      <d-card shadow="hover" style="margin-bottom: 16px">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="关键词">
            <a-input
              v-model="searchForm.keyword"
              placeholder="搜索用户"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="active">启用</a-select-option>
              <a-select-option value="inactive">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </d-card>

      <!-- 数据表格（vxe-table） -->
      <vxe-table
        ref="xTable"
        :data="tableData"
        :loading="loading"
        border
        height="calc(100vh - 300px)"
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column field="name" title="姓名" width="120" />
        <vxe-column field="email" title="邮箱" />
        <vxe-column field="phone" title="电话" width="150" />
        <vxe-column field="status" title="状态" width="100">
          <template #default="{ row }">
            <a-badge
              :status="row.status === 'active' ? 'success' : 'default'"
              :text="row.status === 'active' ? '启用' : '禁用'"
            />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200" fixed="right">
          <template #default="{ row }">
            <a-button size="small" @click="handleEdit(row)">
              编辑
            </a-button>
            <a-button
              size="small"
              type="danger"
              style="margin-left: 8px"
              @click="handleDelete(row)"
            >
              删除
            </a-button>
          </template>
        </vxe-column>
      </vxe-table>

      <!-- 分页（vxe-pager） -->
      <vxe-pager
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @page-change="handlePageChange"
      />
    </main>

    <!-- 编辑弹窗（DUI Modal + Antdv Form） -->
    <d-modal
      v-model="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <a-form
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="姓名" name="name">
          <a-input v-model="formData.name" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model="formData.email" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model="formData.phone" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model="formData.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="modalVisible = false">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </a-button>
      </template>
    </d-modal>
  </d-page-layout>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        keyword: '',
        status: ''
      },
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      modalVisible: false,
      isEdit: false,
      submitting: false,
      formData: {
        name: '',
        email: '',
        phone: '',
        status: 'active'
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名' }],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const { data, total } = await getUserList({
          keyword: this.searchForm.keyword,
          status: this.searchForm.status,
          page: this.currentPage,
          pageSize: this.pageSize
        })
        this.tableData = data
        this.total = total
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    handleReset() {
      this.searchForm = { keyword: '', status: '' }
      this.handleSearch()
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.fetchData()
    },
    handleAdd() {
      this.isEdit = false
      this.formData = { name: '', email: '', phone: '', status: 'active' }
      this.modalVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.formData = { ...row }
      this.modalVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm({
          title: '确认删除',
          content: `确定要删除用户"${row.name}"吗？`,
          onOk: async () => {
            await deleteUser(row.id)
            this.$message.success('删除成功')
            this.fetchData()
          }
        })
      } catch (error) {
        // 用户取消
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async (errors) => {
        if (!errors) {
          this.submitting = true
          try {
            if (this.isEdit) {
              await updateUser(this.formData.id, this.formData)
              this.$message.success('更新成功')
            } else {
              await createUser(this.formData)
              this.$message.success('创建成功')
            }
            this.modalVisible = false
            this.fetchData()
          } finally {
            this.submitting = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding: 24px;
}
</style>
```

---

## 版本信息

- **DUI**: 3.0.25
- **Vue**: 2.7.16
- **Ant Design Vue**: 1.7.8
- **vxe-table**: 3.7.3
- **最后更新**: 2026-05-21

---

## 相关资源

- [Ant Design Vue 1.x 文档](https://1x.antdv.com/docs/vue/introduce-cn/)
- [vxe-table 3.x 文档](https://vxetable.cn/#/table/start/install)
- [DUI 自研组件文档](./components-reference.md)
