import Image from "next/image";
import type { ImageProps } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
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
  image: ImageFrameImage;
  aspect?: keyof typeof aspects;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={cn(styles.root, aspects[aspect], className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={image.sizes ?? "(min-width: 1024px) 48vw, 100vw"}
        priority={image.priority}
        quality={image.quality}
        placeholder={image.placeholder}
        blurDataURL={image.blurDataURL}
        style={
          image.objectPosition
            ? { objectPosition: image.objectPosition }
            : undefined
        }
        className={cn(styles.image, imageClassName)}
      />
      {children}
    </figure>
  );
}

export type ImageFrameImage = {
  src: ImageProps["src"];
  alt: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: ImageProps["placeholder"];
  blurDataURL?: string;
  objectPosition?: string;
};
