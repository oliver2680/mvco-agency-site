// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const heroPanel = document.querySelector(".mvco-hero-panel");
  if (heroPanel) {
    let rafId = null;
    let targetX = 10;
    let targetY = 10;
    let interactionEnabled = false;

    const applyGradient = () => {
      heroPanel.style.setProperty("--panel-gradient-x", `${targetX}%`);
      heroPanel.style.setProperty("--panel-gradient-y", `${targetY}%`);
      rafId = null;
    };

    const handlePointerMove = (event) => {
      if (!interactionEnabled) {
        return;
      }
      const rect = heroPanel.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      targetX = Math.min(100, Math.max(0, x));
      targetY = Math.min(100, Math.max(0, y));

      if (rafId === null) {
        rafId = requestAnimationFrame(applyGradient);
      }
    };

    const resetGradient = () => {
      targetX = 10;
      targetY = 10;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyGradient);
      }
    };

    const enableInteraction = () => {
      interactionEnabled = true;
    };

    heroPanel.addEventListener("animationend", enableInteraction, {
      once: true,
    });
    heroPanel.addEventListener("mousemove", handlePointerMove);
    heroPanel.addEventListener("mouseleave", resetGradient);
  }
});

// Place for future JS (animations, tracking, etc.)
