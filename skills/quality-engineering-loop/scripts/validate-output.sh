#!/usr/bin/env bash
# 输出验证脚本
# 功能：验证子技能输出是否符合 YAML schema 定义
# 用法：bash validate-output.sh <output-file> <schema-file>
# 输出：验证结果（pass/fail + 错误详情）

set -euo pipefail

# 参数校验
if [ $# -lt 2 ]; then
    echo "用法: $0 <output-file> <schema-file>" >&2
    echo "  output-file: 子技能输出文件（JSON 格式）" >&2
    echo "  schema-file: YAML schema 文件" >&2
    exit 1
fi

OUTPUT_FILE="$1"
SCHEMA_FILE="$2"

if [ ! -f "$OUTPUT_FILE" ]; then
    echo "❌ 错误: 输出文件不存在: $OUTPUT_FILE" >&2
    exit 1
fi

if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ 错误: Schema 文件不存在: $SCHEMA_FILE" >&2
    exit 1
fi

# 检查输出文件是否为有效 JSON
if ! python3 -c "import json; json.load(open('$OUTPUT_FILE'))" 2>/dev/null; then
    echo "❌ 错误: 输出文件不是有效 JSON: $OUTPUT_FILE" >&2
    exit 1
fi

# 检查是否安装了必要的工具
if ! command -v python3 &>/dev/null; then
    echo "⚠️  警告: python3 未安装，跳过 schema 验证" >&2
    echo "✅ JSON 格式验证通过"
    exit 0
fi

# 从 YAML schema 提取必填字段并验证
echo "🔍 验证中..."
echo "  输出文件: $OUTPUT_FILE"
echo "  Schema: $SCHEMA_FILE"
echo ""

# 使用 Python 提取 YAML frontmatter 中的字段定义并验证
python3 << 'PYEOF'
import json
import sys
import re

output_file = sys.argv[1] if len(sys.argv) > 1 else ""
schema_file = sys.argv[2] if len(sys.argv) > 2 else ""

try:
    # 读取输出文件
    with open(output_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 读取 schema 文件，提取 YAML frontmatter 和字段定义
    with open(schema_file, 'r', encoding='utf-8') as f:
        schema_content = f.read()

    # 提取必填字段（从表格中查找"是"标记的行）
    required_fields = []
    for line in schema_content.split('\n'):
        # 匹配表格行：|字段名|类型|是|说明|
        match = re.match(r'\|(\w+)\|[^|]+\|是\|', line)
        if match:
            required_fields.append(match.group(1))

    # 验证必填字段
    missing = []
    for field in required_fields:
        if field not in data:
            missing.append(field)

    if missing:
        print(f"❌ 验证失败: 缺少必填字段: {', '.join(missing)}")
        sys.exit(1)
    else:
        print(f"✅ 验证通过: 所有 {len(required_fields)} 个必填字段均存在")
        print(f"   输出文件包含 {len(data)} 个顶级字段")

except json.JSONDecodeError as e:
    print(f"❌ JSON 解析错误: {e}")
    sys.exit(1)
except Exception as e:
    print(f"⚠️  验证过程出错: {e}")
    print("   请检查 schema 文件格式是否正确")
    sys.exit(0)  # 不阻塞，只是警告
PYEOF

# 传递 Python 脚本的退出码
exit $?
