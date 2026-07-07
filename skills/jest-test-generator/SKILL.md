---
name: jest-test-generator
description: Automatically generate Jest unit tests for Vue components, Vuex stores, and API services
---

# Jest Test Generator

Automatically generate comprehensive Jest unit tests for Vue components, Vuex stores, and API endpoints.

## When to Use

Use this skill when you need to:
- Create unit tests for Vue components
- Test Vuex store modules (state, getters, mutations, actions)
- Generate API service tests
- Batch generate test files for multiple components

## Core Functions

### Generate Component Test
Create Jest tests for Vue components.

```typescript
await generateComponentTest({
  componentName: 'BondDetail',
  componentPath: '@/components/BondDetail.vue',
  props: [
    { name: 'bondCode', value: '123456', type: 'string' }
  ],
  events: [
    { name: 'export', payload: { format: 'pdf' } }
  ],
  slots: [
    { name: 'header', content: '<h1>Bond Info</h1>' }
  ],
  mocks: {
    getBondDetail: jest.fn()
  }
})
```

### Generate Store Test
Create tests for Vuex store modules.

```typescript
await generateStoreTest({
  moduleName: 'bond',
  state: {
    list: [],
    total: 0
  },
  getters: [
    { name: 'bondCount', expectedValue: 0 }
  ],
  mutations: [
    { name: 'SET_LIST', payload: [{ id: 1 }], expectedState: { list: [{ id: 1 }] } }
  ],
  actions: [
    { name: 'fetchList', payload: { page: 1 }, expectedResult: Promise.resolve() }
  ]
})
```

### Generate API Test
Create tests for API endpoints.

```typescript
await generateApiTest({
  apiName: 'bond',
  endpoints: [
    {
      name: 'getDetail',
      method: 'GET',
      url: '/api/bond/detail',
      mockResponse: { code: 200, data: { bondCode: '123456' } },
      testCases: [
        {
          description: 'should return bond details',
          input: { code: '123456' },
          expected: { bondCode: '123456' }
        }
      ]
    }
  ]
})
```

### Batch Generate Tests
Generate tests for multiple files at once.

```typescript
await batchGenerateTests(['src/components/**/*.vue'])
```

## Usage Examples

### Vue Component Test Suite
```typescript
// Generated test file structure:
describe('BondDetail.vue', () => {
  
  // Mock dependencies
  jest.mock('@/api', () => ({
    getBondDetail: jest.fn()
  }))
  
  // Basic render test
  it('should render component', () => {
    const wrapper = shallowMount(BondDetail)
    expect(wrapper.exists()).toBe(true)
  })
  
  // Props tests
  describe('Props', () => {
    it('should render bondCode correctly', () => {
      const wrapper = shallowMount(BondDetail, {
        propsData: { bondCode: '123456' }
      })
      expect(wrapper.props('bondCode')).toBe('123456')
    })
  })
  
  // Events tests
  describe('Events', () => {
    it('should emit export event', async () => {
      const wrapper = shallowMount(BondDetail)
      wrapper.vm.$emit('export', { format: 'pdf' })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted().export).toBeTruthy()
    })
  })
  
  // Lifecycle tests
  describe('Lifecycle hooks', () => {
    it('should call mounted hook', async () => {
      const wrapper = shallowMount(BondDetail)
      await wrapper.vm.$nextTick()
      // Verify mounted executed
    })
  })
})
```

### Vuex Store Test Suite
```typescript
describe('Vuex Store - bond module', () => {
  let store
  
  beforeEach(() => {
    store = createStore({
      modules: {
        bond: bondModule
      }
    })
  })
  
  // State tests
  describe('State', () => {
    it('should initialize list with default value', () => {
      expect(store.state.bond.list).toBeDefined()
    })
  })
  
  // Getters tests
  describe('Getters', () => {
    it('should return bond count', () => {
      store.commit('bond/SET_LIST', [{ id: 1 }])
      expect(store.getters['bond/bondCount']).toBe(1)
    })
  })
  
  // Mutations tests
  describe('Mutations', () => {
    it('should commit SET_LIST', () => {
      store.commit('bond/SET_LIST', [{ id: 1 }])
      expect(store.state.bond.list).toEqual([{ id: 1 }])
    })
  })
  
  // Actions tests
  describe('Actions', () => {
    it('should dispatch fetchList', async () => {
      await store.dispatch('bond/fetchList', { page: 1 })
      expect(store.state.bond.list).toHaveLength(1)
    })
  })
})
```

### API Test Suite
```typescript
describe('Bond API', () => {
  
  // Mock axios
  jest.mock('axios')
  const mockedAxios = axios as jest.Mocked<typeof axios>
  
  describe('getDetail', () => {
    it('should return bond detail data', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { code: 200, data: { bondCode: '123456' } } 
      })
      
      const result = await bondApi.getDetail({ code: '123456' })
      
      expect(result.data).toEqual({ code: 200, data: { bondCode: '123456' } })
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/bond/detail')
    })
    
    it('should handle error case', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'))
      
      await expect(bondApi.getDetail({ code: 'invalid' }))
        .rejects.toThrow('Network error')
    })
  })
})
```

## Test Coverage Areas

### Components
- ✅ Render correctness
- ✅ Props validation
- ✅ Event emission
- ✅ Slot rendering
- ✅ Lifecycle hooks
- ✅ Computed properties
- ✅ Watchers

### Vuex Stores
- ✅ State initialization
- ✅ Getters return values
- ✅ Mutations state changes
- ✅ Actions dispatch and side effects

### APIs
- ✅ Response data structure
- ✅ Request parameters
- ✅ Error handling
- ✅ HTTP method correctness
- ✅ URL validation

## Related Skills

- api-mock-generator - Generate mock data for tests
- typescript-type-generator - Generate types for test assertions
