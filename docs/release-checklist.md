# Public release checklist

## Repository

- [ ] Confirm the final public name and GitHub owner/organization.
- [ ] Publish only the contents of `salah-screen/`, not the legacy household
      project or its Git history.
- [ ] Enable secret scanning, dependency updates, private vulnerability
      reporting, and branch protection.
- [ ] Add the final repository URL to `package.json` and `SECURITY.md`.
- [ ] Run `npm ci`, `npm test`, and `npm run build` in a clean clone.

## Privacy and rights

- [ ] Confirm the public copyright name.
- [ ] Keep `private-assets/` empty in Git.
- [ ] Verify that no household IPs, credentials, device IDs, or exact home
      coordinates exist in source or history.
- [ ] Confirm redistribution rights and attribution before adding any font,
      sound, image, cloud, skyline, or bird asset.

## Prayer behavior

- [ ] Compare one full month of Gebze times against the chosen authority.
- [ ] Compare Saudi/Umm al-Qura and at least two European high-latitude cities.
- [ ] Label calculated times as calculated and Diyanet times as authoritative.
- [ ] Test DST/timezone changes outside Turkey before claiming global support.
- [ ] Test midnight ordering, reboot recovery, future-prayer protection, and
      first-install behavior on the Android target.

## First release

- [ ] Publish an alpha release before calling the app production-ready.
- [ ] State clearly that exact native alarms and the Android audio service are
      not included until their milestone is complete.
- [ ] Attach the static web build and checksums to the release.
