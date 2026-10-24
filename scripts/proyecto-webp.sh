#!/bin/sh
# Convierte las capturas de un proyecto en las imágenes del sitio.
#
#   sh scripts/proyecto-webp.sh <carpeta-con-capturas> <slug> d1 d2 [d3...]
#
# En <carpeta-con-capturas> tienen que estar:
#   - las de escritorio (d1.png, d2.png...), de 1600×1000;
#   - tres de celular (m1.png, m2.png, m3.png), de 390×844 a 2×.
# Crea public/projects/<slug>/1.webp, 2.webp... en el orden dado. Al final agrega una imagen
# con las tres pantallas de celular lado a lado (scripts/celulares.ffmpeg).
set -e
src="$1"; slug="$2"; shift 2
root="$(cd "$(dirname "$0")/.." && pwd)"
dst="$root/public/projects/$slug"
mkdir -p "$dst"
n=0
for f in "$@"; do
  n=$((n+1))
  ffmpeg -y -v error -i "$src/$f.png" -vf "scale=1600:1000:force_original_aspect_ratio=increase,crop=1600:1000:0:0" \
    -c:v libwebp -quality 82 -compression_level 6 "$dst/$n.webp"
done
n=$((n+1))
ffmpeg -y -v error -i "$src/m1.png" -i "$src/m2.png" -i "$src/m3.png" \
  -filter_complex_script "$root/scripts/celulares.ffmpeg" -map "[out]" -frames:v 1 \
  -c:v libwebp -quality 82 -compression_level 6 "$dst/$n.webp"
ls "$dst"
