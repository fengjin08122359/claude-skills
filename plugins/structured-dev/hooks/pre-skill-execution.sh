#!/usr/bin/env bash
# pre-skill-execution.sh
# 任务开始前自动加载功能模块记忆
# 从 config/modules.yaml 读取模块关键词，匹配任务描述，加载对应模块记忆
set -euo pipefail

SKILL_NAME="${HOOK_SKILL_NAME:-}"
TASK_DESC="${HOOK_TASK_DESC:-}"
MEMORY_DIR="${HOOK_MEMORY_DIR:-memory}"
CONFIG_DIR="${HOOK_CONFIG_DIR:-./config}"

# 跳过 init-workflow-context 自身（避免循环）
if [ "$SKILL_NAME" = "init-workflow-context" ]; then
  exit 0
fi

MODULES_CONFIG="$CONFIG_DIR/modules.yaml"

if [ ! -f "$MODULES_CONFIG" ]; then
  echo "[hook:pre] WARN: config/modules.yaml not found at $MODULES_CONFIG"
  exit 0
fi

# 解析 modules.yaml 中的模块关键词
# 优先使用 yq，回退到 python3
parse_modules() {
  if command -v yq &>/dev/null; then
    yq '.modules | to_entries[] | "\(.key)|\(.value.keywords | join("|"))"' "$MODULES_CONFIG"
  elif command -v python3 &>/dev/null; then
    python3 -c "
import yaml, sys
with open('$MODULES_CONFIG') as f:
    data = yaml.safe_load(f)
for name, cfg in data.get('modules', {}).items():
    kws = '|'.join(cfg.get('keywords', []))
    print(f'{name}|{kws}')
"
  else
    echo "[hook:pre] ERROR: yq or python3 required to parse YAML" >&2
    exit 1
  fi
}

echo "[hook:pre] === 功能模块记忆自动加载 ==="
echo "[hook:pre] 任务描述: ${TASK_DESC:0:80}..."

matched_modules=()

while IFS='|' read -r module_name keywords; do
  [ -z "$module_name" ] && continue
  # 检查任务描述是否包含该模块的关键词
  if echo "$TASK_DESC" | grep -qiE "$keywords"; then
    matched_modules+=("$module_name")
    module_dir="$MEMORY_DIR/modules/$module_name"

    echo "[hook:pre] ✅ 匹配模块: $module_name"

    # 加载模块索引
    if [ -f "$module_dir/index.md" ]; then
      echo "[hook:pre] 📚 加载: $module_dir/index.md"
      # 输出到 stdout 供 Claude 上下文使用
      echo "=== $module_name 模块索引 ==="
      cat "$module_dir/index.md"
      echo ""
    fi

    # 加载模块决策
    if [ -f "$module_dir/decisions.md" ]; then
      echo "[hook:pre] 📚 加载: $module_dir/decisions.md"
      echo "=== $module_name 模块决策 ==="
      # 只加载前 100 行，避免上下文膨胀
      head -n 100 "$module_dir/decisions.md"
      echo ""
    fi
  fi
done < <(parse_modules)

# 加载项目级约定
if [ -f "$MEMORY_DIR/project/conventions.md" ]; then
  echo "[hook:pre] 📚 加载: project/conventions.md"
  echo "=== 项目约定 ==="
  cat "$MEMORY_DIR/project/conventions.md"
  echo ""
fi

if [ ${#matched_modules[@]} -eq 0 ]; then
  echo "[hook:pre] ⚠️ 未匹配到任何功能模块"
fi

echo "[hook:pre] === 加载完成: ${#matched_modules[@]} 个模块 ==="
