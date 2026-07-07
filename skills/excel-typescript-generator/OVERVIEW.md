# 📊 Excel to TypeScript 类型生成技能

## 🎯 技能概述

本技能可以根据 **Excel 格式的 API 接口文档**，自动生成完整的 **TypeScript 类型定义文件**。

### 核心能力

- ✅ **自动解析 Excel**: 识别接口信息、输入参数、输出参数
- ✅ **生成类型定义**: Interface、Type、Enum 等
- ✅ **生成工具函数**: Builder、Validator、Formatter
- ✅ **标准化注释**: JSDoc 格式的完整注释
- ✅ **批量处理**: 支持多 Sheet、多文件批量生成

---

## 📁 文件结构

```
excel-typescript-generator/
├── SKILL.md                      # ⭐ 完整技能文档
├── README.md                     # 📖 快速开始指南
├── package.json                  # 📦 依赖配置
├── examples/
│   └── company-info.types.ts     # ⭐ 生成的示例文件
└── templates/                    # (可选) Excel 模板
    └── api-template.xlsx
```

---

## 🚀 快速使用

### 方式 1: 直接使用（推荐）

1. **准备 Excel 文件**
   - 文件格式参考：`聚源工商_工商企业信息 (1).xlsx`
   
2. **提供给技能**
   ```
   请根据这个 Excel 生成 TypeScript 类型定义
   ```

3. **获取生成的文件**
   - 自动生成 `company-info.types.ts`
   - 包含完整的类型定义和工具函数

### 方式 2: 指定配置

```yaml
# excel-ts-config.yaml
output:
  directory: "src/types/api/"
  fileName: "company-info.types.ts"
  
options:
  strictMode: true
  generateUtils: true
  generateEnums: true
```

---

## 📋 Excel 格式要求

### 标准结构

#### 第 1-5 行：基础信息

```
行 1: 功能名称 | companyinfo/companysearch | | 服务名称 | | 版本号 v1
行 2: 功能中文 | 企业名称搜索 | | 业务范围 | | 更新日期 2026-3-24
行 3: T2 功能号 | | | T1 功能号 | | 结果集返回 否
行 4: 功能状态 | 公开 | | 请求类型 | GET,POST | HTTP
行 5: 功能描述 | 企业名称搜索，配合其他工商接口使用...
```

#### 第 6 行起：输入参数

```
| 参数名 | 类型 | 说明 | 必须 | 字典编号 | 备注 |
|--------|------|------|------|----------|------|
| company_name | C | 公司名称 | 否 | | 公司名称 |
| application_num | C | 注册号 | 否 | | |
| page_no | N | 页数 | 否 | | |
```

#### 输出参数区域

```
| 参数名 | 类型 | 说明 | 必须 | 字典编号 | 备注 |
|--------|------|------|------|----------|------|
| company_name | C | 公司名称 | 是 | | |
| enterprise_code | C | 企业编码 | 是 | | |
```

### 类型代码

| Excel | TypeScript | 说明 |
|-------|-----------|------|
| C | string | 字符串 |
| N | number | 数字 |
| B | boolean | 布尔 |
| Date | string | 日期时间 |
| Array | any[] | 数组 |

---

## 💡 生成效果示例

### 输入：Excel 内容

```
功能名称：companyinfo/companysearch
功能中文：企业名称搜索
版本号：v1

输入参数:
- company_name (C): 公司名称 - 可选
- page_no (N): 页数 - 默认 1

输出参数:
- company_name (C): 公司名称 - 必填
- enterprise_code (C): 企业编码 - 必填
```

### 输出：TypeScript 类型

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

// ============================================================================
// 接口请求参数类型
// ============================================================================

/**
 * 企业名称搜索 - 请求参数
 * @interface CompanySearchRequest
 * @description 企业名称搜索，配合其他工商接口使用
 * @version v1
 * @endpoint companyinfo/companysearch
 * @method GET,POST
 */
export interface CompanySearchRequest {
  /**
   * 公司名称
   * @type {CString}
   * @required false
   */
  company_name?: CString;

  /**
   * 请求的页数
   * @type {NNumber}
   * @required false
   * @default 1
   */
  page_no?: NNumber;
}

// ============================================================================
// 接口响应参数类型
// ============================================================================

/**
 * 单个企业信息数据项
 * @interface CompanyInfoItem
 */
export interface CompanyInfoItem {
  /**
   * 公司名称
   * @type {CString}
   * @required true
   */
  company_name: CString;

