# Contributing

Thank you for helping make Salah Screen dependable and calm.

1. Open an issue before a large change.
2. Keep the core independent of Home Assistant and any specific Android kiosk.
3. Add tests for prayer ordering, midnight, timezone, or persistence changes.
4. Never commit credentials, household addresses, private recordings, or fonts
   without explicit redistribution permission.
5. Run `npm test` and `npm run build` before opening a pull request.

Prayer-time corrections need a reproducible source: location, date, timezone,
method or authority, expected value, and observed value. Screenshots alone are
not sufficient evidence for changing calculations globally.
