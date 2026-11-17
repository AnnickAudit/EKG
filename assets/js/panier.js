/* Panier : lignes, livraison, paiement, commande WhatsApp, paiement simulé */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc, I = A.icons;
  var root = $("#cart-root");

  var DELIVERY = [
    { id: "mahamasina", label: "Retrait au showroom Mahamasina", sub: "Près de Gastro Pizza · prêt sous 2 h si en stock", price: 0 },
    { id: "andravoahangy", label: "Retrait à l'annexe Andravoahangy", sub: "Immeuble Raitra, box 5", price: 0 },
    { id: "tana", label: "Livraison à Tana en 24 h", sub: "Coursier, paiement possible à la livraison", price: D.shop.deliveryTana },
    { id: "province", label: "Envoi en province", sub: "Par transporteur partenaire, tarif selon la destination", price: null }
  ];
  var PAYMENT = [
    { id: "MVola", label: "MVola", sub: "Paiement immédiat" },
    { id: "Orange Money", label: "Orange Money", sub: "Paiement immédiat" },
    { id: "Airtel Money", label: "Airtel Money", sub: "Paiement immédiat" },
    { id: "Acompte", label: "Acompte 20 % puis solde", sub: "Acompte mobile money, solde au retrait" },
    { id: "Espèces", label: "Espèces", sub: "Au retrait ou à la livraison à Tana" }
  ];
  var form = A.store("ekg-checkout") || { delivery: "mahamasina", payment: "MVola", name: "", phone: "", place: "", note: "" };

  function lineInfo(l) {
    if (l.custom) return { name: l.custom.name, href: "configurateur.html", thumb: '<div class="cart-thumb icon">' + I.pc + "</div>", subs: l.custom.parts.map(function (id) { var p = A.getItem(id); return p ? p.name : id; }).concat(["Assemblage, câblage et test 24 h"]), stock: { cls: "wait", text: "Montage sous 48 h après validation" } };
    var it = A.getItem(l.id); if (!it) return null;
    var pc = A.isPc(it);
    var subs = [];
    if (pc) subs.push(it.specs.cpu + " · " + it.specs.gpu);
    if (l.ups) subs.push("+ Pack anti-délestage : " + A.upsFor(it).name + " (" + A.fmtAr(A.upsFor(it).price) + ")");
    return {
      name: pc ? "Ekinox " + it.name : it.name, href: "produit.html?id=" + it.id,
      thumb: pc ? A.photo(it.photo, "cart-thumb", { alt: "" }) : '<div class="cart-thumb icon">' + (I[it.cat] || I.box) + "</div>",
      subs: subs, stock: A.stockInfo(it), item: it
    };
  }

  function deliveryOf(id) { return DELIVERY.filter(function (d) { return d.id === id; })[0] || DELIVERY[0]; }
  function totals() {
    var sub = A.cart.total(), d = deliveryOf(form.delivery), fee = d.price || 0, total = sub + fee;
    return { sub: sub, fee: fee, feeKnown: d.price !== null, total: total, now: form.payment === "Acompte" ? Math.round(total * D.shop.depositRate) : (form.payment === "Espèces" ? 0 : total) };
  }

  function waText() {
    var t = totals();
    var lines = A.cart.lines().map(function (l) {
      var info = lineInfo(l); if (!info) return "";
      return "- " + info.name + " × " + l.qty + " : " + A.fmtAr(A.cart.unit(l) * l.qty) + (l.ups ? "\n  + pack anti-délestage" : "") + (l.custom ? "\n  (" + info.subs.slice(0, -1).join(", ") + ")" : "");
    }).join("\n");
    return "Bonjour Ekinox Gamos, je souhaite passer commande :\n" + lines +
      "\nLivraison : " + deliveryOf(form.delivery).label + (form.place ? " (" + form.place + ")" : "") +
      "\nPaiement : " + form.payment +
      "\nTotal : " + A.fmtAr(t.total) + (t.feeKnown ? "" : " + frais d'envoi") +
      (form.name ? "\nNom : " + form.name : "") + (form.phone ? "\nTéléphone : " + form.phone : "") + (form.note ? "\nNote : " + form.note : "") + "\nMerci !";
  }

  function render() {
    var lines = A.cart.lines();
    if (!lines.length) {
      root.innerHTML = '<div class="section"><div class="empty">' + I.cart + "<b>Ton panier est vide.</b><span>Commence par la gamme Ekinox, ou compose ta machine dans Forge.</span>" +
        '<div class="btn-row"><a class="btn btn-primary" href="gamme.html">PC Gamer</a><a class="btn" href="configurateur.html">Forge</a><a class="btn" href="catalogue.html">Composants</a></div></div></div>';
      return;
    }
    var upsell = lines.filter(function (l) { var it = A.getItem(l.id); return it && A.isPc(it) && !l.ups; })[0];
    var hasUps = lines.some(function (l) { return l.id === "ups-1200" || l.id === "ups-2000"; });

    var linesHtml = lines.map(function (l) {
      var info = lineInfo(l); if (!info) return "";
      return '<article class="cart-line">' + info.thumb +
        '<div class="cart-info"><a href="' + info.href + '">' + esc(info.name) + "</a>" +
        (info.subs.length ? "<ul>" + info.subs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "") +
        '<span class="stock ' + info.stock.cls + '">' + esc(info.stock.text) + "</span></div>" +
        '<div class="cart-side"><span class="price">' + A.fmtAr(A.cart.unit(l) * l.qty) + "</span>" +
        '<div class="qty"><button type="button" data-dq="-1" data-key="' + l.key + '" aria-label="Diminuer">−</button><input type="number" min="1" max="20" value="' + l.qty + '" data-qkey="' + l.key + '" aria-label="Quantité de ' + esc(info.name) + '"><button type="button" data-dq="1" data-key="' + l.key + '" aria-label="Augmenter">+</button></div>' +
        '<button class="link-btn" type="button" data-remove="' + l.key + '">Retirer</button></div></article>';
    }).join("");

    var up = "";
    if (upsell && !hasUps) {
      var it = A.getItem(upsell.id), u = A.upsFor(it);
      up = '<div class="upsell band-y">' + I.bolt + '<div><b>Protège ton Ekinox ' + esc(it.name) + " des délestages</b><br><span style=\"font-size:14px\">" + esc(u.name) + " dimensionné pour " + it.watts + " W, + " + A.fmtAr(u.price) + "</span></div>" +
        '<button class="btn btn-sm btn-dark" type="button" data-addups="' + upsell.key + '">Ajouter</button></div>';
    }

    var radio = function (name, list, cur) {
      return list.map(function (o) {
        var price = o.price === undefined ? "" : '<span class="opt-price"><span class="price">' + (o.price === null ? "Sur devis" : o.price ? A.fmtAr(o.price) : "Gratuit") + "</span></span>";
        return '<label class="opt"><input type="radio" name="' + name + '" value="' + o.id + '"' + (cur === o.id ? " checked" : "") + "><b>" + esc(o.label) + '</b><span class="opt-sub">' + esc(o.sub) + "</span>" + price + "</label>";
      }).join("");
    };

    root.innerHTML = '<div class="cart-layout"><div><div class="cart-lines">' + linesHtml + "</div>" + up +
      '<div class="btn-row" style="margin-top:18px"><a class="btn btn-sm" href="gamme.html">Continuer mes achats</a><button class="link-btn" type="button" id="cart-clear">Vider le panier</button></div></div>' +
      '<form class="checkout" id="checkout" novalidate><h2>Finaliser</h2>' +
      '<fieldset><legend>Retrait ou livraison</legend><div class="opts">' + radio("delivery", DELIVERY, form.delivery) + "</div></fieldset>" +
      '<fieldset><legend>Paiement</legend><div class="opts">' + radio("payment", PAYMENT, form.payment) + "</div></fieldset>" +
      '<fieldset><legend>Tes coordonnées</legend><div class="form-grid">' +
      '<div class="field"><label for="co-name">Nom</label><input class="input" id="co-name" name="name" autocomplete="name" value="' + esc(form.name) + '"></div>' +
      '<div class="field"><label for="co-phone">Téléphone</label><input class="input" id="co-phone" name="phone" inputmode="tel" autocomplete="tel" placeholder="034 12 345 67" value="' + esc(form.phone) + '"></div>' +
      '<div class="field full" id="co-place-wrap"' + (form.delivery === "tana" || form.delivery === "province" ? "" : " hidden") + '><label for="co-place">Quartier ou ville</label><input class="input" id="co-place" name="place" placeholder="Ex. Analakely, Toamasina" value="' + esc(form.place) + '"></div>' +
      '<div class="field full"><label for="co-note">Note pour l\'atelier (facultatif)</label><input class="input" id="co-note" name="note" value="' + esc(form.note) + '"></div></div></fieldset>' +
      '<div class="totals" id="totals"></div>' +
      '<p class="hint" id="co-error" role="alert"></p>' +
      '<a class="btn btn-primary btn-lg btn-block" id="co-wa" target="_blank" rel="noopener">' + I.whatsapp + "Commander sur WhatsApp</a>" +
      '<button class="btn btn-block" type="submit" id="co-pay"></button>' +
      '<p class="note-demo">Démonstration : le paiement est simulé, aucun débit n\'est effectué.</p></form></div>';
    refresh();
  }

  function refresh() {
    var t = totals();
    var el = $("#totals"); if (!el) return;
    el.innerHTML = "<div><span>Sous-total</span><span>" + A.fmtAr(t.sub) + "</span></div>" +
      "<div><span>Livraison</span><span>" + (t.feeKnown ? (t.fee ? A.fmtAr(t.fee) : "Gratuit") : "Sur devis") + "</span></div>" +
      '<div class="grand"><span>Total</span><span class="price">' + A.fmtAr(t.total) + "</span></div>" +
      (form.payment === "Acompte" ? '<div><span>À payer maintenant (20 %)</span><b class="mono">' + A.fmtAr(t.now) + "</b></div>" : "");
    $("#co-wa").href = A.waLink(waText());
    var pay = $("#co-pay");
    if (form.payment === "Espèces") { pay.hidden = true; }
    else {
      pay.hidden = false;
      var m = form.payment === "Acompte" ? "l'acompte" : form.payment;
      pay.innerHTML = "Payer " + A.fmtAr(t.now) + (form.payment === "Acompte" ? " d'acompte" : " avec " + esc(m));
    }
    A.store("ekg-checkout", form);
  }

  /* ---------- Événements ---------- */
  root.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-dq]"))) {
      var l = A.cart.lines().filter(function (x) { return x.key === b.getAttribute("data-key"); })[0];
      if (l) { A.cart.setQty(l.key, l.qty + parseInt(b.getAttribute("data-dq"), 10)); render(); }
    } else if ((b = e.target.closest("[data-remove]"))) {
      A.cart.remove(b.getAttribute("data-remove")); render(); A.toast("Article retiré");
    } else if ((b = e.target.closest("[data-addups]"))) {
      var lines = A.cart.lines().map(function (x) { if (x.key === b.getAttribute("data-addups")) x.ups = true; return x; });
      A.cart.save(lines); render(); A.toast("Pack anti-délestage ajouté");
    } else if (e.target.closest("#cart-clear")) {
      A.cart.clear(); render();
    }
  });
  root.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-qkey]")) { A.cart.setQty(t.getAttribute("data-qkey"), parseInt(t.value, 10) || 1); render(); return; }
    if (t.name === "delivery") { form.delivery = t.value; $("#co-place-wrap").hidden = !(t.value === "tana" || t.value === "province"); }
    if (t.name === "payment") form.payment = t.value;
    refresh();
  });
  root.addEventListener("input", function (e) {
    var t = e.target;
    if (["name", "phone", "place", "note"].indexOf(t.name) > -1) { form[t.name] = t.value; refresh(); }
  });
  root.addEventListener("submit", function (e) {
    if (e.target.id !== "checkout") return;
    e.preventDefault();
    var phone = form.phone.replace(/\s/g, "");
    var err = $("#co-error");
    if (!form.name.trim() || !/^(\+?261|0)3[23478]\d{7}$/.test(phone)) {
      err.textContent = "Indique ton nom et un numéro malgache valide (ex. 034 12 345 67) pour payer.";
      err.style.color = "var(--danger)";
      $(form.name.trim() ? "#co-phone" : "#co-name").focus();
      return;
    }
    err.textContent = "";
    openPay();
  });

  /* ---------- Paiement simulé ---------- */
  var modal = $("#pay-modal"), body = $("#pay-body");
  function openPay() {
    var t = totals(), op = form.payment === "Acompte" ? "MVola" : form.payment;
    body.innerHTML = '<p class="kicker">Paiement ' + esc(op) + '</p><h2 id="pay-title">Confirme sur ton téléphone</h2>' +
      '<div class="recap"><div><span>Montant</span><b class="price">' + A.fmtAr(t.now) + "</b></div><div><span>Numéro</span><b>" + esc(form.phone) + "</b></div><div><span>Bénéficiaire</span><b>Ekinox Gamos</b></div></div>" +
      '<p class="muted">Dans la version réelle, une demande de paiement arrive sur ton téléphone. Ici, saisis n\'importe quel code à 4 chiffres.</p>' +
      '<form id="pay-form" class="form-grid" novalidate><div class="field full"><label for="pay-code">Code de confirmation</label><input class="input" id="pay-code" inputmode="numeric" maxlength="4" placeholder="1234" style="font-family:var(--font-mono);letter-spacing:.3em;font-size:22px"></div>' +
      '<p class="hint full" id="pay-err" role="alert"></p><div class="btn-row full"><button class="btn btn-primary" type="submit">Valider le paiement</button><button class="btn" type="button" data-close>Annuler</button></div></form>' +
      '<p class="note-demo">Simulation de démonstration, aucun paiement réel.</p>';
    modal.showModal();
    $("#pay-code").focus();
    $("#pay-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!/^\d{4}$/.test($("#pay-code").value)) { $("#pay-err").textContent = "Le code doit contenir 4 chiffres."; $("#pay-err").style.color = "var(--danger)"; return; }
      var ref = "EKG-CMD-" + Math.floor(10000 + Math.random() * 90000);
      var msg = waText() + "\nPaiement effectué, réf. " + ref;
      var d = deliveryOf(form.delivery);
      body.innerHTML = '<p class="kicker">Commande confirmée</p><h2 id="pay-title">Merci ' + esc(form.name.split(" ")[0]) + " !</h2>" +
        '<p class="ref">' + ref + "</p>" +
        '<div class="recap"><div><span>Payé</span><b>' + A.fmtAr(t.now) + "</b></div><div><span>Reste à régler</span><b>" + A.fmtAr(t.total - t.now) + "</b></div><div><span>" + (d.price === 0 ? "Retrait" : "Livraison") + "</span><b>" + esc(d.label.replace(/^Retrait (au|à l') ?/, "")) + "</b></div></div>" +
        '<p class="muted">Tu reçois la confirmation sur WhatsApp. Pour un PC, le carnet d\'assemblage suit après le test de charge.</p>' +
        '<div class="btn-row"><a class="btn btn-primary" target="_blank" rel="noopener" href="' + A.waLink(msg) + '">' + I.whatsapp + 'Recevoir le récapitulatif</a><a class="btn" href="index.html">Retour à l\'accueil</a></div>' +
        '<p class="note-demo">Simulation de démonstration.</p>';
      A.cart.clear();
      render();
    });
  }
  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]") || e.target === modal) modal.close(); });

  render();
})();
