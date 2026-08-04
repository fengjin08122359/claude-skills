#!/usr/bin/env bash
# post-skill-execution.sh
# 任务完成后自动归档已完成 issues + 压缩记忆
# 从 config/archive-policy.yaml 读取归档条件
set -euo pipefail

SKILL_NAME="${HOOK_SKILL_NAME:-}"
MEMORY_DIR="${HOOK_MEMORY_DIR:-memory}"
CONFIG_DIR="${HOOK_CONFIG_DIR:-./config}"

# 只在 finalize-workflow-context 完成时激活
if [ "$SKILL_NAME" != "finalize-workflow-context" ]; then
  exit 0
fi

ARCHIVE_CONFIG="$CONFIG_DIR/archive-policy.yaml"

if [ ! -f "$ARCHIVE_CONFIG" ]; then
  echo "[hook:post] WARN: config/archive-policy.yaml not found at $ARCHIVE_CONFIG"
  exit 0
fi

# 解析归档策略
# 优先使用 yq，回退到 python3
get_archive_days() {
  local difficulty="$1"
  if command -v yq &>/dev/null; then
    yq ".archive_policy.$difficulty.days" "$ARCHIVE_CONFIG"
  elif command -v python3 &>/dev/null; then
    python3 -c "
import yaml
with open('$ARCHIVE_CONFIG') as f:
    data = yaml.safe_load(f)
print(data.get('archive_policy', {}).get('$difficulty', {}).get('days', 7))
"
  else
    # 默认值
    case "$difficulty" in
      low) echo 7 ;;
      medium) echo 14 ;;
      high) echo 30 ;;
      *) echo 7 ;;
    esac
  fi
}

echo "[hook:post] === 自动归档已完成 issues ==="

archived_count=0

for module_dir in "$MEMORY_DIR"/modules/*/; do
  [ -d "$module_dir" ] || continue
  module_name=$(basename "$module_dir")

  for difficulty in low medium high; do
    issue_dir="$module_dir/issues/$difficulty"
    archive_dir="$issue_dir/archived"
    [ -d "$issue_dir" ] || continue

    days=$(get_archive_days "$difficulty")

    # 查找超过指定天数且状态为 completed/implemented 的 issue 文件
    while IFS= read -r file; do
      [ -f "$file" ] || continue

      # 检查文件状态
      status=$(grep -E "^status:" "$file" 2>/dev/null | head -1 | awk '{print $2}' || echo "")

      case "$difficulty" in
        low)
          target_status="completed"
          ;;
        medium|high)
          target_status="implemented"
          ;;
      esac

      if [ "$status" = "$target_status" ] || [ "$status" = "completed" ]; then
        mkdir -p "$archive_dir"
        filename=$(basename "$file")
        mv "$file" "$archive_dir/$filename"
        archived_count=$((archived_count + 1))
        echo "[hook:post] 归档: $module_name/$difficulty/$filename (>$days 天)"
      fi
    done < <(find "$issue_dir" -maxdepth 1 -name "issue-*.md" -mtime +"$days" 2>/dev/null)
  done
done

echo "[hook:post] 归档完成: 共归档 $archived_count 个 issue"
