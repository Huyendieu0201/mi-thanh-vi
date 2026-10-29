/* ==================================================
   MI THANH VI — JAVASCRIPT
   - Thanh tien trinh cuon trang
   - Thanh dieu huong khi cuon
   - Gach chan menu theo section dang xem
   - Hien dan noi dung khi cuon toi (nhe, IntersectionObserver)
   - Khong dung custom cursor
   - Han che animation nang
   ================================================== */

// Danh dau co JS de CSS bat hieu ung hien dan
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const progress = document.getElementById("progress");
  const nav = document.getElementById("nav");
  const navLinks = Array.from(
    document.querySelectorAll(".navlinks a")
  );

  // Cac section tuong ung voi menu dieu huong
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return null;
      }

      const section = document.querySelector(href);

      if (!section) {
        return null;
      }

      return {
        link,
        section
      };
    })
    .filter(Boolean);

  // Cap nhat thanh tien trinh va trang thai nav
  function updateScrollUI() {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const ratio =
      scrollHeight > 0
        ? Math.min(scrollTop / scrollHeight, 1)
        : 0;

    // Dung scaleX thay cho width de muot va nhe hon
    if (progress) {
      progress.style.transform = `scaleX(${ratio})`;
    }

    if (nav) {
      nav.classList.toggle("scrolled", scrollTop > 30);
    }
  }

  // Danh dau menu cua section dang duoc xem
  function updateActiveLink() {
    if (!sections.length) return;

    const marker = window.innerHeight * 0.35;
    let activeItem = null;

    sections.forEach((item) => {
      const rect = item.section.getBoundingClientRect();

      if (
        rect.top <= marker &&
        rect.bottom > marker
      ) {
        activeItem = item;
      }
    });

    // Khi o gan cuoi trang, uu tien section cuoi cung
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (nearBottom) {
      activeItem = sections[sections.length - 1];
    }

    navLinks.forEach((link) => {
      const isActive =
        activeItem && link === activeItem.link;

      link.classList.toggle("active", Boolean(isActive));

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Cap nhat giao dien khi cuon
  let ticking = false;

  function onScroll() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      updateScrollUI();
      updateActiveLink();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, {
    passive: true
  });

  window.addEventListener("resize", () => {
    updateScrollUI();
    updateActiveLink();
  });

  // Cap nhat khi bam menu
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      });

      link.classList.add("active");
      link.setAttribute("aria-current", "location");
    });
  });

  // Hien dan khi cuon toi (chi cac phan tu .reveal ben trong .section)
  const revealItems = Array.from(
    document.querySelectorAll(".section .reveal")
  );

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          // Tre nhe de cac the cung nhom hien lan luot
          const group = el.parentElement
            ? Array.from(
                el.parentElement.querySelectorAll(":scope > .reveal")
              )
            : [];
          const index = Math.max(group.indexOf(el), 0);

          el.style.transitionDelay = `${index * 90}ms`;
          el.classList.add("in");
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((el) => observer.observe(el));
  }
    // Hieu ung nhich nhe theo chuot o hero (chi may co chuot, tat khi giam chuyen dong)
  const hero = document.querySelector(".hero");
  const canHover = window.matchMedia("(hover: hover)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hero && canHover && !reduceMotion) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
    });
  }
  // Hien thi giao dien dung ngay khi tai trang
  updateScrollUI();
  updateActiveLink();
});