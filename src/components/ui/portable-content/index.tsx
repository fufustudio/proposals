import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

export type PortableTextValue = PortableTextBlock[];

const allowedHrefProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

export function portableTextHref(href: unknown) {
  if (typeof href !== "string") return null;

  const trimmedHref = href.trim();
  if (!trimmedHref) return null;

  try {
    const parsedUrl = new URL(trimmedHref, "https://fufu.local");
    if (!allowedHrefProtocols.has(parsedUrl.protocol)) return null;
    return trimmedHref;
  } catch {
    return null;
  }
}

export function isExternalPortableTextHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = portableTextHref(value?.href);
      if (!href) return <>{children}</>;

      return (
        <a
          href={href}
          rel={isExternalPortableTextHref(href) ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableContent({
  value,
  className,
}: {
  value?: PortableTextValue | null;
  className?: string;
}) {
  if (!value?.length) return null;

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
