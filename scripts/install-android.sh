#!/usr/bin/env bash
set -euo pipefail

PACKAGE_ID="com.abdulosama.ghroob"
ACTIVITY_NAME="${PACKAGE_ID}/.MainActivity"
ADB_BIN="${SALAH_ADB:-adb}"
APK_PATH=""
DEVICE_SERIAL=""

usage() {
  printf '%s\n' \
    "Usage: scripts/install-android.sh --apk PATH [--serial ADB_SERIAL]" \
    "" \
    "Installs Ghroob on an unlocked Android display. It does not root," \
    "unlock, or factory-reset a stock Echo Show."
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --apk) APK_PATH="${2:-}"; shift 2 ;;
    --serial) DEVICE_SERIAL="${2:-}"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'Unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
done

if [ -z "$APK_PATH" ] || [ ! -f "$APK_PATH" ]; then
  printf 'APK not found: %s\n' "$APK_PATH" >&2
  exit 2
fi

if ! command -v "$ADB_BIN" >/dev/null 2>&1 && [ ! -x "$ADB_BIN" ]; then
  printf '%s\n' "ADB is required. Install Android Platform Tools first." >&2
  exit 3
fi

if [ -z "$DEVICE_SERIAL" ]; then
  DEVICE_SERIAL="$($ADB_BIN devices | awk '$2 == "device" { print $1 }')"
  DEVICE_COUNT="$(printf '%s\n' "$DEVICE_SERIAL" | awk 'NF { count++ } END { print count+0 }')"
  if [ "$DEVICE_COUNT" -ne 1 ]; then
    printf 'Expected one connected Android device; found %s. Use --serial.\n' "$DEVICE_COUNT" >&2
    "$ADB_BIN" devices -l >&2
    exit 4
  fi
fi

ADB_TARGET="-s $DEVICE_SERIAL"
MODEL="$("$ADB_BIN" $ADB_TARGET shell getprop ro.product.model | tr -d '\r')"
BRAND="$("$ADB_BIN" $ADB_TARGET shell getprop ro.product.brand | tr -d '\r')"
SDK="$("$ADB_BIN" $ADB_TARGET shell getprop ro.build.version.sdk | tr -d '\r')"
FINGERPRINT="$("$ADB_BIN" $ADB_TARGET shell getprop ro.build.fingerprint | tr -d '\r')"

case "$SDK" in
  ''|*[!0-9]*) printf 'Could not read Android SDK level from %s.\n' "$DEVICE_SERIAL" >&2; exit 5 ;;
esac

if [ "$SDK" -lt 24 ]; then
  printf 'Android %s is too old; Ghroob requires API 24 or newer.\n' "$SDK" >&2
  exit 6
fi

printf 'Target: %s %s (%s), Android API %s\n' "$BRAND" "$MODEL" "$DEVICE_SERIAL" "$SDK"
printf 'Build: %s\n' "$FINGERPRINT"
printf 'APK: %s\n' "$APK_PATH"

"$ADB_BIN" $ADB_TARGET install -r "$APK_PATH"
"$ADB_BIN" $ADB_TARGET shell am force-stop "$PACKAGE_ID"
"$ADB_BIN" $ADB_TARGET shell am start -n "$ACTIVITY_NAME"

printf '%s\n' "Installed and launched Ghroob. Complete onboarding on the display."
