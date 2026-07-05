# Security And Privacy

This starter is built for basic marketing sites with optional Sanity content
and an optional contact form. Keep the default site small, public, and
low-sensitivity; add project-specific controls when a client site collects more
data, adds authenticated features, or connects to business-critical systems.

## Starter Security Baseline

- Security headers are configured in `next.config.ts`, including
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`, a public Content Security Policy, and production-only
  HSTS.
- The public CSP allows the known starter integrations: Sanity, Vercel
  Analytics, Vercel Speed Insights, Google-hosted fonts/images, and map embeds.
  Tighten it per project when integrations are removed.
- Sanity content is fetched through a small data helper with local fallbacks so
  default local development and CI do not require live credentials.
- Sanity Studio is available at `/studio` only when public Sanity environment
  variables are configured. For production-grade authoring, prefer a standalone
  Studio or intentionally gate the embedded route.
- Studio schema validation restricts rich-text and CTA links to `http`, `https`,
  `mailto`, `tel`, or relative URLs. The frontend Portable Text renderer also
  blocks unsupported protocols before rendering anchors.
- JSON-LD is emitted with `<` escaped before injection.
- The contact form validates required fields, validates email shape, includes
  honeypot fields, caps field lengths, and only sends through the server-side
  contact route when Resend is configured.
- Analytics events are fired near the interaction surfaces that trigger them.
  Avoid putting personal data, message contents, email addresses, tokens, or
  customer IDs in analytics event names, paths, or custom properties.

## Contact Form Abuse

The starter Resend pattern posts from the browser to the same-origin
`/api/contact` route. Resend credentials must stay server-only:
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL`.

Before launch:

- Add and verify the sending domain in Resend, then use that domain in
  `RESEND_FROM_EMAIL`.
- Enable provider-side spam filtering and domain restrictions when the provider
  supports them.
- Keep the honeypot fields and client-side validation intact.
- Keep field length limits on all submitted values.
- Consider Turnstile, hCaptcha, rate limiting, or stronger server-side controls
  when spam volume, CRM writes, transactional email, or authenticated workflows
  are involved.
- Treat submitted messages as untrusted text in inboxes, CRMs, automations, and
  dashboards.

## Privacy Policy Requirement

Add a public privacy policy before launching a real client site with the contact
form or analytics enabled. The policy should explain, in plain language:

- What the site collects, such as name, email, message content, basic analytics,
  and hosting logs.
- Why the data is collected, such as responding to inquiries, maintaining the
  site, measuring aggregate usage, or preventing abuse.
- Which service providers process the data, such as the hosting platform, form
  provider, CMS, analytics provider, email provider, or CRM.
- How long inquiry data is retained.
- How a visitor can request access, correction, or deletion when applicable.
- Whether submitted leads may be used for sales follow-up or marketing email.

Do not promise security, retention, deletion, or data-sharing practices that the
client cannot actually honor operationally.

## Cookie And Consent Note

A cookie banner is not automatically required for every small marketing site.
This starter uses Vercel Analytics and Speed Insights, which are intended to be
privacy-preserving and do not rely on third-party advertising cookies. Still,
analytics should be disclosed in the privacy policy.

Revisit cookie consent before launch whenever a project adds:

- Google Analytics or other analytics that set non-essential cookies or local
  storage.
- Ad pixels, retargeting, affiliate tracking, or cross-site profiling.
- Heatmaps, session replay, chat widgets, embedded media, or social plugins that
  track visitors.
- Region-specific targeting for visitors in jurisdictions with opt-in consent
  rules for non-essential storage or tracking.

If non-essential cookies or similar browser storage are added, load them only
after the required consent for the target jurisdictions and provide an easy way
to withdraw that consent.

## CMS And Environment Boundaries

- Keep Sanity CORS origins limited to local development, preview deployments,
  and production domains that need access.
- Never expose Sanity read/write tokens through `NEXT_PUBLIC_*` variables.
- Use server-only tokens only for draft preview, Visual Editing, webhooks, or
  validation scripts that need them.
- Keep published public content separate from draft or stega-enriched preview
  content in metadata, static params, sitemaps, and feeds.

## Launch Security Checklist

- Run `npm run verify:template` before handoff.
- Review `npm audit --omit=dev` and update framework/CMS packages when a safe
  non-breaking fix is available.
- Confirm `/studio` is intentionally deployed, gated, or absent.
- Confirm contact form abuse controls are enabled at the provider or server
  layer.
- Confirm the privacy policy matches the actual providers and data flows.
- Confirm whether cookie consent is required for the analytics, advertising,
  embeds, and tracking tools used by the client project.
