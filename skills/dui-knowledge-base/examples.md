# DUI Components 使用示例

本文档提供 DUI 组件的常用场景示例和最佳实践。

---

## 表单场景

### 1. 搜索表单

```vue
<template>
  <d-card title="高级搜索" shadow="hover">
    <d-form :model="searchForm" inline>
      <d-item-layout label="关键词">
        <d-input
          v-model="searchForm.keyword"
          placeholder="请输入关键词"
          clearable
        />
      </d-item-layout>

      <d-item-layout label="日期范围">
        <d-quick-date-picker
          v-model="searchForm.dateRange"
          :shortcuts="dateShortcuts"
        />
      </d-item-layout>

      <d-item-layout label="状态">
        <d-label-select
          v-model="searchForm.status"
          label=""
          :options="statusOptions"
          placeholder="请选择"
        />
      </d-item-layout>

      <d-item-layout label="分类">
        <d-tag-select
          v-model="searchForm.categories"
          :options="categoryOptions"
        />
      </d-item-layout>

      <d-button type="primary" @click="handleSearch">搜索</d-button>
      <d-button @click="handleReset">重置</d-button>
    </d-form>
  </d-card>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        keyword: '',
        dateRange: [],
        status: '',
        categories: []
      },
      dateShortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '最近一月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
          }
        }
      ],
      statusOptions: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      categoryOptions: [
        { label: '技术', value: 'tech' },
        { label: '产品', value: 'product' },
        { label: '运营', value: 'operation' }
      ]
    }
  },
  methods: {
    handleSearch() {
      console.log('搜索条件:', this.searchForm)
      // 执行搜索
    },
    handleReset() {
      this.searchForm = {
        keyword: '',
        dateRange: [],
        status: '',
        categories: []
      }
    }
  }
}
</script>
```

---

### 2. 级联选择表单

```vue
<template>
  <d-form :model="form" label-width="120px">
    <d-item-layout label="所属地区" required>
      <d-cascader
        v-model="form.region"
        :options="regionOptions"
        :props="cascaderProps"
        placeholder="请选择省市区"
        change-on-select
        clearable
      />
    </d-item-layout>

    <d-item-layout label="公司选择">
      <d-company-search
        v-model="form.companyId"
        placeholder="搜索公司名称"
      />
    </d-item-layout>

    <d-item-layout label="负责人">
      <d-user-picker
        v-model="form.userId"
        multiple
        :limit="3"
      />
    </d-item-layout>

    <d-item-layout label="标签">
      <d-tag-filter
        :filters="tagFilters"
        @change="handleTagChange"
      />
    </d-item-layout>

    <d-form-item>
      <d-button type="primary" @click="handleSubmit">提交</d-button>
      <d-button @click="handleCancel">取消</d-button>
    </d-form-item>
  </d-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        region: [],
        companyId: '',
        userId: '',
        tags: {}
      },
      cascaderProps: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      regionOptions: [
        {
          code: '110000',
          name: '北京市',
          children: [
            {
              code: '110100',
              name: '北京市',
              children: [
                { code: '110101', name: '东城区' },
                { code: '110102', name: '西城区' }
              ]
            }
          ]
        }
      ],
      tagFilters: [
        {
          label: '行业',
          key: 'industry',
          options: [
            { label: '全部', value: '' },
            { label: '互联网', value: 'internet' },
            { label: '金融', value: 'finance' }
          ]
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      console.log('表单数据:', this.form)
    },
    handleCancel() {
      // 取消逻辑
    },
    handleTagChange(filters) {
      this.form.tags = filters
    }
  }
}
</script>
```

---

## 数据展示场景

### 3. 卡片列表页

