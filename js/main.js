// ============================================================
// Herbal Shop 百草堂 v3 — 完整泡茶工序 + 长线经营
// 工序：水桶→茶壶→火炉加热→茶杯放药材→注热水→上茶
// 长线：金币升级（自来水/电陶炉/跑堂/座位…）→ 🔖声望解锁药材
// ============================================================

// ---- 音效 ----
let AC = null;
function beep(freq, dur, type = "square", vol = 0.1, delay = 0) {
  try {
    if (state.muted) return;
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + delay;
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(AC.destination);
    o.start(t); o.stop(t + dur);
  } catch (e) { }
}
const SFX = {
  pick:    () => beep(660, 0.05),
  pour:    () => { beep(520, 0.1, "sine", 0.12); beep(440, 0.14, "sine", 0.1, 0.08); },
  boil:    () => { beep(988, 0.12, "triangle", 0.12); beep(1319, 0.16, "triangle", 0.1, 0.1); },
  arrive:  () => { beep(523, 0.07); beep(659, 0.09, "square", 0.1, 0.06); },
  serve:   () => { beep(784, 0.06); beep(1047, 0.1, "triangle", 0.14, 0.06); beep(1319, 0.12, "triangle", 0.12, 0.14); },
  wrong:   () => { beep(196, 0.2, "sawtooth", 0.12); beep(147, 0.25, "sawtooth", 0.1, 0.12); },
  leave:   () => beep(330, 0.15, "sawtooth", 0.07),
  streak:  () => [880, 1109, 1319, 1760].forEach((f, i) => beep(f, 0.09, "triangle", 0.12, i * 0.07)),
  unlock:  () => [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.1, "triangle", 0.12, i * 0.08)),
  buy:     () => { beep(440, 0.06); beep(660, 0.08, "square", 0.1, 0.05); },
  deliver: () => { beep(349, 0.08); beep(523, 0.1, "square", 0.1, 0.07); },
  dayEnd:  () => [659, 523, 440, 523].forEach((f, i) => beep(f, 0.2, "triangle", 0.12, i * 0.18)),
};

// ---- 数据：药材 ----
const HERBS = [
  { id: "goji",     icon: "🍒", name: "Goji Berry",    cn: "枸杞",   cost: 0 },
  { id: "chrys",    icon: "🌼", name: "Chrysanthemum", cn: "菊花",   cost: 0 },
  { id: "licorice", icon: "🌿", name: "Licorice",      cn: "甘草",   cost: 0 },
  { id: "jujube",   icon: "🌰", name: "Red Date",      cn: "红枣",   cost: 0 },
  { id: "mint",     icon: "🍃", name: "Mint",          cn: "薄荷",   cost: 0 },
  { id: "ginger",   icon: "🫚", name: "Ginger",        cn: "生姜",   cost: 0 },
  { id: "ginseng",  icon: "🥕", name: "Ginseng",       cn: "人参",   cost: 0 },
  { id: "lingzhi",  icon: "🍄", name: "Lingzhi",       cn: "灵芝",   cost: 0 },
  { id: "peel",     icon: "🍊", name: "Tangerine Peel",cn: "陈皮",   cost: 20 },
  { id: "honey",    icon: "🌸", name: "Honeysuckle",   cn: "金银花", cost: 25 },
  { id: "longan",   icon: "🟤", name: "Longan",        cn: "桂圆",   cost: 30 },
  { id: "monk",     icon: "🥝", name: "Monk Fruit",    cn: "罗汉果", cost: 35 },
  { id: "coix",     icon: "🌾", name: "Coix Seed",     cn: "薏米",   cost: 40 },
  { id: "astrag",   icon: "🍂", name: "Astragalus",    cn: "黄芪",   cost: 50 },
  { id: "angelica", icon: "🌷", name: "Angelica",      cn: "当归",   cost: 60 },
  { id: "cordy",    icon: "🐛", name: "Cordyceps",     cn: "虫草",   cost: 100 },
];

// ---- 数据：茶方 ----
const FORMULAS = [
  { id: "eye",     name: "Screen-Eye Tea",    cn: "明目茶",     herbs: ["goji", "chrys"],          pay: 8,  merit: 2, face: "🧑‍🎓", who: "Exhausted Student",
    line: "My eyes burn from all-night studying 📖",       hint: "for tired eyes" },
  { id: "cold",    name: "Ginger-Date Warmer",cn: "姜枣茶",     herbs: ["ginger", "jujube"],       pay: 8,  merit: 2, face: "🧓", who: "Shivering Elder",
    line: "I'm freezing… even in July 🥶",                 hint: "for inner cold" },
  { id: "throat",  name: "Throat Soothe",     cn: "润喉茶",     herbs: ["licorice", "mint"],       pay: 8,  merit: 2, face: "👩‍🎤", who: "Hoarse Singer",
    line: "Lost my voice right before the show 🎤",        hint: "for sore throat" },
  { id: "energy",  name: "Energy Tonic",      cn: "参枣补气茶", herbs: ["ginseng", "jujube"],      pay: 9,  merit: 2, face: "🧑‍💼", who: "Drained Worker",
    line: "Double shifts have completely drained me 😮‍💨", hint: "for exhaustion" },
  { id: "immune",  name: "Immune Boost",      cn: "灵芝枸杞茶", herbs: ["lingzhi", "goji"],        pay: 10, merit: 2, face: "🤒", who: "Frail Patient",
    line: "I catch every cold going around 🤧",            hint: "for weak immunity" },
  { id: "cool",    name: "Cooling Chrysanthemum", cn: "清热菊花茶", herbs: ["chrys", "mint"],      pay: 8,  merit: 2, face: "🥵", who: "Hotpot Victim",
    line: "Way too much hotpot last night 🔥",             hint: "for inner heat" },
  { id: "stomach", name: "Stomach Settler",   cn: "陈皮姜茶",   herbs: ["peel", "ginger"],         pay: 12, merit: 4, face: "🤢", who: "Bloated Foodie",
    line: "Three banquets this week… my stomach hates me", hint: "for bloating" },
  { id: "detox",   name: "Honeysuckle Detox", cn: "金银花茶",   herbs: ["honey", "licorice"],      pay: 13, merit: 4, face: "😖", who: "Breakout Teen",
    line: "Prom is Friday and LOOK at my face!",           hint: "for heat rash & acne" },
  { id: "sleep",   name: "Longan Calm",       cn: "桂圆安神茶", herbs: ["longan", "jujube"],       pay: 14, merit: 4, face: "😴", who: "Sleepless Coder",
    line: "Haven't slept a full night in months…",         hint: "for insomnia" },
  { id: "voice",   name: "Monk Fruit Cooler", cn: "罗汉果茶",   herbs: ["monk", "mint"],           pay: 14, merit: 4, face: "🧑‍🏫", who: "Raspy Teacher",
    line: "Six classes a day is murder on the throat",     hint: "for chronic cough" },
  { id: "damp",    name: "Dampness Drain",    cn: "薏米祛湿茶", herbs: ["coix", "peel"],           pay: 15, merit: 4, face: "🌧️", who: "Humidity Sufferer",
    line: "This rainy season makes my body feel like lead",hint: "for heavy limbs" },
  { id: "blood",   name: "Qi & Blood Tonic",  cn: "黄芪当归茶", herbs: ["astrag", "angelica", "jujube"], pay: 20, merit: 8, face: "🧕", who: "Pale Convalescent",
    line: "The hospital discharged me, but I still feel empty", hint: "post-illness recovery" },
  { id: "elixir",  name: "Cordyceps Elixir",  cn: "虫草灵芝汤", herbs: ["cordy", "lingzhi", "ginseng"],  pay: 30, merit: 8, face: "🎩", who: "Wealthy Regular",
    line: "Money is no object. Your finest brew, doctor.", hint: "the legendary tonic" },
  // ---- 三味进阶方 ----
  { id: "owl",     name: "Night Owl Recovery", cn: "熬夜回血茶", herbs: ["goji", "chrys", "longan"],      pay: 18, merit: 6, face: "🧑‍💻", who: "Deadline Zombie",
    line: "Three all-nighters. I can hear colors.",        hint: "post-all-nighter rescue" },
  { id: "summer",  name: "Midsummer Cooler",   cn: "三伏清凉茶", herbs: ["honey", "chrys", "mint"],       pay: 17, merit: 6, face: "🧑‍🌾", who: "Sun-baked Farmer",
    line: "The field was 40 degrees today. FORTY.",        hint: "triple-cooling blend" },
  { id: "singer",  name: "Singer's Guard",     cn: "润喉清肺茶", herbs: ["monk", "licorice", "mint"],     pay: 16, merit: 6, face: "🧑‍🎤", who: "Opera Star",
    line: "Opening night is tomorrow. My throat MUST hold.", hint: "professional voice care" },
  { id: "spleen",  name: "Damp-Buster Deluxe", cn: "祛湿健脾茶", herbs: ["coix", "peel", "astrag"],       pay: 18, merit: 6, face: "🧑‍🍳", who: "Swollen Chef",
    line: "I taste-test all day and my legs feel like dough.", hint: "dampness + weak digestion" },
  // ---- 四味顶级方 ----
  { id: "four",    name: "Four Treasures",     cn: "元气四宝茶", herbs: ["ginseng", "astrag", "goji", "jujube"], pay: 26, merit: 8, face: "💪", who: "Recovering Athlete",
    line: "Coach says I'm done if I can't recover by March.", hint: "four-way qi recharge" },
  { id: "beauty",  name: "Beauty Glow",        cn: "女神养颜茶", herbs: ["angelica", "longan", "goji", "jujube"], pay: 32, merit: 10, face: "💃", who: "Anxious Bride",
    line: "The wedding is in TEN DAYS. Fix my complexion!", hint: "blood-nourishing glow" },
  { id: "ten",     name: "Ten-Tonic Soup",     cn: "十全大补汤", herbs: ["cordy", "lingzhi", "ginseng", "angelica"], pay: 45, merit: 10, face: "👑", who: "Old Money Matriarch",
    line: "The full restoration. Spare nothing, doctor.",  hint: "the ultimate formula" },
];

