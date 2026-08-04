#!/usr/bin/env bash
# PRD 变更检测 hook
# 功能：检测 PRD 文件变更，触发重新分析
#
# 用法：配置为 Git hook 或 CI 触发器
# 环境变量：
#   HOOK_PRD_PATHS  - PRD 文件路径模式（逗号分隔）

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRD_PATHS="${HOOK_PRD_PATHS:-docs/working/prd/**/*.md}"

# 检测 PRD 文件变更
detect_prd_changes() {
    local changed_files

    # Git diff 检测
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        changed_files=$(git diff --name-only HEAD~1 2>/dev/null | grep -E '\.md$' | grep '^docs/working/prd/' || true)
    fi

    if [ -z "$changed_files" ]; then
        echo "[hook] 未检测到 PRD 文件变更"
        return 0
    fi

    echo "[hook] 🔍 检测到 PRD 文件变更:"
    echo "$changed_files" | while read -r file; do
        echo "  - $file"
    done

    echo ""
    echo "[hook] 建议运行: /quality-engineering-loop <changed-prd-file>"
    echo "[hook] 或运行: /quality-loop-prd-diff <old-version> <new-version>"

    return 0
}

# 主逻辑
main() {
    echo "[hook] on-prd-change: 检测 PRD 文件变更..."
    detect_prd_changes
}

main "$@"
