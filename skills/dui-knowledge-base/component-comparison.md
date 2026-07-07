# DUI Components 组件选择指南

本文档帮助你根据使用场景选择合适的 DUI 组件。

---

## 选择器类组件对比

### 单选场景

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-select` (原生) | 简单选项列表 | 基础下拉选择 |
| `d-label-select` | 表单项带标签 | 左侧显示标签，适合表单 |
| `d-cascader` | 层级数据选择 | 多级联动，如省市区 |
| `d-tree-select` | 树形数据选择 | 下拉树形结构 |
| `d-segmented` | 少量选项切换 | 分段控制器，2-5个选项 |

**选择建议**:
- 2-5 个固定选项 → `d-segmented`
- 简单下拉列表 → `d-select`
- 表单中需要标签 → `d-label-select`
- 层级数据（省市） → `d-cascader`
- 树形结构（组织） → `d-tree-select`

### 多选场景

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-checkbox` | 简单多选 | 基础复选框 |
| `d-tag-select` | 标签式多选 | 视觉友好，适合少量选项 |
| `d-tag-filter` | 多维度筛选 | 多组标签筛选 |
| `d-cascader` (multiple) | 层级多选 | 多级联动多选 |
| `d-tree` (checkbox) | 树形多选 | 带层级的多选 |

**选择建议**:
- 少量选项（< 10） → `d-tag-select`
- 多维度筛选 → `d-tag-filter`
- 大量选项 → `d-checkbox-group`
- 层级多选 → `d-cascader` 或 `d-tree`

### 特殊选择器

| 组件 | 用途 | 说明 |
|------|------|------|
| `d-company-search` | 公司选择 | 支持搜索、autocomplete |
| `d-compare-company-picker` | 公司对比 | 限制数量的多选公司 |
| `d-user-picker` | 用户选择 | 支持搜索、多选、限制数量 |

---

## 容器类组件对比

### 卡片容器

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-card` | 通用卡片 | 支持标题、搜索、日期筛选 |
| `d-data-card` | 数据指标展示 | 突出显示数值和趋势 |
| `d-card-layout` | 卡片网格布局 | 自动栅格排列 |

**选择建议**:
- 普通内容容器 → `d-card`
- 关键指标展示 → `d-data-card`
- 多个卡片排列 → `d-card-layout` 包裹

### 页面布局

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-page-layout` | 标准后台布局 | header + sidebar + content |
| `d-item-layout` | 表单项布局 | label + content 结构 |
| `d-item-layout-v2` | 复杂表单项 | 支持多个 label 和 action |

**选择建议**:
- 整体页面框架 → `d-page-layout`
- 表单字段布局 → `d-item-layout`
- 复杂表单行 → `d-item-layout-v2`

---

## 列表类组件对比

### 数据列表

| 组件 | 适用场景 | 数据量 | 特点 |
|------|---------|--------|------|
| `d-list` | 通用列表 | < 100 | 基础列表容器 |
| `d-virtual-list` | 大数据列表 | 1000+ | 虚拟滚动，高性能 |
| `d-vt-virtual-list` | 变高列表项 | 1000+ | 支持不同高度 |
| `d-auto-scroll` | 自动滚动列表 | 任意 | 公告、新闻滚动 |

**选择建议**:
- 少量数据（< 100） → `d-list`
- 大量数据（1000+） → `d-virtual-list`
- 列表项高度不一 → `d-vt-virtual-list`
- 需要自动滚动 → `d-auto-scroll`

### 树形数据

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-tree` | 树形展示 | 完整树形控件，支持操作 |
| `d-tree-select` | 树形选择 | 下拉形式的树选择器 |

**选择建议**:
- 需要展开/折叠浏览 → `d-tree`
- 表单中选择树节点 → `d-tree-select`

---

## 导航类组件对比

### 页面内导航

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-tabs` | 内容分组切换 | 标准标签页 |
| `d-tabs-multiple` | 多标签管理 | 类似浏览器标签 |
| `d-anchor-nav` | 长页面锚点 | 侧边锚点导航 |
| `d-segmented` | 视图切换 | 分段控制器 |

**选择建议**:
- 内容分组展示 → `d-tabs`
- 多页面标签管理 → `d-tabs-multiple`
- 单页长文档导航 → `d-anchor-nav`
- 2-4 个视图切换 → `d-segmented`

---

## 反馈类组件对比

### 加载状态

| 组件/方式 | 适用场景 | 特点 |
|----------|---------|------|
| `v-loading` 指令 | 局部加载 | 绑定到 DOM 元素 |
| `Loading.service()` | 全局加载 | 全屏遮罩 |
| `<d-loading>` 组件 | 内联加载 | 作为组件使用 |

**选择建议**:
- 区域加载 → `v-loading="loading"`
- 全屏加载 → `Loading.service({ fullscreen: true })`
- 占位加载 → `<d-loading>` 组件

