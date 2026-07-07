# Report Standard Skill 使用示例

本文档演示如何使用 report-standard skill 生成规范的报告。

---

## 示例 1: 生成技术分析报告

### 场景
你刚刚完成了 Service 层重构，需要生成一份完成报告。

### 步骤

#### 1. 选择模板

从 SKILL.md 中复制"模板 1: 技术分析报告"

#### 2. 填充基本信息

```markdown
# Service 层重构完成报告

## 📊 执行摘要

**执行时间**: 2026-04-16  
**执行状态**: ✅ 完成  
**总耗时**: 2 小时 30 分钟  
**影响范围**: 
- `CombinationModule.ts`
- `ProjectData.ts`
- `useCombinationModule.ts`
```

#### 3. 添加问题发现

```markdown
## 🔍 问题分析

### 重构前的问题

#### 1. Class 职责混乱
**位置**: `CombinationModule.ts`  
**问题描述**: 
Class 同时包含数据结构和业务逻辑，违反单一职责原则

**当前代码**:
```typescript
class CombinationModule {
  // 数据属性
  id: number;
  slgName: string;
  
  // 业务逻辑 ❌
  async save() {
    await api.save(this);
  }
}
```

**建议修复**:
```typescript
// 数据模型
class CombinationModule {
  id: number;
  slgName: string;
}

// 业务逻辑移至 Service
class CombinationService {
  async save(module: CombinationModule) {
    await api.save(module);
  }
}
```

**影响**: 
- 难以单元测试
- 维护成本高
- 违反 SOLID 原则
```

#### 4. 添加改进成果

```markdown
## 📈 改进成果

### 代码质量指标

| 指标 | 改进前 | 改进后 | 提升 |
|------|--------|--------|------|
| Class 行数 | 250 | 80 | -68% |
| 可测试性 | 低 | 高 | ⭐⭐⭐⭐⭐ |
| 职责清晰度 | 混乱 | 清晰 | ⭐⭐⭐⭐⭐ |

### 具体收益
- ✅ 分离了数据模型和业务逻辑
- ✅ Service 层可独立单元测试
- ✅ 符合单一职责原则
- ✅ 代码更易维护和扩展
```

#### 5. 运行质量检查

```bash
bash scripts/check-report.sh service-refactor-report.md
```

输出：
```
🔍 开始检查报告: service-refactor-report.md

✅ 文件非空
✅ 包含 H1 标题
✅ 包含执行摘要
✅ 代码块格式正确
✅ 表格格式正确

✨ 检查完成！

📊 检查摘要:
  - 文件: service-refactor-report.md
  - 行数: 156
  - 字数: 1234
  - 大小: 8.5 KB
```

---

## 示例 2: 生成项目进度报告

### 场景
你完成了批次 6 的 Class 到 Hook 迁移任务。

### 步骤

#### 1. 选择模板

从 SKILL.md 中复制"模板 2: 项目进度报告"

#### 2. 填写执行摘要

```markdown
# 批次 6 - Class 到 Hook 迁移完成报告

## 📊 执行摘要

**开始时间**: 2026-04-10 09:00  
**完成时间**: 2026-04-10 15:30  
**总耗时**: 6.5 小时  
**完成度**: 100%  
**状态**: ✅ 成功完成
```

#### 3. 列出完成的工作

```markdown
## ✅ 完成的工作

### 主要成果

#### 1. HomeData Class 迁移
**描述**: 将 home-data.ts Class 转换为 useHomeData Hook  
**交付物**: 
- 📄 [useHomeData.ts](path/to/file)
- 📄 [BATCH_6_COMPLETE.md](path/to/report)

**关键指标**:
- 代码行数: +180 / -220
- 响应式状态: 12 个
- 方法数量: 8 个

#### 2. VirtualTree Class 迁移
**描述**: 将 virtual-tree.ts Class 转换为 useVirtualTree Hook  
**交付物**: 
- 📄 [useVirtualTree.ts](path/to/file)

**关键指标**:
- 代码行数: +150 / -180
- 性能优化: 虚拟滚动支持
```

#### 4. 添加统计数据

```markdown
## 📈 统计数据

### 代码变更

| 类型 | 数量 | 说明 |
|------|------|------|
| 新建 Hook | 2 | useHomeData, useVirtualTree |
| 修改引用 | 8 | 页面和组件 |
| 删除 Class | 2 | home-data.ts, virtual-tree.ts |
| 新增代码 | +330 行 | Hook 实现 |
| 删除代码 | -400 行 | Class 实现 |
| 净变化 | -70 行 | 代码更简洁 |

### 质量指标

- ✅ TypeScript 编译: 通过
- ✅ ESLint: 0 错误, 2 警告
- ✅ 功能测试: 全部通过
- ✅ 性能测试: 无退化
```

#### 5. 总结经验

```markdown
## 💡 经验总结

### 成功经验
1. 先分析依赖关系再开始迁移
2. 逐个文件迁移并立即测试
3. 保持向后兼容的过渡期

### 改进空间
1. 可以并行处理独立的 Class
2. 自动化测试覆盖不足
3. 文档可以更详细
```

---

## 示例 3: 生成性能分析报告

### 场景
你优化了首页加载性能，需要生成分析报告。

### 步骤

#### 1. 选择模板

从 SKILL.md 中复制"模板 3: 性能分析报告"

#### 2. 记录基准数据

```markdown
# 首页加载性能优化报告

## 📊 执行摘要

**分析时间**: 2026-04-15  
**测试环境**: Chrome 120, 4核 CPU, 8GB RAM  
**基准版本**: v1.2.3 (commit: abc123)  
**优化版本**: v1.3.0 (commit: def456)  
**整体提升**: -66%
```

#### 3. 识别性能瓶颈

