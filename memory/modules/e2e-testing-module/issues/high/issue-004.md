# Issue-004: Cascader + Swiper 组件测试 — 纵向切片 #3

**难度：** 中（6分）
**类型：** AFK（可独立完成）
**切片：** 两个复杂 UI 组件
**前置：** issue-001
**所属模块：** e2e-testing-module

---

## 目标

用 `@vue/test-utils` 测试真实 Cascader 和 Swiper Vue 组件。

## TDD 测试计划

### Cascader 组件（`uiComponents/src/cascader/index.vue`）

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | 渲染选项列表 | options tree 正确渲染 |
| 2 | 单选模式 | 选择一项 → value 更新 |
| 3 | 多选模式 | multiple=true → 多项选择 |
| 4 | 级联展开 | 点击父级 → 展开子级面板 |
| 5 | getValue | 返回当前选中值 |
| 6 | setValue | 设置值 → UI 更新 |
| 7 | getValueLabel | 返回选中标签文本 |
| 8 | 清空选择 | 清空 → value=[] |

### Swiper 组件（`uiComponents/src/swiper/index.vue`）

| # | 用例 | 验证点 |
|---|------|--------|
| 9 | 渲染数据列表 | data 数量 = 渲染元素数量 |
| 10 | flexNumber | flexNumber=3 → 每行显示3个 |
| 11 | getFlexStyle | 返回正确的 flex-basis |
| 12 | setDataList | 更新数据 → UI 重新渲染 |
| 13 | 更多/更少 | 调整 flexNumber → flex-basis 变化 |
| 14 | 边界 flexNumber | min=1, max=data.length |

#### 需要 mock

- `element-ui` → Cascader 可能依赖 el-cascader/el-popover

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `test-harness/ui-components/cascaderSwiper.test.ts` |

## 完成定义

- [ ] 14 个测试用例全部通过
- [ ] Cascader 单选/多选/级联 覆盖
- [ ] Swiper flex 布局/数据更新 覆盖
