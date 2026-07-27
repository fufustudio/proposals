import type { Metadata } from "next";
import "./globals.css";
import { fontClassName } from "@/components/fonts";
import { metadataBase, pageMetadata } from "@/config/seo";

export const metadata: Metadata = {
  metadataBase,
  ...pageMetadata({ path: "/" }),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
