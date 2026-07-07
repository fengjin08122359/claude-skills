# TypeScript Type Generator Skill

## 功能说明

为组件、API 和数据结构生成 TypeScript 类型定义，提升代码质量和开发体验。

## 核心能力

### 1. 组件 Props 类型生成

```typescript
// 根据组件用法自动生成 Props 类型
interface BondDetailProps {
  bondCode: string;          // 债券代码
  bondType?: 'credit' | 'rate';  // 债券类型
  showAnalysis?: boolean;    // 是否显示分析
  onBondChange?: (code: string) => void;  // 债券变化回调
}

// 技能自动生成
generateComponentTypes('BondDetail', {
  props: {
    bondCode: { type: String, required: true },
    bondType: { type: String as PropType<'credit' | 'rate'> },
    showAnalysis: { type: Boolean, default: false },
    onBondChange: Function as PropType<(code: string) => void>
  }
});
```

**生成的代码：**
```typescript
// types/components/bond.d.ts
export interface BondDetailProps {
  bondCode: string;
  bondType?: 'credit' | 'rate';
  showAnalysis?: boolean;
  onBondChange?: (code: string) => void;
}

declare const BondDetail: Vue.ComponentOptions<
  Vue,
  {},
  {},
  {},
  BondDetailProps
>;
```

### 2. API 响应类型生成

```typescript
// 从接口定义生成类型
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

interface BondInfo {
  bondCode: string;
  bondName: string;
  issueDate: string;
  maturityDate: string;
  couponRate: number;
  bondType: string;
}

// 自动生成 API 类型
generateApiTypes({
  endpoint: '/api/bond/detail',
  response: 'BondInfo',
  params: {
    code: 'string'
  }
});
```

**生成的类型：**
```typescript
// types/api/bond.d.ts
export namespace BondAPI {
  export interface DetailParams {
    code: string;
  }
  
  export interface DetailResponse extends ApiResponse<BondInfo> {}
  
  export interface BondInfo {
    bondCode: string;
    bondName: string;
    issueDate: string;
    maturityDate: string;
    couponRate: number;
    bondType: string;
  }
}
```

### 3. Vuex Store 类型安全包装

```typescript
// 为 Vuex store 生成类型安全的包装器
interface RootState {
  user: UserInfo;
  bond: BondState;
  loading: boolean;
}

interface BondState {
  currentBond: BondInfo | null;
  bondList: BondInfo[];
  isLoading: boolean;
}

// 生成类型安全的 helper
generateStoreHelpers('bond', {
  state: 'BondState',
  getters: {
    currentBond: 'BondInfo | null',
    bondList: 'BondInfo[]'
  },
  actions: {
    fetchBond: '(code: string) => Promise<void>',
    clearBond: '() => void'
  },
  mutations: {
    setBond: '(state, bond: BondInfo) => void',
    clearBond: '(state) => void'
  }
});
```

**生成的辅助函数：**
```typescript
// store/helpers/bond.ts
import { createNamespacedHelpers } from 'vuex-class';

export const useBondStore = createNamespacedHelpers('bond');

export function useCurrentBond() {
  const currentBond = useBondStore().getter('currentBond');
  return computed(() => currentBond.value as Ref<BondInfo | null>);
}

export function useBondActions() {
  const { actions } = useBondStore();
  return {
    fetchBond: actions.fetchBond as (code: string) => Promise<void>,
    clearBond: actions.clearBond as () => Promise<void>
  };
}
```

### 4. JSON Schema 转 TypeScript

```typescript
// JSON Schema 定义
const bondSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    bondCode: { type: 'string' },
    bondName: { type: 'string' },
    couponRate: { type: 'number', minimum: 0 },
    issueDate: { type: 'string', format: 'date' },
    riskLevel: { 
      type: 'string', 
      enum: ['low', 'medium', 'high'] 
    }
  },
  required: ['bondCode', 'bondName']
};

// 转换为 TypeScript 类型
const types = jsonSchemaToTypes(bondSchema);
```

**生成的类型：**
```typescript
export interface Bond {
  bondCode: string;
  bondName: string;
  couponRate?: number;
  issueDate?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

// 带验证的类型守卫
export function isBond(obj: unknown): obj is Bond {
  if (!obj || typeof obj !== 'object') return false;
  if (!('bondCode' in obj) || typeof obj.bondCode !== 'string') return false;
  if (!('bondName' in obj) || typeof obj.bondName !== 'string') return false;
  // ... 其他验证
  return true;
}
```

### 5. 表单配置类型

