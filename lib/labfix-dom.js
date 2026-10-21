/* 格物实验室 · 三维标签防重叠：标签不压讲解卡/读数/视角条；标签之间互相避让，实在放不下就先隐藏 */
(function () {
  var st = document.createElement("style");
  st.textContent = ".stage .float,.stage .readout,.stage .dock{z-index:4}.stage .lab{z-index:2;translate:0 var(--lf-dy,0px);transition:opacity .2s,translate .18s}";
  document.head.appendChild(st);
  function hit(a, b, m) { return a.left < b.right + m && a.right > b.left - m && a.top < b.bottom + m && a.bottom > b.top - m; }
  function loop() {
    var stage = document.querySelector(".stage");
    if (stage) {
      var obs = [].slice.call(stage.querySelectorAll(".float,.readout,.dock")).filter(function (e) { return e.offsetParent; }).map(function (e) { return e.getBoundingClientRect(); });
      var sr = stage.getBoundingClientRect();
      var labs = [].slice.call(stage.querySelectorAll(".lab")).filter(function (d) { return d.style.display !== "none" && d.style.opacity !== "0" && d.offsetParent; });
      var placed = [];
      labs.forEach(function (d) {
        var cur = parseFloat(d.style.getPropertyValue("--lf-dy")) || 0, r = d.getBoundingClientRect();
        var base = { left: r.left, right: r.right, top: r.top - cur, bottom: r.bottom - cur }, h = r.height + 4, ok = null;
        [0, -h, h, -2 * h, 2 * h].some(function (dy) {
          var c = { left: base.left, right: base.right, top: base.top + dy, bottom: base.bottom + dy };
          if (c.top < sr.top || c.bottom > sr.bottom) return false;
          if (obs.some(function (o) { return hit(c, o, 4); })) return false;
          if (placed.some(function (p) { return hit(c, p, 2); })) return false;
          ok = { dy: dy, c: c }; return true;
        });
        if (ok) { placed.push(ok.c); d.style.setProperty("--lf-dy", ok.dy + "px"); d.style.visibility = ""; }
        else d.style.visibility = "hidden";
      });
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
