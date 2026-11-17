/* Garantie : passeport (numéro de série + QR), demandes SAV, suivi de ticket */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;
  var DAY = 86400000;

  function clean(s) { return String(s || "").trim().toUpperCase().replace(/\s+/g, ""); }
  function shopName(id) { return (D.shops.filter(function (s) { return s.id === id; })[0] || {}).name || ""; }
  function addMonths(iso, n) { var d = new Date(iso + "T12:00:00"); d.setMonth(d.getMonth() + n); return d; }
  function isoOf(d) { return d.toISOString().slice(0, 10); }
  function passportUrl(sn) { return location.href.split("?")[0].split("#")[0] + "?sn=" + encodeURIComponent(sn); }

  /* ---------- Passeport ---------- */
  function showPassport(sn) {
    sn = clean(sn);
    var pp = D.passports[sn], out = $("#passport"), err = $("#pp-error");
    if (!pp) {
      out.innerHTML = "";
      err.textContent = sn ? "Aucun passeport pour « " + sn + " ». Vérifie le numéro sous le QR code du boîtier." : "Saisis un numéro de série.";
      err.style.color = "var(--danger)";
      return;
    }
    err.textContent = "";
    var pc = A.getItem(pp.pc);
    var sold = new Date(pp.sold + "T12:00:00"), end = addMonths(pp.sold, 12), now = new Date();
    var total = end - sold, left = Math.ceil((end - now) / DAY), valid = left > 0;
    var pct = Math.max(0, Math.min(100, (now - sold) / total * 100));
    out.innerHTML =
      '<div class="passport"><div style="display:grid;gap:18px;min-width:0">' +
      '<div class="passport-head"><div><p class="eyebrow">Passeport garantie</p><h2>Ekinox ' + esc(pc.name) + "</h2></div>" +
      (valid ? '<span class="tag tag-y">Sous garantie</span>' : '<span class="tag" style="border-color:var(--danger);color:var(--danger)">Garantie expirée</span>') + "</div>" +
      '<p class="ref">' + esc(sn) + "</p>" +
      '<dl class="shop-meta"><dt>Acheté le</dt><dd>' + A.fmtDate(pp.sold) + "</dd><dt>Boutique</dt><dd>" + esc(shopName(pp.shop)) + "</dd><dt>Client</dt><dd>" + esc(pp.client) +
      "</dd><dt>Fin de garantie</dt><dd>" + A.fmtDate(isoOf(end)) + "</dd></dl>" +
      '<div class="meter"><div style="display:flex;justify-content:space-between;gap:10px"><span>' + (valid ? "Garantie en cours" : "Garantie terminée") + '</span><b class="mono">' + (valid ? left + " jours restants" : "depuis " + (-left) + " jours") + "</b></div>" +
      '<div class="warranty-bar' + (valid ? "" : " expired") + '"><i style="--w:' + pct.toFixed(1) + '%"></i></div></div>' +
      '<div class="grid-2" style="gap:24px"><div><h3 style="margin-bottom:10px">Rapport de test</h3><div class="table-wrap"><table class="spec-table"><tbody>' +
      "<tr><th scope=\"row\">Durée</th><td>" + esc(pp.test.duration) + "</td></tr><tr><th scope=\"row\">CPU max</th><td>" + esc(pp.test.cpuMax) + "</td></tr><tr><th scope=\"row\">GPU max</th><td>" + esc(pp.test.gpuMax) + "</td></tr><tr><th scope=\"row\">Résultat</th><td>" + esc(pp.test.result) + "</td></tr>" +
      "</tbody></table></div></div>" +
      '<div><h3 style="margin-bottom:10px">Composants</h3><ul class="pc-specs" style="font-size:14px">' + Object.keys(pc.specs).map(function (k) { return "<li>" + esc(pc.specs[k]) + "</li>"; }).join("") + "</ul></div></div>" +
      '<div><h3 style="margin-bottom:14px">Historique</h3><ol class="timeline">' + pp.history.map(function (h) { return '<li class="done"><div><b>' + esc(h.label) + "</b><span>" + A.fmtDate(h.date) + " · " + esc(h.detail) + "</span></div></li>"; }).join("") + "</ol></div>" +
      '<div class="btn-row">' + (valid
        ? '<a class="btn btn-primary" href="#sav" data-sav="' + esc(sn) + '">' + I.wrench + "Ouvrir une demande SAV</a>"
        : '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + A.waLink("Bonjour, je souhaite prolonger la garantie de mon PC " + sn + ".") + '">Prolonger la garantie · ' + A.fmtAr(290000) + "</a>" +
          '<a class="btn" href="#sav" data-sav="' + esc(sn) + '">Diagnostic hors garantie</a>') +
      '<a class="btn" href="produit.html?id=' + pc.id + '">Fiche du modèle</a></div>' +
      "</div>" +
      '<div class="qr-box"><div id="qr" role="img" aria-label="QR code du passeport ' + esc(sn) + '"></div><small>QR collé sur le boîtier · il ouvre ce passeport</small></div></div>';

    var q = $("#qr");
    if (window.QRCode) {
      new window.QRCode(q, { text: passportUrl(sn), width: 190, height: 190, colorDark: "#000000", colorLight: "#FEE903", correctLevel: window.QRCode.CorrectLevel.M });
    } else {
      q.innerHTML = '<p style="color:#000;font:600 12px var(--font-mono);padding:20px 0">' + esc(sn) + "</p>";
    }
    history.replaceState(null, "", "?sn=" + encodeURIComponent(sn));
    $("#pp-sn").value = sn;
  }

  $("#pp-form").addEventListener("submit", function (e) { e.preventDefault(); showPassport($("#pp-sn").value); });
  $("#pp-form").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sn]"); if (b) { $("#pp-sn").value = b.getAttribute("data-sn"); showPassport(b.getAttribute("data-sn")); }
  });
  $("#passport").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sav]"); if (b) { $("#s-sn").value = b.getAttribute("data-sav"); setTimeout(function () { $("#s-type").focus({ preventScroll: true }); }, 400); }
  });

  /* ---------- Tickets SAV ---------- */
  var mine = A.store("ekg-tickets") || {};
  function getTicket(id) { return mine[id] || D.tickets[id] || null; }
  function timelineHtml(t) {
    return '<ol class="timeline">' + D.ticketSteps.map(function (s, i) {
      var cls = i < t.step ? "done" : i === t.step ? "current" : "";
      var sub = i < t.step ? "Terminé" : i === t.step ? "En cours" : "À venir";
      return '<li class="' + cls + '"><div><b>' + esc(s) + "</b><span>" + sub + "</span></div></li>";
    }).join("") + "</ol>";
  }
  function showTicket(id) {
    id = clean(id);
    var t = getTicket(id), out = $("#tk-result"), err = $("#tk-error");
    if (!t) { out.innerHTML = ""; err.textContent = id ? "Aucun ticket « " + id + " »." : "Saisis un numéro de ticket."; err.style.color = "var(--danger)"; return; }
    err.textContent = "";
    out.innerHTML = '<div class="recap"><div><span>Ticket</span><b class="mono">' + esc(id) + "</b></div><div><span>Machine</span><b class=\"mono\">" + esc(t.serial) + "</b></div><div><span>Problème</span><b>" + esc(t.issue) + "</b></div><div><span>Ouvert le</span><b>" + A.fmtDate(t.opened) + "</b></div></div>" + timelineHtml(t);
  }
  $("#tk-form").addEventListener("submit", function (e) { e.preventDefault(); showTicket($("#tk-id").value); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tk]"); if (b) { $("#tk-id").value = b.getAttribute("data-tk"); showTicket(b.getAttribute("data-tk")); }
  });

  $("#s-shop").innerHTML = D.shops.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + "</option>"; }).join("");
  $("#sav-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var sn = clean($("#s-sn").value), phone = $("#s-phone").value.replace(/\s/g, ""), err = $("#s-error");
    if (!sn || !/^(\+?261|0)3[23478]\d{7}$/.test(phone)) {
      err.textContent = "Indique le numéro de série et un numéro WhatsApp malgache valide.";
      err.style.color = "var(--danger)";
      return;
    }
    err.textContent = "";
    var id = "EKG-SAV-" + String(Math.floor(100 + Math.random() * 900)).padStart(4, "0");
    var t = { serial: sn, issue: $("#s-type").value, opened: isoOf(new Date()), step: 0 };
    mine[id] = t;
    A.store("ekg-tickets", mine);
    var shop = D.shops.filter(function (s) { return s.id === $("#s-shop").value; })[0];
    $("#sav-result").innerHTML = '<div class="recap" style="margin-top:16px"><div><span>Ticket créé</span><b class="ref" style="font-size:16px">' + id + "</b></div><div><span>Dépôt</span><b>" + esc(shop.name) + "</b></div></div>" +
      '<p class="muted" style="font-size:15px;margin-top:10px">Apporte la machine avec son câble d\'alimentation. Garde ce numéro pour suivre la réparation.</p>' +
      '<div class="btn-row" style="margin-top:12px"><a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="' + A.waLink("Bonjour, j'ai ouvert le ticket SAV " + id + " pour la machine " + sn + " : " + t.issue + ". " + $("#s-desc").value.trim()) + '">' + I.whatsapp + 'Prévenir l\'atelier</a><button class="btn btn-sm" type="button" data-tk="' + id + '">Suivre ce ticket</button></div>';
    A.toast("Ticket " + id + " créé");
  });

  /* ---------- Démarrage ---------- */
  var sn = A.params().get("sn");
  showPassport(sn || "EKG-2026-0412");
  if (!sn) history.replaceState(null, "", location.pathname);
})();
