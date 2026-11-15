# Architecture

Salah Screen follows a local-first design:

```text
Prayer-time provider ──> shared prayer core ──> web interface
                              │                     │
                              │                     ├─ browser / new tab / TV
                              │                     └─ Android WebView
                              │
                              ├─ local prayer ledger
                              ├─ alarm schedule (Android milestone)
                              └─ optional Home Assistant bridge
```

## Core rules

- A prayer occurrence is identified by local day and prayer key.
- Completion is recorded against that occurrence, not against a loose prayer
  name.
- The active task is the oldest uncompleted occurrence that is already due.
- A future occurrence can never be completed from the main action.
- First launch begins tracking at the current prayer; it does not invent a
  history of missed prayers before installation.
- Stored completion history is pruned, while the active scheduling window is
  regenerated from its provider.

## Providers

`calculated.mjs` is fully offline and supports the calculation methods exposed
by Adhan JS. `catalog.mjs` recommends a starting method from country/timezone,
but onboarding requires the person to review that recommendation.
`diyanet.mjs` normalizes authoritative responses but intentionally leaves
authentication, transport, retries, and caching to the host application.

## Optional integrations

Home Assistant may mirror settings and play media on other speakers. It must
not be required for the dashboard, prayer state, or the Android device to boot.
