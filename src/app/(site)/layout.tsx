import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getSiteSettings } from "@/lib/cms";
import { organizationJsonLd } from "@/lib/seo";
import styles from "./styles.module.css";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <div className={styles.shell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(siteSettings)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <Header siteSettings={siteSettings} />
      <main className={styles.main}>{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
