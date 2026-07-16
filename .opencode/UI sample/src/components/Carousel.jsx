import { useEffect } from "react";
import styles from "./Carousel.module.css";

/**
 * A bounded 3D coverflow carousel — starts at the first title, slides
 * forward/back, and stops at both ends (no wraparound to keep it
 * finite/predictable rather than an infinite loop).
 */
export default function Carousel({ titles, activeIndex, setActiveIndex, onOpenDetail, onPlay }) {
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === titles.length - 1;

  const goPrev = () => !atStart && setActiveIndex(activeIndex - 1);
  const goNext = () => !atEnd && setActiveIndex(activeIndex + 1);

  // Arrow-key navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, titles.length]);

  if (titles.length === 0) {
    return <p className={styles.empty}>No titles match your search.</p>;
  }

  const active = titles[activeIndex];
  const firstSeason = active.seasons[0];
  const firstEp = firstSeason.episodes[0];

  return (
    <section className={styles.wrap}>
      <div className={styles.stage}>
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous title"
        >
          ‹
        </button>

        <div className={styles.track}>
          {titles.map((t, i) => {
            const offset = i - activeIndex;
            if (Math.abs(offset) > 3) return null; // skip far-off cards entirely

            const isCenter = offset === 0;
            const clamped = Math.max(-3, Math.min(3, offset));
            const style = {
              transform: `translateX(${clamped * 62}%) translateZ(${-Math.abs(clamped) * 140}px) rotateY(${-clamped * 32}deg) scale(${1 - Math.abs(clamped) * 0.14})`,
              opacity: Math.abs(clamped) > 3 ? 0 : 1 - Math.abs(clamped) * 0.22,
              zIndex: 10 - Math.abs(clamped),
              pointerEvents: Math.abs(clamped) > 3 ? "none" : "auto",
            };

            return (
              <button
                key={t.id}
                className={`${styles.card} ${isCenter ? styles.cardActive : ""}`}
                style={style}
                onClick={() => (isCenter ? onOpenDetail(t) : setActiveIndex(i))}
              >
                <span className={styles.glyph}>{t.accentGlyph}</span>
                <div className={styles.sheen} />
              </button>
            );
          })}
        </div>

        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next title"
        >
          ›
        </button>
      </div>

      <div className={styles.dots}>
        {titles.map((t, i) => (
          <button
            key={t.id}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to ${t.title}`}
          />
        ))}
      </div>

      <div className={styles.info}>
        <h1>{active.title}</h1>
        <p>{active.tagline}</p>
        <div className={styles.buttons}>
          <button className={styles.playBtn} onClick={() => onPlay(active, firstSeason, firstEp)}>
            ▶ Play S{firstSeason.season} E{firstEp.ep}
          </button>
          <button className={styles.detailBtn} onClick={() => onOpenDetail(active)}>
            View Episodes
          </button>
        </div>
      </div>
    </section>
  );
}
