/* Ekinox Gamos — socle commun : en-tête, pied de page, mode Jour/Nuit, panier, utilitaires. */
(function () {
  "use strict";
  var D = window.EKG;
  var doc = document;

  /* ---------- Utilitaires ---------- */
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var nf = new Intl.NumberFormat("fr-FR");
  function fmtAr(n) { return nf.format(Math.round(n)).replace(/\s/g, " ") + " Ar"; }
  function fmtNum(n) { return nf.format(Math.round(n)).replace(/\s/g, " "); }
  var MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function fmtDate(iso) {
    var p = String(iso).split("-");
    return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function normalize(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  }
  function params() { return new URLSearchParams(location.search); }
  function store(key, val) {
    try {
      if (val === undefined) { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
    return val;
  }

  /* ---------- Chiffres animés ---------- */
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  function tween(el, from, to, fmt, dur) {
    if (!el) return;
    fmt = fmt || fmtAr;
    if (REDUCED || from == null || from === to || isNaN(from)) { el.textContent = fmt(to); return; }
    dur = dur || 520;
    var t0 = performance.now(), token = {};
    el._tw = token;
    (function step(t) {
      if (el._tw !== token) return;
      var p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(p < 1 ? Math.round((from + (to - from) * e) / 1000) * 1000 : to);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Icônes ---------- */
  var I = function (p, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + p + "</svg>"; };
  var icons = {
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    cart: I('<path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/>'),
    moon: I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    sun: I('<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    chevL: I('<path d="m15 18-6-6 6-6"/>'),
    chevR: I('<path d="m9 18 6-6-6-6"/>'),
    whatsapp: I('<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.7z"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.5 1 1.5 2 2.6 2.5.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.5-2.3.2-2.4-.8-4.4-2.8-5.2-5.1-.2-.8 0-1.5.3-1.9z"/>'),
    phone: I('<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    pin: I('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    shield: I('<path d="M12 3 4.5 6v6c0 4.4 3.2 7.9 7.5 9 4.3-1.1 7.5-4.6 7.5-9V6L12 3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
    wrench: I('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3.6 17.3a1.5 1.5 0 0 0 2.1 2.1l5.7-5.7a4 4 0 0 0 5.3-5.4l-2.4 2.4-2.1-.6-.6-2.1 2.4-2.4z"/>'),
    gauge: I('<path d="M4 15a8 8 0 1 1 16 0"/><path d="m12 15 4-5"/><circle cx="12" cy="15" r="1.3"/><path d="M4 19h16"/>'),
    camera: I('<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    truck: I('<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
    store: I('<path d="M3 9 4.5 4h15L21 9M4 9v11h16V9M3 9h18M9 20v-6h6v6"/>'),
    bolt: I('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    qr: I('<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>'),
    box: I('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
    check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
    gpu: I('<rect x="2.5" y="6" width="19" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="3"/><circle cx="16" cy="11.5" r="3"/><path d="M5 17v2M8 17v2M11 17v2"/>'),
    cpu: I('<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
    mb: I('<rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="6" y="6" width="5" height="5"/><path d="M14 6h4M14 9h4M6 15h12M6 18h8"/>'),
    ram: I('<rect x="2.5" y="7" width="19" height="9" rx="1"/><path d="M6 10v3M9.5 10v3M13 10v3M16.5 10v3M5 16v2M19 16v2"/>'),
    storage: I('<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 12h6M17 12h.5"/>'),
    psu: I('<rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="10" cy="12" r="4"/><path d="M17 9v6"/>'),
    "case": I('<rect x="6" y="2.5" width="12" height="19" rx="1.5"/><circle cx="12" cy="14" r="3"/><path d="M9 6h6"/>'),
    cooling: I('<circle cx="12" cy="12" r="9"/><path d="M12 12c0-4 1.5-6 4-6M12 12c4 0 6 1.5 6 4M12 12c0 4-1.5 6-4 6M12 12c-4 0-6-1.5-6-4"/>'),
    monitor: I('<rect x="2.5" y="4" width="19" height="13" rx="1.5"/><path d="M9 21h6M12 17v4"/>'),
    periph: I('<rect x="2" y="9" width="14" height="8" rx="1.5"/><path d="M5 12h.5M8 12h.5M11 12h.5M5.5 15h7"/><rect x="18" y="8" width="4" height="8" rx="2"/>'),
    ups: I('<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="m12.5 7-3 5h4l-3 5"/>'),
    pc: I('<rect x="5" y="2.5" width="14" height="19" rx="1.5"/><circle cx="12" cy="9" r="3"/><path d="M9 16h6M9 18.5h6"/>')
  };

  /* ---------- Catalogue ---------- */
  function getItem(id) {
    var i;
    for (i = 0; i < D.pcs.length; i++) if (D.pcs[i].id === id) return D.pcs[i];
    for (i = 0; i < D.parts.length; i++) if (D.parts[i].id === id) return D.parts[i];
    return null;
  }
  function isPc(item) { return !!(item && item.specs); }
  function catName(cat) { for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === cat) return D.categories[i].name; return ""; }
  function stockTotal(item) { return (item.stock.mahamasina || 0) + (item.stock.andravoahangy || 0); }
  function stockInfo(item) {
    var m = item.stock.mahamasina || 0, a = item.stock.andravoahangy || 0;
    if (m + a === 0) return item.arrival ? { cls: "wait", text: "Prochain arrivage · " + item.arrival } : { cls: "out", text: "Sur commande" };
    if (m && a) return { cls: "", text: "En stock · 2 boutiques" };
    return { cls: "", text: "En stock · " + (m ? "Mahamasina" : "Andravoahangy") };
  }
  function upsFor(item) { return getItem((item.watts || 0) > 450 ? "ups-2000" : "ups-1200"); }
  function fpsFor(pc, game) { return pc.fps && pc.fps[game] ? pc.fps[game] : 0; }
  function gameName(id) { for (var i = 0; i < D.games.length; i++) if (D.games[i].id === id) return D.games[i].name; return ""; }

  function photo(id, cls, opts) {
    opts = opts || {};
    var p = D.photos[id] || {};
    return '<div class="ph' + (cls ? " " + cls : "") + '"><img src="assets/img/photos/' + id + '.jpg" alt="' + esc(opts.alt != null ? opts.alt : (p.alt || "")) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></div>';
  }

  /* « ZÉNITH » -> « Zénith » ; nom affiché d'un produit */
  function nice(name) { return name.charAt(0) + name.slice(1).toLowerCase(); }
  function displayName(it) { return isPc(it) ? "Ekinox " + nice(it.name) : it.name; }

  function pcCard(pc, opts) {
    opts = opts || {};
    var st = stockInfo(pc), fps = "", url = "produit.html?id=" + pc.id;
    if (opts.game) {
      var v = fpsFor(pc, opts.game);
      fps = '<p class="pc-fps"><span>≈ ' + v + ' FPS</span><i style="--w:' + Math.min(100, Math.round(v / 4)) + '%"></i></p>';
    }
    return '<article class="pc-card">' +
      '<a class="pc-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + photo(pc.photo, "", { alt: "" }) + "</a>" +
      '<div class="pc-body">' +
      '<p class="pc-eyebrow">' + esc(pc.badge || "") + "</p>" +
      '<h3><a class="pc-name" href="' + url + '">' + esc(displayName(pc)) + "</a></h3>" +
      '<p class="pc-line">' + esc(pc.line) + "</p>" +
      '<ul class="pc-specs"><li>' + esc(pc.specs.gpu) + "</li><li>" + esc(pc.specs.cpu) + "</li><li>" + esc(pc.specs.ram + " · " + pc.specs.storage) + "</li></ul>" +
      fps +
      '<p class="pc-price">' + fmtAr(pc.price) + "</p>" +
      '<div class="pc-actions"><button class="btn btn-primary btn-sm" type="button" data-add="' + pc.id + '">' + (stockTotal(pc) ? "Acheter" : "Réserver") + "</button>" +
      '<a class="more" href="' + url + '">En savoir plus</a></div>' +
      '<span class="stock ' + st.cls + '">' + esc(st.text) + "</span>" +
      "</div></article>";
  }

  function partCard(part) {
    var st = stockInfo(part), url = "produit.html?id=" + part.id;
    var eyebrow = part.note || (!stockTotal(part) && part.arrival ? "Arrivage le " + part.arrival : "");
    return '<article class="part-card">' +
      '<a class="part-media" href="' + url + '" tabindex="-1" aria-hidden="true">' + (icons[part.cat] || icons.box) + "</a>" +
      '<p class="part-eyebrow">' + esc(eyebrow) + "</p>" +
      '<span class="part-cat">' + esc(catName(part.cat)) + "</span>" +
      '<a class="part-name" href="' + url + '">' + esc(part.name) + "</a>" +
      '<p class="part-spec">' + esc(part.spec) + "</p>" +
      '<p class="part-price">' + fmtAr(part.price) + "</p>" +
      '<div class="part-foot"><span class="stock ' + st.cls + '">' + esc(st.text) + "</span>" +
      '<button class="btn btn-sm" type="button" data-add="' + part.id + '" aria-label="Ajouter ' + esc(part.name) + ' au panier">Ajouter</button></div>' +
      "</article>";
  }

  /* ---------- Panier ---------- */
  var CART_KEY = "ekg-cart";
  var cart = {
    lines: function () { var l = store(CART_KEY); return Array.isArray(l) ? l : []; },
    save: function (lines) { store(CART_KEY, lines); updateCartCount(true); },
    add: function (id, qty, opt) {
      opt = opt || {};
      var lines = cart.lines();
      var ups = !!opt.ups;
      var found = null;
      for (var i = 0; i < lines.length; i++) if (lines[i].id === id && !!lines[i].ups === ups && !lines[i].custom) found = lines[i];
      if (found) found.qty = Math.min(20, found.qty + (qty || 1));
      else lines.push({ key: id + (ups ? "+ups" : "") + "-" + Date.now().toString(36), id: id, qty: qty || 1, ups: ups });
      cart.save(lines);
    },
    addCustom: function (custom) {
      var lines = cart.lines();
      lines.push({ key: "forge-" + Date.now().toString(36), id: "forge", qty: 1, custom: custom });
      cart.save(lines);
    },
    setQty: function (key, qty) {
      var lines = cart.lines().map(function (l) { if (l.key === key) l.qty = Math.max(1, Math.min(20, qty)); return l; });
      cart.save(lines);
    },
    remove: function (key) { cart.save(cart.lines().filter(function (l) { return l.key !== key; })); },
    clear: function () { cart.save([]); },
    count: function () { return cart.lines().reduce(function (s, l) { return s + l.qty; }, 0); },
    unit: function (l) {
      if (l.custom) return l.custom.price;
      var it = getItem(l.id); if (!it) return 0;
      return it.price + (l.ups ? upsFor(it).price : 0);
    },
    total: function () { return cart.lines().reduce(function (s, l) { return s + cart.unit(l) * l.qty; }, 0); }
  };
  function updateCartCount(bump) {
    var n = cart.count();
    $$("[data-cart-count]").forEach(function (el) { el.textContent = n ? n : ""; el.toggleAttribute("data-zero", !n); });
    if (bump) $$(".cart-btn").forEach(function (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); });
  }

  /* ---------- WhatsApp ---------- */
  function waLink(text) { return "https://wa.me/" + D.shop.whatsapp + "?text=" + encodeURIComponent(text); }

  /* ---------- Horaires (heure de Tana, UTC+3) ---------- */
  function tanaNow() { var n = new Date(); return new Date(n.getTime() + (n.getTimezoneOffset() + 180) * 60000); }
  function fmtHour(h) { var hh = Math.floor(h), mm = Math.round((h - hh) * 60); return hh + "h" + (mm ? String(mm).padStart(2, "0") : "00"); }
  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  function shopStatus() {
    var t = tanaNow(), d = t.getDay(), h = t.getHours() + t.getMinutes() / 60, slot = D.hours[d];
    if (slot && h >= slot[0] && h < slot[1]) return { open: true, text: "Ouvert · ferme à " + fmtHour(slot[1]) };
    if (slot && h < slot[0]) return { open: false, text: "Fermé · ouvre à " + fmtHour(slot[0]) };
    for (var k = 1; k <= 7; k++) {
      var nd = (d + k) % 7;
      if (D.hours[nd]) return { open: false, text: "Fermé · ouvre " + (k === 1 ? "demain" : DAYS[nd]) + " à " + fmtHour(D.hours[nd][0]) };
    }
    return { open: false, text: "Fermé" };
  }

  /* ---------- Mode Jour / Nuit ---------- */
  function getMode() { return doc.documentElement.getAttribute("data-mode") || "nuit"; }
  function setMode(m) {
    doc.documentElement.setAttribute("data-mode", m);
    try { localStorage.setItem("ekg-mode", m); } catch (e) {}
    renderModeBtn();
    doc.dispatchEvent(new CustomEvent("ekg:mode", { detail: m }));
  }
  function renderModeBtn() {
    var b = $("#mode-btn"); if (!b) return;
    var m = getMode();
    b.innerHTML = m === "nuit" ? icons.moon : icons.sun;
    var label = "Mode " + (m === "nuit" ? "Nuit (gaming)" : "Jour (pro)") + " actif. Passer en mode " + (m === "nuit" ? "Jour" : "Nuit");
    b.setAttribute("aria-label", label);
    b.setAttribute("title", label);
  }

  /* ---------- Toasts ---------- */
  function toast(msg, link) {
    var box = $(".toasts");
    if (!box) { box = doc.createElement("div"); box.className = "toasts"; box.setAttribute("role", "status"); box.setAttribute("aria-live", "polite"); doc.body.appendChild(box); }
    var t = doc.createElement("div");
    t.className = "toast";
    t.innerHTML = "<span>" + esc(msg) + "</span>" + (link ? '<a href="' + link.href + '">' + esc(link.text) + "</a>" : "");
    box.appendChild(t);
    setTimeout(function () { t.remove(); }, 3800);
  }

  /* ---------- En-tête & pied de page ---------- */
  var NAV = [
    ["gamme.html", "PC Gamer"], ["configurateur.html", "Forge"], ["catalogue.html", "Composants"],
    ["pro.html", "Ekinox Pro"], ["garantie.html", "Garantie"], ["boutiques.html", "Boutiques"]
  ];
  function renderHeader() {
    var el = $("#site-header"); if (!el) return;
    var current = doc.body.getAttribute("data-nav") || "";
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (current === n[0] ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("");
    var q = esc(params().get("q") || "");
    el.innerHTML =
      '<nav class="gnav" aria-label="Navigation principale"><div class="gnav-in">' +
      '<a class="logo" href="index.html" aria-label="Ekinox Gamos, accueil"><img src="assets/img/logo-ekg.png" alt="" width="30" height="30"><span>Ekinox Gamos</span></a>' +
      '<div class="gnav-links">' + links + "</div>" +
      '<div class="gnav-tools">' +
      '<button class="icon-btn" id="search-btn" type="button" aria-expanded="false" aria-controls="search-panel" aria-label="Rechercher">' + icons.search + "</button>" +
      '<button class="icon-btn mode-btn" id="mode-btn" type="button"></button>' +
      '<a class="icon-btn cart-btn" href="panier.html" aria-label="Panier">' + icons.cart + "<b data-cart-count></b></a>" +
      '<button class="icon-btn burger" id="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Ouvrir le menu">' + icons.menu + "</button>" +
      "</div></div>" +
      '<div class="gnav-panel" id="search-panel" hidden><div class="wrap search-panel"><form action="catalogue.html" role="search">' + icons.search +
      '<input type="search" name="q" id="gnav-q" value="' + q + '" placeholder="Rechercher sur Ekinox Gamos" aria-label="Rechercher un produit"></form>' +
      '<div class="quick"><p>Liens rapides</p><a href="catalogue.html?q=rtx%205060">Cartes graphiques RTX 5060</a><a href="catalogue.html?cat=ups">Onduleurs anti-délestage</a>' +
      '<a href="configurateur.html">Composer un PC avec Forge</a><a href="garantie.html">Vérifier une garantie</a><a href="boutiques.html">Horaires des boutiques</a></div></div></div>' +
      '<div class="gnav-panel" id="drawer" hidden><div class="wrap drawer"><nav aria-label="Menu mobile">' + links + "</nav></div></div></nav>";

    /* Ruban d'annonce, sous la navigation (il défile avec la page) */
    el.insertAdjacentHTML("afterend",
      '<div class="ribbon"><p>' +
      '<span data-show-mode="nuit">Livraison en 24 h à Tana, paiement MVola, Orange Money ou Airtel Money. <a href="gamme.html">Voir la gamme ›</a></span>' +
      '<span data-show-mode="jour">Ekinox Pro : devis sous 24 h ouvrées et installation sur site à Tana. <a href="pro.html#devis">Demander un devis ›</a></span>' +
      ' <span class="demo">· Site de démonstration</span></p></div>');

    renderModeBtn();
    $("#mode-btn").addEventListener("click", function () { setMode(getMode() === "nuit" ? "jour" : "nuit"); });

    var panels = { search: [$("#search-btn"), $("#search-panel")], drawer: [$("#burger"), $("#drawer")] };
    function toggle(name, open) {
      Object.keys(panels).forEach(function (k) {
        var on = k === name ? (open === undefined ? panels[k][1].hidden : open) : false;
        panels[k][1].hidden = !on;
        panels[k][0].setAttribute("aria-expanded", String(on));
        if (k === "drawer") panels[k][0].innerHTML = on ? icons.close : icons.menu;
        if (k === "search" && on) setTimeout(function () { $("#gnav-q").focus(); }, 30);
      });
    }
    panels.search[0].addEventListener("click", function () { toggle("search"); });
    panels.drawer[0].addEventListener("click", function () { toggle("drawer"); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(null, false); });
  }

  function renderFooter() {
    var el = $("#site-footer"); if (!el) return;
    var col = function (title, items) {
      return "<div><h3>" + title + "</h3><ul>" + items.map(function (i) {
        return '<li><a href="' + i[0] + '"' + (i[2] ? ' target="_blank" rel="noopener"' : "") + ">" + i[1] + "</a></li>";
      }).join("") + "</ul></div>";
    };
    el.className = "gfoot";
    el.innerHTML = '<div class="wrap">' +
      '<div class="gfoot-notes"><p>Site de démonstration réalisé pour Ekinox Gamos. Les prix, stocks, FPS, numéros de série et tickets SAV sont fictifs, et les paiements sont simulés.</p>' +
      "<p>FPS estimés en moyenne, avec les réglages indiqués sur chaque fiche. Les valeurs réelles varient selon le jeu, le pilote et les options graphiques.</p>" +
      '<p>Photos d\'illustration Unsplash, détail sur la page <a href="credits.html" style="color:inherit">Crédits</a>.</p></div>' +
      '<nav class="gfoot-cols" aria-label="Plan du site">' +
      col("Acheter", [["gamme.html", "PC Gamer Ekinox"], ["configurateur.html", "Configurateur Forge"], ["catalogue.html", "Composants"], ["catalogue.html?cat=ups", "Onduleurs"], ["panier.html", "Panier"]]) +
      col("Ekinox Pro", [["pro.html", "Univers métier"], ["pro.html#archi", "Architecture et BTP"], ["pro.html#serveurs", "Serveurs et stockage"], ["pro.html#devis", "Demander un devis"]]) +
      col("Services", [["garantie.html", "Passeport garantie"], ["garantie.html#sav", "Suivi SAV"], ["index.html#arrivages", "Arrivages"], ["boutiques.html", "Retrait en boutique"]]) +
      col("Boutiques", [["boutiques.html", "Showroom Mahamasina"], ["boutiques.html", "Annexe Andravoahangy"], ["boutiques.html", "Horaires et itinéraires"]]) +
      col("Ekinox Gamos", [[D.shop.facebook, "Facebook", 1], [waLink("Bonjour Ekinox Gamos, j'ai une question."), "WhatsApp", 1], ["mailto:" + D.shop.email, "E-mail"], ["proposition/proposition-ekinox.html", "Proposition d'agence"]]) +
      "</nav>" +
      '<p class="gfoot-more">Autres façons d\'acheter : passez au <a href="boutiques.html">showroom de Mahamasina</a> ou appelez le <a href="tel:' + D.shops[0].tel + '">' + D.shops[0].phone + "</a>.</p>" +
      '<div class="gfoot-legal"><span class="gfoot-brand"><img src="assets/img/logo-ekg.png" alt="" width="22" height="22"><b>Challenge everything</b></span>' +
      "<span>Copyright © 2026 Ekinox Gamos. Tous droits réservés.</span>" +
      '<nav aria-label="Liens annexes"><a href="credits.html">Crédits</a><a href="boutiques.html">Contact</a><a href="proposition/proposition-ekinox.html">Proposition</a></nav>' +
      "<span>Madagascar</span></div></div>";
  }

  /* ---------- Défileurs horizontaux (gamme, avantages) ---------- */
  function initScrollers() {
    $$("[data-scroller]").forEach(function (box) {
      var sc = $(".scroller", box), prev = $('[data-dir="prev"]', box), next = $('[data-dir="next"]', box);
      if (!sc || !prev || !next || sc._init) return;
      sc._init = true;
      function update() {
        prev.disabled = sc.scrollLeft < 8;
        next.disabled = sc.scrollLeft + sc.clientWidth > sc.scrollWidth - 8;
      }
      function go(dir) {
        var first = sc.firstElementChild;
        var w = first ? first.getBoundingClientRect().width + 20 : 300;
        sc.scrollBy({ left: dir * w, behavior: REDUCED ? "auto" : "smooth" });
      }
      prev.addEventListener("click", function () { go(-1); });
      next.addEventListener("click", function () { go(1); });
      sc.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }
  doc.addEventListener("DOMContentLoaded", initScrollers);

  /* ---------- Ajout au panier (délégation) ---------- */
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (!b) return;
    var it = getItem(b.getAttribute("data-add"));
    if (!it) return;
    cart.add(it.id, 1);
    toast(displayName(it) + " ajouté au panier", { href: "panier.html", text: "Voir le panier" });
  });

  /* ---------- Démarrage ---------- */
  renderHeader();
  renderFooter();
  $$("[data-icon]").forEach(function (el) { el.innerHTML = icons[el.getAttribute("data-icon")] || ""; });
  updateCartCount(false);
  window.addEventListener("storage", function (e) { if (e.key === CART_KEY) updateCartCount(false); });

  window.EKGApp = {
    $: $, $$: $$, esc: esc, fmtAr: fmtAr, fmtNum: fmtNum, fmtDate: fmtDate, normalize: normalize, params: params, store: store,
    icons: icons, getItem: getItem, isPc: isPc, catName: catName, stockTotal: stockTotal, stockInfo: stockInfo, upsFor: upsFor,
    fpsFor: fpsFor, gameName: gameName, photo: photo, pcCard: pcCard, partCard: partCard, cart: cart, waLink: waLink,
    nice: nice, displayName: displayName, initScrollers: initScrollers,
    shopStatus: shopStatus, tanaNow: tanaNow, tween: tween, reducedMotion: REDUCED, fmtHour: fmtHour, getMode: getMode, setMode: setMode, toast: toast
  };
})();
