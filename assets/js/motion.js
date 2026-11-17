/* Motion design : apparitions au défilement, cartes animées après un filtre.
   Désactivé si l'utilisateur réduit les animations. */
(function () {
  "use strict";
  var root = document.documentElement;
  var navbar = document.querySelector(".gnav");

  /* En-tête compact dès qu'on défile (toujours actif, sans animation forcée) */
  function headerState() { if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", headerState, { passive: true });
  headerState();

  if (!root.classList.contains("motion")) return;

  /* ---------- Apparitions ---------- */
  var TARGETS = [
    ".page-head .wrap > *", ".pro-hero-in > div:first-child > *", ".pro-perks > div",
    ".section-title", ".section-head", ".tile", ".pc-card", ".part-card", ".why-card", ".hl-card",
    ".uni-card", ".split-media", ".split > div:not(.split-media) > *", ".promo > *", ".arrival",
    ".shop-card", ".uni-section", ".fps-row", ".table-wrap", ".filters", ".forge-start", ".cat-banner",
    ".cart-line", ".checkout", ".summary", ".passport", ".panel", ".credit", ".product > *"
  ].join(",");
  var STEP = 70, MAX_STAGGER = 6;

  function delayFor(el, list) {
    var sibs = list.filter(function (x) { return x.parentNode === el.parentNode; });
    return Math.min(sibs.indexOf(el), MAX_STAGGER) * STEP;
  }
  function settle(el, cls) {
    el.classList.remove(cls, "in");
    el.style.removeProperty("--d");
  }
  function rise(el, d) {
    el.style.setProperty("--d", d + "ms");
    el.classList.add("rise");
    el.addEventListener("animationend", function done(e) {
      if (e.target !== el) return;
      el.removeEventListener("animationend", done);
      settle(el, "rise");
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      el.classList.add("in");
      var d = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
      setTimeout(function () { settle(el, "reveal"); }, 900 + d);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  var all = Array.prototype.slice.call(document.querySelectorAll(TARGETS));
  var vh = window.innerHeight;
  all.forEach(function (el) {
    if (el.closest(".hero, .p-hero")) return;
    var r = el.getBoundingClientRect(), d = delayFor(el, all);
    if (r.top < vh * 0.92 && r.bottom > 0) rise(el, d);
    else { el.style.setProperty("--d", d + "ms"); el.classList.add("reveal"); io.observe(el); }
  });

  /* ---------- Cartes ajoutées après un filtre ou une recherche ---------- */
  ["#g-grid", "#c-grid", "#c-pcs", "#passport", "#tk-result"].forEach(function (sel) {
    var box = document.querySelector(sel);
    if (!box) return;
    new MutationObserver(function (muts) {
      var added = [];
      muts.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) added.push(n); }); });
      added.slice(0, 12).forEach(function (n, i) { rise(n, Math.min(i, MAX_STAGGER) * 50); });
    }).observe(box, { childList: true });
  });

})();
