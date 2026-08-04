# Issue-002: Dialog 组件测试 — 纵向切片 #1

**难度：** 中（4分）
**类型：** AFK（可独立完成）
**切片：** 最简组件，验证完整测试管道
**前置：** issue-001
**所属模块：** e2e-testing-module

---

## 目标

用 `@vue/test-utils` 测试真实 `uiComponents/src/dialog/index.vue` 组件的渲染、props、slots、事件。

## TDD 测试计划

### RED → GREEN 用例

```
文件：test-harness/ui-components/dialog.test.ts
```

#### Dialog 组件渲染（vue-jest + @vue/test-utils）

| # | 用例 | 验证点 |
|---|------|--------|
| 1 | 默认 props 渲染 | 渲染 el-dialog，标题="标题"，visible=false |
| 2 | 自定义 label | `label="自定义"` → 标题区域显示 "自定义" |
| 3 | visible=true | 弹框可见 |
| 4 | 默认 slot 渲染 | `<div slot="default">内容</div>` → 渲染到 body |
| 5 | footer slot | 自定义 footer 渲染 |
| 6 | show 方法 | 调用 dialog.show() → visible=true |
| 7 | hide 方法 | 调用 dialog.hide() → visible=false |
| 8 | cancel 事件 | 点击取消按钮 → emit cancel / 调用 cancel() |
| 9 | submit 事件 | 点击确定按钮 → emit submit / 调用 submit() |
| 10 | setWidth | 调用 setWidth("50vw") → 宽度变化 |
| 11 | close 事件 | 关闭按钮 → emit update:visible |
| 12 | fullscreen | fullscreen=true → el-dialog fullscreen class |

#### 需要 mock

- `element-ui` → mock el-dialog 为简单 div 渲染
- `@uiComponents/dialog/payload` → 使用真实 Dialog 类（已有测试）

## 文件清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `test-harness/ui-components/dialog.test.ts` |
| 修改 | `test-harness/__mocks__/uiComponents.ts`（添加 element-ui mock） |

## 完成定义

- [ ] 12 个测试用例全部通过
- [ ] 使用 `shallowMount` 避免深层渲染 element-ui
- [ ] 验证 props、slots、事件、方法调用
- [ ] mock element-ui 不影响其他测试
