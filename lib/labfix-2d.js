/* 格物实验室 · 画布标签防重叠（自动避让）
   在每一帧里记录已画文字的包围盒；新文字若与已有文字明显重叠，就上下挪开一档再画。
   带底色胶囊的标签（紧跟 fill 之后画的字）只登记不挪，免得字和底色错位。 */
(function () {
  var P = CanvasRenderingContext2D.prototype;
  if (P.__labfix) return; P.__labfix = 1;
  var frame = 0, raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) { return raf.call(window, function (t) { frame++; cb(t); }); };
  var S = new WeakMap();
  function st(ctx) {
    var c = ctx.canvas, s = S.get(c);
    if (!s || s.f !== frame) { s = { f: frame, boxes: [], keys: {}, fill: false }; S.set(c, s); }
    return s;
  }
  function reset(ctx) { S.set(ctx.canvas, { f: frame, boxes: [], keys: {}, fill: false }); }
  var oClear = P.clearRect, oFillRect = P.fillRect, oFill = P.fill, oFT = P.fillText, oST = P.strokeText;
  function big(ctx, x, y, w, h) {
    var m = ctx.getTransform ? ctx.getTransform() : null, sx = m ? Math.abs(m.a) : 1, sy = m ? Math.abs(m.d) : 1;
    return w * sx >= ctx.canvas.width * 0.9 && h * sy >= ctx.canvas.height * 0.9;
  }
  P.clearRect = function (x, y, w, h) { if (big(this, x, y, w, h)) reset(this); return oClear.apply(this, arguments); };
  P.fillRect = function (x, y, w, h) { if (big(this, x, y, w, h)) reset(this); else st(this).fill = true; return oFillRect.apply(this, arguments); };
  var oBP = P.beginPath, oRR = P.roundRect, oR = P.rect;
  P.beginPath = function () { this.__rr = false; return oBP.apply(this, arguments); };
  if (oRR) P.roundRect = function () { this.__rr = true; return oRR.apply(this, arguments); };
  P.rect = function () { this.__rr = true; return oR.apply(this, arguments); };
  P.fill = function () { st(this).fill = !!this.__rr; return oFill.apply(this, arguments); };
  ["moveTo", "lineTo", "arc", "stroke", "drawImage"].forEach(function (k) {
    var o = P[k]; if (!o) return;
    P[k] = function () { var s = S.get(this.canvas); if (s && s.f === frame && k !== "stroke") s.fill = false; return o.apply(this, arguments); };
  });
  function box(ctx, t, x, y) {
    var m = ctx.getTransform();
    if (Math.abs(m.b) > 1e-6 || Math.abs(m.c) > 1e-6) return null;
    var w = ctx.measureText(t).width, fs = parseFloat((/(\d+(?:\.\d+)?)px/.exec(ctx.font) || [0, 12])[1]);
    var h = fs * 1.15, a = ctx.textAlign, b = ctx.textBaseline;
    var dir = ctx.direction === "rtl";
    var x0 = (a === "center") ? x - w / 2 : (a === "right" || (a === "end" && !dir) || (a === "start" && dir)) ? x - w : x;
    var y0 = b === "top" || b === "hanging" ? y : b === "middle" ? y - h / 2 : b === "bottom" || b === "ideographic" ? y - h : y - fs * 0.85;
    return { x: m.a * x0 + m.e, y: m.d * y0 + m.f, w: w * Math.abs(m.a), h: h * Math.abs(m.d), sy: m.d, fh: h };
  }
  function ov(a, b) {
    var ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ix <= 1 || iy <= 1) return false;
    return ix * iy > 0.06 * Math.min(a.w * a.h, b.w * b.h);
  }
  function place(ctx, t, x, y) {
    var s = st(ctx), key = t + "|" + Math.round(x) + "|" + Math.round(y) + "|" + ctx.font;
    if (s.keys[key] != null) return s.keys[key];
    var bx = box(ctx, t, x, y), dy = 0;
    if (bx && t && String(t).trim()) {
      if (!s.fill) {
        var step = bx.fh + 2, cands = [0, -step, step, -2 * step, 2 * step];
        for (var i = 0; i < cands.length; i++) {
          var c = { x: bx.x, y: bx.y + cands[i] * bx.sy, w: bx.w, h: bx.h }, hit = false;
          if (c.y < 0 || c.y + c.h > ctx.canvas.height) { if (i) continue; }
          for (var j = 0; j < s.boxes.length; j++) if (ov(c, s.boxes[j])) { hit = true; break; }
          if (!hit) { dy = cands[i]; break; }
        }
      }
      s.boxes.push({ x: bx.x, y: bx.y + dy * bx.sy, w: bx.w, h: bx.h });
    }
    s.fill = false; s.keys[key] = dy; return dy;
  }
  /* 文字描一圈背景色的细边，压在曲线/网格上也看得清 */
  var bgCache = { f: -1, el: null, c: null };
  function bg(c) {
    if (bgCache.f === frame && bgCache.el === c) return bgCache.c;
    var e = c, col = null;
    while (e && e.nodeType === 1) { var v = getComputedStyle(e).backgroundColor; if (v && v !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(v)) { col = v; break; } e = e.parentElement; }
    bgCache = { f: frame, el: c, c: col || "#fff" }; return bgCache.c;
  }
  P.fillText = function (t, x, y) {
    var a = Array.prototype.slice.call(arguments), pill = st(this).fill, dy = place(this, t, x, y); a[2] = y + dy;
    if (!pill && t && String(t).trim()) {
      this.save(); this.strokeStyle = bg(this.canvas); this.lineWidth = 3; this.lineJoin = "round"; this.globalAlpha *= 0.9;
      oST.call(this, t, x, a[2], a[3]); this.restore();
    }
    return oFT.apply(this, a);
  };
  P.strokeText = function (t, x, y) { var a = Array.prototype.slice.call(arguments); a[2] = y + place(this, t, x, y); return oST.apply(this, a); };
})();
