/**
 * Accepts a full YouTube URL (watch, youtu.be, embed, shorts) or a bare
 * 11-character video ID and returns just the ID. Lets you paste whatever
 * you copied from YouTube straight into the data file.
 */
export function getYouTubeId(input) {
  if (!input) return "";
  const match = input.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (match) return match[1];
  return input.trim();
}
