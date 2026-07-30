# Web Platform Demos

Static demos for the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap), and the [Imgix Video API](https://docs.imgix.com/en-US/apis/video/overview). No build step required.

## Run locally

Serve the folder over HTTP:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:3000` (serve) or `http://localhost:8080`.

## Demos

### View Transition API

| Demo | Path | Description |
|------|------|-------------|
| Single-document (SPA) | `spa/` | `document.startViewTransition()` animates a gallery → detail flow |
| Cross-document (MPA) | `mpa/` | `@view-transition { navigation: auto }` animates full page navigations |

**Browser support:** SPA works in Chrome 111+, Edge 111+, Safari 18+. Cross-document requires Chrome 126+ / Edge 126+.

**Netlify note:** Cross-document transitions are skipped on redirected navigations. This repo’s `netlify.toml` disables Pretty URLs so `.html` links serve without a 301.

### CSS Scroll Snap

| Demo | Path | Description |
|------|------|-------------|
| Full-page slides | `scroll/fullpage/` | Vertical `scroll-snap-type: y mandatory` with viewport-height sections |
| Carousel | `scroll/carousel/` | Horizontal `scroll-snap-type: x mandatory` card track |

**Browser support:** Scroll snap is widely supported in all modern browsers.

### Imgix Video

| Path | Description |
|------|-------------|
| `imgix-video/` | Side-by-side demos of Imgix Video URL parameters on one source MP4 |

All demos use the same Colorado Premium Meats spot from `coloradopremium.imgix.net`. Most transforms need `fm=mp4` (or another video format) for Imgix Video parameters to apply.

| # | Demo | Key parameters |
|---|------|----------------|
| 1 | Base video | Unmodified source URL (no params) |
| 2 | Auto-optimized MP4 | `fm=mp4&video-aq=enhanced` |
| 3 | Manual quality | `fm=mp4&q=33` |
| 4 | Slow motion | `fm=mp4&video-speed=0.5` |
| 5 | Video preview | `fm=mp4&video-preview=true&video-preview-duration=5&video-preview-segment-duration=1` |
| 6 | Generated subtitles | Video `fm=mp4` + track `fm=vtt&video-generate-subtitles=true` |
| 7 | Clip | `fm=mp4&video-clip-start=10&video-clip-end=15` |
| 8 | Video filter | `fm=mp4&video-filter=muted` (+ list of other presets) |
| 9 | Size to square | `w=720&h=720&fit=crop` vs `fit=smart-crop` |
| 10 | Fill square → HD | `rect=…&w=1920&h=1080&fit=fill&fill=blur` |
| 11 | Spritesheet | `fm=spritesheet&video-spritesheet-interval=auto` |
| 12 | Text overlays | `txt=Hello` / `txt[1]=World` + `video-txt-transition=slideup` |
| 13 | VFX bloom | `fm=mp4&video-vfx-bloom=80` (+ list of other effects) |
| 14 | Watermark | `mark=` URL-encoded full image URL + `mark-align=center,middle` |

**First request:** Some renders (preview, subtitles, smart-crop, VFX, etc.) may return `423` until Imgix finishes encoding. Poll or refresh after a minute; results are cached afterward.

Docs: [Video API overview](https://docs.imgix.com/en-US/apis/video/overview)

## What to look for

### Full-page scroll snap

1. Open **Full-page slides** from the hub.
2. Scroll with wheel, trackpad, or touch — each gesture snaps to the next section.
3. Use the dot nav on the right to jump between slides.

Key CSS: `scroll-snap-type` on `.slides`, `scroll-snap-align: start` and `scroll-snap-stop: always` on each `.slide`.

### Carousel scroll snap

1. Open **Carousel** from the hub.
2. Drag the track horizontally, or use the arrow buttons / keyboard arrows.
3. Each card snaps into place at the leading edge.

Key CSS: `scroll-snap-type: x mandatory` on `.carousel`, `scroll-snap-align: start` on each `.carousel-card`.

### Imgix Video

1. Open **Video demos** from the hub (`/imgix-video/`).
2. Scroll through each section and play the players side by side to compare transforms.
3. Enable CC on Demo 6 for AI subtitles; compare crop vs smart-crop on Demo 9.

Key files: `imgix-video/index.html`, `imgix-video/styles.css`.

### View Transition demos

See the SPA and MPA sections in the hub. Key files: `spa/app.js`, `mpa/styles.css`, `mpa/shared.js`.
