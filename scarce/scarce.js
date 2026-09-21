(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById("joinForm");
  var status = document.getElementById("formStatus");
  if (!form) return;

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = "form-status" + (cls ? " " + cls : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var required = form.querySelectorAll("[required]");
    var ok = true;
    required.forEach(function (el) {
      var valid = el.checkValidity();
      el.setAttribute("aria-invalid", valid ? "false" : "true");
      if (!valid) ok = false;
    });
    if (!ok) { setStatus("Please complete the highlighted fields.", "err"); return; }

    var data = new FormData(form);
    if (data.get("_gotcha")) return; // honeypot
    var endpoint = form.getAttribute("data-endpoint");

    // No endpoint configured yet: fall back to a pre-filled email.
    if (!endpoint) {
      var body =
        "Name: " + data.get("name") + "\n" +
        "Role: " + data.get("role") + "\n" +
        "Company: " + data.get("company") + "\n" +
        "Email: " + data.get("email") + "\n" +
        "LinkedIn: " + (data.get("linkedin") || "-") + "\n\n" +
        (data.get("message") || "");
      window.location.href =
        "mailto:info@mvco.agency?subject=" + encodeURIComponent("Scarce podcast — " + data.get("name")) +
        "&body=" + encodeURIComponent(body);
      setStatus("Opening your email client…", "ok");
      return;
    }

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    setStatus("Sending…");
    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        form.reset();
        setStatus("Thank you — we’ll be in touch within two working days.", "ok");
      })
      .catch(function () {
        setStatus("Something went wrong. Please email info@mvco.agency instead.", "err");
      })
      .finally(function () { btn.disabled = false; });
  });
})();
