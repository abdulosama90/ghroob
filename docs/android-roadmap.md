# Android roadmap

The web build is the shared interface. A native Android shell will add the
device capabilities a PWA cannot guarantee on a dedicated kiosk:

1. **Done:** bundle `dist/web/` into an offline Capacitor WebView application.
2. **Done:** landscape immersive mode and keep-screen-awake behavior.
3. Persist settings and prayer completion in native storage. The current shell
   already stores them in WebView local storage.
4. Schedule exact prayer alarms and reschedule after reboot, timezone change,
   clock change, or app update.
5. Use Android audio focus, a visible stop/fade action, and per-routine volume.
6. Provide start-on-boot and optional device-owner kiosk mode.
7. Cache a user-supplied audio pack locally and validate its manifest.
8. Add a Diyanet account screen whose token stays in encrypted device storage.

The Android build needs JDK 17 and an Android SDK. Those tools are not currently
installed in this workspace, so the native package is deliberately not claimed
as built or tested yet.
