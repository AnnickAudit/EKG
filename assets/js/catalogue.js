/* Catalogue composants : catégories, recherche tolérante, filtres */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$, esc = A.esc;
  var p = A.params();
  var state = { cat: p.get("cat") || "", q: p.get("q") || "" };
  var qEl = $("#c-q"), maxEl = $("#c-max"), stockEl = $("#c-stock"), sortEl = $("#c-sort");
  qEl.value = state.q;

  function haystack(it) { return A.normalize(it.name + " " + (it.spec || "") + " " + A.catName(it.cat) + " " + (it.socket || "") + " " + (it.ramType || "")); }
  function matches(it, words) { var h = haystack(it); return words.every(function (w) { return h.indexOf(w) > -1; }); }

  function renderCats() {
    var counts = {};
    D.parts.forEach(function (it) { counts[it.cat] = (counts[it.cat] || 0) + 1; });
    $("#c-cats").innerHTML = '<li><button type="button" data-cat=""' + (state.cat ? "" : ' aria-pressed="true"') + ">Tout le catalogue<span>" + D.parts.length + "</span></button></li>" +
      D.categories.map(function (c) {
        return '<li><button type="button" data-cat="' + c.id + '"' + (state.cat === c.id ? ' aria-pressed="true"' : "") + ">" + esc(c.name) + "<span>" + (counts[c.id] || 0) + "</span></button></li>";
      }).join("");
  }

  function render() {
    var words = qEl.value.split(/\s+/).map(A.normalize).filter(Boolean);
    var max = parseInt(maxEl.value, 10);
    $("#c-max-out").textContent = max >= 7500000 ? "Sans limite" : A.fmtAr(max);
    var list = D.parts.filter(function (it) {
      return (!state.cat || it.cat === state.cat) && it.price <= max && (!stockEl.checked || A.stockTotal(it) > 0) && (!words.length || matches(it, words));
    });
    list.sort(function (a, b) {
      if (sortEl.value === "desc") return b.price - a.price;
      if (sortEl.value === "name") return a.name.localeCompare(b.name, "fr");
      return a.price - b.price;
    });

    /* Bandeau de catégorie */
    var cat = D.categories.filter(function (c) { return c.id === state.cat; })[0];
    $("#c-banner").innerHTML = cat && cat.photo
      ? '<div class="cat-banner">' + A.photo(cat.photo, "", { alt: "" }) + '<div class="cat-banner-in"><p class="eyebrow">Catégorie</p><h2>' + esc(cat.name) + '</h2><p class="muted">' + list.length + " référence" + (list.length > 1 ? "s" : "") + " · prix en Ariary TTC</p></div></div>"
      : "";

    /* PC de la gamme si la recherche les concerne */
    var pcs = words.length ? D.pcs.filter(function (pc) {
      var h = A.normalize("ekinox " + pc.name + " " + pc.line + " pc gamer " + Object.keys(pc.specs).map(function (k) { return pc.specs[k]; }).join(" "));
      return words.every(function (w) { return h.indexOf(w) > -1; });
    }) : [];
    $("#c-pcs").innerHTML = pcs.length ? '<p class="eyebrow">PC Ekinox correspondants</p><div class="pc-grid" style="margin-bottom:32px">' + pcs.map(function (pc) { return A.pcCard(pc); }).join("") + "</div>" : "";

    $("#c-grid").innerHTML = list.map(A.partCard).join("");
    $("#c-count").textContent = list.length + " produit" + (list.length > 1 ? "s" : "") + (qEl.value.trim() ? " pour « " + qEl.value.trim() + " »" : "");
    $("#c-empty").hidden = list.length > 0 || pcs.length > 0;
    $("#c-ask").href = A.waLink("Bonjour Ekinox Gamos, je cherche : " + (qEl.value.trim() || "un composant") + ". Est-ce disponible ?");

    var q = new URLSearchParams();
    if (state.cat) q.set("cat", state.cat);
    if (qEl.value.trim()) q.set("q", qEl.value.trim());
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  $("#c-cats").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.getAttribute("data-cat");
    renderCats(); render();
  });
  [qEl, maxEl, stockEl, sortEl].forEach(function (el) { el.addEventListener("input", render); });
  renderCats();
  render();
})();
