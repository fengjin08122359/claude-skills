# DUI Components Skill 使用指南

## 快速开始

本 Skill 已自动加载到 Lingma 系统中。当你询问 DUI 组件相关问题时，系统会自动调用此 Skill 提供准确的文档和示例。

## 触发场景

以下情况会自动触发 DUI Components Skill：

### 1. 查询组件用法
```
用户：如何使用 DCard 组件？
用户：DTree 的使用方法
用户：Cascader 怎么用？
```

### 2. 查询组件 API
```
用户：DCard 有哪些 Props？
用户：DTree 的 Events 有哪些？
用户：Modal 的 Slots 是什么？
```

### 3. 需要代码示例
```
用户：给我一个 Tree 组件的示例
用户：Cascader 的代码怎么写？
用户：如何实现卡片列表？
```

### 4. 分类浏览
```
用户：表单组件都有哪些？
用户：布局组件有哪些？
用户：数据展示组件列表
```

### 5. 最佳实践
```
用户：DUI 组件的性能优化建议
用户：如何按需引入组件？
用户：主题怎么定制？
```

## 响应内容

当 Skill 被触发时，会提供以下信息：

### 基础信息
- **组件名称**: 如 DCard、DTree
- **用途描述**: 一句话说明组件功能
- **所属分类**: 基础/表单/数据展示/布局/反馈

### API 文档
- **Props 表格**: 属性名、类型、默认值、说明
- **Events 表格**: 事件名、参数、说明
- **Slots 表格**: 插槽名、说明

### 代码示例
```vue
<template>
  <!-- 完整的 Vue SFC 示例 -->
</template>

<script>
export default {
  // 组件逻辑
}
</script>

<style scoped>
/* 样式 */
</style>
```

### 相关组件
推荐相关的组件，帮助构建完整功能

## 使用技巧

### 1. 精确查询
```
✅ 好：DCard 的 Props 有哪些？
❌ 模糊：卡片怎么用？
```

### 2. 场景化提问
```
✅ 好：如何实现一个带搜索的卡片列表？
❌ 简单：我要列表
```

### 3. 组合查询
```
✅ 好：Tree 和 Cascader 有什么区别？什么时候用哪个？
❌ 单一：Tree 和 Cascader
```

### 4. 请求示例
```
✅ 好：给我一个完整的表单示例，包含级联选择器和日期选择器
❌ 简单：给个示例
```

## 文档结构说明

### SKILL.md (6.1 KB)
- Skill 元数据和触发规则
- 快速开始指南
- 组件分类概览
- 核心组件速查

### components-reference.md (33 KB)
- 所有 40+ 组件的完整 API 参考
- Props/Events/Slots 详细说明
- 每个组件都有代码示例
- 按分类组织，便于查找

### examples.md (26 KB)
- 15+ 个真实场景示例
- 表单、数据展示、布局等常见场景
- 性能优化建议
- 最佳实践指南

### component-index.json (1.9 KB)
- 组件索引和分类信息
- 快速访问链接
- 版本信息

### README.md (2.3 KB)
- Skill 使用说明
- 文件结构介绍
- 维护指南

## 常见问题

### Q: 如何知道某个组件是否存在？
A: 查看 `component-index.json` 或直接询问 "DUI 有 XXX 组件吗？"

### Q: 组件的 TypeScript 类型定义在哪里？
A: 位于 `dui-vue/package/types/ui/[ComponentName].d.ts`

### Q: 如何查看组件的完整导出列表？
A: 查看 `dui-vue/package/types/ui/dui-vue.d.ts`

### Q: 示例代码可以直接使用吗？
A: 可以，所有示例都是基于实际类型定义编写的，但需要根据你的业务逻辑调整

### Q: 如何获取最新的组件文档？
A: Skill 文档基于 DUI 3.0.25 版本，如需更新，请检查 `dui-vue/package/types/ui/` 目录的类型定义

## 与其他 Skill 配合

### 与 frontend-design 配合
```
用户：用 DUI 组件设计一个后台管理页面
→ frontend-design 负责整体设计
→ dui-components 提供具体组件文档
```

### 与 brainstorming 配合
```
用户：我想做一个数据看板，应该用哪些 DUI 组件？
→ brainstorming 分析需求
→ dui-components 推荐合适组件
```

## 贡献和更新

如果你发现文档有误或需要补充：

1. 检查 `dui-vue/package/types/ui/` 中的类型定义
2. 更新 `components-reference.md` 中的对应组件文档
3. 在 `examples.md` 中添加新示例
4. 更新 `component-index.json` 的版本信息

## 技术支持

- DUI 版本: 3.0.25
- Vue 版本: 2.7.16
- TypeScript: 完整支持
- 文档生成时间: 2026-05-21

---

**提示**: 本 Skill 专注于 DUI 组件库文档，对于通用 Vue 问题或其他 UI 库的问题，请使用相应的 Skill。
