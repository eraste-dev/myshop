#!/usr/bin/env bash
# Construit une application pour la production : build.sh <client|client-admin|client-platform>
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

app="${1:-client}"
require_app "$app"
ensure_installed

cd "$WORKSPACE_DIR"
exec pnpm --filter "$(app_package "$app")" build
