# Excel to TypeScript Type Generator

根据 Excel 格式的 API 接口文档，自动生成完整的 TypeScript 类型定义文件。

## 🚀 快速开始

### 1. 准备 Excel 文件

确保你的 Excel 文件包含以下信息：

```
Sheet: 功能接口 - 全部
├── 基础信息（前 5 行）
│   ├── 功能名称、版本号、请求类型等
├── 输入参数（第 6 行开始）
│   ├── 参数名、类型、说明、是否必须
└── 输出参数
    ├── 参数名、类型、说明、是否必须
```

### 2. 使用技能

直接将 Excel 文件提供给技能：

```
请根据这个 Excel 生成 TypeScript 类型定义
```

### 3. 查看生成的文件

生成的文件将包含：
- ✅ 请求参数类型
- ✅ 响应参数类型
- ✅ 业务枚举类型
- ✅ 工具函数

## 📋 Excel 格式说明

### 标准格式

| 列 A | 列 B | 列 C | 列 D | 列 E | 列 F |
|------|------|------|------|------|------|
| 功能名称 | companyinfo/companysearch | | 服务名称 | | 版本号 v1 |
| 功能中文 | 企业名称搜索 | | 业务范围 | | 更新日期 |
| T2 功能号 | | | T1 功能号 | | 结果集返回 |
| 功能状态 | 公开 | | 请求类型 | GET,POST | HTTP |
| 功能描述 | 详细描述... | | | | |
| **输入参数** | **参数名** | **类型** | **说明** | **必须** | **备注** |
| | company_name | C | 公司名称 | 否 | |
| | application_num | C | 注册号 | 否 | |
| | page_no | N | 页数 | 否 | |
| **输出参数** | **参数名** | **类型** | **说明** | **必须** | **备注** |
| | company_name | C | 公司名称 | 是 | |
| | enterprise_code | C | 企业编码 | 是 | |

### 类型映射

| Excel | TypeScript | 说明 |
|-------|-----------|------|
| C | string | 字符串 |
| N | number | 数字 |
| B | boolean | 布尔 |
| Date | string | 日期 |
| Array | any[] | 数组 |

## 📁 示例文件

查看 [`examples/company-info.types.ts`](./examples/company-info.types.ts) 获取完整的生成示例。

## ⚙️ 配置选项

可选的配置文件 `excel-ts-config.yaml`:

```yaml
output:
  directory: "src/types/api/"
  suffix: ".types.ts"
  
types:
  strictMode: true
  generateBaseTypes: true
  
comments:
  addJSDoc: true
  language: "zh-CN"
  
utils:
  generateBuilders: true
  generateValidators: true
```

## 💡 使用场景

- ✅ 从 Excel API 文档生成类型定义
- ✅ 批量处理多个接口
- ✅ 保持类型与文档同步
- ✅ 标准化团队类型规范

## 🎯 生成内容

### 1. 基础类型

```typescript
type CString = string;
type NNumber = number;
type BBoolean = boolean;
```

### 2. 请求类型

```typescript
export interface CompanySearchRequest {
  company_name?: CString;
  application_num?: CString;
  page_no?: NNumber;
}
```

### 3. 响应类型

```typescript
export interface CompanyInfoItem {
  company_name: CString;
  enterprise_code: CString;
}

export interface CompanySearchResponse {
  code?: number;
  message?: string;
  data?: CompanyInfoItem[];
}
```

### 4. 业务枚举

```typescript
export enum CompanyTypeEnum {
  LIMITED_COMPANY = '有限责任公司',
  JOINT_STOCK_COMPANY = '股份有限公司'
}
```

### 5. 工具函数

```typescript
export function buildSearchRequest(
  keyword: string,
  options?: SearchOptions
): CompanySearchRequest;

export function validateSearchRequest(
  request: CompanySearchRequest
): boolean;
```

## 📖 完整文档

详细使用说明请查看 [SKILL.md](./SKILL.md)

## 🔧 相关技能

- **xlsx**: Excel 文件读取和处理
- **typescript-type-generator**: TypeScript 类型生成
- **api-mock-generator**: API Mock 数据生成

## ⚠️ 注意事项

1. **Excel 格式**: 必须符合标准格式要求
2. **参数命名**: 建议使用英文 snake_case
3. **类型标注**: 数组类型需要特别说明
4. **版本控制**: 建议添加版本标记

## 🐛 常见问题

### Q: Excel 格式不识别？

A: 请确保：
- 前 5 行包含基础信息
- 第 6 行开始是参数列表
- 包含必要的列标题

### Q: 如何自定义类型？

A: 提供配置或手动调整生成的文件

### Q: 如何处理复杂对象？

A: 在 Excel 中添加结构说明或生成后手动补充

## 📚 更新日志

### v1.0.0 (2026-03-24)
- ✅ 初始版本发布
- ✅ 支持基础类型生成
- ✅ 支持枚举生成
- ✅ 支持工具函数生成

---

**版本**: 1.0.0  
**最后更新**: 2026-03-24  
**维护者**: Your Team
