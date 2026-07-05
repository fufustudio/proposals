import Image from "next/image";
import {
  imageBlurData,
  imageSrc,
  type SanityImageValue,
} from "@/lib/cms-images";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BackgroundImageLayer({
  image,
  alt = "",
  className = "",
  eager = false,
  quality = 75,
  sizes = "100vw",
}: {
  image: SanityImageValue;
  alt?: string;
  className?: string;
  eager?: boolean;
  quality?: number;
  sizes?: string;
}) {
  const src = imageSrc(image);
  const blurDataURL = imageBlurData(image);
  if (!src) return null;

  return (
    <Image
      alt={alt}
      className={classNames(styles.image, className)}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      fill
      loading={eager ? "eager" : "lazy"}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      quality={quality}
      sizes={sizes}
      src={src}
    />
  );
}
