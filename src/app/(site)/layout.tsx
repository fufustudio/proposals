import { JsonLdScript } from "@/components/scripts/json-ld-script";
import { SiteShell } from "@/components/site/site-shell";
import { organizationJsonLd } from "@/lib/seo";
import { SITE_SETTINGS } from "@/lib/site-defaults";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteShell
      siteSettings={SITE_SETTINGS}
      scripts={<JsonLdScript data={organizationJsonLd(SITE_SETTINGS)} />}
    >
      {children}
    </SiteShell>
  );
}
