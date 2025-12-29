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
  const heroTitle = document.querySelector(".mvco-hero-title");
  const servicesSection = document.getElementById("services");
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

  let heroTitleRaf = null;
  const updateHeroTitleScroll = () => {
    if (!heroTitle || !heroSection) {
      heroTitleRaf = null;
      return;
    }
    const heroHeight = heroSection.offsetHeight || window.innerHeight;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const progress = Math.max(0, Math.min(1.2, scrollTop / heroHeight));
    const translateY = -progress * heroHeight * 0.15;
    heroTitle.style.transform = `translateY(${translateY}px)`;
    heroTitleRaf = null;
  };

  const handleHeroTitleScroll = () => {
    if (heroTitleRaf !== null) return;
    heroTitleRaf = requestAnimationFrame(updateHeroTitleScroll);
  };
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
        if (heroTitle) {
          window.addEventListener("scroll", handleHeroTitleScroll, {
            passive: true,
          });
          window.addEventListener("resize", handleHeroTitleScroll);
          handleHeroTitleScroll();
        }
      },
      { once: true }
    );
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", resetGradient);
    window.addEventListener("blur", resetGradient);
  }

  const marqueeTrack = document.querySelector(".client-marquee__track");
  if (marqueeTrack) {
    const logos = [
      { file: "1.svg", alt: "Watches of Switzerland", index: 0 },
      { file: "2.svg", alt: "Toast", index: 1 },
      { file: "3.svg", alt: "Elizabeth Gage", index: 2 },
      { file: "4.svg", alt: "Finlay", index: 3 },
      { file: "5.svg", alt: "Drakes", index: 4 },
      { file: "6.svg", alt: "Dundas", index: 5 },
    ];
    const sourcePath =
      marqueeTrack.dataset.logoSource || "assets/img/clients/";
    let nextLogoIndex = 0;

    const createLogoItem = (meta) => {
      const item = document.createElement("div");
      item.className = "logo-item logo-visible";
      item.dataset.logoIndex = String(meta.index);
      const img = document.createElement("img");
      img.src = `${sourcePath}${meta.file}`;
      img.alt = meta.alt;
      img.loading = "lazy";
      item.appendChild(img);
      return item;
    };

    const appendNextLogo = () => {
      const meta = logos[nextLogoIndex];
      marqueeTrack.appendChild(createLogoItem(meta));
      nextLogoIndex = (nextLogoIndex + 1) % logos.length;
    };

    const prependPrevLogo = () => {
      const first = marqueeTrack.firstElementChild;
      const firstIndex = first
        ? parseInt(first.dataset.logoIndex || "0", 10)
        : nextLogoIndex;
      const prevIndex = (firstIndex - 1 + logos.length) % logos.length;
      marqueeTrack.insertBefore(
        createLogoItem(logos[prevIndex]),
        marqueeTrack.firstElementChild
      );
    };

    const initTrack = () => {
      marqueeTrack.innerHTML = "";
      nextLogoIndex = 0;
      const setsToRender = 3;
      for (let i = 0; i < logos.length * setsToRender; i += 1) {
        appendNextLogo();
      }
    };
    initTrack();

    const BASE_SPEED = 50; // pixels per second
    const MIN_SPEED = 30;
    const MAX_SPEED = 80;
    const CHANGE_PER_SCROLL = 20;
    const SMOOTHING = 0.5;

    let currentSpeed = BASE_SPEED;
    let targetSpeed = BASE_SPEED;
    let offset = 0;
    let lastTime = null;
    let direction = -1; // -1 = left to right visually (track moves left)

    const stepMarquee = (timestamp) => {
      if (lastTime === null) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      currentSpeed += (targetSpeed - currentSpeed) * SMOOTHING;
      offset += direction * currentSpeed * delta;

      let firstLogo = marqueeTrack.firstElementChild;
      if (direction === -1) {
        while (firstLogo) {
          const logoWidth = firstLogo.getBoundingClientRect().width;
          if (!logoWidth) break;
          if (-offset >= logoWidth) {
            offset += logoWidth;
            marqueeTrack.removeChild(firstLogo);
            appendNextLogo();
            firstLogo = marqueeTrack.firstElementChild;
          } else {
            break;
          }
        }
      } else {
        while (offset >= 0) {
          const lastLogo = marqueeTrack.lastElementChild;
          if (!lastLogo) break;
          const logoWidth = lastLogo.getBoundingClientRect().width;
          if (!logoWidth) break;
          offset -= logoWidth;
          marqueeTrack.removeChild(lastLogo);
          prependPrevLogo();
        }
      }

      marqueeTrack.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(stepMarquee);
    };
    requestAnimationFrame(stepMarquee);

    const handleWheel = (event) => {
      const delta = event.deltaY || event.wheelDelta || event.detail || 0;
      if (delta > 0) {
        direction = -1;
        targetSpeed = Math.min(MAX_SPEED, targetSpeed + CHANGE_PER_SCROLL);
      } else if (delta < 0) {
        direction = 1;
        targetSpeed = Math.max(MIN_SPEED, targetSpeed - CHANGE_PER_SCROLL);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
  }

  const scrollHeader = document.getElementById("scrollHeader");
  if (scrollHeader && heroSection) {
    const handleHeaderToggle = (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        scrollHeader.classList.remove("is-visible");
      } else {
        scrollHeader.classList.add("is-visible");
      }
    };

    const headerObserver = new IntersectionObserver(handleHeaderToggle, {
      threshold: 0.9,
    });
    headerObserver.observe(heroSection);
  }

  const problemSection = document.getElementById("problem-framing");

  if (scrollHeader && (servicesSection || problemSection)) {
    const lerp = (start, end, amount) => start + (end - start) * amount;
    const mixColor = (from, to, amount) => ({
      r: lerp(from.r, to.r, amount),
      g: lerp(from.g, to.g, amount),
      b: lerp(from.b, to.b, amount),
      a: lerp(
        from.a === undefined ? 1 : from.a,
        to.a === undefined ? 1 : to.a,
        amount
      ),
    });
    const formatColor = ({ r, g, b, a = 1 }) =>
      `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(
        3
      )})`;

    const defaultTheme = {
      bg: { r: 247, g: 244, b: 240, a: 0.92 },
      text: { r: 34, g: 53, b: 21 },
      border: { r: 21, g: 17, b: 15, a: 0.08 },
      buttonBorder: { r: 21, g: 17, b: 15 },
      hoverBg: { r: 34, g: 53, b: 21, a: 1 },
      hoverText: { r: 253, g: 250, b: 246 },
    };

    const problemTheme = {
      text: { r: 31, g: 45, b: 57 },
      buttonBorder: { r: 31, g: 45, b: 57 },
      hoverBg: { r: 31, g: 45, b: 57, a: 1 },
      hoverText: { r: 247, g: 244, b: 240 },
    };

    const servicesTheme = {
      bg: { r: 20, g: 39, b: 31, a: 0.98 },
      text: { r: 253, g: 250, b: 246 },
      border: { r: 255, g: 255, b: 255, a: 0.18 },
      buttonBorder: { r: 253, g: 250, b: 246 },
      hoverBg: { r: 253, g: 250, b: 246, a: 1 },
      hoverText: { r: 20, g: 39, b: 31 },
    };

    const headerHeight = () =>
      scrollHeader.getBoundingClientRect().height || 1;

    const progressThroughSection = (section) => {
      if (!section) return 0;
      const headerRect = scrollHeader.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const overlap =
        Math.min(headerRect.bottom, sectionRect.bottom) -
        Math.max(headerRect.top, sectionRect.top);
      return Math.max(0, Math.min(1, overlap / headerHeight()));
    };

    const applyTheme = (baseTheme, overrideTheme, mixAmount = 1) => {
      const bg = baseTheme.bg
        ? mixColor(defaultTheme.bg, baseTheme.bg, mixAmount)
        : defaultTheme.bg;
      const text = mixColor(
        defaultTheme.text,
        overrideTheme?.text || baseTheme?.text || defaultTheme.text,
        mixAmount
      );
      const border = mixColor(
        defaultTheme.border,
        baseTheme.border || defaultTheme.border,
        mixAmount
      );
      const buttonBorder = mixColor(
        defaultTheme.buttonBorder,
        overrideTheme?.buttonBorder ||
          baseTheme.buttonBorder ||
          defaultTheme.buttonBorder,
        mixAmount
      );
      const hoverBg = mixColor(
        defaultTheme.hoverBg,
        overrideTheme?.hoverBg || baseTheme.hoverBg || defaultTheme.hoverBg,
        mixAmount
      );
      const hoverText = mixColor(
        defaultTheme.hoverText,
        overrideTheme?.hoverText ||
          baseTheme.hoverText ||
          defaultTheme.hoverText,
        mixAmount
      );

      scrollHeader.style.setProperty("--scroll-header-bg", formatColor(bg));
      scrollHeader.style.setProperty(
        "--scroll-header-border",
        formatColor(border)
      );
      scrollHeader.style.setProperty(
        "--scroll-header-text",
        formatColor({ ...text, a: 1 })
      );
      scrollHeader.style.setProperty(
        "--scroll-header-button-border",
        formatColor({ ...buttonBorder, a: 1 })
      );
      scrollHeader.style.setProperty(
        "--scroll-header-button-text",
        formatColor({ ...text, a: 1 })
      );
      scrollHeader.style.setProperty(
        "--scroll-header-button-hover-bg",
        formatColor(hoverBg)
      );
      scrollHeader.style.setProperty(
        "--scroll-header-button-hover-text",
        formatColor({ ...hoverText, a: 1 })
      );
    };

    const updateHeaderTheme = () => {
      const problemRatio = progressThroughSection(problemSection);
      const servicesRatio = progressThroughSection(servicesSection);

      if (servicesRatio > 0) {
        applyTheme(servicesTheme, servicesTheme, servicesRatio);
      } else if (problemRatio > 0) {
        applyTheme({ bg: defaultTheme.bg, border: defaultTheme.border }, problemTheme, problemRatio);
      } else {
        applyTheme(defaultTheme, defaultTheme, 0);
      }
    };

    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("resize", updateHeaderTheme);
    updateHeaderTheme();
  }
});

// Place for future JS (animations, tracking, etc.)
