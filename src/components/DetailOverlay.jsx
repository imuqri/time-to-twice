import { useState } from "react";
import styles from "./DetailOverlay.module.css";
import SeasonTabs from "./SeasonTabs.jsx";
import EpisodeList from "./EpisodeList.jsx";

export default function DetailOverlay({ title, onClose, onPlay }) {
  const [activeSeason, setActiveSeason] = useState(title.seasons[0].season);
  const season = title.seasons.find((s) => s.season === activeSeason);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.detail} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <div className={styles.header}>
          <span className={styles.headerGlyph}>{title.accentGlyph}</span>
          <div>
            <h2>{title.title}</h2>
            <p>{title.tagline}</p>
          </div>
        </div>

        <SeasonTabs
          seasons={title.seasons}
          activeSeason={activeSeason}
          setActiveSeason={setActiveSeason}
        />

        <EpisodeList
          episodes={season.episodes}
          onPlay={(ep) => onPlay(title, season, ep)}
        />
      </div>
    </div>
  );
}