### 弹窗反馈

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-modal` | 重要操作确认 | 模态对话框，阻断交互 |
| `d-drawer` | 详情查看/编辑 | 侧边抽屉，不阻断 |
| `Notice` | 通知提示 | 自动消失的通知 |
| `$message` | 轻量提示 | 简短消息提示 |

**选择建议**:
- 需要用户确认 → `d-modal`
- 查看详情/编辑 → `d-drawer`
- 操作结果通知 → `Notice()`
- 简短提示 → `this.$message.success()`

### 错误展示

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-error-page` | 整页错误 | 404、500 等 |
| `d-empty` | 空数据状态 | 列表为空时 |
| `$message.error()` | 操作错误 | 临时错误提示 |

**选择建议**:
- 页面级错误 → `d-error-page`
- 数据为空 → `d-empty`
- 操作失败 → `this.$message.error()`

---

## 数据展示组件对比

### 文本信息

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `<span>` + `d-trunced-tooltip` | 可能溢出的文本 | 自动截断 + tooltip |
| `d-tag` | 标记/分类 | 彩色标签 |
| `d-icon` | 图标展示 | 矢量图标 |

### 媒体内容

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-image-viewer` | 图片预览 | 放大、旋转、下载 |
| `d-progress` | 进度展示 | 线性/圆形进度条 |

### 内容模块

| 组件 | 适用场景 | 特点 |
|------|---------|------|
| `d-news` | 新闻列表 | 标题 + 时间 |
| `d-news-strip` | 滚动新闻 | 单行滚动 |
| `d-reports` | 报告列表 | 报告条目 |
| `d-public-opinion` | 舆情信息 | 舆情条目 |

---

## 典型场景组件搭配

### 1. 数据管理页面

```
页面结构:
├── d-page-layout (整体布局)
│   ├── d-page-header (页面标题)
│   ├── d-card (筛选区)
│   │   └── d-tag-filter (多维度筛选)
│   ├── d-card (数据表格)
│   │   ├── d-table (数据列表)
│   │   └── d-pagination (分页)
│   └── d-modal (编辑弹窗)
│       └── d-form (表单)
│           ├── d-input
│           ├── d-cascader
│           └── d-quick-date-picker
```

### 2. 数据看板

```
页面结构:
├── d-page-header (标题)
├── d-card-layout (指标卡片区)
│   └── d-data-card × 4 (关键指标)
├── d-card (图表区)
│   └── ECharts 图表
└── d-card (详细列表)
    └── d-virtual-list (大数据列表)
```

### 3. 组织架构管理

```
页面结构:
├── d-card (标题 + 工具栏)
│   ├── d-input (搜索)
│   └── d-button-group (操作按钮)
├── d-tree (组织树)
│   └── 自定义节点模板
└── d-drawer (详情编辑)
    └── d-form (表单)
```

### 4. 表单填写页

```
页面结构:
├── d-page-header (标题 + 返回)
├── d-card (表单容器)
│   └── d-form
│       ├── d-item-layout × N (表单项)
│       │   ├── d-input
│       │   ├── d-label-select
│       │   ├── d-company-search
│       │   └── d-user-picker
│       └── d-form-item (按钮区)
│           └── d-button (提交/取消)
```

### 5. 详情页

```
页面结构:
├── d-page-header (标题 + 操作)
├── d-tabs (内容分组)
│   ├── d-tab-pane (基本信息)
│   │   └── d-item-layout (只读展示)
│   ├── d-tab-pane (关联数据)
│   │   └── d-table (列表)
│   └── d-tab-pane (操作记录)
│       └── d-timeline (时间线)
```

---

## 性能考虑

### 大数据场景

| 场景 | 推荐组件 | 原因 |
|------|---------|------|
| 列表 > 1000 条 | `d-virtual-list` | 只渲染可见区域 |
| 树节点 > 500 | 异步加载 `d-tree` | 按需加载子节点 |
| 选项 > 100 | 搜索选择器 | 避免渲染所有选项 |
| 标签 > 50 | 分页或虚拟滚动 | 减少 DOM 节点 |

### 交互频率高的场景

| 场景 | 优化建议 |
|------|---------|
| 频繁切换标签 | 使用 `keep-alive` 缓存 |
| 实时搜索 | 添加 debounce 防抖 |
| 大量复选框 | 使用 `check-strictly` 模式 |

---

## 决策流程图

### 选择器选择流程

```
需要用户选择数据
│
├─ 是层级数据吗？
│  ├─ 是 → 需要多选吗？
│  │       ├─ 是 → d-cascader (multiple)
│  │       └─ 否 → d-cascader 或 d-tree-select
│  │
│  └─ 否 → 是特殊类型吗？
│          ├─ 公司 → d-company-search
│          ├─ 用户 → d-user-picker
│          └─ 普通 → 选项数量？
│                    ├─ 2-5个 → d-segmented
│                    ├─ < 20个 → d-select
│                    └─ > 20个 → d-select + filterable
```

### 容器选择流程

```
需要容器组件
│
├─ 整体页面布局？
│  └─ 是 → d-page-layout
│
├─ 表单字段布局？
│  └─ 是 → d-item-layout 或 d-item-layout-v2
│
├─ 展示数据卡片？
│  └─ 是 → d-card 或 d-data-card
│
└─ 其他内容容器？
   └─ d-card
```

---

## 版本信息

- DUI 版本: 3.0.25
- 最后更新: 2026-05-21
- 组件总数: 44 个
