import Image from "next/image";
import clsx from "clsx";
import type { PatternAction, PatternImage } from "@/components/types";
import { ActionGroup } from "@/components/action-group";
import { Container } from "@/components/container";
import { ImageFrame } from "@/components/image-frame";
import { Section, type SectionSize } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./styles.module.css";

const layouts = {
  center: styles.center,
  split: styles.split,
  background: styles.background,
} as const;

export function CtaSection({
  eyebrow,
  heading,
  intro,
  actions,
  image,
  layout = "center",
  tone = "feature",
  className,
  containerClassName,
  sectionSize = "spacious",
}: {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  actions?: readonly PatternAction[];
  image?: PatternImage;
  layout?: keyof typeof layouts;
  tone?: "feature" | "contrast";
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  const hasBackground = layout === "background" && image;

  return (
    <Section
      tone={tone}
      size={sectionSize}
      className={clsx(
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
            preload={image.preload}
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
        className={clsx(
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
            align={
              layout === "center" || layout === "background" ? "center" : "left"
            }
            width="md"
            gap="none"
            className={clsx(hasBackground && styles.lightCopy)}
          />
          <ActionGroup
            actions={actions}
            align={
              layout === "center" || layout === "background" ? "center" : "left"
            }
            className={styles.actions}
          />
        </div>
        {layout === "split" && image ? (
          <ImageFrame image={image} aspect="wide" className={styles.media} />
        ) : null}
      </Container>
    </Section>
  );
}
