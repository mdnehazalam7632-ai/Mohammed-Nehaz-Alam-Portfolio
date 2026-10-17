
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const progressBar = document.getElementById("scrollProgress");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const recipient = "mdnehazalam7632@gmail.com";

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // DARK / LIGHT THEME
  function setTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-theme", isLight);
    document.documentElement.classList.toggle("light-start", isLight);

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isLight ? "#f5f3f0" : "#0b0b0f";

    try {
      localStorage.setItem("nehaz-theme", theme);
    } catch (error) {}
  }

  let initialTheme = document.documentElement.classList.contains("light-start")
    ? "light"
    : "dark";

  try {
    initialTheme = localStorage.getItem("nehaz-theme") || initialTheme;
  } catch (error) {}

  setTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    setTheme(body.classList.contains("light-theme") ? "dark" : "light");
  });

  // Show a logo fallback if its photo cannot load
  document.querySelectorAll(".brand-mark img").forEach((img) => {
    const fallback = img.parentElement.querySelector(".brand-fallback");

    function showFallback() {
      img.style.display = "none";
      if (fallback) fallback.style.display = "grid";
    }

    img.addEventListener("error", showFallback);

    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    }
  });

  // HERO IMAGE FALLBACK: nehaz.png
  document.querySelectorAll(".hero-portrait").forEach((img) => {
    const fallback = img.parentElement.querySelector(".portrait-fallback");

    function showFallback() {
      img.style.display = "none";
      if (fallback) fallback.style.display = "grid";
    }

    img.addEventListener("error", showFallback);

    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    }
  });

  // ABOUT IMAGE FALLBACK: nehaz alam.png
  document.querySelectorAll(".about-stamp > img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      img.closest(".about-stamp")?.classList.add("stamp-no-photo");
    });
  });

  // MOBILE MENU
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navItems.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // SCROLL PROGRESS
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // REVEAL ANIMATIONS
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // ACTIVE NAVIGATION SECTION
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // GALLERY FILTERS
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      workCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  // BROKEN GALLERY IMAGES
  document.querySelectorAll(".work-image img").forEach((img) => {
    function handleError() {
      img.style.display = "none";
      img.closest(".work-image")?.classList.add("image-failed");
    }

    img.addEventListener("error", handleError);

    if (img.complete && img.naturalWidth === 0) {
      handleError();
    }
  });

  // CONTACT FORM -> GMAIL DRAFT
  // The visitor reviews the message and presses Send in Gmail.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = `Portfolio enquiry: ${project}`;

    const emailBody = [
      "Hello Mohammed Nehaz Alam,",
      "",
      "I would like to discuss a project with you.",
      "",
      `Name: ${name}`,
      `My email: ${email}`,
      `Service: ${project}`,
      "",
      "Project details:",
      message,
      "",
      "Sent from your portfolio website."
    ].join("\n");

    const gmailURL = new URL("https://mail.google.com/mail/");
    gmailURL.searchParams.set("view", "cm");
    gmailURL.searchParams.set("fs", "1");
    gmailURL.searchParams.set("to", recipient);
    gmailURL.searchParams.set("su", subject);
    gmailURL.searchParams.set("body", emailBody);

    const gmailWindow = window.open(gmailURL.toString(), "_blank");

    if (gmailWindow) {
      formStatus.textContent =
        "Gmail opened. Review the prepared message and press Send.";
    } else {
      formStatus.textContent =
        "Your browser blocked the pop-up. Use the link below to open Gmail.";

      const link = document.createElement("a");
      link.href = gmailURL.toString();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = " Open Gmail draft ↗";
      formStatus.appendChild(link);
    }
  });
});
