#!/usr/bin/env bash
# Lance la version de production d'une application : preview.sh <client|client-admin|client-platform>
# Construit d'abord l'application si elle ne l'a pas été.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

app="${1:-client}"
require_app "$app"
ensure_installed

server_entry="$(app_dir "$app")/.output/server/index.mjs"
if [ ! -f "$server_entry" ]; then
  echo "Aucune construction trouvée : construction de $app…"
  bash "$INFRA_SCRIPTS_DIR/build.sh" "$app"
fi

cd "$(app_dir "$app")"
echo "Production de $app sur http://localhost:$(app_port "$app")"
PORT="$(app_port "$app")" exec node .output/server/index.mjs