```typescript
// 表单配置类型生成
interface FormConfig {
  formItems: FormItem[];
  layout: 'horizontal' | 'vertical' | 'inline';
  labelWidth?: number;
  rules?: FormRules;
}

interface FormItem {
  field: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'cascader';
  props?: Record<string, any>;
  rules?: Array<{
    required?: boolean;
    pattern?: RegExp;
    message?: string;
  }>;
}

// 生成类型安全的表单配置
generateFormTypes('BondSearchForm', {
  fields: {
    bondCode: { type: 'input', label: '债券代码' },
    bondType: { 
      type: 'select', 
      label: '债券类型',
      options: [
        { label: '信用债', value: 'credit' },
        { label: '利率债', value: 'rate' }
      ]
    },
    issueDateRange: { 
      type: 'date', 
      label: '发行日期范围',
      isRange: true
    }
  },
  rules: {
    bondCode: [{ required: true, message: '请输入债券代码' }]
  }
});
```

### 6. 表格列配置类型

```typescript
// 表格列配置类型
interface TableColumn<T = any> {
  prop: keyof T;
  label: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean | 'custom';
  formatter?: (row: T, column: TableColumn<T>, cellValue: any) => string;
  render?: (h: CreateElement, params: RenderParams<T>) => VNode;
}

// 生成类型安全的表格配置
generateTableColumns('BondList', {
  columns: [
    { prop: 'bondCode', label: '债券代码', width: 120 },
    { 
      prop: 'bondName', 
      label: '债券名称',
      formatter: (row) => `${row.bondName} (${row.bondCode})`
    },
    { 
      prop: 'couponRate', 
      label: '票面利率',
      formatter: (row) => `${(row.couponRate * 100).toFixed(2)}%`
    }
  ]
});
```

### 7. 事件总线类型

```typescript
// 定义全局事件类型
interface AppEvents {
  'bond:update': (code: string) => void;
  'user:login': (userInfo: UserInfo) => void;
  'theme:change': (theme: 'light' | 'dark') => void;
  'nav:jump': (path: string, query?: Record<string, any>) => void;
}

// 生成类型安全的事件总线
generateEventBusTypes<AppEvents>();
```

**使用示例：**
```typescript
// 发送事件（类型安全）
eventBus.emit('bond:update', '123456');  // ✅
eventBus.emit('bond:update', 123456);    // ❌ 类型错误

// 监听事件（类型安全）
eventBus.on('bond:update', (code: string) => {
  console.log('债券更新:', code);
});
```

### 8. 路由参数类型

```typescript
// 从路由配置生成类型
interface RouteParams {
  '/bond/:code': { code: string };
  '/user/:id': { id: number };
  '/search': { 
    keyword?: string; 
    type?: 'bond' | 'stock';
    page?: number;
  };
}

// 生成类型安全的路由跳转
generateRouteHelpers<RouteParams>();
```

**使用示例：**
```typescript
// 类型安全的路由跳转
router.push({
  path: '/bond/123456',
  params: { code: '123456' }  // ✅
});

router.push({
  path: '/search',
  query: { 
    keyword: '国债',
    type: 'bond',
    page: 1
  }  // ✅
});
```

## 典型工作流

### 工作流 1：创建新组件的类型定义

```typescript
// 1. 定义组件 Props
const componentDef = {
  name: 'BondChart',
  props: {
    bondData: { type: Object as PropType<BondData>, required: true },
    chartType: { type: String as PropType<'line' | 'bar'>, default: 'line' },
    showLegend: { type: Boolean, default: true }
  }
};

// 2. 生成类型定义
await generateComponentTypes(componentDef.name, componentDef);

// 3. 在组件中导入类型
import type { BondChartProps } from '@/types/components/bond';

// 4. 使用类型约束组件
export default defineComponent<BondChartProps>({
  name: 'BondChart',
  props: {
    bondData: { type: Object, required: true },
    chartType: { type: String, default: 'line' },
    showLegend: { type: Boolean, default: true }
  },
  setup(props) {
    // props 具有完整的类型推断
    console.log(props.bondData.code);  // ✅
    return {};
  }
});
```

### 工作流 2：API 接口类型化

```typescript
// 1. 定义 API 接口描述
const apiDesc = {
  endpoint: '/api/bond/list',
  method: 'POST',
  params: {
    page: 'number',
    size: 'number',
    filters: 'BondFilters'
  },
  response: 'PaginatedResponse<BondInfo[]>'
};

// 2. 生成类型
await generateApiTypes(apiDesc);

// 3. 使用类型化的 API 调用
async function fetchBondList(params: BondAPI.ListParams) {
  const response = await http.post<BondAPI.ListResponse>(
    '/api/bond/list',
    params
  );
  return response.data;  // 类型：PaginatedResponse<BondInfo[]>
}
```

### 工作流 3：Vuex 模块化类型

