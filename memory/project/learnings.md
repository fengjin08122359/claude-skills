# 项目级经验教训

> 记录影响全局的踩坑经验和最佳实践。模块级经验见 `modules/[模块]/learnings.md`。

---

### LRN-P001 — 大文件重构：按功能模块拆分，不按技术层拆分

**来源：** gulp-publish 模块重构（frameManage.js 550行 → 多模块）
**适用场景：** 任何 >300行的单文件重构

**经验：**

✅ **推荐：按功能模块**
```
frames/
├── single-frame.js   # 单应用完整流程（配置+构建+复制+Git）
├── main-frame.js     # 主应用完整流程
├── micro-frame.js    # 微应用完整流程
```

❌ **不推荐：按技术层**
```
frames/
├── config-layer.js   # 所有配置逻辑
├── build-layer.js    # 所有构建逻辑
```

**原因：** 功能模块拆分使每个文件都有完整的业务语义，易于理解和测试；技术层拆分会导致修改一个功能需要跨多个文件。

---

### LRN-P002 — 重构时必须保持接口兼容

**来源：** gulp-publish 模块重构
**适用场景：** 任何对外暴露接口的模块重构

**经验：**

重构后入口文件的导出结构必须与原来完全一致：

```javascript
// 重构前后导出接口不变
module.exports = { microFrame, subContainer, ... };
```

**验证方式：**
```bash
node -e "const m = require('./frameManage.js'); console.log(Object.keys(m));"
```

**原因：** 调用方（其他 gulp 脚本、CI 配置）依赖现有接口，接口变更会导致连锁修改。

---

### LRN-P003 — 提取公共函数：识别重复模式，语义化命名

**来源：** gulp-publish 模块重构
**适用场景：** 多处重复代码模式

**经验：**

识别类似这样的重复模式：
```javascript
// 重复出现
const path = resolve(workspaceDir, `./${appName}`);
if (!existsSync(path)) { mkdirSync(path); } else { removeFiles(path); }
```

提取为语义清晰的函数：
```javascript
function cleanAndCreateDir(dirPath) {
  if (existsSync(dirPath)) removeFiles(dirPath);
  mkdirSync(dirPath);
}
```

**命名原则：**
- `cleanAndCreateDir` — 动词 + 结果
- `ensureDir` — 动词 + 状态
- `getWorkspaceAppPath` — 动词 + 对象

---

### LRN-P004 — 模块依赖管理：基础模块无依赖，功能模块单向依赖

**来源：** gulp-publish 模块重构
**适用场景：** 任何多模块系统

**经验：**

依赖关系必须是单向的：
```
config.js      → 无依赖（基础模块）
utils.js       → config（路径工具）
templates.js   → config, utils（文件操作）
single-frame   → config, utils（构建工具）
main-frame     → config, utils, templates（完整流程）
```

**原则：**
- 基础模块（config）无依赖
- 功能模块只依赖基础模块
- 禁止循环依赖
- 模块间通过函数接口通信，不直接访问内部状态
