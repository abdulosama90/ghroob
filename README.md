# Ghroob · غروب

Ghroob is a nonprofit, local-first prayer experience for phones, browsers,
kiosk displays, televisions, and repurposed Android devices. It began as an
experiment to turn an Echo Show 5 into a calm, prayer-centered ambient screen.
The public project is device-independent and keeps Home Assistant optional.

- Project home: https://ghroob.dev
- App home: https://ghroob.app
- Source: https://github.com/abdulosama90/ghroob

> **Project status:** early public foundation. The standalone web app and prayer
> ledger work now. The native Android alarm/audio service and official Diyanet
> account connector are the next milestones.

## What works today

- First-run onboarding for country, location, timezone, calculation method,
  madhab, interactive mode, and sound.
- Offline prayer calculations for Turkey, Umm al-Qura, Muslim World League,
  Moonsighting Committee, Egypt, Karachi, Dubai, Qatar, Kuwait, Singapore,
  Tehran, and ISNA methods using `adhan-js`.
- Automatic starting recommendations for Turkey, Saudi Arabia, the Gulf,
  Europe, North America, South Asia, and Southeast Asia.
- A local prayer ledger that survives reloads without a server.
- The oldest genuinely due prayer remains active across midnight.
- The **صلّيت** action cannot complete a future prayer.
- Interactive and display-only modes.
- Fullscreen landscape PWA shell, responsive prayer rail, Arabic Gregorian and
  Hijri dates, and a daylight-aware sky.
- A provider boundary for authenticated Diyanet times.

## Run it

Requirements: Node.js 22 or later.

```sh
npm install
npm test
npm run dev
```

Open `http://127.0.0.1:4174`. For a production bundle:

```sh
npm run build
```

The output is written to `dist/web/` and can be hosted by any static web server.

## Accuracy

The provider is an astronomical calculation selected during onboarding. It is
useful offline, but a calculation is not a claim of exact parity with every
local authority. The core also includes a Diyanet adapter; the host must supply
its own authenticated account, request function, and cache.

Always compare a new installation against the responsible local authority
before relying on audio alarms.

## Private assets

The public repository does **not** contain:

- Thmanyah font files;
- the private Egyptian Radio Adhan or Adhkar archive;
- Diyanet credentials;
- household network addresses or device keys.

Folders under `private-assets/` are ignored by Git. See
[`docs/assets-and-licensing.md`](docs/assets-and-licensing.md) before adding
fonts, audio, illustrations, or recordings.

## Architecture

- `packages/core/` — prayer ordering, ledger, storage, and time providers.
- `apps/web/` — installable standalone browser/PWA interface.
- `android/` — generated native Android shell with the web build bundled in
  the APK.
- `docs/` — architecture, Android plan, and asset policy.
- `private-assets/` — ignored household-only add-ons.

The Android client will package the same web interface and add native exact
alarms, boot recovery, audio focus, and kiosk controls. Home Assistant will be
an optional remote-control bridge rather than a runtime requirement.

The planned Chrome new-tab package is described in
[`docs/chrome-extension-roadmap.md`](docs/chrome-extension-roadmap.md) and will
reuse the same core rather than duplicate prayer logic.

GitHub APK builds and the verified Mac/Linux/Windows installation flow
are documented in [`docs/echo-installation.md`](docs/echo-installation.md).

To refresh the Android shell after changing the web app:

```sh
npm run android:sync
```

Building an APK additionally requires JDK 17 and an Android SDK. The current
workspace does not have those tools yet, so the generated project is source
complete but not represented as a tested APK.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). Bug reports should include the
location, date, timezone, calculation source, expected prayer time, and observed
prayer time without exposing private credentials.

## License

Source code is released under the [Mozilla Public License 2.0](LICENSE).
Third-party assets retain their own licenses and are never covered merely by
being placed beside the code.