```vue
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <d-page-header title="项目列表" subtitle="管理所有项目">
      <template #extra>
        <d-button type="primary" icon="plus" @click="handleCreate">
          新建项目
        </d-button>
      </template>
    </d-page-header>

    <!-- 筛选区 -->
    <d-card shadow="never" style="margin-bottom: 16px">
      <d-tag-filter
        :filters="filters"
        @change="handleFilter"
      />
    </d-card>

    <!-- 数据卡片 -->
    <d-card-layout :gutter="16" :span="6">
      <d-card
        v-for="project in projects"
        :key="project.id"
        shadow="hover"
        :border="false"
      >
        <template #title>
          <d-trunced-tooltip :tooltip="project.name">
            <span>{{ project.name }}</span>
          </d-trunced-tooltip>
        </template>

        <template #extra>
          <d-dropdown trigger="click">
            <d-icon type="more" />
            <template #dropdown>
              <d-dropdown-menu>
                <d-dropdown-item @click="handleEdit(project)">
                  编辑
                </d-dropdown-item>
                <d-dropdown-item @click="handleDelete(project)">
                  删除
                </d-dropdown-item>
              </d-dropdown-menu>
            </template>
          </d-dropdown>
        </template>

        <div class="project-info">
          <p><strong>负责人：</strong>{{ project.owner }}</p>
          <p><strong>进度：</strong></p>
          <d-progress
            :percentage="project.progress"
            :show-text="false"
          />
          <p class="update-time">{{ project.updateTime }}</p>
        </div>
      </d-card>
    </d-card-layout>

    <!-- 空状态 -->
    <d-empty v-if="projects.length === 0" description="暂无项目">
      <d-button type="primary" @click="handleCreate">
        创建第一个项目
      </d-button>
    </d-empty>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      filters: [
        {
          label: '状态',
          key: 'status',
          options: [
            { label: '全部', value: '' },
            { label: '进行中', value: 'active' },
            { label: '已完成', value: 'completed' }
          ]
        }
      ]
    }
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      // 获取项目列表
      this.projects = await getProjects()
    },
    handleFilter(filters) {
      console.log('筛选条件:', filters)
      this.fetchProjects()
    },
    handleCreate() {
      // 新建项目
    },
    handleEdit(project) {
      // 编辑项目
    },
    handleDelete(project) {
      // 删除项目
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}
.project-info p {
  margin: 8px 0;
  font-size: 14px;
}
.update-time {
  color: #999;
  font-size: 12px !important;
}
</style>
```

---

### 4. 树形数据管理

```vue
<template>
  <d-card title="组织架构" shadow="hover">
    <div class="tree-toolbar">
      <d-input
        v-model="searchKeyword"
        placeholder="搜索节点"
        prefix-icon="search"
        clearable
        @input="handleSearch"
      />
      <d-button-group>
        <d-button icon="plus" @click="handleAdd">新增</d-button>
        <d-button icon="edit" @click="handleEdit">编辑</d-button>
        <d-button icon="delete" @click="handleDelete">删除</d-button>
      </d-button-group>
    </div>

    <d-tree
      ref="tree"
      :data="treeData"
      :props="treeProps"
      node-key="id"
      show-checkbox
      highlight-current
      :default-expanded-keys="expandedKeys"
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
    >
      <template #default="{ node, data }">
        <span class="tree-node">
          <d-icon :type="data.icon || 'folder'" />
          <span>{{ node.label }}</span>
          <d-tag v-if="data.type" size="small" :type="getTagType(data.type)">
            {{ data.type }}
          </d-tag>
        </span>
      </template>
    </d-tree>
  </d-card>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      treeData: [],
      treeProps: {
        label: 'name',
        children: 'children'
      },
      expandedKeys: [],
      currentNode: null
    }
  },
  created() {
    this.fetchTreeData()
  },
  methods: {
    async fetchTreeData() {
      // 获取树形数据
      this.treeData = await getOrgTree()
    },
    handleSearch(keyword) {
      this.$refs.tree.filter(keyword)
    },
    handleNodeClick(data) {
      this.currentNode = data
      console.log('选中节点:', data)
    },
    handleCheckChange(data, checked) {
      console.log('复选框变化:', data, checked)
    },
    handleAdd() {
      // 新增节点
    },
    handleEdit() {
      if (!this.currentNode) {
        this.$message.warning('请先选择节点')
        return
      }
      // 编辑节点
    },
    handleDelete() {
      if (!this.currentNode) {
        this.$message.warning('请先选择节点')
        return
      }
      // 删除节点
    },
    getTagType(type) {
      const typeMap = {
        department: 'primary',
        team: 'success',
        person: 'warning'
      }
      return typeMap[type] || 'info'
    }
  }
}
</script>

<style scoped>
.tree-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

---

### 5. 大数据列表（虚拟滚动）

```vue
<template>
  <d-card title="用户列表" shadow="hover">
    <template #extra>
      <span>共 {{ userList.length }} 条</span>
    </template>

    <d-virtual-list
      :data="userList"
      :item-height="60"
      :visible-count="15"
    >
      <template #default="{ item }">
        <div class="user-item">
          <d-avatar :src="item.avatar" :size="40" />
          <div class="user-info">
            <div class="user-name">{{ item.name }}</div>
            <div class="user-email">{{ item.email }}</div>
          </div>
          <d-tag :type="getStatusType(item.status)">
            {{ item.statusText }}
          </d-tag>
          <d-button size="small" @click="handleView(item)">
            查看
          </d-button>
        </div>
      </template>
    </d-virtual-list>
  </d-card>
