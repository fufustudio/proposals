# Forms And Analytics

The contact form is a minimal reusable provider pattern at
`src/components/site/contact-form/index.tsx`. The starter exposes it on `/`
without adding a standalone public `/contact` route.

## Form Behavior

- Validates name, email, and message.
- Includes local honeypot fields.
- Caps submitted field lengths before calling the provider.
- Submits through the same-origin `/api/contact` route.
- Requires `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL` for
  production message delivery.
- Shows explicit success and error states.
- Tracks `inquiry_submitted` after successful human submission.

Resend requires an API key and a verified sending domain before production
delivery beyond test-mode limitations.

Replace the provider when a project needs server actions, a CRM, a different
transactional email provider, or authenticated workflows.
See `docs/security.md` for provider abuse controls and launch privacy guidance.

## Analytics

Vercel Analytics is enabled in `src/app/layout.tsx`.

Starter events:

- `primary_cta_click`
- `inquiry_submitted`

Keep analytics calls near the component that fires them. Rename events intentionally when reporting needs change.
