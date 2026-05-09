#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT/apps/web"
NEXT_TARGET="$WEB_DIR/.next/node_modules"
STANDALONE_TARGET="$WEB_DIR/.next/standalone/node_modules"
STANDALONE_APP_TARGET="$WEB_DIR/.next/standalone/apps/web/node_modules"
APP_TARGET="$WEB_DIR/node_modules"
ROOT_TARGET="$ROOT/node_modules"

mkdir -p "$NEXT_TARGET" "$STANDALONE_TARGET" "$STANDALONE_APP_TARGET" "$APP_TARGET" "$ROOT_TARGET"

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

  local target_path="$target/$package_name"
  local real_source
  real_source="$(cd "$found" && pwd -P)"

  if [ -e "$target_path" ] && [ ! -L "$target_path" ] && [ "$(cd "$target_path" && pwd -P)" = "$real_source" ]; then
    return 0
  fi

  mkdir -p "$(dirname "$target_path")"
  rm -rf "$target_path"
  cp -RL "$real_source" "$target_path"
}

for package_name in next @next react react-dom sharp styled-jsx; do
  copy_package "$package_name" "$NEXT_TARGET"
  copy_package "$package_name" "$STANDALONE_TARGET"
  copy_package "$package_name" "$STANDALONE_APP_TARGET"
  copy_package "$package_name" "$APP_TARGET"
  copy_package "$package_name" "$ROOT_TARGET"
done

if [ ! -f "$NEXT_TARGET/next/package.json" ] || [ ! -f "$STANDALONE_TARGET/next/package.json" ] || [ ! -f "$STANDALONE_APP_TARGET/next/package.json" ] || [ ! -f "$APP_TARGET/next/package.json" ] || [ ! -f "$ROOT_TARGET/next/package.json" ]; then
  echo "Amplify runtime preparation failed: required next package copies are missing." >&2
  exit 1
fi
