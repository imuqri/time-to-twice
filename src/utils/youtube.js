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

/**
 * Returns a YouTube thumbnail URL for a video ID or full URL.
 * @param {string} input - Video ID or YouTube URL
 * @param {string} quality - Thumbnail quality: 'default' (120x90), 'mqdefault' (320x180), 'hqdefault' (480x360), 'sddefault' (640x480), 'maxresdefault' (1280x720)
 * @returns {string} Thumbnail URL
 */
export function getThumbnailUrl(input, quality = 'hqdefault') {
  const id = getYouTubeId(input);
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}
