# Time to Twice

A fully front-end, Netflix-style site for browsing and watching *Time to Twice*
episodes embedded from YouTube. TWICE-themed (neon magenta on near-black).

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. That's it — no backend, no API keys, no build
step beyond Vite's own.

To ship it: `npm run build` produces a static `dist/` folder you can host
anywhere (Vercel, Netlify, GitHub Pages, Cloudflare Pages, a plain S3 bucket
— any static host works, since this is 100% client-side).

## Adding content

Everything you'll normally touch lives in **`src/data/catalog.js`**. It's an
array of titles, each with seasons, each with episodes:

```js
{
  id: "some-title",
  title: "Some Title",
  tagline: "one line description",
  accentGlyph: "ST",           // short text shown on the poster card
  seasons: [
    {
      season: 1,
      episodes: [
        { ep: 1, title: "Episode name", duration: "12:34", youtube: "PASTE_URL_OR_ID_HERE" },
      ],
    },
  ],
}
```

- `youtube` accepts a full YouTube link (`https://www.youtube.com/watch?v=...`,
  `youtu.be/...`, etc.) or just the bare 11-character video ID — both work,
  see `src/utils/youtube.js`.
- A title with one season just renders straight to the episode list; season
  tabs only appear automatically once a title has 2+ seasons.
- No image assets are needed — poster cards are CSS-generated from
  `accentGlyph`, so adding a title never requires finding/uploading artwork.

## Project structure

```
src/
  data/
    catalog.js          <- edit this to add titles/seasons/episodes
  utils/
    youtube.js           <- URL/ID parsing helper
  components/
    Navbar.jsx              + Navbar.module.css
    Carousel.jsx            + Carousel.module.css   (3D coverflow browser)
    DetailOverlay.jsx  \
    SeasonTabs.jsx        -->  + DetailOverlay.module.css (shared)
    EpisodeList.jsx     /
    PlayerOverlay.jsx      + PlayerOverlay.module.css
  App.jsx                 <- wires state + components together
  main.jsx                <- React entry point
  styles/index.css        <- global CSS variables (theme colors, fonts)
```

Each component owns its own `.module.css` file (CSS Modules, built in to
Vite, no config needed), so styling one piece never risks breaking another.

## Theme

Colors live as CSS variables in `src/styles/index.css`:

| Variable | Use |
|---|---|
| `--bg` | page background |
| `--surface` | cards, panels |
| `--accent` | Neon Magenta `#FF5FA2` — buttons, active states, glow |
| `--accent-soft` | lighter magenta, hover states |
| `--apricot` | Apricot Peach `#FCC89B` — glyphs, badges, warmth |
| `--gradient-brand` | apricot → magenta gradient, used on the play button, logo, and center carousel card border |
| `--text` / `--text-muted` | primary / secondary text |

These are TWICE's actual two official fandom colors, mixed via
`--gradient-brand` so the UI reads as apricot+magenta rather than a flat
magenta-on-black look. Change the variables once and the whole app re-themes.

## Browsing UI

The homepage is a **3D coverflow carousel** (`Carousel.jsx`): titles line up
left to right, the center card is large and upright, side cards tilt away in
3D. It's bounded, not a 360° loop — you start on the first title, can only
go as far as the last one, and back again. Navigate via the arrow buttons,
the dots, clicking a side card to bring it to center, or the left/right
arrow keys. Clicking the *center* card (or "View Episodes") opens the
season/episode overlay.

## Scaling ideas

- **Categories/rows** — if you group titles (e.g. "Reality", "Behind the
  Scenes"), turn `TitleGrid` into multiple rows, one per category, each
  filtering `CATALOG` by a `category` field you add to the data.
- **Watch progress** — `localStorage` (or a small backend later) keyed by
  episode id, read in `EpisodeList` to show a "continue watching" state.
- **Routing** — if you want shareable URLs per title/episode, add
  `react-router-dom` and swap the overlay `useState`s for routes.
- **Search** — current search is a simple substring match on title; swap in
  Fuse.js if you want fuzzy matching across tags/descriptions later.
