import styles from "./DetailOverlay.module.css";

export default function EpisodeList({ episodes, onPlay }) {
  return (
    <div className={styles.epList}>
      {episodes.map((ep) => (
        <button key={ep.ep} className={styles.epCard} onClick={() => onPlay(ep)}>
          <div className={styles.epThumb}>
            <span>{ep.ep}</span>
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
