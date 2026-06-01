import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const progress = document.querySelector("[data-scroll-progress]");
const hero = document.querySelector("[data-hero]");
const heroBg = document.querySelector("[data-depth]");
const cursor = document.querySelector("[data-cursor]");
const canvas = document.querySelector("[data-noise]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeNav() {
  body.classList.remove("nav-open");
  nav.classList.remove("is-active");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function initNav() {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    nav.classList.toggle("is-active", isOpen);
    header.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.86
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function initAnimations() {
  gsap.utils.toArray("[data-reveal]").forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 34, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.82,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  gsap.fromTo(
    ".hero-bg",
    { scale: 1.08 },
    {
      scale: 1,
      duration: 1.6,
      ease: "power2.out"
    }
  );

  setInterval(() => {
    hero?.classList.add("is-glitching");
    window.setTimeout(() => hero?.classList.remove("is-glitching"), 430);
  }, 4200);

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      progress.style.transform = `scaleX(${self.progress})`;
    }
  });
}

function initPointerFX() {
  window.addEventListener(
    "pointermove",
    (event) => {
      const x = event.clientX;
      const y = event.clientY;

      cursor.style.opacity = "1";
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;

      if (hero && heroBg) {
        const rect = hero.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) {
          const depth = Number(heroBg.dataset.depth || 0.05);
          const dx = (x / window.innerWidth - 0.5) * depth * 100;
          const dy = (y / window.innerHeight - 0.5) * depth * 100;
          heroBg.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.03)`;
        }
      }
    },
    { passive: true }
  );

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * 0.16, y: y * 0.22, duration: 0.28, ease: "power2.out" });
    });

    element.addEventListener("pointerleave", () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.38, ease: "elastic.out(1, 0.4)" });
    });
  });
}

function initTilt() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll("[data-tilt]").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * 7;
      const rotateY = (px - 0.5) * 9;

      element.style.setProperty("--mx", `${px * 100}%`);
      element.style.setProperty("--my", `${py * 100}%`);
      gsap.to(element, {
        rotateX,
        rotateY,
        y: -4,
        duration: 0.28,
        ease: "power2.out",
        transformPerspective: 900
      });
    });

    element.addEventListener("pointerleave", () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.42,
        ease: "elastic.out(1, 0.45)"
      });
    });
  });
}

function initNoise() {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let frame = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function render() {
    frame += 1;

    if (frame % 3 === 0) {
      const image = context.createImageData(canvas.width, canvas.height);
      const data = image.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 18;
      }

      context.putImageData(image, 0, 0);
    }

    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  render();
}

function initLightbox() {
  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = image?.alt || "";
      lightbox.classList.add("is-active");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    });
  });

  function close() {
    lightbox.classList.remove("is-active");
    lightbox.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

initNav();
initSmoothScroll();
initAnimations();
initPointerFX();
initTilt();
initNoise();
initLightbox();
