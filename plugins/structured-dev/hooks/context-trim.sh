#!/usr/bin/env bash
# context-trim.sh
# 读取大文件时自动裁剪上下文，减少 token 消耗
# 大文件(>500行)截取首尾各50行；.log 文件只保留 ERROR/WARN
set -euo pipefail

FILE_PATH="${HOOK_FILE_PATH:-}"
MAX_LINES="${HOOK_MAX_LINES:-500}"
SUMMARY_HEAD=50
SUMMARY_TAIL=50

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

total_lines=$(wc -l < "$FILE_PATH" 2>/dev/null || echo 0)

# 小文件不处理
if [ "$total_lines" -le "$MAX_LINES" ]; then
  exit 0
fi

echo "[hook:trim] === 上下文裁剪: $FILE_PATH ==="
echo "[hook:trim] 原文件: $total_lines 行 (超过 $MAX_LINES 行阈值)"

# .log 文件特殊处理：只保留 ERROR/WARN/FATAL
if [[ "$FILE_PATH" == *.log ]]; then
  error_count=$(grep -cE "(ERROR|WARN|FATAL)" "$FILE_PATH" 2>/dev/null || echo 0)
  echo "[hook:trim] 日志文件: 发现 $error_count 条 ERROR/WARN/FATAL"

  if [ "$error_count" -gt 0 ] && [ "$error_count" -lt "$total_lines" ]; then
    grep -E "(ERROR|WARN|FATAL)" "$FILE_PATH" > "${FILE_PATH}.filtered"
    mv "${FILE_PATH}.filtered" "$FILE_PATH"
    filtered_lines=$(wc -l < "$FILE_PATH")
    echo "[hook:trim] ✅ 裁剪后: $filtered_lines 行 (仅 ERROR/WARN/FATAL)"
  fi
  exit 0
fi

# 普通大文件：截取首尾各 50 行
head_lines=$(head -n "$SUMMARY_HEAD" "$FILE_PATH")
tail_lines=$(tail -n "$SUMMARY_TAIL" "$FILE_PATH")
omitted=$((total_lines - SUMMARY_HEAD - SUMMARY_TAIL))

{
  echo "$head_lines"
  echo ""
  echo "... (中间省略 $omitted 行) ..."
  echo ""
  echo "$tail_lines"
} > "${FILE_PATH}.summary"

mv "${FILE_PATH}.summary" "$FILE_PATH"

new_lines=$(wc -l < "$FILE_PATH")
echo "[hook:trim] ✅ 裁剪后: $new_lines 行 (首 $SUMMARY_HEAD + 尾 $SUMMARY_TAIL)"
