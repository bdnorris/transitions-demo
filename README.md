# View Transition API Demo

A static demo showcasing both flavors of the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API):

- **SPA (single-document)** — `spa/` uses `document.startViewTransition()` to animate between a gallery grid and detail view in one page.
- **MPA (cross-document)** — `mpa/` uses `@view-transition { navigation: auto }` so full page navigations animate between separate HTML documents.

## Run locally

Cross-document transitions require same-origin navigation. Serve the folder over HTTP:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:3000` (serve) or `http://localhost:8080`.

## Browser support

| Feature | Minimum |
|---------|---------|
| SPA (`startViewTransition`) | Chrome 111+, Edge 111+, Safari 18+ |
| Cross-document (`@view-transition`) | Chrome 126+, Edge 126+ |

Firefox does not yet support cross-document view transitions.

## What to look for

### SPA demo

1. Open **Single-document** from the hub.
2. Click any photo card — the image and title morph into the detail layout while the rest of the page cross-fades.
3. Click **Back to gallery** — the shared elements animate back to their grid positions.

Key code: `spa/app.js` wraps DOM updates in `document.startViewTransition()`, and matching elements use `view-transition-name: hero-image` / `hero-title`.

### MPA demo

1. Open **Cross-document** from the hub.
2. Click a destination card — the browser captures snapshots of both documents and plays a slide/fade transition.
3. The hero image and title morph between pages because both documents assign the same `view-transition-name`.
4. Use the back link to see the reverse transition.

Key code: `mpa/styles.css` opts in with `@view-transition { navigation: auto }`. `mpa/shared.js` hooks `pageswap` / `pagereveal` to tag transition types.
