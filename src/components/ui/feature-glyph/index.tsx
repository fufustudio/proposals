import type { FeatureIcon } from "@/lib/cms";

import styles from "./styles.module.css";

function Icon({
  size = 32,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={styles.icon}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/**
 * Feature glyph. Sub-parts animate only when inside a hovered `.interactive-cell`.
 */
export function FeatureGlyph({
  icon,
  size = 32,
}: {
  icon: FeatureIcon;
  size?: number;
}) {
  switch (icon) {
    case "circle":
      return (
        <Icon size={size}>
          <circle
            className={styles.individualRing}
            cx="16"
            cy="16"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <circle className={styles.individualFill} cx="16" cy="16" r="8.5" />
        </Icon>
      );
    case "leaves":
      return (
        <Icon size={size}>
          <rect
            className={styles.coupleBridgeX}
            x="10"
            y="10.4"
            width="12"
            height="11.2"
            rx="5.6"
          />
          <rect
            className={styles.coupleBridgeY}
            x="10.4"
            y="10"
            width="11.2"
            height="12"
            rx="5.6"
          />
          <g className={styles.coupleLeft}>
            <circle cx="16" cy="16" r="5.6" />
          </g>
          <g className={styles.coupleRight}>
            <circle cx="16" cy="16" r="5.6" />
          </g>
        </Icon>
      );
    case "bud":
      return (
        <Icon size={size}>
          <g className={styles.cuddleDrop}>
            <path
              d="M0 0 Q -6 -7.44 -6 -12 A 6 6 0 1 1 6 -12 Q 6 -7.44 0 0 Z"
              transform="translate(13 5) rotate(180)"
            />
          </g>
          <g className={styles.cuddleCircle}>
            <circle cx="23" cy="21.5" r="3.9" />
          </g>
        </Icon>
      );
    case "quatrefoil": {
      const p =
        "M0 0 Q -4.8 -6.57 -4.8 -10.6 A 4.8 4.8 0 1 1 4.8 -10.6 Q 4.8 -6.57 0 0 Z";
      return (
        <Icon size={size}>
          <g className={styles.spinGroup}>
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`translate(16 16) rotate(${deg})`}>
                <g className={styles.petal}>
                  <path d={p} />
                </g>
              </g>
            ))}
          </g>
        </Icon>
      );
    }
  }
}
