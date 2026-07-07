---
name: gulp-command-helper
description: Execute Gulp commands for monorepo project management, workspace builds, deployment, and dependency synchronization
---

# Gulp Command Helper

Execute Gulp commands for managing monorepo projects, workspaces, and deployments.

## When to Use

Use this skill when you need to:
- Switch between different client projects
- Build workspaces and packages
- Deploy applications
- Synchronize dependencies
- Manage project configurations

## Core Commands

### Project Management
- `gulp make` - Initialize directory and config files
- `gulp project-change -p <project>` - Switch to a specific project
- `gulp project-add` - Add new project
- `gulp prepare-changeDev` - Switch to development mode

### Workspace Builds
- `gulp workspaces-build` - Build all workspace applications
- `gulp packages-build` - Build toolbox packages
- `gulp workspaces-command -s -c "<command>"` - Execute command across workspaces

### Deployment
- `gulp publish-build --env <dev|test|prd>` - Build for deployment
- `gulp app-build` - Build all sub-applications
- `gulp main-build` - Build production main application
- `gulp independent-build` - Build independent applications

### Configuration Sync
- `gulp sync-config` - Synchronize configuration files
- `gulp sync-dep` - Synchronize dependency versions
- `gulp doc-build` - Generate HTML documentation

### Color Conversion
- `gulp color-convert` - Convert color values to color keys
- `gulp color-revert` - Convert color keys back to values
- `gulp color-convert-with-mul-n` - Multi-key conversion

## Usage Examples

### Switch to New Client Project
```bash
gulp project-change -p sczq
gulp prepare-changeDev
gulp workspaces-build
```

### Version Release
```bash
pnpm changeset
pnpm changeset version
gulp workspaces-command -s -c "git pull --rebase"
gulp workspaces-command -s -c "npm version patch --no-git-tag-version"
gulp workspaces-command -s -c "npm run prepared"
```

### Production Deployment
```bash
gulp publish-build --env prd
gulp publish-dist
```

## Important Notes

1. Run `pnpm setup` before first use
2. Backup important data before switching projects
3. Add `NODE_OPTIONS='--max-old-space-size=4096'` for memory issues
4. Gerrit push uses `refs/for/branch` by default

## Related Skills

- workspace-manager - Dependency and version management
- micro-app-route-config - Route configuration generation
