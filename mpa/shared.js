// ---------------------------------------------------------------------------
// MPA (cross-document) View Transition helpers
//
// Unlike the SPA demo, transitions here happen across full page navigations.
// CSS opts in via @view-transition { navigation: auto } (see mpa/styles.css).
// This script coordinates shared-element names and remembers which destination
// was last visited so back-navigation can morph the correct card.
// ---------------------------------------------------------------------------

// Persists the last-opened destination across page loads (same origin).
const STORAGE_KEY = "mpa-active-destination";

// Builds an inline SVG data-URI so we don't need external image assets.
function makePlaceholder(color, accent) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}"/>
          <stop offset="100%" style="stop-color:${accent};stop-opacity:0.6"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <circle cx="400" cy="280" r="80" fill="${accent}" opacity="0.3"/>
      <circle cx="320" cy="380" r="50" fill="${accent}" opacity="0.2"/>
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Strips view-transition-name from all hero elements on the current page.
// Only one element per name is allowed; leftover names break the next transition.
function clearHeroNames() {
  document.querySelectorAll(".hero-image, .hero-title").forEach((el) => {
    el.style.viewTransitionName = "";
  });
}

// Assigns matching names so the browser morphs image/title across documents.
// The outgoing page element and incoming page element must share the same name.
function assignHeroNames(img, title) {
  if (img) img.style.viewTransitionName = "hero-image";
  if (title) title.style.viewTransitionName = "hero-title";
}

// Maps a URL path to a destination id (aurora, desert, coast).
function destinationFromPath(path) {
  if (path.includes("aurora")) return "aurora";
  if (path.includes("desert")) return "desert";
  if (path.includes("coast")) return "coast";
  return null;
}

// On the index page, tags the card that matches the last destination so the
// hero image/title can morph back from the detail page during back-navigation.
function prepareIndexDestination(dest) {
  clearHeroNames();
  const card = document.querySelector(`[data-dest="${dest}"]`);
  if (!card) return;
  assignHeroNames(
    card.querySelector(".hero-image"),
    card.querySelector(".hero-title")
  );
}

// Forward navigation: name the clicked card's image/title right before the
// browser unloads this page. The detail page has matching names in its HTML.
document.querySelectorAll(".destination-card").forEach((link) => {
  link.addEventListener("click", () => {
    const dest = link.dataset.dest;
    if (dest) sessionStorage.setItem(STORAGE_KEY, dest);
    clearHeroNames();
    assignHeroNames(
      link.querySelector(".hero-image"),
      link.querySelector(".hero-title")
    );
  });
});

// Fires on the outgoing page just before navigation unloads it.
// We record which detail page we're leaving so the index can restore the
// correct card on the way back.
window.addEventListener("pageswap", (event) => {
  if (!event.viewTransition) return;

  const dest = destinationFromPath(location.pathname);
  if (dest) sessionStorage.setItem(STORAGE_KEY, dest);
});

// Fires on the incoming page once it's ready to paint.
// If we've landed on the index after a back-navigation, tag the matching card
// so its hero elements participate in the shared-element transition.
window.addEventListener("pagereveal", (event) => {
  if (!event.viewTransition) return;

  const dest =
    destinationFromPath(location.pathname) ||
    sessionStorage.getItem(STORAGE_KEY);

  if (dest && /\/mpa\/?(index\.html)?$/.test(location.pathname)) {
    prepareIndexDestination(dest);
    // finished rejects with AbortError if the browser skips the transition
    // (e.g. a redirected navigation). Swallow it, then clear names either way.
    event.viewTransition.finished.catch(() => {}).finally(clearHeroNames);
  }
});
