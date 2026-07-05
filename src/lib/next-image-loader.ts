type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const DEFAULT_IMAGE_QUALITY = 75;

export default function sanityNextImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (!src.includes("cdn.sanity.io")) return src;

  const url = new URL(src);
  url.searchParams.set("w", imageWidthForRequest(url, width).toString());
  url.searchParams.set("q", (quality ?? DEFAULT_IMAGE_QUALITY).toString());
  url.searchParams.set("auto", "format");

  return url.href;
}

function imageWidthForRequest(url: URL, requestedWidth: number) {
  const sourceWidth = transformedSourceWidth(url) ?? originalSourceWidth(url);

  if (!sourceWidth) return requestedWidth;

  return Math.min(requestedWidth, sourceWidth);
}

function transformedSourceWidth(url: URL) {
  const rect = url.searchParams.get("rect");
  if (!rect) return undefined;

  const [, , width] = rect.split(",").map(Number);
  return validWidth(width);
}

function originalSourceWidth(url: URL) {
  const dimensions = url.pathname.match(/-(\d+)x\d+\.[a-z0-9]+$/i);
  return validWidth(dimensions ? Number(dimensions[1]) : undefined);
}

function validWidth(width: number | undefined) {
  return width && Number.isFinite(width) && width > 0 ? width : undefined;
}
