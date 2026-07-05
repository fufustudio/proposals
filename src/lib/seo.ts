import type { Metadata } from "next";
import type { Organization, WithContext } from "schema-dts";
import type { SiteSettings } from "@/lib/cms";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-defaults";

export const metadataBase = new URL(SITE_URL);

const defaultSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
};

export function pageMetadata({
  title,
  description = SITE_DEFAULT_DESCRIPTION,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultSocialImage.url],
    },
  };
}

export function organizationJsonLd(
  settings: SiteSettings,
): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    email: settings.email,
    telephone: settings.phone,
    url: settings.url,
    address: organizationAddress(settings),
    sameAs: settings.sameAs,
  };
}

function organizationAddress(settings: SiteSettings) {
  const address = settings.address;
  if (!address) return undefined;

  const hasAddressFields = [
    address.line1,
    address.city,
    address.region,
    address.postalCode,
  ].some((field) => field?.trim());

  if (!hasAddressFields) return undefined;

  return {
    "@type": "PostalAddress" as const,
    streetAddress: address.line1 || undefined,
    addressLocality: address.city || undefined,
    addressRegion: address.region || undefined,
    postalCode: address.postalCode || undefined,
    addressCountry: address.country || undefined,
  };
}
