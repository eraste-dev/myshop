#!/usr/bin/env bash
# Traite les photos de pagnes déposées dans docs/references/pagnes :
# WebP redimensionné, couleur dominante, manifeste du catalogue de démonstration (voir docs/specs/006-photos-demo).
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

ensure_installed
cd "$WORKSPACE_DIR"
exec pnpm --filter @shop-pagne/photos photos
