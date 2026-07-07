---
name: excel-typescript-generator
description: Generate TypeScript type definitions from Excel API documentation, including request/response types, business enums, and utility functions
version: 1.0.0
tags:
  - TypeScript
  - Excel
  - Type Generation
  - API
  - Automation
---

# Excel to TypeScript Type Generator

根据 Excel 格式的 API 接口文档，自动生成完整的 TypeScript 类型定义文件。

## 🎯 使用场景

当你有以下需求时使用此技能：

- ✅ **从 Excel 生成类型**: 将 Excel 格式的接口文档转为 TypeScript 类型定义
- ✅ **批量生成**: 一次性处理多个 Sheet 或多个 Excel 文件
- ✅ **完整类型系统**: 包含请求参数、响应参数、业务枚举、工具函数
- ✅ **标准化输出**: 统一的代码风格和注释规范
- ✅ **文档同步**: 保持类型定义与接口文档同步更新

## 📋 Excel 格式要求

### 标准格式结构

Excel 应包含以下关键信息：

#### 1. 基础信息区域（前 5 行）

| 行号 | A 列 | B 列 | C 列 | D 列 | E 列 | F 列 |
|------|-----|------|------|------|------|------|
| 1 | 功能名称 | companyinfo/companysearch | | 服务名称 | | 版本号 v1 |
| 2 | 功能中文 | 企业名称搜索 | | 业务范围 | | 更新日期 2026-3-24 |
| 3 | T2 功能号 | | | T1 功能号 | | 结果集返回 否 |
| 4 | 功能状态 | 公开 | | 请求类型 | GET,POST | HTTP |
| 5 | 功能描述 | 详细描述... | | | | |

#### 2. 输入参数区域（第 6 行开始）

| 参数名 | 类型 | 说明 | 必须 | 字典编号 | 备注 |
|--------|------|------|------|----------|------|
| company_name | C | 公司名称 | 否 | | 公司名称 |
| application_num | C | 注册号 | 否 | | 注册号 |
| credit_code | C | 统一社会信用代码 | 否 | | 统一社会信用代码 |
| page_no | N | 请求的页数 | 否 | | |
| page_count | N | 每页请求的条数 | 否 | | |

#### 3. 输出参数区域

| 参数名 | 类型 | 说明 | 必须 | 字典编号 | 备注 |
|--------|------|------|------|----------|------|
| company_name | C | 公司名称 | 是 | | 公司名称 |
| enterprise_code | C | 企业编码 | 是 | | 企业编码 |
| credit_code | C | 统一社会信用代码 | 是 | | 统一社会信用代码 |

### 类型映射规则

| Excel 类型 | TypeScript 类型 | 说明 |
|-----------|----------------|------|
| C | string | 字符串类型 |
| N | number | 数字类型 |
| B | boolean | 布尔类型 |
| A | any | 任意类型 |
| Date | string | 日期时间（ISO 格式） |
| Array | any[] | 数组类型 |
| Object | object | 对象类型 |

## 🔧 核心功能

### 1. 生成请求类型

```typescript
/**
 * 企业名称搜索 - 请求参数
 * @interface CompanySearchRequest
 */
export interface CompanySearchRequest {
  /**
   * 公司名称
   * @type {string}
   * @required false
   */
  company_name?: string;

  /**
   * 注册号
   * @type {string}
   * @required false
   */
  application_num?: string;

  /**
   * 请求的页数
   * @type {number}
   * @required false
   * @default 1
   */
  page_no?: number;
}
```

### 2. 生成响应类型

```typescript
/**
 * 单个企业信息数据项
 * @interface CompanyInfoItem
 */
export interface CompanyInfoItem {
  /**
   * 公司名称
   * @type {string}
   * @required true
   */
  company_name: string;

  /**
   * 企业编码
   * @type {string}
   * @required true
   */
  enterprise_code: string;
}

/**
 * 企业名称搜索 - 响应参数
 * @interface CompanySearchResponse
 */
export interface CompanySearchResponse {
  code?: number;
  message?: string;
  data?: CompanyInfoItem[];
  total?: number;
}
```

### 3. 生成业务枚举

```typescript
/**
 * 企业类型枚举
 */
export enum CompanyTypeEnum {
  LIMITED_COMPANY = '有限责任公司',
  JOINT_STOCK_COMPANY = '股份有限公司',
  SOLE_PROPRIETORSHIP = '个人独资企业',
  PARTNERSHIP = '合伙企业'
}
```

