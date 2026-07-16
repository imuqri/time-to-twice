import { useEffect, useMemo, useState } from "react";
import { CATALOG } from "./data/catalog.js";
import Navbar from "./components/Navbar.jsx";
import Carousel from "./components/Carousel.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";
import PlayerOverlay from "./components/PlayerOverlay.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [openTitle, setOpenTitle] = useState(null);
  const [playing, setPlaying] = useState(null); // { title, season, episode }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  // Reset to the first card whenever the visible set changes (e.g. search)
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handlePlay = (title, season, episode) => {
    setPlaying({ title, season, episode });
  };

  return (
    <div>
      <Navbar query={query} setQuery={setQuery} />
      <Carousel
        titles={filtered}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onOpenDetail={setOpenTitle}
        onPlay={handlePlay}
      />

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
