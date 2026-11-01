/* 大气环流 · 纪录片 / 先猜后看 数据（依赖主脚本全局词法绑定：cur go G T tSet U uSetF S sGo Vv vGo O R7 rUI E8 nSet nPlay N9 mSet resetView） */
(function () {
  "use strict";
  if (!window.CINE) return;
  var E = function (id) { return document.getElementById(id); };
  function setR(id, v) { var e = E(id); if (!e) return; e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }
  function chk(id, on) { var e = E(id); if (e && e.checked !== !!on) e.click(); }
  function nth(id, i) { var e = E(id); if (e && e.children[i]) e.children[i].click(); }
  var ART = function (n) { return "art/" + n + ".jpg"; };
  /* 第 1 章三维地球：相机绕球缓移 */
  var gf = 0;
  function gfly(dir, k, ms) {
    if (!G.ok) return;
    var id = ++gf, p0 = G.cam.position.clone(), r0 = p0.length(), d = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize(), r1 = r0 * (k || 1), s = performance.now(), v0 = p0.clone().normalize();
    (function step() {
      if (id !== gf) return;
      var t = Math.min(1, (performance.now() - s) / (ms || 2400)); t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      G.cam.position.copy(v0.clone().lerp(d, t).normalize().multiplyScalar(r0 + (r1 - r0) * t)); G.ctl.update();
      if (t < 1) requestAnimationFrame(step);
    })();
  }
  /* 第 8 章：模拟点击某纬度的条带 */
  function band(lat) {
    var ec = E("ePop") && document.querySelector("#stage canvas[style*='visible']");
    var cvs = [].slice.call(document.querySelectorAll("#stage canvas")).filter(function (c) { return c.style.visibility === "visible" && c !== G.cv; });
    ec = cvs[0]; if (!ec || !E8.R) return;
    var r = ec.getBoundingClientRect(), y = E8.cy - E8.R * Math.sin(lat * Math.PI / 180);
    ec.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.left + E8.cx, clientY: r.top + y }));
  }
  function noPop() { var p = E("ePop"); if (p) p.hidden = true; E8.sel = -1; }

  var C = {};
  C[1] = {
    name: "大气运动总览", meta: "太阳辐射 · 冷热不均 · 地球自转", art: ART(1),
    bg: "包裹地球的大气，从来不曾静止。驱动它的，是太阳送来的热量。",
    sig: ["地表冷热不均形成热力环流；全球尺度叠加地球自转，形成三圈环流和七个气压带、六个风带。"],
    stages: [
      { title: "流动的大气", ms: 5000, go: function () { gf++; resetView(); setR("spd", 1); if (G.paused) E("pause").click(); }, lines: ["这颗地球上，空气永不停歇地流动。", "边缘的光环是经向剖面，粒子就是流动的空气。"] },
      { title: "赤道上空", ms: 5500, go: function () { gfly([1, 0.05, 0.3], 0.85); }, lines: ["赤道接收的太阳热量最多。", "暖空气在这里膨胀上升，奔向高空。"] },
      { title: "北半球", ms: 5500, go: function () { gfly([0.4, 0.75, 0.6], 0.9); }, lines: ["南北半球各有三个环流圈：低纬、中纬、高纬。", "颜色代表纬度：暖色在低纬，冷色在高纬。"] },
      { title: "加速观察", ms: 6500, go: function () { setR("spd", 2.4); }, lines: ["加快粒子：空气在约30°下沉，在60°附近被抬升。", "这一切，下面几章逐步拆开来看。"] }
    ],
    asks: [{ before: 3, who: "全球环流", q: "赤道上升的空气流向高空，大约会在哪里下沉？", opts: [
      { t: "一直流到极地才下沉", r: "这是不考虑地球自转的单圈环流，实际并不存在。" },
      { t: "约30°附近", h: 1, r: "受地转偏向力影响，高空气流在30°附近偏成西风、堆积下沉，形成副热带高压。" },
      { t: "回到赤道原地下沉", r: "赤道是上升区，近地面形成低压。" }] }]
  };
  C[2] = {
    name: "热力环流原理", meta: "冷热不均 → 垂直运动 → 气压差 → 水平运动", art: ART(2),
    bg: "大气运动最简单的形式，从一块被晒热的地面开始。",
    sig: ["热→上升→近地面低压、高空高压；冷→下沉→近地面高压、高空低压。水平方向空气由高压流向低压。"],
    stages: [
      { title: "冷热不均", ms: 4500, go: function () { if (T.swap) E("tSwap").click(); T.auto = false; tSet(0); }, lines: ["两块相邻的地面：A处受热，B处变冷。", "空气会怎样行动？"] },
      { title: "① 垂直运动", ms: 5000, go: function () { T.auto = false; tSet(1); }, lines: ["A处空气受热膨胀上升，B处冷却收缩下沉。"] },
      { title: "② 气压差", ms: 5500, go: function () { tSet(2); }, lines: ["A处近地面成低压、高空成高压；B处正相反。", "同一地点，近地面与高空的气压性质相反。"] },
      { title: "③ 等压面", ms: 5000, go: function () { tSet(3); }, lines: ["等压面随之弯曲：高压处上凸，低压处下凹。"] },
      { title: "④ 闭合环流", ms: 6000, go: function () { tSet(4); }, lines: ["近地面风由B吹向A，高空由A流回B。", "一个闭合的热力环流，就此形成。"] },
      { title: "冷热互换", ms: 6000, go: function () { E("tSwap").click(); }, lines: ["把冷热互换，环流方向随之反转。"] }
    ],
    asks: [
      { before: 2, who: "热力环流", q: "A处地面受热，A处近地面会形成什么气压？", opts: [
        { t: "高压", r: "受热的空气上升，近地面空气减少，气压降低。" },
        { t: "低压", h: 1, r: "空气受热上升，近地面空气密度减小，形成低压；高空空气聚集，形成高压。" },
        { t: "气压不变", r: "冷热不均必然引起空气垂直运动和气压差。" }] },
      { before: 4, who: "风向", q: "近地面的风会怎样吹？", opts: [
        { t: "从A吹向B", r: "A近地面是低压，空气不会从低压流向高压。" },
        { t: "从B吹向A", h: 1, r: "水平方向空气由高压流向低压：近地面B（高压）→A（低压）。" }] }]
  };
  C[3] = {
    name: "城市热岛环流", meta: "市区上升 · 郊区下沉 · 工业与绿地布局", art: ART(3),
    bg: "夜色里的城市灯火通明，也比郊外暖上几度。这几度，会让风改道。",
    sig: ["近地面风由郊区吹向市区；污染工业应布局在热岛环流之外，绿化带宜布置在郊区下沉区附近。"],
    stages: [
      { title: "城市热岛", ms: 5500, go: function () { if (U.fac) E("uFac").click(); chk("uGreen", false); chk("uRoof", false); chk("uBelt", false); }, lines: ["城市废热多、路面吸热强，市区比郊区暖。", "市区空气上升，郊区空气下沉。"] },
      { title: "郊区建厂", ms: 6000, go: function () { if (!U.fac) E("uFac").click(); uSetF(0.25); }, lines: ["污染随近地面风，一路涌进了市区。", "放在郊区，不等于放对了地方。"] },
      { title: "移出环流", ms: 5500, go: function () { if (!U.fac) E("uFac").click(); uSetF(0.46); }, lines: ["把工厂移到热岛环流的下沉距离之外。", "污染不再被吸进市区，布局才算合理。"] },
      { title: "绿化带", ms: 5000, go: function () { chk("uBelt", true); }, lines: ["在郊区下沉区附近种一圈绿化带。", "流向市区的空气，先被树木过滤一遍。"] },
      { title: "缓解热岛", ms: 5500, go: function () { chk("uGreen", true); chk("uRoof", true); }, lines: ["再增加绿地、改用浅色屋顶。", "市区与郊区的温差缩小，热岛减弱。"] }
    ],
    asks: [{ before: 1, who: "工业布局", q: "把污染工厂建在离市区不远的郊区（热岛环流之内），污染会怎样？", opts: [
      { t: "留在郊区，市区不受影响", r: "近地面风从郊区吹向市区，会把污染带过去。" },
      { t: "随近地面风流向市区", h: 1, r: "热岛环流近地面风由郊区吹向市区，环流内的污染会被吸入市区。" },
      { t: "升到高空自然消散", r: "郊区是下沉区，污染物反而贴近地面。" }] }]
  };
  C[4] = {
    name: "海陆风", meta: "海陆热力性质差异 · 白天海风 夜晚陆风", art: ART(4),
    bg: "海边的风，一天要换两次方向。秘密在于陆地和海水升温的快慢不同。",
    sig: ["陆地比热容小、升温降温快：白天吹海风，夜晚吹陆风；近地面风从较冷的高压吹向较热的低压。"],
    stages: [
      { title: "海与陆", ms: 4500, go: function () { sGo(10); }, lines: ["海边，陆地和海洋比邻而居，却冷热有别。"] },
      { title: "白天·海风", ms: 6000, go: function () { sGo(14); }, lines: ["午后陆地升温快，近地面形成低压。", "风从海洋吹向陆地——海风。"] },
      { title: "夜晚·陆风", ms: 6000, go: function () { sGo(2); }, lines: ["夜里陆地降温快，气压反比海洋高。", "风从陆地吹向海洋——陆风。"] },
      { title: "昼夜轮替", ms: 9000, go: function () { S.t = 6; S.play = false; E("sPlay").click(); }, lines: ["播放一天：海风陆风昼夜交替。", "渔民借陆风清晨出海，借海风傍晚归航。"] }
    ],
    asks: [
      { before: 1, who: "海陆风", q: "晴朗的午后，海边近地面的风从哪儿吹来？", opts: [
        { t: "从海洋吹向陆地", h: 1, r: "白天陆地升温快、气压低，海洋相对冷、气压高，风由海吹向陆——海风。" },
        { t: "从陆地吹向海洋", r: "那是夜晚的陆风。" }] },
      { before: 2, who: "风向转换", q: "到了夜里，风向会怎样？", opts: [
        { t: "保持不变", r: "夜间海陆冷热关系反转，风向也会反转。" },
        { t: "反转为陆风", h: 1, r: "夜晚陆地降温快、气压高于海洋，风从陆地吹向海洋。" }] }]
  };
  C[5] = {
    name: "山谷风", meta: "白天谷风 · 夜晚山风 · 夜雨与逆温", art: ART(5),
    bg: "清晨的山谷常被云雾填满。山坡与谷地之间，也有一场昼夜轮换的风。",
    sig: ["白天谷风、夜晚山风；山区多夜雨；谷底逆温使污染物不易扩散，谷地不宜布局污染严重的工业。"],
    stages: [
      { title: "山与谷", ms: 4500, go: function () { Vv.play = false; chk("vFog", true); vGo(10); }, lines: ["比较同一高度：山坡上方和谷地上空。"] },
      { title: "白天·谷风", ms: 6000, go: function () { vGo(14); }, lines: ["白天山坡增温快，坡上空气比同高度谷地暖。", "空气沿坡上升，谷底空气补充——谷风。"] },
      { title: "夜晚·山风", ms: 6000, go: function () { vGo(2); }, lines: ["夜晚山坡降温快，冷空气沿坡滑入谷底——山风。", "谷底暖湿空气被抬升，容易成云致雨。"] },
      { title: "逆温", ms: 5500, go: function () { vGo(5); }, lines: ["冷空气堆在谷底形成逆温，污染物难以扩散。", "所以谷地不宜布局大气污染严重的工业。"] },
      { title: "昼夜轮替", ms: 9000, go: function () { Vv.t = 6; Vv.play = false; E("vPlay").click(); }, lines: ["播放一天，看谷风与山风交替出现。"] }
    ],
    asks: [
      { before: 1, who: "谷风", q: "白天，山坡附近的风怎样吹？", opts: [
        { t: "沿山坡向上吹", h: 1, r: "白天坡面增温快，空气沿坡上升，谷底空气补充，形成谷风。" },
        { t: "沿山坡向下吹", r: "那是夜间的山风。" }] },
      { before: 2, who: "山区夜雨", q: "为什么山区常常“夜雨多”？", opts: [
        { t: "夜里海风把水汽吹进山区", r: "山区夜雨与山谷风有关，不需要海风。" },
        { t: "冷空气沿坡下沉，抬升谷底暖湿空气", h: 1, r: "夜晚山风使谷底暖湿空气被迫抬升，冷却凝结，成云致雨。" },
        { t: "夜晚气温低，空气直接变成雨", r: "降水需要空气上升冷却，单纯降温多形成露、雾。" }] }]
  };
  C[6] = {
    name: "单圈环流", meta: "假设：地表均匀 · 地球不自转", art: ART(6),
    bg: "先做一个思想实验：如果地球不自转，全球的大气会怎样流动？",
    sig: ["不自转时，赤道上升、极地下沉，南北半球各一个闭合环流；一旦自转，单圈环流就无法维持。"],
    stages: [
      { title: "两个假设", ms: 5500, go: function () { chk("oCor", false); chk("oSym", false); }, lines: ["假设地表均匀、地球不自转。", "赤道受热上升，高空流向极地。"] },
      { title: "南北对称", ms: 5500, go: function () { chk("oSym", true); }, lines: ["两极冷却下沉，近地面流回赤道。", "南北半球各形成一个闭合环流。"] },
      { title: "地球自转", ms: 7000, go: function () { chk("oSym", true); chk("oCor", true); }, lines: ["地球一自转，气流就偏转：北半球向右、南半球向左。", "到30°附近已偏成西风，单圈环流无法维持。"] }
    ],
    asks: [{ before: 2, who: "思想实验", q: "如果地球开始自转，从赤道高空流向极地的气流会怎样？", opts: [
      { t: "照样直达极地", r: "自转产生地转偏向力，气流必然偏转。" },
      { t: "北半球向右偏，约30°附近堆积下沉", h: 1, r: "地转偏向力使气流逐渐偏成西风，无法继续流向极地，在约30°堆积下沉。" },
      { t: "折返回到赤道", r: "气流是偏转成西风，而不是原路折返。" }] }]
  };
  C[7] = {
    name: "三圈环流", meta: "低纬环流 · 中纬环流 · 高纬环流", art: ART(7),
    bg: "自转把一个大环流，拆成了三个首尾相接的齿轮。",
    sig: ["赤道上升、30°下沉、60°上升、极地下沉：南北半球各三个环流圈。"],
    stages: [
      { title: "①赤道上升", ms: 5500, go: function () { chk("rWind", false); chk("rNH", false); nth("rSt", 0); }, lines: ["赤道受热，空气上升，高空流向极地。", "地转偏向力让气流逐渐偏转。"] },
      { title: "②30°下沉", ms: 6000, go: function () { nth("rSt", 1); }, lines: ["约30°附近气流已偏成西风，堆积下沉。", "低纬环流：赤道上升，30°下沉，近地面流回赤道。"] },
      { title: "③极地下沉", ms: 5000, go: function () { nth("rSt", 2); }, lines: ["极地寒冷，空气冷却下沉，近地面流向60°。"] },
      { title: "④60°上升", ms: 6500, go: function () { nth("rSt", 3); }, lines: ["暖冷气流在60°附近相遇，暖空气被抬升。", "中纬环流和高纬环流，由此闭合。"] },
      { title: "近地面风", ms: 6000, go: function () { nth("rSt", 3); chk("rWind", true); }, lines: ["近地面：信风、盛行西风、极地东风依次排开。"] }
    ],
    asks: [
      { before: 1, who: "低纬环流", q: "赤道上空流向极地的气流，会在大约多少度附近下沉？", opts: [
        { t: "30°", h: 1, r: "地转偏向力使气流到30°附近已偏成西风，空气堆积下沉。" },
        { t: "60°", r: "60°附近是上升气流区。" },
        { t: "90°", r: "那是不自转时的单圈环流。" }] },
      { before: 3, who: "副极地", q: "在60°附近，空气是上升还是下沉？", opts: [
        { t: "上升", h: 1, r: "来自30°的暖空气与极地冷空气相遇，暖空气被抬升，形成副极地低压。" },
        { t: "下沉", r: "下沉发生在30°和极地。" }] }]
  };
  C[8] = {
    name: "气压带与风带", meta: "七个气压带 · 六个风带", art: ART(8),
    bg: "三圈环流落到地面，就排成了一圈圈高低相间的气压带与风带。",
    sig: ["气压带高低相间、风带夹在其间；风从高压吹向低压，再按“北右南左”偏转。"],
    stages: [
      { title: "七带六风", ms: 5500, go: function () { noPop(); chk("eCor", false); chk("ePt", true); }, lines: ["近地面出现七个气压带、六个风带。", "红色是低压，蓝色是高压，高低相间。"] },
      { title: "赤道低压带", ms: 5500, go: function () { band(0); }, lines: ["赤道低气压带：受热上升，对流雨多，终年湿热。"] },
      { title: "副热带高压带", ms: 5500, go: function () { band(30); }, lines: ["副热带高气压带：气流下沉，炎热干燥，多沙漠。"] },
      { title: "盛行西风带", ms: 5500, go: function () { band(45); }, lines: ["盛行西风带：北半球吹西南风，南半球吹西北风。"] },
      { title: "三力合成", ms: 7000, go: function () { noPop(); chk("eCor", true); }, lines: ["近地面风受气压梯度力、地转偏向力和摩擦力共同作用。", "合力让风与等压线斜交，吹成西南风。"] }
    ],
    asks: [
      { before: 2, who: "成因", q: "副热带高气压带主要是怎样形成的？", opts: [
        { t: "热力原因：地面冷却", r: "副热带地区并不冷，热力冷却不是主因。" },
        { t: "动力原因：高空气流堆积下沉", h: 1, r: "低纬高空气流在30°附近堆积下沉，近地面气压升高——动力原因形成。" }] },
      { before: 3, who: "风向", q: "北半球的盛行西风带，近地面实际吹什么风？", opts: [
        { t: "正西风", r: "近地面有摩擦力，风与等压线斜交，不是正西风。" },
        { t: "西南风", h: 1, r: "风从副高吹向副低，北半球向右偏，形成西南风。" },
        { t: "西北风", r: "西北风是南半球的西风带。" }] }]
  };
  C[9] = {
    name: "季节移动", meta: "随太阳直射点 · 夏北移 冬南移", art: ART(9),
    bg: "太阳直射点南北往返，气压带和风带也跟着它，一年摆动一次。",
    sig: ["就北半球而言，气压带风带夏季北移、冬季南移，幅度小于直射点。地中海气候、热带草原气候、南亚西南季风都与此有关。"],
    stages: [
      { title: "春季", ms: 4500, go: function () { nPlay(false); chk("nSA", false); nSet(4); }, lines: ["气压带和风带，会跟着太阳直射点南北移动。"] },
      { title: "北半球夏季", ms: 6000, go: function () { nPlay(false); nth("nQ", 0); }, lines: ["7月，直射点北移，各带随之北移。", "地中海沿岸被副高控制，炎热干燥。"] },
      { title: "北半球冬季", ms: 6000, go: function () { nth("nQ", 1); }, lines: ["1月，各带南移，西风带来到地中海沿岸。", "那里冬季温和多雨。"] },
      { title: "南亚季风", ms: 6000, go: function () { chk("nSA", true); nth("nQ", 0); }, lines: ["7月，东南信风越过赤道，受力向右偏转。", "它变成了南亚的西南季风。"] },
      { title: "一年摆动", ms: 9000, go: function () { nPlay(true); }, lines: ["播放一年：各带随直射点往返摆动。"] }
    ],
    asks: [
      { before: 1, who: "季节移动", q: "到了7月，气压带和风带会怎样移动？", opts: [
        { t: "向北移", h: 1, r: "7月直射点在北半球，气压带风带随之北移。" },
        { t: "向南移", r: "南移发生在北半球冬季。" },
        { t: "原地不动", r: "气压带风带随直射点季节移动。" }] },
      { before: 2, who: "地中海气候", q: "1月，地中海沿岸（约38°N）受什么控制？", opts: [
        { t: "副热带高气压带", r: "那是夏季的情形，此时炎热干燥。" },
        { t: "盛行西风带", h: 1, r: "冬季各带南移，西风从海洋带来水汽，温和多雨。" }] }]
  };
  C[10] = {
    name: "海陆分布与季风", meta: "亚洲高压 · 亚洲低压 · 东亚与南亚季风", art: ART(10),
    bg: "真实的地球海陆相间。冬天的大陆像冰窖，夏天像火炉，季风由此而生。",
    sig: ["冬季亚洲高压切断副极地低压带，夏季亚洲低压切断副热带高压带。东亚季风源于海陆热力差异；南亚季风还叠加了气压带风带季节移动。"],
    stages: [
      { title: "1月·亚洲高压", ms: 6500, go: function () { mSet(1); }, lines: ["1月，亚欧大陆冷却，形成强大的亚洲高压。", "副极地低压带被切断，只剩海上的阿留申、冰岛低压。"] },
      { title: "冬季风", ms: 5500, go: function () { mSet(12); }, lines: ["我国东部吹西北季风，寒冷干燥。", "南亚吹东北季风。"] },
      { title: "7月·亚洲低压", ms: 6500, go: function () { mSet(7); }, lines: ["7月，大陆受热，形成亚洲低压。", "副高被切断，只在海上保留夏威夷高压和亚速尔高压。"] },
      { title: "夏季风", ms: 6000, go: function () { mSet(8); }, lines: ["我国东部吹东南季风，高温多雨。", "南亚的西南季风，来自越过赤道的东南信风。"] },
      { title: "季风转换", ms: 5000, go: function () { mSet(4); }, lines: ["春秋季节海陆温差小，季风正在转换。"] }
    ],
    asks: [
      { before: 2, who: "东亚季风", q: "7月，我国东部吹什么风？", opts: [
        { t: "西北季风", r: "西北季风是冬季风。" },
        { t: "东南季风", h: 1, r: "夏季大陆形成亚洲低压，风从海洋上的高压吹向大陆，我国东部吹东南季风。" },
        { t: "东北季风", r: "东北季风出现在冬季的南亚。" }] },
      { before: 3, who: "南亚季风", q: "南亚夏季西南季风的形成，除了海陆热力差异，还因为：", opts: [
        { t: "气压带、风带的季节移动", h: 1, r: "南半球东南信风随气压带风带北移越过赤道，受地转偏向力右偏成西南风。" },
        { t: "喜马拉雅山的冰雪融化", r: "冰雪融化与季风成因无关。" },
        { t: "洋流把暖空气推上岸", r: "洋流影响气温和降水，但不是季风成因。" }] }]
  };

  var stage = E("stage"), tools = document.querySelector(".x-tools"), mbar = document.querySelector(".x-mbar");
  CINE.init({
    host: tools, before: tools.firstElementChild, stage: stage, kind: "geo",
    hide: ["#stage > #ov", "#soon"],
    stopOn: ["#side button", "#segs button", "#bPrev", "#bNext", "#mPrev", "#mNext", "#panel input", "#panel button", "#panel label"],
    chapter: function () { return C[cur] || null; },
    next: function () { go(cur + 1); },
    onStop: function () { gf++; }
  });
  var wrap = tools.querySelector(".cn-wrap"), st = document.createElement("style"), mq = matchMedia("(max-width:1023px)");
  st.textContent = ".cn-cap p{display:inline-block;background:rgba(10,14,22,.62);padding:4px 14px;border-radius:12px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.cn-cap i{background:rgba(10,14,22,.62);padding:4px 9px;border-radius:7px}@media (max-width:1023px){.x-mbar{flex-wrap:wrap;row-gap:8px}.x-mbar .cn-wrap{flex:1 0 100%;justify-content:center}.x-mbar .cn-wrap .cn-b{flex:0 0 auto;min-height:36px;height:36px;font-size:13px;border-radius:999px;border:1px solid var(--x-line,rgba(128,128,128,.35));background:transparent;color:inherit}.x-mbar .cn-wrap .cn-b[aria-pressed=true]{background:#0071e3;color:#fff}.x-panel{padding-bottom:calc(144px + env(safe-area-inset-bottom))!important}}";
  document.head.appendChild(st);
  function place() { if (mq.matches) { if (wrap.parentNode !== mbar) mbar.insertBefore(wrap, mbar.firstChild); } else if (wrap.parentNode !== tools) tools.insertBefore(wrap, tools.firstElementChild); }
  mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place);
  place();
})();
