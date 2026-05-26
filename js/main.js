const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const videoCards = document.querySelectorAll(".video-card");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeNav() {
  body.classList.remove("nav-open");
  nav.classList.remove("is-active");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  nav.classList.toggle("is-active", isOpen);
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

videoCards.forEach((card) => {
  const button = card.querySelector("button");

  button.addEventListener("click", () => {
    const videoId = card.dataset.video;
    const iframe = document.createElement("iframe");

    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = card.querySelector("h3").textContent;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    card.innerHTML = "";
    card.appendChild(iframe);
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
