import styles from "./Hero.module.css";
import { getThumbnailUrl } from "../utils/youtube.js";

export default function Hero({ title, onPlay }) {
  if (!title) return null;
  const firstSeason = title.seasons[0];
  const firstEp = firstSeason.episodes[0];
  const thumbUrl = firstEp.youtube ? getThumbnailUrl(firstEp.youtube, 'maxresdefault') : null;

  return (
    <section className={styles.hero}>
      {thumbUrl && (
        <div className={styles.heroBg} style={{ backgroundImage: `url(${thumbUrl})` }} />
      )}
      <div className={styles.heroOverlay} />
      <div className={styles.glyph}>{title.accentGlyph}</div>
      <div className={styles.content}>
        <h1>{title.title}</h1>
        <p>{title.tagline}</p>
        <button
          className={styles.playBtn}
          onClick={() => onPlay(title, firstSeason, firstEp)}
        >
          ▶ Play S{firstSeason.season} E{firstEp.ep}
        </button>
      </div>
    </section>
  );
}
