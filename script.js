const loader = document.querySelector("#loader");
const enterScreen = document.querySelector("#enter-screen");
const bgCycle = document.querySelector(".bg-cycle");
const bgFrames = window.BG_FRAMES ?? ["a.png", "b.png", "c.png", "d.png"];
let lastBgIndex = 0;
let bgReady = false;
let bgPreloaded = false;
const isHomePage = document.body.classList.contains("home-page");
let experienceStarted = !document.body.classList.contains("awaiting-entry");
let pageLoaded = document.readyState === "complete";
let revealScheduled = false;

const preloadBackgrounds = () => {
  if (isHomePage) {
    bgPreloaded = true;
    return;
  }

  let loaded = 0;
  bgFrames.forEach((src) => {
    const img = new Image();
    img.onload = () => {
      loaded += 1;
      if (loaded === bgFrames.length) {
        bgPreloaded = true;
        updateBackground();
      }
    };
    img.src = src;
  });
};

const updateBackground = () => {
  if (!bgCycle) return;
  if (!bgReady || !bgPreloaded) return;

  const baseLayers = `radial-gradient(circle at 50% 16%, rgba(227, 188, 112, 0.2), transparent 24%),
    radial-gradient(circle at 20% 24%, rgba(118, 57, 35, 0.28), transparent 28%),
    radial-gradient(circle at 80% 20%, rgba(118, 57, 35, 0.18), transparent 30%),
    linear-gradient(rgba(20, 11, 8, 0.54), rgba(10, 5, 4, 0.82))`;

  bgCycle.style.backgroundImage = `${baseLayers}, url("${bgFrames[lastBgIndex]}")`;
  bgCycle.style.backgroundBlendMode = "screen, multiply, multiply, normal, normal";
};

const revealExperience = () => {
  window.setTimeout(() => {
    if (loader) loader.classList.add("hidden");
    document.body.classList.add("is-ready");
    bgReady = true;
    updateBackground();
    if (window.gsap) {
      gsap.from(".mega-letters span", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08,
      });
    }
  }, 2000);
};

const maybeStartExperience = () => {
  if (!pageLoaded || !experienceStarted || revealScheduled) return;
  revealScheduled = true;
  revealExperience();
};

window.beginHomeExperience = () => {
  if (experienceStarted) return;

  experienceStarted = true;
  document.body.classList.remove("awaiting-entry");

  if (enterScreen) {
    enterScreen.classList.add("hidden");
    enterScreen.setAttribute("aria-hidden", "true");
  }

  maybeStartExperience();
};

const handleWindowLoad = () => {
  pageLoaded = true;
  maybeStartExperience();
};

if (pageLoaded) {
  maybeStartExperience();
} else {
  window.addEventListener("load", handleWindowLoad);
}

const detailSection = document.querySelector(".detail");
const projectToggles = document.querySelectorAll(".project-toggle");
const detailObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
);

if (detailSection) {
  detailObserver.observe(detailSection);
}

projectToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("aria-controls");
    const dropdown = targetId ? document.getElementById(targetId) : null;
    if (!dropdown) return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    dropdown.hidden = isOpen;
  });
});

const stepBackground = (direction) => {
  const nextIndex =
    (lastBgIndex + direction + bgFrames.length) % bgFrames.length;
  if (nextIndex !== lastBgIndex) {
    lastBgIndex = nextIndex;
    updateBackground();
  }
};

window.addEventListener(
  "wheel",
  (event) => {
    if (!bgReady || !bgPreloaded) return;
    if (isHomePage) return;
    const delta = event.deltaY;
    if (delta === 0) return;
    stepBackground(delta > 0 ? 1 : -1);
  },
  { passive: true }
);
window.addEventListener("resize", updateBackground);
preloadBackgrounds();

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
    });
  });

  if (!document.body.classList.contains("info-page")) {
    gsap.from(".detail", {
      opacity: 0,
      y: 80,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".detail",
        start: "top 78%",
      },
    });

    gsap.from(".projects .section-head", {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".projects",
        start: "top 80%",
      },
    });

    gsap.from(".project-card", {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: "power3.out",
      stagger: 0.16,
      scrollTrigger: {
        trigger: ".projects",
        start: "top 72%",
      },
    });

    if (isHomePage) {
      gsap.to(".hero-copy", {
        y: -180,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".hero-center-mark", {
        y: -90,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".detail", {
        y: -110,
        ease: "none",
        scrollTrigger: {
          trigger: ".detail",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".projects .section-head", {
        y: -85,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".projects-grid", {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }
  }
}
