// Scarce — episode pages: timestamp buttons seek the embedded YouTube player,
// and the transcript nav highlights the chapter being read.
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var frame = document.getElementById("player");
  var player = null;

  if (frame) {
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("player");
    };
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }

  function seek(t) {
    if (player && typeof player.seekTo === "function") {
      player.seekTo(t, true);
      player.playVideo();
    } else if (frame) {
      // API not ready (or blocked): reload the embed at the right moment.
      var src = frame.src.replace(/([?&])(start|autoplay)=\d+/g, "$1").replace(/[?&]+$/, "");
      frame.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "start=" + t + "&autoplay=1";
    }
    var r = frame.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      frame.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-t]");
    if (!btn) return;
    e.preventDefault();
    seek(parseInt(btn.getAttribute("data-t"), 10));
  });

  // Transcript nav: mark the chapter currently in view.
  var links = document.querySelectorAll(".tx-nav a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("is-active"); });
      var a = byId[en.target.id];
      if (a) a.classList.add("is-active");
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll(".tx-chapter").forEach(function (sec) { io.observe(sec); });
})();
