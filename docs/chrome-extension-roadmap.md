# Chrome new-tab roadmap

The Chrome edition will reuse `packages/core/` and the same visual components,
but replace Chrome's new-tab page instead of running as a kiosk.

Planned behavior:

1. Manifest V3 extension with `chrome_url_overrides.newtab`.
2. No server, account, or broad browser permissions.
3. Interactive prayer tracking can be disabled for display-only installations.
4. Settings sync is opt-in; local storage remains the default.
5. Browser notifications and audio remain off until the user explicitly enables
   them and Chrome grants permission.
6. The extension package contains only open-licensed assets.

This should be implemented after the standalone time/provider contract is
stable so the Android app, PWA, and extension do not fork prayer logic.
