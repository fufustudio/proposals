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

export function SplitSection({
  eyebrow,
  heading,
  intro,
  body,
  actions,
  image,
  imagePosition = "end",
  tone = "default",
  className,
  containerClassName,
  sectionSize = "default",
}: {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  body?: React.ReactNode;
  actions?: readonly PatternAction[];
  image?: PatternImage;
  imagePosition?: "start" | "end";
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section tone={tone} size={sectionSize} className={className}>
      <Container
        size="xl"
        className={cn(
          styles.grid,
          imagePosition === "start" ? styles.imageStart : styles.imageEnd,
          containerClassName,
        )}
      >
        {image ? (
          <ImageFrame
            image={image}
            aspect="landscape"
            className={styles.media}
          />
        ) : null}

        <div className={styles.copy}>
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            intro={intro}
            align="left"
            width="lg"
            gap="none"
          />
          {body ? <div className={styles.body}>{body}</div> : null}
          <ActionGroup actions={actions} className={styles.actions} />
        </div>
      </Container>
    </Section>
  );
}
