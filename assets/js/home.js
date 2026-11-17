/* Accueil : prix des tuiles, gamme, avantages, arrivages, boutiques */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;

  /* Prix « À partir de » des tuiles */
  A.$$("[data-price]").forEach(function (el) {
    var it = A.getItem(el.getAttribute("data-price"));
    if (it) el.textContent = "À partir de " + A.fmtAr(it.price);
  });

  /* Onduleurs de la tuile anti-délestage */
  $("#home-ups").innerHTML = ["ups-1200", "ups-2000", "surge"].map(function (id) {
    var p = A.getItem(id);
    return '<a href="produit.html?id=' + p.id + '"><span>' + esc(p.name) + '</span><span class="price">' + A.fmtAr(p.price) + "</span></a>";
  }).join("");

  /* Gamme */
  $("#home-pcs").innerHTML = D.pcs.map(function (p) { return A.pcCard(p); }).join("");

  /* Avantages */
  var WHY = [
    ["wrench", "Assemblé à Tana", "Chaque machine est montée et câblée dans notre atelier de Mahamasina."],
    ["gauge", "Testé 24 h", "Processeur et carte graphique à pleine charge avant la livraison, températures relevées."],
    ["camera", "Carnet d'assemblage", "Tu reçois les photos et une vidéo de ta propre machine avant qu'elle parte."],
    ["shield", "Garanti 12 mois", "Passeport numérique et QR code sur le boîtier pour suivre la garantie et le SAV."],
    ["phone", "Mobile money", "MVola, Orange Money ou Airtel Money. Acompte de 20 % pour réserver."],
    ["truck", "Livré en 24 h à Tana", "Ou retiré gratuitement en boutique. Envoi en province par transporteur."]
  ];
  $("#home-why").innerHTML = WHY.map(function (w) {
    return '<article class="why-card">' + I[w[0]] + "<h3>" + w[1] + "</h3><p>" + w[2] + "</p></article>";
  }).join("");

  /* Arrivage RTX 50 : inscription */
  var btn = $("#notify-rtx");
  var notified = A.store("ekg-notify") || [];
  function renderNotify() {
    var on = notified.indexOf(0) > -1;
    btn.textContent = on ? "Inscrit ✓" : "Me prévenir";
    btn.setAttribute("aria-pressed", String(on));
  }
  btn.addEventListener("click", function () {
    var k = notified.indexOf(0);
    if (k > -1) notified.splice(k, 1); else { notified.push(0); A.toast("Inscrit : tu seras prévenu sur WhatsApp à l'arrivage"); }
    A.store("ekg-notify", notified);
    renderNotify();
  });
  renderNotify();

  /* Boutiques */
  var s = A.shopStatus();
  $("#home-shops").innerHTML = D.shops.map(function (shop) {
    return '<article class="shop-card"><h3>' + esc(shop.name) + "</h3>" +
      '<p class="shop-status' + (s.open ? "" : " closed") + '">' + esc(s.text) + "</p>" +
      '<dl class="shop-meta"><dt>Adresse</dt><dd>' + esc(shop.address) + '</dd><dt>Téléphone</dt><dd><a href="tel:' + shop.tel + '">' + esc(shop.phone) + "</a></dd><dt>Sur place</dt><dd>" + esc(shop.role) + "</dd></dl>" +
      '<div class="cta-row" style="justify-content:flex-start"><a class="btn btn-primary btn-sm" href="' + shop.maps + '" target="_blank" rel="noopener">Itinéraire</a><a class="more" href="boutiques.html">Horaires</a></div></article>';
  }).join("");
})();
