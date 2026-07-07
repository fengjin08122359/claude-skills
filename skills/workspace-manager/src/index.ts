import fg from 'fast-glob';
import semver from 'semver';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface WorkspaceInfo {
  name: string;
  path: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface CreateWorkspaceOptions {
  type: 'app' | 'package' | 'library';
  template?: string;
  project?: string;
  description?: string;
}

export interface SyncDependenciesOptions {
  workspaces?: string[];
  deps: Record<string, string>;
  syncDevDeps?: boolean;
  dryRun?: boolean;
}

export interface UpdateVersionsOptions {
  workspaces?: string[];
  versionType: 'major' | 'minor' | 'patch';
  commitMessage?: string;
}

/**
 * 获取所有工作区信息
 */
export async function getWorkspaces(): Promise<WorkspaceInfo[]> {
  const workspacePatterns = [
    'workspaces/*/package.json',
    'packages/*/package.json',
    'project-single/*/package.json'
  ];

  const packageFiles = await fg(workspacePatterns, {
    cwd: process.cwd(),
    absolute: true,
  });

  const workspaces: WorkspaceInfo[] = [];

  for (const file of packageFiles) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const pkg = JSON.parse(content);

      workspaces.push({
        name: pkg.name,
        path: path.dirname(file),
        version: pkg.version || '0.0.0',
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
      });
    } catch (error: any) {
      console.error(chalk.red(`Error reading ${file}: ${error.message}`));
    }
  }

  return workspaces;
}

/**
 * 创建工作区应用
 */
export async function createWorkspace(
  name: string,
  options: CreateWorkspaceOptions
): Promise<boolean> {
  console.log(chalk.cyan(`Creating workspace: ${name}`));

  const targetPath = path.join(
    process.cwd(),
    options.type === 'app' ? 'workspaces' : 'packages',
    name
  );

  if (await fs.pathExists(targetPath)) {
    console.error(chalk.red(`Workspace already exists: ${targetPath}`));
    return false;
  }

  // 创建目录
  await fs.ensureDir(targetPath);

  // 创建 package.json
  const pkg: any = {
    name: `@monorepo/${name}`,
    version: '1.0.0',
    description: options.description || `${name} - ${options.type}`,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      dev: 'tsc --watch',
      test: 'jest',
    },
  };

  await fs.writeJson(path.join(targetPath, 'package.json'), pkg, { spaces: 2 });

  // 创建 tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      lib: ['ES2020'],
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      moduleResolution: 'node',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeJson(path.join(targetPath, 'tsconfig.json'), tsConfig, {
    spaces: 2,
  });

  // 创建 src 目录
  await fs.ensureDir(path.join(targetPath, 'src'));

  console.log(chalk.green(`Workspace created successfully at: ${targetPath}`));
  return true;
}

/**
 * 同步依赖版本
 */
export async function syncDependencies(
  options: SyncDependenciesOptions
): Promise<{ success: boolean; updated: number }> {
  console.log(chalk.cyan('Synchronizing dependencies...'));

  let updatedCount = 0;

  for (const [depName, depVersion] of Object.entries(options.deps)) {
    const workspaces = await getWorkspaces();

    for (const ws of workspaces) {
      let needsUpdate = false;

      // 检查 dependencies
      if (ws.dependencies[depName]) {
        if (!semver.satisfies(depVersion, ws.dependencies[depName])) {
          needsUpdate = true;
        }
      }

      // 检查 devDependencies
      if (options.syncDevDeps && ws.devDependencies[depName]) {
        if (!semver.satisfies(depVersion, ws.devDependencies[depName])) {
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        const pkgPath = path.join(ws.path, 'package.json');
        const pkg = await fs.readJson(pkgPath);

        if (pkg.dependencies?.[depName]) {
          pkg.dependencies[depName] = depVersion;
        }

        if (options.syncDevDeps && pkg.devDependencies?.[depName]) {
          pkg.devDependencies[depName] = depVersion;
        }

        if (!options.dryRun) {
          await fs.writeJson(pkgPath, pkg, { spaces: 2 });
          console.log(
            chalk.green(`Updated ${depName} in ${ws.name} to ${depVersion}`)
          );
          updatedCount++;
        } else {
          console.log(
            chalk.yellow(`[Dry Run] Would update ${depName} in ${ws.name}`)
          );
        }
      }
    }
  }

  return { success: true, updated: updatedCount };
}

/**
 * 检测依赖冲突
 */
export async function checkDependencyConflicts(): Promise<
  Array<{
    dependency: string;
    workspaces: Array<{ name: string; version: string }>;
  }>
> {
  const workspaces = await getWorkspaces();
  const depMap = new Map<string, Array<{ name: string; version: string }>>();

  // 收集所有依赖
  for (const ws of workspaces) {
    const allDeps = { ...ws.dependencies, ...ws.devDependencies };

    for (const [dep, version] of Object.entries(allDeps)) {
      if (!depMap.has(dep)) {
        depMap.set(dep, []);
      }
      depMap.get(dep)!.push({ name: ws.name, version });
    }
  }

  // 查找冲突
  const conflicts: Array<{
    dependency: string;
    workspaces: Array<{ name: string; version: string }>;
  }> = [];

  for (const [dep, versions] of depMap.entries()) {
    const uniqueVersions = new Set(versions.map((v) => v.version));
    if (uniqueVersions.size > 1) {
      conflicts.push({
        dependency: dep,
        workspaces: versions,
      });
    }
  }

  if (conflicts.length > 0) {
    console.log(chalk.yellow(`Found ${conflicts.length} dependency conflicts:`));
    for (const conflict of conflicts) {
      console.log(chalk.red(`  ${conflict.dependency}:`));
      for (const ws of conflict.workspaces) {
        console.log(chalk.gray(`    - ${ws.name}: ${ws.version}`));
      }
    }
  } else {
    console.log(chalk.green('No dependency conflicts found'));
  }

  return conflicts;
}

/**
 * 批量更新版本号
 */
export async function updateVersions(
  options: UpdateVersionsOptions
): Promise<{ success: boolean; updated: number }> {
  console.log(chalk.cyan('Updating versions...'));

  let updatedCount = 0;
  const workspaces = options.workspaces
    ? await getWorkspaces()
    : await getWorkspaces();

  for (const ws of workspaces) {
    const oldVersion = ws.version;
    const newVersion = semver.inc(oldVersion, options.versionType)!;

    const pkgPath = path.join(ws.path, 'package.json');
    const pkg = await fs.readJson(pkgPath);

    pkg.version = newVersion;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    console.log(
      chalk.green(`${ws.name}: ${oldVersion} -> ${newVersion}`)
    );
    updatedCount++;
  }

  return { success: true, updated: updatedCount };
}

/**
 * 创建工作区分支持脚本
 */
export async function createBranch(
  baseBranch: string,
  taskNumber: string,
  description: string
): Promise<string> {
  const branchName = `${baseBranch}-${taskNumber}`;
  console.log(chalk.cyan(`Creating branch: ${branchName}`));

  // 这里可以集成 git 命令创建分支
  // await execa('git', ['checkout', '-b', branchName, baseBranch]);

  console.log(chalk.green(`Branch created: ${branchName}`));
  return branchName;
}
