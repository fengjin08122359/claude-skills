# Micro App Route Config Skill

## 功能说明

自动生成和配置微前端子应用的路由信息，确保符合主应用采集规范。

## 核心能力

### 1. 路由配置生成

```typescript
interface RouteConfig {
  path: string;              // 路由路径
  name?: string;             // 路由名称
  component: string;         // 组件路径（异步引用）
  meta?: {
    title: string;           // 页面标题
    permission?: string;     // 权限标识
    icon?: string;           // 菜单图标
    keepAlive?: boolean;     // 是否缓存
  };
  children?: RouteConfig[];  // 子路由
}

// 示例：生成债券详情页路由
await generateRoute({
  path: '/bond/:code',
  name: 'BondDetail',
  component: '@/pages/bond/detail/index.vue',
  meta: {
    title: '债券详情',
    permission: 'bond.view',
    icon: 'icon-bond',
    keepAlive: true
  }
});
```

**自动生成：**
- 路由配置文件（src/router/data.ts）
- 组件异步引用代码
- TypeScript 类型定义
- 权限配置项

### 2. 异步组件引用

```typescript
// ❌ 错误写法 - 同步引用
import BondDetail from '@/pages/bond/detail/index.vue'

// ✅ 正确写法 - 异步引用
const BondDetail = () => import(/* webpackChunkName: "bond-detail" */ '@/pages/bond/detail/index.vue')

// 技能自动生成
generateAsyncComponent('@/pages/bond/detail/index.vue', {
  chunkName: 'bond-detail',
  prefetch: true
})
```

**优化选项：**
- Webpack Chunk 命名
- 预加载（prefetch）
- 预取（preload）
- 错误处理

### 3. App.json 生成

运行 `npm run prepared` 时自动采集路由和权限信息：

```json
{
  "name": "app-bond",
  "version": "1.0.76",
  "routes": [
    {
      "path": "/bond/:code",
      "name": "BondDetail",
      "meta": {
        "title": "债券详情",
        "permission": "bond.view"
      }
    }
  ],
  "permissions": [
    {
      "id": "bond.view",
      "name": "债券查看",
      "type": "menu"
    }
  ]
}
```

**主应用采集流程：**
1. 子应用运行 `npm run prepared`
2. 生成 src/app.json
3. 主应用运行 `npm run analyse`
4. 采集并合并到主应用配置

### 4. 权限配置

```typescript
interface PermissionConfig {
  id: string;                // 权限 ID
  name: string;              // 权限名称
  type: 'menu' | 'button' | 'api';  // 权限类型
  parent?: string;           // 父级权限 ID
  order?: number;            // 排序
}

// 示例：配置权限
await configurePermission({
  id: 'bond.export',
  name: '债券数据导出',
  type: 'button',
  parent: 'bond.view',
  order: 2
});
```

**权限层级：**
```
bond (债券模块)
├── bond.view (查看)
│   ├── bond.export (导出)
│   └── bond.print (打印)
└── bond.edit (编辑)
    └── bond.delete (删除)
```

### 5. 路由校验

```typescript
interface RouteValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// 校验路由配置
const result = await validateRoutes();
/*
返回示例：
{
  valid: false,
  errors: [
    '路由 /bond/:code 使用了同步组件引用',
    '缺少权限配置 bond.view'
  ],
  warnings: [
    '路由名称 BondDetail 不符合 PascalCase 规范'
  ],
  suggestions: [
    '建议添加 webpackChunkName 注释优化代码分割'
  ]
}
*/
```

**校验规则：**
- ✅ 组件必须异步引用
- ✅ 权限配置完整性
- ✅ 路由命名规范
- ✅ Meta 信息完整性
- ✅ 路径参数格式

### 6. 菜单配置生成

```typescript
interface MenuConfig {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  permission?: string;
  children?: MenuConfig[];
  order?: number;
}

// 生成二级菜单配置
await generateMenu([
  {
    id: 'bond-analysis',
    title: '债券分析',
    icon: 'icon-bond',
    children: [
      {
        id: 'bond-list',
        title: '债券列表',
        path: '/bond/list',
        permission: 'bond.list'
      },
      {
        id: 'bond-detail',
        title: '债券详情',
        path: '/bond/:code',
        permission: 'bond.view'
      }
    ]
  }
]);
```

