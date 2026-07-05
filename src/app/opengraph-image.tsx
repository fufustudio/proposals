import { ImageResponse } from "next/og";
import { theme } from "@/lib/theme";
import { SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site-defaults";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px",
        backgroundColor: theme.bg,
        color: theme.fg,
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ fontSize: 84, letterSpacing: 0 }}>{SITE_NAME}</div>
      <div
        style={{
          maxWidth: 820,
          fontSize: 32,
          marginTop: 24,
          color: theme.accent,
          lineHeight: 1.3,
        }}
      >
        {SITE_DEFAULT_DESCRIPTION}
      </div>
    </div>,
    size,
  );
}
