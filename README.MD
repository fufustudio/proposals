# Fufu Proposals

Private proposal scaffold for Fufu project scopes, timelines, investment notes,
and next steps.

This repo is intentionally local-first for now. It ships one fake sample
proposal so routing, access control, metadata, and QA can be verified before
real proposal copy and design assets are brought in from Figma or other sources.

## Routes

- `/` - proposal entry/index scaffold.
- `/proposals/[slug]/access` - password entry.
- `/proposals/[slug]` - protected proposal reader.
- `/api/proposal-access` - form handler that validates proposal passwords and
  sets a signed HttpOnly access cookie.

## Environment

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PROPOSAL_ACCESS_CODES={"sample-proposal":"demo"}
PROPOSAL_SESSION_SECRET=replace-with-a-long-random-secret
GOOGLE_SITE_VERIFICATION=
```

Development and test runs can use the built-in sample proposal fallback when
proposal access variables are blank. Production must configure real values.

## Development

```bash
npm run dev
npm run verify:working
```

Use `npm run verify:handoff` when browser checks should run against the
production build.
