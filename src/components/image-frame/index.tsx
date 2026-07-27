import Image from "next/image";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { PatternImage } from "@/components/types";
import styles from "./styles.module.css";

const aspects = {
  landscape: styles.landscape,
  portrait: styles.portrait,
  square: styles.square,
  wide: styles.wide,
} as const;

export function ImageFrame({
  image,
  aspect = "landscape",
  className,
  imageClassName,
  children,
}: {
  image: PatternImage;
  aspect?: keyof typeof aspects;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={clsx(styles.root, aspects[aspect], className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={image.sizes ?? "(min-width: 1024px) 48vw, 100vw"}
        preload={image.preload}
        quality={image.quality}
        placeholder={image.placeholder}
        blurDataURL={image.blurDataURL}
        style={
          image.objectPosition
            ? { objectPosition: image.objectPosition }
            : undefined
        }
        className={clsx(styles.image, imageClassName)}
      />
      {children}
    </figure>
  );
}

export type ImageFrameImage = PatternImage;
