# Jest Test Generator Skill

## 功能说明

自动生成 Jest 单元测试，集成 Vue Test Utils，提供完整的测试覆盖和 Mock 策略。

## 核心能力

### 1. Vue 组件测试生成

```typescript
// 原始组件：BondDetail.vue
export default {
  name: 'BondDetail',
  props: {
    bondCode: { type: String, required: true },
    showAnalysis: { type: Boolean, default: false }
  },
  data() {
    return {
      bondInfo: null,
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    this.bondInfo = await this.$api.getBondDetail(this.bondCode);
    this.loading = false;
  },
  methods: {
    handleExport() {
      this.$emit('export', this.bondCode);
    }
  }
};

// 自动生成的测试文件
describe('BondDetail.vue', () => {
  let wrapper: Wrapper<BondDetail>;
  const mockBondInfo = {
    bondCode: '123456',
    bondName: 'Test Bond',
    couponRate: 3.5
  };

  beforeEach(() => {
    // Mock API
    jest.spyOn(ApiService, 'getBondDetail').mockResolvedValue(mockBondInfo);
    
    wrapper = shallowMount(BondDetail, {
      propsData: {
        bondCode: '123456',
        showAnalysis: true
      },
      mocks: {
        $api: {
          getBondDetail: jest.fn()
        }
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render bond code', () => {
    expect(wrapper.find('.bond-code').text()).toBe('123456');
  });

  it('should fetch bond info on mount', async () => {
    await wrapper.vm.$nextTick();
    expect(ApiService.getBondDetail).toHaveBeenCalledWith('123456');
    expect(wrapper.vm.bondInfo).toEqual(mockBondInfo);
  });

  it('should emit export event', () => {
    wrapper.find('.export-btn').trigger('click');
    expect(wrapper.emitted().export).toHaveLength(1);
    expect(wrapper.emitted().export[0]).toEqual(['123456']);
  });

  it('should handle loading state', async () => {
    expect(wrapper.vm.loading).toBe(false);
    
    // 模拟加载中
    (wrapper.vm as any).loading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });
});
```

### 2. Props 验证测试

```typescript
// 为每个 prop 生成验证测试
describe('Props Validation', () => {
  it('should require bondCode prop', () => {
    expect(() => {
      shallowMount(BondDetail, {
        propsData: {}
      });
    }).toThrow();
  });

  it('should accept valid bondCode', () => {
    const wrapper = shallowMount(BondDetail, {
      propsData: { bondCode: 'ABC123' }
    });
    expect(wrapper.props().bondCode).toBe('ABC123');
  });

  it('should use default value for showAnalysis', () => {
    const wrapper = shallowMount(BondDetail, {
      propsData: { bondCode: '123' }
    });
    expect(wrapper.props().showAnalysis).toBe(false);
  });

  it('should override default value', () => {
    const wrapper = shallowMount(BondDetail, {
      propsData: { 
        bondCode: '123',
        showAnalysis: true 
      }
    });
    expect(wrapper.props().showAnalysis).toBe(true);
  });
});
```

### 3. Computed 属性测试

```typescript
// 组件中的 computed
computed: {
  formattedRate() {
    return this.bondInfo 
      ? `${(this.bondInfo.couponRate * 100).toFixed(2)}%`
      : '--';
  },
  
  isValidBond() {
    return this.bondInfo && this.bondInfo.couponRate > 0;
  }
}

// 生成的测试
describe('Computed Properties', () => {
  it('should format rate correctly', async () => {
    wrapper.setData({
      bondInfo: { couponRate: 0.035 }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formattedRate).toBe('3.50%');
  });

  it('should return -- when no bond info', () => {
    wrapper.setData({ bondInfo: null });
    expect(wrapper.vm.formattedRate).toBe('--');
  });

  it('should validate bond correctly', async () => {
    wrapper.setData({
      bondInfo: { couponRate: 0.035 }
    });
    expect(wrapper.vm.isValidBond).toBe(true);
    
    wrapper.setData({
      bondInfo: { couponRate: 0 }
    });
    expect(wrapper.vm.isValidBond).toBe(false);
  });
});
```

### 4. Methods 测试

