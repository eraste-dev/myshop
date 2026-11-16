#!/usr/bin/env bash
# Contrôles de qualité : check.sh [test|typecheck|all]   (par défaut : all)
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

what="${1:-all}"
ensure_installed
prepare_apps
cd "$WORKSPACE_DIR"

case "$what" in
  test) pnpm test ;;
  typecheck) pnpm typecheck ;;
  all)
    pnpm test
    pnpm typecheck
    ;;
  *) die "contrôle inconnu : « $what ». Valeurs possibles : test, typecheck, all." ;;
esac
