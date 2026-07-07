---
name: micro-app-route-config
description: Generate micro-frontend route configurations, permissions, and app.json for main application analysis
---

# Micro App Route Config

Generate route configurations, permission settings, and app.json for micro-frontend architecture following main application collection standards.

## When to Use

Use this skill when you need to:
- Add new routes to a micro-frontend application
- Configure route permissions
- Generate app.json for main application analysis
- Set up route meta information

## Core Functions

### Generate Route
Create a route configuration with async component loading.

```typescript
await generateRoute({
  path: '/bond/:code',
  name: 'BondDetail',
  component: '@/pages/bond/detail/index.vue',
  redirect: undefined,
  meta: {
    title: 'Bond Detail',
    permission: 'bond.view',
    keepAlive: true,
    icon: 'bond-icon',
    hidden: false,
    affix: false,
    breadcrumb: true
  }
})
```

### Configure Permission
Add permission configuration for menu, button, or API access.

```typescript
await configurePermission({
  id: 'bond.view',
  name: 'Bond View',
  type: 'menu',  // 'menu' | 'button' | 'api'
  parentId: undefined,
  order: 1
})
```

### Run Prepared
Execute prepared script to generate app.json.

```typescript
await runPrepared()
```

### Main Application Analysis
Run main application analysis to collect sub-application routes.

```typescript
await mainAppAnalyse()
// Executes: gulp app-analysis
```

## Validation Rules

The skill automatically validates:
- ✅ Component uses async import syntax (`@/pages/...`)
- ✅ Permission configuration completeness
- ✅ Route naming conventions (PascalCase)
- ✅ Meta information integrity

## Usage Examples

### Complete Route Setup
```typescript
// 1. Generate route
await generateRoute({
  path: '/bond/analysis/:code',
  name: 'BondAnalysis',
  component: '@/pages/bond/analysis/index.vue',
  meta: {
    title: 'Bond Analysis',
    permission: 'bond.analyze',
    keepAlive: true
  }
})

// 2. Configure permission
await configurePermission({
  id: 'bond.analyze',
  name: 'Bond Analysis',
  type: 'menu'
})

// 3. Generate app.json
await runPrepared()

// 4. Collect in main application
await mainAppAnalyse()
```

### Nested Routes
```typescript
await generateRoute({
  path: '/bond',
  name: 'Bond',
  component: '@/pages/bond/layout.vue',
  children: [
    {
      path: ':code',
      name: 'BondDetail',
      component: '@/pages/bond/detail/index.vue',
      meta: {
        title: 'Bond Detail',
        permission: 'bond.view'
      }
    }
  ]
})
```

## Component Import Format

Always use async imports with `@/pages/` or `@/views/` prefix:

```typescript
component: () => import('@/pages/bond/detail/index.vue')
```

## Related Skills

- workspace-manager - Create new workspace applications
- typescript-type-generator - Generate route type definitions