```typescript
// 组件方法
methods: {
  async refresh() {
    this.loading = true;
    try {
      this.bondInfo = await this.$api.getBondDetail(this.bondCode);
      this.$message.success('刷新成功');
    } catch (error) {
      this.$message.error('刷新失败');
    } finally {
      this.loading = false;
    }
  },
  
  navigateTo(page: string) {
    this.$router.push(`/bond/${this.bondCode}/${page}`);
  }
}

// 生成的测试
describe('Methods', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should refresh bond info', async () => {
    const mockApi = { getBondDetail: jest.fn().mockResolvedValue(mockBondInfo) };
    wrapper.vm.$api = mockApi;
    
    await wrapper.vm.refresh();
    
    expect(mockApi.getBondDetail).toHaveBeenCalled();
    expect(wrapper.vm.bondInfo).toEqual(mockBondInfo);
    expect(wrapper.vm.loading).toBe(false);
  });

  it('should handle refresh error', async () => {
    const mockApi = { 
      getBondDetail: jest.fn().mockRejectedValue(new Error('Network error')) 
    };
    const messageSpy = jest.spyOn(wrapper.vm, '$message');
    wrapper.vm.$api = mockApi;
    
    await wrapper.vm.refresh();
    
    expect(messageSpy.error).toHaveBeenCalledWith('刷新失败');
  });

  it('should navigate to correct page', () => {
    const routerPush = jest.spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.navigateTo('analysis');
    expect(routerPush).toHaveBeenCalledWith('/bond/123456/analysis');
  });
});
```

### 5. Vuex Store 测试

```typescript
// Store 模块
const bondModule = {
  namespaced: true,
  state: {
    list: [],
    current: null,
    isLoading: false
  },
  getters: {
    bondCount: state => state.list.length,
    hasCurrent: state => !!state.current
  },
  mutations: {
    SET_LIST(state, list) {
      state.list = list;
    },
    SET_CURRENT(state, bond) {
      state.current = bond;
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    async fetchList({ commit }, params) {
      commit('SET_LOADING', true);
      const data = await api.getBondList(params);
      commit('SET_LIST', data);
      commit('SET_LOADING', false);
    }
  }
};

// 生成的测试
describe('Vuex Store - bond module', () => {
  let store: Store<any>;

  beforeEach(() => {
    store = createStore({
      modules: {
        bond: bondModule
      }
    });
  });

  describe('Getters', () => {
    it('should return bond count', () => {
      store.commit('bond/SET_LIST', [
        { bondCode: '1' }, 
        { bondCode: '2' }
      ]);
      expect(store.getters['bond/bondCount']).toBe(2);
    });

    it('should check if has current', () => {
      expect(store.getters['bond/hasCurrent']).toBe(false);
      
      store.commit('bond/SET_CURRENT', { bondCode: '1' });
      expect(store.getters['bond/hasCurrent']).toBe(true);
    });
  });

  describe('Mutations', () => {
    it('should set list', () => {
      const mockList = [{ bondCode: '1' }];
      store.commit('bond/SET_LIST', mockList);
      expect(store.state.bond.list).toEqual(mockList);
    });

    it('should set current', () => {
      const mockBond = { bondCode: '1' };
      store.commit('bond/SET_CURRENT', mockBond);
      expect(store.state.bond.current).toEqual(mockBond);
    });
  });

  describe('Actions', () => {
    it('should fetch list', async () => {
      const mockApi = jest.spyOn(ApiService, 'getBondList')
        .mockResolvedValue([{ bondCode: '1' }]);
      
      await store.dispatch('bond/fetchList', { page: 1 });
      
      expect(mockApi).toHaveBeenCalled();
      expect(store.state.bond.list).toHaveLength(1);
      expect(store.state.bond.isLoading).toBe(false);
    });
  });
});
```

### 6. API 调用测试

```typescript
// API 服务
export const bondApi = {
  async getList(params: ListParams): Promise<BondInfo[]> {
    return http.post('/api/bond/list', params);
  },
  
  async getDetail(code: string): Promise<BondInfo> {
    return http.get(`/api/bond/${code}`);
  },
  
  async export(codes: string[]): Promise<string> {
    return http.post('/api/bond/export', { codes });
  }
};

// 生成的测试
describe('Bond API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get bond list', async () => {
    const mockResponse = { 
      data: [{ bondCode: '1' }, { bondCode: '2' }] 
    };
    jest.spyOn(http, 'post').mockResolvedValue(mockResponse);
    
    const result = await bondApi.getList({ page: 1, size: 20 });
    
    expect(http.post).toHaveBeenCalledWith('/api/bond/list', {
      page: 1,
      size: 20
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should get bond detail', async () => {
    const mockBond = { bondCode: '123', bondName: 'Test' };
    jest.spyOn(http, 'get').mockResolvedValue({ data: mockBond });
    
    const result = await bondApi.getDetail('123');
    
    expect(http.get).toHaveBeenCalledWith('/api/bond/123');
    expect(result).toEqual(mockBond);
  });

  it('should handle API error', async () => {
    jest.spyOn(http, 'post').mockRejectedValue(new Error('Network error'));
    
    await expect(bondApi.getList({ page: 1 }))
      .rejects.toThrow('Network error');
  });
});
```

