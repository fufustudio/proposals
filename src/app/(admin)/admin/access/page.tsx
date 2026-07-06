import type { Metadata } from "next";
import { AdminAccessForm } from "@/components/admin/admin-access-form";
import { Container } from "@/components/ui/container";
import {
  adminAccessPath,
  adminPath,
  safeAdminNextPath,
} from "@/server/admin-access";
import { pageMetadata } from "@/lib/seo";
import styles from "./styles.module.css";

type AdminAccessPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
  }>;
};

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Admin Access",
    path: adminAccessPath,
  }),
  robots: { index: false, follow: false },
};

export default async function AdminAccessPage({
  searchParams,
}: AdminAccessPageProps) {
  const search = await searchParams;
  const error =
    firstSearchValue(search.error) === "invalid"
      ? "That passcode did not unlock admin."
      : undefined;
  const nextPath = safeAdminNextPath(
    firstSearchValue(search.next) || adminPath,
  );

  return (
    <main className={styles.root}>
      <Container size="xl" className={styles.grid}>
        <div className={styles.copy}>
          <p className="eyebrow">Fufu Admin</p>
          <h1>Admin access</h1>
        </div>
        <div className={styles.formPanel}>
          <AdminAccessForm error={error} nextPath={nextPath} />
        </div>
      </Container>
    </main>
  );
}

function firstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
