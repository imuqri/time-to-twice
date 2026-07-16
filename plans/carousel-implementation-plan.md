# Carousel Implementation Plan

## Overview
Implement a responsive 3D coverflow carousel component based on the UI Sample, with a toggle to switch between Grid View (current) and Carousel View (new).

## Decisions

| # | Decision | Implementation |
|---|----------|----------------|
| 1 | Font Loading | Option A — Add Google Fonts preconnect to `index.html` |
| 2 | Carousel Height | Responsive: large center card on desktop, scaled via `--scale-factor` |
| 3 | Empty State | Show "No titles match your search" in carousel mode |
| 4 | Hero in Carousel Mode | Compact Hero — inline title/tagline/buttons above carousel |
| 5 | View Toggle Persistence | Save `viewMode` to `localStorage`, restore on mount |

## File Changes

### 1. `index.html` — Add Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2. `src/styles/index.css` — Update Color Palette + Carousel Constants
```css
:root {
  --bg: #0a0508;
  --surface: #17101a;
  --surface-hover: #221527;
  --accent: #ff5fa2;
  --accent-soft: #ff9bc7;
  --apricot: #fcc89b;
  --apricot-soft: #ffe2c2;
  --gradient-brand: linear-gradient(120deg, var(--accent), var(--apricot));
  --text: #f7eef2;
  --text-muted: #b09aac;
  --border: rgba(255, 255, 255, 0.08);
  
  /* Carousel scaling constants */
  --carousel-card-width: 240px;
  --carousel-max-translate-x: 62%;
  --carousel-max-translate-z: -140px;
  --carousel-max-rotate-y: -32deg;
  --carousel-max-scale-factor: 0.86;
  --carousel-desktop-width: 1440px;
}
```

### 3. `src/components/Carousel.jsx` — New Component
**Props:**
```jsx
{
  titles: Title[],
  activeIndex: number,
  setActiveIndex: (index) => void,
  onOpenDetail: (title) => void,
  onPlay: (title, season, episode) => void,
  compactHero?: boolean
}
```

**Features:**
- Responsive 3D coverflow with `--scale-factor` based on viewport width
- Touch/swipe navigation (50px threshold)
- Keyboard navigation (ArrowLeft/ArrowRight)
- Click side card to center
- Arrow buttons (prev/next) with disabled states
- Dot indicators with gradient active state
- Compact hero mode (title, tagline, Play/View Episodes buttons)
- Empty state handling
- Bebas Neue glyph on cards, sheen sweep hover effect

### 4. `src/components/Carousel.module.css` — New Styles
- Scaled 3D transforms using CSS custom properties
- Responsive breakpoints for stage height, perspective, track height
- Glow effects: `box-shadow: 0 20px 60px rgba(255, 95, 162, 0.25)` on active card
- Gradient border on active card: `var(--gradient-brand)` border-box
- Compact hero styles (smaller on mobile)
- Touch-friendly arrow/dot sizing on mobile

### 5. `src/App.jsx` — View Toggle + localStorage
```jsx
const [viewMode, setViewMode] = useState(() => 
  localStorage.getItem('ttt_viewMode') || 'grid'
);
const [carouselIndex, setCarouselIndex] = useState(0);

// Conditional render:
{viewMode === 'grid' ? (
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
```

### 6. `src/components/Navbar.jsx` + `Navbar.module.css` — Toggle Buttons
- Two icon buttons: Grid (2×2) and Carousel (3D stack)
- Active state uses `var(--gradient-brand)` background
- Stored in localStorage via callback from App

### 7. `src/components/TitleGrid.module.css` — Optional Color Sync
- Update `.beam` gradient to use new `--accent` (#ff5fa2)
- Update `.card:hover .poster` border-color to `--accent`

## Responsive Scale Factor

```css
--scale-factor: clamp(0.4, 100vw / 1440, 1);
```

| Viewport | Scale | Visual Effect |
|----------|-------|---------------|
| 375px | 0.40 | Compressed 3D, large center glyph |
| 768px | 0.53 | Medium depth |
| 1024px | 0.71 | Deep 3D |
| 1440px+ | 1.00 | Full coverflow |

## Touch/Swipe Implementation
```jsx
const touchStartRef = useRef(null);

const onTouchStart = (e) => {
  touchStartRef.current = e.touches[0].clientX;
};

const onTouchEnd = (e) => {
  if (touchStartRef.current === null) return;
  const deltaX = e.changedTouches[0].clientX - touchStartRef.current;
  if (Math.abs(deltaX) > 50) {
    deltaX < 0 ? goNext() : goPrev();
  }
  touchStartRef.current = null;
};
```

## Implementation Order
1. `index.html` — Font preconnect
2. `src/styles/index.css` — Color palette + constants
3. `src/components/Carousel.jsx` — Core component
4. `src/components/Carousel.module.css` — Component styles
5. `src/App.jsx` — View toggle state + conditional render
6. `src/components/Navbar.jsx` — Toggle UI
7. `src/components/Navbar.module.css` — Toggle styles
8. `src/components/TitleGrid.module.css` — Color sync (optional)