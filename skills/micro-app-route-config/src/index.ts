import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';

export interface RouteMeta {
  title: string;
  permission?: string;
  keepAlive?: boolean;
  icon?: string;
  hidden?: boolean;
  affix?: boolean;
  breadcrumb?: boolean;
  activeMenu?: string;
}

export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  redirect?: string;
  meta: RouteMeta;
  children?: RouteConfig[];
}

export interface PermissionConfig {
  id: string;
  name: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  order?: number;
}

/**
 * 生成路由配置
 */
export async function generateRoute(
  route: RouteConfig,
  options?: { outputFile?: string; validate?: boolean }
): Promise<boolean> {
  console.log(chalk.cyan(`Generating route: ${route.name}`));

  // 校验组件路径是否存在
  if (options?.validate !== false) {
    const componentPath = resolveComponentPath(route.component);
    if (!(await fs.pathExists(componentPath))) {
      console.error(
        chalk.red(`Component not found: ${componentPath}`)
      );
      return false;
    }
  }

  // 校验异步组件引用
  if (!isValidAsyncComponent(route.component)) {
    console.warn(
      chalk.yellow(
        'Warning: Component should use async import syntax: @/pages/xxx/index.vue'
      )
    );
  }

  // 读取或创建路由配置文件
  const configFile = options?.outputFile || 'src/router/routes.config.ts';
  const configPath = path.join(process.cwd(), configFile);

  let routesContent = '';
  if (await fs.pathExists(configPath)) {
    routesContent = await fs.readFile(configPath, 'utf-8');
  } else {
    routesContent = `import type { RouteConfig } from 'vue-router';\n\nconst routes: RouteConfig[] = [];\n\nexport default routes;\n`;
  }

  // 生成路由代码
  const routeCode = generateRouteCode(route);

  // 检查是否已存在
  if (routesContent.includes(`name: '${route.name}'`)) {
    console.warn(chalk.yellow(`Route ${route.name} already exists`));
    return false;
  }

  // 插入路由配置
  const insertPosition = routesContent.lastIndexOf('];');
  if (insertPosition === -1) {
    console.error(chalk.red('Invalid routes config format'));
    return false;
  }

  const newRoutesContent =
    routesContent.slice(0, insertPosition) +
    '\n' +
    routeCode +
    '\n' +
    routesContent.slice(insertPosition);

  // 格式化代码
  const formattedContent = await prettier.format(newRoutesContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  await fs.writeFile(configPath, formattedContent);

  console.log(chalk.green(`Route ${route.name} added successfully`));
  return true;
}

/**
 * 配置权限
 */
export async function configurePermission(
  permission: PermissionConfig,
  options?: { outputFile?: string }
): Promise<boolean> {
  console.log(chalk.cyan(`Configuring permission: ${permission.id}`));

  const configFile = options?.outputFile || 'src/config/permissions.ts';
  const configPath = path.join(process.cwd(), configFile);

  let permissionsContent = '';
  if (await fs.pathExists(configPath)) {
    permissionsContent = await fs.readFile(configPath, 'utf-8');
  } else {
    permissionsContent = `export interface Permission {\n  id: string;\n  name: string;\n  type: 'menu' | 'button' | 'api';\n  parentId?: string;\n  order?: number;\n}\n\nconst permissions: Permission[] = [];\n\nexport default permissions;\n`;
  }

  // 生成权限代码
  const permissionCode = `{
  id: '${permission.id}',
  name: '${permission.name}',
  type: '${permission.type}',${permission.parentId ? `\n  parentId: '${permission.parentId}',` : ''}${permission.order ? `\n  order: ${permission.order},` : ''}
}`;

  // 检查是否已存在
  if (permissionsContent.includes(`id: '${permission.id}'`)) {
    console.warn(chalk.yellow(`Permission ${permission.id} already exists`));
    return false;
  }

  // 插入权限配置
  const insertPosition = permissionsContent.lastIndexOf('];');
  if (insertPosition === -1) {
    console.error(chalk.red('Invalid permissions config format'));
    return false;
  }

  const newPermissionsContent =
    permissionsContent.slice(0, insertPosition) +
    '\n  ' +
    permissionCode +
    '\n' +
    permissionsContent.slice(insertPosition);

  // 格式化代码
  const formattedContent = await prettier.format(newPermissionsContent, {
    parser: 'typescript',
    singleQuote: true,
  });

  await fs.writeFile(configPath, formattedContent);

  console.log(chalk.green(`Permission ${permission.id} configured successfully`));
  return true;
}

/**
 * 运行 prepared 生成 app.json
 */
export async function runPrepared(): Promise<boolean> {
  console.log(chalk.cyan('Running prepared script...'));

  try {
    const { execa } = await import('execa');
    await execa('npm', ['run', 'prepared'], { stdio: 'inherit' });
    console.log(chalk.green('Prepared script executed successfully'));
    return true;
  } catch (error: any) {
    console.error(chalk.red(`Error running prepared: ${error.message}`));
    return false;
  }
}

/**
 * 主应用采集
 */
export async function mainAppAnalyse(): Promise<boolean> {
  console.log(chalk.cyan('Running main app analysis...'));

  try {
    const { execa } = await import('execa');
    await execa('gulp', ['app-analysis'], { stdio: 'inherit' });
    console.log(chalk.green('Main app analysis completed successfully'));
    return true;
  } catch (error: any) {
    console.error(chalk.red(`Error analyzing: ${error.message}`));
    return false;
  }
}

// Helper functions

function generateRouteCode(route: RouteConfig): string {
  const metaStr = JSON.stringify(route.meta, null, 2).replace(/"/g, "'");

  return `  {
    path: '${route.path}',
    name: '${route.name}',
    component: () => import('${route.component}'),${route.redirect ? `\n    redirect: '${route.redirect}',` : ''}
    meta: ${metaStr},${route.children ? `\n    children: [\n      ${route.children.map((child) => generateRouteCode(child).trim()).join(',\n      ')}\n    ]` : ''}
  },`;
}

function resolveComponentPath(componentPath: string): string {
  // 解析 @ 别名
  if (componentPath.startsWith('@/')) {
    return path.join(process.cwd(), 'src', componentPath.slice(2));
  }
  return path.join(process.cwd(), componentPath);
}

function isValidAsyncComponent(componentPath: string): boolean {
  // 检查是否为异步导入语法
  return componentPath.startsWith('@/pages/') || componentPath.startsWith('@/views/');
}
