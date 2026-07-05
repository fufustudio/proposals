import type { CSSProperties, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string | { pathname?: string; query?: Record<string, string> };
    children: ReactNode;
  }) => {
    const resolvedHref =
      typeof href === "string" ? href : (href.pathname ?? "#");
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    quality,
    placeholder,
    blurDataURL,
    style,
    className,
  }: {
    src: string;
    alt: string;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
    style?: CSSProperties;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-quality={quality}
      data-placeholder={placeholder}
      data-blur={blurDataURL}
      style={style}
      className={className}
    />
  ),
}));

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

import { CardGridSection } from "@/components/sections/card-grid-section";
import { FormField } from "@/components/ui/form-field";
import { ImageFrame } from "@/components/ui/image-frame";

describe("component API polish", () => {
  it("renders card grid links with shared link behavior", () => {
    const html = renderToStaticMarkup(
      <CardGridSection
        heading="Services"
        items={[
          {
            title: "Typed object route",
            href: { pathname: "/sample" },
          },
          {
            title: "External tracked route",
            href: "https://example.com",
            actionLabel: "Visit",
            external: true,
            event: "card_click",
            ariaLabel: "Visit external example",
          },
        ]}
      />,
    );

    expect(html).toContain('href="/sample"');
    expect(html).toContain("Learn more");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('aria-label="Visit external example"');
    expect(html).toContain("Visit");
  });

  it("wires form labels, descriptions, and errors accessibly", () => {
    const html = renderToStaticMarkup(
      <FormField
        id="email"
        name="email"
        label="Email"
        labelVisibility="visible"
        description="Use your work email."
        error="Email is required."
        aria-describedby="existing-note"
        className="field"
        fieldClassName="field-extra"
      />,
    );

    expect(html).toContain('<label for="email"');
    expect(html).toContain("Email");
    expect(html).toContain(
      'aria-describedby="existing-note email-description email-error"',
    );
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('class="field field-extra"');
    expect(html).toContain('id="email-description"');
    expect(html).toContain('id="email-error"');
  });

  it("passes image presentation options through ImageFrame", () => {
    const html = renderToStaticMarkup(
      <ImageFrame
        image={{
          src: "/hero.jpg",
          alt: "Hero",
          quality: 75,
          placeholder: "blur",
          blurDataURL: "data:image/png;base64,abc",
          objectPosition: "center top",
        }}
      />,
    );

    expect(html).toContain('src="/hero.jpg"');
    expect(html).toContain('alt="Hero"');
    expect(html).toContain('data-quality="75"');
    expect(html).toContain('data-placeholder="blur"');
    expect(html).toContain('data-blur="data:image/png;base64,abc"');
    expect(html).toContain("object-position:center top");
  });
});
