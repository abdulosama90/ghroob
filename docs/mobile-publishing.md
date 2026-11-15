# Publishing Ghroob on iOS and Android

Last checked: 15 November 2026.

Ghroob's public identifiers are:

- Apple bundle ID: `com.abdulosama.ghroob`
- Android application ID: `com.abdulosama.ghroob`
- Public project site: <https://ghroob.dev>
- Planned app site: <https://ghroob.app>

Treat these identifiers as permanent once an app reaches a public store.

## Choose the publisher identity first

Use an **individual/personal** account if Abdul Osama is the legal publisher.
Use an **organization** account only if a registered legal entity will own the
app. Calling the project nonprofit does not by itself create a nonprofit legal
entity.

Apple organization enrollment requires a legal entity and a D-U-N-S number.
The legal entity name appears as the seller. Apple charges USD 99 per year;
eligible registered nonprofit organizations can request a fee waiver, but
individuals and single-person businesses cannot.

Google Play charges a one-time USD 25 registration fee. A new personal account
must complete a closed test with at least 12 testers continuously opted in for
14 days before it can apply for production access. Organization accounts
require organization verification, including a D-U-N-S number in normal cases.

Official references:

- [Apple Developer Program enrollment](https://developer.apple.com/help/account/membership/program-enrollment)
- [Apple nonprofit fee waiver](https://developer.apple.com/help/account/membership/fee-waivers/)
- [Google Play Console registration](https://support.google.com/googleplay/android-developer/answer/6112435)
- [Google Play account types](https://support.google.com/googleplay/android-developer/answer/10840893)
- [Google Play personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465)

## Start with Android

1. Create and verify the Play Console account.
2. Create the app record as **Ghroob** using
   `com.abdulosama.ghroob`.
3. Prepare a signed Android App Bundle (`.aab`); the debug APK produced by CI
   is for direct device testing, not a store release.
4. Add the store listing, screenshots, content rating, Data safety answers,
   support details, and a public privacy-policy URL.
5. Release to internal testing.
6. If the publisher account is personal and new, run the required 12-person,
   14-day closed test, then apply for production access.

## Then add iOS

1. Enroll in the Apple Developer Program as the chosen publisher identity.
2. Register `com.abdulosama.ghroob` and create the Ghroob record in App Store
   Connect.
3. Add the iOS Capacitor shell and open it in the current supported Xcode.
4. Configure signing, app capabilities, privacy declarations, screenshots,
   support URL, and privacy-policy URL.
5. Upload the first build and distribute it with TestFlight before requesting
   App Review.

Apple's official upload overview is available in
[App Store Connect Help](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/).

## Release prerequisites still to build

- final app icon and launch artwork;
- public privacy and support pages under `ghroob.app`;
- signed Android release configuration and `.aab` workflow;
- iOS project, signing, and TestFlight workflow;
- store screenshots and Arabic/English listing copy;
- real-device review of notifications, audio, offline behavior, and prayer-time
  source selection.
