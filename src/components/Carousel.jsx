import { useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";
import { getThumbnailUrl } from "../utils/youtube.js";
import CarouselDots3D from "./CarouselDots3D";

function getScaleFactor() {
  if (typeof window === "undefined") return 1;
  return Math.max(0.4, Math.min(1, window.innerWidth / 1440));
}

export default function Carousel({
  titles,
  activeIndex,
  setActiveIndex,
  onOpenDetail,
  onPlay,
  compactHero = true,
}) {
  const [scaleFactor, setScaleFactor] = useState(getScaleFactor);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScaleFactor(getScaleFactor());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, titles.length]);

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === titles.length - 1;

  const goPrev = () => !atStart && setActiveIndex(activeIndex - 1);
  const goNext = () => !atEnd && setActiveIndex(activeIndex + 1);

  const onTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(deltaX) > 50) {
      deltaX < 0 ? goNext() : goPrev();
    }
    touchStartRef.current = null;
  };

  if (titles.length === 0) {
    return (
      <section className={styles.wrap} style={{ background: "none" }}>
        <p className={styles.empty}>No titles match your search.</p>
      </section>
    );
  }

  const active = titles[activeIndex];
  const firstSeason = active.seasons[0];
  const firstEp = firstSeason?.episodes[0];

  const maxTranslateX = 62;
  const maxTranslateZ = 140;
  const maxRotateY = 32;
  const maxScaleReduction = 0.14;

  return (
    <section className={styles.wrap}>
      {compactHero && active && (
        <div className={styles.compactHero}>
          <h1 className={styles.compactTitle}>{active.title}</h1>
          <p className={styles.compactTagline}>{active.tagline}</p>
          <div className={styles.compactButtons}>
            <button
              className={styles.compactPlayBtn}
              onClick={() => onPlay(active, firstSeason, firstEp)}
            >
              ▶ Play S{firstSeason.season} E{firstEp.ep}
            </button>
            <button
              className={styles.compactDetailBtn}
              onClick={() => onOpenDetail(active)}
            >
              View Episodes
            </button>
          </div>
        </div>
      )}

      <div className={styles.stage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous title"
        >
          ◀
        </button>

        <div className={styles.track}>
          {titles.map((t, i) => {
            const offset = i - activeIndex;
            if (Math.abs(offset) > 3) return null;

            const isCenter = offset === 0;
            const clamped = Math.max(-3, Math.min(3, offset));
            const absOffset = Math.abs(clamped);

            const translateX = clamped * maxTranslateX * scaleFactor;
            const translateZ = -absOffset * maxTranslateZ * scaleFactor;
            const rotateY = -clamped * maxRotateY * scaleFactor;
            const scale = 1 - absOffset * maxScaleReduction * scaleFactor;

            const style = {
              transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              opacity: Math.abs(clamped) > 3 ? 0 : 1 - absOffset * 0.22,
              zIndex: 10 - absOffset,
              pointerEvents: Math.abs(clamped) > 3 ? "none" : "auto",
            };

            const firstEpTitle = t.seasons?.[0]?.episodes?.[0];
            const thumbUrl = firstEpTitle ? getThumbnailUrl(firstEpTitle.youtube, 'hqdefault') : null;

            return (
              <button
                key={t.id}
                className={`${styles.card} ${isCenter ? styles.cardActive : ""}`}
                style={style}
                onClick={() => (isCenter ? onOpenDetail(t) : setActiveIndex(i))}
              >
                <div className={styles.poster}>
                  {thumbUrl && (
                    <img
                      src={thumbUrl}
                      alt=""
                      loading="lazy"
                      className={styles.posterImg}
                    />
                  )}
                  <span className={styles.glyph}>{t.accentGlyph}</span>
                  <div className={styles.sheen} />
                </div>
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
          ▶
        </button>
      </div>

      <CarouselDots3D
        count={titles.length}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

      {!compactHero && active && (
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
      )}
    </section>
  );
}