  /**
   * 企业编码
   * @type {CString}
   * @required true
   */
  enterprise_code: CString;
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

---

## 🎯 完整功能清单

### 1. 类型生成

- ✅ 基础类型定义 (C/N/B/A)
- ✅ 请求参数接口
- ✅ 响应参数接口
- ✅ 嵌套对象类型
- ✅ 数组类型
- ✅ 联合类型

### 2. 枚举生成

- ✅ 业务枚举类型
- ✅ 状态枚举
- ✅ 类型枚举
- ✅ 字典映射

### 4. 注释生成

- ✅ JSDoc 标准注释
- ✅ 参数说明
- ✅ 类型标注
- ✅ 示例代码
- ✅ 版本信息

---

## ⚙️ 高级配置

### 完整配置示例

```yaml
# excel-ts-config.yaml
excel-typescript-generator:
  # 输出配置
  output:
    directory: "src/types/api/"
    suffix: ".types.ts"
    encoding: "utf-8"
    createIndex: true
    
  # 类型配置
  types:
    useInterface: true           # 使用 interface 而非 type
    strictNullChecks: true       # 严格空检查
    generateBaseTypes: true      # 生成 C/N/B/A 基础类型
    customTypes: {}              # 自定义类型映射
    
  # 注释配置
  comments:
    addJSDoc: true
    addParamDescription: true
    addExample: true
    addVersion: true
    language: "zh-CN"
    
  # 业务配置
  business:
    generateEnums: true
    detectEnumFields: true
    enumPrefix: true             # 枚举添加前缀
    customEnums: []
    
  # 导出配置
  exports:
    createIndexFile: true
    exportAll: true
    separateFiles: false
    barrelExports: true
```

---

## 📚 实际案例

### 案例 1: 简单接口

**Excel**: `user-login.xlsx`

```
功能名称：user/login
功能中文：用户登录

输入参数:
- username (C): 用户名 - 必填
- password (C): 密码 - 必填

输出参数:
- token (C): 访问令牌 - 必填
- expires_in (N): 过期时间 - 必填
```

**生成**: `user-login.types.ts`

```typescript
export interface UserLoginRequest {
  username: CString;
  password: CString;
}

export interface UserLoginResponse {
  token: CString;
  expires_in: NNumber;
}
```

### 案例 2: 复杂接口

**Excel**: `company-detail.xlsx`

```
功能名称：companyinfo/detail
功能中文：企业详细信息查询

输入参数:
- credit_code (C): 统一社会信用代码 - 必填
- fields (C): 返回字段 - 可选

输出参数:
- company_name (C): 公司名称 - 必填
- company_type (C): 企业类型 - 必填
- legal_representative (C): 法人 - 可选
- registered_capital (N): 注册资本 - 可选
- establishment_date (Date): 成立日期 - 可选
```

**生成**: `company-detail.types.ts`

```typescript
export interface CompanyDetailRequest {
  credit_code: CString;
  fields?: CString;
}

export interface CompanyDetailResponse {
  company_name: CString;
  company_type: CString;
  legal_representative?: CString;
  registered_capital?: NNumber;
  establishment_date?: string; // ISO 格式
}

export enum CompanyTypeEnum {
  LIMITED_COMPANY = '有限责任公司',
  JOINT_STOCK_COMPANY = '股份有限公司'
}
```

---

## 🔧 与其他技能配合

### 技能组合 1: 完整的前端开发流程

1. **excel-typescript-generator**: 生成类型定义
2. **api-mock-generator**: 基于类型生成 Mock 数据
3. **frontend-design**: 创建前端界面
4. **echarts-chart-builder**: 生成图表组件

### 技能组合 2: 测试驱动开发

1. **excel-typescript-generator**: 生成类型
2. **jest-test-generator**: 基于类型生成测试
3. **playwright-element-test**: E2E 测试

---

## ⚠️ 注意事项

### 1. Excel 格式

- ✅ 第一行必须是基础信息
- ✅ 参数列表必须有清晰的表头
- ✅ 类型列必须使用标准代码（C/N/B/A）
- ✅ 必填列使用"是/否"标注

### 2. 命名规范

- ✅ 参数名：snake_case（推荐）
- ✅ 接口名：PascalCase（自动生成）
- ✅ 枚举名：PascalCase + Enum 后缀

### 3. 特殊处理

- ⚠️ 数组类型：需要在说明中标注或手动配置
- ⚠️ 嵌套对象：需要提供结构说明
- ⚠️ 枚举字段：需要提供字典编号

---

## 🐛 常见问题

### Q1: Excel 格式不符合要求？

**A**: 请参考模板文件调整格式，或提供详细说明让技能辅助调整。

### Q2: 如何生成自定义类型？

**A**: 
```yaml
# 配置文件中添加
customTypes:
  Money: string
  DateString: string
  IDCard: string
```

### Q3: 如何处理分页参数？

**A**: Excel 中明确标注分页字段，技能会自动添加默认值：
```typescript
page_no?: NNumber;  // @default 1
page_count?: NNumber;  // @default 10
```

### Q4: 如何保持类型与 Excel 同步？

**A**: 
1. 建立 Excel 更新流程
2. 定期重新生成类型
3. 使用 Git 对比差异
4. 审查后合并

---

## 📖 参考资源

- [完整技能文档](./SKILL.md)
- [示例文件](./examples/company-info.types.ts)
- [配置指南](./CONFIG.md)
- [Excel 模板](./templates/api-template.xlsx)

---

## 🎉 立即开始

### 第一步：准备 Excel 文件

确保你的 Excel 文件格式正确

### 第二步：使用技能

```
请根据这个 Excel 生成 TypeScript 类型定义
```

### 第三步：集成到项目

```typescript
// src/api/company.ts
import { 
  CompanySearchRequest,
  CompanySearchResponse
} from '@/types/api/company-info.types';
```

---

**技能版本**: 1.0.0  
**创建日期**: 2026-03-24  
**适用场景**: API 类型定义、前后端协作、文档同步
