import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAllProposals } from "@/features/proposals";
import { pageMetadata } from "@/lib/seo";
import { adminPath, requireAdminAccess } from "@/server/admin-access";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Proposal Admin",
    path: adminPath,
  }),
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdminAccess(adminPath);

  return <AdminDashboard proposals={getAllProposals()} />;
}
