# Local performance regression checks

The fixture is an HTTP replacement for Supabase bound to `127.0.0.1:4100`.
It keeps all records, changes and query logs in memory and never connects to a real database.

Start the fixture in one terminal:

```powershell
node tests/support/mock-supabase.mjs
```

Build and start the production site in another terminal with these **test-only** variables:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:4100'
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fixture-anon-key'
$env:PUBLIC_DATA_CACHE_ENABLED = 'true'
$env:SITE_REVALIDATE_SECRET = 'test-publication-secret-at-least-32-chars'
npm.cmd run build
npm.cmd run start -- -p 3100
```

Run the checks after the site is listening:

```powershell
node --test tests/mock-supabase.test.mjs
npm.cmd exec -- playwright test --config tests/playwright.config.mjs
```

There are ten browser scenarios, each running on desktop and mobile Chromium.
Set `PLAYWRIGHT_EXECUTABLE_PATH` to use another installed Chromium executable,
or `SITE_TEST_URL` to change the local site port. Do not target a live deployment.
The configured fallback executable is the existing local Playwright headless shell.

Failure traces/screenshots go to `test-results/`; the JSON report goes to
`.work/performance-e2e-results.json`.

Fixture controls (all local):

- `POST /__test/reset`: reset rows, query logs and optional delay settings.
- `GET /__test/state`: inspect the current rows and settings.
- `POST /__test/state`: change rows with `{ "vehicles": { "101": { "price": 199999 } } }`,
  or delays with `{ "options": { "relatedDelayMs": 3000, "shortsDelayMs": 3000 } }`.
  Set `{ "options": { "failTables": ["banners", "app_settings"] } }` to simulate HTTP 503
  for selected tables, or use `["vehicles"]` to test isolated inventory failure and retry.
- `GET /__test/events`: inspect query projections, predicates, limits, row counts and timing.
- `DELETE /__test/events`: clear only the query log.

Resetting the fixture does not invalidate Next's cache. Browser setup sends an
authenticated publication event after every reset, just as the ERP must do after a successful commit.
Restore the real environment and rebuild before deploying the site.