## 📝 使用步骤

### 步骤 1: 准备 Excel 文件

确保 Excel 文件格式正确，包含：
- ✅ 基础信息（功能名称、版本等）
- ✅ 输入参数列表
- ✅ 输出参数列表
- ✅ 参数类型和说明

### 步骤 2: 提供 Excel 文件

将 Excel 文件提供给技能，可以：
- 直接上传 Excel 文件
- 提供文件路径
- 复制 Excel 内容到剪贴板

### 步骤 3: 指定生成选项（可选）

```yaml
# 可选配置
options:
  outputDir: "src/types/api/"        # 输出目录
  fileName: "company-info.types.ts"  # 文件名
  generateEnums: true                # 是否生成业务枚举
  strictMode: true                   # 是否启用严格模式
  addComments: true                  # 是否添加详细注释
```

### 步骤 4: 生成并保存

技能会自动：
1. 解析 Excel 内容
2. 提取参数信息
3. 生成 TypeScript 类型
4. 保存到指定目录

## 💡 使用示例

### 示例 1: 简单类型生成

**输入**: Excel 文件 `company-search.xlsx`

**命令**:
```
请根据这个 Excel 生成 TypeScript 类型定义
```

**输出**: `company-info.types.ts`

### 示例 2: 批量生成

**输入**: 包含多个 Sheet 的 Excel 文件

**命令**:
```
为每个 Sheet 生成独立的类型文件，并在 index.ts 中统一导出
```

**输出**:
```
src/types/api/
├── company-search.types.ts
├── company-detail.types.ts
├── company-list.types.ts
└── index.ts
```

### 示例 3: 自定义配置

**命令**:
```
生成类型定义，要求：
1. 使用严格的 TypeScript 类型
2. 添加 JSDoc 注释
3. 输出到 src/interfaces/gsy/ 目录
```

## 🎯 生成的文件结构

### 标准输出结构

```typescript
/**
 * @fileoverview 聚源工商 - 企业信息接口类型定义
 * @description 根据 Excel 配置自动生成的 TypeScript 类型定义
 * @generated-by excel-to-typescript-skill
 * @date 2026-03-24
 */

// ============================================================================
// 基础类型定义
// ============================================================================

type CString = string;
type NNumber = number;
type BBoolean = boolean;
type AAny = any;

// ============================================================================
// 接口请求参数类型
// ============================================================================

export interface CompanySearchRequest {
  company_name?: CString;
  application_num?: CString;
  // ... 更多字段
}

// ============================================================================
// 接口响应参数类型
// ============================================================================

export interface CompanyInfoItem {
  company_name: CString;
  enterprise_code: CString;
  // ... 更多字段
}

export interface CompanySearchResponse {
  code?: number;
  message?: string;
  data?: CompanyInfoItem[];
  // ... 更多字段
}

// ============================================================================
// 业务枚举类型
// ============================================================================

export enum CompanyTypeEnum {
  LIMITED_COMPANY = '有限责任公司',
  // ... 更多枚举
}
```

## ⚙️ 配置选项

### 完整配置示例

```yaml
excel-typescript-generator:
  # 输出配置
  output:
    directory: "src/types/api/"      # 输出目录
    suffix: ".types.ts"              # 文件后缀
    encoding: "utf-8"                # 文件编码
    
  # 类型配置
  types:
    useTypeAlias: false              # 使用 interface 而非 type
    strictNullChecks: true           # 严格空检查
    generateBaseTypes: true          # 生成基础类型（C/N/B/A）
    
  # 注释配置
  comments:
    addJSDoc: true                   # 添加 JSDoc 注释
    addParamDescription: true        # 添加参数说明
    addExample: true                 # 添加示例
    language: "zh-CN"                # 注释语言
    
  # 业务配置
  business:
    generateEnums: true              # 生成业务枚举
    detectEnumFields: true           # 自动检测枚举字段
    customEnums: []                  # 自定义枚举
    
  # 导出配置
  exports:
    createIndexFile: true            # 创建 index.ts
    exportAll: true                  # 导出所有内容
    separateFiles: false             # 分文件导出
```

## 🔍 参数识别规则

### 必填字段识别

| Excel 值 | TypeScript | 说明 |
|---------|-----------|------|
| 是 | 必填字段 | 不带 `?` |
| 否 | 可选字段 | 带 `?` |
| 默认：xxx | 带默认值 | 注释中标注 |

