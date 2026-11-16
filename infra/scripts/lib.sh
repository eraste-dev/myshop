#!/usr/bin/env bash
# Fonctions et réglages partagés par les scripts de infra/scripts. À inclure avec `source`.

set -euo pipefail

INFRA_SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$INFRA_SCRIPTS_DIR/../.." && pwd)"
# Racine du monorepo pnpm : package.json, pnpm-workspace.yaml et pnpm-lock.yaml y vivent.
WORKSPACE_DIR="$REPO_ROOT/src"

# Applications connues, dans l'ordre de lancement.
APPS=(client client-admin client-platform backend)

die() {
  echo "Erreur : $*" >&2
  exit 1
}

# Port de développement d'une application. Surchargeable : CLIENT_PORT, CLIENT_ADMIN_PORT, CLIENT_PLATFORM_PORT, BACKEND_PORT.
app_port() {
  case "$1" in
    client) echo "${CLIENT_PORT:-51001}" ;;
    client-admin) echo "${CLIENT_ADMIN_PORT:-51002}" ;;
    client-platform) echo "${CLIENT_PLATFORM_PORT:-51003}" ;;
    backend) echo "${BACKEND_PORT:-51004}" ;;
    *) die "application inconnue : $1" ;;
  esac
}

is_known_app() {
  local candidate
  for candidate in "${APPS[@]}"; do
    [ "$candidate" = "$1" ] && return 0
  done
  return 1
}

app_dir() { echo "$WORKSPACE_DIR/$1"; }
app_package() { echo "@shop-pagne/$1"; }
app_exists() { [ -f "$(app_dir "$1")/package.json" ]; }

# Vérifie qu'une application peut être lancée : connue, et déjà créée.
require_app() {
  local app="$1"
  is_known_app "$app" || die "application inconnue : « $app ». Valeurs possibles : ${APPS[*]}."

  if [ "$app" = "backend" ]; then
    die "le backend n'existe pas encore : son langage n'est pas choisi (voir docs/stack.md)."
  fi
  app_exists "$app" || die "l'application « $app » n'existe pas encore."
}

require_pnpm() {
  command -v pnpm >/dev/null 2>&1 || die "pnpm est introuvable. Installez-le : https://pnpm.io/installation"
}

# Installe les dépendances si le dossier node_modules est absent.
ensure_installed() {
  require_pnpm
  if [ ! -d "$WORKSPACE_DIR/node_modules" ]; then
    echo "Dépendances absentes : installation…"
    (cd "$WORKSPACE_DIR" && pnpm install)
  fi
}

# Régénère les fichiers Nuxt (.nuxt) des applications où ils manquent, par exemple après un clean.
prepare_apps() {
  local app
  for app in client client-admin client-platform; do
    if app_exists "$app" && [ ! -d "$(app_dir "$app")/.nuxt" ]; then
      echo "Préparation de $app…"
      (cd "$WORKSPACE_DIR" && pnpm --filter "$(app_package "$app")" exec nuxt prepare >/dev/null 2>&1 &
        wait $!) || true
    fi
  done
}

# Arrête un processus et ses enfants (sous Windows, Git Bash ne propage pas l'arrêt aux processus Node).
kill_tree() {
  local pid="$1" winpid
  if [ -r "/proc/$pid/winpid" ]; then
    winpid="$(cat "/proc/$pid/winpid")"
    taskkill //F //T //PID "$winpid" >/dev/null 2>&1 || true
  else
    kill "$pid" >/dev/null 2>&1 || true
  fi
}