**输出文件：**
- scripts/navMenu/menu.csv（二三级菜单）
- scripts/tabList/map.csv（一级菜单）

### 7. 路由守卫集成

```typescript
// 自动生成路由守卫代码
generateRouteGuard({
  requireAuth: true,
  permission: 'bond.view',
  beforeEnter: (to, from, next) => {
    // 自定义逻辑
    if (!hasPermission('bond.view')) {
      next('/403');
    } else {
      next();
    }
  }
});
```

**生成的代码：**
```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!store.getters.isAuthenticated) {
      next('/login');
      return;
    }
    
    if (to.meta.permission && !hasPermission(to.meta.permission)) {
      next('/403');
      return;
    }
  }
  next();
});
```

### 8. 路由采集中间件

```typescript
// 在主应用中运行的中间件
const routeCollector = {
  async blockBefore(ctx, next) {
    // 采集子应用路由信息
    const subAppRoutes = await fetchSubAppRoutes();
    ctx.subAppRoutes = subAppRoutes;
    await next();
  },
  
  async blockExec(ctx, next) {
    // 注册子应用路由
    registerSubAppRoutes(ctx.subAppRoutes);
    await next();
  }
};
```

## 典型工作流

### 工作流 1：添加新页面

```typescript
// 1. 创建页面组件
createPage({
  path: '@/pages/bond/analysis/index.vue',
  template: 'page-template'
});

// 2. 生成路由配置
await generateRoute({
  path: '/bond/analysis',
  name: 'BondAnalysis',
  component: '@/pages/bond/analysis/index.vue',
  meta: {
    title: '债券分析',
    permission: 'bond.analysis',
    keepAlive: true
  }
});

// 3. 添加权限配置
await configurePermission({
  id: 'bond.analysis',
  name: '债券分析',
  type: 'menu'
});

// 4. 更新菜单配置
await updateMenu([{
  id: 'bond-analysis',
  title: '债券分析',
  path: '/bond/analysis'
}]);

// 5. 运行 prepared 生成 app.json
await runPrepared();

// 6. 主应用采集
await mainAppAnalyse();
```

### 工作流 2：路由重构

```typescript
// 1. 导出当前路由配置
const routes = await exportRoutes();

// 2. 批量修改路径
const updatedRoutes = routes.map(route => ({
  ...route,
  path: route.path.replace('/old/', '/new/')
}));

// 3. 校验修改后的配置
const validation = await validateRoutes(updatedRoutes);
if (!validation.valid) {
  console.error('校验失败:', validation.errors);
  return;
}

// 4. 应用修改
await applyRoutes(updatedRoutes);

// 5. 重新生成 app.json
await runPrepared();
```

### 工作流 3：权限审计

```typescript
// 1. 导出所有权限配置
const permissions = await exportPermissions();

// 2. 检查未使用的权限
const unusedPermissions = permissions.filter(p => {
  return !isPermissionUsed(p.id);
});

// 3. 检查缺失的权限
const missingPermissions = getAllRoutes().filter(r => {
  return r.meta?.requireAuth && !r.meta?.permission;
});

// 4. 生成审计报告
generateAuditReport({
  unused: unusedPermissions,
  missing: missingPermissions,
  suggestions: [
    '建议为所有需要认证的路由配置 permission',
    '清理未使用的权限配置'
  ]
});
```

## API 参考

### generateRoute(config)

生成路由配置

**参数：**
- `config.path` (string): 路由路径
- `config.name` (string, optional): 路由名称
- `config.component` (string): 组件路径
- `config.meta` (object, optional): 元信息
- `config.children` (array, optional): 子路由

**返回：** Promise<RouteConfig>

### generateAsyncComponent(path, options)

生成异步组件引用

