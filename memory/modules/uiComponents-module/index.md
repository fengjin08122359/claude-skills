# uiComponents-module 索引

**创建日期：** 2026-07-14
**状态：** 已完成（第一批）
**难度等级：** 高

## 模块概述

为 `packages/uiComponents/src` 补充完整组件测试，使用 vue-jest + @vue/test-utils + jest。

## 已完成工作

### 新增测试（152 个用例）

| 测试文件 | 覆盖模块 | 用例数 |
|---------|---------|--------|
| virtualTreeUtil.test.ts | virtual-tree/utils/util.js (18 纯函数) | 71 |
| virtualTreeTypes.test.ts | virtual-tree/utils/types.js | 14 |
| virtualTreeMerge.test.ts | virtual-tree/utils/merge.js | 6 |
| virtualTreeModelUtil.test.ts | virtual-tree/model/util.js | 8 |
| floatUtils.test.ts | float/utils/* | 14 |
| drawer.test.ts | Drawer payload 类 | 6 |
| hooks.test.ts | hooks/normal.ts | 13 |
| tableToExcel.test.ts | TableToExcel 工具类 | 20 |

### 源码修改

- **jest.config.js**：添加 vue 文件 transform 支持
- **src/drawer/payload.ts**（新建）：提取 Drawer 类为独立 .ts 文件
- **src/drawer/index.vue**：改为从 payload.ts 导入
- **src/drawer/data.ts**：同步更新导入路径

### 测试结果

全部 28 个测试套件 520 个测试通过（含新增 152 个）。

## 待完成（后续批次）

- [ ] Vue 组件渲染测试（Card, Loading, Progress, Split, ValidCode, SelectInTable）
- [ ] float/useFloating composable 测试
- [ ] hooks/vueuse/* 测试
