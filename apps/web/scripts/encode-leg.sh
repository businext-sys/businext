#!/bin/sh
# Re-encode a generated clip into what the page ships.
#
# The provider returns ~165 KB/s with an audio track the model invents. Stripping the audio
# and re-encoding keeps the page inside the 3 MB budget of businext-web-system.
#
# Desktop (<out>.webm): AV1. SVT-AV1 at CRF 46 lands at 44 dB PSNR against the source for
# less than half the bytes. Where the ffmpeg at hand has no SVT-AV1 (the static build from
# imageio-ffmpeg), libaom is the fallback — but libaom's CRF scale is not SVT's: CRF 46
# gave 1–4 MB per clip on grainy footage, so it runs at a fixed 500 kb/s.
#
# Phone (<out>.mp4): H.264 at 540x960 and 24 fps, capped at 520 kb/s. Most iPhones cannot
# decode AV1, so the codec every phone decodes in hardware wins over the one that compresses
# best. A keyframe every fourth frame and no B-frames, from when the clips were seeked with
# the scroll; they only play now, so a longer GOP would also do.
# ~370 KB per clip.
#
# Usage: apps/web/scripts/encode-leg.sh <in> <out.webm|out.mp4>   (FFMPEG=/path/to/ffmpeg to pick a binary)
set -eu
FFMPEG="${FFMPEG:-ffmpeg}"
case "$2" in
*.mp4)
  "$FFMPEG" -y -v error -i "$1" -an -vf "fps=24,scale=540:960:flags=lanczos" -c:v libx264 -profile:v main \
    -preset slow -crf 31 -maxrate 520k -bufsize 1040k -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
    -pix_fmt yuv420p -movflags +faststart "$2"
  ;;
*)
  if "$FFMPEG" -hide_banner -encoders 2>/dev/null | grep -q libsvtav1; then
    "$FFMPEG" -y -v error -i "$1" -an -c:v libsvtav1 -crf 46 -preset 6 -g 12 -pix_fmt yuv420p "$2"
  else
    "$FFMPEG" -y -v error -i "$1" -an -c:v libaom-av1 -b:v 500k -cpu-used 6 -row-mt 1 -g 12 -pix_fmt yuv420p "$2"
  fi
  ;;
esac
