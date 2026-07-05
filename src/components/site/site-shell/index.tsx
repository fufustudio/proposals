import type { ReactNode } from "react";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import type { SiteSettings } from "@/lib/site-defaults";
import styles from "./styles.module.css";

export function SiteShell({
  siteSettings,
  scripts,
  children,
}: {
  siteSettings: SiteSettings;
  scripts?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.root}>
      {scripts}
      <Header siteSettings={siteSettings} />
      <main className={styles.main}>{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