```markdown
## 🔍 性能瓶颈识别

### 瓶颈 1: 大列表渲染
**位置**: `home/components/table.vue`  
**严重程度**: 🔴 严重  
**当前性能**: 1200ms (1000条数据)  
**目标性能**: <200ms

**问题分析**:
使用 Element UI 的 el-table 渲染全部 1000+ 条数据，
导致 DOM 节点过多，浏览器重排重绘开销巨大。

**优化方案**:
引入虚拟滚动，只渲染可视区域内的 ~20 条数据。
```

#### 4. 对比性能数据

```markdown
## 📈 性能对比

### 基准测试数据

| 测试项 | 优化前 | 优化后 | 提升 |
|--------|--------|--------|------|
| 首屏加载时间 | 3500ms | 1200ms | -66% |
| FCP (首次内容绘制) | 1800ms | 600ms | -67% |
| LCP (最大内容绘制) | 3200ms | 1100ms | -66% |
| TTI (可交互时间) | 4000ms | 1500ms | -63% |
| 初始内存占用 | 120MB | 65MB | -46% |

### 可视化对比

```
首屏加载时间:
优化前: ████████████████████████████████ 3500ms
优化后: ████████████ 1200ms (-66%)
```
```

#### 5. 详细说明优化措施

```markdown
## 🛠️ 优化措施

### 措施 1: 引入虚拟滚动
**实施内容**:

替换前:
```vue
<el-table :data="tableData" :height="600">
  <el-table-column prop="name" label="名称" />
</el-table>
```

替换后:
```vue
<el-table-v2 
  :data="tableData"
  :width="800"
  :height="600"
  :row-height="50"
>
  <el-table-v2-column field="name" title="名称" :width="400" />
</el-table-v2>
```

**效果**:
- 渲染时间: 1200ms → 180ms (-85%)
- DOM 节点: 1000+ → ~20
- 滚动 FPS: 35 → 60 (+71%)
```

---

## 示例 4: 使用检查脚本

### Bash (Linux/Mac)

```bash
# 赋予执行权限
chmod +x scripts/check-report.sh

# 检查报告
bash scripts/check-report.md my-report.md

# 批量检查
for file in reports/*.md; do
  bash scripts/check-report.sh "$file"
done
```

### PowerShell (Windows)

```powershell
# 检查单个报告
.\scripts\check-report.ps1 my-report.md

# 批量检查
Get-ChildItem reports\*.md | ForEach-Object {
  .\scripts\check-report.ps1 $_.FullName
}
```

### 检查输出示例

```
🔍 开始检查报告: my-report.md

✅ 文件非空 (8724 bytes)
✅ 包含 H1 标题
✅ 包含执行摘要
✅ 代码块格式正确
✅ 表格格式正确

✨ 检查完成！

📊 检查摘要:
  - 文件: my-report.md
  - 行数: 234
  - 字数: 1856
  - 大小: 8.52 KB
```

---

## 示例 5: 自定义报告样式

### 添加公司 Logo

在报告顶部添加：

```markdown
<div align="center">

![Company Logo](path/to/logo.png)

# 报告标题

</div>
```

### 使用品牌色

```markdown
<span style="color: #1890ff">**重要提示**</span>

> ⚠️ <span style="color: #faad14">这是警告信息</span>
```

### 添加页眉页脚

```markdown
---
**文档编号**: RPT-2026-001  
**版本号**: v1.0  
**保密级别**: 内部公开  
---

# 报告正文

...

---
**第 1 页 / 共 5 页**  
**生成时间**: 2026-04-16  
---
```

---

## 常见问题

### Q1: 如何选择正确的模板？

**A**: 根据报告目的选择：
- **技术分析**: 代码审查、重构、问题诊断
- **项目进度**: 任务完成、阶段总结
- **性能分析**: 性能优化、瓶颈分析

如果不确定，使用"技术分析报告"模板，它最通用。

### Q2: 报告应该多长？

**A**: 没有固定长度要求，但建议：
- **执行摘要**: 50-100 字
- **每个问题**: 100-200 字
- **总长度**: 通常 500-2000 字

关键是信息密度，不是字数。

### Q3: 必须使用 emoji 吗？

**A**: 不是必须的，但推荐使用：
- 增强可读性
- 快速识别章节类型
- 使报告更生动

如果不喜欢，可以移除或替换为其他符号。

### Q4: 如何导出为 PDF？

**A**: 有多种方式：

**VS Code**:
1. 安装 "Markdown PDF" 扩展
2. 右键 → "Export to PDF"

**命令行**:
```bash
npm install -g markdown-pdf
markdown-pdf report.md
```

**在线工具**:
- Dillinger.io
- StackEdit.io

### Q5: 可以混合使用多个模板吗？

**A**: 可以！根据实际情况组合：

```markdown
# 综合报告

## 📊 执行摘要
[来自任意模板]

## 🔍 技术分析
[来自技术分析报告模板]

## 📈 进度统计
[来自项目进度报告模板]

## 💡 性能优化
[来自性能分析报告模板]
```

---

## 最佳实践总结

### ✅ 应该做的

1. **先写摘要**: 让读者快速了解核心内容
2. **使用数据**: 用具体数字支撑观点
3. **提供方案**: 每个问题都配解决方案
4. **保持一致**: 术语、格式、风格统一
5. **定期更新**: 保持报告时效性

### ❌ 不应该做的

1. **避免冗长**: 段落不超过 5 行
2. **避免主观**: 用事实说话，不情绪化
3. **避免跳跃**: 标题层级要连续
4. **避免模糊**: 不说"可能"、"大概"
5. **避免过时**: 及时更新过期信息

---

**最后更新**: 2026-04-16  
**版本**: 1.0.0
