import styles from "./TitleGrid.module.css";

export default function TitleCard({ title, onOpen }) {
  const seasonCount = title.seasons.length;

  return (
    <button className={styles.card} onClick={() => onOpen(title)}>
      <div className={styles.poster}>
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
