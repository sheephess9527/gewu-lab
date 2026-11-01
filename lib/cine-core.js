/* 格物实验室 · 纪录片 / 决策关卡 通用层（cine-core.js）
   用法：CINE.init({
     host: 按钮插入的容器元素, before: 插在该元素之前(可省),
     stage: 覆盖层容器元素（需 position:relative/absolute）,
     kind: "history" | "geo",            // 决定文案与音色
     hide: [选择器...],                   // 播放时淡出的元素
     stopOn: [选择器...],                 // 用户点这些元素时退出播放
     chapter(): 当前章节对象或 null（null = 本章不支持，按钮置灰），对象格式：
       { name, meta, bg, art, sig:[...],
         stages:[{ title, lines:[...], go(){...}, ms }],     // go 切到该阶段；ms 该阶段最少停留毫秒
         asks:[{ before: 阶段序号, who, q, opts:[{ t, h:1(正确/史实), r }] }] },
     next(): 切到下一章（可省）, onStart(), onStop()（可省）
   });  CINE.refresh() 在章节切换后调用（更新按钮状态，并在播放中退出）。 */
(function () {
  "use strict";
  const CINE = (window.CINE = {});
  let O = null, soundOn = false;
  let busy = false;
  const run = (f) => { busy = true; try { f && f(); } catch (e) { console.warn(e); } busy = false; };
  const doc = { on: false, cmd: false, token: 0, waits: [], score: 0, total: 0 };
  const T = {
    history: { cmd: "你来决策", cmdIco: "⚔", cmdTip: "关键时刻由你来做决定", tag: "史实", agree: "和史实一致。", answer: "史实：", score: "你与史实一致", head: "历史抉择 · 你是" },
    geo: { cmd: "先猜后看", cmdIco: "🎯", cmdTip: "先预测，再看演示揭晓", tag: "正确", agree: "猜对了！", answer: "答案：", score: "你猜对了", head: "先猜后看 · " },
  };
  const css = `
  .cn-b{height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--x-line,rgba(128,128,128,.35));background:var(--x-wash,transparent);color:inherit;font:600 13px/1 var(--x-serif,serif);white-space:nowrap;display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;cursor:pointer}
  .cn-b:hover{border-color:var(--x-acc,#0071e3)} .cn-b[aria-pressed="true"]{background:var(--x-acc,#0071e3);border-color:var(--x-acc,#0071e3);color:#fff}
  .cn-b:disabled{opacity:.4;cursor:default} .cn-b.ico{width:36px;padding:0;justify-content:center}
  .cn-wrap{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}
  .cn-ov{position:absolute;inset:0;pointer-events:none;z-index:40}
  .cn-bar{position:absolute;left:0;right:0;height:0;background:#000;transition:height .6s ease}
  .cn-bar.t{top:0}.cn-bar.b{bottom:0}
  .cn-on .cn-bar{height:7%}
  .cn-hide{opacity:0!important;pointer-events:none!important;transition:opacity .4s}
  .cn-cap{position:absolute;left:50%;bottom:calc(7% + 12px);transform:translateX(-50%);width:min(760px,calc(100% - 24px));text-align:center;opacity:0;transition:opacity .35s}
  .cn-cap.on{opacity:1}
  .cn-cap i{display:inline-block;font:600 12px/1 var(--x-mono,monospace);letter-spacing:.08em;color:#f2b544;margin-bottom:6px;font-style:normal;text-shadow:0 1px 6px #000}
  .cn-cap p{display:inline-block;padding:6px 12px;border-radius:12px;background:rgba(0,0,0,.42);margin:0;color:#fff;font:500 clamp(15px,2.2vw,21px)/1.55 var(--x-serif,serif);text-shadow:0 2px 10px rgba(0,0,0,.95),0 0 3px #000}
  .cn-top{position:absolute;top:calc(7% + 10px);right:12px;display:none;gap:8px;align-items:center;pointer-events:auto}
  .cn-on .cn-top{display:flex}
  .cn-top span{font:600 12px var(--x-mono,monospace);color:#fff;background:rgba(0,0,0,.5);padding:5px 9px;border-radius:999px}
  .cn-top button{height:32px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.45);color:#fff;font:600 13px var(--x-serif,serif);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  .cn-card{position:absolute;inset:0;display:grid;place-items:center;background:#000 center/cover no-repeat;opacity:0;pointer-events:none;transition:opacity .9s}
  .cn-card.on{opacity:1;pointer-events:auto}
  .cn-card::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.25) 45%,rgba(0,0,0,.84))}
  .cn-card .in{position:relative;text-align:center;padding:0 22px;max-width:760px;color:#fff;align-self:end;margin-bottom:9%}
  .cn-card small{display:block;font:600 12px var(--x-mono,monospace);letter-spacing:.3em;color:#f2b544;margin-bottom:10px}
  .cn-card h2{margin:0;color:#fff;font:700 clamp(28px,6vw,58px)/1.15 var(--x-serif,serif);letter-spacing:.06em;text-shadow:0 4px 24px rgba(0,0,0,.8)}
  .cn-card p{margin:10px 0 0;font:500 clamp(13px,1.8vw,16px)/1.6 var(--x-serif,serif);color:rgba(255,255,255,.9);text-shadow:0 2px 8px #000}
  .cn-card .btns{margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .cn-card .btns button,.cn-dec .go{height:40px;padding:0 18px;border-radius:999px;border:0;background:#fff;color:#1d1d1f;font:600 14px var(--x-serif,serif);cursor:pointer}
  .cn-card .btns button.ghost{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.4)}
  .cn-card .score{display:inline-block;margin-top:12px;padding:6px 14px;border-radius:999px;background:rgba(242,181,68,.18);border:1px solid rgba(242,181,68,.6);color:#f2b544;font:600 13px var(--x-serif,serif)}
  .cn-card.anim h2{animation:cnIn 1.6s cubic-bezier(.2,.7,.2,1) both}
  @keyframes cnIn{from{opacity:0;letter-spacing:.5em;filter:blur(6px)}to{opacity:1;letter-spacing:.06em;filter:none}}
  .cn-dec{position:absolute;inset:0;display:grid;place-items:center;padding:12px;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .4s}
  .cn-dec.on{opacity:1;pointer-events:auto}
  .cn-dec .box{width:min(520px,100%);max-height:100%;overflow:auto;border-radius:22px;background:rgba(20,22,28,.92);color:#f5f5f7;border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .cn-dec .art{height:86px;background:#222 center/cover no-repeat;border-radius:22px 22px 0 0;position:relative}
  .cn-dec .art::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(20,22,28,.95));border-radius:inherit}
  .cn-dec .bd{padding:4px 18px 18px;margin-top:-30px;position:relative}
  .cn-dec .who{font:600 12px var(--x-mono,monospace);letter-spacing:.15em;color:#f2b544}
  .cn-dec h3{margin:6px 0 12px;color:#f5f5f7;font:600 16px/1.6 var(--x-serif,serif)}
  .cn-dec .op{display:block;width:100%;text-align:left;margin:0 0 8px;padding:11px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f5f5f7;font:500 14px/1.5 var(--x-serif,serif);cursor:pointer}
  .cn-dec .op:hover:not(:disabled){border-color:#2ec4b6}
  .cn-dec .op:disabled{cursor:default}
  .cn-dec .op.pick{border-color:#fff}
  .cn-dec .op.ok{border-color:#f2b544;background:rgba(242,181,68,.14)}
  .cn-dec .op.ok::after{content:attr(data-tag);float:right;margin-left:8px;font:600 11px var(--x-mono,monospace);color:#1d1d1f;background:#f2b544;border-radius:6px;padding:2px 6px}
  .cn-dec .res{margin:6px 0 12px;font:500 14px/1.7 var(--x-serif,serif);color:rgba(245,245,247,.92)}
  .cn-dec .res b{color:#f2b544}
  .cn-dec .go{display:block;margin-left:auto}
  @media (max-width:860px){.cn-b{padding:0 10px}.cn-dec h3{font-size:15px}.cn-card .in{margin-bottom:12%}}`;

  /* ---------- 音效（WebAudio 合成） ---------- */
  let AC = null, master = null, noise = null, amb = null;
  function audioInit() {
    if (AC) { if (AC.state === "suspended") AC.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    AC = new C(); master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination);
    noise = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = AC.createBufferSource(); s.buffer = noise; s.loop = true; const f = AC.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = O.kind === "geo" ? 520 : 340; f.Q.value = 0.4;
    amb = AC.createGain(); amb.gain.value = 0; s.connect(f); f.connect(amb); amb.connect(master); s.start();
  }
  function env(g, t, a, p, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function drum() {
    if (!soundOn || !AC) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.3); env(g, t, 0.005, 0.8, 0.5); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.6);
  }
  function horn() {
    if (!soundOn || !AC) return; const t = AC.currentTime, f = AC.createBiquadFilter(), g = AC.createGain(); f.type = "lowpass"; f.frequency.value = 760; f.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.25); g.gain.setValueAtTime(0.1, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    [146.8, 220, 293.7].forEach((fr, i) => { const o = AC.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(fr * 0.97, t); o.frequency.linearRampToValueAtTime(fr, t + 0.3); o.detune.value = i * 4; o.connect(f); o.start(t); o.stop(t + 1.8); });
  }
  function chime(hi) {
    if (!soundOn || !AC) return; const t = AC.currentTime;
    (hi ? [659.3, 880, 1318.5] : [523.3, 659.3, 784]).forEach((fr, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.value = fr; env(g, t + i * 0.09, 0.01, 0.12, 1.4); o.connect(g); g.connect(master); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 1.6); });
  }
  function pluck() { // 古琴似的拨弦
    if (!soundOn || !AC) return; const t = AC.currentTime;
    [196, 293.7].forEach((fr, i) => { const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter(); o.type = "triangle"; o.frequency.value = fr; f.type = "lowpass"; f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(300, t + 1.2); env(g, t + i * 0.12, 0.004, 0.22, 1.6); o.connect(f); f.connect(g); g.connect(master); o.start(t + i * 0.12); o.stop(t + 2); });
  }
  const sfx = { open() { O.kind === "geo" ? chime(true) : horn(); }, step() { O.kind === "geo" ? chime(false) : (pluck(), drum()); }, good() { chime(true); }, bad() { if (!soundOn || !AC) return; drum(); } };
  function setSound(v) {
    soundOn = v; bSnd.textContent = v ? "🔊" : "🔇"; bSnd.setAttribute("aria-pressed", v);
    if (v) audioInit(); if (AC) { master.gain.setTargetAtTime(v ? 0.5 : 0, AC.currentTime, 0.1); amb.gain.setTargetAtTime(v && doc.on ? 0.03 : 0, AC.currentTime, 0.5); }
    if (!v && window.speechSynthesis) speechSynthesis.cancel();
  }

  /* ---------- 旁白 ---------- */
  let voice = null;
  function pickVoice() { const v = speechSynthesis.getVoices(); voice = v.find((x) => /zh[-_]CN/i.test(x.lang) && /Ting|Xiaoxiao|Google|female/i.test(x.name)) || v.find((x) => /zh[-_]CN/i.test(x.lang)) || v.find((x) => /^zh/i.test(x.lang)) || null; }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function sleep(ms) { return new Promise((r) => { const id = setTimeout(r, ms); doc.waits.push(() => { clearTimeout(id); r(); }); }); }
  function speak(text) {
    const est = 900 + text.length * 210;
    if (!soundOn || !window.speechSynthesis || (!voice && !speechSynthesis.getVoices().length)) return sleep(Math.max(2200, est * 0.9));
    return new Promise((res) => {
      let done = false; const fin = () => { if (!done) { done = true; clearTimeout(t); res(); } };
      const u = new SpeechSynthesisUtterance(text); u.lang = "zh-CN"; if (voice) u.voice = voice; u.rate = 1.02; u.pitch = 0.95;
      u.onend = fin; u.onerror = fin; const t = setTimeout(fin, est * 1.8 + 3000); doc.waits.push(() => { speechSynthesis.cancel(); fin(); });
      speechSynthesis.speak(u);
    });
  }
  const sentences = (t) => (String(t || "").match(/[^。！？]+[。！？”」]*/g) || []).map((s) => s.trim()).filter(Boolean);

  /* ---------- DOM ---------- */
  let bDoc, bCmd, bSnd, ov, cap, card, dec, act, hidden = [];
  function btn(h, label) { const b = document.createElement("button"); b.type = "button"; b.className = "cn-b"; b.innerHTML = h; b.title = label; b.setAttribute("aria-label", label); b.setAttribute("aria-pressed", "false"); return b; }
  function caption(chip, text) { cap.querySelector("i").textContent = chip || ""; cap.querySelector("p").textContent = text || ""; cap.classList.toggle("on", !!text); }
  async function say(chip, text) { caption(chip, text); await speak(text); }
  function flush() { const w = doc.waits; doc.waits = []; w.forEach((f) => f()); }
  function sync() { const ok = !!safeCh(); bDoc.disabled = bCmd.disabled = !ok; bDoc.setAttribute("aria-pressed", doc.on && !doc.cmd); bCmd.setAttribute("aria-pressed", doc.on && doc.cmd); }
  function safeCh() { try { const c = O.chapter(); return c && c.stages && c.stages.length ? c : null; } catch (e) { return null; } }
  function stop() {
    if (!doc.on && !ov.classList.contains("cn-on")) return sync();
    doc.token++; doc.on = false; flush(); if (window.speechSynthesis) speechSynthesis.cancel();
    ov.classList.remove("cn-on"); O.stage.classList.remove("cn-stage-on"); caption("", ""); card.classList.remove("on"); dec.classList.remove("on");
    hidden.forEach((e) => e.classList.remove("cn-hide")); hidden = [];
    if (AC) amb.gain.setTargetAtTime(0, AC.currentTime, 0.5); sync(); try { O.onStop && O.onStop(); } catch (e) { /* */ }
  }
  function showCard(img, html, anim) {
    card.style.backgroundImage = img ? `url("${img}")` : "linear-gradient(135deg,#0b1220,#1d2a3a)";
    card.querySelector(".in").innerHTML = html; card.classList.remove("anim"); void card.offsetWidth; if (anim !== false) card.classList.add("anim"); card.classList.add("on");
  }
  async function start(cmd) {
    const C = safeCh(); if (!C) return; stop();
    if (!soundOn) setSound(true); else audioInit();
    if (window.speechSynthesis) { try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* iOS 解锁 */ } }
    const tk = ++doc.token, alive = () => tk === doc.token, L = T[O.kind];
    Object.assign(doc, { on: true, cmd, score: 0, total: 0 }); sync();
    ov.classList.add("cn-on"); O.stage.classList.add("cn-stage-on");
    hidden = (O.hide || []).flatMap((s) => [...document.querySelectorAll(s)]); hidden.forEach((e) => e.classList.add("cn-hide"));
    if (AC && soundOn) amb.gain.setTargetAtTime(0.03, AC.currentTime, 0.8);
    try { O.onStart && O.onStart(); } catch (e) { /* */ }
    act.textContent = "序幕"; showCard(C.art, `<small>${cmd ? L.cmd.split("").join(" ") : "纪 录 片"}</small><h2>${C.name}</h2>${C.meta ? `<p>${C.meta}</p>` : ""}`); sfx.open();
    run(C.stages[0].go);
    await sleep(500); if (!alive()) return;
    await speak(C.name + "。" + (C.metaSay || "")); await sleep(800); if (!alive()) return;
    card.classList.remove("on");
    for (const s of sentences(C.bg)) { if (!alive()) return; await say("背景", s); await sleep(200); }
    const n = C.stages.length;
    for (let i = 0; i < n; i++) {
      if (!alive()) return; const st = C.stages[i];
      const a = cmd && (C.asks || []).find((x) => x.before === i);
      if (a) { const ok = await ask(a, C, L); if (!alive()) return; doc.total++; if (ok) doc.score++; }
      run(st.go);
      sfx.step(); const t0 = performance.now(); act.textContent = `第 ${i + 1} 幕 / ${n}`;
      const chip = `第 ${i + 1} 幕 · ${st.title}`;
      for (const line of st.lines || []) { if (!alive()) return; await say(chip, line); await sleep(260); }
      const left = (st.ms || 2500) - (performance.now() - t0); if (left > 0) await sleep(left);
    }
    if (!alive()) return;
    caption("", ""); act.textContent = "终章";
    const sc = cmd && doc.total ? `<span class="score">${L.score} ${doc.score} / ${doc.total}</span>` : "";
    showCard(C.art, `<small>${O.kind === "geo" ? "本 章 要 点" : "历 史 意 义"}</small><h2>${C.name}</h2>${(C.sig || []).map((x) => `<p>${x}</p>`).join("")}${sc}
      <div class="btns"><button type="button" data-a="again">再看一遍</button>${O.next ? '<button type="button" class="ghost" data-a="next">下一章 ›</button>' : ""}<button type="button" class="ghost" data-a="exit">退出</button></div>`);
    card.querySelector(".btns").onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return; const m = b.dataset.a;
      if (m === "exit") stop(); else if (m === "again") start(cmd);
      else { stop(); try { O.next(); } catch (err) { /* */ } setTimeout(() => { if (safeCh()) start(cmd); }, 400); }
    };
    sfx.good();
    for (const x of C.sig || []) { if (!alive()) return; await speak(x); }
  }
  function ask(a, C, L) {
    return new Promise((res) => {
      const tk = doc.token; let picked = false, ok = false;
      dec.querySelector(".art").style.backgroundImage = C.art ? `url("${C.art}")` : "";
      const bd = dec.querySelector(".bd");
      bd.innerHTML = `<div class="who">${L.head}${a.who || ""}</div><h3>${a.q}</h3>${a.opts.map((o, i) => `<button type="button" class="op" data-i="${i}" data-tag="${L.tag}">${String.fromCharCode(65 + i)}. ${o.t}</button>`).join("")}<div class="res" hidden></div><button type="button" class="go" hidden>继续 ▶</button>`;
      dec.classList.add("on"); caption("", ""); speak((O.kind === "history" && a.who ? `你是${a.who}。` : "") + a.q);
      doc.waits.push(() => { if (tk !== doc.token) { dec.classList.remove("on"); res(false); } });
      bd.onclick = (e) => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.classList.contains("go")) { if (window.speechSynthesis) speechSynthesis.cancel(); dec.classList.remove("on"); res(ok); return; }
        if (picked || !b.classList.contains("op")) return; picked = true;
        const i = +b.dataset.i, o = a.opts[i], hi = a.opts.findIndex((x) => x.h); ok = !!o.h;
        bd.querySelectorAll(".op").forEach((x, j) => { x.disabled = true; if (j === hi) x.classList.add("ok"); if (j === i) x.classList.add("pick"); });
        const r = bd.querySelector(".res"); r.hidden = false;
        r.innerHTML = ok ? `<b>${L.agree}</b>${o.r}` : `${o.r}<br><b>${L.answer}</b>${a.opts[hi].r}`;
        bd.querySelector(".go").hidden = false; ok ? sfx.good() : sfx.bad();
        if (window.speechSynthesis) speechSynthesis.cancel(); speak(ok ? L.agree + o.r : o.r + L.answer + a.opts[hi].r);
      };
    });
  }

  CINE.init = function (opts) {
    O = Object.assign({ kind: "history", hide: [], stopOn: [] }, opts); const L = T[O.kind];
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    if (getComputedStyle(O.stage).position === "static") O.stage.style.position = "relative";
    const wrap = document.createElement("span"); wrap.className = "cn-wrap";
    bDoc = btn('<span aria-hidden="true">🎬</span><span>纪录片</span>', "纪录片：旁白配音，自动讲完本章");
    bCmd = btn(`<span aria-hidden="true">${L.cmdIco}</span><span>${L.cmd}</span>`, L.cmdTip);
    bSnd = btn("🔇", "声音开关"); bSnd.classList.add("ico");
    wrap.append(bDoc, bCmd, bSnd); O.before ? O.host.insertBefore(wrap, O.before) : O.host.appendChild(wrap);
    ov = document.createElement("div"); ov.className = "cn-ov";
    ov.innerHTML = '<div class="cn-bar t"></div><div class="cn-bar b"></div><div class="cn-cap"><i></i><p></p></div><div class="cn-top"><span></span><button type="button" data-k="skip">跳过 ›</button><button type="button" data-k="exit">退出 ✕</button></div><div class="cn-card"><div class="in"></div></div><div class="cn-dec"><div class="box"><div class="art"></div><div class="bd"></div></div></div>';
    O.stage.appendChild(ov);
    cap = ov.querySelector(".cn-cap"); card = ov.querySelector(".cn-card"); dec = ov.querySelector(".cn-dec"); act = ov.querySelector(".cn-top span");
    ov.querySelector('[data-k="skip"]').onclick = flush; ov.querySelector('[data-k="exit"]').onclick = stop;
    bDoc.onclick = () => (doc.on && !doc.cmd ? stop() : start(false));
    bCmd.onclick = () => (doc.on && doc.cmd ? stop() : start(true));
    bSnd.onclick = () => setSound(!soundOn);
    document.addEventListener("click", (e) => { if (doc.on && !busy && O.stopOn.length && e.target.closest && e.target.closest(O.stopOn.join(",")) && !e.target.closest(".cn-ov,.cn-wrap")) stop(); }, true);
    sync();
  };
  CINE.refresh = function () { if (!O || busy) return; if (doc.on) stop(); else sync(); };
  CINE.isOn = () => doc.on;
})();
