---
name: workspace-manager
description: Manage monorepo workspaces, synchronize dependencies, update versions, and create branches
---

# Workspace Manager

Manage monorepo workspaces with pnpm, handle dependency synchronization, version management, and branch creation.

## When to Use

Use this skill when you need to:
- Create new workspace applications or packages
- Synchronize dependencies across workspaces
- Check for dependency conflicts
- Update package versions in bulk
- Create feature branches following project conventions

## Core Functions

### Get Workspaces
Retrieve information about all workspaces in the monorepo.

```typescript
await getWorkspaces()
// Returns: Array of workspace info with name, path, version, dependencies
```

### Create Workspace
Create a new workspace application or package.

```typescript
await createWorkspace('sczq-bond', {
  type: 'app',  // 'app' | 'package' | 'library'
  template: 'app-template',
  project: 'sczq',
  description: 'Bond analysis module'
})
```

### Sync Dependencies
Synchronize dependency versions across specified workspaces.

```typescript
await syncDependencies({
  workspaces: ['workspaces/app-*'],
  deps: {
    'vue': '2.7.16',
    'element-ui': '^2.15.13'
  },
  syncDevDeps: true,
  dryRun: false
})
```

### Check Dependency Conflicts
Detect version conflicts across workspaces.

```typescript
const conflicts = await checkDependencyConflicts()
// Returns conflicts with dependency name and different versions
```

### Update Versions
Bulk update package versions using semver.

```typescript
await updateVersions({
  workspaces: ['workspaces/app-*'],
  versionType: 'patch',  // 'major' | 'minor' | 'patch'
  commitMessage: 'T202602103982 Version update'
})
```

### Create Branch
Create a feature branch following naming conventions.

```typescript
await createBranch(
  'main',           // base branch
  'T202602103982',  // task number
  'bond-feature'    // description
)
// Creates: main-T202602103982
```

## Usage Examples

### Initialize New Project
```typescript
// Create workspace
await createWorkspace('sczq-subject', {
  type: 'app',
  project: 'sczq'
})

// Sync dependencies
await syncDependencies({
  deps: {
    'vue': '2.7.16',
    'typescript': '^4.9.4'
  }
})
```

### Version Release Workflow
```typescript
// Check for conflicts first
const conflicts = await checkDependencyConflicts()

// Update all workspace versions
await updateVersions({
  workspaces: ['workspaces/*'],
  versionType: 'patch'
})
```

## Branch Naming Convention

Format: `{baseBranch}-{taskNumber}`

Examples:
- `main-T202602103982`
- `develop-FEAT-12345`

## Related Skills

- gulp-command-helper - Execute Gulp commands for workspace builds
- micro-app-route-config - Configure routes for new applications
