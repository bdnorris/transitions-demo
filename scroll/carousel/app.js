// Carousel helpers: arrow buttons scroll by one card width.
// The snap behavior itself is CSS (scroll-snap-type / scroll-snap-align).

const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const counter = document.getElementById("counter");
const cards = [...carousel.querySelectorAll(".carousel-card")];

function getCardStride() {
  const card = cards[0];
  const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
  return card.offsetWidth + gap;
}

function getActiveIndex() {
  const stride = getCardStride();
  return Math.round(carousel.scrollLeft / stride);
}

function updateUI() {
  const index = getActiveIndex();
  const clamped = Math.max(0, Math.min(index, cards.length - 1));

  counter.textContent = `${clamped + 1} / ${cards.length}`;
  prevBtn.disabled = clamped === 0;
  nextBtn.disabled = clamped === cards.length - 1;

  cards.forEach((card, i) => {
    card.classList.toggle("is-active", i === clamped);
  });
}

function scrollToIndex(index) {
  carousel.scrollTo({ left: getCardStride() * index, behavior: "smooth" });
}

prevBtn.addEventListener("click", () => {
  scrollToIndex(getActiveIndex() - 1);
});

nextBtn.addEventListener("click", () => {
  scrollToIndex(getActiveIndex() + 1);
});

// Keep UI in sync after drag/swipe scrolling settles.
carousel.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateUI);
}, { passive: true });

// Keyboard navigation when the carousel has focus.
carousel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    scrollToIndex(getActiveIndex() - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    scrollToIndex(getActiveIndex() + 1);
  }
});

updateUI();
