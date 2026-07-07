---
name: typescript-type-generator
description: Generate TypeScript type definitions for Vue components, API responses, and Vuex stores
---

# TypeScript Type Generator

Automatically generate TypeScript type definitions for components, APIs, stores, and extract types from existing code.

## When to Use

Use this skill when you need to:
- Create Props type definitions for Vue components
- Generate API request/response types
- Define Vuex store state, getters, mutations, and actions
- Extract types from existing TypeScript files
- Batch generate type definitions

## Core Functions

### Generate Component Types
Create Props and Emits type definitions for Vue components.

```typescript
await generateComponentTypes('BondDetail', [
  { 
    name: 'bondCode', 
    type: 'string', 
    required: true,
    description: 'Bond identification code'
  },
  { 
    name: 'bondType', 
    type: "'credit' | 'rate'", 
    required: false,
    description: 'Type of bond'
  },
  { 
    name: 'onBondChange', 
    type: '(code: string) => void', 
    required: false,
    description: 'Callback when bond changes'
  }
])
```

### Generate API Types
Create type definitions for API endpoints.

```typescript
await generateApiTypes('bond', [
  {
    name: 'getDetail',
    method: 'GET',
    url: '/api/bond/detail',
    requestType: 'DetailParams',
    responseType: 'BondInfo',
    description: 'Get bond details'
  }
])
```

### Generate Store Types
Define Vuex module types with namespaced helpers.

```typescript
await generateStoreTypes('bond', {
  state: {
    list: [],
    total: 0,
    loading: false
  },
  getters: [
    { name: 'bondCount', returnType: 'number', value: 'state.list.length' }
  ],
  mutations: [
    { name: 'SET_LIST', payloadType: 'BondInfo[]' }
  ],
  actions: [
    { name: 'fetchList', payloadType: '{ page: number, size: number }', returnType: 'Promise<void>' }
  ]
})
```

### Extract Types from File
Extract interface and type aliases from existing TypeScript files.

```typescript
await extractTypesFromFile('src/api/bond/types.ts')
```

### Batch Generate Types
Process multiple files at once.

```typescript
await batchGenerateTypes(['src/components/**/*.vue'])
```

## Usage Examples

### Complete Component Setup
```typescript
// 1. Generate Props types
await generateComponentTypes('BondList', [
  { name: 'bonds', type: 'BondInfo[]', required: true },
  { name: 'loading', type: 'boolean', required: false },
  { name: 'total', type: 'number', required: true }
])

// Output: BondListProps, BondListEmits interfaces
```

### API Module Types
```typescript
await generateApiTypes('stock', [
  {
    name: 'getPrice',
    method: 'GET',
    url: '/api/stock/price',
    responseType: 'StockPrice'
  },
  {
    name: 'updatePrice',
    method: 'POST',
    url: '/api/stock/price',
    requestType: 'PriceUpdate',
    responseType: 'boolean'
  }
])

// Generates: StockAPI namespace with Params and Response types
```

### Vuex Store Module
```typescript
await generateStoreTypes('user', {
  state: {
    info: null,
    token: '',
    permissions: []
  },
  getters: [
    { name: 'isLoggedIn', returnType: 'boolean' }
  ],
  mutations: [
    { name: 'SET_INFO', payloadType: 'UserInfo' },
    { name: 'SET_TOKEN', payloadType: 'string' }
  ],
  actions: [
    { name: 'login', payloadType: 'LoginParams', returnType: 'Promise<boolean>' }
  ]
})

// Generates: UserState, UserGetters, UserMutations, UserActions
// Plus: useUserStore helper
```

## Generated Type Patterns

### Component Props
```typescript
export interface BOND_DETAIL_PROPS {
  bondCode: string;
  bondType?: 'credit' | 'rate';
  onBondChange?: (code: string) => void;
}

export interface BOND_DETAIL_EMITS {
  (event: 'update:modelValue', value: any): void;
}
```

### API Namespace
```typescript
export namespace BondAPI {
  export interface GetDetailParams { /* ... */ }
  export interface GetDetailResponse extends ApiResponse<BondInfo> {}
}

export interface BondService {
  getDetail(params: BondAPI.GetDetailParams): Promise<BondAPI.GetDetailResponse>;
}
```

### Store Module
```typescript
export interface BondState {
  list: BondInfo[];
  total: number;
  loading: boolean;
}

export const useBondStore = createNamespacedHelpers('bond');
```

## Related Skills

- micro-app-route-config - Configure routes with proper types
- api-mock-generator - Generate mock data matching API types
