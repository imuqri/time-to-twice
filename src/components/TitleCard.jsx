import { useRef, useState, useEffect } from 'react';
import styles from "./TitleGrid.module.css";
import { getThumbnailUrl } from "../utils/youtube.js";

export default function TitleCard({ title, onOpen }) {
  const seasonCount = title.seasons.length;
  const firstEp = title.seasons?.[0]?.episodes?.[0];
  const thumbUrl = firstEp ? getThumbnailUrl(firstEp.youtube, 'hqdefault') : null;
  
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <button ref={cardRef} className={styles.card} onClick={() => onOpen(title)}>
      <div className={styles.poster}>
        {thumbUrl && inView && !thumbError && (
          <div className={styles.thumbWrap}>
            <img
              src={thumbUrl}
              alt=""
              loading="lazy"
              className={`${styles.posterImg} ${thumbLoaded ? styles.loaded : ''}`}
              onLoad={() => setThumbLoaded(true)}
              onError={() => setThumbError(true)}
            />
          </div>
        )}
        <span className={styles.glyph}>{title.accentGlyph}</span>
        <div className={styles.beam} />
      </div>
      <div className={styles.meta}>
        <h3>{title.title}</h3>
        <span>{seasonCount} {seasonCount > 1 ? "Seasons" : "Season"}</span>
      </div>
    </button>
  );
}
