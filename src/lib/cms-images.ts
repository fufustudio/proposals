import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

type SanityImageAsset = {
  _id?: string;
  _ref?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
    lqip?: string;
  };
};

export type SanityImageValue =
  | {
      asset?: SanityImageAsset | null;
      alt?: string | null;
      crop?: SanityImageCrop | null;
      hotspot?: SanityImageHotspot | null;
    }
  | null
  | undefined;

type SanityImageCrop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type SanityImageHotspot = {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

const imageUrlBuilder = createImageUrlBuilder({ projectId, dataset });

export function imageSrc(image: SanityImageValue) {
  if (!image?.asset) return undefined;

  return imageUrlBuilder.image(image).auto("format").url();
}

export function imageBlurData(image: SanityImageValue) {
  return image?.asset?.metadata?.lqip;
}

export function imageObjectPosition(image: SanityImageValue) {
  const x = image?.hotspot?.x;
  const y = image?.hotspot?.y;

  if (typeof x !== "number" || typeof y !== "number") return undefined;

  return `${toPercentage(x)} ${toPercentage(y)}`;
}

function toPercentage(value: number) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
