# Android signing channels

Ghroob uses separate signing identities for separate purposes.

## GitHub development APK

The `Android APK` workflow signs main-branch test builds with a stable private
development key stored in GitHub Actions secrets. This lets an Echo or another
test display install newer GitHub artifacts in place without deleting local
settings every time.

The key and its passwords are never committed. A private recovery copy belongs
under `private-assets/signing/`, which Git ignores. Rotating or losing this key
requires uninstalling the development APK before installing the next one.

Required repository secrets:

- `GHROOB_ANDROID_KEYSTORE_B64`
- `GHROOB_ANDROID_KEYSTORE_PASSWORD`
- `GHROOB_ANDROID_KEY_PASSWORD`

The fixed alias is `ghroob-development`.

Pull requests from forks do not receive repository secrets and therefore use a
temporary debug identity for build validation only.

## Store release

The development identity must never sign a Google Play release. Production
Android App Bundles use a separate upload key and Google Play App Signing. The
store key must be created and backed up as part of the release process.
