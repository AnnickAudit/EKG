/* Espace pro : univers métier, prix HT/TTC, demande de devis */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc;
  var ht = true;

  $("#pro-wa").href = A.waLink("Bonjour Ekinox Gamos, je souhaite un conseil pour équiper ma société.");
  $("#uni-nav").innerHTML = D.universes.map(function (u) { return '<a class="chip" href="#' + u.id + '">' + esc(u.name) + "</a>"; }).join("");
  $("#d-uni").innerHTML = D.universes.map(function (u) { return '<option value="' + u.id + '">' + esc(u.name) + "</option>"; }).join("") + '<option value="autre">Autre besoin</option>';

  function priceText(v) {
    if (!v) return '<span class="price">Sur devis</span>';
    return ht ? '<span class="price">' + A.fmtAr(v) + " <small>HT</small></span>" : '<span class="price">' + A.fmtAr(v * 1.2) + " <small>TTC</small></span>";
  }

  function render() {
    $("#uni-list").innerHTML = D.universes.map(function (u, i) {
      return '<article class="uni-section" id="' + u.id + '">' +
        A.photo(u.photo, "uni-photo") +
        '<div class="uni-text"><p class="eyebrow">Univers ' + (i + 1) + " sur " + D.universes.length + "</p><h2>" + esc(u.name) + "</h2>" +
        '<p class="lead">' + esc(u.text) + "</p>" +
        '<div class="soft">' + u.software.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div>" +
        '<div class="uni-config"><div class="row"><b>' + esc(u.config.name) + "</b>" + priceText(u.config.priceHT) + "</div>" +
        "<ul>" + u.config.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="btn-row"><a class="btn btn-primary" href="#devis" data-uni="' + u.id + '">Devis pour cet univers</a>' +
        '<a class="btn" target="_blank" rel="noopener" href="' + A.waLink("Bonjour, je souhaite un conseil pour l'univers « " + u.name + " » (" + u.config.name + ").") + '">' + A.icons.whatsapp + "Conseil</a></div></div></article>";
    }).join("");
  }

  function setHT(v) {
    ht = v;
    $("#px-ht").setAttribute("aria-pressed", String(v));
    $("#px-ttc").setAttribute("aria-pressed", String(!v));
    render();
  }
  $("#px-ht").addEventListener("click", function () { setHT(true); });
  $("#px-ttc").addEventListener("click", function () { setHT(false); });

  $("#uni-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-uni]"); if (!b) return;
    $("#d-uni").value = b.getAttribute("data-uni");
    setTimeout(function () { $("#d-company").focus({ preventScroll: true }); }, 400);
  });

  /* Formulaire de devis */
  $("#devis-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return $("#" + id).value.trim(); };
    var err = $("#d-error");
    var phone = v("d-phone").replace(/\s/g, "");
    var missing = [];
    if (!v("d-company")) missing.push("la société");
    if (!v("d-name")) missing.push("le nom du contact");
    if (!/^(\+?261|0)3[23478]\d{7}$/.test(phone) && !/^(\+?261|0)20\d{7}$/.test(phone)) missing.push("un numéro valide");
    if (v("d-nif") && !/^\d{10}$/.test(v("d-nif"))) missing.push("un NIF à 10 chiffres");
    if (missing.length) {
      err.textContent = "Il manque " + missing.join(", ") + ".";
      err.style.color = "var(--danger)";
      return;
    }
    err.textContent = "";
    var uni = $("#d-uni").options[$("#d-uni").selectedIndex].text;
    var ref = "EKG-DEV-" + Math.floor(1000 + Math.random() * 9000);
    var text = "Bonjour Ekinox Gamos, demande de devis " + ref + " :\n" +
      "Société : " + v("d-company") + (v("d-nif") ? "\nNIF : " + v("d-nif") : "") + (v("d-stat") ? "\nSTAT : " + v("d-stat") : "") +
      "\nContact : " + v("d-name") + " · " + v("d-phone") + (v("d-email") ? " · " + v("d-email") : "") +
      "\nUnivers : " + uni + "\nPostes : " + v("d-qty") + "\nBudget : " + v("d-budget") + "\nDélai : " + v("d-delay") +
      ($("#d-install").checked ? "\nInstallation sur site : oui" : "") + ($("#d-trade").checked ? "\nReprise de l'ancien parc : oui" : "") +
      (v("d-msg") ? "\nBesoin : " + v("d-msg") : "");
    var box = $("#devis-result");
    box.hidden = false;
    box.innerHTML = '<p class="kicker">Demande prête</p><h2>Référence <span class="ref">' + ref + "</span></h2>" +
      '<div class="recap"><div><span>Société</span><b>' + esc(v("d-company")) + "</b></div><div><span>Univers</span><b>" + esc(uni) + "</b></div><div><span>Postes</span><b>" + esc(v("d-qty")) + "</b></div><div><span>Réponse</span><b>Sous 24 h ouvrées</b></div></div>" +
      '<div class="btn-row"><a class="btn btn-primary" target="_blank" rel="noopener" href="' + A.waLink(text) + '">' + A.icons.whatsapp + "Envoyer sur WhatsApp</a>" +
      '<a class="btn" href="mailto:' + D.shop.email + "?subject=" + encodeURIComponent("Demande de devis " + ref) + "&body=" + encodeURIComponent(text) + '">Envoyer par e-mail</a></div>';
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    A.toast("Demande " + ref + " prête à envoyer");
  });

  render();
})();
