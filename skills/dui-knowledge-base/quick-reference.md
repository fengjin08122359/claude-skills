# DUI Components 快速参考

## 常用组件速查

### 布局容器
```vue
<!-- 页面布局 -->
<d-page-layout>
  <template #header>头部</template>
  <template #sidebar>侧边栏</template>
  <main>内容</main>
</d-page-layout>

<!-- 卡片容器 -->
<d-card title="标题" shadow="hover">
  <template #extra>操作</template>
  内容
</d-card>
```

### 表单组件
```vue
<!-- 级联选择器 -->
<d-cascader
  v-model="value"
  :options="options"
  change-on-select
/>

<!-- 日期选择 -->
<d-quick-date-picker
  v-model="dateRange"
  :shortcuts="shortcuts"
/>

<!-- 公司搜索 -->
<d-company-search
  v-model="companyId"
  placeholder="搜索公司"
/>

<!-- 用户选择 -->
<d-user-picker
  v-model="userId"
  multiple
/>
```

### 数据展示
```vue
<!-- 树形控件 -->
<d-tree
  :data="treeData"
  show-checkbox
  @node-click="handleClick"
>
  <template #default="{ node, data }">
    {{ node.label }}
  </template>
</d-tree>

<!-- 虚拟列表 -->
<d-virtual-list
  :data="list"
  :item-height="50"
>
  <template #default="{ item }">
    {{ item.name }}
  </template>
</d-virtual-list>
```

### 反馈组件
```vue
<!-- 模态框 -->
<d-modal v-model="visible" title="标题">
  内容
  <template #footer>
    <d-button @click="visible = false">取消</d-button>
    <d-button type="primary">确定</d-button>
  </template>
</d-modal>

<!-- 抽屉 -->
<d-drawer v-model="visible" title="标题" placement="rtl">
  内容
</d-drawer>

<!-- 加载状态 -->
<div v-loading="loading">内容</div>
```

## 常用 API

### 全局注册
```javascript
import Vue from 'vue'
import DUI from 'dui-vue'
import 'dui-vue/lib/style/index.css'

Vue.use(DUI)
```

### 按需引入
```javascript
import { Card, Tree, Modal } from 'dui-vue'

export default {
  components: {
    DCard: Card,
    DTree: Tree,
    DModal: Modal
  }
}
```

### 主题配置
```javascript
Vue.use(DUI, {
  themeVersion: 'v2',
  theme: {
    colorPrimary: '#1890ff',
    radiusBase: '8px'
  }
})
```

## 事件处理

```vue
<!-- Tree 节点点击 -->
<d-tree @node-click="(data, node) => {}" />

<!-- Cascader 值变化 -->
<d-cascader @change="value => {}" />

<!-- Card 搜索 -->
<d-card @search-change="({ dateRange, inputKey }) => {}" />

<!-- Modal 关闭 -->
<d-modal @closed="handler" />
```

## 插槽用法

```vue
<!-- 自定义节点内容 -->
<d-tree>
  <template #default="{ node, data }">
    <d-icon :type="data.icon" />
    {{ node.label }}
  </template>
</d-tree>

<!-- 自定义卡片标题 -->
<d-card>
  <template #title>
    <h3>自定义标题</h3>
  </template>
</d-card>
```

## 性能优化

```javascript
// ✅ 按需引入
import { Card } from 'dui-vue'

// ✅ 虚拟列表（大数据）
<d-virtual-list :data="largeList" />

// ✅ 异步加载（树形数据）
<d-tree :load="loadNode" lazy />

// ❌ 避免全量引入
import DUI from 'dui-vue' // 打包体积大
```

## 常见组合

### 搜索 + 表格 + 分页
```vue
<d-card>
  <d-input v-model="keyword" placeholder="搜索" />
  <d-table :data="tableData" />
  <d-pagination :total="total" @change="fetchData" />
</d-card>
```

### 表单 + 验证
```vue
<d-form :model="form" :rules="rules">
  <d-item-layout label="名称">
    <d-input v-model="form.name" />
  </d-item-layout>
  <d-button type="primary" @click="submit">提交</d-button>
</d-form>
```

### 标签页 + 路由
```vue
<d-tabs v-model="activeTab" @tab-click="handleTab">
  <d-tab-pane
    v-for="tab in tabs"
    :key="tab.name"
    :label="tab.label"
    :name="tab.name"
  >
    <component :is="tab.component" />
  </d-tab-pane>
</d-tabs>
```

## 工具方法

```javascript
// Loading 服务
import { Loading } from 'dui-vue'
const loading = Loading.service({ fullscreen: true })
loading.close()

// Notice 通知
import { Notice } from 'dui-vue'
Notice({
  title: '提示',
  message: '消息内容',
  type: 'success'
})
```

## 断点参考

| 断点 | 宽度 |
|------|------|
| xs | < 480px |
| sm | ≥ 480px |
| md | ≥ 768px |
| lg | ≥ 992px |
| xl | ≥ 1200px |
| xxl | ≥ 1600px |

---

**详细文档**: 查看 `components-reference.md` 和 `examples.md`