// 上错茶：顾客收下但牢骚两句
const GRUMBLE_LINES = [
  "This… is NOT what I ordered.",
  "Ugh. Fine, I'm thirsty anyway.",
  "Tastes like a dare.",
  "I'm only paying half for this.",
  "Wrong tea. AGAIN?!",
  "My grandmother brews better.",
];

// ---- 数据：店铺升级 ----
const UPGRADES = [
  { id: "bowl",     icon: "🍵", name: "Extra Cups",   cn: "添置茶杯", cost: 60,  desc: "6 tea cups instead of 4" },
  { id: "chairs",   icon: "🪑", name: "Comfy Chairs", cn: "太师椅",   cost: 80,  desc: "Customers wait 55s instead of 40s" },
  { id: "sign",     icon: "🏮", name: "Red Lanterns", cn: "红灯笼",   cost: 100, desc: "Tips +50%" },
  { id: "warmer",   icon: "🧣", name: "Cozy Decor",   cn: "暖帘",     cost: 120, desc: "Patience drains 25% slower" },
  { id: "seat",     icon: "💺", name: "Fourth Seat",  cn: "第四席",   cost: 150, desc: "Serve 4 customers at once" },
  { id: "autostove",icon: "⚡", name: "Auto Stove",   cn: "电陶炉",   cost: 200, desc: "Teapot heats itself in 2s — no clicking" },
  { id: "autopour", icon: "🫗", name: "Auto Pourer", cn: "自动倒水器", cost: 350, need: "autostove", desc: "After boiling, auto-pours into cups that already hold herbs" },
  { id: "ladle",    icon: "✨", name: "Golden Ladle", cn: "金药勺",   cost: 200, desc: "Every cup pays +🪙2" },
  { id: "tapwater", icon: "🚰", name: "Tap Water",    cn: "自来水",   cost: 250, desc: "No more water tanks — 🪙1 per teapot fill" },
  { id: "runner",   icon: "🏃", name: "Tea Runner",   cn: "跑堂小二", cost: 300, desc: "Brewed cups auto-serve after 1s" },
  { id: "hall1",    icon: "🏠", name: "Bigger Shop",  cn: "扩建店面", cost: 400, desc: "5 customer seats" },
  { id: "hall2",    icon: "🏯", name: "Grand Hall",   cn: "二层茶楼", cost: 800, desc: "6 customer seats" },
];

const ANGRY_LINES = ["This isn't what I asked for!", "Are you trying to poison me?!", "Wrong brew! I'm leaving!"];
const HAPPY_LINES = ["Ah… I can feel it working already.", "The old ways really work.", "Worth every coin."];
const LEAVE_LINES  = ["Too slow… I'll try the pharmacy.", "I've waited long enough!"];

// ---- 状态 ----
const SHIFT_LEN = 300;          // 一班 5 分钟
const TANK_CAP  = 15;           // 一桶水 = 15 杯
const POT_CAP   = 5;            // 一壶 = 5 杯
const TANK_COST = 3;            // 送水 🪙3
const EVAP_SEC  = 6;            // 热水每 6 秒蒸发 1 杯
const SAVE_KEY = "herbal_shop_v3";
const state = {
  coins: 0, merit: 0, day: 1,
  served: 0, missed: 0, streak: 0, dayCoins: 0,
  totalServed: 0, bestDay: 0,
  timeLeft: SHIFT_LEN,
  muted: false, over: false, lang: "en",
  unlockedHerbs: {}, upgrades: {},
  tank: TANK_CAP,               // 水桶剩余杯数
  delivery: -1,                 // 送水倒计时（-1=无）
  teapot: { mode: "empty", water: 0, heat: 0, evap: 0 },   // empty/cold/heating/hot
  cups: [],                     // [{herbs:[], brewed:null|formulaId|"waste"}]
  selCup: 0,
};
HERBS.forEach(h => { state.unlockedHerbs[h.id] = h.cost === 0; });

let slots = [];
let spawnIn = 1.5;
let rushLeft = 0, nextRush = 50;   // 爆单时刻：随机触发15秒，小费×2、刷客加速

function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    Object.assign(state, s);
    if (!state.lang || !I18N[state.lang]) state.lang = "en";
    HERBS.forEach(h => { if (state.unlockedHerbs[h.id] === undefined) state.unlockedHerbs[h.id] = h.cost === 0; });
    state.timeLeft = SHIFT_LEN; state.over = false;
    state.served = 0; state.missed = 0; state.streak = 0; state.dayCoins = 0;
    state.delivery = -1;
    if (!state.teapot) state.teapot = { mode: "empty", water: 0, heat: 0, evap: 0 };
    if (!Array.isArray(state.cups)) state.cups = [];
  } catch (e) { }
}

