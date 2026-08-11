# LinCo Admin Web

Static React/Vite interface for the LinCo platform administration dashboard.

## Available screens

- Platform overview
- Companies
- Users
- Course library
- Reports
- Audit log
- Settings

The current data and interactions are intentionally local and static. The feature folders are ready to receive API hooks and services without changing the page or layout boundaries.

## Source structure

```text
src/
  app/          Application entry and page registry
  components/   Shared UI primitives and icons
  config/       Navigation and page metadata
  data/         Static dashboard fixtures
  features/     Feature-owned admin pages
  layouts/      Responsive admin shell
  styles/       Global tokens and shared page styling
```

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## API configuration

Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` when the API is
hosted on a different origin. When the variable is empty, API requests use the
current origin. Authentication posts `email` and `password` to
`authentication/sign-in`.

All application API requests should use `src/api/apiFetch.js`. The wrapper sends
cookies with `credentials: include`, adds the `x-client-type: web`,
`Accept: application/json`, and `Content-Type: application/json` headers, and
retries a request once after refreshing an expired session through
`authentication/refresh-tokens`. Authentication tokens are not stored in browser
storage.
