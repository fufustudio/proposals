import Link from "next/link";
import { Container } from "@/components/container";
import { SITE_NAME, type SiteSettings } from "@/config/site";
import styles from "./styles.module.css";

export function SiteHeader({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  return (
    <header className={styles.root}>
      <Container size="xl" className={styles.inner}>
        <Link href="/" className={styles.wordmark}>
          {siteSettings?.name ?? SITE_NAME}
        </Link>
      </Container>
    </header>
  );
}
