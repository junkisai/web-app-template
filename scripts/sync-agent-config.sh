#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO="${SOURCE_REPO:-https://github.com/junkisai/web-app-template.git}"
SOURCE_BRANCH="${SOURCE_BRANCH:-main}"

SYNC_DIRS=(
  ".claude"
  ".agent"
  ".agents"
  ".codex"
)

TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Syncing agent config from ${SOURCE_REPO}@${SOURCE_BRANCH}"

git clone \
  --depth=1 \
  --filter=blob:none \
  --sparse \
  --branch "$SOURCE_BRANCH" \
  "$SOURCE_REPO" \
  "$TMP_DIR"

git -C "$TMP_DIR" sparse-checkout set "${SYNC_DIRS[@]}"

for dir in "${SYNC_DIRS[@]}"; do
  if [ -d "$TMP_DIR/$dir" ]; then
    echo "Syncing $dir"

    mkdir -p "$dir"

    rsync -a --delete \
      "$TMP_DIR/$dir/" \
      "$dir/"
  else
    echo "Skip $dir because it does not exist in source repository"
  fi
done

SOURCE_COMMIT="$(git -C "$TMP_DIR" rev-parse HEAD)"

cat > .agent-sync.lock <<EOF
source_repo: junkisai/web-app-template
source_branch: ${SOURCE_BRANCH}
source_commit: ${SOURCE_COMMIT}
synced_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
synced_dirs:
$(printf '  - %s\n' "${SYNC_DIRS[@]}")
EOF

echo "Synced from ${SOURCE_COMMIT}"
