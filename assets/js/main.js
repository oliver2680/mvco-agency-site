// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const pageRoot = document.documentElement;
  pageRoot.style.overflow = "hidden";
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  setTimeout(() => window.scrollTo(0, 0), 0);

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const heroSection = document.querySelector(".mvco-hero");
  const heroStage = document.querySelector(".mvco-hero-stage");
  const baseWidth = heroSection?.dataset?.heroBaseWidth
    ? parseFloat(heroSection.dataset.heroBaseWidth)
    : 1200;
  const baseHeight = heroSection?.dataset?.heroBaseHeight
    ? parseFloat(heroSection.dataset.heroBaseHeight)
    : 760;

  const updateHeroScale = () => {
    if (!heroSection || !heroStage || !baseWidth || !baseHeight) return;
    const heightRatio = window.innerHeight / baseHeight;
    const scale = heightRatio;
    heroSection.style.setProperty("--hero-scale", scale);
  };

  if (heroSection && heroStage) {
    updateHeroScale();
    window.addEventListener("resize", updateHeroScale);
  }

  const heroPanel = document.querySelector(".mvco-hero-panel");
  const heroInner = document.querySelector(".mvco-hero-inner");
  const clientLogos = document.querySelectorAll("#clients .logo-item");
  if (heroPanel && heroInner) {
    heroPanel.addEventListener(
      "animationstart",
      () => {
        setTimeout(() => {
          heroInner.classList.add("hero-padding-active");
        }, 1800);
      },
      { once: true }
    );
  }

  if (heroPanel) {
    let rafId = null;
    const BASE_X = 16;
    const BASE_Y = 10;
    const RANGE_X = 22;
    const RANGE_Y = 16;
    let targetX = BASE_X;
    let targetY = BASE_Y;
    let interactionEnabled = false;

    const applyGradient = () => {
      heroPanel.style.setProperty("--panel-gradient-x", `${targetX}%`);
      heroPanel.style.setProperty("--panel-gradient-y", `${targetY}%`);
      rafId = null;
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const handlePointerMove = (event) => {
      if (!interactionEnabled) {
        return;
      }
      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;
      const xRatio = event.clientX / viewportWidth;
      const yRatio = event.clientY / viewportHeight;
      const desiredX = BASE_X + (xRatio - 0.5) * RANGE_X;
      const desiredY = BASE_Y + (yRatio - 0.5) * RANGE_Y;
      targetX = clamp(desiredX, BASE_X - RANGE_X / 2, BASE_X + RANGE_X / 2);
      targetY = clamp(desiredY, BASE_Y - RANGE_Y / 2, BASE_Y + RANGE_Y / 2);

      if (rafId === null) {
        rafId = requestAnimationFrame(applyGradient);
      }
    };

    const resetGradient = () => {
      targetX = BASE_X;
      targetY = BASE_Y;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyGradient);
      }
    };

    const enableInteraction = () => {
      interactionEnabled = true;
    };

    heroPanel.addEventListener(
      "animationend",
      () => {
        enableInteraction();
        pageRoot.style.overflow = "";
        clientLogos.forEach((logo) => logo.classList.add("logo-visible"));
      },
      { once: true }
    );
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", resetGradient);
    window.addEventListener("blur", resetGradient);
  }

});

// Place for future JS (animations, tracking, etc.)
