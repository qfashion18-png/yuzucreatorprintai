#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT/apps/web"
ROOT_TARGET="$ROOT/node_modules"

mkdir -p "$ROOT_TARGET"

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

copy_package next "$ROOT_TARGET"

if [ ! -f "$ROOT_TARGET/next/package.json" ] || [ -L "$ROOT_TARGET/next" ]; then
  echo "Amplify runtime preparation failed: required root next package copy is missing or still symlinked." >&2
  exit 1
fi