// ---- 派生数值 ----
const cupCount  = () => state.upgrades.bowl ? 6 : 4;
const slotCount = () => 3 + (state.upgrades.seat ? 1 : 0) + (state.upgrades.hall1 ? 1 : 0) + (state.upgrades.hall2 ? 1 : 0);
const patMax    = () => state.upgrades.chairs ? 55 : 40;
const decayMult = () => state.upgrades.warmer ? 0.75 : 1;
const tipMult   = () => (state.upgrades.sign ? 1.5 : 1) * (rushLeft > 0 ? 2 : 1);   // 爆单时小费×2
const payBonus  = () => state.upgrades.ladle ? 2 : 0;
const heatTime  = () => state.upgrades.autostove ? 2 : 4;
const spawnPace = () => Math.max(0.55, 1 - 0.06 * (state.day - 1));
const formulaUnlocked = f => f.herbs.every(id => state.unlockedHerbs[id]);
const availableFormulas = () => FORMULAS.filter(formulaUnlocked);
const formulaByHerbs = herbs => {
  const key = [...herbs].sort().join(",");
  return FORMULAS.find(f => [...f.herbs].sort().join(",") === key) || null;
};

const $ = id => document.getElementById(id);

// ---- 渲染：药材架 ----
function renderShelf() {
  const shelf = $("shelf");
  shelf.innerHTML = "";
  HERBS.filter(h => state.unlockedHerbs[h.id]).forEach(h => {
    const el = document.createElement("div");
    el.className = "herb"; el.dataset.id = h.id;
    el.innerHTML = `<span class="herb-icon">${iconOf(h.id, h.icon)}</span><span class="herb-name">${h.name}</span><span class="herb-cn">${h.cn}</span>`;
    el.addEventListener("pointerdown", herbPointerDown);
    shelf.appendChild(el);
  });
}

// ---- 渲染：药方书 ----
function renderBook() {
  const list = $("formula-list");
  list.innerHTML = "";
  FORMULAS.forEach(f => {
    const el = document.createElement("div");
    const ok = formulaUnlocked(f);
    el.className = "formula" + (ok ? "" : " locked");
    const icons = f.herbs.map(id => { const h = HERBS.find(x => x.id === id); return iconOf(h.id, h.icon, "sm"); }).join(" + ");
    if (ok) {
      el.innerHTML = `<span class="f-name">${f.name}</span><span class="f-cn">${f.cn}</span><span class="f-pay">🪙${f.pay} 🔖${f.merit}</span>
        <div class="f-herbs">${icons}</div><div class="f-for">${f.hint}</div>`;
    } else {
      const missing = f.herbs.filter(id => !state.unlockedHerbs[id])
        .map(id => { const h = HERBS.find(x => x.id === id); return `${iconOf(h.id, h.icon, "sm")}${h.cn}`; }).join(" + ");
      el.innerHTML = `<span class="f-name">🔒 ${f.name}</span><span class="f-cn">${f.cn}</span>
        <div class="f-for">${t("needs")} ${missing}</div>`;
    }
    list.appendChild(el);
  });
}

// ---- 渲染：药材解锁 ----
function renderUnlock() {
  const box = $("herb-unlock");
  box.innerHTML = "";
  HERBS.filter(h => h.cost > 0).forEach(h => {
    const owned = state.unlockedHerbs[h.id];
    const can = !owned && state.merit >= h.cost;
    const el = document.createElement("div");
    el.className = "unlock-item " + (owned ? "owned" : can ? "can" : "cannot");
    el.innerHTML = `<span class="ui-icon">${iconOf(h.id, h.icon)}</span>
      <span class="ui-body"><b>${h.name}</b> <span class="ui-cn">${h.cn}</span></span>
      <span class="ui-cost">${owned ? "✓" : "🔖" + h.cost}</span>`;
    if (can) el.addEventListener("click", () => unlockHerb(h));
    box.appendChild(el);
  });
}
function unlockHerb(h) {
  if (state.merit < h.cost || state.unlockedHerbs[h.id]) return;
  state.merit -= h.cost;
  state.unlockedHerbs[h.id] = true;
  SFX.unlock(); save();
  const newFormulas = FORMULAS.filter(f => formulaUnlocked(f) && f.herbs.includes(h.id));
  toast(`UNLOCKED: ${h.icon} ${h.name} ${h.cn}!` + (newFormulas.length ? ` New formula: ${newFormulas.map(f => f.cn).join("、")}` : ""));
  renderShelf(); renderBook(); renderUnlock(); renderTop();
}

// ---- 渲染：店铺升级 ----
function renderUpgrades() {
  const box = $("upgrade-list");
  box.innerHTML = "";
  UPGRADES.forEach(u => {
    const locked = u.need && !state.upgrades[u.need];   // 前置升级未买
    const bought = state.upgrades[u.id];
    const can = !bought && !locked && state.coins >= u.cost;
    const el = document.createElement("div");
    el.className = "upgrade " + (bought ? "owned" : can ? "can" : "cannot");
    el.innerHTML = `<span class="up-icon">${u.icon}</span>
      <span class="up-body"><b>${u.name}</b> <span class="ui-cn">${u.cn}</span><br><i>${u.desc}</i></span>
      ${locked ? `<div class="up-req">🔒 ${t("auto_stove")}</div>` : ""}
      <span class="up-cost">${bought ? "✓" : "🪙" + u.cost}</span>`;
    if (can) el.addEventListener("click", () => buyUpgrade(u));
    box.appendChild(el);
  });
}
function buyUpgrade(u) {
  if (state.upgrades[u.id] || state.coins < u.cost) return;
  if (u.need && !state.upgrades[u.need]) return;
  state.coins -= u.cost;
  state.upgrades[u.id] = true;
  SFX.buy(); save();
  toast(`SHOP UPGRADED: ${u.icon} ${u.name} — ${u.desc}`);
  if (u.id === "seat" || u.id === "hall1" || u.id === "hall2") ensureSlots();
  if (u.id === "bowl") renderCups();
  renderStations(); renderUpgrades(); renderTop();
}

