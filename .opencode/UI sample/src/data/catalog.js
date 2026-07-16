/**
 * ============================================================
 * CATALOG — this is the file you edit to add/update content.
 * No other file needs to change when you add a title, season,
 * or episode.
 *
 * Structure:
 *   title
 *     └── seasons[]
 *           └── episodes[]
 *
 * `youtube` accepts either a full YouTube URL or just the
 * 11-character video ID — see src/utils/youtube.js.
 * ============================================================
 */
export const CATALOG = [
  {
    id: "meme-meme",
    title: "Meme? Meme!",
    tagline: "TWICE reacts to the internet's finest chaos",
    accentGlyph: "M?M",
    seasons: [
      {
        season: 1,
        episodes: [
          { ep: 1, title: "Episode 1", duration: "14:02", youtube: "dQw4w9WgXcQ" },
          { ep: 2, title: "Episode 2", duration: "13:41", youtube: "dQw4w9WgXcQ" },
          { ep: 3, title: "Episode 3", duration: "15:10", youtube: "dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    id: "do-what-we-like",
    title: "Do What We Like",
    tagline: "Nine members, zero rules, one van",
    accentGlyph: "DWWL",
    seasons: [
      {
        season: 1,
        episodes: [
          { ep: 1, title: "Road Trip Begins", duration: "18:22", youtube: "dQw4w9WgXcQ" },
          { ep: 2, title: "Beach Day", duration: "16:05", youtube: "dQw4w9WgXcQ" },
        ],
      },
      {
        season: 2,
        episodes: [
          { ep: 1, title: "Camping Chaos", duration: "17:30", youtube: "dQw4w9WgXcQ" },
          { ep: 2, title: "City Lights", duration: "19:12", youtube: "dQw4w9WgXcQ" },
          { ep: 3, title: "Finale", duration: "21:00", youtube: "dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    id: "twice-tv",
    title: "TWICE TV",
    tagline: "Behind every comeback",
    accentGlyph: "TVT",
    seasons: [
      {
        season: 1,
        episodes: [
          { ep: 1, title: "Comeback Prep pt.1", duration: "11:48", youtube: "dQw4w9WgXcQ" },
          { ep: 2, title: "Comeback Prep pt.2", duration: "12:33", youtube: "dQw4w9WgXcQ" },
          { ep: 3, title: "MV Shoot Diary", duration: "14:57", youtube: "dQw4w9WgXcQ" },
          { ep: 4, title: "Music Show Wins", duration: "10:20", youtube: "dQw4w9WgXcQ" },
        ],
      },
    ],
  },
];
