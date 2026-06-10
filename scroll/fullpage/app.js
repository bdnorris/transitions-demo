// Optional enhancement: keep dot indicators in sync with the active slide.
// Scroll snapping itself is entirely CSS-driven.

const slidesEl = document.getElementById("slides");
const dots = document.querySelectorAll(".slide-dot");
const slideEls = document.querySelectorAll(".slide");

function setActiveDot(index) {
  dots.forEach((dot, i) => {
    const active = i === index;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
}

// IntersectionObserver tracks which slide is most visible.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...slideEls].indexOf(entry.target);
        setActiveDot(index);
      }
    });
  },
  { root: slidesEl, threshold: 0.55 }
);

slideEls.forEach((slide) => observer.observe(slide));

// Anchor clicks: smooth scroll to the target slide.
dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    const id = dot.getAttribute("href").slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  });
});
