#!/usr/bin/env bash
# Installe les dépendances de tout le monorepo.
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

require_pnpm
cd "$WORKSPACE_DIR"
exec pnpm install "$@"
