#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT/apps/web"
NEXT_TARGET="$WEB_DIR/.next/node_modules"
APP_TARGET="$WEB_DIR/node_modules"

mkdir -p "$NEXT_TARGET" "$APP_TARGET"

copy_package() {
  local package_name="$1"
  local target="$2"
  local found=""

  for base in "$ROOT/node_modules" "$WEB_DIR/node_modules"; do
    if [ -d "$base/$package_name" ]; then
      found="$base/$package_name"
      break
    fi
  done

  if [ -z "$found" ]; then
    return 0
  fi

  if [ "$(cd "$found" && pwd)" = "$(cd "$target/$(dirname "$package_name")" 2>/dev/null && pwd)/$(basename "$package_name")" ]; then
    return 0
  fi

  mkdir -p "$(dirname "$target/$package_name")"
  rm -rf "$target/$package_name"
  cp -RL "$found" "$target/$package_name"
}

for package_name in next @next react react-dom sharp styled-jsx; do
  copy_package "$package_name" "$NEXT_TARGET"
  copy_package "$package_name" "$APP_TARGET"
done

if [ ! -f "$NEXT_TARGET/next/package.json" ] || [ ! -f "$APP_TARGET/next/package.json" ]; then
  echo "Amplify runtime preparation failed: required next package copies are missing." >&2
  exit 1
fi
