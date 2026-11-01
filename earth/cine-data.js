/* 地球运动 · 纪录片 / 先猜后看 数据（依赖 index.html 主脚本的全局：cur go setPlay setPlay3 setPlay4 setPlay5 play3 play4 play5 playing camera controls tiltG loop resetView） */
(function () {
  "use strict";
  if (!window.CINE) return;
  var E = function (id) { return document.getElementById(id); };
  function setR(id, v) { var e = E(id); if (!e) return; e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }
  function clk(sel) { var e = document.querySelector(sel); if (e) e.click(); }
  function chk(id, on) { var e = E(id); if (e && e.checked !== !!on) e.click(); }
  /* 相机缓推 */
  var flyId = 0;
  function fly(pos, tgt, ms) {
    if (!camera || !controls) return;
    var id = ++flyId, p0 = camera.position.clone(), t0 = controls.target.clone(), s = performance.now();
    var P = new THREE.Vector3(pos[0], pos[1], pos[2]), T = new THREE.Vector3(tgt[0], tgt[1], tgt[2]);
    (function step() {
      if (id !== flyId) return;
      var k = Math.min(1, (performance.now() - s) / (ms || 2200)); k = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camera.position.lerpVectors(p0, P, k); controls.target.lerpVectors(t0, T, k); controls.update(); loop();
      if (k < 1) requestAnimationFrame(step);
    })();
  }
  function stopFly() { flyId++; }
  var ART = function (n) { return "art/" + n + ".jpg"; };

  var C = [];
  /* 第 1 章 总览 */
  C[0] = {
    name: "地球运动总览", meta: "湘教版 选择性必修1 · 自转与公转", art: ART(1),
    bg: "一颗蓝色星球，悬在太阳的光里。它一边旋转，一边奔跑，从不停歇。",
    sig: ["自转带来昼夜交替与时差；公转加上地轴倾斜，带来直射点移动、昼夜长短与正午太阳高度变化，形成四季。"],
    stages: [
      { title: "公转全景", ms: 5000, go: function () { stopFly(); setPlay(false); resetView(); setR("x-day", 79); }, lines: ["这是俯瞰的公转轨道，太阳居中，地球在春分点。", "绕太阳走完一圈，大约要365天。"] },
      { title: "夏至", ms: 5000, go: function () { setR("x-day", 172); }, lines: ["6月22日前后，北半球倾向太阳，迎来夏至。", "注意地轴：倾斜着，始终指向北极星附近。"] },
      { title: "近日点", ms: 6500, go: function () { setR("x-day", 2); if (tiltG) { var p = tiltG.position; fly([p.x * 1.25, 9, p.z * 1.25 + 8], [p.x, 0, p.z], 2600); } }, lines: ["1月初，地球走到离太阳最近的近日点。", "日地距离约1.47亿千米，北半球却正值隆冬。"] },
      { title: "奔跑一年", ms: 9000, go: function () { stopFly(); resetView(); if (!playing) setPlay(true); }, lines: ["让地球跑起来：春分、夏至、秋分、冬至依次掠过。", "公转加上地轴倾斜，四季就这样轮回。"] }
    ],
    asks: [{ before: 2, who: "日地距离与季节", q: "1月初地球离太阳最近。这时北半球是什么季节？", opts: [
      { t: "夏季——离太阳近，当然最热", r: "离太阳近并不决定季节。日地距离一年只变化约3%，影响很小。" },
      { t: "冬季", h: 1, r: "季节取决于太阳直射点：1月直射点在南半球，北半球昼短、太阳低，所以是冬季。" },
      { t: "春季", r: "春分在3月21日前后，1月初还没到。" }] }]
  };
  /* 第 2 章 自转 */
  C[1] = {
    name: "地球自转", meta: "自西向东 · 角速度与线速度", art: ART(2),
    bg: "每一次日出日落，都是地球在转身。它转得有多快？各地一样快吗？",
    sig: ["自西向东：北逆南顺。除极点外角速度约15°/小时；线速度赤道最大约1670 km/h，60°约为一半，极点为0。"],
    stages: [
      { title: "侧视地球", ms: 4500, go: function () { clk('[data-v="side"]'); setR("x-lat", 0); }, lines: ["地球绕地轴自西向东旋转，一天转一圈。", "金色箭头的长短，代表各纬度的线速度。"] },
      { title: "北极上空", ms: 5000, go: function () { clk('[data-v="n"]'); }, lines: ["飞到北极上空往下看：地球逆时针旋转。"] },
      { title: "南极上空", ms: 5000, go: function () { clk('[data-v="s"]'); }, lines: ["换到南极上空，同一转动却成了顺时针。", "这就是“北逆南顺”。"] },
      { title: "赤道", ms: 4500, go: function () { clk('[data-v="side"]'); setR("x-lat", 0); }, lines: ["赤道上线速度最大，约每小时1670千米。", "比民航客机还快将近一倍。"] },
      { title: "60°纬线", ms: 5000, go: function () { setR("x-lat", 60); }, lines: ["到了60°纬线，只剩约每小时835千米。", "线速度等于1670乘以纬度的余弦。"] },
      { title: "极点", ms: 4500, go: function () { setR("x-lat", 90); }, lines: ["到了极点，线速度和角速度都归零。", "除极点外，各地角速度都是每小时15°。"] }
    ],
    asks: [
      { before: 1, who: "自转方向", q: "从北极上空俯视，地球自转是什么方向？", opts: [
        { t: "顺时针", r: "顺时针是从南极上空看到的。" },
        { t: "逆时针", h: 1, r: "地球自西向东转，从北极上空俯视就是逆时针。" },
        { t: "说不准，会变", r: "自转方向是固定的，自西向东。" }] },
      { before: 4, who: "线速度", q: "纬度60°处的自转线速度，约为赤道的多少？", opts: [
        { t: "和赤道一样", r: "一样的是角速度，不是线速度。" },
        { t: "一半", h: 1, r: "线速度 = 1670 × cosφ，cos60° = 0.5，约835 km/h。" },
        { t: "四分之一", r: "那是 cos²60°，线速度只与 cosφ 成正比。" }] }]
  };
  /* 第 3 章 晨昏线 */
  C[2] = {
    name: "昼夜交替与晨昏线", meta: "昼半球 · 夜半球 · 地方时", art: ART(3),
    bg: "地球不发光也不透明。阳光只能照亮它的一半，另一半沉在黑夜里。",
    sig: ["晨昏线与太阳光线垂直、平分赤道；顺着自转方向，由夜入昼为晨线。经度每差15°，地方时差1小时，东早西晚。"],
    stages: [
      { title: "昼与夜", ms: 5000, go: function () { if (play3) setPlay3(false); clk('[data-v3="side"]'); setR("x-d3", 171); setR("x-t3", 12); }, lines: ["阳光从右侧平行射来，照亮地球的一半。", "亮的是昼半球，暗的是夜半球，分界就是晨昏线。"] },
      { title: "转动起来", ms: 8000, go: function () { if (!play3) setPlay3(true); }, lines: ["让地球转起来：城市依次从黑夜走进白天。", "由夜入昼的是晨线，由昼入夜的是昏线。"] },
      { title: "光照图视角", ms: 6000, go: function () { clk('[data-v3="n"]'); }, lines: ["换到北极上空，这是考试最常见的光照图视角。", "地球逆时针转，晨线在逆时针方向的前方。"] },
      { title: "地方时", ms: 5500, go: function () { if (play3) setPlay3(false); setR("x-t3", 12); clk('[data-v3="side"]'); }, lines: ["北京时间正午，伦敦的地方时才凌晨4点。", "经度每差15°，地方时差1小时，东早西晚。"] },
      { title: "春分日", ms: 5500, go: function () { setR("x-d3", 79); }, lines: ["春分这天，太阳直射赤道。", "晨昏线穿过两极，与经线圈重合，全球昼夜等长。"] }
    ],
    asks: [
      { before: 3, who: "地方时", q: "北京时间正午12点，伦敦（0°经线）的地方时大约是几点？", opts: [
        { t: "也是中午12点", r: "各地正午到来的时刻不同，东边先到。" },
        { t: "凌晨4点", h: 1, r: "北京时间是120°E的地方时，伦敦在其西120°，晚8小时：12 − 8 = 4点。" },
        { t: "晚上8点", r: "伦敦在西边，时间更晚到，应减8小时而不是加。" }] },
      { before: 4, who: "晨昏线", q: "春分日，晨昏线与经线是什么关系？", opts: [
        { t: "重合", h: 1, r: "直射赤道时晨昏线通过两极，与经线圈重合，全球昼夜等长。" },
        { t: "斜交", r: "直射点不在赤道时才斜交，例如夏至、冬至。" },
        { t: "垂直", r: "晨昏线始终与太阳光线垂直，而不是与经线垂直。" }] }]
  };
  /* 第 4 章 公转 */
  C[3] = {
    name: "地球公转", meta: "椭圆轨道 · 近日点与远日点 · 黄赤交角", art: ART(4),
    bg: "地球绕太阳奔跑的跑道，并不是正圆。而它的身子，始终歪着23°26′。",
    sig: ["公转轨道近似正圆的椭圆：1月初近日点最快，7月初远日点最慢。黄赤交角23°26′使直射点在南北回归线之间往返。"],
    stages: [
      { title: "近日点", ms: 5000, go: function () { if (play4) setPlay4(false); chk("x-sw4", false); setR("x-ob", 23.44); setR("x-d4", 2); }, lines: ["地球沿椭圆轨道公转，太阳在一个焦点上。", "1月初，地球经过近日点——图中椭圆已夸大。"] },
      { title: "远日点", ms: 5500, go: function () { setR("x-d4", 184); }, lines: ["7月初，地球来到远日点，走得最慢。", "所以北半球夏半年约186天，比冬半年长一周。"] },
      { title: "相等面积", ms: 9000, go: function () { chk("x-sw4", true); if (!play4) setPlay4(true); }, lines: ["日地连线每30天扫过一扇，每扇面积都相等。", "离得近就走得快，离得远就走得慢。"] },
      { title: "黄赤交角", ms: 5000, go: function () { if (play4) setPlay4(false); chk("x-sw4", false); setR("x-ob", 23.44); }, lines: ["蓝环是赤道面，金环是黄道面，夹角23°26′。", "地轴的倾斜方向，在公转中始终不变。"] },
      { title: "交角归零", ms: 5500, go: function () { setR("x-ob", 0); }, lines: ["把交角调成0°：回归线并入赤道，极圈缩到极点。", "太阳终年直射赤道，四季变化随之消失。"] },
      { title: "交角变大", ms: 5000, go: function () { setR("x-ob", 30); }, lines: ["若调大到30°，热带和寒带都会扩大，温带变窄。"] }
    ],
    asks: [
      { before: 1, who: "公转速度", q: "地球在近日点和远日点，哪里公转更快？", opts: [
        { t: "近日点", h: 1, r: "开普勒第二定律：日地连线相等时间扫过相等面积，离太阳近就走得快。" },
        { t: "远日点", r: "远日点离太阳远，引力弱，走得最慢。" },
        { t: "一样快", r: "椭圆轨道上速度会变化，近快远慢。" }] },
      { before: 4, who: "黄赤交角", q: "如果黄赤交角变成0°，地球上会怎样？", opts: [
        { t: "四季更加分明", r: "交角越大，四季才越分明。" },
        { t: "太阳终年直射赤道，没有四季变化", h: 1, r: "没有倾斜，直射点就不会南北移动，昼夜长短和正午太阳高度不再随季节变化。" },
        { t: "没有任何影响", r: "四季正是黄赤交角造成的。" }] }]
  };
  /* 第 5 章 直射点 */
  C[4] = {
    name: "太阳直射点的移动", meta: "二分二至 · 回归线之间往返", art: ART(5),
    bg: "一年里，太阳最直的那束光，会在地球上南北游走。它从不越过两条看不见的线。",
    sig: ["春分直射赤道 → 夏至北回归线 → 秋分赤道 → 冬至南回归线，周期一个回归年。"],
    stages: [
      { title: "春分", ms: 4500, go: function () { if (play5) setPlay5(false); clk('[data-q5="79"]'); }, lines: ["3月21日春分，太阳直射赤道。"] },
      { title: "夏至", ms: 5500, go: function () { clk('[data-q5="172"]'); }, lines: ["此后直射点一路北移，6月22日到达北回归线。", "这是它能到达的最北端：23°26′N。"] },
      { title: "秋分", ms: 4500, go: function () { clk('[data-q5="265"]'); }, lines: ["夏至后直射点折返南移，9月23日回到赤道。"] },
      { title: "冬至", ms: 5500, go: function () { clk('[data-q5="355"]'); }, lines: ["继续南移，12月22日抵达南回归线23°26′S。", "之后再北返，周期是一个回归年。"] },
      { title: "往返一年", ms: 9000, go: function () { if (!play5) setPlay5(true); }, lines: ["播放一年：红点在两条回归线之间来回摆动。", "右下的曲线，就是直射点纬度的年变化。"] }
    ],
    asks: [
      { before: 2, who: "直射点移动", q: "夏至过后到秋分，太阳直射点在哪个半球、往哪移？", opts: [
        { t: "北半球，继续向北", r: "北回归线已是最北端，夏至后只能折返。" },
        { t: "北半球，向南移", h: 1, r: "6月22日到9月23日，直射点仍在北半球，但已经往南走了。" },
        { t: "南半球，向南移", r: "秋分前直射点还没越过赤道。" }] },
      { before: 4, who: "直射次数", q: "北回归线上，一年有几次太阳直射？", opts: [
        { t: "一次", h: 1, r: "只有夏至日直射北回归线；回归线之间才一年两次。" },
        { t: "两次", r: "两次是回归线之间的地区，例如广州以南。" },
        { t: "一次也没有", r: "夏至日正午，太阳正好直射北回归线。" }] }]
  };
  /* 第 6 章 昼夜长短 */
  C[5] = {
    name: "昼夜长短", meta: "昼弧 · 夜弧 · 极昼极夜", art: ART(6),
    bg: "夏天的傍晚为什么那么长？答案藏在一条纬线被晨昏线切开的样子里。",
    sig: ["直射哪个半球，哪个半球昼长夜短，纬度越高越明显；赤道全年昼夜等长，二分日全球昼夜等长。"],
    stages: [
      { title: "春分", ms: 5000, go: function () { setR("x-la6", 30); clk('[data-q6="79"]'); }, lines: ["春分日，晨昏线平分每条纬线，昼弧夜弧一样长。", "全球各地，昼夜都是12小时。"] },
      { title: "夏至·杭州", ms: 6000, go: function () { setR("x-la6", 30); clk('[data-q6="172"]'); }, lines: ["夏至这天，杭州的金色昼弧明显长过夜弧。", "昼长约14小时，地方时5点前后就日出。"] },
      { title: "极昼", ms: 5500, go: function () { setR("x-la6", 70); }, lines: ["到了北极圈以北，整条纬线都在昼半球。", "太阳整天不落，这就是极昼。"] },
      { title: "冬至", ms: 6000, go: function () { clk('[data-q6="355"]'); setR("x-la6", 30); }, lines: ["冬至反过来，杭州昼长只剩约10小时。", "北极圈内则进入漫长的极夜。"] },
      { title: "赤道", ms: 4500, go: function () { setR("x-la6", 0); }, lines: ["而在赤道上，不论哪天，昼夜都是各12小时。"] }
    ],
    asks: [
      { before: 1, who: "杭州昼长", q: "北半球夏至日，杭州（30°N）的白昼比黑夜：", opts: [
        { t: "长", h: 1, r: "直射北半球，北半球昼长夜短；夏至日杭州昼长约14小时。" },
        { t: "短", r: "昼短夜长是北半球冬半年的情形。" },
        { t: "一样长", r: "只有赤道或二分日才昼夜等长。" }] },
      { before: 2, who: "高纬现象", q: "夏至日，北纬70°会出现什么现象？", opts: [
        { t: "极昼", h: 1, r: "夏至日北极圈（66°34′N）以北全天都在昼半球，太阳不落。" },
        { t: "极夜", r: "极夜出现在冬至前后的北极圈内。" },
        { t: "昼夜等长", r: "昼夜等长只在赤道或二分日。" }] }]
  };
  /* 第 7 章 正午太阳高度 */
  C[6] = {
    name: "正午太阳高度", meta: "H = 90° − |φ − δ| · 影子与楼间距", art: ART(7),
    bg: "正午，一根竖杆投下的影子，记录着太阳一年的高低起伏。",
    sig: ["正午太阳高度由直射点向南北递减；北回归线以北夏至最大、冬至最小。楼间距 ≥ 楼高 × cot H冬至。"],
    stages: [
      { title: "夏至正午", ms: 5500, go: function () { setR("x-la7", 30); clk('[data-q7="172"]'); }, lines: ["正午，是一天里太阳最高的时刻。", "夏至日杭州正午，太阳高度约83.5°。"] },
      { title: "冬至正午", ms: 6000, go: function () { setR("x-la7", 30); clk('[data-q7="355"]'); }, lines: ["冬至日直射南回归线，杭州正午太阳只有约36.6°。", "太阳低，影子就长：约为杆高的1.35倍。"] },
      { title: "正当头", ms: 5000, go: function () { clk('[data-q7="172"]'); setR("x-la7", 23); }, lines: ["夏至日的北回归线上，太阳几乎正当头。", "竖杆在正午几乎没有影子。"] },
      { title: "南半球", ms: 5500, go: function () { setR("x-la7", -34); }, lines: ["同一天的34°S，正午太阳在北方，影子朝南。", "太阳高度只有约32.6°，那里正是冬天。"] },
      { title: "楼间距", ms: 5500, go: function () { clk('[data-q7="355"]'); setR("x-la7", 30); }, lines: ["冬至日太阳最低，决定了楼间距的下限。", "在杭州，楼间距至少约为楼高的1.35倍。"] }
    ],
    asks: [
      { before: 1, who: "影长", q: "和夏至相比，冬至日杭州正午的竿影会：", opts: [
        { t: "更长", h: 1, r: "冬至正午太阳高度最小，影长 = 杆高 / tanH，太阳越低影子越长。" },
        { t: "更短", r: "夏至太阳最高，影子才最短。" },
        { t: "一样长", r: "正午太阳高度随季节变化，影长也随之变化。" }] },
      { before: 3, who: "影子朝向", q: "夏至日正午，悉尼（约34°S）的影子朝哪边？", opts: [
        { t: "朝北", r: "影子与太阳方向相反。悉尼在直射点以南，太阳在北方。" },
        { t: "朝南", h: 1, r: "悉尼位于直射点（23°26′N）以南，正午太阳在北方，影子朝南。" }] }]
  };
  /* 第 8 章 四季 */
  C[7] = {
    name: "四季更替", meta: "昼长 + 太阳高度 = 热量的季节变化", art: ART(8),
    bg: "春种、夏长、秋收、冬藏。四季的节拍，来自昼长和太阳高度的合奏。",
    sig: ["昼夜长短与正午太阳高度的季节变化使太阳辐射随季节变化，形成四季；南北半球季节相反，与日地距离无关。"],
    stages: [
      { title: "夏季", ms: 5500, go: function () { setPlay(false); setR("x-la8", 30); setR("x-d8", 171); }, lines: ["从轨道上空俯视，地球绕太阳走过四季。", "夏至前后，杭州白昼最长、太阳最高——夏季。"] },
      { title: "冬季", ms: 5000, go: function () { setR("x-d8", 355); }, lines: ["冬至前后，昼最短、太阳最低，热量最少——冬季。"] },
      { title: "南半球", ms: 5500, go: function () { setR("x-d8", 171); setR("x-la8", -30); }, lines: ["同样是6月，30°S昼短、太阳低，正值冬季。", "南北半球的季节恰好相反。"] },
      { title: "一年轮回", ms: 9000, go: function () { setR("x-la8", 30); if (!playing) setPlay(true); }, lines: ["播放一年：昼长和太阳高度的曲线同步起伏。", "天文四季以二分二至为中点；气候四季按月份划分。"] }
    ],
    asks: [{ before: 2, who: "南北半球", q: "北半球夏至时，南半球30°S是什么季节？", opts: [
      { t: "夏季", r: "这时直射点在北半球，南半球昼短、太阳低。" },
      { t: "冬季", h: 1, r: "南北半球季节相反：6月南半球昼短夜长、正午太阳高度小，是冬季。" },
      { t: "春季", r: "南半球春季在9—11月前后。" }] }]
  };

  var stage = E("x-stage"), tools = document.querySelector(".x-tools"), bbar = document.querySelector(".x-bbar");
  CINE.init({
    host: tools, before: tools.firstElementChild, stage: stage, kind: "geo",
    hide: ["#x-stage #x-ov", "#x-soon"],
    stopOn: ["#x-chap button", "#x-prev", "#x-next", "#x-bprev", "#x-bnext", "#x-panel input", "#x-panel button", "#x-panel label"],
    chapter: function () { return C[cur] || null; },
    next: function () { go(cur + 1); },
    onStop: function () { stopFly(); }
  });
  /* 手机：按钮移到底部翻章栏上方一行 */
  var wrap = tools.querySelector(".cn-wrap"), st = document.createElement("style");
  st.textContent = ".cn-cap p{display:inline-block;background:rgba(10,14,22,.62);padding:4px 14px;border-radius:12px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.cn-cap i{background:rgba(10,14,22,.62);padding:4px 9px;border-radius:7px}@media (max-width:1023px){.x-bbar{flex-wrap:wrap;row-gap:8px}.x-bbar .cn-wrap{flex:1 0 100%;justify-content:center}.x-bbar #x-bprev{margin-left:auto}.x-panel{padding-bottom:calc(140px + env(safe-area-inset-bottom))!important}}";
  document.head.appendChild(st);
  function place() { if (MQ.matches) { if (wrap.parentNode !== bbar) bbar.insertBefore(wrap, bbar.firstChild); } else if (wrap.parentNode !== tools) tools.insertBefore(wrap, tools.firstElementChild); }
  if (MQ.addEventListener) MQ.addEventListener("change", place); else MQ.addListener(place);
  place();
})();
