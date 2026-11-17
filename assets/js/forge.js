/* Configurateur Forge : compatibilité, puissance, suggestion selon le budget */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;

  var STEPS = [
    { cat: "cpu", label: "Processeur", note: "Le socket du processeur détermine la carte mère compatible." },
    { cat: "mb", label: "Carte mère", note: "Elle fixe le type de mémoire (DDR4 ou DDR5) et le format du boîtier." },
    { cat: "ram", label: "Mémoire", note: "32 Go sont conseillés pour les jeux récents et le streaming." },
    { cat: "gpu", label: "Carte graphique", note: "La pièce qui compte le plus pour les FPS." },
    { cat: "storage", label: "Stockage", note: "Un SSD NVMe pour le système et les jeux. Ajoute un disque dur en boutique si besoin." },
    { cat: "psu", label: "Alimentation", note: "Forge calcule la puissance conseillée avec 40 % de marge." },
    { cat: "case", label: "Boîtier", note: "Il doit accepter le format de la carte mère et la longueur de la carte graphique." },
    { cat: "cooling", label: "Refroidissement", note: "Dimensionné selon la puissance thermique du processeur." }
  ];
  var BASE = { valorant: 330, eafc: 230, fortnite: 160, gtav: 170, warzone: 120, cyberpunk: 85 };
  var TIER = { 1: 0.7, 2: 0.82, 3: 1, 4: 1.25, 5: 1.5, 6: 1.75 };
  var RES = { "1080p": 1, "1440p": 0.75, "4K": 0.45 };

  var budgetEl = $("#fs-budget"), usageEl = $("#fs-usage"), gameEl = $("#fs-game");
  gameEl.innerHTML = D.games.map(function (g) { return '<option value="' + g.id + '">' + esc(g.name) + "</option>"; }).join("");

  var saved = A.store("ekg-forge") || {};
  var sel = saved.sel || null;
  budgetEl.value = saved.budget || 6000000;
  usageEl.value = saved.usage || "1440p";
  gameEl.value = saved.game || "gtav";

  function P(cat) { return sel[cat] ? A.getItem(sel[cat]) : null; }
  function partsOf(cat) { return D.parts.filter(function (p) { return p.cat === cat; }).sort(function (a, b) { return a.price - b.price; }); }
  function labelOf(cat) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].cat === cat) return STEPS[i].label; return cat; }
  function power() { var c = P("cpu"), g = P("gpu"); return (c ? c.tdp : 0) + (g ? g.tdp : 0) + 75; }
  function psuNeeded() {
    var c = P("cpu"), g = P("gpu");
    if (!c && !g) return 0;
    return Math.ceil(((c ? c.tdp : 65) + (g ? g.tdp : 0) + 100) * 1.4 / 50) * 50;
  }
  function reason(p) {
    var c = P("cpu"), m = P("mb"), g = P("gpu"), k = P("case");
    if (p.cat === "mb" && c && p.socket !== c.socket) return "Socket " + p.socket + ", ton processeur est en " + c.socket;
    if (p.cat === "ram" && m && p.ramType !== m.ramType) return "Ta carte mère attend de la " + m.ramType;
    if (p.cat === "gpu" && k && p.length > k.gpuMax) return "Trop longue pour ton boîtier (" + p.length + " mm, " + k.gpuMax + " mm max)";
    if (p.cat === "case" && m && p.forms.indexOf(m.form) < 0) return "N'accepte pas les cartes mères ATX";
    if (p.cat === "case" && g && g.length > p.gpuMax) return "Ta carte graphique est trop longue (" + g.length + " mm)";
    if (p.cat === "psu") { var need = psuNeeded(); if (need && p.watts < need) return "Insuffisante : " + need + " W conseillés"; }
    if (p.cat === "cooling" && c && p.maxTdp < c.tdp) return "Insuffisant pour un processeur de " + c.tdp + " W";
    return "";
  }

  function save() { A.store("ekg-forge", { sel: sel, budget: parseInt(budgetEl.value, 10), usage: usageEl.value, game: gameEl.value }); }

  function choose(cat, id, quiet) {
    sel[cat] = id;
    var removed = [];
    ["mb", "ram", "case", "psu", "cooling", "gpu"].forEach(function (c) {
      if (c === cat) return;
      var p = P(c);
      if (p && reason(p)) { removed.push(labelOf(c).toLowerCase()); delete sel[c]; }
    });
    if (removed.length && !quiet) A.toast("Retiré car incompatible : " + removed.join(", "));
    save();
    render();
  }

  /* Construit une configuration équilibrée autour d'une carte graphique donnée */
  function buildAround(g, B, creation) {
    var cpu = A.getItem(creation ? (B >= 9000000 ? "cpu-r9-9900x" : "cpu-r7-7700")
      : (g.tier >= 6 ? "cpu-r7-9800x3d" : g.tier >= 4 ? "cpu-r7-7700" : g.tier >= 3 ? "cpu-r5-7600" : "cpu-r5-5600"));
    var mb = A.getItem(cpu.socket === "AM4" ? "mb-b550m" : cpu.socket === "AM5" ? (B >= 9500000 ? "mb-x870" : B >= 7000000 ? "mb-b650" : "mb-b650m") : "mb-b760");
    var ram = mb.ramType === "DDR4" ? (B >= 4500000 ? "ram-32-d4" : "ram-16-d4") : ((creation || B >= 10000000) ? "ram-64-d5" : "ram-32-d5");
    var sto = B >= 7000000 ? "ssd-2t" : B >= 4000000 ? "ssd-1t" : "ssd-512";
    var need = Math.max(Math.ceil((cpu.tdp + g.tdp + 100) * 1.4 / 50) * 50, B >= 7000000 ? 650 : 0);
    var psu = partsOf("psu").filter(function (p) { return p.watts >= need; })[0] || A.getItem("psu-1000");
    var cases = partsOf("case").filter(function (c) { return c.forms.indexOf(mb.form) > -1 && c.gpuMax >= g.length; });
    var pick = function (id) { return cases.filter(function (c) { return c.id === id; })[0]; };
    var kase = (mb.form === "mATX" && B < 4500000 && pick("case-matx")) || (B >= 8000000 && pick("case-pano")) || pick("case-rgb-atx") || cases[cases.length - 1];
    var cools = partsOf("cooling").filter(function (c) { return c.maxTdp >= cpu.tdp; });
    var cool = B >= 11000000 ? cools[cools.length - 1] : (B >= 8000000 || cpu.tdp > 65) ? (cools.filter(function (c) { return c.id === "cool-aio240"; })[0] || cools[0]) : cools[0];
    var s = { cpu: cpu.id, mb: mb.id, ram: ram, gpu: g.id, storage: sto, psu: psu.id, "case": kase.id, cooling: cool.id };
    return { sel: s, total: Object.keys(s).reduce(function (t, k) { return t + A.getItem(s[k]).price; }, 0) + D.shop.assemblyFee };
  }
  /* Essaie la carte graphique la plus puissante qui tient dans le budget */
  function suggest(B, use) {
    var creation = use === "creation";
    var gpus = partsOf("gpu").filter(function (g) { return A.stockTotal(g) > 0 || g.arrival; }).reverse();
    if (use === "1080p") gpus = gpus.filter(function (g) { return g.tier <= 4; });
    for (var i = 0; i < gpus.length; i++) {
      var c = buildAround(gpus[i], B, creation);
      if (c.total <= B) return c.sel;
    }
    return buildAround(gpus[gpus.length - 1], B, creation).sel;
  }

  function noteFor(st) {
    if (st.cat === "psu") { var n = psuNeeded(); if (n) return "Puissance conseillée pour ta configuration : " + n + " W (40 % de marge)."; }
    return st.note;
  }

  function render(focusCat) {
    $("#forge-steps").innerHTML = STEPS.map(function (st, i) {
      var opts = partsOf(st.cat).map(function (p) {
        var checked = sel[st.cat] === p.id, why = checked ? "" : reason(p), s = A.stockInfo(p), img = A.partImg(p);
        return '<label class="opt' + (why ? " is-off" : "") + '"><input type="radio" name="f-' + st.cat + '" value="' + p.id + '"' + (checked ? " checked" : "") + (why ? " disabled" : "") + ">" +
          (img ? '<img class="opt-thumb" src="' + img + '" alt="" loading="lazy" decoding="async">' : "") +
          "<b>" + esc(p.name) + '</b><span class="opt-sub">' + esc(p.spec) + "</span>" + (why ? '<span class="why">' + esc(why) + "</span>" : "") +
          '<span class="opt-price"><span class="price">' + A.fmtAr(p.price) + '</span><span class="stock ' + s.cls + '">' + esc(s.text) + "</span></span></label>";
      }).join("");
      return '<section class="forge-step' + (sel[st.cat] ? " done" : "") + '" id="step-' + st.cat + '"><h2><span class="n">' + (i + 1) + "</span>" + st.label + "</h2>" +
        '<p class="step-note">' + esc(noteFor(st)) + '</p><div class="opts" role="radiogroup" aria-label="' + st.label + '">' + opts + "</div></section>";
    }).join("");
    if (focusCat) { var el = $('input[name="f-' + focusCat + '"]:checked'); if (el) el.focus({ preventScroll: true }); }
    renderSummary();
  }

  function waText(total) {
    return "Bonjour Ekinox Gamos, voici ma configuration Forge :\n" +
      STEPS.map(function (st) { var p = P(st.cat); return "- " + st.label + " : " + (p ? p.name + " (" + A.fmtAr(p.price) + ")" : "à conseiller"); }).join("\n") +
      "\n- Assemblage, câblage et test 24 h (" + A.fmtAr(D.shop.assemblyFee) + ")\nTotal : " + A.fmtAr(total) +
      "\nUsage : " + usageEl.options[usageEl.selectedIndex].text + "\nPouvez-vous confirmer la disponibilité ?";
  }

  var lastTotal = null;
  function renderSummary() {
    var rows = STEPS.map(function (st) { return { st: st, p: P(st.cat) }; });
    var count = rows.filter(function (r) { return r.p; }).length;
    var complete = count === STEPS.length;
    var total = rows.reduce(function (t, r) { return t + (r.p ? r.p.price : 0); }, 0) + (count ? D.shop.assemblyFee : 0);
    var B = parseInt(budgetEl.value, 10);
    var watts = power(), psu = P("psu"), load = psu ? Math.round(watts / psu.watts * 100) : 0;
    var g = P("gpu"), res = usageEl.value === "creation" ? "1440p" : usageEl.value, game = gameEl.value;
    var fps = g ? Math.round(BASE[game] * TIER[g.tier] * RES[res]) : 0;
    var missing = rows.filter(function (r) { return !r.p; }).map(function (r) { return r.st.label.toLowerCase(); });
    var issues = [];
    issues.push(missing.length ? { ok: false, t: "À choisir : " + missing.join(", ") + "." } : { ok: true, t: "Toutes les pièces sont compatibles entre elles." });
    if (psu) issues.push(load <= 75 ? { ok: true, t: "Alimentation chargée à " + load + " % en jeu : bonne marge." } : { ok: false, t: "Alimentation chargée à " + load + " % : marge faible." });
    if (count && total > B) issues.push({ ok: false, t: "Dépasse ton budget de " + A.fmtAr(total - B) + "." });
    else if (complete) issues.push({ ok: true, t: "Dans ton budget, il reste " + A.fmtAr(B - total) + "." });

    $("#forge-summary").innerHTML =
      "<h2>Ta configuration</h2>" +
      '<ul class="sum-list">' + rows.map(function (r) {
        return '<li class="' + (r.p ? "" : "empty-pick") + '"><small>' + r.st.label + "</small><span>" + (r.p ? esc(r.p.name) : "Non choisi") + "</span>" + (r.p ? '<span class="price">' + A.fmtAr(r.p.price) + "</span>" : "") + "</li>";
      }).join("") +
      '<li><small>Service</small><span>Assemblage, câblage et test 24 h</span><span class="price">' + A.fmtAr(D.shop.assemblyFee) + "</span></li></ul>" +
      '<div class="sum-total"><span>Total</span><span class="price">' + A.fmtAr(total) + "</span></div>" +
      (g ? '<div class="meter"><div style="display:flex;justify-content:space-between;gap:10px"><span>FPS estimés · ' + esc(A.gameName(game)) + " " + res + '</span><b class="mono" style="color:var(--yellow)">≈ ' + fps + '</b></div><div class="meter-bar"><i style="--w:' + Math.min(100, fps / 4) + '%"></i></div></div>' : "") +
      '<div class="meter"><div style="display:flex;justify-content:space-between;gap:10px"><span>Consommation estimée</span><b class="mono">≈ ' + watts + " W" + (psu ? " / " + psu.watts + " W" : "") + '</b></div><div class="meter-bar' + (load > 75 ? " bad" : "") + '"><i style="--w:' + Math.min(100, load) + '%"></i></div></div>' +
      '<ul class="issues">' + issues.map(function (i) { return '<li class="' + (i.ok ? "ok" : "") + '">' + esc(i.t) + "</li>"; }).join("") + "</ul>" +
      '<button class="btn btn-primary btn-block" type="button" id="fx-add"' + (complete ? "" : " disabled") + ">" + I.cart + "Ajouter au panier</button>" +
      '<a class="btn btn-block" id="fx-wa" target="_blank" rel="noopener" href="' + A.waLink(waText(total)) + '">' + I.whatsapp + "Envoyer à un conseiller</a>" +
      '<button class="link-btn" type="button" id="fx-reset">Tout effacer</button>' +
      '<p class="note-demo">Prix et FPS de démonstration. Un conseiller confirme la disponibilité avant le montage.</p>';

    A.tween($("#forge-summary .sum-total .price"), lastTotal, total);
    A.tween($("#fsb-total"), lastTotal, total);
    lastTotal = total;
    var stEl = $("#fsb-state");
    stEl.textContent = complete ? "Configuration complète" : count + " / " + STEPS.length + " pièces";
    stEl.className = "stock" + (complete ? "" : " wait");
  }

  function setBudgetOut() { $("#fs-budget-out").textContent = A.fmtAr(parseInt(budgetEl.value, 10)); }

  /* ---------- Événements ---------- */
  $("#forge-steps").addEventListener("change", function (e) {
    var n = e.target.name || "";
    if (n.indexOf("f-") === 0) { var cat = n.slice(2); choose(cat, e.target.value); var el = $('input[name="f-' + cat + '"]:checked'); if (el) el.focus({ preventScroll: true }); }
  });
  $("#forge-summary").addEventListener("click", function (e) {
    if (e.target.closest("#fx-add")) {
      var total = STEPS.reduce(function (t, st) { return t + P(st.cat).price; }, 0) + D.shop.assemblyFee;
      A.cart.addCustom({ name: "PC sur mesure Forge", parts: STEPS.map(function (st) { return sel[st.cat]; }), price: total, usage: usageEl.options[usageEl.selectedIndex].text });
      A.toast("Ton PC sur mesure est dans le panier", { href: "panier.html", text: "Voir le panier" });
    }
    if (e.target.closest("#fx-reset")) { sel = {}; save(); render(); A.toast("Configuration effacée"); }
  });
  $("#forge-start").addEventListener("submit", function (e) {
    e.preventDefault();
    sel = suggest(parseInt(budgetEl.value, 10), usageEl.value);
    save(); render();
    A.toast("Configuration proposée pour " + A.fmtAr(parseInt(budgetEl.value, 10)));
    $("#forge-steps").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  budgetEl.addEventListener("input", function () { setBudgetOut(); save(); renderSummary(); });
  [usageEl, gameEl].forEach(function (el) { el.addEventListener("change", function () { save(); renderSummary(); }); });

  /* ---------- Démarrage ---------- */
  setBudgetOut();
  if (!sel || !Object.keys(sel).length) sel = suggest(parseInt(budgetEl.value, 10), usageEl.value);
  var add = A.getItem(A.params().get("add") || "");
  if (add && !A.isPc(add) && STEPS.some(function (s) { return s.cat === add.cat; })) {
    choose(add.cat, add.id, true);
    A.toast(add.name + " ajouté à ta configuration");
  } else { save(); render(); }
  document.body.classList.add("has-sticky");
})();
