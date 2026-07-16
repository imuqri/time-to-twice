# Unembeddable YouTube Video Handling - Implementation Plan

## Problem
Some episodes in the catalog show "Video unavailable" when embedded, requiring users to open on YouTube directly. This happens when:
- Embedding disabled by uploader
- Age-restricted content
- Region-blocked
- Copyright/Content ID claims
- Private/Unlisted videos in playlists
- Deleted videos (still in playlist data)

## Solution Options

### Option 1: Fallback "Watch on YouTube" Button (Recommended)
Add a fallback UI in PlayerOverlay that detects iframe load failure and shows a button to open the video on youtube.com.

**Pros:**
- Simple, immediate fix
- Works for all restriction types
- No extra API calls during catalog generation
- User stays in app until they choose to leave

**Cons:**
- User sees error briefly before fallback
- Requires iframe error detection

---

### Option 2: Pre-filter During Catalog Generation
Check `status.embeddable` via YouTube API during `generate-catalog.js` and exclude unembeddable videos.

**Pros:**
- Clean catalog - only embeddable videos
- No runtime errors

**Cons:**
- Extra API call per video (50 videos = 50 extra calls)
- May hit quota limits
- Age-restricted videos still fail even if `embeddable: true`
- Removes content user might want (they could watch on YouTube)

---

### Option 3: Hybrid - Detect at Runtime + Cache
Attempt embed, on failure cache the video ID as "unembeddable" locally, show fallback. Next session skips embed attempt.

**Pros:**
- Smart caching
- No extra API quota during generation

**Cons:**
- Still shows error on first load
- Requires localStorage/IndexedDB

---

## Recommended Approach: Option 1 + Enhanced UX

### Implementation Details

#### 1. PlayerOverlay.jsx Changes

**Current flow:**
```jsx
<iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} />
```

**New flow using YouTube IFrame Player API:**
```jsx
const [playerReady, setPlayerReady] = useState(false);
const [embedError, setEmbedError] = useState(false);
const playerRef = useRef(null);
const containerRef = useRef(null);

useEffect(() => {
  // Load YouTube IFrame API
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: video.youtube,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => setPlayerReady(true),
        onError: (event) => {
          // Error codes: 2=invalid param, 5=HTML5 error, 100=not found, 101/150=embedding disabled
          if ([5, 100, 101, 150].includes(event.data)) {
            setEmbedError(true);
          }
        },
      },
    });
  };

  return () => {
    if (playerRef.current) playerRef.current.destroy();
    delete window.onYouTubeIframeAPIReady;
  };
}, [video.youtube]);

if (embedError) {
  return (
    <div className="player-overlay">
      <div className="player-fallback">
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="fallback-content">
          <h3>Video Unavailable</h3>
          <p>This video can't be embedded.</p>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-btn"
          >
            ▶ Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="player-overlay" onClick={onClose}>
    <div className="player-wrapper" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>✕</button>
      <div ref={containerRef} id="yt-player" />
    </div>
  </div>
);
```

#### 2. CSS for Fallback State

```css
/* PlayerOverlay.module.css */
.player-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 24px;
  text-align: center;
  color: var(--text);
}

.fallback-content h3 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px;
  letter-spacing: 1px;
  margin: 0 0 12px;
}

.fallback-content p {
  color: var(--text-muted);
  margin: 0 0 24px;
}

.youtube-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--accent);
  color: #1a0510;
  border-radius: 8px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.youtube-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 0 20px rgba(255, 47, 146, 0.4);
}
```

---

## Alternative: Simple Iframe + PostMessage (Lighter Weight)

If avoiding IFrame Player API dependency:

```jsx
const [embedError, setEmbedError] = useState(false);

useEffect(() => {
  const handleMessage = (event) => {
    if (event.origin !== 'https://www.youtube.com') return;
    if (event.data === 'onError' || event.data?.event === 'error') {
      setEmbedError(true);
    }
  };
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

<iframe
  src={`https://www.youtube.com/embed/${video.youtube}?autoplay=1&enablejsapi=1`}
  onLoad={() => {
    // Fallback: if iframe loads but video doesn't play, timeout check
    setTimeout(() => {
      try {
        iframeRef.current.contentWindow.postMessage('{"event":"listening","id":"yt-player"}', '*');
      } catch {}
    }, 1000);
  }}
  ref={iframeRef}
  style={{ display: embedError ? 'none' : 'block' }}
/>
```

**Tradeoff:** Less reliable than IFrame Player API, but no external script load.

---

## Testing Checklist

- [ ] Find known unembeddable videos in catalog (test with age-restricted, region-locked, embedding disabled)
- [ ] Verify fallback UI appears correctly
- [ ] Test "Watch on YouTube" opens in new tab
- [ ] Verify close button works in fallback state
- [ ] Test autoplay behavior (may need `autoplay=1` + `mute=1` for browser policies)
- [ ] Check mobile layout for fallback

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/PlayerOverlay.jsx` | Replace iframe with YouTube IFrame Player API, add error handling + fallback UI |
| `src/components/PlayerOverlay.module.css` | Add fallback state styles |

---

## Future Enhancements

1. **Cache unembeddable IDs** in localStorage to skip embed attempt on repeat visits
2. **Show restriction reason** (age, region, copyright) from error code
3. **Thumbnail preview** in fallback state (use existing thumbnail)
4. **Analytics** - track how often fallback triggers