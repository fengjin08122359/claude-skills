# DUI Components Skill

DUI (Design UI) Vue 2.7 组件库文档 Skill，基于 **Ant Design Vue 1.7.8** 和 **vxe-table 3.7.3** 构建，提供完整的组件 API 参考、使用示例和最佳实践。

## 架构组成

DUI 组件库包含三部分：

1. **DUI 自研组件** (40+ 个): 企业级业务组件
2. **Ant Design Vue 封装** (基础组件): Button, Input, Select, Form, Table 等
3. **vxe-table 集成** (高级表格): 高性能数据表格

## 文件结构

```
dui-components/
├── SKILL.md                        # Skill 主文件（元数据和快速指南）
├── components-reference.md         # DUI 自研组件完整 API 参考
├── antd-vxe-integration.md         # Antdv 和 vxe-table 使用指南 ⭐
├── examples.md                     # 使用示例和最佳实践
├── component-comparison.md         # 组件选择指南
├── quick-reference.md              # 快速参考卡片
├── USAGE.md                        # Skill 使用说明
├── README.md                       # 本文件
└── component-index.json            # 组件索引
```

## 使用方法

### 在 Lingma 中使用

当你在对话中询问 DUI 组件相关问题时，Lingma 会自动调用此 skill：

```
用户：如何使用 DCard 组件？
用户：DTree 有哪些 Props？
用户：给我一个 Cascader 的使用示例
用户：表单组件都有哪些？
```

### 查询组件信息

Skill 会提供：
1. **组件用途** - 一句话描述组件功能
2. **Props 列表** - 完整的属性说明（类型、默认值、描述）
3. **Events 列表** - 组件事件及参数
4. **Slots 列表** - 插槽说明
5. **代码示例** - 可直接使用的 Vue 代码

## 组件分类

### 基础组件 (6个)
Icon, Tag, Progress, Empty, Notice, TruncedTooltip

### 表单组件 (9个)
Cascader, CascaderPanel, QuickDatePicker, LabelSelect, TagSelect, TagFilter, CompanySearch, CompareCompanyPicker, UserPicker

### 数据展示 (12个)
Card, CardLayout, List, News, NewsStrip, Reports, PublicOpinion, DataCard, ImageViewer, Tree, TreeSelect

### 布局组件 (11个)
PageLayout, ItemLayout, ItemLayoutV2, AnchorNav, Tabs, TabsMultiple, Segmented, AutoScroll, VirtualList, VtVirtualList

### 反馈组件 (5个)
Loading, Modal, Drawer, ErrorPage, PageHeader

## 数据来源

- **DUI 类型定义**: `dui-vue/package/types/ui/*.d.ts`
- **Ant Design Vue**: 1.7.8 (基础组件库)
- **vxe-table**: 3.7.3 (高级表格)
- **DUI 版本**: 3.0.25
- **Vue 版本**: 2.7.16
- **组件总数**: 40+ DUI 自研 + 50+ Antdv + vxe-table

## 更新维护

如需添加新组件或更新文档：

1. 查看 `dui-vue/package/types/ui/[ComponentName].d.ts`
2. 提取 Props、Events、Slots 信息
3. 在 `components-reference.md` 中添加组件文档
4. 在 `examples.md` 中添加使用示例

## 相关资源

- [DUI 组件库源码](../../dui-vue/package/)
- [类型定义目录](../../dui-vue/package/types/ui/)
- [主入口文件](../../dui-vue/package/types/ui/dui-vue.d.ts)
