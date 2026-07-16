import { useMemo, useState, useEffect } from "react";
import { CATALOG } from "./data/TTT-Catalog.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TitleGrid from "./components/TitleGrid.jsx";
import Carousel from "./components/Carousel.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";
import PlayerOverlay from "./components/PlayerOverlay.jsx";

const VIEW_MODE_KEY = "ttt-view-mode";

export default function App() {
  const [query, setQuery] = useState("");
  const [openTitle, setOpenTitle] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(VIEW_MODE_KEY) || "grid";
    }
    return "grid";
  });
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  const handlePlay = (title, season, episode) => {
    setPlaying({ title, season, episode });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg)'
    }}>
      <Navbar
        query={query}
        setQuery={setQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main style={{
        flex: 1,
        width: '100%',
        marginTop: viewMode === 'grid' ? '72px' : 0,
        overflow: viewMode === 'grid' ? 'auto' : 'hidden'
      }}>
        {viewMode === "grid" ? (
          <>
            <Hero title={filtered[0]} onPlay={handlePlay} />
            <TitleGrid titles={filtered} onOpen={setOpenTitle} />
          </>
        ) : (
          <Carousel
            titles={filtered}
            activeIndex={carouselIndex}
            setActiveIndex={setCarouselIndex}
            onOpenDetail={setOpenTitle}
            onPlay={handlePlay}
            compactHero={true}
          />
        )}
      </main>

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