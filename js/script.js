// Progress bar
const progress = document.getElementById("progress");

window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const maxScroll = h.scrollHeight - h.clientHeight;

  const scrolled = maxScroll > 0
    ? (h.scrollTop / maxScroll) * 100
    : 0;

  progress.style.width = scrolled + "%";
});

// Nav scroll effect
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealEls.forEach((el) => io.observe(el));

// Custom cursor (desktop only)
if (window.matchMedia("(pointer: fine)").matches) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;

    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;

    ring.style.left = rx + "px";
    ring.style.top = ry + "px";

    requestAnimationFrame(loop);
  };

  loop();

  document
    .querySelectorAll("a, button, .reason, .guide-step, .ingredient-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });

      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
}