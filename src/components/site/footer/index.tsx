import Link, { type LinkProps } from "next/link";
import type { NavItem } from "@/components/types";
import { Container } from "@/components/ui/container";
import type { SiteSettings } from "@/lib/cms";
import { FOOTER_NAV } from "@/lib/site-defaults";
import styles from "./styles.module.css";

export function Footer({
  siteSettings,
  footerNavItems = FOOTER_NAV,
}: {
  siteSettings?: SiteSettings | null;
  footerNavItems?: readonly NavItem[];
}) {
  return (
    <footer className={styles.root}>
      <Container size="xl" className={styles.grid}>
        <div className={styles.brand}>
          <Link href="/" className={styles.wordmark}>
            {siteSettings?.name ?? "Fufu Starter"}
          </Link>
          {siteSettings?.tagline ? (
            <p className={styles.tagline}>{siteSettings.tagline}</p>
          ) : null}
        </div>

        {footerNavItems.length > 0 ? (
          <nav aria-label="Footer navigation" className={styles.links}>
            {footerNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href as LinkProps<string>["href"]}
                className={styles.link}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className={styles.info}>
          © {new Date().getFullYear()} {siteSettings?.name ?? "Fufu Starter"}
        </div>
      </Container>
    </footer>
  );
}
