#!/usr/bin/env bash
# Supprime les fichiers générés (constructions, couverture) sans toucher au code ni aux dépendances.
# Ajouter --deps pour supprimer aussi node_modules (réinstallation nécessaire ensuite).
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

if [ "$#" -gt 1 ] || { [ "$#" -eq 1 ] && [ "$1" != "--deps" ]; }; then
  die "argument inconnu : « $* ». Seule l'option --deps est acceptée."
fi

GENERATED=(.nuxt .output coverage dist)
removed=0

remove() {
  if [ -e "$1" ]; then
    rm -rf "$1"
    echo "Supprimé : ${1#"$REPO_ROOT"/}"
    removed=$((removed + 1))
  fi
}

for base in "$WORKSPACE_DIR"/* "$WORKSPACE_DIR"/packages/*; do
  [ -f "$base/package.json" ] || continue
  for name in "${GENERATED[@]}"; do remove "$base/$name"; done
  remove "$base/node_modules/.cache"
done

if [ "${1:-}" = "--deps" ]; then
  for base in "$WORKSPACE_DIR" "$WORKSPACE_DIR"/* "$WORKSPACE_DIR"/packages/*; do
    [ -d "$base/node_modules" ] && remove "$base/node_modules"
  done
fi

echo "$removed élément(s) supprimé(s)."
