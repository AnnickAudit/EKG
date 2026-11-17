/* Fiche produit : page « produit » pour un PC de la gamme, fiche courte pour un composant */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;
  var root = $("#product-root");
  var it = A.getItem(A.params().get("id") || "zenith");

  if (!it) {
    root.innerHTML = '<div class="wrap section"><div class="empty">' + I.box + "<b>Ce produit n'existe pas ou n'est plus au catalogue.</b>" +
      '<span>Retrouve toute la gamme ou cherche une pièce dans le catalogue.</span><div class="cta-row"><a class="btn btn-primary" href="gamme.html">PC Gamer</a><a class="more" href="catalogue.html">Composants</a></div></div></div>';
    return;
  }

  var pc = A.isPc(it);
  var title = A.displayName(it);
  document.title = title + " · Ekinox Gamos";
  if (!pc) A.$$(".gnav-links a, #drawer nav a").forEach(function (a) {
    a.removeAttribute("aria-current");
    if (a.getAttribute("href") === "catalogue.html") a.setAttribute("aria-current", "page");
  });

  var ups = pc ? A.upsFor(it) : null;
  var st = A.stockInfo(it);
  var inStock = A.stockTotal(it) > 0;
  var state = { qty: 1, ups: false };
  function unit() { return it.price + (state.ups ? ups.price : 0); }

  /* ---------- Bloc d'achat (commun) ---------- */
  function shopRow(name, n) {
    return "<li><span>" + name + '</span><span class="stock' + (n ? "" : " out") + '">' + (n ? n + " en stock" : "Rupture") + "</span></li>";
  }
  var stockList = '<ul class="stock-list">' + shopRow("Showroom Mahamasina", it.stock.mahamasina) + shopRow("Annexe Andravoahangy", it.stock.andravoahangy) +
    (it.arrival ? '<li><span>Prochain arrivage</span><span class="stock wait">' + esc(it.arrival) + "</span></li>" : "") + "</ul>";
  var addon = pc ? '<label class="addon" for="p-ups"><input type="checkbox" id="p-ups"><div><b>Pack anti-délestage</b><span>' + esc(ups.name) + " (" + esc(ups.spec) + ") et mise en service. Dimensionné pour les ≈ " + it.watts + " W de cette machine.</span></div>" +
    '<span class="price">+ ' + A.fmtAr(ups.price) + "</span></label>" : "";
  var perks = pc ? [
    ["camera", "Carnet d'assemblage", "photos et vidéo de ta machine avant la livraison"],
    ["gauge", "Test de charge 24 h", "rapport de températures remis avec le PC"],
    ["shield", "Garantie 12 mois", "passeport numérique et QR code sur le boîtier"],
    ["store", "Retrait gratuit", "à Mahamasina ou Andravoahangy, ou livraison à Tana en 24 h"]
  ] : [
    ["shield", "Garantie", "constructeur, gérée par Ekinox Gamos"],
    ["wrench", "Montage en atelier", "possible avec un PC sur mesure Forge"],
    ["store", "Retrait gratuit", "à Mahamasina ou Andravoahangy"]
  ];
  var buyInner =
    '<div><span class="price" id="p-unit">' + A.fmtAr(it.price) + "</span>" + (it.note ? ' <span class="tag tag-olive">' + esc(it.note) + "</span>" : "") + "</div>" +
    stockList + addon +
    '<div class="btn-row"><div class="qty"><button type="button" data-q="-1" aria-label="Diminuer la quantité">−</button><input id="p-qty" type="number" min="1" max="20" value="1" aria-label="Quantité"><button type="button" data-q="1" aria-label="Augmenter la quantité">+</button></div>' +
    '<button class="btn btn-primary btn-lg" type="button" id="p-add" style="flex:1">' + (inStock ? "Ajouter au panier" : "Commander") + "</button></div>" +
    '<p class="muted" id="p-total" style="font-size:15px"></p>' +
    '<a class="btn btn-block" id="p-wa" target="_blank" rel="noopener">' + I.whatsapp + "Commander sur WhatsApp</a>" +
    (pc ? '<button class="btn btn-block" type="button" id="p-reserve">Réserver avec 20 % d\'acompte</button>' : "") +
    '<ul class="perks">' + perks.map(function (p) { return "<li>" + I[p[0]] + "<span><b>" + p[1] + "</b> : " + p[2] + "</span></li>"; }).join("") + "</ul>";

  var sticky = '<div class="sticky-buy"><div><span class="price" id="sb-price">' + A.fmtAr(it.price) + '</span><br><span class="stock ' + st.cls + '">' + esc(st.text) + "</span></div>" +
    '<button class="btn btn-primary" type="button" id="sb-add">' + (inStock ? "Ajouter" : "Commander") + "</button></div>";
  var navs = '<div class="scroller-nav"><button type="button" data-dir="prev" aria-label="Précédent">' + I.chevL + '</button><button type="button" data-dir="next" aria-label="Suivant">' + I.chevR + "</button></div>";

  if (pc) {
    /* ---------- Page PC ---------- */
    var S = it.specs;
    var num = function (s) { var m = /(\d+)\s*Go/.exec(s); return m ? m[1] : ""; };
    var gpuShort = S.gpu.replace(/^GeForce |^Radeon /, "").replace(/\s*\d+\s*Go$/, "");
    var rows = [["Processeur", S.cpu], ["Carte graphique", S.gpu], ["Mémoire", S.ram], ["Stockage", S.storage], ["Carte mère", S.mb], ["Alimentation", S.psu], ["Refroidissement", S.cooling], ["Boîtier", S.case], ["Consommation en jeu", "≈ " + it.watts + " W"], ["Garantie", "12 mois pièces et main-d'œuvre"], ["Livraison", "Retrait gratuit en boutique, livraison à Tana en 24 h, envoi en province"]];
    var MAX = 400, marks = [60, 144, 240];
    var fps = D.games.map(function (g) {
      var v = A.fpsFor(it, g.id);
      return '<div class="fps-row"><span>' + esc(g.name) + '</span><div class="fps-track"><i style="--w:' + (v / MAX * 100).toFixed(1) + '%"></i><span class="fps-marks">' +
        marks.map(function (m) { return '<i style="left:' + (m / MAX * 100) + '%"></i>'; }).join("") + "</span></div><b>" + v + "</b></div>";
    }).join("");
    var scale = '<div class="fps-scale" aria-hidden="true"><span></span><span>' + marks.map(function (m) { return '<em style="left:' + (m / MAX * 100) + '%">' + m + " Hz</em>"; }).join("") + "</span><span>FPS</span></div>";
    var test = (D.passports["EKG-2026-0412"] || {}).test || {};
    var others = D.pcs.filter(function (p) { return p.id !== it.id; });

    root.innerHTML =
      '<nav class="localnav" aria-label="' + esc(title) + '"><div class="wrap localnav-in"><b>' + esc(title) + "</b>" +
      '<div class="localnav-links"><a href="#apercu">Aperçu</a><a href="#perf">Performances</a><a href="#carnet">Atelier</a><a href="#specs">Caractéristiques</a></div>' +
      '<a class="btn btn-primary btn-sm" href="#acheter">Acheter</a></div></nav>' +

      '<section class="p-hero" id="apercu"><div class="wrap">' +
      '<p class="eyebrow">' + esc(it.badge || "Gamme Ekinox · " + it.res) + "</p>" +
      "<h1>" + esc(title) + "</h1>" +
      '<p class="sub">' + esc(it.pitch) + "</p>" +
      '<p class="price-from">' + A.fmtAr(it.price) + " · " + esc(st.text) + "</p>" +
      '<div class="cta-row"><a class="btn btn-primary" href="#acheter">Acheter</a><a class="more" href="#perf">Voir les performances</a></div>' +
      "</div>" +
      '<div class="wrap">' + A.photo(it.photo, "p-hero-media", { eager: true, alt: "Photo d'illustration du PC " + title }) + "</div></section>" +

      '<section class="section"><div class="wrap"><div class="section-title"><h2>L\'essentiel.</h2></div><div class="p-hl">' +
      '<div class="hl-card"><b><em>' + it.fps.gtav + "</em> FPS</b><span>sur GTA V en " + esc(it.resLabel) + " (estimation)</span></div>" +
      '<div class="hl-card"><b>' + num(S.gpu) + " Go</b><span>de mémoire vidéo sur la " + esc(gpuShort) + "</span></div>" +
      '<div class="hl-card"><b>' + num(S.ram) + " Go</b><span>de mémoire vive " + esc(/DDR\d/.exec(S.ram) ? /DDR\d/.exec(S.ram)[0] : "") + "</span></div>" +
      '<div class="hl-card"><b>24 h</b><span>de test de charge avant la livraison</span></div>' +
      "</div></div></section>" +

      '<section class="section" id="acheter" style="padding-top:0"><div class="wrap"><div class="product">' +
      A.photo(it.photo, "product-media", { alt: "" }) +
      '<div class="buybox"><h2>Acheter ' + esc(title) + ".</h2>" + buyInner + "</div></div></div></section>" +

      '<section class="section" id="perf" style="padding-top:0"><div class="wrap"><div class="section-title"><h2>Performances.</h2>' +
      '<p class="sub">' + esc(it.resLabel) + ". Les repères indiquent les fréquences d'écran courantes : 60, 144 et 240 Hz.</p></div>" +
      '<div class="fps">' + fps + scale + '</div><p class="note-demo" style="margin-top:18px;text-align:center">Estimations de démonstration. Les valeurs réelles varient selon le pilote, la version du jeu et les réglages.</p></div></section>' +

      '<section class="section band-soft" id="carnet"><div class="wrap grid-2" style="align-items:center"><div>' +
      '<p class="eyebrow">Carnet d\'assemblage</p><h2>Ta machine, photographiée avant de partir.</h2>' +
      '<p class="sub" style="margin:16px 0 24px">Après le test de charge, tu reçois sur WhatsApp les photos, une courte vidéo et le rapport de test.</p>' +
      '<table class="spec-table"><tbody><tr><th scope="row">Durée du test</th><td>' + esc(test.duration) + '</td></tr><tr><th scope="row">CPU max</th><td>' + esc(test.cpuMax) +
      '</td></tr><tr><th scope="row">GPU max</th><td>' + esc(test.gpuMax) + '</td></tr><tr><th scope="row">Résultat</th><td>' + esc(test.result) + "</td></tr></tbody></table></div>" +
      A.photo("atelier-cpu", "split-media") + "</div></section>" +

      '<section class="section" id="specs"><div class="wrap"><div class="section-title"><h2>Caractéristiques techniques.</h2></div><div class="table-wrap"><table class="spec-table"><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + r[0] + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table></div></div></section>" +

      '<section class="section" style="padding-top:0"><div class="wrap section-title"><h2>Compare avec le reste de la gamme.</h2><a class="more" href="gamme.html">Toute la gamme</a></div>' +
      '<div data-scroller><div class="scroller">' + others.map(function (p) { return A.pcCard(p); }).join("") + "</div>" + navs + "</div></section>" +
      sticky;
  } else {
    /* ---------- Fiche composant ---------- */
    var attrs = [["Catégorie", A.catName(it.cat)], ["Référence", "EKG-" + it.id.toUpperCase()], ["Caractéristiques", it.spec]];
    if (it.socket) attrs.push(["Socket", it.socket]);
    if (it.ramType) attrs.push(["Mémoire", it.ramType]);
    if (it.form) attrs.push(["Format", it.form === "mATX" ? "micro-ATX" : "ATX"]);
    if (it.forms) attrs.push(["Cartes mères acceptées", it.forms.map(function (f) { return f === "mATX" ? "micro-ATX" : "ATX"; }).join(", ")]);
    if (it.gpuMax) attrs.push(["Carte graphique max", it.gpuMax + " mm"]);
    if (it.tdp) attrs.push(["Puissance thermique", it.tdp + " W"]);
    if (it.length) attrs.push(["Longueur", it.length + " mm"]);
    if (it.watts) attrs.push(["Puissance", it.watts + " W"]);
    if (it.maxTdp) attrs.push(["Processeurs jusqu'à", it.maxTdp + " W"]);

    var compat = [];
    if (it.cat === "cpu") compat = D.parts.filter(function (p) { return p.cat === "mb" && p.socket === it.socket; });
    if (it.cat === "mb") compat = D.parts.filter(function (p) { return (p.cat === "cpu" && p.socket === it.socket) || (p.cat === "ram" && p.ramType === it.ramType); });
    if (it.cat === "ram") compat = D.parts.filter(function (p) { return p.cat === "mb" && p.ramType === it.ramType; });
    if (it.cat === "gpu") compat = D.parts.filter(function (p) { return p.cat === "case" && p.gpuMax >= it.length; });
    if (it.cat === "case") compat = D.parts.filter(function (p) { return p.cat === "mb" && it.forms.indexOf(p.form) > -1; });
    var psuMin = it.cat === "gpu" ? Math.ceil((it.tdp + 200) * 1.3 / 50) * 50 : 0;
    var usedIn = D.pcs.filter(function (p) { return Object.keys(p.specs).some(function (k) { return A.normalize(p.specs[k]).indexOf(A.normalize(it.name)) > -1; }); });
    var related = D.parts.filter(function (p) { return p.cat === it.cat && p.id !== it.id; }).slice(0, 4);

    root.innerHTML =
      '<div class="wrap" style="padding-top:clamp(28px,4vw,48px)"><nav class="crumbs" aria-label="Fil d\'Ariane" style="justify-content:flex-start"><a href="index.html">Accueil</a><span>›</span><a href="catalogue.html?cat=' + it.cat + '">' + esc(A.catName(it.cat)) + "</a><span>›</span><span>" + esc(title) + "</span></nav>" +
      '<div class="product" id="acheter"><div class="product-media icon">' + (I[it.cat] || I.box) + "</div>" +
      '<div class="buybox"><p class="eyebrow">' + esc(A.catName(it.cat)) + '</p><h1 style="font-size:clamp(32px,3.6vw,48px)">' + esc(title) + '</h1><p class="tagline">' + esc(it.spec) + "</p>" + buyInner + "</div></div></div>" +
      '<section class="section"><div class="wrap grid-2" style="align-items:start"><div><h2 style="margin-bottom:20px">Caractéristiques.</h2><div class="table-wrap"><table class="spec-table"><tbody>' +
      attrs.map(function (r) { return '<tr><th scope="row">' + r[0] + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table></div></div>" +
      '<div class="panel"><h2>Compatibilité</h2>' +
      (psuMin ? '<p>Alimentation conseillée : <b class="price">' + psuMin + " W</b> minimum.</p>" : "") +
      (compat.length ? '<p class="muted">Compatible avec :</p><div class="chips">' + compat.map(function (c) { return '<a class="chip" href="produit.html?id=' + c.id + '">' + esc(c.name) + "</a>"; }).join("") + "</div>" : "") +
      (usedIn.length ? '<p class="muted">Utilisé dans :</p><div class="chips">' + usedIn.map(function (p) { return '<a class="chip" href="produit.html?id=' + p.id + '">' + esc(A.displayName(p)) + "</a>"; }).join("") + "</div>" : "") +
      '<p class="muted">Forge vérifie automatiquement la compatibilité avec le reste de ta configuration.</p>' +
      '<div class="cta-row" style="justify-content:flex-start"><a class="btn btn-primary" href="configurateur.html?add=' + it.id + '">Monter dans un PC sur mesure</a></div></div></div></section>' +
      (related.length ? '<section class="section" style="padding-top:0"><div class="wrap"><h2 style="margin-bottom:24px">Dans la même catégorie.</h2><div class="part-grid">' + related.map(A.partCard).join("") + "</div></div></section>" : "") +
      sticky;
  }
  document.body.classList.add("has-sticky");

  /* ---------- Interactions d'achat ---------- */
  var qtyInput = $("#p-qty");
  function waText() {
    return "Bonjour Ekinox Gamos, je souhaite commander :\n- " + title + " × " + state.qty + " (" + A.fmtAr(it.price) + ")" +
      (state.ups ? "\n- Pack anti-délestage : " + ups.name + " (" + A.fmtAr(ups.price) + ")" : "") +
      "\nTotal : " + A.fmtAr(unit() * state.qty) + "\nRéf. : EKG-" + it.id.toUpperCase() + "\nMerci !";
  }
  var lastUnit = it.price;
  function refresh() {
    A.tween($("#p-unit"), lastUnit, unit());
    A.tween($("#sb-price"), lastUnit, unit());
    lastUnit = unit();
    $("#p-total").textContent = state.qty > 1 || state.ups ? "Total : " + A.fmtAr(unit() * state.qty) + (state.ups ? " avec le pack anti-délestage" : "") : "";
    $("#p-wa").href = A.waLink(waText());
    var r = $("#p-reserve");
    if (r) r.textContent = "Réserver avec 20 % d'acompte · " + A.fmtAr(unit() * state.qty * D.shop.depositRate);
  }
  root.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]");
    if (q) { state.qty = Math.max(1, Math.min(20, state.qty + parseInt(q.getAttribute("data-q"), 10))); qtyInput.value = state.qty; refresh(); }
  });
  qtyInput.addEventListener("input", function () { state.qty = Math.max(1, Math.min(20, parseInt(qtyInput.value, 10) || 1)); refresh(); });
  var upsBox = $("#p-ups");
  if (upsBox) upsBox.addEventListener("change", function () { state.ups = upsBox.checked; refresh(); });
  function add() {
    A.cart.add(it.id, state.qty, { ups: state.ups });
    A.toast(title + (state.qty > 1 ? " × " + state.qty : "") + " ajouté au panier", { href: "panier.html", text: "Voir le panier" });
  }
  $("#p-add").addEventListener("click", add);
  $("#sb-add").addEventListener("click", add);
  refresh();

  /* ---------- Réservation avec acompte (simulation) ---------- */
  var modal = $("#reserve-modal"), body = $("#reserve-body");
  var reserveBtn = $("#p-reserve");
  if (reserveBtn && modal) {
    reserveBtn.addEventListener("click", function () {
      var total = unit() * state.qty, dep = total * D.shop.depositRate;
      body.innerHTML =
        '<h2 id="reserve-title">Réserver ' + esc(title) + "</h2>" +
        '<div class="recap"><div><span>Total</span><b>' + A.fmtAr(total) + "</b></div><div><span>Acompte 20 %</span><b>" + A.fmtAr(dep) + "</b></div><div><span>Reste à payer au retrait</span><b>" + A.fmtAr(total - dep) + "</b></div></div>" +
        '<form id="reserve-form" class="form-grid" novalidate>' +
        '<div class="field full"><label for="r-shop">Boutique de retrait</label><select class="select" id="r-shop">' + D.shops.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label for="r-name">Nom</label><input class="input" id="r-name" autocomplete="name" required></div>' +
        '<div class="field"><label for="r-phone">Téléphone mobile money</label><input class="input" id="r-phone" inputmode="tel" placeholder="034 12 345 67" autocomplete="tel" required></div>' +
        '<div class="field full"><span class="label">Payer l\'acompte avec</span><div class="chips" role="radiogroup" aria-label="Moyen de paiement">' +
        ["MVola", "Orange Money", "Airtel Money"].map(function (m, i) { return '<label class="chip' + (i ? "" : " is-on") + '"><input type="radio" name="r-pay" value="' + m + '"' + (i ? "" : " checked") + ' class="sr-only">' + m + "</label>"; }).join("") + "</div></div>" +
        '<p class="hint full" id="r-error" role="alert"></p>' +
        '<div class="btn-row full"><button class="btn btn-primary" type="submit">Payer l\'acompte (simulation)</button><button class="btn" type="button" data-close>Annuler</button></div>' +
        '<p class="note-demo full">Démonstration : aucun paiement n\'est réellement effectué.</p></form>';
      modal.showModal();
      var form = $("#reserve-form");
      form.addEventListener("change", function (e) {
        if (e.target.name === "r-pay") A.$$("label.chip", form).forEach(function (l) { l.classList.toggle("is-on", l.querySelector("input").checked); });
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = $("#r-name").value.trim(), phone = $("#r-phone").value.replace(/\s/g, "");
        if (!name || !/^(\+?261|0)3[23478]\d{7}$/.test(phone)) {
          $("#r-error").textContent = "Indique ton nom et un numéro malgache valide (ex. 034 12 345 67).";
          $("#r-error").style.color = "var(--danger)";
          return;
        }
        var shop = D.shops.filter(function (s) { return s.id === $("#r-shop").value; })[0];
        var pay = form.querySelector("input[name=r-pay]:checked").value;
        var ref = "EKG-RES-" + Math.floor(1000 + Math.random() * 9000);
        body.innerHTML = '<p class="eyebrow">Réservation confirmée</p><h2 id="reserve-title">' + esc(title) + " est bloqué pour toi.</h2>" +
          '<p class="ref">' + ref + "</p>" +
          '<div class="recap"><div><span>Acompte payé via ' + esc(pay) + "</span><b>" + A.fmtAr(dep) + "</b></div><div><span>Retrait</span><b>" + esc(shop.name) + "</b></div><div><span>Délai</span><b>7 jours</b></div></div>" +
          '<p class="muted">Un conseiller te contacte sur WhatsApp pour fixer le retrait. Garde ta référence.</p>' +
          '<div class="btn-row"><a class="btn btn-primary" target="_blank" rel="noopener" href="' + A.waLink("Bonjour, j'ai réservé " + title + " (réf. " + ref + "). Retrait prévu à " + shop.name + ". Nom : " + name + ".") + '">' + I.whatsapp + "Confirmer sur WhatsApp</a>" +
          '<button class="btn" type="button" data-close>Fermer</button></div><p class="note-demo">Simulation de démonstration.</p>';
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]") || e.target === modal) modal.close();
    });
  }
})();