// ---- 泡茶台：水桶 / 茶壶 / 火炉 ----
// 中文模式下不再追加中文角标（其他语言保留中文角标作品牌点缀）
const cnTag = s => state.lang === "zh" ? "" : ` <span class="ui-cn">${s}</span>`;
function renderStations() {
  // 水桶
  const tank = $("tank");
  if (state.upgrades.tapwater) {
    tank.className = "station on";
    tank.innerHTML = `<div class="st-icon">${iconOf("tank")}</div><div class="st-name">${t("tap_water")}${cnTag("自来水")}</div>
      <div class="st-sub">${t("metered")}</div><div class="st-hint">${t("tap_to_fill")}</div>`;
  } else if (state.delivery >= 0) {
    tank.className = "station";
    tank.innerHTML = `<div class="st-icon">🚚</div><div class="st-name">${t("delivering")}</div>
      <div class="st-sub">${Math.ceil(state.delivery)}s</div><div class="st-hint">${t("water_coming")}</div>`;
  } else {
    const empty = state.tank <= 0;
    tank.className = "station" + (empty ? " empty" : " on");
    tank.innerHTML = `<div class="st-icon">${iconOf("tank")}</div><div class="st-name">${t("water_tank")}${cnTag("水桶")}</div>
      <div class="st-sub">💧 ${Math.max(state.tank, 0)} / ${TANK_CAP} cups</div>
      ${empty ? `<button class="st-btn" id="refill-btn">${t("refill", { n: TANK_COST })}</button>` : `<div class="st-hint">${t("tap_to_fill")}</div>`}`;
    const btn = $("refill-btn");
    if (btn) btn.addEventListener("click", e => { e.stopPropagation(); callDelivery(); });
  }
  // 茶壶
  const tp = $("teapot"), pot = state.teapot;
  let sub = "", hint = "", cls = "station";
  if (pot.mode === "empty")        { sub = t("st_empty"); hint = state.upgrades.tapwater ? t("tap_fill_bill") : t("fill_from_tank"); }
  else if (pot.mode === "cold")    { sub = t("st_cold", { w: pot.water }); hint = state.upgrades.autostove ? "" : t("tap_to_fire"); cls += " cold"; }
  else if (pot.mode === "heating") { sub = t("st_heating", { n: Math.max(pot.heat, 0).toFixed(1) }); cls += " heating"; }
  else if (pot.mode === "hot")     { sub = t("st_hot", { w: pot.water, e: Math.max(EVAP_SEC - pot.evap, 0).toFixed(0) }); hint = state.upgrades.autopour ? t("autopour_hint") : t("pour_cup"); cls += " hot"; }
  tp.className = cls;
  tp.innerHTML = `<div class="st-icon">${iconOf("teapot")}</div><div class="st-name">${t("teapot")}${cnTag("茶壶")}</div>
    <div class="st-sub">${sub}</div>${hint ? `<div class="st-hint">${hint}</div>` : ""}`;
  // 火炉
  const st = $("stove");
  const burning = pot.mode === "heating";
  st.className = "station" + (burning ? " heating" : "");
  st.innerHTML = `<div class="st-icon">${iconOf("stove")}</div>
    <div class="st-name">${state.upgrades.autostove ? t("auto_stove") : t("stove")}${cnTag(state.upgrades.autostove ? "电陶炉" : "火炉")}</div>
    <div class="st-sub">${burning ? t("st_heating", { n: Math.max(pot.heat, 0).toFixed(1) }) : state.upgrades.autostove ? t("auto_hint") : t("st_idle")}</div>`;
}

function fillTeapot() {
  const t = state.teapot;
  if (t.mode !== "empty") { toast("Teapot isn't empty yet."); return; }
  if (state.upgrades.tapwater) {
    if (state.coins < 1) { toast("Not enough coins for the water bill!"); return; }
    state.coins -= 1;
    t.water = POT_CAP;
  } else {
    if (state.tank <= 0) { toast("Tank is empty — call the water man! 🚚"); return; }
    const take = Math.min(POT_CAP, state.tank);
    state.tank -= take;
    t.water = take;
  }
  SFX.pour();
  if (state.upgrades.autostove) { t.mode = "heating"; t.heat = heatTime(); t.evap = 0; }
  else t.mode = "cold";
  renderStations(); renderTop();
}

function fireStove() {
  const t = state.teapot;
  if (t.mode !== "cold") return;
  t.mode = "heating"; t.heat = heatTime(); t.evap = 0;
  SFX.pick(); renderStations();
}

function callDelivery() {
  if (state.delivery >= 0 || state.tank > 0) return;
  if (state.coins < TANK_COST) { toast("Not enough coins for water delivery!"); return; }
  state.coins -= TANK_COST;
  state.delivery = 5;
  SFX.buy(); renderStations(); renderTop();
}

// ---- 茶杯区 ----
function renderCups() {
  const box = $("cups");
  box.style.gridTemplateColumns = `repeat(${cupCount()}, minmax(0, 1fr))`;
  box.innerHTML = "";
  while (state.cups.length < cupCount()) state.cups.push({ herbs: [], brewed: null, dumpArm: false });
  state.cups.length = cupCount();
  if (state.selCup >= cupCount()) state.selCup = 0;
  state.cups.forEach((c, i) => {
    const el = document.createElement("div");
    let cls = "cup";
    if (i === state.selCup && !c.brewed) cls += " sel";
    if (c.brewed === "waste") cls += " waste";
    else if (c.brewed) cls += " brewed";
    let inner = "";
    if (c.brewed === "waste") {
      inner = `<div class="cup-face">😖</div><div class="cup-label">${t("murky")}</div><div class="cup-hint">${t("tap_dump")}</div>`;
    } else if (c.brewed) {
      const f = FORMULAS.find(x => x.id === c.brewed);
      inner = `<div class="cup-face">${iconOf("cup", "🍵")}</div><div class="cup-label">${f.cn}</div><div class="cup-hint">${state.upgrades.runner ? t("runner_coming") : t("tap_serve")}</div>`;
    } else if (c.herbs.length) {
      inner = `<div class="cup-chips">${c.herbs.map((id, j) => { const h = HERBS.find(x => x.id === id); return `<span class="cup-chip" data-cup="${i}" data-idx="${j}">${iconOf(h.id, h.icon)}</span>`; }).join("")}</div>
        <div class="cup-hint">${t("add_or_pour")}</div>`;
    } else {
      inner = `<div class="cup-face dim">${iconOf("cup", "🍵")}</div><div class="cup-hint">${i === state.selCup ? t("sel_add") : t("tap_select")}</div>`;
    }
    el.className = cls; el.innerHTML = inner;
    el.addEventListener("click", () => cupClicked(i));
    if (c.brewed && c.brewed !== "waste") el.addEventListener("pointerdown", cupDragStart);
    box.appendChild(el);
  });
  // 杯中药材可点出
  box.querySelectorAll(".cup-chip").forEach(ch => {
    ch.addEventListener("click", e => {
      e.stopPropagation();
      const ci = +ch.dataset.cup, hi = +ch.dataset.idx;
      state.cups[ci].herbs.splice(hi, 1);
      renderCups(); SFX.pick();
    });
  });
}

function cupClicked(i) {
  if (state.over) return;
  const c = state.cups[i];
  if (c.brewed === "waste") {
    c.brewed = null; c.herbs = []; c.dumpArm = false;
    toast("Dumped the murky brew. The herbs are lost."); SFX.leave();
    renderCups(); return;
  }
  if (c.brewed) { serveCup(i); return; }
  // 未冲泡：选杯；若已有药材且茶壶有热水 → 注水冲泡
  if (c.herbs.length > 0 && state.teapot.mode === "hot" && state.teapot.water > 0) {
    state.teapot.water--;
    if (state.teapot.water <= 0) { state.teapot.mode = "empty"; state.teapot.water = 0; }
    const f = formulaByHerbs(c.herbs);
    c.brewed = f ? f.id : "waste";
    c.brewTick = tickN;   // 记录冲泡时刻：5秒内上茶触发"闪电上茶"
    SFX.pour();
    if (f) setTimeout(SFX.boil, 150);
    renderCups(); renderStations();
    // 跑堂小二：1 秒后自动上茶
    if (f && state.upgrades.runner) {
      setTimeout(() => { if (state.cups[i] && state.cups[i].brewed === f.id) serveCup(i); }, 1000);
    }
    return;
  }
  if (c.herbs.length > 0 && state.teapot.mode !== "hot") {
    state.selCup = i;
    toast("No hot water! Fill the teapot and fire the stove. 🔥");
    renderCups(); return;
  }
  state.selCup = i;
  renderCups(); SFX.pick();
}

