// ---------------------------------------------------------------------------
// SPA View Transition demo
//
// This file drives a single-page gallery → detail flow. DOM updates are wrapped
// in document.startViewTransition() so the browser can animate between states.
// Shared elements (image + title) morph via matching view-transition-name values.
// ---------------------------------------------------------------------------

const photos = [
  {
    id: "aurora",
    title: "Northern Lights",
    location: "Tromsø, Norway",
    description:
      "Emerald curtains ripple across the Arctic sky. The charged particles from the sun collide with atmospheric gases, painting the night in shifting bands of green and violet.",
    color: "#1a4d3e",
    accent: "#4ade80",
  },
  {
    id: "desert",
    title: "Desert Dunes",
    location: "Sahara, Morocco",
    description:
      "Wind-sculpted ridges stretch to the horizon. Each grain of sand tells a story of erosion and time, forming patterns that change with every passing storm.",
    color: "#5c3d1e",
    accent: "#fbbf24",
  },
  {
    id: "coast",
    title: "Coastal Cliffs",
    location: "Big Sur, California",
    description:
      "Fog rolls in over jagged headlands where the Pacific meets ancient rock. Seabirds wheel above tide pools glittering in the late afternoon light.",
    color: "#1e3a5f",
    accent: "#60a5fa",
  },
  {
    id: "forest",
    title: "Misty Forest",
    location: "Olympic Peninsula, Washington",
    description:
      "Towering cedars disappear into low-hanging mist. Moss carpets every surface, and the only sound is distant water dripping from fern fronds.",
    color: "#1f3d2b",
    accent: "#34d399",
  },
  {
    id: "city",
    title: "City at Dusk",
    location: "Tokyo, Japan",
    description:
      "Neon signs flicker on as the sky deepens to indigo. A river of headlights flows between glass towers, and the city exhales into evening.",
    color: "#2d1f4e",
    accent: "#c084fc",
  },
  {
    id: "glacier",
    title: "Glacier Lake",
    location: "Patagonia, Argentina",
    description:
      "Turquoise meltwater reflects ice walls carved over millennia. Cracks spider across the glacier face, releasing ancient air in quiet pops.",
    color: "#1a3a4a",
    accent: "#22d3ee",
  },
];

// Tracks which photo is open; null means the gallery grid is showing.
let selectedId = null;

const app = document.getElementById("app");

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

// Returns the gallery grid HTML. No view-transition-name here — names are
// assigned dynamically only on the elements participating in a transition.
function renderGallery() {
  return `
    <div class="gallery" role="list">
      ${photos
        .map(
          (photo) => `
        <figure
          class="gallery-card"
          role="listitem"
          tabindex="0"
          data-id="${photo.id}"
          aria-label="View ${photo.title}"
        >
          <img
            src="${makePlaceholder(photo.color, photo.accent)}"
            alt=""
          />
          <figcaption>
            <h2>${photo.title}</h2>
            <p>${photo.location}</p>
          </figcaption>
        </figure>`
        )
        .join("")}
    </div>`;
}

// Returns the detail view HTML for a single photo.
function renderDetail(photo) {
  return `
    <article class="detail">
      <div class="detail-image-wrap">
        <img
          src="${makePlaceholder(photo.color, photo.accent)}"
          alt=""
        />
      </div>
      <div class="detail-body">
        <h2>${photo.title}</h2>
        <p class="meta">${photo.location}</p>
        <p class="description">${photo.description}</p>
        <button class="back-btn" type="button" aria-label="Back to gallery">
          ← Back to gallery
        </button>
      </div>
    </article>`;
}

// Removes all inline view-transition-name values inside #app.
// Required because only ONE element per name can exist at a time; stale names
// from a previous transition (e.g. the card you navigated back to) would
// break the next forward animation.
function clearTransitionNames() {
  app.querySelectorAll("*").forEach((el) => {
    if (el.style.viewTransitionName) {
      el.style.viewTransitionName = "";
    }
  });
}

// Tags elements that should morph between old and new states.
// Matching names on both sides (hero-image, hero-title) tell the browser to
// animate those elements as shared-element transitions instead of cross-fading
// with the rest of the page.
function assignTransitionNames(sourceImg, sourceTitle, targetImg, targetTitle) {
  if (sourceImg) sourceImg.style.viewTransitionName = "hero-image";
  if (sourceTitle) sourceTitle.style.viewTransitionName = "hero-title";
  if (targetImg) targetImg.style.viewTransitionName = "hero-image";
  if (targetTitle) targetTitle.style.viewTransitionName = "hero-title";
}

// Runs a DOM update inside startViewTransition when supported.
// The callback must apply the new DOM state synchronously; the browser
// snapshots old/new views and plays the animation defined in CSS.
function transitionTo(update) {
  if (!document.startViewTransition) {
    update();
    return;
  }
  const transition = document.startViewTransition(update);
  // finished rejects with AbortError if the transition is skipped; swallow it,
  // then clean up names either way so they don't linger.
  transition.finished.catch(() => {}).finally(clearTransitionNames);
}

function bindEvents() {
  // --- Gallery → detail ---
  app.querySelectorAll(".gallery-card").forEach((card) => {
    const open = () => {
      const id = card.dataset.id;
      const photo = photos.find((p) => p.id === id);
      if (!photo) return;

      const sourceImg = card.querySelector("img");
      const sourceTitle = card.querySelector("h2");

      // 1. Clear any leftover names from a prior transition.
      // 2. Name the outgoing (old) elements before the snapshot is taken.
      clearTransitionNames();
      assignTransitionNames(sourceImg, sourceTitle, null, null);

      transitionTo(() => {
        // 3. Apply the new DOM inside the transition callback.
        selectedId = id;
        app.innerHTML = renderDetail(photo);
        // 4. Name the incoming (new) elements before the new snapshot.
        assignTransitionNames(
          null,
          null,
          app.querySelector(".detail-image-wrap img"),
          app.querySelector(".detail-body h2")
        );
        bindEvents();
      });
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // --- Detail → gallery ---
  const backBtn = app.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      const photo = photos.find((p) => p.id === selectedId);
      if (!photo) return;

      const sourceImg = app.querySelector(".detail-image-wrap img");
      const sourceTitle = app.querySelector(".detail-body h2");

      clearTransitionNames();
      assignTransitionNames(sourceImg, sourceTitle, null, null);

      transitionTo(() => {
        selectedId = null;
        app.innerHTML = renderGallery();
        // Re-find the card we came from and name it as the incoming target.
        const card = app.querySelector(`[data-id="${photo.id}"]`);
        assignTransitionNames(
          null,
          null,
          card?.querySelector("img"),
          card?.querySelector("h2")
        );
        bindEvents();
      });
    });
  }
}

// Initial render — gallery view with no transition.
app.innerHTML = renderGallery();
bindEvents();
