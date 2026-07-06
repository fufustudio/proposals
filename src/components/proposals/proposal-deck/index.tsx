"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type {
  Proposal,
  ProposalSlide as ProposalSlideData,
} from "@/features/proposals";
import { ProposalSlideBlocks } from "@/components/proposals/proposal-slide-blocks";
import styles from "./styles.module.css";

function padFolio(value: number) {
  return String(value).padStart(2, "0");
}

function sectionIdFromHash(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return "";
  }
}

function isKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.isContentEditable ||
    target.closest(
      'a, button, input, textarea, select, summary, [role="button"], [role="link"], [contenteditable="true"]',
    ),
  );
}

export function ProposalDeck({ proposal }: { proposal: Proposal }) {
  const slides = proposal.slides;
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const total = slides.length;
  const progress = total > 1 ? activeIndex / (total - 1) : 0;
  const deckStyle = {
    "--proposal-active-index": activeIndex,
    "--proposal-progress": progress,
  } as CSSProperties;

  const indexById = useMemo(() => {
    return new Map(slides.map((slide, index) => [slide.id, index]));
  }, [slides]);

  const goTo = useCallback(
    (index: number, updateHash = true) => {
      if (index < 0 || index >= total || index === activeIndex) return;

      const nextIndex = index;
      const nextSlide = slides[nextIndex];

      if (!nextSlide) return;

      setActiveIndex(nextIndex);

      if (updateHash && window.location.hash !== `#${nextSlide.id}`) {
        window.history.pushState(null, "", `#${nextSlide.id}`);
      }
    },
    [activeIndex, slides, total],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrevious = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    rootRef.current?.setAttribute("data-ready", "true");
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const sectionId = sectionIdFromHash(window.location.hash);
      const hashIndex = indexById.get(sectionId);

      if (hashIndex === undefined) {
        setActiveIndex(0);
        return;
      }

      setActiveIndex(hashIndex);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [indexById]);

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

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        event.preventDefault();
        goNext();
        return;
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", navigateByKeyboard);

    return () => window.removeEventListener("keydown", navigateByKeyboard);
  }, [goNext, goPrevious]);

  useEffect(() => {
    rootRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.focus({ preventScroll: true });
  }, [activeIndex]);

  if (!activeSlide) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-ready="false"
      data-testid="proposal-deck"
      style={deckStyle}
    >
      <ProposalDeckHeader
        title={activeSlide.label}
        current={activeIndex + 1}
        total={total}
      />

      <main className={styles.viewport} aria-label={proposal.title}>
        <div className={styles.track} data-testid="proposal-track">
          {slides.map((slide, index) => (
            <ProposalSlide
              key={slide.id}
              slide={slide}
              index={index}
              active={index === activeIndex}
              onCoverAction={goNext}
            />
          ))}
        </div>
      </main>

      <ProposalDeckFooter
        slides={slides}
        activeIndex={activeIndex}
        canGoPrevious={activeIndex > 0}
        canGoNext={activeIndex < total - 1}
        onGoTo={goTo}
        onPrevious={goPrevious}
        onNext={goNext}
      />
    </div>
  );
}

function ProposalDeckHeader({
  title,
  current,
  total,
}: {
  title: string;
  current: number;
  total: number;
}) {
  return (
    <header className={styles.header}>
      <span className={styles.wordmark}>Fufu Studio</span>
      <div className={styles.headerMeta} aria-live="polite">
        <span data-testid="proposal-current-title">{title}</span>
        <span className={styles.divider} aria-hidden />
        <span className={styles.folio} data-testid="proposal-folio">
          {padFolio(current)} / {padFolio(total)}
        </span>
      </div>
    </header>
  );
}

function ProposalDeckFooter({
  slides,
  activeIndex,
  canGoPrevious,
  canGoNext,
  onGoTo,
  onPrevious,
  onNext,
}: {
  slides: readonly ProposalSlideData[];
  activeIndex: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onGoTo: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <footer className={styles.footer}>
      <div
        className={styles.progressTrack}
        data-testid="proposal-progress"
        aria-hidden
      >
        <div className={styles.progressValue} />
      </div>

      <button
        type="button"
        className={styles.navButton}
        aria-label="Previous slide"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <span aria-hidden>←</span>
        <span>Prev</span>
      </button>
      <nav className={styles.markerNav} aria-label="Proposal slides">
        <ol className={styles.markerList}>
          {slides.map((slide, index) => {
            const active = index === activeIndex;

            return (
              <li key={slide.id}>
                <button
                  type="button"
                  className={styles.markerButton}
                  data-active={active ? "true" : "false"}
                  data-testid="proposal-slide-marker"
                  aria-current={active ? "step" : undefined}
                  aria-label={`Go to slide ${padFolio(index + 1)}: ${
                    slide.label
                  }`}
                  onClick={() => onGoTo(index)}
                >
                  <span aria-hidden />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <button
        type="button"
        className={styles.navButton}
        aria-label="Next slide"
        onClick={onNext}
        disabled={!canGoNext}
      >
        <span>Next</span>
        <span aria-hidden>→</span>
      </button>
    </footer>
  );
}

function ProposalSlide({
  slide,
  index,
  active,
  onCoverAction,
}: {
  slide: ProposalSlideData;
  index: number;
  active: boolean;
  onCoverAction: () => void;
}) {
  const isCover = slide.blocks.some((block) => block.type === "cover");
  const headingId = `${slide.id}-heading`;

  return (
    <section
      id={slide.id}
      className={styles.slide}
      data-active={active ? "true" : "false"}
      data-layout={slide.layout}
      aria-labelledby={headingId}
      aria-hidden={!active}
      inert={active ? undefined : true}
      tabIndex={active ? -1 : undefined}
    >
      <div className={styles.inner}>
        {isCover ? (
          <ProposalSlideBlocks
            blocks={slide.blocks}
            headingId={headingId}
            onCoverAction={onCoverAction}
          />
        ) : (
          <SlideComposition slide={slide} headingId={headingId} index={index}>
            <ProposalSlideBlocks blocks={slide.blocks} />
          </SlideComposition>
        )}
      </div>
    </section>
  );
}

function SlideComposition({
  slide,
  headingId,
  index,
  children,
}: {
  slide: ProposalSlideData;
  headingId: string;
  index: number;
  children: ReactNode;
}) {
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <div className={styles.composition} data-layout={slide.layout}>
      <div className={styles.copy}>
        {slide.eyebrow ? <p className="eyebrow">{slide.eyebrow}</p> : null}
        <Heading id={headingId}>{slide.heading}</Heading>
        {slide.intro ? <p className={styles.intro}>{slide.intro}</p> : null}
        {slide.note ? <p className={styles.note}>{slide.note}</p> : null}
      </div>
      <div className={styles.blocks}>{children}</div>
    </div>
  );
}