</template>

<script>
export default {
  data() {
    return {
      userList: []
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      // 获取大量用户数据
      this.userList = await getUsers() // 假设返回 10000+ 条
    },
    getStatusType(status) {
      const map = {
        active: 'success',
        inactive: 'info',
        banned: 'danger'
      }
      return map[status] || 'info'
    },
    handleView(user) {
      // 查看用户详情
    }
  }
}
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.user-info {
  flex: 1;
}
.user-name {
  font-weight: 500;
}
.user-email {
  font-size: 12px;
  color: #999;
}
</style>
```

---

## 反馈交互场景

### 6. 加载状态管理

```vue
<template>
  <div>
    <!-- 页面级加载 -->
    <d-page-layout v-loading="pageLoading">
      <template #header>
        <header>管理系统</header>
      </template>

      <!-- 局部加载 -->
      <d-card title="数据统计" v-loading="chartLoading">
        <div id="chart-container">
          <!-- 图表内容 -->
        </div>
      </d-card>

      <!-- 按钮加载 -->
      <d-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        提交
      </d-button>
    </d-page-layout>
  </div>
</template>

<script>
import { Loading } from 'dui-vue'

export default {
  data() {
    return {
      pageLoading: false,
      chartLoading: false,
      submitLoading: false
    }
  },
  methods: {
    async handleSubmit() {
      this.submitLoading = true
      try {
        await submitForm(this.formData)
        this.$message.success('提交成功')
      } catch (error) {
        this.$message.error('提交失败')
      } finally {
        this.submitLoading = false
      }
    },

    // 全屏加载示例
    async loadData() {
      const loading = Loading.service({
        fullscreen: true,
        text: '数据加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        await fetchData()
      } finally {
        loading.close()
      }
    }
  }
}
</script>
```

---

### 7. 模态框和抽屉

```vue
<template>
  <div>
    <!-- 触发按钮 -->
    <d-button @click="showModal = true">打开对话框</d-button>
    <d-button @click="showDrawer = true">打开抽屉</d-button>

    <!-- 确认对话框 -->
    <d-modal
      v-model="showModal"
      title="确认操作"
      width="500px"
      :before-close="handleBeforeClose"
    >
      <p>确定要删除这条记录吗？此操作不可恢复。</p>

      <template #footer>
        <d-button @click="showModal = false">取消</d-button>
        <d-button
          type="primary"
          :loading="deleting"
          @click="handleConfirm"
        >
          确定删除
        </d-button>
      </template>
    </d-modal>

    <!-- 详情抽屉 -->
    <d-drawer
      v-model="showDrawer"
      title="详情信息"
      placement="rtl"
      size="600px"
    >
      <d-form :model="detail" label-width="100px">
        <d-item-layout label="姓名">
          {{ detail.name }}
        </d-item-layout>
        <d-item-layout label="邮箱">
          {{ detail.email }}
        </d-item-layout>
        <d-item-layout label="简介">
          {{ detail.description }}
        </d-item-layout>
      </d-form>

      <template #footer>
        <d-button @click="showDrawer = false">关闭</d-button>
      </template>
    </d-drawer>

    <!-- 全屏对话框 -->
    <d-modal
      v-model="showFullscreenModal"
      title="编辑器"
      fullscreen
    >
      <div class="editor-content">
        <!-- 富文本编辑器等内容 -->
      </div>
    </d-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      showDrawer: false,
      showFullscreenModal: false,
      deleting: false,
      detail: {},
      formData: {}
    }
  },
  methods: {
    handleBeforeClose(done) {
      // 关闭前确认
      this.$confirm('确定要关闭吗？未保存的内容将丢失')
        .then(() => done())
        .catch(() => {})
    },
    async handleConfirm() {
      this.deleting = true
      try {
        await deleteRecord(this.detail.id)
        this.$message.success('删除成功')
        this.showModal = false
      } catch (error) {
        this.$message.error('删除失败')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
```

---

### 8. 通知和消息

```vue
<template>
  <div>
    <d-button @click="showInfo">信息提示</d-button>
    <d-button @click="showSuccess">成功提示</d-button>
    <d-button @click="showWarning">警告提示</d-button>
    <d-button @click="showError">错误提示</d-button>
    <d-button @click="showNotification">通知</d-button>
  </div>
</template>

<script>
import { Notice } from 'dui-vue'

export default {
  methods: {
    showInfo() {
      this.$message.info('这是一条提示信息')
    },
    showSuccess() {
      this.$message.success('操作成功')
    },
    showWarning() {
      this.$message.warning('请注意')
    },
    showError() {
      this.$message.error('操作失败')
    },
    showNotification() {
      Notice({
        title: '系统通知',
        message: '您有一条新的消息',
        type: 'info',
        duration: 5000,
        position: 'top-right',
        onClick: () => {
          console.log('通知被点击')
        }
      })
    }
  }
}
</script>
```

---

## 布局场景

### 9. 标准后台布局

```vue
<template>
  <d-page-layout :collapsed="sidebarCollapsed">
    <!-- 头部 -->
    <template #header>
      <header class="layout-header">
        <div class="logo">管理系统</div>
        <d-button
          icon="menu-fold"
          @click="sidebarCollapsed = !sidebarCollapsed"
        />
        <div class="header-actions">
          <d-dropdown>
            <d-avatar>{{ userName }}</d-avatar>
            <template #dropdown>
              <d-dropdown-menu>
                <d-dropdown-item>个人中心</d-dropdown-item>
                <d-dropdown-item divided @click="handleLogout">
                  退出登录
                </d-dropdown-item>
              </d-dropdown-menu>
            </template>
          </d-dropdown>
        </div>
      </header>
    </template>

    <!-- 侧边栏 -->
    <template #sidebar>
      <aside class="sidebar">
        <d-menu
          v-model="activeMenu"
          :menus="menuList"
          @select="handleMenuSelect"
        />
      </aside>
    </template>

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 面包屑 -->
      <d-page-header
        :title="pageTitle"
        :breadcrumb="breadcrumb"
        @back="$router.back()"
      />

      <!-- 多标签页 -->
      <d-tabs-multiple
        :tabs="openTabs"
        :active-tab="currentTab"
        @change="handleTabChange"
        @remove="handleTabRemove"
      />

      <!-- 路由视图 -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </d-page-layout>
</template>

<script>
export default {
  data() {
    return {
      sidebarCollapsed: false,
      activeMenu: 'dashboard',
      userName: '管理员',
      menuList: [
        {
          key: 'dashboard',
          title: '仪表盘',
          icon: 'dashboard'
        },
        {
          key: 'users',
          title: '用户管理',
          icon: 'user'
        }
      ],
      openTabs: [],
      currentTab: ''
    }
  },
  computed: {
    pageTitle() {
      return this.$route.meta.title || ''
    },
    breadcrumb() {
      return this.$route.matched.map(route => ({
        title: route.meta.title
      }))
    }
  },
  methods: {
    handleMenuSelect(key) {
      this.$router.push({ name: key })
    },
    handleTabChange(tab) {
      this.$router.push({ name: tab.key })
    },
    handleTabRemove(tab) {
      // 移除标签
    },
    handleLogout() {
      // 退出登录
    }
  }
}
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
}
.logo {
  font-size: 18px;
  font-weight: bold;
}
.sidebar {
  height: 100%;
  overflow-y: auto;
}
.main-content {
  padding: 24px;
}
</style>
```

---

### 10. 锚点导航页面

```vue
<template>
  <div class="doc-page">
    <d-anchor-nav
      :anchors="anchors"
      :offset-top="60"
      @change="handleAnchorChange"
    />

    <div class="doc-content">
      <section id="introduction">
        <h2>产品介绍</h2>
        <p>这里是产品介绍内容...</p>
      </section>

      <section id="features">
        <h2>功能特性</h2>
        <p>功能特性说明...</p>
      </section>

      <section id="usage">
        <h2>使用方法</h2>
        <p>使用指南...</p>
      </section>

      <section id="faq">
        <h2>常见问题</h2>
        <p>FAQ 内容...</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      anchors: [
        { key: 'introduction', title: '产品介绍', target: '#introduction' },
        { key: 'features', title: '功能特性', target: '#features' },
        { key: 'usage', title: '使用方法', target: '#usage' },
        { key: 'faq', title: '常见问题', target: '#faq' }
      ]
    }
  },
  methods: {
    handleAnchorChange(key) {
      console.log('当前锚点:', key)
    }
  }
}
</script>

