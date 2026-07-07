# 开发顾问 - 快速参考

## 🚀 快速开始

当需要开发指导时，直接描述你的需求，助手会自动进入问答流程。

**示例触发词：**
- "我想创建一个..."
- "如何实现..."
- "帮我看看这段代码"
- "应该用 A 还是 B？"
- "这个 bug 怎么修复？"

---

## 📋 四种交互模式

### 1️⃣ 新功能开发
```
需求澄清 → 方案对比 → 分步实施 → 代码审查
```

### 2️⃣ Bug 修复
```
问题描述 → 复现步骤 → 根因分析 → 修复方案 → 验证测试
```

### 3️⃣ 代码重构
```
重构目标 → 影响评估 → 重构策略 → 逐步执行 → 回归测试
```

### 4️⃣ 技术选型
```
需求背景 → 候选方案 → 对比分析 → 决策建议 → 迁移计划
```

---

## ❓ 需求澄清清单

开始任何任务前，确保明确：

- [ ] **目标**: 要实现什么功能？
- [ ] **技术栈**: 使用什么框架/库？
- [ ] **约束**: 性能、兼容性、时间限制？
- [ ] **优先级**: 速度 vs 质量 vs 可维护性？

---

## 💡 方案对比模板

提供方案时使用此格式：

```markdown
### 方案 A: [名称]
✅ 优点: ...
❌ 缺点: ...
🎯 适用: ...

### 方案 B: [名称]
✅ 优点: ...
❌ 缺点: ...
🎯 适用: ...

**推荐:** 方案 X，因为...
```

---

## ✅ 代码审查清单

### Critical (必须修复)
- [ ] TypeScript 类型定义完整
- [ ] 错误处理完善 (try-catch)
- [ ] 无内存泄漏风险
- [ ] 安全性检查 (XSS、SQL注入)

### Suggestion (建议改进)
- [ ] 命名符合规范
- [ ] 函数单一职责
- [ ] 无硬编码魔法值
- [ ] 有必要的注释

### Nice to have (可选优化)
- [ ] 性能优化点
- [ ] 代码复用机会
- [ ] 更好的用户体验

---

## 🔧 常用命令速查

```bash
# 类型检查
pnpm vue-tsc --noEmit

# ESLint 修复
pnpm eslint --fix src/

# 运行测试
pnpm test

# 构建验证
pnpm build

# 安装依赖
pnpm i --shamefully-hoist

# 切换项目
gulp project-change

# 构建工作区
gulp workspaces-build
```

---

## 📁 项目结构速览

```
monorepo/
├── packages/          # 共享包
│   ├── hsComponent/
│   ├── module/
│   ├── uiComponents/
│   └── utils/
├── workspaces/        # 子应用
│   ├── app-*         # 标准版子应用
│   ├── iframe-*      # 主应用
│   └── independent-* # 独立应用
├── dev/              # 客户项目
└── AGENTS.md         # 完整文档
```

---

## 🎯 Vue 组件最佳实践

### ✅ 推荐写法
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'

const userList = ref<User[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res = await userApi.getList()
    userList.value = res.list
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
```

### ❌ 避免写法
```vue
<script>
export default {
  data() {
    return {
      userList: [], // 缺少类型
      loading: false
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      const res = await userApi.getList()
      this.userList = res.list // 无错误处理
      this.loading = false
    }
  }
}
</script>
```

---

## 🔍 常见问题诊断

### 问题: 组件不渲染
**检查:**
1. 路由配置是否正确？
2. 组件是否正确注册？
3. 控制台是否有报错？
4. Props 传递是否正确？

### 问题: API 请求失败
**检查:**
1. 接口地址是否正确？
2. 请求参数格式是否正确？
3. 是否有 CORS 问题？
4. Token 是否有效？

### 问题: TypeScript 报错
**检查:**
1. 类型定义是否完整？
2. 导入路径是否正确？
3. 是否需要类型断言？
4. 泛型使用是否正确？

---

## 📚 资源链接

- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 手册](https://www.typescriptlang.org/zh/docs/)
- [Element UI](https://element.eleme.cn/)
- [项目 AGENTS.md](../../AGENTS.md)

---

## 💬 对话技巧

### 好的提问方式
✅ "我想创建一个用户列表页，需要支持搜索和分页，用 Element UI，API 是 GET /api/users"

❌ "帮我做个页面"

### 提供足够上下文
✅ "这是报错信息: TypeError: Cannot read properties of undefined。相关代码是..."

❌ "报错了，怎么办？"

### 明确期望输出
✅ "请提供完整的组件代码，包括 TypeScript 类型定义和错误处理"

❌ "给我代码"

---

**记住**: 这个技能的核心是**交互式引导**，不是直接给答案。通过问答帮助你理清思路、做出最佳决策。
