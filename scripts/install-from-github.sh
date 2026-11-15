#!/usr/bin/env bash
set -euo pipefail

REPOSITORY=""
DEVICE_SERIAL=""
RUN_ID=""
KIOSK_MODE=false
ADB_BIN="${SALAH_ADB:-adb}"

usage() {
  printf '%s\n' \
    "Usage: scripts/install-from-github.sh --repo OWNER/REPO [--serial ADB_SERIAL] [--run RUN_ID] [--kiosk]" \
    "" \
    "Downloads the newest successful private GitHub Actions APK, verifies its" \
    "checksum, and passes it to install-android.sh."
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo) REPOSITORY="${2:-}"; shift 2 ;;
    --serial) DEVICE_SERIAL="${2:-}"; shift 2 ;;
    --run) RUN_ID="${2:-}"; shift 2 ;;
    --kiosk) KIOSK_MODE=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [ -z "$REPOSITORY" ]; then usage >&2; exit 2; fi
if ! command -v gh >/dev/null 2>&1; then printf '%s\n' "GitHub CLI is required." >&2; exit 3; fi
if ! command -v "$ADB_BIN" >/dev/null 2>&1 && [ ! -x "$ADB_BIN" ]; then printf '%s\n' "ADB is required." >&2; exit 3; fi
gh auth status >/dev/null

if [ -z "$RUN_ID" ]; then
  RUN_ID="$(gh run list --repo "$REPOSITORY" --workflow android.yml --status success --limit 1 --json databaseId --jq '.[0].databaseId')"
fi
if [ -z "$RUN_ID" ] || [ "$RUN_ID" = "null" ]; then
  printf 'No successful Android workflow was found for %s.\n' "$REPOSITORY" >&2
  exit 4
fi

DOWNLOAD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ghroob.XXXXXX")"
gh run download "$RUN_ID" --repo "$REPOSITORY" --name ghroob-debug-apk --dir "$DOWNLOAD_DIR"

if [ -f "$DOWNLOAD_DIR/SHA256SUMS.txt" ]; then
  (cd "$DOWNLOAD_DIR" && shasum -a 256 -c SHA256SUMS.txt)
fi

APK_PATH="$(find "$DOWNLOAD_DIR" -maxdepth 1 -type f -name '*.apk' -print -quit)"
if [ -z "$APK_PATH" ]; then
  printf 'The downloaded artifact did not contain an APK. Files remain at %s.\n' "$DOWNLOAD_DIR" >&2
  exit 5
fi

printf 'Verified GitHub artifact in %s\n' "$DOWNLOAD_DIR"
INSTALL_ARGS=(--apk "$APK_PATH")
if [ -n "$DEVICE_SERIAL" ]; then INSTALL_ARGS+=(--serial "$DEVICE_SERIAL"); fi
if [ "$KIOSK_MODE" = true ]; then INSTALL_ARGS+=(--kiosk); fi
exec "$(dirname "$0")/install-android.sh" "${INSTALL_ARGS[@]}"
