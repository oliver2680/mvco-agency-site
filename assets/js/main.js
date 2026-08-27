// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const heroSection = document.querySelector(".mvco-hero");
  const heroInner = document.querySelector(".mvco-hero-inner");
  const heroPanel = document.querySelector(".mvco-hero-panel");
  const heroCopy = document.querySelector(".mvco-hero-copy");
  const heroLogo = document.querySelector(".mvco-hero-logo");
  const heroTitle = document.querySelector(".mvco-hero-title");
  const heroVideo = document.querySelector(".mvco-hero-video");
  const desktopHeroQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 901px)")
      : null;
  const mobileHeroQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 640px)")
      : null;
  const servicesSection = document.getElementById("services");
  const syncHeroTitleCopy = () => {
    if (!heroTitle || !mobileHeroQuery) {
      return;
    }
    const mobileText = heroTitle.dataset.mobileText;
    if (!mobileText) {
      return;
    }
    if (!heroTitle.dataset.desktopHtml) {
      heroTitle.dataset.desktopHtml = heroTitle.innerHTML.trim();
    }
    if (mobileHeroQuery.matches) {
      heroTitle.textContent = mobileText;
    } else {
      heroTitle.innerHTML = heroTitle.dataset.desktopHtml;
    }
  };

  if (heroVideo) {
    heroVideo.playbackRate = 0.75;
  }

  const lockScroll = () => {
    document.documentElement.classList.add("hero-lock");
    document.body.classList.add("hero-lock");
  };

  const unlockScroll = () => {
    document.documentElement.classList.remove("hero-lock");
    document.body.classList.remove("hero-lock");
  };

  const setHeroPanelScale = () => {
    if (!heroSection || !heroInner || !heroPanel) {
      return;
    }
    const innerWidth = heroInner.getBoundingClientRect().width;
    const panelWidth = heroPanel.getBoundingClientRect().width;
    if (!innerWidth || !panelWidth) {
      return;
    }
    const scaleX = innerWidth / panelWidth;
    heroSection.style.setProperty("--hero-panel-scale-x", scaleX.toFixed(4));
  };

  let heroParallaxRaf = null;
  let heroIntroComplete = false;
  const updateHeroCopyParallax = () => {
    if (!heroCopy || !heroSection || !desktopHeroQuery?.matches) {
      heroParallaxRaf = null;
      return;
    }
    const heroHeight = heroSection.offsetHeight || window.innerHeight;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const progress = Math.max(0, Math.min(1, scrollTop / heroHeight));
    const translateY = -progress * heroHeight * 0.3;
    heroCopy.style.transform = `translateY(${translateY.toFixed(2)}px)`;
    if (heroLogo) {
      heroLogo.style.transform = `translateY(${Math.abs(translateY).toFixed(2)}px)`;
    }
    heroParallaxRaf = null;
  };

  const handleHeroScroll = () => {
    if (heroParallaxRaf !== null) {
      return;
    }
    heroParallaxRaf = requestAnimationFrame(updateHeroCopyParallax);
  };

  const startHeroIntro = () => {
    if (
      heroIntroComplete ||
      !heroSection ||
      !heroInner ||
      !heroPanel ||
      !desktopHeroQuery?.matches
    ) {
      return;
    }
    setHeroPanelScale();
    heroSection.classList.add("hero-animating");
    lockScroll();

    let pending = 0;
    let introResolved = false;
    const completeIntro = () => {
      if (introResolved) {
        return;
      }
      introResolved = true;
      heroSection.classList.remove("hero-animating");
      unlockScroll();
      heroIntroComplete = true;
      handleHeroScroll();
      window.addEventListener("scroll", handleHeroScroll, { passive: true });
      window.addEventListener("resize", handleHeroScroll);
    };

    const trackAnimationEnd = (element, name) => {
      if (!element) {
        return;
      }
      pending += 1;
      const handler = (event) => {
        if (event.animationName !== name) {
          return;
        }
        element.removeEventListener("animationend", handler);
        pending -= 1;
        if (pending <= 0) {
          completeIntro();
        }
      };
      element.addEventListener("animationend", handler);
    };

    trackAnimationEnd(heroPanel, "mvco-hero-panel-intro");
    trackAnimationEnd(heroCopy, "mvco-hero-copy-intro");
    trackAnimationEnd(heroLogo, "mvco-hero-logo-rise");

    if (pending === 0) {
      completeIntro();
      return;
    }

    window.setTimeout(completeIntro, 4500);
  };

  if (heroTitle && mobileHeroQuery) {
    syncHeroTitleCopy();
    if (typeof mobileHeroQuery.addEventListener === "function") {
      mobileHeroQuery.addEventListener("change", syncHeroTitleCopy);
    } else if (typeof mobileHeroQuery.addListener === "function") {
      mobileHeroQuery.addListener(syncHeroTitleCopy);
    }
  }

  if (desktopHeroQuery?.matches) {
    requestAnimationFrame(startHeroIntro);
  }

  if (desktopHeroQuery) {
    desktopHeroQuery.addEventListener("change", (event) => {
      if (!event.matches) {
        unlockScroll();
        if (heroCopy) {
          heroCopy.style.transform = "";
        }
        return;
      }
      requestAnimationFrame(startHeroIntro);
    });
  }

  window.addEventListener("resize", setHeroPanelScale);

  const marqueeTrack = document.querySelector(".client-marquee__track");
  if (marqueeTrack) {
    const logos = [
      { file: "1.svg", alt: "Watches of Switzerland", index: 0 },
      { file: "2.svg", alt: "Toast", index: 1 },
      { file: "3.svg", alt: "Elizabeth Gage", index: 2 },
      // Finlay lives on at 4.svg if it ever needs to come back:
      // { file: "4.svg", alt: "Finlay", index: 3 },
      { file: "pjm.svg", alt: "PJM", index: 3 },
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

    const removeLastLogo = () => {
      const last = marqueeTrack.lastElementChild;
      if (!last) return;
      marqueeTrack.removeChild(last);
      nextLogoIndex = (nextLogoIndex - 1 + logos.length) % logos.length;
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

    const AUTO_VELOCITY = -30; // pixels per second, always drifting left
    const SETTLE_RATE = 2.5; // how quickly a fling eases back to the drift
    const DRAG_THRESHOLD = 4; // pixels before a press counts as a drag

    const marqueeViewport = marqueeTrack.parentElement;
    let offset = 0;
    let velocity = AUTO_VELOCITY;
    let lastTime = null;

    let isDragging = false;
    let pointerId = null;
    let dragStartX = 0;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let hasMoved = false;

    // Recycle logos at either edge so the track is endless in both directions.
    const recycleLogos = () => {
      let firstLogo = marqueeTrack.firstElementChild;
      while (firstLogo) {
        const logoWidth = firstLogo.getBoundingClientRect().width;
        if (!logoWidth || -offset < logoWidth) break;
        offset += logoWidth;
        marqueeTrack.removeChild(firstLogo);
        appendNextLogo();
        firstLogo = marqueeTrack.firstElementChild;
      }

      while (offset > 0 && marqueeTrack.lastElementChild) {
        removeLastLogo();
        prependPrevLogo();
        const logoWidth =
          marqueeTrack.firstElementChild.getBoundingClientRect().width;
        if (!logoWidth) break;
        offset -= logoWidth;
      }
    };

    const stepMarquee = (timestamp) => {
      if (lastTime === null) lastTime = timestamp;
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (!isDragging) {
        // Ease whatever velocity a fling left behind back to the slow drift.
        velocity +=
          (AUTO_VELOCITY - velocity) * Math.min(1, delta * SETTLE_RATE);
        offset += velocity * delta;
      }

      recycleLogos();
      marqueeTrack.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(stepMarquee);
    };
    requestAnimationFrame(stepMarquee);

    const onPointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      pointerId = event.pointerId;
      dragStartX = event.clientX;
      lastPointerX = event.clientX;
      lastPointerTime = event.timeStamp;
      velocity = 0;
      marqueeViewport.classList.add("is-dragging");
    };

    const onPointerMove = (event) => {
      if (!isDragging || event.pointerId !== pointerId) return;
      const dx = event.clientX - lastPointerX;
      const dt = (event.timeStamp - lastPointerTime) / 1000;

      if (!hasMoved && Math.abs(event.clientX - dragStartX) > DRAG_THRESHOLD) {
        hasMoved = true;
        marqueeViewport.setPointerCapture(pointerId);
      }
      if (!hasMoved) return;

      offset += dx;
      if (dt > 0) {
        // Blend samples so a jittery last frame doesn't define the fling.
        velocity = velocity * 0.7 + (dx / dt) * 0.3;
      }
      lastPointerX = event.clientX;
      lastPointerTime = event.timeStamp;
    };

    const endDrag = (event) => {
      if (!isDragging || (event && event.pointerId !== pointerId)) return;
      isDragging = false;
      if (pointerId !== null && marqueeViewport.hasPointerCapture?.(pointerId)) {
        marqueeViewport.releasePointerCapture(pointerId);
      }
      pointerId = null;
      marqueeViewport.classList.remove("is-dragging");
    };

    marqueeViewport.addEventListener("pointerdown", onPointerDown);
    marqueeViewport.addEventListener("pointermove", onPointerMove);
    marqueeViewport.addEventListener("pointerup", endDrag);
    marqueeViewport.addEventListener("pointercancel", endDrag);
    // Fallback for a press that leaves the marquee before capture kicks in.
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    marqueeViewport.addEventListener("dragstart", (event) =>
      event.preventDefault()
    );
  }

  const scrollHeader = document.getElementById("scrollHeader");
  const updateScrollHeaderOffset = () => {
    if (!scrollHeader) {
      return;
    }
    const headerHeight = scrollHeader.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty(
      "--scroll-header-offset",
      `${headerHeight}px`
    );
  };

  if (scrollHeader) {
    updateScrollHeaderOffset();
    window.addEventListener("resize", updateScrollHeaderOffset);
  }

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
      const darkRatio = progressThroughSection(servicesSection);

      if (darkRatio > 0) {
        applyTheme(servicesTheme, servicesTheme, darkRatio);
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

// Cookie consent banner — drives Google Consent Mode v2
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookieBanner");
  if (!banner) {
    return;
  }

  const STORAGE_KEY = "mvco-consent";

  const readChoice = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  };

  const saveChoice = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (e) {}
  };

  const hideBanner = () => {
    banner.classList.remove("is-visible");
    window.setTimeout(() => {
      banner.hidden = true;
    }, 350);
  };

  // Already answered — leave the banner out of the way.
  if (readChoice()) {
    return;
  }

  const showBanner = () => {
    if (!banner.hidden) {
      return;
    }
    banner.hidden = false;
    // Force a reflow so the transition runs from the off-screen start position.
    // (A requestAnimationFrame here would never fire in a background tab.)
    void banner.offsetHeight;
    banner.classList.add("is-visible");
  };

  // On mobile the banner sits over the hero title, so hold it back until the
  // visitor has scrolled away from the top. Desktop shows it straight away.
  const mobileBannerQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 640px)")
      : null;
  const MOBILE_REVEAL_OFFSET = 40;

  if (!mobileBannerQuery || !mobileBannerQuery.matches) {
    showBanner();
  } else if (window.scrollY > MOBILE_REVEAL_OFFSET) {
    // Restored scroll position — already past the hero.
    showBanner();
  } else {
    const onScroll = () => {
      if (window.scrollY <= MOBILE_REVEAL_OFFSET) {
        return;
      }
      window.removeEventListener("scroll", onScroll);
      showBanner();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Rotating or resizing up to desktop should not keep the banner waiting.
    const onBreakpointChange = (event) => {
      if (!event.matches) {
        window.removeEventListener("scroll", onScroll);
        showBanner();
      }
    };
    if (typeof mobileBannerQuery.addEventListener === "function") {
      mobileBannerQuery.addEventListener("change", onBreakpointChange);
    } else if (typeof mobileBannerQuery.addListener === "function") {
      mobileBannerQuery.addListener(onBreakpointChange);
    }
  }

  banner.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.consent;
      saveChoice(choice);

      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", { analytics_storage: choice });
      }

      hideBanner();
    });
  });
});

// Place for future JS (animations, tracking, etc.)
