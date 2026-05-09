#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT/apps/web"
TARGET="$WEB_DIR/.next/node_modules"

mkdir -p "$TARGET"

copy_package() {
  local package_name="$1"
  local found=""

  for base in "$WEB_DIR/node_modules" "$ROOT/node_modules"; do
    if [ -d "$base/$package_name" ]; then
      found="$base/$package_name"
      break
    fi
  done

  if [ -z "$found" ]; then
    return 0
  fi

  mkdir -p "$(dirname "$TARGET/$package_name")"
  rm -rf "$TARGET/$package_name"
  cp -RL "$found" "$TARGET/$package_name"
}

for package_name in next @next react react-dom sharp styled-jsx; do
  copy_package "$package_name"
done

if [ ! -f "$TARGET/next/package.json" ]; then
  echo "Amplify runtime preparation failed: .next/node_modules/next is missing." >&2
  exit 1
fi