function addHerbToCup(id) {
  if (state.over) return;
  let c = state.cups[state.selCup];
  if (!c || c.brewed) { state.selCup = state.cups.findIndex(x => !x.brewed); c = state.cups[state.selCup]; }
  if (!c) { toast("All cups are brewed — serve them first!"); return; }
  if (c.herbs.length >= 4) { toast("This cup is full — pour water or pick another cup."); return; }
  c.herbs.push(id);
  c.dumpArm = false;
  renderCups(); SFX.pick();
}

// ---- 上茶 ----
// 自动上茶：在点了这味茶的顾客中，优先给耐心最低的（最急的先给）
function serveCup(i) {
  const c = state.cups[i];
  if (!c || !c.brewed || c.brewed === "waste") return;
  const f = FORMULAS.find(x => x.id === c.brewed);
  let best = -1;
  slots.forEach((s, idx) => {
    if (s && s.orders.some(o => o.f.id === f.id && o.qty > 0)) {
      if (best === -1 || s.patience < slots[best].patience) best = idx;
    }
  });
  if (best === -1) {
    // 没人点这杯：第一次点击警告，第二次倒掉
    if (c.dumpArm) {
      c.brewed = null; c.herbs = []; c.dumpArm = false;
      toast(`Dumped the ${f.name}. Nobody ordered it.`); SFX.leave();
    } else {
      c.dumpArm = true;
      toast(`Nobody ordered ${f.cn} right now. Tap again to dump it.`);
    }
    renderCups(); return;
  }
  doServe(i, best);
}

// 拖杯指定上茶
function serveCupTo(i, idx) {
  const c = state.cups[i];
  const s = slots[idx];
  if (!c || !c.brewed || c.brewed === "waste" || !s) return;
  const f = FORMULAS.find(x => x.id === c.brewed);
  if (!s.orders.some(o => o.f.id === f.id && o.qty > 0)) {
    wrongAccept(i, idx);   // 上错了：收下但半价 + 牢骚
    return;
  }
  doServe(i, idx);
}

// 上错茶：顾客勉强收下，半价、无小费、断连击、牢骚两句
function wrongAccept(i, idx) {
  const c = state.cups[i];
  const s = slots[idx];
  const f = FORMULAS.find(x => x.id === c.brewed);
  const earn = Math.max(2, Math.round(f.pay * 0.5));
  state.coins += earn; state.dayCoins += earn;
  state.merit += 1;
  state.streak = 0;
  const g1 = GRUMBLE_LINES[Math.floor(Math.random() * GRUMBLE_LINES.length)];
  let g2 = GRUMBLE_LINES[Math.floor(Math.random() * GRUMBLE_LINES.length)];
  if (g2 === g1) g2 = GRUMBLE_LINES[(GRUMBLE_LINES.indexOf(g1) + 1) % GRUMBLE_LINES.length];
  toast(`${s.orders[0].f.face} "${g1}" … "${g2}"<br>Wrong cup taken for 🪙${earn} — they STILL want their ${s.orders.filter(o => o.qty > 0).map(o => o.f.cn).join(" + ")}!`);
  SFX.wrong();
  const badFace = document.querySelector(`.customer-slot[data-slot="${idx}"] .cust-face`);
  if (badFace) { badFace.classList.add("mad"); setTimeout(() => badFace.classList.remove("mad"), 1200); }
  shakeFX();   // 上错茶：屏幕扭动一下，节目效果
  c.brewed = null; c.herbs = []; c.dumpArm = false;
  renderCups(); renderTop();
}

function doServe(i, idx) {
  const c = state.cups[i];
  const s = slots[idx];
  const f = FORMULAS.find(x => x.id === c.brewed);
  const order = s.orders.find(o => o.f.id === f.id && o.qty > 0);
  order.qty--;
  const tip = Math.round(s.patience / patMax() * 6 * tipMult());
  const earn = f.pay + payBonus() + tip;
  state.coins += earn; state.dayCoins += earn;
  state.merit += f.merit;
  state.served++; state.totalServed++; state.streak++;
  showFloat("+🪙" + earn, document.querySelector(`.customer-slot[data-slot="${idx}"]`));
  SFX.serve();
  // 爆点：闪电上茶⚡ —— 冲泡完成 5 秒内端给客人，额外奖励
  if (c.brewTick !== undefined && (tickN - c.brewTick) * 0.1 <= 5) {
    state.coins += 2; state.dayCoins += 2;
    showFloat("⚡+🪙2", document.querySelector(`.customer-slot[data-slot="${idx}"]`));
    toast(t("lightning", { n: 2 }));
  }
  c.brewed = null; c.herbs = []; c.dumpArm = false;
  if (state.streak > 0 && state.streak % 5 === 0) {
    state.coins += 10; state.dayCoins += 10;
    toast(t("combo_n", { n: state.streak }));
    SFX.streak(); shakeFX();
    if (state.streak % 10 === 0) flashFX();
  }
  const left = s.orders.reduce((a, o) => a + o.qty, 0);
  if (left <= 0) {
    toast(`"${HAPPY_LINES[Math.floor(Math.random() * HAPPY_LINES.length)]}" ${f.face} +🪙${earn} +🔖${f.merit}`);
    const faceEl = document.querySelector(`.customer-slot[data-slot="${idx}"] .cust-face`);
    if (faceEl) { faceEl.textContent = "😊"; faceEl.classList.add("pop"); }
    // 爆点：土豪顾客结账 → 金币雨；网红顾客 → 直播涨声望
    if (s.whale) {
      state.coins += 15; state.dayCoins += 15;
      coinRain(); toast(t("whale"));
      showFloat("+🪙15", document.querySelector(`.customer-slot[data-slot="${idx}"]`));
    }
    if (s.streamer) {
      state.merit += 5;
      flashFX(); toast(t("streamer_done", { n: 5 }));
    }
    setTimeout(() => { slots[idx] = null; renderSlot(idx); }, 650);
  } else {
    toast(`${f.face} +🪙${earn} — ${left} more cup${left > 1 ? "s" : ""} to go!`);
    renderSlot(idx);
  }
  renderCups(); renderTop(); renderUnlock(); renderUpgrades();
}

// ---- 顾客 ----
function ensureSlots() {
  const counter = $("counter");
  while (slots.length < slotCount()) {
    slots.push(null);
    const el = document.createElement("div");
    el.className = "customer-slot"; el.dataset.slot = slots.length - 1;
    counter.appendChild(el);
    renderSlot(slots.length - 1);
  }
  counter.classList.toggle("four", slots.length === 4);
  counter.dataset.n = slots.length;   // CSS 按席数调字号
  counter.style.gridTemplateColumns = `repeat(${slots.length}, minmax(0, 1fr))`;
}

function trySpawn() {
  const free = slots.findIndex(s => s === null);
  if (free === -1) return;
  const pool = availableFormulas();
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  // 混合订单：第一种必点，天数越高越可能多点/多杯
  const orders = [{ f: pick(), qty: 1 }];
  if (state.day >= 2 && Math.random() < 0.3) orders[0].qty++;
  if (state.day >= 3 && Math.random() < 0.35) {
    const f2 = pick();
    if (f2.id !== orders[0].f.id) orders.push({ f: f2, qty: 1 });
    else orders[0].qty++;
  }
  if (state.day >= 4 && Math.random() < 0.15) orders[orders.length - 1].qty++;
  // 爆点顾客：土豪👑（结账金币雨） / 探店网红🤳（上完茶发视频+声望）
  const r = Math.random();
  slots[free] = { orders, patience: patMax(), whale: r < 0.05, streamer: r >= 0.05 && r < 0.10 };
  renderSlot(free, "pop");
  SFX.arrive();
}

