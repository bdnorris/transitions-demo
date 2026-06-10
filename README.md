# Web Platform Demos

Static demos for the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) and [CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap). No build step required.

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

### CSS Scroll Snap

| Demo | Path | Description |
|------|------|-------------|
| Full-page slides | `scroll/fullpage/` | Vertical `scroll-snap-type: y mandatory` with viewport-height sections |
| Carousel | `scroll/carousel/` | Horizontal `scroll-snap-type: x mandatory` card track |

**Browser support:** Scroll snap is widely supported in all modern browsers.

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

### View Transition demos

See the SPA and MPA sections in the hub. Key files: `spa/app.js`, `mpa/styles.css`, `mpa/shared.js`.
