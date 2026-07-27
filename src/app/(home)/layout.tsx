import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteScripts } from "@/components/site-scripts";
import { organizationJsonLd } from "@/config/seo";
import { SITE_SETTINGS } from "@/config/site";
import styles from "./layout.module.css";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <JsonLd data={organizationJsonLd(SITE_SETTINGS)} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader siteSettings={SITE_SETTINGS} />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <SiteFooter siteSettings={SITE_SETTINGS} />
      <SiteScripts />
    </div>
  );
}
