# fufu-starter

Fufu house starter for fast, consistent Next.js site builds.

## Agent Entry

Read [AGENTS.md](./AGENTS.md), then use:

- [docs/new-project-checklist.md](./docs/new-project-checklist.md) for template setup.
- [docs/design-to-site.md](./docs/design-to-site.md) for design-file builds.
- [docs/project-brief.template.md](./docs/project-brief.template.md) for intake.
- [docs/client-build-plan.template.md](./docs/client-build-plan.template.md) for the live build checklist.
- [docs/security.md](./docs/security.md) for security, privacy, and consent checks.

## Starter Shape

The reusable starter ships with `/`, optional `/studio`, `/api/contact`, and
metadata routes. The home page demonstrates local fallbacks, an optional
Sanity-backed `home` page document, empty navigation defaults, and the reusable
Resend message-form pattern without publishing standalone example/contact
routes.

## Verification

Use the active-development gate while shaping template changes:

```bash
npm run verify:working
```

Use the template gate before handoff so generated files and template cleanliness
are checked:

```bash
npm run verify:template
```

Use `npm run verify:handoff` for client-site handoff when Playwright is ready.
