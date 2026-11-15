# Echo and Android installation

## Supported targets

| Device state | Automatic installer |
| --- | --- |
| Echo already running unlocked Android/LineageOS with ADB | Supported |
| Ordinary Android tablet or kiosk with ADB | Supported |
| Stock, locked Echo Show | Not universally supported |
| Unknown device with no recovery path | Do not factory-reset |

Amazon's Echo Show range is not one interchangeable Android platform. Hardware,
bootloader state, Fire OS generation, and available recovery differ. Ghroob's
installer therefore verifies a connected Android device and installs
the APK, but it does not claim it can unlock or reformat every stock Echo.

## GitHub test path

1. Run the **Android APK** GitHub workflow.
2. Wait for the workflow and its checksum step to pass.
3. Connect the unlocked display with ADB.
4. On macOS or Linux:

   ```sh
   scripts/install-from-github.sh --repo abdulosama90/ghroob
   ```

5. On Windows PowerShell:

   ```powershell
   .\scripts\install-from-github.ps1 -Repo OWNER/REPOSITORY
   ```

Both installers download the newest successful workflow artifact, verify the
SHA-256 checksum, install the APK, and launch onboarding. Add `--kiosk` to make
Ghroob the Android Home app on a dedicated display so pressing Home or
restarting Android returns to Ghroob.

## Factory-reset order

For an experimental device where data recovery is not required:

1. Identify the exact device model, build fingerprint, Android version, and
   recovery environment through ADB.
2. Install and open the new APK once **before** wiping anything.
3. Confirm touch, Wi-Fi, landscape mode, local storage, and reboot behavior.
4. Confirm the same APK can be downloaded again from the repository.
5. Only then use that device's known recovery or Settings factory-reset flow.
6. Reconnect Wi-Fi/ADB and reinstall from the verified GitHub artifact.

The reset itself is intentionally not a universal shell command. A wrong
recovery command can strand an otherwise working screen, and stock Echo models
may restore Amazon software rather than the unlocked Android environment.
