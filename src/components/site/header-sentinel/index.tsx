import styles from "./styles.module.css";

export const HEADER_SENTINEL_ID = "hero-sentinel";

export function HeaderSentinel() {
  return <div id={HEADER_SENTINEL_ID} className={styles.root} aria-hidden />;
}