```typescript
// 1. 定义模块状态
const moduleDef = {
  name: 'bond',
  state: {
    list: [] as BondInfo[],
    current: null as BondInfo | null,
    loading: false
  },
  getters: {
    bondCount: (state) => state.list.length,
    hasCurrent: (state) => !!state.current
  },
  actions: {
    async fetchList({ commit }, params: ListParams) {
      const data = await api.getBondList(params);
      commit('setList', data);
    }
  }
};

// 2. 生成模块类型
await generateStoreModuleTypes(moduleDef);

// 3. 在组件中使用
export default defineComponent({
  setup() {
    const store = useStore();
    
    // 类型安全的访问
    const bondList = computed(() => store.state.bond.list);  // BondInfo[]
    const bondCount = computed(() => store.getters['bond/bondCount']);  // number
    
    // 类型安全的 dispatch
    const fetchList = (params: ListParams) => {
      return store.dispatch('bond/fetchList', params);
    };
    
    return { bondList, bondCount, fetchList };
  }
});
```

## API 参考

### generateComponentTypes(name, def)

生成组件类型定义

**参数：**
- `name` (string): 组件名称
- `def` (ComponentDef): 组件定义

**返回：** Promise<TypeDefinition>

### generateApiTypes(desc)

生成 API 类型

**参数：**
- `desc` (ApiDescription): API 描述

**返回：** Promise<TypeDefinition>

### generateStoreModuleTypes(def)

生成 Store 模块类型

**参数：**
- `def` (StoreModuleDef): Store 模块定义

**返回：** Promise<TypeDefinition>

### jsonSchemaToTypes(schema, options?)

JSON Schema 转 TypeScript

**参数：**
- `schema` (JSONSchema7): JSON Schema
- `options` (ConvertOptions, optional): 转换选项

**返回：** TypeDefinition

### generateFormTypes(name, config)

生成表单类型

**参数：**
- `name` (string): 表单名称
- `config` (FormConfig): 表单配置

**返回：** Promise<TypeDefinition>

### generateTableColumns(name, config)

生成表格列类型

**参数：**
- `name` (string): 表格名称
- `config` (TableConfig): 表格配置

**返回：** Promise<TypeDefinition>

### generateEventBusTypes<T>()

生成事件总线类型

**返回：** EventMap<T>

### generateRouteHelpers<T>()

生成路由辅助函数

**返回：** RouteHelpers<T>

## 配置文件

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationDir": "./types",
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.vue",
    "types/**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### types/index.d.ts

```typescript
// 全局类型导出
export * from './components';
export * from './api';
export * from './store';
export * from './utils';

// Vue 组件扩展
declare module 'vue/types/vue' {
  interface Vue {
    $http: AxiosInstance;
    $eventBus: EventBus;
  }
}

// Vuex 扩展
declare module 'vuex/types/index' {
  interface Store<S> {
    getTypedGetter<T>(key: string): T;
  }
}
```

## 最佳实践

### 1. 类型命名规范

```typescript
// 接口类型：PascalCase
interface UserInfo { }

// 命名空间：PascalCase
namespace BondAPI { }

// 类型别名：PascalCase
type BondCode = string;

// 泛型参数：单个大写字母
function identity<T>(arg: T): T { }

// 枚举：PascalCase
enum BondType { }

// 枚举成员：UPPER_CASE
enum BondType {
  CREDIT_BOND = 'credit',
  RATE_BOND = 'rate'
}
```

### 2. 避免 any 类型

```typescript
// ❌ 不好
function fetchData(): any { }

// ✅ 好
interface FetchResult {
  data: unknown;
  error: Error | null;
}

function fetchData(): FetchResult { }
```

### 3. 使用类型守卫

```typescript
// 运行时类型检查
function isBondInfo(obj: unknown): obj is BondInfo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'bondCode' in obj &&
    typeof (obj as any).bondCode === 'string'
  );
}

// 使用
if (isBondInfo(data)) {
  console.log(data.bondCode);  // 类型安全
}
```

### 4. 工具类型

```typescript
// 常用工具类型
type Nullable<T> = T | null;
type NonNullable<T> = T extends null | undefined ? never : T;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// 使用示例
type BondInfoNullable = Nullable<BondInfo>;
type BondInfoPartialName = PartialBy<BondInfo, 'bondName'>;
```

## 常见问题

### 问题 1：类型定义太多文件怎么办？

**解决：** 使用索引文件组织
```typescript
// types/index.ts - 统一导出
export * from './components';
export * from './api';
export * from './store';
export * from './utils';
```

### 问题 2：循环依赖怎么处理？

**解决：** 使用前向声明
```typescript
// 前向声明
interface TreeNode {
  children?: TreeNode[];
}

// 或使用类型别名
type TreeNode = {
  children?: TreeNode[];
};
```

### 问题 3：第三方库没有类型定义？

**解决：** 创建声明文件
```typescript
// types/custom-lib.d.ts
declare module 'custom-lib' {
  export function doSomething(): void;
  export class MyClass {
    constructor();
    method(): string;
  }
}
```

## 相关文档

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vue 2 类型定义](../../workspaces/app-company/node_modules/vue/types/index.d.ts)
- [项目 TypeScript 配置](../../tsconfig.json)
