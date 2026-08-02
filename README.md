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
