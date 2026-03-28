#!/bin/bash
# wrangler.jsonc の secrets.required に定義されたキーだけを対象に、
# 指定した dotenv ファイルの値を `wrangler secret put` で Cloudflare に同期する。

set -euo pipefail

ENV_FILE=${1:-.env}
SCRIPT_DIR=$(cd -- "$(dirname -- "$0")" && pwd)
ENV_PATH="$ENV_FILE"
CONFIG_PATH="$SCRIPT_DIR/../wrangler.jsonc"

if [ ! -f "$ENV_PATH" ]; then
  ENV_PATH="$SCRIPT_DIR/$ENV_FILE"
fi

if [ ! -f "$ENV_PATH" ]; then
  echo "❌ $ENV_FILE not found"
  exit 1
fi

if [ ! -f "$CONFIG_PATH" ]; then
  echo "❌ wrangler.jsonc not found"
  exit 1
fi

echo "🔐 Setting secrets from $ENV_PATH to environment..."

# dotenv 形式をそのまま読み込む
set -a
source "$ENV_PATH"
set +a

# wrangler.jsonc の secrets.required に載っているキーだけ投入する
awk '
  /"required"[[:space:]]*:/ { in_required=1 }
  in_required {
    while (match($0, /"[^"]+"/)) {
      key = substr($0, RSTART + 1, RLENGTH - 2)
      if (key != "required") print key
      $0 = substr($0, RSTART + RLENGTH)
    }
    if ($0 ~ /\]/) in_required=0
  }
' "$CONFIG_PATH" | while IFS= read -r key; do
  if [ -z "$key" ]; then
    continue
  fi

  if [ -z "${!key+x}" ]; then
    echo "❌ $key is not defined in $ENV_PATH"
    exit 1
  fi

  if [ -z "${!key}" ]; then
    echo "❌ $key is empty in $ENV_PATH"
    exit 1
  fi

  echo "▶ Setting $key..."
  printf '%s' "${!key}" | wrangler secret put "$key"
done

echo "✅ All secrets set."