### 7. 路由守卫测试

```typescript
// 路由配置
const routes = [
  {
    path: '/bond/:code',
    component: BondDetail,
    meta: { 
      requireAuth: true,
      permission: 'bond.view'
    }
  }
];

// 路由守卫
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

// 生成的测试
describe('Route Guards', () => {
  let store: Store<any>;
  let next: jest.Mock;

  beforeEach(() => {
    store = createStore({
      state: { user: { isAuthenticated: false } }
    });
    next = jest.fn();
  });

  it('should redirect to login when not authenticated', () => {
    const to = { 
      path: '/bond/123',
      meta: { requireAuth: true }
    };
    
    router.beforeEach(to, {}, next);
    
    expect(next).toHaveBeenCalledWith('/login');
  });

  it('should redirect to 403 when no permission', () => {
    store.state.user.isAuthenticated = true;
    jest.spyOn(AuthService, 'hasPermission').mockReturnValue(false);
    
    const to = { 
      path: '/bond/123',
      meta: { requireAuth: true, permission: 'bond.view' }
    };
    
    router.beforeEach(to, {}, next);
    
    expect(next).toHaveBeenCalledWith('/403');
  });

  it('should allow access when authenticated and has permission', () => {
    store.state.user.isAuthenticated = true;
    jest.spyOn(AuthService, 'hasPermission').mockReturnValue(true);
    
    const to = { 
      path: '/bond/123',
      meta: { requireAuth: true, permission: 'bond.view' }
    };
    
    router.beforeEach(to, {}, next);
    
    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalledWith('/403');
  });
});
```

### 8. 覆盖率报告生成

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.d.ts',
    '!src/main.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
  coverageDirectory: 'coverage'
};

// 生成的覆盖率报告
/*
=============================== Coverage summary ===============================
Statements   : 75.5% ( 150/198 )
Branches     : 72.3% ( 89/123 )
Functions    : 78.9% ( 45/57 )
Lines        : 76.1% ( 142/186 )
================================================================================
*/
```

## 典型工作流

### 工作流 1：为新组件生成测试

```typescript
// 1. 分析组件结构
const componentAnalysis = analyzeComponent(BondDetail);
/*
{
  name: 'BondDetail',
  props: ['bondCode', 'showAnalysis'],
  data: ['bondInfo', 'loading'],
  computed: ['formattedRate', 'isValidBond'],
  methods: ['refresh', 'handleExport', 'navigateTo'],
  lifecycle: ['mounted'],
  emits: ['export']
}
*/

// 2. 生成测试骨架
const testSkeleton = generateTestSkeleton(componentAnalysis);

// 3. 生成 Mock 数据
const mockData = generateMockData(componentAnalysis);

// 4. 生成测试用例
const testCases = generateTestCases(componentAnalysis, mockData);

// 5. 写入测试文件
writeTestFile('BondDetail.spec.ts', testCases);

// 6. 运行测试
await runTests('BondDetail.spec.ts');

// 7. 查看覆盖率报告
await generateCoverageReport();
```

### 工作流 2：批量生成现有组件的测试

```typescript
// 扫描所有 Vue 组件
const components = scanComponents('src/**/*.vue');

// 为每个组件生成测试
for (const component of components) {
  if (!hasTestFile(component)) {
    console.log(`Generating test for ${component.name}...`);
    
    const testFile = await generateTest(component);
    writeFileSync(testFile.path, testFile.content);
  }
}

// 批量运行测试
const results = await runAllTests();

