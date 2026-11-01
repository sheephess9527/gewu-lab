/* 格物实验室 · 战役沙盘「纪录片 / 我来指挥 / 战场特效」增强层（cine.js） */
(function () {
  "use strict";
  const W = window.WAR; if (!W || !window.THREE) return;
  const $ = (s) => document.querySelector(s), PI = Math.PI;
  const stage = $("#stage"), mobile = matchMedia("(max-width: 860px)").matches;

  /* ---------- 数据 ---------- */
  const ART = ["cp", "jl", "gd", "cb", "fs", "tm", "gm", "cn", "hs"];
  const FLAG = [
    { qin: "秦", zhao: "赵", qiA: "秦", qiB: "秦" },
    { chu: "楚", wl: "秦", zh: "章", hou: "诸", zhao: "赵" },
    { yuan: "袁", yq: "袁", cao: "曹", cx: "曹" },
    { cao: "曹", cf: "曹", wu: "孙", liu: "刘", hg: "黄" },
    { qin: "秦", fr: "苻", lj: "秦", jin: "晋", liu: "刘" },
    { per: "波", atk: "波", imm: "波", gr: "希", sp: "斯", fleet: "波" },
    { pL: "波", pC: "波", pR: "波", dar: "王", ph: "马", mL: "马", alx: "亚" },
    { caC: "迦", caL: "迦", caR: "迦", cvL: "骑", cvR: "骑", ro: "罗", rcL: "骑", rcR: "骑" },
    { fleet: "诺", nInf: "诺", nCav: "骑", eng: "英", engP: "英" },
  ];
  const SIDE = { "--x-qin": 0, "--x-zhao": 1, "--x-chu": 0, "--x-qinj": 1, "--x-yuan": 1, "--x-cao": 0, "--x-wu": 1, "--x-shu": 1, "--x-fq": 0, "--x-jin": 1,
    "--x-gr": 0, "--x-pe": 1, "--x-mac": 0, "--x-pr": 1, "--x-ca": 0, "--x-ro": 1, "--x-nor": 0, "--x-eng": 1 };
  const NOFX = { fire: 1, yun: 1, gh: 1 };
  /* 主帅抉择：k = 进入第 k 阶段之前暂停；opts[i].h = 史实 */
  const DEC = [
    [{ k: 1, who: "赵孝成王", q: "韩国上党郡守冯亭不愿降秦，要把上党十七城献给赵国。接下这块地，就等于和秦国正面为敌。你接不接？",
       opts: [{ t: "接受上党", h: 1, r: "史实如此。赵王觉得白得十七城太划算，平阳君赵豹劝他“无故之利”必招祸，没被采纳。秦国随即兵锋直指长平。" },
         { t: "婉拒，劝冯亭另寻出路", r: "可以避开与秦正面冲突，但上党会落入秦手，秦军便能居高临下直逼赵国腹地。两难之中，赵王选了冒险。" }] },
     { k: 2, who: "赵孝成王", q: "廉颇筑垒坚守，三年不出战。秦国派人到处散布：“秦军只怕赵括当主将。”你会怎么办？",
       opts: [{ t: "换上赵括，主动出击", h: 1, r: "史实如此，这正中了秦国的反间计。蔺相如劝阻说赵括只会读父亲的兵书，不懂变通，赵王不听。" },
         { t: "继续信任廉颇，坚壁固守", r: "坚守能拖垮远道而来的秦军补给，这也是秦国最怕的局面。所以秦国才要用反间计逼赵国换将。" },
         { t: "增兵给廉颇，命他立刻决战", r: "仓促决战正合秦意。秦军善野战，赵军离开营垒反而失去依托。" }] }],
    [{ k: 2, who: "项羽", q: "楚军刚渡过漳水，对面是二十万秦军，身后诸侯援军都在观望。渡河后你怎么下令？",
       opts: [{ t: "沉船破釜，只带三天口粮", h: 1, r: "史实如此。“皆沉船，破釜甑，烧庐舍，持三日粮”，断绝退路，让士兵只能以一当十、拼死向前。" },
         { t: "保留船只辎重，留好退路", r: "稳妥，但楚军兵少，若士兵心存退意，很难冲垮兵力占优的秦军。" },
         { t: "按兵不动，等诸侯一起进攻", r: "诸侯军已经观望了很久，等下去只会让巨鹿城先陷落。" }] },
     { k: 3, who: "项羽", q: "王离军围着巨鹿城，粮食全靠章邯修的甬道运来。你第一刀砍向哪里？",
       opts: [{ t: "切断甬道，断秦军粮道", h: 1, r: "史实如此。楚军先“绝其甬道”，王离军断粮，再与秦军九战九捷，俘虏王离。" },
         { t: "直扑巨鹿城下的王离主阵", r: "正面硬碰兵力更多、粮草充足的围城秦军，代价会非常大。" },
         { t: "先攻棘原的章邯大营", r: "章邯军实力完整，打它会被王离军前后夹击。" }] }],
    [{ k: 1, who: "曹操", q: "袁绍派颜良围攻白马。你兵力远少于袁军，怎么救白马？",
       opts: [{ t: "声东击西：先佯装去延津渡河，再轻骑急救白马", h: 1, r: "史实如此，这是荀攸的计策。袁绍分兵西去延津，曹操轻骑突袭白马，关羽斩颜良，白马解围。" },
         { t: "全军直奔白马", r: "袁军以逸待劳、兵力占优，正面去救很可能被拖住甚至围歼。" },
         { t: "放弃白马，收缩防线", r: "保存兵力，但士气受挫，袁军可以从容渡河。" }] },
     { k: 4, who: "曹操", q: "两军相持，曹军粮草将尽。袁绍谋士许攸来投，说袁军粮草全囤在乌巢，守备松懈。你怎么做？",
       opts: [{ t: "亲率五千步骑，连夜奇袭乌巢", h: 1, r: "史实如此。曹操留曹洪守营，亲自夜袭乌巢、烧光袁军粮草，袁军军心大乱，随即溃败。" },
         { t: "怀疑许攸诈降，按兵不动", r: "谨慎，但曹军粮尽，拖下去必败。抓住稍纵即逝的战机，正是以少胜多的关键。" },
         { t: "只派一员偏将去试探", r: "兵少将轻，一旦被袁军援兵截住就前功尽弃。曹操是亲自上阵、速战速决。" }] }],
    [{ k: 1, who: "孙权", q: "曹操送来书信：“今治水军八十万众，方与将军会猎于吴。”江东群臣多数主张投降。你怎么选？",
       opts: [{ t: "联合刘备，抗击曹操", h: 1, r: "史实如此。鲁肃、周瑜力主抗曹，诸葛亮出使江东，孙刘结成联盟。周瑜分析曹军不习水战、远来疲惫、后方不稳。" },
         { t: "投降曹操，保住江东", r: "张昭等人这样主张。但对孙权而言，投降意味着失去江东基业。" }] },
     { k: 3, who: "周瑜", q: "曹军战船首尾相连，泊在北岸。部将黄盖献策。你怎么打？",
       opts: [{ t: "黄盖诈降，借东南风火攻", h: 1, r: "史实如此。黄盖率装满柴草、灌上油的船诈降，靠近后点火，风急火猛，曹军船只和岸上营寨都被烧毁。" },
         { t: "集中战船正面决战", r: "联军兵少，正面决战难有胜算。火攻是专打曹军船只连在一起的弱点。" },
         { t: "坚守不出，等曹军疫病自退", r: "曹军确有疫病，但拖延可能让曹操稳住荆州，联军会更被动。" }] }],
    [{ k: 2, who: "谢石、谢玄", q: "被俘的晋将朱序偷偷报信：“秦兵还没到齐，赶快打败它的前锋，就能挫其锐气。”你怎么做？",
       opts: [{ t: "派刘牢之率五千精兵夜袭洛涧", h: 1, r: "史实如此。北府兵夜渡洛涧，大破秦军前锋，晋军士气大振，水陆并进到淝水东岸。" },
         { t: "据城固守，等秦军先动", r: "等秦军八十多万人全部到齐，晋军兵力悬殊就更难打了。" }] },
     { k: 4, who: "苻坚", q: "晋军派人说：请秦军稍稍后撤，让我们渡过淝水决战。你答应吗？",
       opts: [{ t: "答应后撤，想趁晋军半渡时出击", h: 1, r: "史实如此。苻坚想“半渡而击”，可大军一退就收不住阵脚，朱序在阵后大喊“秦军败了”，秦军全线溃逃。" },
         { t: "拒绝后撤，依托淝水坚守", r: "大军不动，晋军很难渡河。兵多不等于能灵活指挥，后撤这一步让庞大的秦军乱了套。" }] }],
    [{ k: 1, who: "列奥尼达", q: "你只有约七千人，对面是成十万计的波斯大军。在哪里迎战？",
       opts: [{ t: "扼守温泉关最窄处，方阵轮番迎敌", h: 1, r: "史实如此。窄道让波斯人数优势施展不开，希腊重装步兵密集方阵轮流上阵，接连两天击退了波斯攻势。" },
         { t: "到开阔平原上摆开阵势决战", r: "平原上波斯骑兵和弓箭手能从四面包抄，希腊联军很快会被淹没。" }] },
     { k: 3, who: "列奥尼达", q: "当地人带波斯精兵走山间小道绕到了你身后，关口就要被前后夹击。你怎么办？",
       opts: [{ t: "遣散大部分联军，亲率斯巴达人殿后", h: 1, r: "史实如此。列奥尼达让其他城邦军队撤走，自己和斯巴达三百勇士及部分盟军留下死战，为希腊赢得了时间。" },
         { t: "全军撤退", r: "能保存兵力，但波斯大军会长驱直入，希腊海军和各城邦来不及准备。" },
         { t: "全军死守关口", r: "七千人会被一同包围歼灭，希腊将损失大量兵力。" }] }],
    [{ k: 1, who: "亚历山大", q: "大流士的兵力是你的好几倍，战场已被铲平便于战车冲锋。老将帕米尼奥建议夜袭。你怎么打？",
       opts: [{ t: "拒绝夜袭，白天斜线向右推进", h: 1, r: "史实如此，相传他说“我不偷取胜利”。马其顿军斜向右翼移动，把波斯军拉离铲平的战场，引对方阵线出现空隙。" },
         { t: "采纳建议，连夜偷袭", r: "夜战容易自乱阵脚，即使侥幸取胜，大流士也可能说败在偷袭，不肯认输。" }] },
     { k: 2, who: "亚历山大", q: "波斯左翼骑兵向你的右侧包抄，中央阵线被拉开一道缺口。你怎么做？",
       opts: [{ t: "亲率伙友骑兵，楔形突入缺口，直取大流士", h: 1, r: "史实如此。骑兵楔形阵直插波斯中军，大流士驾车逃跑，波斯大军随之溃散。" },
         { t: "继续在右翼和波斯骑兵缠斗", r: "会错过稍纵即逝的缺口，而兵力劣势的马其顿左翼可能先被压垮。" }] }],
    [{ k: 1, who: "汉尼拔", q: "罗马重步兵人数几乎是你的两倍，排成又深又密的阵。你怎么布阵？",
       opts: [{ t: "中路向前凸成新月，较弱的步兵居中，精锐放两翼", h: 1, r: "史实如此。凸出的中路诱罗马军猛攻，非洲精锐步兵藏在两翼等待时机，骑兵也集中在两侧。" },
         { t: "平均排成一条直线", r: "直线阵会被兵力更多、纵深更厚的罗马步兵正面压垮。" }] },
     { k: 3, who: "汉尼拔", q: "中路步步后退，罗马军拼命往里挤，阵形越来越密。下一步怎么做？",
       opts: [{ t: "两翼精锐向内夹击，骑兵绕到背后封口", h: 1, r: "史实如此。罗马军被三面夹住，迦太基骑兵击溃罗马骑兵后从背后合围，形成军事史上著名的“两翼包围”。" },
         { t: "全线向前反冲", r: "放弃了诱敌深入的优势，人数少的迦太基军正面对冲难占便宜。" }] }],
    [{ k: 1, who: "哈罗德", q: "你刚在北方斯坦福桥击败挪威入侵者，诺曼人又在南方登陆。你怎么办？",
       opts: [{ t: "急行军南下，尽快迎战", h: 1, r: "史实如此。哈罗德带着疲惫之师赶回南方，很多援兵还在路上。" },
         { t: "在伦敦休整，集结更多援军", r: "能以逸待劳、兵力更充足，有史家认为这样胜算更大。" }] },
     { k: 3, who: "威廉", q: "英格兰盾墙在山脊上屹立不倒，诺曼骑兵一次次冲锋都被击退。你怎么破阵？",
       opts: [{ t: "佯装败退，引英军冲下山再回身反击", h: 1, r: "据诺曼史料记载如此。部分英军追下山坡离开盾墙，被诺曼骑兵回身围歼，盾墙渐渐出现缺口。" },
         { t: "继续正面强攻山脊", r: "仰攻严整的盾墙伤亡巨大，此前的几轮冲锋已经证明了这一点。" }] }],
  ];

  /* ---------- 样式 ---------- */
  const css = `
  .cine-b{height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--x-line);background:var(--x-wash);color:var(--x-text);font:600 13px/1 var(--x-serif,serif);white-space:nowrap;display:inline-flex;align-items:center;gap:6px;flex:0 0 auto}
  .cine-b:hover{border-color:var(--x-acc)} .cine-b[aria-pressed="true"]{background:var(--x-acc);border-color:var(--x-acc);color:#fff}
  .cine-b:disabled{opacity:.4} .cine-b.cine-ico{width:36px;padding:0;justify-content:center}
  .cine-bar{position:absolute;left:0;right:0;height:0;background:#000;z-index:4;transition:height .6s ease;pointer-events:none}
  .cine-bar.t{top:0}.cine-bar.b{bottom:0}
  #stage.cine-on .cine-bar{height:7%} #stage.cine-on #ov,#stage.cine-on #sub,#stage.cine-on #hud{opacity:0;pointer-events:none}
  #ov,#sub,#hud{transition:opacity .4s}
  .cine-cap{position:absolute;left:50%;bottom:calc(7% + 12px);transform:translateX(-50%);width:min(760px,calc(100% - 24px));text-align:center;z-index:5;pointer-events:none;opacity:0;transition:opacity .35s}
  .cine-cap.on{opacity:1}
  .cine-cap i{display:inline-block;font:600 12px/1 var(--x-mono,monospace);letter-spacing:.08em;color:#f2b544;margin-bottom:6px;font-style:normal}
  .cine-cap p{margin:0;color:#fff;font:500 clamp(15px,2.2vw,21px)/1.55 var(--x-serif,serif);text-shadow:0 2px 10px rgba(0,0,0,.9),0 0 2px #000}
  .cine-top{position:absolute;top:calc(7% + 10px);right:12px;z-index:6;display:none;gap:8px;align-items:center}
  #stage.cine-on .cine-top{display:flex}
  .cine-top span{font:600 12px var(--x-mono,monospace);color:#fff;text-shadow:0 1px 6px #000}
  .cine-top button{height:32px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.45);color:#fff;font:600 13px var(--x-serif,serif);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  .cine-card{position:absolute;inset:0;z-index:7;display:grid;place-items:center;background:#000 center/cover no-repeat;opacity:0;pointer-events:none;transition:opacity .9s}
  .cine-card.on{opacity:1;pointer-events:auto}
  .cine-card::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.25) 45%,rgba(0,0,0,.82))}
  .cine-card .in{position:relative;text-align:center;padding:0 22px;max-width:760px;color:#fff;align-self:end;margin-bottom:9%}
  .cine-card small{display:block;font:600 12px var(--x-mono,monospace);letter-spacing:.3em;color:#f2b544;margin-bottom:10px}
  .cine-card h2{margin:0;font:700 clamp(30px,6vw,60px)/1.1 var(--x-serif,serif);letter-spacing:.06em;text-shadow:0 4px 24px rgba(0,0,0,.8)}
  .cine-card p{margin:10px 0 0;font:500 clamp(13px,1.8vw,16px)/1.6 var(--x-serif,serif);color:rgba(255,255,255,.88);text-shadow:0 2px 8px #000}
  .cine-card .btns{margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .cine-card .btns button,.cine-dec .go{height:40px;padding:0 18px;border-radius:999px;border:0;background:#fff;color:#1d1d1f;font:600 14px var(--x-serif,serif)}
  .cine-card .btns button.ghost{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.4)}
  .cine-card .score{display:inline-block;margin-top:12px;padding:6px 14px;border-radius:999px;background:rgba(242,181,68,.18);border:1px solid rgba(242,181,68,.6);color:#f2b544;font:600 13px var(--x-serif,serif)}
  .cine-card.anim h2{animation:cineIn 1.6s cubic-bezier(.2,.7,.2,1) both}
  @keyframes cineIn{from{opacity:0;letter-spacing:.5em;filter:blur(6px)}to{opacity:1;letter-spacing:.06em;filter:none}}
  .cine-dec{position:absolute;inset:0;z-index:8;display:grid;place-items:center;padding:12px;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .4s}
  .cine-dec.on{opacity:1;pointer-events:auto}
  .cine-dec .box{width:min(520px,100%);max-height:100%;overflow:auto;border-radius:22px;background:rgba(20,22,28,.9);color:#f5f5f7;border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .cine-dec .art{height:86px;background:center/cover no-repeat;border-radius:22px 22px 0 0;position:relative}
  .cine-dec .art::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(20,22,28,.95));border-radius:inherit}
  .cine-dec .bd{padding:4px 18px 18px;margin-top:-30px;position:relative}
  .cine-dec .who{font:600 12px var(--x-mono,monospace);letter-spacing:.15em;color:#f2b544}
  .cine-dec h3{margin:6px 0 12px;font:600 16px/1.6 var(--x-serif,serif)}
  .cine-dec .op{display:block;width:100%;text-align:left;margin:0 0 8px;padding:11px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f5f5f7;font:500 14px/1.5 var(--x-serif,serif)}
  .cine-dec .op:hover:not(:disabled){border-color:#2ec4b6}
  .cine-dec .op:disabled{cursor:default}
  .cine-dec .op.pick{border-color:#fff}
  .cine-dec .op.hist{border-color:#f2b544;background:rgba(242,181,68,.14)}
  .cine-dec .op.hist::after{content:"史实";float:right;margin-left:8px;font:600 11px var(--x-mono,monospace);color:#1d1d1f;background:#f2b544;border-radius:6px;padding:2px 6px}
  .cine-dec .res{margin:6px 0 12px;font:500 14px/1.7 var(--x-serif,serif);color:rgba(245,245,247,.9)}
  .cine-dec .res b{color:#f2b544}
  .cine-dec .go{display:block;margin-left:auto}
  @media (max-width:860px){.cine-b{padding:0 10px}.cine-dec h3{font-size:15px}.cine-card .in{margin-bottom:12%}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- DOM ---------- */
  const ctrl = $(".x-ctrl");
  const bDoc = btn('<span aria-hidden="true">🎬</span><span class="tx">纪录片</span>', "纪录片模式：旁白配音 + 镜头跟随");
  const bCmd = btn('<span aria-hidden="true">⚔</span><span class="tx">我来指挥</span>', "我来指挥：关键时刻由你做主帅决策");
  const bSnd = btn("🔇", "战场音效"); bSnd.classList.add("cine-ico");
  ctrl.insertBefore(bSnd, $("#tl")); ctrl.insertBefore(bCmd, bSnd); ctrl.insertBefore(bDoc, bCmd);
  function btn(h, label) { const b = document.createElement("button"); b.type = "button"; b.className = "cine-b"; b.innerHTML = h; b.title = label; b.setAttribute("aria-label", label); b.setAttribute("aria-pressed", "false"); return b; }
  const mk = (cls, html) => { const d = document.createElement("div"); d.className = cls; if (html) d.innerHTML = html; stage.appendChild(d); return d; };
  mk("cine-bar t"); mk("cine-bar b");
  const cap = mk("cine-cap", "<i></i><p></p>");
  const top = mk("cine-top", '<span id="cineAct"></span><button type="button" id="cineSkip">跳过 ›</button><button type="button" id="cineExit">退出 ✕</button>');
  const card = mk("cine-card", '<div class="in"></div>');
  const dec = mk("cine-dec", '<div class="box"><div class="art"></div><div class="bd"></div></div>');

  /* ---------- 工具 ---------- */
  const battle = () => { const S = W.SC(); for (let k = 0; k < 9; k++) if (W.CH[k].sc === S) return k; return -1; };
  const live = () => W.CH[W.cur].live && !W.CH[W.cur].quiz;
  const art = (k) => `art/${ART[k]}.jpg`;
  ART.forEach((a) => { const im = new Image(); im.src = `art/${a}.jpg`; }); // 预载
  function centroidOf(A) {
    const cnt = Math.ceil(A.N * A.ratio); if (cnt < 1) return null;
    const P = A.pos, step = Math.max(1, Math.floor(cnt / 48)); let x = 0, y = 0, z = 0, m = 0;
    for (let i = 0; i < cnt; i += step) { x += P[i * 3]; y += P[i * 3 + 1]; z += P[i * 3 + 2]; m++; }
    x /= m; y /= m; z /= m; let r = 0;
    for (let i = 0; i < cnt; i += step) r = Math.max(r, Math.hypot(P[i * 3] - x, P[i * 3 + 2] - z));
    return { x, y, z, r, cnt };
  }
  function randPt(A, out) { const cnt = Math.ceil(A.N * A.ratio), i = (Math.random() * cnt) | 0, P = A.pos; out.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); return out; }

  /* ---------- 粒子特效（烟尘 / 火星 / 箭雨 / 旗帜） ---------- */
  const fxG = new THREE.Group(); W.scene.add(fxG);
  function pool(n, add) {
    const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), colr = new Float32Array(n * 3), al = new Float32Array(n), sz = new Float32Array(n);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(colr, 3));
    g.setAttribute("alpha", new THREE.BufferAttribute(al, 1)); g.setAttribute("size", new THREE.BufferAttribute(sz, 1));
    const m = new THREE.ShaderMaterial({ uniforms: { map: { value: W.dotTex }, scale: { value: 300 } }, transparent: true, depthWrite: false,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: "attribute float alpha; attribute float size; attribute vec3 color; varying float vA; varying vec3 vC; uniform float scale;" +
        "void main(){ vA=alpha; vC=color; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=size*scale/max(1.0,-mv.z); gl_Position=projectionMatrix*mv; }",
      fragmentShader: "uniform sampler2D map; varying float vA; varying vec3 vC; void main(){ vec4 t=texture2D(map,gl_PointCoord); gl_FragColor=vec4(vC,t.a*vA); if(gl_FragColor.a<0.01) discard; }" });
    const p = new THREE.Points(g, m); p.frustumCulled = false; fxG.add(p);
    return { n, g, pos, colr, al, sz, m, p, vel: new Float32Array(n * 3), life: new Float32Array(n), max: new Float32Array(n), s0: new Float32Array(n), a0: new Float32Array(n), grow: new Float32Array(n), next: 0 };
  }
  const smoke = pool(mobile ? 260 : 420, false), spark = pool(mobile ? 200 : 340, true);
  const tc = new THREE.Color();
  function emit(P, x, y, z, vx, vy, vz, life, size, alpha, color, grow) {
    const i = P.next; P.next = (P.next + 1) % P.n; const b = i * 3;
    P.pos[b] = x; P.pos[b + 1] = y; P.pos[b + 2] = z; P.vel[b] = vx; P.vel[b + 1] = vy; P.vel[b + 2] = vz;
    P.life[i] = life; P.max[i] = life; P.s0[i] = size; P.a0[i] = alpha; P.grow[i] = grow || 0; tc.set(color); tc.toArray(P.colr, b);
  }
  function stepPool(P, dt, drag, rise) {
    for (let i = 0; i < P.n; i++) {
      if (P.life[i] <= 0) { P.al[i] = 0; continue; }
      P.life[i] -= dt; const b = i * 3, k = Math.max(0, P.life[i] / P.max[i]);
      P.vel[b] *= drag; P.vel[b + 1] = P.vel[b + 1] * drag + rise * dt; P.vel[b + 2] *= drag;
      P.pos[b] += P.vel[b] * dt; P.pos[b + 1] += P.vel[b + 1] * dt; P.pos[b + 2] += P.vel[b + 2] * dt;
      P.al[i] = P.a0[i] * Math.min(1, k * 3) * (k < 1 ? Math.min(1, (1 - k) * 8) : 1); P.sz[i] = P.s0[i] * (1 + P.grow[i] * (1 - k));
    }
    ["position", "color", "alpha", "size"].forEach((a) => (P.g.attributes[a].needsUpdate = true));
  }
  /* 箭雨 */
  const NA = mobile ? 90 : 160, aPos = new Float32Array(NA * 6), aG = new THREE.BufferGeometry();
  aG.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
  const aM = new THREE.LineBasicMaterial({ color: 0xd8d2c0, transparent: true, opacity: 0.85 });
  const aL = new THREE.LineSegments(aG, aM); aL.frustumCulled = false; fxG.add(aL);
  const arrows = []; for (let i = 0; i < NA; i++) arrows.push({ t: 1, d: 1, a: new THREE.Vector3(), b: new THREE.Vector3(), h: 10 });
  let aNext = 0;
  function shoot(a, b) { const A = arrows[aNext]; aNext = (aNext + 1) % NA; A.a.copy(a); A.b.copy(b); A.t = 0; A.d = 0.9 + Math.random() * 0.5; A.h = 6 + a.distanceTo(b) * 0.32; }
  const cnt = (r) => Math.floor(r) + (Math.random() < r % 1 ? 1 : 0);
  const _p = new THREE.Vector3(), _q = new THREE.Vector3();
  function arcAt(A, t, o) { o.lerpVectors(A.a, A.b, t); o.y += Math.sin(t * PI) * A.h; return o; }
  function stepArrows(dt) {
    for (let i = 0; i < NA; i++) {
      const A = arrows[i], b = i * 6;
      if (A.t >= 1) { aPos.fill(0, b, b + 6); continue; }
      A.t = Math.min(1, A.t + dt / A.d); arcAt(A, A.t, _p); arcAt(A, Math.max(0, A.t - 0.045), _q);
      aPos[b] = _q.x; aPos[b + 1] = _q.y; aPos[b + 2] = _q.z; aPos[b + 3] = _p.x; aPos[b + 4] = _p.y; aPos[b + 5] = _p.z;
      if (A.t >= 1 && Math.random() < 0.35) emit(smoke, _p.x, _p.y, _p.z, 0, 1.2, 0, 0.6, 1.6, 0.35, W.isDark() ? "#8a7d66" : "#9b8a6a", 1);
    }
    aG.attributes.position.needsUpdate = true;
  }
  /* 旗帜 */
  const flagG = new THREE.Group(); fxG.add(flagG); let flags = [];
  function flagTex(ch, color) {
    const c = document.createElement("canvas"); c.width = 96; c.height = 128; const x = c.getContext("2d");
    x.fillStyle = W.isDark() ? "#d9d3c3" : "#3a3328"; x.fillRect(10, 6, 5, 118);
    x.fillStyle = color; x.beginPath(); x.moveTo(15, 10); x.lineTo(90, 10); x.lineTo(78, 40); x.lineTo(90, 70); x.lineTo(15, 70); x.closePath(); x.fill();
    x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 2; x.stroke();
    x.fillStyle = "#fff"; x.font = '700 40px "Songti SC","Noto Serif SC","STSong",serif'; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(ch, 47, 41);
    const t = new THREE.CanvasTexture(c); return t;
  }
  function buildFlags() {
    flagG.children.forEach((s) => { s.material.map.dispose(); s.material.dispose(); }); flagG.clear(); flags = [];
    const k = battle(); if (k < 0) return; const map = FLAG[k];
    for (const A of W.armies) {
      const ch = map[A.id]; if (!ch) continue;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flagTex(ch, W.col(A.c)), transparent: true, depthWrite: false }));
      s.center.set(0.12, 0.04); s.scale.set(4.6, 6.1, 1); s.renderOrder = 6; flagG.add(s); flags.push({ s, A, ph: Math.random() * 6 });
    }
  }

  /* ---------- 音效（WebAudio 合成，无外部文件） ---------- */
  let AC = null, master = null, noise = null, wind = null, roar = null, roarG = null, soundOn = false;
  function audioInit() {
    if (AC) { if (AC.state === "suspended") AC.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    AC = new C(); master = AC.createGain(); master.gain.value = 0.55; master.connect(AC.destination);
    noise = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const loop = (freq, type, q, g) => { const s = AC.createBufferSource(); s.buffer = noise; s.loop = true; const f = AC.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const G = AC.createGain(); G.gain.value = g; s.connect(f); f.connect(G); G.connect(master); s.start(); return G; };
    wind = loop(380, "lowpass", 0.5, 0.035); roarG = loop(520, "bandpass", 0.6, 0);
  }
  function env(g, t, a, peak, dcy) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy); }
  function drum(strong) {
    if (!soundOn || !AC) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(strong ? 95 : 80, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.3);
    env(g, t, 0.005, strong ? 0.9 : 0.55, 0.45); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.6);
    const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g2 = AC.createGain(); s.buffer = noise; f.type = "lowpass"; f.frequency.value = 260;
    env(g2, t, 0.003, 0.35, 0.14); s.connect(f); f.connect(g2); g2.connect(master); s.start(t, Math.random()); s.stop(t + 0.2);
  }
  function clash() {
    if (!soundOn || !AC) return; const t = AC.currentTime, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noise; f.type = "bandpass"; f.frequency.value = 2200 + Math.random() * 2600; f.Q.value = 4; env(g, t, 0.002, 0.18 + Math.random() * 0.12, 0.05 + Math.random() * 0.08);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 1.5); s.stop(t + 0.2);
    const o = AC.createOscillator(), g2 = AC.createGain(); o.type = "triangle"; o.frequency.value = 1700 + Math.random() * 1800; env(g2, t, 0.001, 0.05, 0.12); o.connect(g2); g2.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function whoosh() {
    if (!soundOn || !AC) return; const t = AC.currentTime, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noise; f.type = "bandpass"; f.Q.value = 2; f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2600, t + 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + 0.9);
  }
  function horn() {
    if (!soundOn || !AC) return; const t = AC.currentTime, f = AC.createBiquadFilter(), g = AC.createGain(); f.type = "lowpass"; f.frequency.value = 760; f.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.11, t + 0.25); g.gain.setValueAtTime(0.11, t + 0.9); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    [146.8, 220, 293.7].forEach((fr, i) => { const o = AC.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(fr * 0.97, t); o.frequency.linearRampToValueAtTime(fr, t + 0.3); o.detune.value = i * 4; o.connect(f); o.start(t); o.stop(t + 1.8); });
  }
  function setSound(v) {
    soundOn = v; bSnd.textContent = v ? "🔊" : "🔇"; bSnd.setAttribute("aria-pressed", v);
    if (v) audioInit(); if (AC) master.gain.setTargetAtTime(v ? 0.55 : 0, AC.currentTime, 0.1);
    if (!v && window.speechSynthesis) speechSynthesis.cancel();
  }
  bSnd.addEventListener("click", () => setSound(!soundOn));

  /* ---------- 每帧：特效 + 镜头导演 + 音效调度 ---------- */
  let armiesWas = null, drumT = 0, drumN = 0, volleyT = 0, holdUser = 0, darkWas = null;
  const cen = new Map();
  W.R.domElement.addEventListener("pointerdown", () => { holdUser = W.clock + 5; });
  W.R.domElement.addEventListener("wheel", () => { holdUser = W.clock + 5; }, { passive: true });
  const vC = new THREE.Vector3(), vP = new THREE.Vector3(), tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
  window.WAR_FRAME = function (dt) {
    const dark = W.isDark();
    if (dark !== darkWas) { darkWas = dark; spark.m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending; spark.m.needsUpdate = true; aM.color.set(dark ? 0xd8d2c0 : 0x3b3530); buildFlags(); }
    if (W.armies !== armiesWas) { armiesWas = W.armies; buildFlags(); }
    const on = W.CH[W.cur].live; fxG.visible = !!on;
    if (!on) return;
    cen.clear(); let engaged = 0, marching = 0, standing = 0;
    for (const A of W.armies) { if (A.ratio > 0.02) { const c = centroidOf(A); if (c) cen.set(A, c); } }
    /* 旗帜 */
    for (const f of flags) {
      const c = cen.get(f.A); f.s.visible = !!c && f.A.ratio > 0.05;
      if (c) { f.s.position.set(c.x, W.H(c.x, c.z) + 2.5, c.z); f.s.scale.x = 4.6 * (1 + 0.07 * Math.sin(W.clock * 4 + f.ph)); f.s.material.opacity = f.A.st === "溃逃" ? 0.45 : 1; }
    }
    /* 发射 */
    const dustC = dark ? "#6b5f4c" : "#b3a07c", smokeC = dark ? "#5a5550" : "#8c8379";
    for (const [A, c] of cen) {
      if (NOFX[A.id]) continue; const side = SIDE[A.c];
      if (A.st === "行军" || A.st === "溃逃") {
        marching++; const n = (A.st === "溃逃" ? 14 : 7) * dt * Math.min(2, c.cnt / 200);
        for (let e = 0, m = cnt(n); e < m; e++) { randPt(A, tmpA); emit(smoke, tmpA.x, tmpA.y + 0.4, tmpA.z, (Math.random() - 0.5) * 2, 1.5 + Math.random(), (Math.random() - 0.5) * 2, 2.2 + Math.random(), 3.2, 0.3, dustC, 1.4); }
      } else if (A.st === "对峙" || A.st === "观望") standing++;
      if ((A.st === "交战" || A.st === "包围") && side !== undefined) {
        let best = null, bd = 1e9;
        for (const [B, d] of cen) { if (SIDE[B.c] === undefined || SIDE[B.c] === side || NOFX[B.id]) continue; const dd = Math.hypot(d.x - c.x, d.z - c.z); if (dd < bd) { bd = dd; best = [B, d]; } }
        if (!best || bd > 110) continue; engaged++;
        const [B, d] = best, rate = (mobile ? 22 : 36) * dt;
        for (let e = 0, m = cnt(rate); e < m; e++) {
          let bp = null, bdd = 1e9; for (let t = 0; t < 8; t++) { randPt(A, tmpA); const q = Math.hypot(tmpA.x - d.x, tmpA.z - d.z); if (q < bdd) { bdd = q; bp = tmpB.copy(tmpA); } }
          const sc = Math.random() < 0.5 ? (dark ? "#ffd27a" : "#e07a1f") : (dark ? "#ff8a4c" : "#c4401c");
          emit(spark, bp.x, bp.y + 0.6, bp.z, (Math.random() - 0.5) * 9, 3 + Math.random() * 6, (Math.random() - 0.5) * 9, 0.35 + Math.random() * 0.35, 1.1, 0.95, sc, -0.4);
          if (Math.random() < 0.3) emit(smoke, bp.x, bp.y + 0.8, bp.z, (Math.random() - 0.5) * 1.5, 1.8 + Math.random(), (Math.random() - 0.5) * 1.5, 2.6 + Math.random() * 1.5, 3.6, 0.32, smokeC, 1.8);
          if (soundOn && Math.random() < 0.18) clash();
        }
        if (side === 0 || side === 1) { if (!A._vt) A._vt = Math.random() * 2; A._vt -= dt; if (A._vt <= 0 && bd > 12) { A._vt = 1.6 + Math.random() * 1.6; const n = mobile ? 8 : 14; for (let i = 0; i < n; i++) shoot(randPt(A, tmpA).clone(), randPt(B, tmpB).clone()); whoosh(); } }
      }
    }
    stepPool(smoke, dt, 0.97, 0.15); stepPool(spark, dt, 0.94, -16); stepArrows(dt);
    /* 战鼓与喊杀 */
    if (soundOn && AC) {
      roarG.gain.setTargetAtTime(engaged ? 0.07 + Math.min(0.05, engaged * 0.015) : 0, AC.currentTime, 0.6);
      const iv = engaged ? 0.42 : marching ? 0.78 : standing ? 1.5 : 0;
      if (iv) { drumT -= dt; if (drumT <= 0) { drumT = iv; drum(drumN++ % 4 === 0); } }
    }
    /* 镜头导演 */
    if (doc.on && W.clock > holdUser) direct(dt, engaged);
  };
  function direct(dt, engaged) {
    const cam = W.cam, ctl = W.ctl; let x = 0, z = 0, m = 0, dist;
    if (doc.intro) { vC.set(0, 0, 0); dist = 165 - Math.min(30, doc.introT * 4); }
    else {
      for (const [, c] of cen) { x += c.x * c.cnt; z += c.z * c.cnt; m += c.cnt; }
      if (!m) return; x /= m; z /= m; let R = 0; for (const [, c] of cen) R = Math.max(R, Math.hypot(c.x - x, c.z - z) + c.r);
      vC.set(x, W.H(x, z), z); dist = Math.max(60, Math.min(220, R * 1.75 + 34)) * (engaged ? 0.88 : 1);
    }
    dist *= Math.max(1, 1.25 / cam.aspect);
    const az = PI / 2 + 0.32 * Math.sin(W.clock * 0.06) + doc.azOff, pol = engaged && !doc.intro ? 1.0 : 0.82;
    vP.set(vC.x + dist * Math.sin(pol) * Math.cos(az), vC.y + dist * Math.cos(pol), vC.z + dist * Math.sin(pol) * Math.sin(az));
    const k = 1 - Math.exp(-dt * 0.9); ctl.target.lerp(vC, k); cam.position.lerp(vP, k);
  }
  window.addEventListener("war:stage", (e) => { if (e.detail.prev >= 0 && e.detail.s !== e.detail.prev) horn(); });
  window.addEventListener("war:chapter", () => { buildFlags(); if (doc.on && !doc.internal) stopDoc(); syncBtns(); });
  buildFlags();

  /* ---------- 旁白 ---------- */
  let voice = null;
  function pickVoice() { if (!window.speechSynthesis) return; const v = speechSynthesis.getVoices(); voice = v.find((x) => /zh[-_]CN/i.test(x.lang) && /female|Ting|Xiaoxiao|Google/i.test(x.name)) || v.find((x) => /zh[-_]CN/i.test(x.lang)) || v.find((x) => /^zh/i.test(x.lang)) || null; }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function sleep(ms) { return new Promise((r) => { const id = setTimeout(r, ms); doc.waits.push(() => { clearTimeout(id); r(); }); }); }
  function speak(text) {
    const est = 900 + text.length * 210;
    if (!soundOn || !window.speechSynthesis || !voice && !speechSynthesis.getVoices().length) return sleep(Math.max(2200, est * 0.9));
    return new Promise((res) => {
      let done = false; const fin = () => { if (!done) { done = true; clearTimeout(t); res(); } };
      const u = new SpeechSynthesisUtterance(text); u.lang = "zh-CN"; if (voice) u.voice = voice; u.rate = 1.02; u.pitch = 0.95;
      u.onend = fin; u.onerror = fin; const t = setTimeout(fin, est * 1.8 + 3000); doc.waits.push(() => { speechSynthesis.cancel(); fin(); });
      speechSynthesis.speak(u);
    });
  }
  function caption(chip, text) { cap.querySelector("i").textContent = chip || ""; cap.querySelector("p").textContent = text || ""; cap.classList.toggle("on", !!text); }
  async function say(chip, text) { caption(chip, text); await speak(text); }
  const sentences = (t) => (t.match(/[^。！？]+[。！？”]*/g) || [t]).map((s) => s.trim()).filter(Boolean);

  /* ---------- 纪录片 / 指挥流程 ---------- */
  const doc = { on: false, cmd: false, token: 0, waits: [], intro: false, introT: 0, azOff: 0, internal: false, score: 0, total: 0, skip: null };
  function flush() { const w = doc.waits; doc.waits = []; w.forEach((f) => f()); }
  function syncBtns() {
    const ok = live(); bDoc.disabled = bCmd.disabled = !ok;
    bDoc.setAttribute("aria-pressed", doc.on && !doc.cmd); bCmd.setAttribute("aria-pressed", doc.on && doc.cmd);
  }
  function stopDoc() {
    doc.token++; doc.on = false; doc.intro = false; flush(); if (window.speechSynthesis) speechSynthesis.cancel();
    stage.classList.remove("cine-on"); caption("", ""); card.classList.remove("on"); dec.classList.remove("on"); syncBtns();
  }
  $("#cineExit").addEventListener("click", stopDoc);
  $("#cineSkip").addEventListener("click", () => flush());
  ["#tl", "#bPlay", "#bSPrev", "#bSNext"].forEach((s) => $(s).addEventListener("click", () => { if (doc.on) stopDoc(); }, true));
  bDoc.addEventListener("click", () => (doc.on && !doc.cmd ? stopDoc() : startDoc(false)));
  bCmd.addEventListener("click", () => (doc.on && doc.cmd ? stopDoc() : startDoc(true)));

  async function startDoc(cmd) {
    if (!live()) return; stopDoc();
    if (!soundOn) setSound(true); else audioInit();
    if (window.speechSynthesis) { try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* iOS 解锁 */ } }
    const tk = ++doc.token, alive = () => tk === doc.token; Object.assign(doc, { on: true, cmd, score: 0, total: 0, azOff: 0 });
    syncBtns(); stage.classList.add("cine-on"); W.setAuto(false); W.goStage(0);
    const k = battle(), C = W.CH[W.cur], S = W.SC(), n = C.stages.length, act = $("#cineAct");
    /* 片头 */
    doc.intro = true; doc.introT = 0; const iv = setInterval(() => { doc.introT += 0.1; if (doc.intro) W.T = 0; }, 100);
    card.style.backgroundImage = `url(${art(k)})`;
    card.querySelector(".in").innerHTML = `<small>${cmd ? "我 来 指 挥" : "第 " + (W.cur + 1) + " 章"}</small><h2>${C.name}</h2><p>${C.meta}</p>`;
    card.classList.remove("anim"); void card.offsetWidth; card.classList.add("anim", "on"); act.textContent = "序幕"; horn();
    await sleep(600); if (!alive()) return clearInterval(iv);
    await speak(`${C.name}。${C.meta.replace(/·/g, "，").replace(/前 (\d+) 年/, "公元前$1年").replace(/(\d+) 年/, "公元$1年")}。`); await sleep(900);
    if (!alive()) return clearInterval(iv);
    card.classList.remove("on");
    for (const s of sentences(C.bg)) { if (!alive()) return clearInterval(iv); await say("背景", s); await sleep(250); }
    doc.intro = false; clearInterval(iv); if (!alive()) return;
    /* 各幕 */
    const D = DEC[k] || [];
    for (let s = 0; s < n; s++) {
      const d = cmd && D.find((x) => x.k === s);
      if (d) { const ok = await decide(d, k); if (!alive()) return; doc.total++; if (ok) doc.score++; }
      W.goStage(s); const t0 = performance.now(); act.textContent = `第 ${s + 1} 幕 / ${n}`;
      const chip = `第 ${s + 1} 幕 · ${C.stages[s]}`;
      for (const line of S.subs[s] || []) { if (!alive()) return; await say(chip, line); await sleep(300); }
      const need = (W.DUR * 0.8 * 1000) / Math.max(0.25, W.speed || 1), left = need - (performance.now() - t0);
      if (left > 0) await sleep(left); if (!alive()) return;
    }
    /* 片尾 */
    caption("", ""); act.textContent = "终章";
    card.style.backgroundImage = `url(${art(k)})`;
    const sc = cmd && doc.total ? `<span class="score">你与史实决策一致 ${doc.score} / ${doc.total}</span>` : "";
    card.querySelector(".in").innerHTML = `<small>历 史 意 义</small><h2>${C.name}</h2>${C.sig.map((x) => `<p>${x}</p>`).join("")}${sc}
      <div class="btns"><button type="button" data-a="again">再看一遍</button><button type="button" class="ghost" data-a="next">下一场战役 ›</button><button type="button" class="ghost" data-a="exit">退出</button></div>`;
    card.classList.remove("anim"); void card.offsetWidth; card.classList.add("anim", "on");
    card.querySelector(".btns").onclick = (e) => {
      const a = e.target.closest("button"); if (!a) return; const m = a.dataset.a;
      if (m === "exit") stopDoc(); else if (m === "again") startDoc(cmd);
      else { const keep = cmd; doc.internal = true; W.setChapter(W.cur + 1); doc.internal = false; stopDoc(); if (live()) startDoc(keep); }
    };
    for (const x of C.sig) { if (!alive()) return; await speak(x); }
  }

  function decide(d, k) {
    return new Promise((res) => {
      const tk = doc.token; let picked = false, ok = false;
      dec.querySelector(".art").style.backgroundImage = `url(${art(k)})`;
      const bd = dec.querySelector(".bd");
      bd.innerHTML = `<div class="who">主帅抉择 · 你是${d.who}</div><h3>${d.q}</h3>${d.opts.map((o, i) => `<button type="button" class="op" data-i="${i}">${String.fromCharCode(65 + i)}. ${o.t}</button>`).join("")}<div class="res" hidden></div><button type="button" class="go" hidden>继续 ▶</button>`;
      dec.classList.add("on"); caption("", ""); speak(`你是${d.who}。${d.q}`);
      const finish = () => { dec.classList.remove("on"); res(ok); };
      doc.waits.push(() => { if (tk !== doc.token) { dec.classList.remove("on"); res(false); } });
      bd.onclick = (e) => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.classList.contains("go")) { if (window.speechSynthesis) speechSynthesis.cancel(); finish(); return; }
        if (picked || !b.classList.contains("op")) return; picked = true;
        const i = +b.dataset.i, o = d.opts[i], hi = d.opts.findIndex((x) => x.h); ok = !!o.h;
        bd.querySelectorAll(".op").forEach((x, j) => { x.disabled = true; if (j === hi) x.classList.add("hist"); if (j === i) x.classList.add("pick"); });
        const r = bd.querySelector(".res"); r.hidden = false;
        r.innerHTML = ok ? `<b>和史实一致。</b>${o.r}` : `${o.r}<br><b>史实：</b>${d.opts[hi].r}`;
        bd.querySelector(".go").hidden = false; if (window.speechSynthesis) speechSynthesis.cancel();
        speak(ok ? "和史实一致。" + o.r : o.r + "史实是：" + d.opts[hi].r);
      };
    });
  }
  syncBtns();
})();