function renderSlot(i, anim = "") {
  const el = document.querySelector(`.customer-slot[data-slot="${i}"]`);
  if (!el) return;
  const s = slots[i];
  if (!s) {
    el.className = "customer-slot"; el.dataset.slot = i;
    el.innerHTML = `<div class="slot-empty">🪑</div>`;
    return;
  }
  const pct = Math.max(s.patience / patMax() * 100, 0);
  const cls = pct > 50 ? "" : pct > 25 ? "low" : "critical";
  const wants = s.orders.filter(o => o.qty > 0).map(o => `<b>${o.f.cn}${o.qty > 1 ? " ×" + o.qty : ""}</b>`).join(" + ");
  const left = s.orders.reduce((a, o) => a + o.qty, 0);
  const face = s.streamer ? "🤳" : s.orders[0].f.face;
  const line = s.streamer ? t("streamer_line") : s.orders[0].f.line;
  const who  = s.streamer ? t("streamer_who") : s.orders[0].f.who;
  el.className = "customer-slot has-cust"; el.dataset.slot = i;
  el.innerHTML = `
    ${s.whale ? `<div class="badge">👑</div>` : ""}${s.streamer ? `<div class="badge live">🔴 LIVE</div>` : ""}
    <div class="cust-face ${anim}">${face}</div>
    <div class="cust-bubble">"${line}"<br><b>${who}</b> ${t("wants")} ${wants}</div>
    <div class="patience-track"><div class="patience-fill ${cls}" style="width:${pct}%"></div></div>
    <div class="serve-hint">${left > 1 ? t("cups_to_go", { n: left }) : t("one_cup")}</div>`;
}

function renderPatience() {
  slots.forEach((s, i) => {
    if (!s) return;
    const bar = document.querySelector(`.customer-slot[data-slot="${i}"] .patience-fill`);
    if (!bar) { renderSlot(i); return; }
    const pct = Math.max(s.patience / patMax() * 100, 0);
    bar.style.width = pct + "%";
    bar.className = "patience-fill " + (pct > 50 ? "" : pct > 25 ? "low" : "critical");
  });
}

// ---- 主循环 ----
let started = false;   // 标题页点击后才开局
let tickN = 0;
setInterval(() => {
  if (!started || state.over) return;
  tickN++;
  state.timeLeft -= 0.1;
  if (state.timeLeft <= 0) { endDay(); return; }
  // 加热进度
  if (state.teapot.mode === "heating") {
    state.teapot.heat -= 0.1;
    if (state.teapot.heat <= 0) {
      state.teapot.mode = "hot"; state.teapot.heat = 0; state.teapot.evap = 0;
      SFX.boil(); toast("♨ The water is boiling! Pour it into cups with herbs.");
    }
  }
  // 热水蒸发：每 6 秒蒸发 1 杯
  else if (state.teapot.mode === "hot") {
    state.teapot.evap += 0.1;
    if (state.teapot.evap >= EVAP_SEC) {
      state.teapot.evap = 0;
      state.teapot.water--;
      if (state.teapot.water <= 0) {
        state.teapot.mode = "empty"; state.teapot.water = 0;
        SFX.leave(); toast("💨 All the hot water evaporated! Boil a fresh pot.");
      }
    }
  }
  // 送水
  if (state.delivery >= 0) {
    state.delivery -= 0.1;
    if (state.delivery <= 0) {
      state.delivery = -1; state.tank = TANK_CAP;
      SFX.deliver(); toast("🚚 Fresh water delivered! The tank is full.");
    }
  }
  // 爆点：爆单时刻 —— 随机触发15秒，小费×2、刷客加速
  if (rushLeft > 0) {
    rushLeft -= 0.1;
    $("rush-cd").textContent = Math.ceil(rushLeft);
    if (rushLeft <= 0) { $("rush-banner").classList.remove("show"); toast(t("rush_over")); }
  } else {
    nextRush -= 0.1;
    if (nextRush <= 0) {
      rushLeft = 15; nextRush = 55 + Math.random() * 60;
      $("rush-banner").classList.add("show");
      toast(t("rush_now")); SFX.streak(); flashFX();
    }
  }
  // 自动倒水器🫗：水开后每1秒自动注入一杯"已放好药材"的空杯（不浪费水）
  if (state.upgrades.autopour && state.teapot.mode === "hot" && state.teapot.water > 0 && tickN % 10 === 0) {
    const tgt = state.cups.findIndex(c => !c.brewed && c.herbs.length > 0);
    if (tgt >= 0) {
      const c = state.cups[tgt];
      state.teapot.water--;
      if (state.teapot.water <= 0) { state.teapot.mode = "empty"; state.teapot.water = 0; }
      const f = formulaByHerbs(c.herbs);
      c.brewed = f ? f.id : "waste";
      c.brewTick = tickN;
      SFX.pour(); renderCups(); renderStations();
      if (f && state.upgrades.runner) {
        setTimeout(() => { if (state.cups[tgt] && state.cups[tgt].brewed === f.id) serveCup(tgt); }, 1000);
      }
    }
  }
  if (tickN % 3 === 0 && (state.teapot.mode === "heating" || state.teapot.mode === "hot" || state.delivery >= 0)) renderStations();
  // 顾客耐心
  slots.forEach((s, i) => {
    if (!s) return;
    s.patience -= 0.1 * decayMult();
    if (s.patience <= 0) {
      state.missed++; state.streak = 0;
      toast(`"${LEAVE_LINES[Math.floor(Math.random() * LEAVE_LINES.length)]}" ${s.orders[0].f.face} walked out.`);
      SFX.leave();
      slots[i] = null; renderSlot(i); renderTop();
    }
  });
  renderPatience();
  spawnIn -= 0.1;
  if (spawnIn <= 0) { trySpawn(); spawnIn = (3.5 + Math.random() * 4) * spawnPace() * (rushLeft > 0 ? 0.35 : 1); }
  renderTop();
}, 100);

setInterval(save, 5000);

// ---- 天数循环 ----
// ---- 打烊小贴士：每日一条中药知识 ----
const TIPS = [
  "🌼 Chrysanthemum is 'cooling' in TCM — that's why it shows up in both eye tea and heat-relief blends.",
  "🍒 Goji berries are one of the few 'sweet tonic' herbs: mild enough for daily tea, prized for liver & eyes.",
  "🫚 Ginger + red date is the classic winter warmer — ginger drives out cold, dates protect the stomach from ginger's bite.",
  "🌿 Licorice is called 'the national peacemaker' (国老) — it harmonizes harsh formulas. It appears in ~60% of classical prescriptions.",
  "🥕 Ginseng is such a strong qi tonic that TCM forbids pairing it with turnips — they 'drain' the qi right back out.",
  "🍄 Lingzhi (reishi) was called the 'mushroom of immortality'. Modern studies focus on its polysaccharides for immune support.",
  "🍊 Tangerine peel gets BETTER with age — 3-year-old peel (陈皮) costs far more than fresh. 'One tael of aged peel, one tael of gold.'",
  "🌸 Honeysuckle is the go-to 'heat toxin' herb — TCM's logic for breakouts: cool the blood, calm the skin.",
  "🟤 Longan fruit nourishes 'heart-blood' in TCM terms — the traditional remedy for a racing mind that can't sleep.",
  "🥝 Monk fruit (罗汉果) is 300x sweeter than sugar with zero calories — singers in Guangxi have used it for centuries.",
  "🌾 Coix seed (薏米/Job's tears) is both food and medicine — TCM's favorite for draining 'dampness' (water retention).",
  "🍂 Astragalus (黄芪) 'lifts the qi' — the classic pick for post-illness fatigue and that always-cold feeling.",
  "🌷 Angelica sinensis (当归) is nicknamed 'female ginseng' — the core blood-nourishing herb in TCM gynecology.",
  "🐛 Cordyceps is literally a fungus that grows out of a caterpillar. Wild ones cost more per gram than gold.",
  "💊 TCM formulas follow 'emperor–minister–assistant–envoy' (君臣佐使) logic: one star herb, others support or guide it.",
  "⚠️ '是药三分毒' — every medicine carries some toxicity. Real TCM dosing is precise; never self-prescribe concentrated decoctions!",
];

