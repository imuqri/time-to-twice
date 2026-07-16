import styles from "./TitleGrid.module.css";
import TitleCard from "./TitleCard.jsx";

export default function TitleGrid({ titles, onOpen }) {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.rowTitle}>Browse Titles</h2>
      <div className={styles.grid}>
        {titles.map((t) => (
          <TitleCard key={t.id} title={t} onOpen={onOpen} />
        ))}
        {titles.length === 0 && (
          <p className={styles.empty}>No titles match your search.</p>
        )}
      </div>
    </section>
  );
}
