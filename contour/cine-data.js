/* 等高线 · 纪录片 / 先猜后看 数据（CINE_SPEC 2026-11-01） */
(function () {
"use strict";
/* 驱动工具（等高线：章节面板按钮 + 自定义轨道相机全局 az/pol/dist/target/updateCam） */
const $ = (s) => document.querySelector(s);
let AN = 0;
const halt = () => { AN++; };
function clickIf(sel, want) { const b = $(sel); if (!b) return; if (want === undefined || (b.getAttribute("aria-pressed") === "true") !== want) b.click(); }
function setIn(sel, v) { const i = $(sel); if (!i) return; i.value = v; i.dispatchEvent(new Event("input", { bubbles: true })); }
function animIn(sel, a, b, ms) {
  const i = $(sel); if (!i) return; const tk = AN, t0 = performance.now(), stp = +i.step || 1;
  const f = (now) => { if (tk !== AN || !i.isConnected) return; const u = Math.min(1, (now - t0) / ms), e = u * u * (3 - 2 * u);
    i.value = Math.round((a + (b - a) * e) / stp) * stp; i.dispatchEvent(new Event("input", { bubbles: true })); if (u < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function camTo(v, ms, tgt) { // v=[az,pol,dist]
  const tk = AN, s = { az: az, pol: pol, dist: dist, t: target.clone() }, T = tgt ? new THREE.Vector3(tgt[0], tgt[1], tgt[2]) : new THREE.Vector3(0, 0.2, 0.6), t0 = performance.now(); ms = ms || 2200;
  const f = (now) => { if (tk !== AN) return; const u = Math.min(1, (now - t0) / ms), q = u * u * (3 - 2 * u);
    az = s.az + (v[0] - s.az) * q; pol = s.pol + (v[1] - s.pol) * q; dist = s.dist + (v[2] - s.dist) * q; target.lerpVectors(s.t, T, q); updateCam(); if (u < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
const PERSP = [-0.6, 1.0, 13], TOP = [0, 0.12, 14], SOUTH = [0, 1.25, 12];
const st = (title, lines, go, ms) => ({ title, lines, ms: ms || 6000, go() { halt(); go && go(); } });
const ask = (before, q, opts) => ({ before, who: "预测", q, opts: opts.map((o) => ({ t: o[0], h: o[1] ? 1 : 0, r: o[2] })) });
const CHS = [
  { name: "认识等高线地形图", meta: "把立体的山，压成平面上的一圈圈线",
    bg: "一张纸怎么画出一座山的高低起伏？地理学家的答案，是等高线。",
    sig: ["等高线是海拔相同的各点连成的闭合曲线；本图等高距 100 米。", "分层设色：绿色低、黄褐色中、白色高；垂直夸张只改变观感，不改变海拔。"],
    stages: [
      st("一座山区", ["这是一座虚拟的山区：三座山峰，两条支流，", "西南角还有一片湖泊。"], () => { clickIf("#sw-map", true); clickIf("#sw-lab", true); setIn("#ex", 2); camTo(PERSP); }, 5500),
      st("从天空俯视", ["升到正上方往下看，立体的山被压平，", "一圈圈闭合的曲线，就是等高线。"], () => camTo(TOP, 2500), 6500),
      st("垂直夸张", ["把垂直方向拉伸，起伏一目了然。", "但真实海拔一点没变，只是看起来更陡。"], () => { camTo(PERSP, 2000); animIn("#ex", 2, 4, 4000); }, 6500),
      st("分层设色", ["颜色也有讲究：绿色低，黄褐色中，白色最高，", "这叫分层设色。"], () => animIn("#ex", 4, 2, 3000), 6000),
      st("地形部位", ["山峰、鞍部、山脊、山谷、陡崖、盆地，", "这些地形部位，接下来逐章拆解。"], () => camTo(SOUTH, 2500), 6500),
    ],
    asks: [
      ask(1, "从正上方俯视这座山，会看到什么样的线？", [["一圈圈闭合的曲线", 1, "海拔相同的点连成闭合曲线，就是等高线。"], ["一条条平行直线", 0, "山体四周都在升高，等高线围成闭合的圈。"]]),
      ask(2, "把垂直夸张从 2 倍调到 4 倍，山峰的真实海拔会变吗？", [["会变高", 0, "垂直夸张只是放大显示比例。"], ["不变，只是看起来更陡", 1, "垂直夸张改变的是观感，海拔数值不变。"]]),
    ] },
  { name: "等高线的形成", meta: "水平面截切 · 垂直投影",
    bg: "等高线不是凭空画出来的，它是一刀一刀切出来的。",
    sig: ["间隔相等的水平面截切地表，交线垂直投影到同一平面，就是等高线地形图。", "同线等高、同图等距、闭合曲线、一般不相交（陡崖处重合）。"],
    stages: [
      st("一刀水平面", ["用一个水平面去切山体，", "亮黄色的交线上，每一点的海拔都相同。"], () => { $("#c2-rst") && $("#c2-rst").click(); camTo(PERSP); animIn("#c2-h", 200, 900, 4500); }, 6500),
      st("逐层切割", ["从 0 米起，每升高 100 米切一刀，", "每一刀都在山上留下一条交线。"], () => $("#c2-cut").click(), 8000),
      st("垂直投影", ["把这些交线垂直落到同一个平面上，", "就得到了等高线地形图。"], () => $("#c2-proj").click(), 5500),
      st("同线等高", ["同一条等高线上，各点海拔都相等。"], () => clickIf('#c2-tags [data-f="same"]'), 5000),
      st("同图等距", ["相邻两条等高线的高差处处相等，", "这幅图的等高距是 100 米。"], () => clickIf('#c2-tags [data-f="equal"]'), 6000),
      st("闭合与不相交", ["等高线都是闭合曲线，有的在图幅外闭合；", "它们一般互不相交，只在陡崖处重合。"], () => clickIf('#c2-tags [data-f="cross"]'), 7000),
    ],
    asks: [
      ask(1, "每升高 100 米切一刀，一路切到山顶，最后会得到什么？", [["一组间隔 100 米的等高线", 1, "每个水平面留下一条交线，合起来就是一组等高线。"], ["只有一条等高线", 0, "每一刀都会留下一条交线。"]]),
      ask(5, "两条等高线有没有可能重合？", [["不可能", 0, "在陡崖处，多条等高线会重合。"], ["在陡崖处会重合", 1, "陡崖近乎垂直，水平投影后多条等高线叠在一起。"]]),
    ] },
  { name: "海拔与相对高度", meta: "海平面起算 · 两地之差",
    bg: "说一座山有多高，先要问：从哪里量起？",
    sig: ["海拔是地面某点高出海平面的垂直距离；相对高度 = 海拔高 − 海拔低。", "由等高线只能读出海拔范围；相对高度范围用「大减小、小减大」。"],
    stages: [
      st("海平面", ["蓝色半透明的平面，是海平面，", "海拔就从这里起算。"], () => { window.C3 && C3.demo([]); clickIf("#c3-ans", false); camTo(SOUTH, 2200); }, 5500),
      st("A 点海拔", ["把主峰选为 A 点，", "蓝色虚线就是它的海拔：高出海平面的垂直距离。"], () => { C3.demo([[4.0, 6.9]]); camTo([-0.35, 1.1, 11], 2000); }, 6500),
      st("相对高度", ["再选湖边的 B 点，黄色竖线是两点的高差。", "相对高度，等于海拔高减海拔低。"], () => C3.demo([[4.0, 6.9], [1.7, 2.1]]), 7000),
      st("读出范围", ["图上只能读出范围：A 在 600 到 700 米之间，", "B 在 200 到 300 米之间，", "相对高度大于 300 米、小于 500 米。"], () => { C3.demo([]); clickIf("#c3-ans", true); camTo(TOP, 2200); }, 7500),
    ],
    asks: [
      ask(2, "主峰 A 与湖边 B 的相对高度怎么算？", [["A 的海拔减去 B 的海拔", 1, "相对高度 = 海拔高 − 海拔低。"], ["两点海拔相加", 0, "相对高度是两地海拔之差。"]]),
      ask(3, "A 位于 600～700 米之间，B 位于 200～300 米之间，两地相对高度的范围是？", [["大于 300 米、小于 500 米", 1, "大减小 700−200=500，小减大 600−300=300，取开区间。"], ["正好 400 米", 0, "只能读出范围，不能确定具体值。"], ["300～600 米", 0, "上限应是 700−200=500 米。"]]),
    ] },
  { name: "等高距与坡度", meta: "密陡 · 疏缓",
    bg: "同样爬升 100 米，有的路陡得要手脚并用，有的路像散步。",
    sig: ["相邻两条等高线的高差叫等高距，同一幅图等高距相同。", "等高线密集坡陡，稀疏坡缓；比较疏密要在同一幅图中。"],
    stages: [
      st("等高距 100 米", ["相邻两条等高线的高差，叫等高距。", "这幅图的等高距是 100 米。"], () => { clickIf('#c4-ci [data-ci="100"]'); clickIf("#c4-sl", false); clickIf("#c4-cmp", false); camTo(TOP, 2200); }, 5500),
      st("等高距 50 米", ["等高距改成 50 米，线条翻了一倍，", "地形表达更精细。"], () => clickIf('#c4-ci [data-ci="50"]'), 5500),
      st("等高距 200 米", ["改成 200 米，线条变得稀疏，", "很多细节被省略了。"], () => clickIf('#c4-ci [data-ci="200"]'), 5500),
      st("坡度着色", ["按坡度上色：红色陡，绿色缓。", "红色带上等高线挤在一起，绿色带上稀稀疏疏。"], () => { clickIf('#c4-ci [data-ci="100"]'); clickIf("#c4-sl", true); camTo(PERSP, 2200); }, 7000),
      st("两段坡比较", ["两段坡水平距离相同，", "A 穿过的等高线更多，升得更高，坡度更大。"], () => clickIf("#c4-cmp", true), 7000),
    ],
    asks: [
      ask(1, "等高距从 100 米改成 50 米，图上的等高线会怎样？", [["变多、变密", 1, "高差间隔变小，同样的山要画更多条线。"], ["变少、变疏", 0, "那是等高距变大的结果。"]]),
      ask(3, "同一幅图上，等高线密集的地方坡度怎样？", [["陡", 1, "水平距离短而高差相同，坡就陡——密陡疏缓。"], ["缓", 0, "等高线稀疏才是缓坡。"]]),
    ] },
  { name: "山顶与盆地", meta: "闭合等高线 · 示坡线",
    bg: "一组闭合的等高线，可能是山顶，也可能是盆地。怎么分？",
    sig: ["内高外低为山顶，内低外高为盆地。", "示坡线指向低处：山顶画在闭合线外侧，盆地画在内侧。"],
    stages: [
      st("闭合等高线", ["山顶和盆地，在图上都是一组闭合等高线。"], () => camTo(PERSP, 2000), 4500),
      st("山顶", ["数值内高外低，是山顶。", "示坡线画在闭合线外侧，指向低处。"], () => clickIf('#c5-go [data-k="peak"]'), 7000),
      st("盆地", ["数值内低外高，是盆地。", "示坡线画在闭合线内侧，指向圈内。"], () => clickIf('#c5-go [data-k="basin"]'), 7000),
      st("口诀", ["记住口诀：内高外低为山顶，", "内低外高为盆地。"], () => camTo(TOP, 2500), 5500),
    ],
    asks: [
      ask(1, "闭合等高线的数值内高外低，这里是山顶还是盆地？", [["山顶", 1, "中间高、四周低，是山顶。"], ["盆地", 0, "盆地是内低外高。"]]),
      ask(2, "盆地的示坡线画在闭合线的哪一侧？", [["外侧", 0, "外侧是山顶示坡线的位置。"], ["内侧", 1, "示坡线指向低处，盆地中间低，画在内侧指向圈内。"]]),
    ] },
  { name: "山脊与山谷", meta: "凸低为脊 · 凸高为谷",
    bg: "山脊分水，山谷集水，等高线的一个弯，就能分出两者。",
    sig: ["等高线凸向低处为山脊，凸向高处为山谷。", "山脊线是分水线，山谷线是集水线；河流流向与等高线凸出方向相反。"],
    stages: [
      st("看弯曲", ["等高线向同一方向弯曲时，", "凸向低处为山脊，凸向高处为山谷。"], () => { clickIf('#c6-go [data-k="bend"]', true); camTo(PERSP, 2000); }, 6500),
      st("山脊线", ["金色的山脊线是分水线，", "雨水落在这里，向两侧分流。"], () => clickIf('#c6-go [data-k="ridge"]', true), 6500),
      st("山谷线", ["蓝色的山谷线是集水线，", "雨水向它汇聚，常常发育成河流。"], () => clickIf('#c6-go [data-k="valley"]', true), 6500),
      st("河流流向", ["河流从高处流向低处，", "流向与等高线的凸出方向相反。"], () => clickIf('#c6-go [data-k="flow"]', true), 7000),
    ],
    asks: [
      ask(1, "等高线凸向低处的地方，是山脊还是山谷？", [["山脊", 1, "凸低为脊：山脊向低处伸出，等高线也跟着向低处凸。"], ["山谷", 0, "山谷处等高线凸向高处。"]]),
      ask(3, "河流流向与等高线弯曲方向有什么关系？", [["与等高线凸出方向相反", 1, "河流在山谷中，等高线凸向高处（上游），河水流向低处。"], ["与凸出方向相同", 0, "顺着凸出方向是往上游走。"]]),
    ] },
  { name: "鞍部", meta: "两山夹一低",
    bg: "两座山峰之间，总有一处像马鞍一样的低地。",
    sig: ["鞍部是相邻两个山顶之间相对低洼的部位，比两侧山顶低、比两侧山谷高。", "鞍部常是翻山公路的通道，也是两侧支流的源头。"],
    stages: [
      st("看鞍部", ["两座山顶之间相对低洼的地方，", "形似马鞍，叫鞍部。"], () => { clickIf('#c7-go [data-k="cross"]', false); clickIf('#c7-app [data-k="app"]', false); clickIf('#c7-go [data-k="look"]', true); }, 6500),
      st("十字剖面", ["沿山脊方向看，它是最低点；", "沿山谷方向看，它又是最高点。"], () => clickIf('#c7-go [data-k="cross"]', true), 7000),
      st("公路与源头", ["鞍部是翻越山岭的捷径，公路常从这里通过；", "它两侧，也是支流的源头。"], () => clickIf('#c7-app [data-k="app"]', true), 7000),
    ],
    asks: [
      ask(1, "鞍部比两侧的山顶低，那么比两侧的山谷呢？", [["更高", 1, "两山夹一低，两谷夹一高。"], ["更低", 0, "鞍部是山谷的源头，比山谷高。"]]),
      ask(2, "翻越山岭的公路，通常会选在哪里？", [["鞍部", 1, "鞍部海拔相对低，翻山路程短、坡度小。"], ["山顶", 0, "山顶最高，修路最难。"]]),
    ] },
  { name: "陡崖", meta: "多线重合 · 崖高计算",
    bg: "当许多条等高线挤到一起、重合成一条，那里就是一面悬崖。",
    sig: ["多条等高线重合处为陡崖。", "崖高 ΔH 满足 (n−1)d ≤ ΔH < (n+1)d，n 为重合条数，d 为等高距。"],
    stages: [
      st("看陡崖", ["镜头飞向东峰的东南翼：", "多条等高线重合在一起，那里就是陡崖。"], () => { clickIf('#c8-go [data-k="calc"]', false); clickIf('#c8-go [data-k="look"]', true); }, 6500),
      st("断层演示", ["这面陡崖由断层形成：", "下降盘一侧沉落，等高线越挤越近，最后重合成崖。"], () => $('#c8-go [data-k="demo"]').click(), 8000),
      st("崖高计算", ["若重合了 n 条等高线、等高距为 d，", "崖高满足：(n−1)d ≤ ΔH < (n+1)d。"], () => clickIf('#c8-go [data-k="calc"]', true), 7000),
    ],
    asks: [
      ask(2, "陡崖处重合了 n 条等高线，等高距为 d，崖高 ΔH 的范围是？", [["(n−1)d ≤ ΔH < (n+1)d", 1, "崖顶、崖底各可能多出不足一个等高距的高度。"], ["正好 nd", 0, "只能确定范围，崖顶崖底不一定恰在等高线上。"]]),
    ] },
  { name: "地形剖面图", meta: "定线 · 找交点 · 定海拔 · 连曲线",
    bg: "把山从中间切开，侧面看到的那条起伏曲线，就是地形剖面图。",
    sig: ["剖面图绘制四步：定剖面线、找交点、定海拔、连曲线。", "垂直夸张会夸大坡度；剖面图还可用来判断两点能否通视。"],
    stages: [
      st("剖面线", ["在地形图上画一条剖面线 AB，", "我们要看沿这条线的地势起伏。"], () => { clickIf("#c9-los", false); setIn("#c9-ex", 2); camTo([0.5, 1.05, 12], 2200); }, 5500),
      st("分步绘制", ["第一步定剖面线，第二步找它和各条等高线的交点；", "第三步按比例定出海拔，第四步用平滑曲线连起来。"], () => $("#c9-play").click(), 8000),
      st("垂直夸张", ["把纵向比例放大，", "起伏被夸张，坡度看起来更陡。"], () => animIn("#c9-ex", 2, 5, 4000), 6000),
      st("通视判断", ["两点之间如果有山体挡住视线，就不能通视，", "这是剖面图的经典考法。"], () => { animIn("#c9-ex", 5, 2, 2000); clickIf("#c9-los", true); }, 6500),
    ],
    asks: [
      ask(2, "把剖面图的垂直夸张调大，坡度会显得？", [["更陡", 1, "纵向被拉长，同样的坡看上去更陡。"], ["更缓", 0, "纵向放大只会让起伏更明显。"], ["不变", 0, "垂直比例改变会改变坡度的观感。"]]),
    ] },
];
CINE.init({
  host: document.querySelector(".tools"), before: document.getElementById("prev"),
  stage: document.getElementById("stage"), kind: "geo", hide: ["#float", "#readout", "#dock"],
  stopOn: ["#panel-body button", "#panel-body input", "#chaps button", "#prev", "#next", "#x-prev", "#x-next", "#x-sheet-list button", "#dock button", "#reset", "#x-reset"],
  chapter() { const i = window.LAB.cur, c = CHS[i]; return c ? Object.assign({ art: "art/" + (i + 1) + ".jpg" }, c) : null; },
  next() { window.LAB.go(window.LAB.cur + 1); },
  onStop() { halt(); },
});
(function () { // 宽屏放在顶栏工具区；手机放进画布下方工具行
  const w = document.querySelector(".cn-wrap"), mq = matchMedia("(max-width: 1023px)"), tools = document.querySelector(".tools"), mt = document.getElementById("x-mtools");
  if (!w) return;
  const place = () => { if (mq.matches) { w.style.flex = "1 1 100%"; mt.insertBefore(w, mt.firstChild); } else { w.style.flex = ""; tools.insertBefore(w, document.getElementById("prev")); } };
  place(); mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place);
})();
})();