function endDay() {
  state.over = true;
  rushLeft = 0; $("rush-banner").classList.remove("show");   // 打烊清掉爆单横幅
  state.merit += 5;
  state.bestDay = Math.max(state.bestDay, state.dayCoins);
  save(); SFX.dayEnd();
  $("shop-closed-title").textContent = t("shop_closed");
  $("end-flavor").textContent = t("end_flavor");
  $("end-stats").innerHTML =
    `<b>${t("d_day", { n: state.day })}</b> — 🪙 <b>${state.dayCoins}</b> ${t("d_earned")}<br>` +
    `😊 <b>${state.served}</b> ${t("d_served")} &nbsp;·&nbsp; 😠 <b>${state.missed}</b> ${t("d_lost")} &nbsp;·&nbsp; +🔖5 ${t("d_bonus")}<br>` +
    `<span class="end-best">${t("d_best")}: 🪙${state.bestDay} · ${t("d_total")}: ${state.totalServed}</span>` +
    `<div class="end-tip">💡 ${TIPS[(state.day - 1) % TIPS.length]}</div>`;
  $("restart-btn").textContent = t("open_tomorrow", { n: state.day + 1 });
  $("day-end").classList.remove("hidden");
}
$("restart-btn").addEventListener("click", () => {
  state.day++;
  state.timeLeft = SHIFT_LEN; state.over = false;
  state.served = 0; state.missed = 0; state.streak = 0; state.dayCoins = 0;
  state.cups = []; state.selCup = 0;
  slots = slots.map(() => null); spawnIn = 1.5;
  slots.forEach((_, i) => renderSlot(i));
  renderCups(); renderTop(); save();
  $("day-end").classList.add("hidden");
  SFX.arrive();
});

// ---- 工具 ----
function renderTop() {
  $("coins").textContent = "🪙 " + state.coins;
  $("merit").textContent = "🔖 " + state.merit;
  $("day-badge").textContent = "DAY " + state.day;
  const t = Math.max(state.timeLeft, 0);
  const mm = Math.floor(t / 60), ss = Math.floor(t % 60).toString().padStart(2, "0");
  $("shift-timer").textContent = `⏳ ${mm}:${ss}`;
  $("shift-timer").className = "timer" + (t <= 15 ? " urgent" : "");
}
function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast"; el.innerHTML = msg;
  $("toast-box").appendChild(el);
  setTimeout(() => el.remove(), 3400);
}
function showFloat(text, anchor) {
  if (!anchor) return;
  const r = anchor.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "float-num"; el.textContent = text;
  el.style.left = (r.left + r.width / 2 - 20) + "px";
  el.style.top = (r.top + 20) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ---- 魔性 BGM：WebAudio 程序化生成，不引音频文件 ----
// 五声音阶（宫商角徵羽）洗脑循环：三角波拨弦主旋律 + 方波低音 + 噪声打点
const BGM = {
  timer: null, step: 0,
  // 32步主旋律（0=休止），C宫五声：C5 D5 E5 G5 A5，句尾故意下滑音制造魔性感
  MEL: [523, 0, 587, 659, 784, 0, 659, 587, 523, 0, 659, 784, 880, 0, 784, 659,
        587, 0, 659, 587, 523, 0, 392, 440, 523, 587, 659, 784, 659, 587, 523, 0],
  start() {
    if (this.timer || state.muted || !started) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      const stepMs = 60000 / 108 / 2;   // 108 BPM 八分音符
      this.timer = setInterval(() => this.tick(), stepMs);
    } catch (e) { }
  },
  stop() { clearInterval(this.timer); this.timer = null; },
  note(freq, dur, type = "triangle", vol = 0.055, slide = false) {
    if (state.muted || !AC) return;
    try {
      const t0 = AC.currentTime;
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0);
      if (slide) o.frequency.exponentialRampToValueAtTime(freq * 0.78, t0 + dur);   // 滑音：魔性所在
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g); g.connect(AC.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) { }
  },
  hat() {
    if (state.muted || !AC) return;
    try {
      const len = Math.floor(AC.sampleRate * 0.04);
      const buf = AC.createBuffer(1, len, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = AC.createBufferSource(); src.buffer = buf;
      const g = AC.createGain(); g.gain.value = 0.05;
      const f = AC.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 6000;
      src.connect(f); f.connect(g); g.connect(AC.destination);
      src.start();
    } catch (e) { }
  },
  tick() {
    const i = this.step % 32; this.step++;
    const m = this.MEL[i];
    if (m) this.note(m, 0.2, "triangle", 0.055, i % 8 === 7);       // 拨弦主旋律，每句尾滑音
    if (i % 8 === 0) this.note(m ? m / 2 : 262, 0.42, "square", 0.026);   // 低音铺底
    if (i % 4 === 2) this.hat();                                     // 打点
  },
};

// ---- 爆点特效工具 ----
function coinRain(n = 14) {
  for (let k = 0; k < n; k++) {
    const c = document.createElement("div");
    c.className = "coin-fx"; c.textContent = "🪙";
    c.style.left = (4 + Math.random() * 92) + "vw";
    c.style.animationDuration = (0.9 + Math.random() * 0.9) + "s";
    c.style.animationDelay = (Math.random() * 0.5) + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2400);
  }
}
function flashFX() { const f = $("fx-flash"); if (!f) return; f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); }
function shakeFX() { const s = $("scene"); if (!s) return; s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); }

// ---- 拖茶杯给顾客 ----
let cupDrag = null;   // { i, moved, ghost }
function cupDragStart(e) {
  const el = e.currentTarget;
  const i = [...el.parentNode.children].indexOf(el);
  cupDrag = { i, moved: false };
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost"; ghost.innerHTML = iconOf("cup", "🍵");
  document.body.appendChild(ghost);
  cupDrag.ghost = ghost;
  ghost.style.left = e.clientX + "px";
  ghost.style.top = (e.clientY - 24) + "px";
}
document.addEventListener("pointermove", e => {
  if (!cupDrag) return;
  cupDrag.moved = true;
  cupDrag.ghost.style.left = e.clientX + "px";
  cupDrag.ghost.style.top = (e.clientY - 24) + "px";
  document.querySelectorAll(".customer-slot.drop-ok").forEach(x => x.classList.remove("drop-ok"));
  const slotEl = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".customer-slot");
  if (slotEl) slotEl.classList.add("drop-ok");
});
document.addEventListener("pointerup", e => {
  if (!cupDrag) return;
  const { i, moved, ghost } = cupDrag;
  ghost.remove(); cupDrag = null;
  document.querySelectorAll(".customer-slot.drop-ok").forEach(x => x.classList.remove("drop-ok"));
  if (!moved) return;   // 原地 = 点击，交给 cupClicked 自动上茶
  const slotEl = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".customer-slot");
  if (slotEl) serveCupTo(i, +slotEl.dataset.slot);
});

