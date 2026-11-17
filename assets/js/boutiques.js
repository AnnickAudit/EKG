/* Boutiques : statut en direct (heure de Tana), horaires, itinéraires */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;
  var ORDER = [1, 2, 3, 4, 5, 6, 0];
  var NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  function render() {
    var s = A.shopStatus(), today = A.tanaNow().getDay();
    var st = $("#b-status");
    st.textContent = s.text + " (heure de Tana)";
    st.className = "shop-status" + (s.open ? "" : " closed");

    var hours = '<table class="hours"><tbody>' + ORDER.map(function (d) {
      var h = D.hours[d];
      return '<tr class="' + (d === today ? "today" : "") + '"><td>' + NAMES[d] + (d === today ? " · aujourd'hui" : "") + "</td><td>" + (h ? A.fmtHour(h[0]) + " – " + A.fmtHour(h[1]) : "Fermé") + "</td></tr>";
    }).join("") + "</tbody></table>";

    $("#b-shops").innerHTML = D.shops.map(function (shop) {
      return '<article class="shop-card"><h3>' + esc(shop.name) + "</h3>" +
        '<p class="shop-status' + (s.open ? "" : " closed") + '">' + esc(s.text) + "</p>" +
        '<dl class="shop-meta"><dt>Adresse</dt><dd>' + esc(shop.address) + ", " + esc(shop.city) + "</dd><dt>Téléphone</dt><dd><a href=\"tel:" + shop.tel + '">' + esc(shop.phone) + "</a></dd><dt>Sur place</dt><dd>" + esc(shop.role) + "</dd></dl>" +
        hours +
        '<p class="note-demo">Fermé les jours fériés.</p>' +
        '<div class="btn-row"><a class="btn btn-primary" href="' + shop.maps + '" target="_blank" rel="noopener">' + I.pin + "Itinéraire</a>" +
        '<a class="btn" href="tel:' + shop.tel + '">' + I.phone + "Appeler</a></div></article>";
    }).join("");
  }

  var wa = $("#b-wa");
  wa.href = A.waLink("Bonjour Ekinox Gamos, j'ai une question avant de passer en boutique.");
  wa.innerHTML = I.whatsapp + "Écrire sur WhatsApp";
  $("#b-contact").innerHTML =
    "<dt>WhatsApp</dt><dd>" + esc(D.shops[0].phone) + "</dd>" +
    D.shops.map(function (s) { return "<dt>" + esc(s.short) + '</dt><dd><a href="tel:' + s.tel + '">' + esc(s.phone) + "</a></dd>"; }).join("") +
    '<dt>E-mail</dt><dd><a href="mailto:' + D.shop.email + '">' + D.shop.email + "</a></dd>" +
    '<dt>Facebook</dt><dd><a href="' + D.shop.facebook + '" target="_blank" rel="noopener">Ekinox Gamos</a></dd>' +
    "<dt>Horaires</dt><dd>Lun–ven 8h30–17h · Sam 8h30–12h</dd>";

  render();
  setInterval(render, 60000);
})();
