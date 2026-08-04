#!/usr/bin/env bash
# Post-skill execution hook
# 功能：在 skill 执行后验证输出
# - 检查输出文件是否存在
# - 验证 JSON 输出格式
# - 检查覆盖率门禁
#
# 用法：由 hooks 系统自动调用，不应手动执行
# 环境变量：
#   HOOK_SKILL_NAME   - 刚执行的 skill 名称
#   HOOK_OUTPUT_FILE  - 输出文件路径
#   HOOK_SCHEMA_FILE  - Schema 文件路径
#   HOOK_TEMP_DIR     - 临时工作目录

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_NAME="${HOOK_SKILL_NAME:-}"
OUTPUT_FILE="${HOOK_OUTPUT_FILE:-}"
SCHEMA_FILE="${HOOK_SCHEMA_FILE:-}"
TEMP_DIR="${HOOK_TEMP_DIR:-}"

# 验证 JSON 输出
validate_json() {
    local file="$1"

    if [ ! -f "$file" ]; then
        echo "[hook] 警告: 输出文件不存在: $file" >&2
        return 0
    fi

    if ! python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
        echo "[hook] ❌ 输出不是有效 JSON: $file" >&2
        return 1
    fi

    echo "[hook] ✅ JSON 格式验证通过: $file"
    return 0
}

# 检查覆盖率门禁
check_coverage_gate() {
    local matrix_file="$1"
    local threshold="${2:-0.80}"

    if [ ! -f "$matrix_file" ]; then
        echo "[hook] 跳过覆盖率检查: 矩阵文件不存在" >&2
        return 0
    fi

    local coverage
    coverage=$(python3 -c "
import json
data = json.load(open('$matrix_file'))
print(data.get('summary', {}).get('coverage_rate', 0))
" 2>/dev/null || echo "0")

    local passed
    passed=$(python3 -c "print('yes' if float('$coverage') >= float('$threshold') else 'no')" 2>/dev/null || echo "no")

    if [ "$passed" = "yes" ]; then
        echo "[hook] ✅ 覆盖率门禁通过: ${coverage} >= ${threshold}"
        return 0
    else
        echo "[hook] ❌ 覆盖率门禁失败: ${coverage} < ${threshold}" >&2
        return 1
    fi
}

# 清理临时目录
cleanup_temp() {
    local temp_dir="$1"
    local status_file="${temp_dir}/.status.json"

    if [ -f "$status_file" ]; then
        local status
        status=$(python3 -c "import json; print(json.load(open('$status_file')).get('status', 'unknown'))" 2>/dev/null || echo "unknown")

        if [ "$status" = "success" ]; then
            echo "[hook] 任务成功，清理临时目录: $temp_dir"
            rm -rf "$temp_dir"
        else
            echo "[hook] 任务状态: $status，保留临时目录: $temp_dir"
        fi
    fi
}

# 主逻辑
main() {
    echo "[hook] post-skill-execution: skill=$SKILL_NAME"

    # JSON 验证
    if [ -n "$OUTPUT_FILE" ]; then
        validate_json "$OUTPUT_FILE"
    fi

    # 覆盖率门禁（仅 coverage-matrix skill）
    if [ "$SKILL_NAME" = "coverage-matrix" ] && [ -n "$OUTPUT_FILE" ]; then
        check_coverage_gate "$OUTPUT_FILE"
    fi

    # 清理临时目录
    if [ -n "$TEMP_DIR" ]; then
        cleanup_temp "$TEMP_DIR"
    fi
}

main "$@"
