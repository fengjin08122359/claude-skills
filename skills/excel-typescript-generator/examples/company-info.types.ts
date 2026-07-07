/**
 * @fileoverview 聚源工商 - 企业信息接口类型定义
 * @description 根据 Excel 配置自动生成的 TypeScript 类型定义
 * @generated-by excel-to-typescript-skill
 * @date 2026-03-24
 */

// ============================================================================
// 基础类型定义
// ============================================================================

/** 字符串类型 */
type CString = string;

/** 数字类型 */
type NNumber = number;

/** 布尔类型 */
type BBoolean = boolean;

/** 任意类型 */
type AAny = any;

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
   * 注册号
   * @type {CString}
   * @required false
   */
  application_num?: CString;

  /**
   * 统一社会信用代码
   * @type {CString}
   * @required false
   */
  credit_code?: CString;

  /**
   * 请求的页数
   * @type {NNumber}
   * @required false
   * @default 1
   */
  page_no?: NNumber;

  /**
   * 每页请求的条数
   * @type {NNumber}
   * @required false
   * @default 10
   */
  page_count?: NNumber;

  /**
   * 企业 ID
   * @type {CString}
   * @required false
   */
  company_code?: CString;

  /**
   * 企业编码数组
   * @type {CString[]}
   * @required false
   */
  enterprise_codes?: CString[];

  /**
   * 字段集合
   * @type {CString}
   * @required false
   * @example "company_name,credit_code,application_num"
   */
  fields?: CString;
}

// ============================================================================
// 接口响应参数类型
// ============================================================================

/**
 * 单个企业信息数据项
 * @interface CompanyInfoItem
 * @description 企业信息列表中的单条记录
 */
interface CompanyInfoItem {
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

  /**
   * 注册号
   * @type {CString}
   * @required true
   */
  application_num: CString;

  /**
   * 统一社会信用代码
   * @type {CString}
   * @required true
   */
  credit_code: CString;

  /**
   * 公司 ID
   * @type {CString}
   * @required true
   */
  company_code: CString;
}

/**
 * 企业名称搜索 - 响应参数
 * @interface CompanySearchResponse
 * @description 企业名称搜索接口返回结果
 * @version v1
 */
export interface CompanySearchResponse {
  /**
   * 状态码
   * @type {NNumber}
   */
  code?: NNumber;

  /**
   * 消息
   * @type {CString}
   */
  message?: CString;

  /**
   * 数据列表
   * @type {CompanyInfoItem[]}
   */
  data?: CompanyInfoItem[];

  /**
   * 总记录数
   * @type {NNumber}
   */
  total?: NNumber;

  /**
   * 当前页码
   * @type {NNumber}
   */
  page_no?: NNumber;

  /**
   * 每页条数
   * @type {NNumber}
   */
  page_count?: NNumber;
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * API 响应基础结构
 * @template T - 数据类型
 */
interface ApiResponse<T> {
  code: NNumber;
  message: CString;
  data: T;
  timestamp?: NNumber;
}
// ============================================================================
// 导出所有类型
// ============================================================================

export type {
  CString,
  NNumber,
  BBoolean,
  AAny,
  CompanyInfoItem,
  ApiResponse
};
