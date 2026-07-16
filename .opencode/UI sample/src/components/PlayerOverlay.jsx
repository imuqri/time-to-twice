import styles from "./PlayerOverlay.module.css";
import { getYouTubeId } from "../utils/youtube.js";

export default function PlayerOverlay({ title, season, episode, onClose }) {
  const videoId = getYouTubeId(episode.youtube);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.player} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
        <div className={styles.frame}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={episode.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className={styles.info}>
          <h3>
            {title.title} · S{season.season} E{episode.ep}
          </h3>
          <p>{episode.title}</p>
        </div>
      </div>
    </div>
  );
}
