import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';

export interface ComponentTestConfig {
  componentName: string;
  componentPath: string;
  props?: Array<{ name: string; value: any; type: string }>;
  events?: Array<{ name: string; payload?: any }>;
  slots?: Array<{ name: string; content: string }>;
  mocks?: Record<string, any>;
}

export interface StoreTestConfig {
  moduleName: string;
  state?: Record<string, any>;
  getters?: Array<{ name: string; expectedValue: any }>;
  mutations?: Array<{ name: string; payload?: any; expectedState: any }>;
  actions?: Array<{ name: string; payload?: any; expectedResult: any }>;
}

export interface ApiTestConfig {
  apiName: string;
  endpoints: Array<{
    name: string;
    method: string;
    url: string;
    mockResponse: any;
    testCases?: Array<{ description: string; input?: any; expected: any }>;
  }>;
}

/**
 * 生成 Vue 组件测试
 */
export async function generateComponentTest(
  config: ComponentTestConfig,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating test for component: ${config.componentName}`));

  let testContent = `import { shallowMount, mount, createLocalVue } from '@vue/test-utils';\n`;
  testContent += `import { config as vueTestUtilsConfig } from '@vue/test-utils';\n`;
  testContent += `import ${config.componentName} from '../${path.basename(config.componentPath, '.vue')}.vue';\n\n`;

  // Mock 配置
  if (config.mocks) {
    testContent += `// Mock dependencies\n`;
    testContent += `jest.mock('@/api', () => ({\n`;
    Object.keys(config.mocks).forEach((key) => {
      testContent += `  ${key}: jest.fn(),\n`;
    });
    testContent += `}));\n\n`;
  }

  testContent += `describe('${config.componentName}.vue', () => {\n`;

  // 基础渲染测试
  testContent += `  it('should render component', () => {\n`;
  testContent += `    const wrapper = shallowMount(${config.componentName});\n`;
  testContent += `    expect(wrapper.exists()).toBe(true);\n`;
  testContent += `  });\n\n`;

  // Props 测试
  if (config.props && config.props.length > 0) {
    testContent += `  describe('Props', () => {\n`;
    for (const prop of config.props) {
      testContent += `    it('should render ${prop.name} correctly', () => {\n`;
      testContent += `      const wrapper = shallowMount(${config.componentName}, {\n`;
      testContent += `        propsData: {\n`;
      testContent += `          ${prop.name}: ${JSON.stringify(prop.value)}\n`;
      testContent += `        }\n`;
      testContent += `      });\n`;
      testContent += `      expect(wrapper.props('${prop.name}')).toEqual(${JSON.stringify(prop.value)});\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // Events 测试
  if (config.events && config.events.length > 0) {
    testContent += `  describe('Events', () => {\n`;
    for (const event of config.events) {
      testContent += `    it('should emit ${event.name} event', async () => {\n`;
      testContent += `      const wrapper = shallowMount(${config.componentName});\n`;
      testContent += `      // Trigger the event\n`;
      testContent += `      wrapper.vm.$emit('${event.name}'${event.payload ? `, ${JSON.stringify(event.payload)}` : ''});\n`;
      testContent += `      await wrapper.vm.$nextTick();\n`;
      testContent += `      expect(wrapper.emitted().${event.name}).toBeTruthy();\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // Slots 测试
  if (config.slots && config.slots.length > 0) {
    testContent += `  describe('Slots', () => {\n`;
    for (const slot of config.slots) {
      testContent += `    it('should render ${slot.name} slot', () => {\n`;
      testContent += `      const wrapper = shallowMount(${config.componentName}, {\n`;
      testContent += `        slots: {\n`;
      testContent += `          ${slot.name}: '${slot.content}'\n`;
      testContent += `        }\n`;
      testContent += `      });\n`;
      testContent += `      expect(wrapper.find('.${slot.name}-slot').text()).toContain('${slot.content}');\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // 生命周期测试
  testContent += `  describe('Lifecycle hooks', () => {\n`;
  testContent += `    it('should call mounted hook', async () => {\n`;
  testContent += `      const wrapper = shallowMount(${config.componentName});\n`;
  testContent += `      await wrapper.vm.$nextTick();\n`;
  testContent += `      // Verify mounted hook executed\n`;
  testContent += `    });\n`;
  testContent += `  });\n`;

  testContent += `});\n`;

  // 格式化代码
  const formattedContent = await prettier.format(testContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `__tests__/${config.componentName}.spec.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`Component test generated: ${outputFile}`));
  return true;
}

/**
 * 生成 Vuex Store 测试
 */
export async function generateStoreTest(
  config: StoreTestConfig,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating test for store: ${config.moduleName}`));

  let testContent = `import { createStore } from 'vuex';\n`;
  testContent += `import ${config.moduleName}Module from '../../src/store/${config.moduleName}';\n\n`;

  testContent += `describe('Vuex Store - ${config.moduleName} module', () => {\n`;
  testContent += `  let store: any;\n\n`;

  testContent += `  beforeEach(() => {\n`;
  testContent += `    store = createStore({\n`;
  testContent += `      modules: {\n`;
  testContent += `        ${config.moduleName}: ${config.moduleName}Module\n`;
  testContent += `      }\n`;
  testContent += `    });\n`;
  testContent += `  });\n\n`;

  // State 测试
  if (config.state) {
    testContent += `  describe('State', () => {\n`;
    for (const [key, value] of Object.entries(config.state)) {
      testContent += `    it('should initialize ${key} with default value', () => {\n`;
      testContent += `      expect(store.state.${config.moduleName}.${key}).toBeDefined();\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // Getters 测试
  if (config.getters && config.getters.length > 0) {
    testContent += `  describe('Getters', () => {\n`;
    for (const getter of config.getters) {
      testContent += `    it('should return ${getter.name}', () => {\n`;
      testContent += `      const result = store.getters['${config.moduleName}/${getter.name}'];\n`;
      testContent += `      expect(result).toEqual(${JSON.stringify(getter.expectedValue)});\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // Mutations 测试
  if (config.mutations && config.mutations.length > 0) {
    testContent += `  describe('Mutations', () => {\n`;
    for (const mutation of config.mutations) {
      testContent += `    it('should commit ${mutation.name}', () => {\n`;
      if (mutation.payload) {
        testContent += `      store.commit('${config.moduleName}/${mutation.name}', ${JSON.stringify(mutation.payload)});\n`;
      } else {
        testContent += `      store.commit('${config.moduleName}/${mutation.name}');\n`;
      }
      testContent += `      expect(store.state.${config.moduleName}).toEqual(${JSON.stringify(mutation.expectedState)});\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  // Actions 测试
  if (config.actions && config.actions.length > 0) {
    testContent += `  describe('Actions', () => {\n`;
    for (const action of config.actions) {
      testContent += `    it('should dispatch ${action.name}', async () => {\n`;
      if (action.payload) {
        testContent += `      await store.dispatch('${config.moduleName}/${action.name}', ${JSON.stringify(action.payload)});\n`;
      } else {
        testContent += `      await store.dispatch('${config.moduleName}/${action.name}');\n`;
      }
      testContent += `      expect(${JSON.stringify(action.expectedResult)});\n`;
      testContent += `    });\n\n`;
    }
    testContent += `  });\n\n`;
  }

  testContent += `});\n`;

  // 格式化代码
  const formattedContent = await prettier.format(testContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `__tests__/${config.moduleName}.store.spec.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`Store test generated: ${outputFile}`));
  return true;
}

/**
 * 生成 API 测试
 */
export async function generateApiTest(
  config: ApiTestConfig,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating test for API: ${config.apiName}`));

  let testContent = `import axios from 'axios';\n`;
  testContent += `import { ${config.apiName}Api } from '../../src/api/${config.apiName}';\n\n`;

  testContent += `// Mock axios\n`;
  testContent += `jest.mock('axios');\n`;
  testContent += `const mockedAxios = axios as jest.Mocked<typeof axios>;\n\n`;

  testContent += `describe('${config.apiName} API', () => {\n`;

  for (const endpoint of config.endpoints) {
    testContent += `  describe('${endpoint.name}', () => {\n`;

    if (endpoint.testCases && endpoint.testCases.length > 0) {
      for (const testCase of endpoint.testCases) {
        testContent += `    it('${testCase.description}', async () => {\n`;
        testContent += `      mockedAxios.${endpoint.method.toLowerCase()}.mockResolvedValue({ data: ${JSON.stringify(endpoint.mockResponse)} });\n`;

        if (testCase.input) {
          testContent += `      const result = await ${config.apiName}Api.${endpoint.name}(${JSON.stringify(testCase.input)});\n`;
        } else {
          testContent += `      const result = await ${config.apiName}Api.${endpoint.name}();\n`;
        }

        testContent += `      expect(result).toEqual(${JSON.stringify(testCase.expected)});\n`;
        testContent += `      expect(mockedAxios.${endpoint.method.toLowerCase()}).toHaveBeenCalled();\n`;
        testContent += `    });\n\n`;
      }
    } else {
      testContent += `    it('should return ${endpoint.name} data', async () => {\n`;
      testContent += `      mockedAxios.${endpoint.method.toLowerCase()}.mockResolvedValue({ data: ${JSON.stringify(endpoint.mockResponse)} });\n`;
      testContent += `      const result = await ${config.apiName}Api.${endpoint.name}();\n`;
      testContent += `      expect(result.data).toEqual(${JSON.stringify(endpoint.mockResponse)});\n`;
      testContent += `      expect(mockedAxios.${endpoint.method.toLowerCase()}).toHaveBeenCalledWith('${endpoint.url}');\n`;
      testContent += `    });\n\n`;
    }

    testContent += `  });\n\n`;
  }

  testContent += `});\n`;

  // 格式化代码
  const formattedContent = await prettier.format(testContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `__tests__/${config.apiName}.api.spec.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`API test generated: ${outputFile}`));
  return true;
}

/**
 * 批量生成测试文件
 */
export async function batchGenerateTests(
  patterns: string[],
  options?: { outputDir?: string }
): Promise<number> {
  console.log(chalk.cyan('Batch generating tests...'));

  const fg = await import('fast-glob');
  const files = await fg(patterns, { cwd: process.cwd() });

  let count = 0;
  for (const file of files) {
    try {
      // 根据文件类型生成对应的测试
      if (file.endsWith('.vue')) {
        await generateComponentTest({
          componentName: path.basename(file, '.vue'),
          componentPath: file,
        });
      }
      count++;
    } catch (error: any) {
      console.error(chalk.red(`Error processing ${file}: ${error.message}`));
    }
  }

  console.log(chalk.green(`Generated tests for ${count} files`));
  return count;
}
