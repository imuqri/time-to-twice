import styles from "./DetailOverlay.module.css";

export default function SeasonTabs({ seasons, activeSeason, setActiveSeason }) {
  if (seasons.length <= 1) return null;

  return (
    <div className={styles.seasonTabs}>
      {seasons.map((s) => (
        <button
          key={s.season}
          className={
            styles.seasonTab + (s.season === activeSeason ? ` ${styles.active}` : "")
          }
          onClick={() => setActiveSeason(s.season)}
        >
          <span className={styles.dot} />
          Season {s.season}
        </button>
      ))}
    </div>
  );
}
