/* 水循环 · 纪录片 / 先猜后看 数据（依赖主脚本全局：cur go highlight S2 apply2 set3 stop3 S4 set6 set8 S9 rot dist resetView） */
(function () {
  "use strict";
  if (!window.CINE) return;
  var E = function (id) { return document.getElementById(id); };
  function setR(id, v) { var e = E(id); if (!e) return; e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }
  function chk(el, on) { if (typeof el === "string") el = E(el); if (el && el.checked !== !!on) el.click(); }
  function clk(sel) { var e = document.querySelector(sel); if (e) e.click(); }
  var ART = function (n) { return "art/" + n + ".jpg"; };
  /* 相机缓推：rot.x / rot.y / dist */
  var fid = 0;
  function fly(rx, ry, d, ms) {
    var id = ++fid, a = rot.x, b = rot.y, c = dist, s = performance.now();
    (function step() {
      if (id !== fid) return;
      var t = Math.min(1, (performance.now() - s) / (ms || 2600)); t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      rot.x = a + (rx - a) * t; rot.y = b + (ry - b) * t; dist = c + (d - c) * t;
      if (t < 1) requestAnimationFrame(step);
    })();
  }
  function season(s) { clk('#panelBody [data-s="' + s + '"]'); }
  function cyc(a, b, c) { [a, b, c].forEach(function (v, i) { chk(document.querySelector('#panelBody [data-c="' + i + '"]'), v); }); }
  function rain5(i, s, v, h, soil) { setR("i5", i); setR("s5", s); setR("v5", v); setR("h5", h); clk('#panelBody [data-soil="' + soil + '"]'); clk("#play5"); }
  function rain7(h, sp) { setR("h7", h); chk("sp7", sp); clk("#play7"); }

  var C = [];
  C[0] = {
    name: "地球上的水体", meta: "海洋水 · 冰川 · 地下水 · 河湖与大气水", art: ART(1),
    bg: "从太空看，地球是一颗蓝色星球。可这满眼的水，真正能喝的少之又少。",
    sig: ["海洋水约占96.5%；淡水约2.5%，近七成是冰川。大气水约8天更新一次，地下水上千年，冰川近万年。"],
    stages: [
      { title: "海洋水", ms: 5000, go: function () { fid++; resetView(); highlight(0); }, lines: ["地球上约96.5%的水，是咸的海洋水。"] },
      { title: "冰川", ms: 5500, go: function () { highlight(1); fly(-0.42, 0.25, 26); }, lines: ["淡水只占约2.5%，近七成锁在两极和高山冰川里。", "冰川约9700年才更新一次。"] },
      { title: "地下水", ms: 5500, go: function () { highlight(2); fly(-0.3, -0.12, 27); }, lines: ["潜水面以下的地下水，约占全球水量的1.7%。", "它更新一次，要上千年。"] },
      { title: "河流水", ms: 5000, go: function () { highlight(6); fly(-0.52, -0.42, 30); }, lines: ["河流水只占约0.0002%，却约16天就更新一次。"] },
      { title: "大气水", ms: 5500, go: function () { highlight(5); }, lines: ["空中的水汽约8天更新一次，周期最短。", "人类易利用的淡水，不到淡水总量的0.3%。"] }
    ],
    asks: [
      { before: 1, who: "淡水储量", q: "陆地淡水中，储量最多的是哪一种？", opts: [
        { t: "河流水", r: "河流水量很少，只是更新快。" },
        { t: "冰川", h: 1, r: "冰川约占淡水总量的近七成，主要分布在两极和高山。" },
        { t: "湖泊水", r: "湖泊水只占全球水量约0.013%。" }] },
      { before: 4, who: "更新周期", q: "下面哪种水体的更新周期最短？", opts: [
        { t: "大气水", h: 1, r: "大气水约8天更新一次，是所有水体中最快的。" },
        { t: "地下水", r: "地下水约1400年更新一次。" },
        { t: "冰川", r: "冰川约9700年，是最慢的。" }] }]
  };
  C[1] = {
    name: "水的三态变化", meta: "汽化 · 液化 · 凝华 · 熔化", art: ART(2),
    bg: "冰、水、水汽，是同一种物质的三副面孔。它们的变身，推动着整个水循环。",
    sig: ["汽化、熔化吸热；液化、凝华放热。冬季雪线下移、夏季上移；变暖使冰川退缩、雪线上升。"],
    stages: [
      { title: "夏季", ms: 6000, go: function () { setR("warm", 0); season("summer"); }, lines: ["海面湖面的水吸热汽化，化作水汽上升。", "水汽遇冷液化成云，高空里还会凝华成冰晶。"] },
      { title: "冬季", ms: 6000, go: function () { season("winter"); }, lines: ["冬季气温低，雪线下移，积雪铺满更大范围。", "融水减少，河流变窄。"] },
      { title: "春夏融雪", ms: 5500, go: function () { season("summer"); }, lines: ["春夏积雪和冰川熔化，融水汇入河流。", "河流变宽，水量增加。"] },
      { title: "全球变暖", ms: 6500, go: function () { season("summer"); setR("warm", 3); }, lines: ["如果升温3°C：冰川退缩，雪线上升。", "海平面也随之微微抬升。"] }
    ],
    asks: [
      { before: 1, who: "雪线", q: "冬季到来，山上的雪线会怎样移动？", opts: [
        { t: "上移", r: "上移是夏季或变暖时的情形。" },
        { t: "下移", h: 1, r: "冬季气温低，积雪能存在的高度更低，雪线下移、积雪扩大。" }] },
      { before: 3, who: "全球变暖", q: "全球持续变暖，冰川融水对河流的补给会怎样？", opts: [
        { t: "一直增加", r: "冰川总量有限，融化到后期补给会减少。" },
        { t: "短期增多，长期减少", h: 1, r: "升温初期融水增多；冰川持续退缩后，可供融化的冰变少，补给减少。" },
        { t: "没有影响", r: "冰川融水对高山河流补给很重要，变暖影响明显。" }] }]
  };
  C[2] = {
    name: "海陆间循环", meta: "蒸发 → 水汽输送 → 降水 → 径流 → 回海", art: ART(3),
    bg: "一滴海水，要走多远的路，才能回到大海？跟着它走一圈。",
    sig: ["海陆间循环是最重要的水循环类型，使陆地上的水不断得到补充，水资源得以再生。"],
    stages: [
      { title: "完整循环", ms: 5000, go: function () { fid++; stop3(); set3("all"); resetView(); }, lines: ["海陆间循环，连起了海洋和陆地。", "它让陆地上的水不断得到补充。"] },
      { title: "① 蒸发", ms: 4500, go: function () { set3(0); }, lines: ["海面的水吸收太阳热量，蒸发成水汽。"] },
      { title: "② 水汽输送", ms: 5000, go: function () { set3(1); }, lines: ["水汽凝结成云，随风从海洋上空飘向陆地。"] },
      { title: "③ 降水", ms: 5000, go: function () { set3(2); }, lines: ["云团撞上高山迎风坡，被迫抬升，化作雨雪。"] },
      { title: "④ 地表径流", ms: 5000, go: function () { set3(3); }, lines: ["雨水汇入河流，经过水库，沿河道流回海洋。"] },
      { title: "⑤ 下渗", ms: 5000, go: function () { set3(4); }, lines: ["一部分雨水下渗，穿过土壤，补给地下水。"] },
      { title: "⑥ 地下径流", ms: 5500, go: function () { set3(5); }, lines: ["地下水沿透水层缓缓流回海洋，循环闭合。"] }
    ],
    asks: [
      { before: 2, who: "水汽输送", q: "海陆间循环中，水汽输送的方向是？", opts: [
        { t: "海洋上空 → 陆地上空", h: 1, r: "海洋蒸发的水汽被风带到陆地上空，再形成降水。" },
        { t: "陆地上空 → 海洋上空", r: "陆地→海洋的是地表径流和地下径流。" }] },
      { before: 3, who: "降水", q: "云团飘到高山的迎风坡，会发生什么？", opts: [
        { t: "绕山而过，不下雨", r: "空气遇山会被迫抬升，而不是绕开。" },
        { t: "被迫抬升，冷却降水", h: 1, r: "气流沿迎风坡上升冷却，水汽凝结，形成降水，山顶可能降雪。" },
        { t: "变暖消散", r: "变暖干燥是背风坡下沉气流的特点。" }] }]
  };
  C[3] = {
    name: "三类水循环", meta: "海上内循环 · 海陆间循环 · 陆地内循环", art: ART(4),
    bg: "同一片天空下，水其实走着三条不同的环路。",
    sig: ["参与水量：海上内循环最大，陆地内循环最小；海陆间循环使陆地水不断更新，是最重要的类型。"],
    stages: [
      { title: "三条环路", ms: 4500, go: function () { fid++; resetView(); cyc(true, true, true); }, lines: ["按发生的空间范围，水循环分成三类。"] },
      { title: "海上内循环", ms: 5500, go: function () { cyc(true, false, false); }, lines: ["海上内循环：海水蒸发，又降回海洋。", "参与的水量最大。"] },
      { title: "海陆间循环", ms: 5000, go: function () { cyc(false, true, false); }, lines: ["海陆间循环：连接海洋与陆地，最重要。"] },
      { title: "陆地内循环", ms: 6000, go: function () { cyc(false, false, true); fly(-0.45, 0.35, 26); }, lines: ["陆地内循环：山后的内流区自成一体。", "内流河注入内陆湖，湖水只能靠蒸发离开。"] },
      { title: "全球水循环", ms: 5000, go: function () { cyc(true, true, true); fly(-0.52, -0.42, 30); }, lines: ["三种循环同时进行，构成全球水循环。"] }
    ],
    asks: [
      { before: 1, who: "参与水量", q: "三类水循环中，参与水量最大的是？", opts: [
        { t: "海上内循环", h: 1, r: "海洋面积大、蒸发多，大部分水汽又降回海洋，水量最大。" },
        { t: "海陆间循环", r: "它最重要，但水量居中。" },
        { t: "陆地内循环", r: "陆地内循环水量最小。" }] },
      { before: 3, who: "内流区", q: "内流区的内陆湖，湖水主要靠什么方式离开？", opts: [
        { t: "经河流注入海洋", r: "内流区没有通往海洋的出口。" },
        { t: "蒸发", h: 1, r: "内陆湖没有出流，湖水只能靠蒸发离开，所以常成为咸水湖。" },
        { t: "下渗流到海里", r: "下渗的水仍在内流区内，不会直接回海。" }] }]
  };
  C[4] = {
    name: "下渗与地表径流", meta: "降水强度 · 坡度 · 植被 · 土壤 · 硬化", art: ART(5),
    bg: "一场暴雨落下，雨水有三条去路。走哪条，取决于它落在什么样的地面上。",
    sig: ["下渗减少：降水强度大、坡度大、地面硬化、黏土；下渗增多：植被覆盖率高、砂土。下渗少则洪峰高且早。"],
    stages: [
      { title: "三条去路", ms: 6000, go: function () { rain5(2, 10, 60, 0, 1); }, lines: ["雨水落地：一部分蒸发，一部分下渗，其余成为地表径流。"] },
      { title: "暴雨", ms: 6000, go: function () { rain5(3, 10, 60, 0, 1); }, lines: ["雨越急，来不及下渗的水越多，径流猛增。"] },
      { title: "植被消失", ms: 6000, go: function () { rain5(3, 20, 0, 0, 2); }, lines: ["坡更陡、植被被砍光、土是黏土。", "下渗越来越少，地表径流越来越多。"] },
      { title: "地面硬化", ms: 6500, go: function () { rain5(3, 20, 0, 90, 2); }, lines: ["地面铺满水泥，雨水几乎无法下渗。", "洪峰更高，来得更早，退得也快。"] },
      { title: "涵养水源", ms: 6500, go: function () { rain5(2, 5, 100, 0, 0); }, lines: ["植被茂密、坡缓、砂质土壤：下渗最多。", "地下水得到补给，洪峰也被削平。"] }
    ],
    asks: [
      { before: 1, who: "降水强度", q: "同一块地，降水强度从中雨变成暴雨，地表径流的比例会：", opts: [
        { t: "增加", h: 1, r: "下渗能力有限，雨越急，来不及下渗的水越多。" },
        { t: "减少", r: "雨大并不会让土壤吸得更快。" },
        { t: "不变", r: "降水强度是影响下渗的重要因素。" }] },
      { before: 3, who: "城市硬化", q: "地面大面积硬化后，暴雨的洪峰会怎样？", opts: [
        { t: "更高、更早", h: 1, r: "硬化地面几乎不透水，雨水迅速成为地表径流，汇流快，洪峰高且提前。" },
        { t: "更低、更晚", r: "那是增加下渗之后的效果。" },
        { t: "没有变化", r: "下垫面改变直接影响径流过程。" }] }]
  };
  C[5] = {
    name: "水循环的地理意义", meta: "水量平衡 · 物质能量 · 塑造地表 · 水资源更新", art: ART(6),
    bg: "水循环像一条传送带，把大气、海洋、岩石和生命串在了一起。",
    sig: ["水循环维持全球水量动态平衡，进行物质迁移与能量交换，塑造地表形态，使水资源不断更新。"],
    stages: [
      { title: "① 水量平衡", ms: 5500, go: function () { set6(0); }, lines: ["海洋蒸发多少，就有多少经降水和径流回来。", "全球水量保持动态平衡。"] },
      { title: "② 物质与能量", ms: 6000, go: function () { set6(1); }, lines: ["河流把泥沙搬进海洋。", "蒸发吸热、凝结放热，热量随水汽带到高纬。"] },
      { title: "③ 塑造地表", ms: 5500, go: function () { set6(2); }, lines: ["流水在上游切出V形谷，在河口堆出三角洲。"] },
      { title: "④ 水资源更新", ms: 6000, go: function () { set6(3); }, lines: ["淡水用掉了，又被降水补回来。", "水循环让水资源不断更新。"] }
    ],
    asks: [
      { before: 1, who: "能量交换", q: "海水蒸发、水汽凝结，对全球热量起什么作用？", opts: [
        { t: "把低纬的热量带到高纬", h: 1, r: "蒸发吸热、凝结放热，水汽从低纬流向高纬时把热量一并带去。" },
        { t: "让全球热量更不均衡", r: "水循环恰恰缓解了不同纬度热量收支的不平衡。" },
        { t: "没有影响", r: "相变伴随大量吸热放热，影响显著。" }] },
      { before: 2, who: "地表形态", q: "河口的三角洲，主要是流水的什么作用形成的？", opts: [
        { t: "侵蚀作用", r: "侵蚀作用在上游形成V形谷。" },
        { t: "堆积作用", h: 1, r: "河流入海时流速减慢，泥沙沉积，堆积成三角洲。" }] }]
  };
  C[6] = {
    name: "城市化与海绵城市", meta: "硬化率 · 洪峰 · 吸水蓄水渗水净水", art: ART(7),
    bg: "城市越长越大，泥土被水泥封住。一场暴雨，就能让街道变成河。",
    sig: ["城市化使下渗减少、径流增加、汇流加快，洪峰高且提前；海绵城市增加下渗与调蓄，削峰并推迟峰现。"],
    stages: [
      { title: "城市化以前", ms: 6000, go: function () { rain7(10, false); }, lines: ["硬化率只有10%，绿地和农田吸收了大量雨水。"] },
      { title: "水泥森林", ms: 6500, go: function () { rain7(85, false); }, lines: ["硬化率升到85%，下渗骤减，径流猛增。", "洪峰更高、来得更早，城市容易内涝。"] },
      { title: "海绵城市", ms: 7000, go: function () { rain7(85, true); }, lines: ["透水铺装、绿色屋顶、下沉式绿地、雨水花园。", "城市像海绵一样吸水蓄水，洪峰被削平、推迟。"] }
    ],
    asks: [
      { before: 1, who: "城市化", q: "硬化率从10%升到85%，同样的暴雨，洪峰会怎样？", opts: [
        { t: "更高、更早", h: 1, r: "下渗减少，雨水经管网迅速汇入河道，洪峰流量增大、峰现提前。" },
        { t: "更低、更晚", r: "那是海绵城市想要达到的效果。" },
        { t: "差不多", r: "下垫面硬化对径流影响很大。" }] },
      { before: 2, who: "海绵城市", q: "建成海绵城市后，洪峰会怎样变化？", opts: [
        { t: "削低并推迟", h: 1, r: "海绵设施先渗、先蓄，再慢慢释放，削减洪峰、推迟峰现。" },
        { t: "完全没有洪峰", r: "海绵城市不是不排水，暴雨时仍有径流。" },
        { t: "更高", r: "海绵城市增加下渗和调蓄，洪峰会降低。" }] }]
  };
  C[7] = {
    name: "人类活动的影响", meta: "水库 · 调水 · 造林 · 地下水 · 人工增雨", art: ART(8),
    bg: "人类改变不了天上的风，却可以改变地上的水往哪儿流。",
    sig: ["人类活动影响最大的是地表径流环节，也能影响下渗、蒸发和降水。"],
    stages: [
      { title: "修建水库", ms: 6000, go: function () { set8(0); }, lines: ["修建水库：汛期蓄洪，枯水期放水，削峰补枯。", "库区水面扩大，蒸发也会增加。"] },
      { title: "跨流域调水", ms: 5500, go: function () { set8(1); }, lines: ["南水北调这样的工程，改变了地表径流的空间分布。"] },
      { title: "植树造林", ms: 5500, go: function () { set8(2); }, lines: ["植树造林：下渗和蒸腾增加，地表径流减少。"] },
      { title: "超采地下水", ms: 6000, go: function () { set8(3); }, lines: ["过量抽取地下水，形成降落漏斗，引发地面沉降。", "沿海地区还会出现海水入侵。"] },
      { title: "人工增雨", ms: 5500, go: function () { set8(4); }, lines: ["人工增雨：向云中播撒催化剂，促使水汽凝结降水。"] }
    ],
    asks: [
      { before: 1, who: "影响环节", q: "目前人类活动对水循环影响最大的环节是？", opts: [
        { t: "水汽输送", r: "人类对大范围水汽输送影响很小。" },
        { t: "地表径流", h: 1, r: "修水库、调水、硬化地面，都直接改变地表径流。" },
        { t: "海洋蒸发", r: "海洋蒸发主要受太阳辐射和气温控制。" }] },
      { before: 4, who: "人工增雨", q: "人工增雨主要作用于水循环的哪个环节？", opts: [
        { t: "降水", h: 1, r: "催化剂促使云中水汽凝结成雨滴降落，只作用于降水环节。" },
        { t: "水汽输送", r: "人工增雨改变不了大范围的水汽输送。" },
        { t: "地下径流", r: "地下径流与人工增雨无直接关系。" }] }]
  };
  C[8] = {
    name: "水量平衡", meta: "P = E + R + ΔS", art: ART(9),
    bg: "地球上的水不增也不减。收与支之间，有一本精确的账。",
    sig: ["全球多年平均：海洋 降水 + 径流入海 = 蒸发；陆地 降水 = 蒸发 + 径流。流域 P = E + R + ΔS，多年平均 ΔS ≈ 0。"],
    stages: [
      { title: "全球账本", ms: 6000, go: function () { chk("f9", false); chk("in9", false); }, lines: ["从多年平均看，全球水量收支是平衡的。", "海洋：降水加径流入海，等于蒸发。"] },
      { title: "海陆之间", ms: 6000, go: function () { chk("f9", true); }, lines: ["海洋多蒸发的那部分，随水汽输送到陆地。", "再由径流一分不差地还给海洋。"] },
      { title: "流域账本", ms: 6000, go: function () { chk("in9", false); setR("p9", 800); setR("e9", 450); setR("r9", 300); }, lines: ["一个流域：降水等于蒸发、径流加蓄水变化。", "这一年收大于支，蓄水增加，水位上升。"] },
      { title: "多年平均", ms: 5000, go: function () { clk("#avg9"); }, lines: ["拉长到多年平均，蓄水变化约等于零。"] },
      { title: "内流区", ms: 5500, go: function () { chk("in9", true); }, lines: ["内流区没有径流流出。", "降水最终全部蒸发：P约等于E。"] }
    ],
    asks: [
      { before: 1, who: "水汽输送", q: "海洋→陆地的水汽输送量，和陆地径流入海量相比：", opts: [
        { t: "相等", h: 1, r: "多年平均，陆地降水比蒸发多出的部分以径流入海，正好等于海洋输送来的水汽量（都是36）。" },
        { t: "水汽输送更多", r: "如果更多，陆地水量会不断增加，不符合多年平衡。" },
        { t: "径流入海更多", r: "如果更多，陆地会越来越干。" }] },
      { before: 4, who: "内流区", q: "内流区多年平均，降水 P 与蒸发 E 的关系是？", opts: [
        { t: "P 约等于 E", h: 1, r: "内流区 R = 0，多年平均 ΔS ≈ 0，所以 P ≈ E。" },
        { t: "P 远大于 E", r: "多余的水无处可去，蓄水会无限增加，这不可能。" },
        { t: "P 远小于 E", r: "蒸发的水来自降水，不可能长期多于降水。" }] }]
  };

  var stage = document.querySelector(".x-stage"), tools = document.querySelector(".x-tools"), mnav = document.querySelector(".x-mnav");
  CINE.init({
    host: tools, before: tools.firstElementChild, stage: stage, kind: "geo",
    hide: [".x-stage #over", ".x-tip"],
    stopOn: ["#chaps button", "#prev", "#next", "#mPrev", "#mNext", "#panelBody input", "#panelBody button", "#panelBody label"],
    chapter: function () { return C[cur] || null; },
    next: function () { go(cur + 1); },
    onStop: function () { fid++; }
  });
  var wrap = tools.querySelector(".cn-wrap"), st = document.createElement("style"), mq = matchMedia("(max-width:1023px)");
  st.textContent = ".cn-cap p{display:inline-block;background:rgba(10,14,22,.62);padding:4px 14px;border-radius:12px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.cn-cap i{background:rgba(10,14,22,.62);padding:4px 9px;border-radius:7px}@media (max-width:1023px){.x-mnav{flex-wrap:wrap;row-gap:8px}.x-mnav .cn-wrap{flex:1 0 100%;justify-content:center}.x-mnav .cn-wrap .cn-b{flex:0 0 auto;min-height:36px;height:36px;font-size:13px;border-radius:999px;border:1px solid var(--line,rgba(128,128,128,.35));background:transparent;color:inherit}.x-mnav .cn-wrap .cn-b[aria-pressed=true]{background:#0071e3;color:#fff}.x-panel{padding-bottom:calc(150px + env(safe-area-inset-bottom))!important}}";
  document.head.appendChild(st);
  function place() { if (mq.matches) { if (wrap.parentNode !== mnav) mnav.insertBefore(wrap, mnav.firstChild); } else if (wrap.parentNode !== tools) tools.insertBefore(wrap, tools.firstElementChild); }
  mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place);
  place();
})();
