/* Accueil */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$;

  /* PC à la une */
  var star = A.getItem("zenith"), st = A.stockInfo(star);
  $("#hero-card").innerHTML =
    '<span class="tag tag-y">Le plus choisi</span>' +
    "<h3>EKINOX " + A.esc(star.name) + "</h3>" +
    '<p class="muted" style="margin-top:-6px">' + A.esc(star.line) + "</p>" +
    "<ul><li>" + A.esc(star.specs.cpu) + "</li><li>" + A.esc(star.specs.gpu) + "</li><li>" + A.esc(star.specs.ram) + "</li><li>≈ " + star.fps.gtav + " FPS sur GTA V en 1440p</li></ul>" +
    '<span class="price">' + A.fmtAr(star.price) + "</span>" +
    '<span class="stock ' + st.cls + '">' + A.esc(st.text) + "</span>" +
    '<a class="btn btn-block" href="produit.html?id=zenith">Voir la fiche</a>';

  /* Gamme */
  $("#home-pcs").innerHTML = D.pcs.map(function (p) { return A.pcCard(p); }).join("");

  /* Univers */
  $("#home-unis").innerHTML = D.universes.map(function (u) {
    return '<a class="uni-card" href="pro.html#' + u.id + '">' + A.photo(u.photo, "", { alt: "" }) +
      '<span class="arrow">' + A.icons.arrow + "</span>" +
      '<div class="uni-body"><h3>' + A.esc(u.name) + "</h3><p>" + A.esc(u.software.slice(0, 3).join(" · ")) + "</p></div></a>";
  }).join("");

  /* Arrivages */
  var notified = A.store("ekg-notify") || [];
  function renderArrivals() {
    $("#home-arrivals").innerHTML = D.arrivals.map(function (a, i) {
      var on = notified.indexOf(i) > -1;
      return '<div class="arrival"><time>' + A.esc(a.date) + "</time><div><b>" + A.esc(a.name) + "</b><span>" + A.esc(a.note) + "</span></div>" +
        '<button class="btn btn-sm" type="button" data-notify="' + i + '"' + (on ? ' aria-pressed="true"' : "") + ">" + (on ? A.icons.check + "Inscrit" : "Me prévenir") + "</button></div>";
    }).join("");
  }
  renderArrivals();
  $("#home-arrivals").addEventListener("click", function (e) {
    var b = e.target.closest("[data-notify]"); if (!b) return;
    var i = parseInt(b.getAttribute("data-notify"), 10);
    var k = notified.indexOf(i);
    if (k > -1) notified.splice(k, 1); else { notified.push(i); A.toast("Inscrit : tu seras prévenu sur WhatsApp à l'arrivage"); }
    A.store("ekg-notify", notified);
    renderArrivals();
  });

  /* Onduleurs */
  $("#home-ups").innerHTML = ["ups-1200", "ups-2000"].map(function (id) { return A.partCard(A.getItem(id)); }).join("");

  /* Boutiques */
  var s = A.shopStatus();
  $("#home-shops").innerHTML = D.shops.map(function (shop) {
    return '<article class="shop-card"><h3>' + A.esc(shop.name) + "</h3>" +
      '<p class="shop-status' + (s.open ? "" : " closed") + '">' + A.esc(s.text) + "</p>" +
      '<dl class="shop-meta"><dt>Adresse</dt><dd>' + A.esc(shop.address) + "</dd><dt>Téléphone</dt><dd><a href=\"tel:" + shop.tel + '">' + A.esc(shop.phone) + "</a></dd><dt>Sur place</dt><dd>" + A.esc(shop.role) + "</dd></dl>" +
      '<div class="btn-row"><a class="btn btn-sm btn-primary" href="' + shop.maps + '" target="_blank" rel="noopener">' + A.icons.pin + "Itinéraire</a>" +
      '<a class="btn btn-sm" href="boutiques.html">Horaires</a></div></article>';
  }).join("");
})();
