import styles from "./Navbar.module.css";

export default function Navbar({ query, setQuery }) {
  return (
    <header className={styles.nav}>
      <div className={styles.logo}>
        TIME TO <span>TWICE</span>
      </div>
      <input
        className={styles.search}
        placeholder="Search titles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </header>
  );
}
