import { useMemo, useState } from "react";
import { CATALOG } from "./data/TTT-Catalog.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TitleGrid from "./components/TitleGrid.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";
import PlayerOverlay from "./components/PlayerOverlay.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [openTitle, setOpenTitle] = useState(null);
  const [playing, setPlaying] = useState(null); // { title, season, episode }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  const handlePlay = (title, season, episode) => {
    setPlaying({ title, season, episode });
  };

  return (
    <div>
      <Navbar query={query} setQuery={setQuery} />
      <Hero title={filtered[0]} onPlay={handlePlay} />
      <TitleGrid titles={filtered} onOpen={setOpenTitle} />

      {openTitle && (
        <DetailOverlay
          title={openTitle}
          onClose={() => setOpenTitle(null)}
          onPlay={handlePlay}
        />
      )}

      {playing && (
        <PlayerOverlay
          title={playing.title}
          season={playing.season}
          episode={playing.episode}
          onClose={() => setPlaying(null)}
        />
      )}
    </div>
  );
}
