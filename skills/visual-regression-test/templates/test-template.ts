/**
 * {{PAGE_DESC}} — 视觉回归测试
 *
 * UED 设计图目录：ued/{{PAGE_NAME}}/
 *
 * 使用方式:
 *   1. 使用浏览器插件截取当前页面，放入 test-results/visual/ 目录
 *   2. 将 UED 设计稿放入 ued/{{PAGE_NAME}}/ 目录
 *   3. 运行测试进行对比
 *
 * 注意: 本测试不依赖认证状态，切片由用户手动提供
 *
 * 分层标准:
 *   Pass (< 5%):  结构一致，设计令牌符合规范 → ✅ 通过
 *   Warn (5%~10%): 数据驱动变更，栅格未破坏 → ⚠️ 警告
 *   Fail (> 10%): DOM错乱/组件缺失/样式丢失 → ❌ 失败
 */
import { test } from '../../test-harness/external-context';
import { vlmExpectScreenshot } from '../../lib/vlm-expect';

// ── 常量定义 ─

/** UED 设计图目录 */
const UED_DIR = 'ued/{{PAGE_NAME}}';

/** 通过层阈值（< 5% 直接通过） */
const PASS_THRESHOLD = 0.05;

/** 警告层阈值（5% ~ 10% 为警告，> 10% 为失败） */
const WARN_THRESHOLD = 0.10;

/**
 * 动态忽略区域 — UED 无法控制的数据字段
 *
 * 在对比时跳过这些区域的像素差异，避免因数据内容不同导致的误报。
 * 常见场景：动态用户名、时间戳、新闻正文、滚动条位置等。
 */
const IGNORE_REGIONS: Array<{ name: string; selector: string }> = [
  // 示例：忽略动态内容区域
  // { name: '动态正文', selector: '.article-content' },
  // { name: '时间戳', selector: '.publish-time' },
];

// ── 测试用例 ──

test.describe('{{PAGE_DESC}} — 视觉回归', () => {

  /**
   * 全页截图 — 与 UED 设计图对比（分层判定）
   *
   * 切片由用户手动提供（浏览器插件/系统截图），
   * 测试通过 skipScreenshot=true 跳过自动截图，
   * 直接读取 test-results/visual/ 中已有的截图文件进行对比。
   *
   * 三层判定：
   * - Pass（< 5%）：结构一致，直接通过
   * - Warn（5% ~ 10%）：可能为数据驱动变更，警告但不阻断
   * - Fail（> 10%）：可能存在视觉回归，阻断并输出 VLM 提示符
   */
  test('全页截图 — 初始加载', async ({ page }) => {
    const result = await vlmExpectScreenshot(page, {
      name: '{{PAGE_NAME}}-full-initial',
      pageContext: '{{PAGE_CONTEXT}}',
      uedDir: UED_DIR,
      passThreshold: PASS_THRESHOLD,
      warnThreshold: WARN_THRESHOLD,
      skipScreenshot: true,
      ignoreRegions: IGNORE_REGIONS,
    });

    // Fail 层阻断测试，Pass/Warn 层均通过
    if (!result.passed) {
      throw new Error(
        `视觉回归检测失败：${result.judgeResult.diffPercent} 超过失败阈值 ${(WARN_THRESHOLD * 100).toFixed(0)}%\n` +
        `请检查差异图：${result.diffPath}\n` +
        `分层结果：${result.layer}\n` +
        (result.judgeResult.judgment?.explanation || '')
      );
    }
  });

});