<style scoped>
.doc-page {
  display: flex;
  gap: 24px;
}
.doc-content {
  flex: 1;
}
section {
  margin-bottom: 48px;
  scroll-margin-top: 60px;
}
</style>
```

---

## 主题定制

### 11. 自定义主题

```javascript
// main.js
import Vue from 'vue'
import DUI from 'dui-vue'
import 'dui-vue/lib/style/index.css'

// 主题配置
Vue.use(DUI, {
  themeVersion: 'v2',
  theme: {
    // 主色
    colorPrimary: '#1890ff',
    // 成功色
    colorSuccess: '#52c41a',
    // 警告色
    colorWarning: '#faad14',
    // 错误色
    colorError: '#ff4d4f',
    // 圆角
    radiusBase: '8px',
    // 字体大小
    fontSizeBase: '14px'
  }
})
```

```css
/* 或使用 CSS 变量覆盖 */
:root {
  --color-primary: #1890ff;
  --radius-base: 8px;
}
```

---

## 性能优化建议

### 12. 按需引入

```javascript
// 推荐：只引入需要的组件
import { Card, Tree, Cascader, Modal } from 'dui-vue'

export default {
  components: {
    DCard: Card,
    DTree: Tree,
    DCascader: Cascader,
    DModal: Modal
  }
}
```

### 13. 异步组件加载

```javascript
// 路由级别懒加载
const UserManagement = () => import('@/views/UserManagement.vue')

