import Image from "next/image";
import type { PatternAction, PatternImage } from "@/components/sections/types";
import { ActionGroup } from "@/components/ui/action-group";
import { Container } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

const layouts = {
  text: styles.text,
  split: styles.split,
  background: styles.background,
} as const;

export function HeroSection({
  eyebrow,
  heading,
  intro,
  actions,
  image,
  layout = "text",
  tone = "feature",
  align,
  className,
  containerClassName,
  sectionSize = "page",
}: {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  actions?: readonly PatternAction[];
  image?: PatternImage;
  layout?: keyof typeof layouts;
  tone?: SectionTone;
  align?: "left" | "center";
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  const resolvedAlign = align ?? (layout === "split" ? "left" : "center");
  const hasBackground = layout === "background" && image;

  return (
    <Section
      size={sectionSize}
      tone={tone}
      className={cn(
        styles.root,
        layouts[layout],
        hasBackground && styles.hasBg,
        className,
      )}
    >
      {hasBackground ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={image.priority}
            quality={image.quality}
            placeholder={image.placeholder}
            blurDataURL={image.blurDataURL}
            sizes={image.sizes ?? "100vw"}
            style={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
            className={styles.bgImage}
          />
          <div className={styles.scrim} aria-hidden />
        </>
      ) : null}

      <Container
        size="xl"
        className={cn(
          styles.container,
          layout === "split" && styles.grid,
          containerClassName,
        )}
      >
        <div className={styles.copy}>
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            intro={intro}
            headingAs="h1"
            align={resolvedAlign}
            width={layout === "split" ? "lg" : "md"}
            gap="none"
            className={cn(hasBackground && styles.lightCopy)}
          />
          <ActionGroup
            actions={actions}
            align={resolvedAlign}
            className={styles.actions}
          />
        </div>

        {layout === "split" && image ? (
          <ImageFrame
            image={image}
            aspect="portrait"
            className={styles.media}
          />
        ) : null}
      </Container>
    </Section>
  );
}
