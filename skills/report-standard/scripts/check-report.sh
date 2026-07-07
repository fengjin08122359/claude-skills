#!/bin/bash

# 报告质量检查脚本
# 用法: ./check-report.sh <report-file.md>

set -e

if [ -z "$1" ]; then
  echo "❌ 用法: ./check-report.sh <report-file.md>"
  exit 1
fi

REPORT_FILE="$1"

if [ ! -f "$REPORT_FILE" ]; then
  echo "❌ 文件不存在: $REPORT_FILE"
  exit 1
fi

echo "🔍 开始检查报告: $REPORT_FILE"
echo ""

# 检查 1: 文件是否存在且非空
if [ ! -s "$REPORT_FILE" ]; then
  echo "❌ 文件为空"
  exit 1
fi
echo "✅ 文件非空"

# 检查 2: 是否有 H1 标题
if ! grep -q "^# " "$REPORT_FILE"; then
  echo "❌ 缺少 H1 标题"
  exit 1
fi
echo "✅ 包含 H1 标题"

# 检查 3: 是否有执行摘要
if ! grep -q "## .*执行摘要\|## .*Executive Summary" "$REPORT_FILE"; then
  echo "⚠️  警告: 未找到执行摘要章节"
else
  echo "✅ 包含执行摘要"
fi

# 检查 4: 代码块是否有语言标识
if grep -q '```$' "$REPORT_FILE"; then
  echo "⚠️  警告: 发现没有语言标识的代码块"
else
  echo "✅ 代码块格式正确"
fi

# 检查 5: 表格格式
if grep -q "^|" "$REPORT_FILE"; then
  if ! grep -q "^|.*|.*|$" "$REPORT_FILE"; then
    echo "⚠️  警告: 表格格式可能不正确"
  else
    echo "✅ 表格格式正确"
  fi
fi

# 检查 6: 运行 markdownlint (如果已安装)
if command -v markdownlint &> /dev/null; then
  echo ""
  echo "📋 运行 markdownlint..."
  if markdownlint "$REPORT_FILE" --config "$(dirname "$0")/.markdownlintrc"; then
    echo "✅ markdownlint 检查通过"
  else
    echo "❌ markdownlint 发现错误"
    exit 1
  fi
else
  echo ""
  echo "ℹ️  提示: 安装 markdownlint 以获得更详细的检查"
  echo "   npm install -g markdownlint-cli"
fi

echo ""
echo "✨ 检查完成！"
echo ""
echo "📊 检查摘要:"
echo "  - 文件: $REPORT_FILE"
echo "  - 行数: $(wc -l < "$REPORT_FILE")"
echo "  - 字数: $(wc -w < "$REPORT_FILE")"
echo "  - 大小: $(du -h "$REPORT_FILE" | cut -f1)"