### 特殊字段处理

```typescript
// 数组类型
enterprise_codes?: string[];  // Excel: 企业编码数组

// 逗号分隔的字段集合
fields?: string;  // Excel: 字段集合，示例："field1,field2,field3"

// 日期类型
establishment_date?: string;  // ISO 格式：YYYY-MM-DD

// 金额类型
registered_capital?: string;  // 保留原始字符串格式
```

## 🎨 代码风格

### 命名规范

- **接口**: PascalCase (e.g., `CompanySearchRequest`)
- **枚举**: PascalCase + Enum 后缀 (e.g., `CompanyTypeEnum`)
- **函数**: camelCase (e.g., `buildSearchRequest`)
- **常量**: UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`)

### 注释规范

```typescript
/**
 * 接口中文名称 - 请求参数
 * @interface InterfaceNameRequest
 * @description 详细的接口描述
 * @version v1
 * @endpoint api/endpoint/path
 * @method GET,POST
 */
export interface InterfaceNameRequest {
  /**
   * 字段中文说明
   * @type {string}
   * @required false
   * @default "默认值"
   * @example "示例值"
   */
  field_name?: string;
}
```

## ⚠️ 注意事项

### 1. Excel 格式要求

- ✅ 第一行必须是基础信息
- ✅ 输入参数从第 6 行开始
- ✅ 输出参数在输入参数之后
- ✅ 参数名使用英文（推荐 snake_case）

### 2. 类型映射

- ✅ C → string (文本类型)
- ✅ N → number (数字类型)
- ✅ B → boolean (布尔类型)
- ✅ Date → string (日期时间)

### 3. 特殊处理

- ⚠️ 数组类型需要手动标注或根据字段名推断
- ⚠️ 枚举类型需要提供字典编号或手动配置
- ⚠️ 复杂嵌套对象需要额外的结构说明

## 📚 相关文件

- [示例文件](./examples/company-info.types.ts) - 完整的生成示例
- [Excel 模板](./templates/api-template.xlsx) - Excel 模板文件
- [配置指南](./CONFIG.md) - 详细配置说明

## 🔄 与其他技能配合

- **xlsx**: 读取和处理 Excel 文件
- **typescript-type-generator**: 类型定义的进一步优化
- **api-mock-generator**: 基于生成的类型创建 Mock 数据

## 💻 命令行使用（如支持）

```bash
# 从 Excel 生成类型
npx excel-ts-gen --input api-docs.xlsx --output src/types/

# 批量生成
npx excel-ts-gen --input ./excels/ --output src/types/api/ --recursive

# 自定义配置
npx excel-ts-gen -i api.xlsx -o src/types/ -c config.yaml
```

## 🎯 最佳实践

### 1. Excel 维护

- 保持 Excel 格式标准化
- 使用统一的命名规范
- 添加完整的字段说明
- 及时更新接口文档

### 2. 类型管理

- 按业务模块分类存放
- 使用 index.ts 统一导出
- 添加版本控制标记
- 定期审查和重构

### 3. 代码质量

- 启用 ESLint 检查
- 遵循项目 TypeScript 规范
- 添加单元测试覆盖
- 保持注释和代码同步

## 🐛 常见问题

### Q1: Excel 格式不识别怎么办？

**A**: 请确保 Excel 格式符合标准要求：
- 前 5 行包含基础信息
- 第 6 行开始是参数列表
- 包含"参数名、类型、说明、必须"等列

### Q2: 如何自定义类型映射？

**A**: 在配置文件中添加自定义映射：
```yaml
typeMapping:
  C: string
  N: number
  Money: string  # 自定义类型
```

### Q3: 如何处理复杂的嵌套对象？

**A**: 在 Excel 中添加结构说明，或在生成后手动调整：
```typescript
interface ComplexObject {
  nested: {
    field1: string;
    field2: number;
  };
}
```

### Q4: 如何保持类型与接口同步？

**A**: 
1. 建立 Excel 更新流程
2. 定期重新生成类型
3. 使用版本控制对比差异
4. 添加类型变更审查

## 📖 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [JSDoc 规范](https://jsdoc.app/)
- [API 设计最佳实践](https://swagger.io/docs/specification/about/)

---

**技能版本**: 1.0.0  
**最后更新**: 2026-03-24  
**作者**: Your Team
