# 阶段2：代码重构执行

## 输入来源

**来自阶段0：** 影响范围分析报告中的链路（文件列表、修改顺序）
**来自阶段1：** 用户确认的需求细节和澄清问题答案

---

## 步骤1：文件拆分分析

基于阶段0的链路分析，**重新整理**执行计划，而非简单拷贝。

### 1.1 列出待重构文件

```markdown
## 📂 待重构文件列表

| 文件 | 重构原因 | 当前问题 |
|-----|---------|---------|
| [fileA.ts] | 代码过长 | 混合了数据处理和UI逻辑，难以维护 |
| [fileB.ts] | 职责不清 | 包含多个不相关功能，耦合度高 |
| [fileC.ts] | 重复代码 | 与fileA存在相似逻辑，需要统一 |
```

### 1.2 拆分文件块

逐文件分析，识别可独立拆分的代码块：

```markdown
## 🔧 文件拆分分析

### fileA.ts（当前：500行）

**块1：数据处理（80行，L1-80）**
- 功能：数据格式转换、校验
- 拆分目标：独立为 `utils/dataProcessor.ts`
- 依赖：无外部依赖，可独立

**块2：API调用（120行，L81-200）**
- 功能：接口请求、响应处理
- 拆分目标：独立为 `services/dataService.ts`
- 依赖：依赖块1的数据格式

**块3：UI组件（300行，L201-500）**
- 功能：渲染逻辑、事件处理
- 拆分目标：保留在原文件，精简后约150行
- 依赖：依赖块1、块2

### fileB.ts（当前：300行）

**块1：状态管理（100行，L1-100）**
- 拆分目标：独立为 `stores/xxxStore.ts`

**块2：工具函数（80行，L101-180）**
- 拆分目标：合并到现有 `utils/common.ts`
```

### 1.3 给出新增文件列表

对应拆分块，列出需要新建的文件：

```markdown
## 📝 新增文件列表

| 新文件 | 来源块 | 内容说明 | 依赖 |
|-------|-------|---------|-----|
| [utils/dataProcessor.ts] | fileA.ts块1 | 数据处理函数 | 无 |
| [services/dataService.ts] | fileA.ts块2 | API调用封装 | dataProcessor |
| [stores/xxxStore.ts] | fileB.ts块1 | 状态管理 | dataService |

**执行顺序（按依赖）：**
utils/dataProcessor.ts → services/dataService.ts → stores/xxxStore.ts → fileA.ts(精简) → fileB.ts(精简)
```

---

## 步骤2：结构优化（创建+迁移）

### 2.1 创建骨架文件

按依赖顺序创建新文件，先写骨架（导入声明、函数签名、空实现）：

```typescript
// utils/dataProcessor.ts - 骨架
import type { RawData, ProcessedData } from '../types';

export function formatData(raw: RawData): ProcessedData {
  // TODO: 迁移fileA.ts块1的实现
}

export function validateData(data: ProcessedData): boolean {
  // TODO: 迁移fileA.ts块1的实现
}
```

### 2.2 迁移代码块

逐块迁移，保持代码原样（不做逻辑修改）：

**迁移规则：**
- 复制原代码到新文件
- 调整导入路径（指向新位置）
- 更新导出（函数/类型）
- 原文件标记删除位置（用注释标记，暂不删除）

```markdown
## 📦 迁移执行记录

**迁移块：** fileA.ts块1 → utils/dataProcessor.ts

| 原位置 | 新位置 | 操作 |
|-------|-------|-----|
| L1-80 | dataProcessor.ts L1-80 | 复制函数formatData、validateData |
| 导入lodash | 导入lodash（路径不变） | 无需调整 |
| 内部调用processRow | → formatData内调用 | 无变化 |

**原文件标记：**
```typescript
// fileA.ts
// 🔴 已迁移至 utils/dataProcessor.ts
// import { formatData, validateData } from './utils/dataProcessor';
```
```

### 2.3 验证结构完整性

每完成一个文件迁移后验证：

- TypeScript编译通过（类型正确）
- 导入路径正确（无循环依赖）
- 项目可构建（无缺失文件）

**注意：此阶段允许编译警告，逻辑问题在步骤3修复**

---

## 步骤3：逻辑优化（修复迁移问题）

### 3.1 修复导入依赖

更新所有调用方的导入路径：

```typescript
// fileA.ts - 更新导入
import { formatData, validateData } from './utils/dataProcessor';

// 删除已迁移的代码块（移除 🔴 标记区域）
```

### 3.2 修复迁移引发的问题

迁移后常见问题：

| 问题类型 | 修复方法 |
|---------|---------|
| 类型引用缺失 | 添加类型导入或定义 |
| 循环依赖 | 调整导入顺序或提取公共类型 |
| this指向变化 | 调整函数调用方式或绑定context |
| 私有方法暴露 | 调整为export或保持private |
| 副作用丢失 | 检查并补充必要的副作用代码 |

### 3.3 优化拆分后的代码

对拆分后的每个文件进行针对性优化：

```markdown
## 🎯 代码优化清单

### utils/dataProcessor.ts
- [ ] 简化validateData条件判断
- [ ] 补充边界情况处理
- [ ] 添加类型注释

### services/dataService.ts
- [ ] 统一错误处理格式
- [ ] 补充请求超时处理

### fileA.ts（精简后）
- [ ] 移除冗余导入
- [ ] 简化组件逻辑
```

### 3.4 同步测试文件

按拆分结果同步测试：

| 原测试文件 | 操作 |
|----------|-----|
| fileA.test.ts | 拆分 → dataProcessor.test.ts + fileA.test.ts |
| fileB.test.ts | 拆分 → xxxStore.test.ts + fileB.test.ts |

---

## 验证清单

**步骤1完成？**
- [ ] 文件拆分分析输出
- [ ] 新增文件列表确定
- [ ] 执行顺序确定

**步骤2完成？**
- [ ] 新文件创建完成
- [ ] 代码块迁移完成
- [ ] TypeScript编译通过

**步骤3完成？**
- [ ] 导入依赖修复完成
- [ ] 迁移问题修复完成
- [ ] 代码优化完成
- [ ] 测试同步完成
- [ ] 所有测试通过

---

## 重构陷阱提醒

| 陷阱 | 正确做法 |
|-----|---------|
| 未分析直接拆分 | 步骤1必须输出拆分分析，明确每个块的去向 |
| 迁移时顺便改逻辑 | 步骤2只迁移不改逻辑，逻辑问题在步骤3修复 |
| 遗漏迁移副作用 | 检查是否有隐式执行的代码（如初始化、注册） |
| 循环依赖未处理 | 迁移后立即检查import，发现循环依赖立即调整 |
| 测试未同步拆分 | 原测试必须拆分对应新文件，否则覆盖率下降 |

---

## 输出要求

**三个步骤全部完成后输出：**

```markdown
## ✅ 阶段2完成：代码重构

**执行摘要：**
- 拆分文件：X个 → Y个新文件
- 精简文件：Z个原文件
- 测试状态：全部通过

**变更记录：**
| 操作 | 文件 | 说明 |
|-----|-----|-----|
| 新增 | [newFile.ts] | 来源fileA.ts块1 |
| 精简 | [fileA.ts] | 500行→150行 |
| 拆分 | [fileA.test.ts] | → dataProcessor.test.ts |

进入阶段3：总结
```