// ---- 拖拽药材（指针事件；原地点击=入当前杯）----
let dragGhost = null, dragId = null, dragMoved = false;
function herbPointerDown(e) {
  e.preventDefault();
  dragId = e.currentTarget.dataset.id; dragMoved = false;
  const h = HERBS.find(x => x.id === dragId);
  dragGhost = document.createElement("div");
  dragGhost.className = "drag-ghost";
  dragGhost.innerHTML = iconOf(h.id, h.icon);
  document.body.appendChild(dragGhost);
  moveGhost(e);
}
document.addEventListener("pointermove", e => {
  if (!dragGhost) return;
  dragMoved = true;
  moveGhost(e);
  const cupEl = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".cup");
  document.querySelectorAll(".cup.drag-over").forEach(x => x.classList.remove("drag-over"));
  if (cupEl && !state.cups[+[...cupEl.parentNode.children].indexOf(cupEl)]?.brewed) cupEl.classList.add("drag-over");
});
document.addEventListener("pointerup", e => {
  if (!dragGhost) return;
  dragGhost.remove(); dragGhost = null;
  document.querySelectorAll(".cup.drag-over").forEach(x => x.classList.remove("drag-over"));
  if (!dragMoved) { addHerbToCup(dragId); dragId = null; return; }   // 原地点击 → 当前杯
  // 拖到某个杯子上 → 入该杯
  const cupEl = document.elementFromPoint(e.clientX, e.clientY)?.closest?.(".cup");
  if (cupEl) {
    const i = [...cupEl.parentNode.children].indexOf(cupEl);
    const c = state.cups[i];
    if (c && !c.brewed && c.herbs.length < 4) {
      c.herbs.push(dragId); c.dumpArm = false;
      state.selCup = i;
      renderCups(); SFX.pick();
    } else if (c && c.brewed) toast("That cup is already brewed!");
    else if (c) toast("This cup is full!");
  }
  dragId = null;
});
function moveGhost(e) {
  dragGhost.style.left = e.clientX + "px";
  dragGhost.style.top = (e.clientY - 24) + "px";
}

// ---- 事件 ----
$("tank").addEventListener("click", () => { if (state.delivery < 0) fillTeapot(); });
$("teapot").addEventListener("click", () => {
  const t = state.teapot;
  if (t.mode === "empty") fillTeapot();
  else if (t.mode === "cold") fireStove();
});
$("stove").addEventListener("click", fireStove);
$("mute-btn").addEventListener("click", () => {
  state.muted = !state.muted;
  $("mute-btn").textContent = state.muted ? "🔇" : "🔊";
  if (state.muted) BGM.stop();
  else { SFX.pick(); if (started) BGM.start(); }
  save();
});

// ---- 弹层菜单：药方书 / 升级 / 药材解锁 ----
[["mb-book", "modal-book"], ["mb-upg", "modal-upg"], ["mb-unlock", "modal-unlock"]].forEach(([b, m]) => {
  $(b).addEventListener("click", () => { $(m).classList.remove("hidden"); SFX.pick(); });
});
document.querySelectorAll(".sheet-x").forEach(x => x.addEventListener("click", () => $(x.dataset.close).classList.add("hidden")));
["modal-book", "modal-upg", "modal-unlock"].forEach(m => {
  $(m).addEventListener("click", e => { if (e.target === $(m)) $(m).classList.add("hidden"); });
});
$("reset-btn").addEventListener("click", () => {
  if (confirm(t("reset_confirm"))) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
});

// ---- 开局：标题页 ----
load();
ensureSlots();
renderShelf(); renderBook(); renderUnlock(); renderUpgrades();
renderStations(); renderCups(); renderTop();
$("mute-btn").textContent = state.muted ? "🔇" : "🔊";

// ---- 多语言：应用当前语言到所有静态文案 ----
function applyLang() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  $("pt-book").innerHTML = t("formula_book");
  $("pt-upg").innerHTML = t("upgrades");
  $("pt-unlock").innerHTML = t("unlock_herbs");
  $("mb-book").querySelector("span").textContent = t("mb_book");
  $("mb-upg").querySelector("span").textContent = t("mb_upg");
  $("mb-unlock").querySelector("span").textContent = t("mb_herb");
  renderStations(); renderCups(); renderBook();
  slots.forEach((_, i) => renderSlot(i));
  refreshTitle();
}

// ---- 标题页：文案 + 战绩 + 语言网格（可重复调用）----
function refreshTitle() {
  const hasSave = state.totalServed > 0 || state.day > 1;
  $("title-tag-line").innerHTML = `${t("tagline")}<br><span class="tag-cn">${t("tagline2")}</span>`;
  $("lang-title").textContent = t("choose_lang");
  const grid = $("lang-grid");
  grid.innerHTML = "";
  LANGS.forEach(L => {
    const b = document.createElement("button");
    b.className = "lang-btn" + (state.lang === L.id ? " on" : "");
    b.innerHTML = `${L.flag}<span>${L.name}</span>`;
    b.addEventListener("click", () => {
      if (state.lang === L.id) return;
      state.lang = L.id; save(); applyLang(); SFX.pick();
    });
    grid.appendChild(b);
  });
  const stats = $("title-stats");
  if (hasSave) {
    stats.innerHTML =
      `<div class="ts-grid">` +
      `<div><b>${t("d_day", { n: state.day })}</b><span>${t("cur_day")}</span></div>` +
      `<div><b>🪙 ${state.coins}</b><span>${t("coins")}</span></div>` +
      `<div><b>🔖 ${state.merit}</b><span>${t("merit")}</span></div>` +
      `<div><b>🪙 ${state.bestDay}</b><span>${t("best_day")}</span></div>` +
      `<div><b>😊 ${state.totalServed}</b><span>${t("total_cured")}</span></div>` +
      `</div>`;
    $("start-btn").textContent = t("continue_day", { n: state.day });
    $("fresh-btn").textContent = t("start_over");
    $("fresh-btn").classList.remove("hidden");
  } else {
    stats.innerHTML = `<div class="ts-empty">${t("no_history")}</div>`;
    $("start-btn").textContent = t("open_shop");
    $("fresh-btn").classList.add("hidden");
  }
}

$("start-btn").addEventListener("click", () => {
  if (started) return;
  started = true;
  $("title-screen").classList.add("hidden");
  SFX.arrive(); BGM.start();   // 首次用户手势后启动魔性BGM（符合浏览器自动播放策略）
  if (slots.every(s => !s)) trySpawn();
  const hasSave = state.totalServed > 0 || state.day > 1;
  toast(hasSave ? t("welcome_back", { n: state.day }) : t("tutorial"));
});
$("fresh-btn").addEventListener("click", () => {
  if (confirm(t("reset_confirm"))) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
});
// 🌐 顶栏语言按钮：回标题页换语言（暂停游戏，回来继续当天）
$("lang-btn").addEventListener("click", () => {
  started = false;
  BGM.stop();
  refreshTitle();
  $("title-screen").classList.remove("hidden");
  SFX.pick();
});

applyLang();
