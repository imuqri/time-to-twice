import styles from "./Navbar.module.css";

export default function Navbar({ query, setQuery, viewMode, setViewMode }) {
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
      <div className={styles.viewToggle} role="group" aria-label="View mode">
        <button
          className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
          onClick={() => setViewMode("grid")}
          aria-pressed={viewMode === "grid"}
          title="Grid view"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
        <button
          className={`${styles.viewBtn} ${viewMode === "carousel" ? styles.active : ""}`}
          onClick={() => setViewMode("carousel")}
          aria-pressed={viewMode === "carousel"}
          title="Carousel view"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="8" height="12" rx="2" transform="rotate(-15 2 6)" opacity="0.5" />
            <rect x="8" y="4" width="8" height="16" rx="2" />
            <rect x="14" y="6" width="8" height="12" rx="2" transform="rotate(15 22 18)" opacity="0.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}