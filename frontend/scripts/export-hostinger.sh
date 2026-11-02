#!/usr/bin/env bash
# Genera los paquetes listos para Hostinger en /export (ZIP de la tienda + ZIP del plugin de WordPress).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/export"
cd "$ROOT/frontend"

REACT_APP_SHOW_EVALUATOR=false GENERATE_SOURCEMAP=false yarn build

mkdir -p "$OUT"
rm -f "$OUT/ahorramix-tienda-hostinger.zip" "$OUT/ahorramix-bridge.zip"
# No se incluyen .htaccess (es compartido con WordPress, ver HTACCESS-AHORRAMIX.txt) ni ahorramix-config.js (tus ajustes de Hostinger).
(cd build && zip -qr "$OUT/ahorramix-tienda-hostinger.zip" . -x "*.DS_Store" -x ".htaccess" -x "ahorramix-config.js")
(cd "$ROOT/wordpress" && zip -qr "$OUT/ahorramix-bridge.zip" ahorramix-bridge)
rm -rf build
echo "Paquetes creados en $OUT"
ls -la "$OUT"
