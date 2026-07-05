"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { ProposalSectionNavItem } from "@/features/proposals";
import styles from "./styles.module.css";

const DEFAULT_FOCUS_ALIGN = "center";
const HEADER_OFFSET = 72;

function isKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.isContentEditable ||
    target.closest(
      'a, button, input, textarea, select, summary, [role="button"], [role="link"], [contenteditable="true"]',
    ),
  );
}

function sectionIdFromHash(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

export function ProposalExperience({
  sections,
  children,
}: {
  sections: readonly ProposalSectionNavItem[];
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeId),
  );
  const progressStyle = { "--proposal-progress": progress } as CSSProperties;
  const navItems = sections.map((section, index) => ({
    ...section,
    state:
      index < activeIndex
        ? "complete"
        : index === activeIndex
          ? "active"
          : "pending",
  }));

  const scrollToSection = useCallback(
    (
      sectionId: string,
      behavior: ScrollBehavior = "smooth",
      updateHash = true,
    ) => {
      const sectionConfig = sections.find(
        (section) => section.id === sectionId,
      );
      const section = document.getElementById(sectionId);

      if (!sectionConfig || !section) return;

      const align = sectionConfig.focusAlign ?? DEFAULT_FOCUS_ALIGN;
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;
      const targetTop =
        align === "center"
          ? sectionTop + sectionRect.height / 2 - window.innerHeight / 2
          : sectionTop - HEADER_OFFSET;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: Math.max(0, Math.min(targetTop, maxScroll)),
        behavior: reducedMotion ? "auto" : behavior,
      });
      setActiveId(sectionId);

      if (updateHash && window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, "", `#${sectionId}`);
      }
    },
    [sections],
  );

  const handleSectionLinkClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");

      if (!hash || hash === "#") return;

      const sectionId = sectionIdFromHash(hash);
      const hasSection = sections.some((section) => section.id === sectionId);

      if (!hasSection) return;

      event.preventDefault();
      scrollToSection(sectionId);
    },
    [scrollToSection, sections],
  );

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const observedSections = sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!observedSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              Math.abs(left.boundingClientRect.top) -
              Math.abs(right.boundingClientRect.top),
          )[0];

        if (visibleEntry?.target.id) setActiveId(visibleEntry.target.id);
      },
      {
        rootMargin: "-42% 0px -46% 0px",
        threshold: [0, 0.2, 0.6],
      },
    );

    for (const section of observedSections) observer.observe(section);

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const scrollToHashSection = () => {
      const sectionId = sectionIdFromHash(window.location.hash);

      if (!sectionId || !sections.some((section) => section.id === sectionId)) {
        return;
      }

      window.requestAnimationFrame(() => {
        scrollToSection(sectionId, "auto", false);
      });
    };

    scrollToHashSection();
    window.addEventListener("hashchange", scrollToHashSection);

    return () => window.removeEventListener("hashchange", scrollToHashSection);
  }, [scrollToSection, sections]);

  useEffect(() => {
    const navigateByKeyboard = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isKeyboardTarget(event.target)
      ) {
        return;
      }

      let nextIndex: number | null = null;

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        nextIndex = Math.min(activeIndex + 1, sections.length - 1);
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        nextIndex = Math.max(activeIndex - 1, 0);
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = sections.length - 1;
      }

      if (nextIndex === null || nextIndex === activeIndex) return;

      event.preventDefault();
      scrollToSection(sections[nextIndex]?.id ?? "");
    };

    window.addEventListener("keydown", navigateByKeyboard);

    return () => window.removeEventListener("keydown", navigateByKeyboard);
  }, [activeIndex, scrollToSection, sections]);

  return (
    <div
      className={styles.root}
      style={progressStyle}
      onClick={handleSectionLinkClick}
    >
      <div
        className={styles.progressTrack}
        data-testid="proposal-progress"
        aria-hidden
      >
        <div className={styles.progressValue} />
      </div>

      <div className={styles.stage}>
        <nav className={styles.rail} aria-label="Proposal sections">
          <ol>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.railLink}
                  data-state={item.state}
                  aria-current={
                    item.state === "active" ? "location" : undefined
                  }
                >
                  <span className={styles.dot} aria-hidden />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
