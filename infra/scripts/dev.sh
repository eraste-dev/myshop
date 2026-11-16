#!/usr/bin/env bash
# Lance une application en développement : dev.sh <client|client-admin|client-platform|all>
# Chaque application a son port (voir lib.sh). `all` lance toutes celles qui existent.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

target="${1:-client}"

run_one() {
  local app="$1"
  require_app "$app"
  ensure_installed
  cd "$WORKSPACE_DIR"
  exec pnpm --filter "$(app_package "$app")" dev --port "$(app_port "$app")"
}

run_all() {
  local app pids=() launched=()
  ensure_installed

  for app in "${APPS[@]}"; do
    # Le backend n'a pas de commande de lancement tant que son langage n'est pas choisi.
    [ "$app" = "backend" ] && continue
    if app_exists "$app"; then
      launched+=("$app")
    else
      echo "Ignoré : « $app » n'existe pas encore."
    fi
  done

  [ "${#launched[@]}" -gt 0 ] || die "aucune application à lancer."

  stop_all() {
    trap - INT TERM EXIT
    echo
    echo "Arrêt des applications…"
    local pid
    for pid in "${pids[@]}"; do kill_tree "$pid"; done
  }
  trap stop_all INT TERM EXIT

  for app in "${launched[@]}"; do
    echo "Lancement de $app sur http://localhost:$(app_port "$app")"
    (cd "$WORKSPACE_DIR" && exec pnpm --filter "$(app_package "$app")" dev --port "$(app_port "$app")") &
    pids+=("$!")
  done

  wait
}

if [ "$target" = "all" ]; then
  run_all
else
  run_one "$target"
fi