**参数：**
- `path` (string): 组件路径
- `options.chunkName` (string, optional): Webpack chunk 名称
- `options.prefetch` (boolean, optional): 是否预加载
- `options.preload` (boolean, optional): 是否预取

**返回：** string (组件代码)

### configurePermission(config)

配置权限

**参数：**
- `config.id` (string): 权限 ID
- `config.name` (string): 权限名称
- `config.type` ('menu' | 'button' | 'api'): 权限类型
- `config.parent` (string, optional): 父级权限 ID
- `config.order` (number, optional): 排序

**返回：** Promise<PermissionConfig>

### validateRoutes(routes?)

校验路由配置

**参数：**
- `routes` (array, optional): 路由配置数组（不传则校验当前配置）

**返回：** Promise<RouteValidationResult>

### runPrepared()

运行 prepared 脚本生成 app.json

**返回：** Promise<void>

### mainAppAnalyse()

主应用采集子应用信息

**返回：** Promise<void>

## 配置文件

### router/data.ts

```typescript
export default [
  {
    path: '/bond',
    name: 'Bond',
    component: () => import('@/pages/bond/index.vue'),
    redirect: '/bond/list',
    children: [
      {
        path: 'list',
        name: 'BondList',
        component: () => import('@/pages/bond/list/index.vue'),
        meta: {
          title: '债券列表',
          permission: 'bond.list'
        }
      },
      {
        path: ':code',
        name: 'BondDetail',
        component: () => import('@/pages/bond/detail/index.vue'),
        meta: {
          title: '债券详情',
          permission: 'bond.view',
          keepAlive: true
        }
      }
    ]
  }
];
```

### app.json（生成后）

```json
{
  "name": "app-bond",
  "version": "1.0.76",
  "routes": [
    {
      "path": "/bond",
      "name": "Bond",
      "children": [
        {
          "path": "list",
          "name": "BondList",
          "meta": {
            "title": "债券列表",
            "permission": "bond.list"
          }
        },
        {
          "path": ":code",
          "name": "BondDetail",
          "meta": {
            "title": "债券详情",
            "permission": "bond.view"
          }
        }
      ]
    }
  ],
  "permissions": [
    {
      "id": "bond.list",
      "name": "债券列表",
      "type": "menu"
    },
    {
      "id": "bond.view",
      "name": "债券查看",
      "type": "menu"
    }
  ]
}
```

## 注意事项

1. **组件异步引用**：路由中的组件必须使用异步引用，不能使用同步 import
2. **权限配置**：需要认证的页面必须配置 permission
3. **Meta 信息**：建议完整配置 title、icon、keepAlive 等元信息
4. **路径参数**：动态参数使用 `:paramName` 格式
5. **重定向**：父路由建议使用 redirect 指定默认子路由
6. **命名规范**：路由名称使用 PascalCase，路径使用 kebab-case
7. **Webpack Chunk**：建议添加注释优化代码分割
8. **主应用采集**：修改路由后必须运行 `npm run prepared`

## 常见问题

### 问题 1：主应用无法采集到路由

**原因：**
- 未运行 `npm run prepared`
- app.json 文件格式错误
- 路由配置不是默认导出

**解决：**
```bash
# 重新生成 app.json
npm run prepared

# 主应用采集
cd ../iframe-saas
npm run analyse
```

### 问题 2：路由跳转 404

**原因：**
- 主应用未注册该路由
- 路径不匹配
- 权限不足

**解决：**
1. 检查 app.json 中是否存在该路由
2. 确认主应用已运行 analyse
3. 检查用户权限配置

### 问题 3：组件加载失败

**原因：**
- 组件路径错误
- Webpack chunk 命名冲突
- 网络问题

**解决：**
```bash
# 检查组件路径
find src -name "*.vue" | grep <component-name>

# 清理缓存重新构建
npm run build
```

## 相关文档

- [路由调用](../../dev/doc/路由调用.md)
- [应用文档](../../dev/doc/应用文档.md#路由)
- [目录结构](../../dev/doc/目录结构.md#srcrouter--路由信息)