// 生成汇总报告
generateSummaryReport(results);
```

### 工作流 3：测试驱动开发（TDD）

```typescript
// 1. 先写测试（红）
describe('BondChart', () => {
  it('should render chart with bond data', () => {
    const wrapper = shallowMount(BondChart, {
      propsData: {
        data: mockChartData
      }
    });
    expect(wrapper.find('.chart').exists()).toBe(true);
  });
});

// 2. 运行测试（失败）
// npm test -- BondChart.spec.ts
// ❌ BondChart is not defined

// 3. 实现最小功能（绿）
export default {
  name: 'BondChart',
  props: ['data'],
  template: '<div class="chart">Chart</div>'
};

// 4. 运行测试（通过）
// ✅ 1 passing

// 5. 重构优化
// 添加 ECharts 集成、响应式等

// 6. 继续下一个测试
```

## API 参考

### generateTest(component, options?)

生成组件测试

**参数：**
- `component` (Component): 组件定义或路径
- `options.coverage` (boolean, optional): 是否包含覆盖率
- `options.snapshot` (boolean, optional): 是否包含快照测试

**返回：** TestFile

### analyzeComponent(component)

分析组件结构

**参数：**
- `component` (Component): 组件定义

**返回：** ComponentAnalysis

### generateMockData(analysis)

生成 Mock 数据

**参数：**
- `analysis` (ComponentAnalysis): 组件分析结果

**返回：** MockData

### runTests(pattern?, options?)

运行测试

**参数：**
- `pattern` (string, optional): 测试文件匹配模式
- `options.watch` (boolean, optional): 是否监听模式
- `options.coverage` (boolean, optional): 是否收集覆盖率

**返回：** TestResults

### generateCoverageReport(results?)

生成覆盖率报告

**参数：**
- `results` (TestResults, optional): 测试结果

**返回：** CoverageReport

## 配置文件

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: [
    '**/__tests__/**/*.spec.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: false
    }
  }
};
```

### jest.setup.js

```javascript
import Vue from 'vue';
import { config } from '@vue/test-utils';

// 全局 Mock
global.console = {
  ...console,
  debug: jest.fn(),
  info: jest.fn()
};

// 全局组件
config.stubs = {
  'router-link': true,
  'router-view': true
};

// 全局 Mocks
config.mocks = {
  $t: (key) => key,
  $tc: (key) => key,
  $te: (key) => true
};

// 重置所有 Mock
afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
```

## 最佳实践

### 1. 测试命名规范

```typescript
// ✅ 好的命名
it('should render bond code correctly', () => {});
it('should emit export event when click export button', () => {});
it('should handle API error gracefully', () => {});

// ❌ 不好的命名
it('test1', () => {});
it('export', () => {});
```

### 2. AAA 模式

```typescript
// Arrange - Act - Assert
it('should update bond info', async () => {
  // Arrange
  const mockData = { bondCode: '123' };
  jest.spyOn(Api, 'getDetail').mockResolvedValue(mockData);
  
  // Act
  await wrapper.vm.refresh();
  
  // Assert
  expect(wrapper.vm.bondInfo).toEqual(mockData);
});
```

### 3. 独立测试

```typescript
// ✅ 每个测试独立
it('test 1', () => {
  const data = createTestData();
  // ...
});

it('test 2', () => {
  const data = createTestData();  // 重新创建
  // ...
});

// ❌ 测试间依赖
let sharedData;
it('test 1', () => {
  sharedData = createTestData();
});
it('test 2', () => {
  // 使用 sharedData - 不好！
});
```

### 4. 快照测试谨慎使用

```typescript
// ✅ 适合稳定组件
it('should match snapshot', () => {
  const wrapper = shallowMount(StaticComponent);
  expect(wrapper.html()).toMatchSnapshot();
});

// ❌ 不适合频繁变动的组件
it('should match snapshot', () => {
  const wrapper = shallowMount(FrequentlyChangedComponent);
  // 每次改动都要更新快照 - 维护成本高
});
```

## 注意事项

1. **Mock 适度**：不要过度 Mock，要测试真实逻辑
2. **测试隔离**：测试之间不应该相互依赖
3. **断言明确**：每个测试应该有明确的断言
4. **覆盖率目标**：设置合理的覆盖率要求（70-80%）
5. **性能考虑**：大量测试时考虑并行执行
6. **CI 集成**：在 CI 中自动运行测试

## 相关文档

- [Jest 官方文档](https://jestjs.io/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [自动化测试](../../dev/doc/自动化测试.md)
- [automated-test](../../automated-test/)
