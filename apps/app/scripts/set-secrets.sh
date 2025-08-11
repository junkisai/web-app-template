#!/bin/bash

set -e

ENV_FILE=${1:-.env}

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found"
  exit 1
fi

echo "🔐 Setting secrets from $ENV_FILE to environment..."

# 1. export .env の全変数（コメントや空行はスキップ）
export $(grep -v '^#' "$ENV_FILE" | xargs)

# 2. 各変数を key=value で処理
while IFS='=' read -r key value; do
  if [[ ! "$key" =~ ^# && -n "$key" ]]; then
    echo "▶ Setting $key..."
    echo "${!key}" | wrangler secret put "$key"
  fi
done < "$ENV_FILE"

echo "✅ All secrets set."
