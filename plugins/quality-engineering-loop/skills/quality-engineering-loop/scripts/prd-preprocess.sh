#!/usr/bin/env bash
# PRD 预处理脚本
# 功能：检测 PRD 文件行数，超过阈值时自动提取目录结构和关键规则段落
# 用法：bash prd-preprocess.sh <prd-file.md> [threshold]
# 输出：精简后的 PRD 摘要（stdout）

set -euo pipefail

# 参数校验
if [ $# -lt 1 ]; then
    echo "用法: $0 <prd-file.md> [threshold]" >&2
    echo "  threshold: 行数阈值，默认 500" >&2
    exit 1
fi

PRD_FILE="$1"
THRESHOLD="${2:-500}"

if [ ! -f "$PRD_FILE" ]; then
    echo "错误: 文件不存在: $PRD_FILE" >&2
    exit 1
fi

# 统计行数
LINE_COUNT=$(wc -l < "$PRD_FILE" | tr -d ' ')

if [ "$LINE_COUNT" -le "$THRESHOLD" ]; then
    # 未超过阈值，直接输出原文
    cat "$PRD_FILE"
    exit 0
fi

# 超过阈值，提取摘要
echo "# PRD 摘要（原文 ${LINE_COUNT} 行，已精简）"
echo ""
echo "> 生成时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "> 原文行数: ${LINE_COUNT}"
echo "> 阈值: ${THRESHOLD}"
echo ""

# 1. 提取元数据（前 30 行中的 frontmatter 或标题信息）
echo "## 元数据"
head -30 "$PRD_FILE" | grep -E "^(#|name:|version:|author:|date:|PRD 编号|版本|负责人|最后更新)" || true
echo ""

# 2. 提取目录结构（所有标题行）
echo "## 目录结构"
grep -E "^#{1,6}\s" "$PRD_FILE" | head -50 || true
echo ""

# 3. 提取关键规则段落（包含"规则"、"公式"、"条件"、"约束"的段落）
echo "## 关键规则段落"
grep -B1 -A3 -E "(规则|公式|条件|约束|必须|禁止|>=|<=|<|>)" "$PRD_FILE" | head -100 || true
echo ""

# 4. 提取异常处理段落
echo "## 异常处理"
grep -B1 -A5 -E "(异常|错误|失败|降级|重试|超时)" "$PRD_FILE" | head -50 || true
echo ""

# 5. 提取状态流转（如果有）
echo "## 状态流转"
grep -B1 -A3 -E "(状态|流转|迁移|待支付|已支付|已取消|PENDING|PAID|CANCELLED)" "$PRD_FILE" | head -50 || true
echo ""

echo "---"
echo "*摘要结束，原文共 ${LINE_COUNT} 行*"
