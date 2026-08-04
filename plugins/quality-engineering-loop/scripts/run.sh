#!/usr/bin/env bash
# Plugin 级别的脚本入口
# 提供统一的脚本调用接口

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

usage() {
    echo "Quality Engineering Loop Plugin Scripts"
    echo ""
    echo "用法:"
    echo "  $0 prd-preprocess <prd-file> [threshold]"
    echo "  $0 validate-output <output-file> <schema-file>"
    echo ""
    echo "命令:"
    echo "  prd-preprocess    大 PRD 文件预处理（>500 行自动提取摘要）"
    echo "  validate-output   验证输出是否符合 schema"
    echo ""
    echo "示例:"
    echo "  $0 prd-preprocess docs/working/prd/order-calc.md"
    echo "  $0 validate-output output/report.json schemas/prd-analysis.schema.yaml"
}

if [ $# -lt 1 ]; then
    usage
    exit 1
fi

COMMAND="$1"
shift

case "$COMMAND" in
    prd-preprocess)
        exec bash "$PLUGIN_DIR/skills/quality-engineering-loop/scripts/prd-preprocess.sh" "$@"
        ;;
    validate-output)
        exec bash "$PLUGIN_DIR/skills/quality-engineering-loop/scripts/validate-output.sh" "$@"
        ;;
    *)
        echo "未知命令: $COMMAND" >&2
        usage
        exit 1
        ;;
esac