// 组件级别懒加载
export default {
  components: {
    HeavyComponent: () => import('./HeavyComponent.vue')
  }
}
```

### 14. 列表优化

```vue
<!-- 大数据使用虚拟列表 -->
<d-virtual-list
  :data="largeList"
  :item-height="50"
  :visible-count="20"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</d-virtual-list>

<!-- 树形数据异步加载 -->
<d-tree
  :load="loadNode"
  lazy
/>

<script>
export default {
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        resolve([{ name: '根节点' }])
      } else {
        const children = await fetchChildren(node.data.id)
        resolve(children)
      }
    }
  }
}
</script>
```

---

## 常见组合模式

### 15. 表格 + 分页 + 筛选

```vue
<template>
  <d-card shadow="hover">
    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <d-input
        v-model="searchKeyword"
        placeholder="搜索"
        prefix-icon="search"
        clearable
      />
      <d-button type="primary" @click="handleCreate">新建</d-button>
    </div>

    <!-- 数据表格 -->
    <d-table
      :data="tableData"
      :loading="loading"
      row-key="id"
    >
      <d-table-column prop="name" label="名称" />
      <d-table-column prop="status" label="状态">
        <template #default="{ row }">
          <d-tag :type="getStatusType(row.status)">
            {{ row.statusText }}
          </d-tag>
        </template>
      </d-table-column>
      <d-table-column label="操作" width="200">
        <template #default="{ row }">
          <d-button size="small" @click="handleEdit(row)">
            编辑
          </d-button>
          <d-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </d-button>
        </template>
      </d-table-column>
    </d-table>

    <!-- 分页 -->
    <d-pagination
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @change="handlePageChange"
    />
  </d-card>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const { data, total } = await getList({
          keyword: this.searchKeyword,
          page: this.currentPage,
          pageSize: this.pageSize
        })
        this.tableData = data
        this.total = total
      } finally {
        this.loading = false
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchData()
    },
    getStatusType(status) {
      const map = {
        active: 'success',
        inactive: 'info'
      }
      return map[status] || 'info'
    },
    handleCreate() {
      // 新建
    },
    handleEdit(row) {
      // 编辑
    },
    handleDelete(row) {
      // 删除
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
```

---

## 版本信息

- DUI 版本: 3.0.25
- Vue 版本: 2.7.16
- 最后更新: 2026-05-21
