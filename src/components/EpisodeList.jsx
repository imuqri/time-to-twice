import styles from "./DetailOverlay.module.css";
import { getThumbnailUrl } from "../utils/youtube.js";

export default function EpisodeList({ episodes, onPlay }) {
  return (
    <div className={styles.epList}>
      {episodes.map((ep) => (
        <button key={ep.ep} className={styles.epCard} onClick={() => onPlay(ep)}>
          <div className={styles.epThumb}>
            <img 
              src={getThumbnailUrl(ep.youtube, 'hqdefault')} 
              alt="" 
              loading="lazy"
            />
            <span className={styles.epNumberOverlay}>{ep.ep}</span>
            <div className={styles.epPlay}>▶</div>
          </div>
          <div className={styles.epMeta}>
            <h4>{ep.title}</h4>
            <span>{ep.duration}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
