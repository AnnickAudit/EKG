/* Gamme PC */
(function () {
  "use strict";
  var A = window.EKGApp, D = window.EKG, $ = A.$;
  var budget = $("#f-budget"), out = $("#f-budget-out"), res = $("#f-res"), game = $("#f-game"), sort = $("#f-sort");

  game.innerHTML = '<option value="">Aucun</option>' + D.games.map(function (g) { return '<option value="' + g.id + '">' + A.esc(g.name) + "</option>"; }).join("");

  var p = A.params();
  if (p.get("budget")) budget.value = Math.min(13000000, Math.max(3000000, parseInt(p.get("budget"), 10) || 13000000));
  if (p.get("res")) res.value = p.get("res");
  if (p.get("jeu")) game.value = p.get("jeu");

  function render() {
    var max = parseInt(budget.value, 10);
    out.textContent = max >= 13000000 ? "Sans limite" : A.fmtAr(max);
    var g = game.value;
    var list = D.pcs.filter(function (pc) { return pc.price <= max && (!res.value || pc.res === res.value); });
    if (sort.value === "fps" && !g) sort.value = "asc";
    list.sort(function (a, b) {
      if (sort.value === "desc") return b.price - a.price;
      if (sort.value === "fps") return A.fpsFor(b, g) - A.fpsFor(a, g);
      return a.price - b.price;
    });
    $("#g-grid").innerHTML = list.map(function (pc) { return A.pcCard(pc, { game: g }); }).join("");
    $("#g-empty").hidden = list.length > 0;
    $("#g-count").textContent = list.length + " PC" + (list.length > 1 ? "" : "") + (g ? " · FPS estimés sur " + A.gameName(g) + " dans la définition de chaque machine" : "");
    var q = new URLSearchParams();
    if (max < 13000000) q.set("budget", max);
    if (res.value) q.set("res", res.value);
    if (g) q.set("jeu", g);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }
  [budget, res, game, sort].forEach(function (el) { el.addEventListener("input", render); });
  render();
})();
