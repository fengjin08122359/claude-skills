#!/usr/bin/env bash
# Pre-skill execution hook
# 功能：在执行 skill 前预处理输入
# - 大 PRD 文件（>500行）自动提取摘要
# - 检测执行环境并记录
#
# 用法：由 hooks 系统自动调用，不应手动执行
# 环境变量：
#   HOOK_SKILL_NAME - 即将执行的 skill 名称
#   HOOK_INPUT_FILE - 输入文件路径
#   HOOK_TEMP_DIR   - 临时工作目录

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_NAME="${HOOK_SKILL_NAME:-}"
INPUT_FILE="${HOOK_INPUT_FILE:-}"
TEMP_DIR="${HOOK_TEMP_DIR:-}"

# 检测并记录环境信息
detect_environment() {
    local env_file="${TEMP_DIR:-/tmp}/.env.json"
    mkdir -p "$(dirname "$env_file")"

    cat > "$env_file" << EOF
{
  "os": "$(uname -s 2>/dev/null || echo 'Windows')",
  "project_root": "$(git rev-parse --show-toplevel 2>/dev/null || pwd)",
  "timestamp": "$(date '+%Y-%m-%dT%H:%M:%S%z')",
  "shell": "${SHELL:-unknown}",
  "node_version": "$(node -v 2>/dev/null || echo 'not installed')",
  "skill_name": "$SKILL_NAME"
}
EOF
    echo "[hook] 环境信息已保存: $env_file"
}

# PRD 预处理：大文件自动提取摘要
preprocess_prd() {
    local prd_file="$1"
    local threshold="${2:-500}"
    local line_count

    if [ ! -f "$prd_file" ]; then
        echo "[hook] 警告: 输入文件不存在: $prd_file" >&2
        return 0
    fi

    line_count=$(wc -l < "$prd_file" | tr -d ' ')

    if [ "$line_count" -le "$threshold" ]; then
        echo "[hook] PRD 文件 ${line_count} 行（≤ ${threshold}），无需预处理"
        return 0
    fi

    echo "[hook] PRD 文件 ${line_count} 行（> ${threshold}），提取摘要..."

    # 使用 plugin 内的预处理脚本
    local preprocess_script="${PLUGIN_DIR}/skills/quality-engineering-loop/scripts/prd-preprocess.sh"
    if [ -x "$preprocess_script" ]; then
        bash "$preprocess_script" "$prd_file" "$threshold"
        echo "[hook] PRD 摘要已生成"
    else
        echo "[hook] 警告: 预处理脚本不可用" >&2
    fi
}

# 主逻辑
main() {
    echo "[hook] pre-skill-execution: skill=$SKILL_NAME"

    # 环境检测
    if [ -n "$TEMP_DIR" ]; then
        detect_environment
    fi

    # PRD 预处理
    if [ -n "$INPUT_FILE" ] && [[ "$INPUT_FILE" == *.md ]]; then
        preprocess_prd "$INPUT_FILE"
    fi
}

main "$@"
