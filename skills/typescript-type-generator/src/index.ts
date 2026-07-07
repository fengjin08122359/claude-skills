import { Project, ts } from 'ts-morph';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';

export interface PropDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  validator?: string;
  description?: string;
}

export interface ApiDefinition {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  requestType?: string;
  responseType: string;
  description?: string;
}

export interface StoreModule {
  name: string;
  state: Record<string, any>;
  getters?: Array<{ name: string; returnType: string; value: string }>;
  mutations?: Array<{ name: string; payloadType?: string }>;
  actions?: Array<{ name: string; payloadType?: string; returnType: string }>;
}

const project = new Project({
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    strict: true,
    esModuleInterop: true,
  },
});

/**
 * 生成组件 Props 类型定义
 */
export async function generateComponentTypes(
  componentName: string,
  props: PropDefinition[],
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating types for component: ${componentName}`));

  const interfaceName = `${componentName.replace(/([A-Z])/g, '_$1').toUpperCase()}_PROPS`;

  let typeContent = `export interface ${interfaceName} {\n`;

  for (const prop of props) {
    if (prop.description) {
      typeContent += `  /** ${prop.description} */\n`;
    }
    typeContent += `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};\n`;
  }

  typeContent += '}\n';

  // 添加事件类型
  typeContent += `\nexport interface ${interfaceName.replace('PROPS', 'EMITS')} {\n`;
  typeContent += `  (event: 'update:modelValue', value: any): void;\n`;
  typeContent += '}\n';

  // 格式化代码
  const formattedContent = await prettier.format(typeContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `src/components/${componentName}/types.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`Component types generated: ${outputFile}`));
  return true;
}

/**
 * 生成 API 响应类型
 */
export async function generateApiTypes(
  apiName: string,
  apis: ApiDefinition[],
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating API types for: ${apiName}`));

  let typeContent = `export namespace ${apiName}API {\n\n`;

  // 生成参数和响应类型
  for (const api of apis) {
    if (api.requestType) {
      typeContent += `  export interface ${api.name}Params {\n`;
      typeContent += `    // TODO: Define request parameters\n`;
      typeContent += `  }\n\n`;
    }

    typeContent += `  export interface ${api.name}Response extends ApiResponse<${api.responseType}> {}\n\n`;

    if (api.description) {
      typeContent += `  /** ${api.description} */\n`;
    }
  }

  typeContent += '}\n';

  // 生成 API 服务接口
  typeContent += `\nexport interface ${apiName}Service {\n`;
  for (const api of apis) {
    const params = api.requestType ? `params: ${apiName}API.${api.name}Params` : '';
    typeContent += `  ${api.name}(${params}): Promise<${apiName}API.${api.name}Response>;\n`;
  }
  typeContent += '}\n';

  // 格式化代码
  const formattedContent = await prettier.format(typeContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `src/api/${apiName}/types.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`API types generated: ${outputFile}`));
  return true;
}

/**
 * 生成 Vuex Store 类型
 */
export async function generateStoreTypes(
  moduleName: string,
  store: StoreModule,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating store types for: ${moduleName}`));

  let typeContent = `import { ActionContext, Module } from 'vuex';\n\n`;

  // State 类型
  typeContent += `export interface ${moduleName}State {\n`;
  for (const [key, value] of Object.entries(store.state)) {
    const type = typeof value === 'string' ? 'string' :
      typeof value === 'number' ? 'number' :
        typeof value === 'boolean' ? 'boolean' : 'any';
    typeContent += `  ${key}: ${type};\n`;
  }
  typeContent += '}\n\n';

  // Getters 类型
  if (store.getters && store.getters.length > 0) {
    typeContent += `export interface ${moduleName}Getters {\n`;
    for (const getter of store.getters) {
      typeContent += `  ${getter.name}: ${getter.returnType};\n`;
    }
    typeContent += '}\n\n';
  }

  // Mutations 类型
  typeContent += `export interface ${moduleName}Mutations {\n`;
  if (store.mutations && store.mutations.length > 0) {
    for (const mutation of store.mutations) {
      const payload = mutation.payloadType ? `, payload: ${mutation.payloadType}` : '';
      typeContent += `  ${mutation.name}(state: ${moduleName}State${payload}): void;\n`;
    }
  }
  typeContent += '}\n\n';

  // Actions 类型
  typeContent += `export interface ${moduleName}Actions {\n`;
  if (store.actions && store.actions.length > 0) {
    for (const action of store.actions) {
      const payload = action.payloadType ? `payload: ${action.payloadType}` : '';
      typeContent += `  ${action.name}(ctx: ActionContext<${moduleName}State, any>${payload ? `, ${payload}` : ''}): Promise<${action.returnType}>;\n`;
    }
  }
  typeContent += '}\n\n';

  // Store 模块类型
  typeContent += `export type ${moduleName}Module = Module<${moduleName}State, any>;\n`;

  // 添加命名空间辅助函数
  typeContent += `\nimport { createNamespacedHelpers } from 'vuex-class';\n`;
  typeContent += `export const use${moduleName}Store = createNamespacedHelpers('${moduleName}');\n`;

  // 格式化代码
  const formattedContent = await prettier.format(typeContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  const outputFile = options?.outputFile || `src/store/${moduleName}/types.ts`;
  await fs.ensureDir(path.dirname(outputFile));
  await fs.writeFile(outputFile, formattedContent);

  console.log(chalk.green(`Store types generated: ${outputFile}`));
  return true;
}

/**
 * 从现有文件提取类型
 */
export async function extractTypesFromFile(
  filePath: string,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Extracting types from: ${filePath}`));

  const sourceFile = project.addSourceFileAtPath(filePath);

  // 提取接口和类型别名
  const interfaces = sourceFile.getInterfaces();
  const typeAliases = sourceFile.getTypeAliases();

  let extractedContent = `// Auto-generated types from ${filePath}\n\n`;

  for (const iface of interfaces) {
    extractedContent += iface.print() + '\n\n';
  }

  for (const typeAlias of typeAliases) {
    extractedContent += typeAlias.print() + '\n\n';
  }

  const outputFile = options?.outputFile || filePath.replace('.ts', '.types.ts');
  await fs.writeFile(outputFile, extractedContent);

  console.log(chalk.green(`Types extracted to: ${outputFile}`));
  return true;
}

/**
 * 批量生成类型定义
 */
export async function batchGenerateTypes(
  patterns: string[],
  options?: { outputDir?: string }
): Promise<number> {
  console.log(chalk.cyan('Batch generating types...'));

  const fg = await import('fast-glob');
  const files = await fg(patterns, { cwd: process.cwd() });

  let count = 0;
  for (const file of files) {
    try {
      await extractTypesFromFile(file, {
        outputDir: options?.outputDir,
      });
      count++;
    } catch (error: any) {
      console.error(chalk.red(`Error processing ${file}: ${error.message}`));
    }
  }

  console.log(chalk.green(`Generated types for ${count} files`));
  return count;
}
