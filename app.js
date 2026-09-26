/* ============================================================
   WONDER BOOK CLUB — APP
   Hash routes:  #            home
                 #week3       week overview
                 #week3/mon   a day (slideshow / group worksheet / quiz)
                 #week10/thu  week 10 days
                 #rubric      reading progress rubric
   Saved-answer keys are unchanged from the original app, so nothing is lost.
   ============================================================ */

const IMGS = window.WONDER_IMAGES || {};
function IMG() { return IMGS; }
function imgTag(key, cls) { const src = IMGS[key]; return src ? `<img class="${cls}" src="${src}" alt="">` : ""; }
const DAY_ICON_IMG = { teach: "iconTeacherRead", group: "iconGroupRead", quiz: "iconQuizDay", present: "presentationDayIcon", celebrate: "choiceKindBadge" };
const PROJECT_ICON_IMG = ["iconPoster", "iconComic", "iconDrama", "iconJournal"];
const W10_OPTION_ICON = ["choiceKindBadge", "iconDrama", "iconJournal", "iconPoster"];
const dayOrder = ["mon", "tue", "wed", "thu", "fri"];
const DAY_NAMES = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };
const root = document.getElementById("app");
const banner = (n) => IMGS[(WEEKS_META.find((w) => w.n === n) || {}).banner] || "";
const meta = (n) => WEEKS_META.find((w) => w.n === n);
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

const ICON = {
  arrowR: `<svg class="svg" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowL: `<svg class="svg" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  print: `<svg class="svg" viewBox="0 0 24 24" fill="none"><rect x="6" y="10" width="12" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/><path d="M7 10V4h10v6M8 17v3h8v-3" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  full: `<svg class="svg" viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  grid: `<svg class="svg" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>`,
  check: `<svg class="svg" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

let currentWeek = 1;
let currentDay = "mon";
let keyHandler = null;
function setKeys(fn) { if (keyHandler) document.removeEventListener("keydown", keyHandler); keyHandler = fn; if (fn) document.addEventListener("keydown", fn); }

/* ---------- routing ---------- */
function go(h) { location.hash = h; }
function goToWeek(n) { go("week" + n); }
function goTo(id) { go(id === "landing" ? "" : id); }
window.addEventListener("hashchange", route);

function route() {
  setKeys(null);
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return renderHome();
  if (parts[0] === "rubric") return renderRubricPage();
  const n = parseInt((parts[0] || "").replace("week", ""), 10);
  if (!meta(n)) return renderHome();
  currentWeek = n;
  markVisited(n);
  if (parts[1] && dayOrder.includes(parts[1])) { currentDay = parts[1]; return renderDayPage(); }
  currentDay = "mon";
  return renderWeekPage();
}

function markVisited(n) {
  let v = []; try { v = JSON.parse(LS.get("wonder_visited") || "[]"); } catch (e) {}
  if (!v.includes(n)) { v.push(n); LS.set("wonder_visited", JSON.stringify(v)); }
  LS.set("wonder_lastWeek", String(n));
}

/* ---------- shell ---------- */
function shell(crumbs, activeTop) {
  root.innerHTML = "";
  const jump = WEEKS_META.map((w) => `<button class="${w.n === currentWeek && activeTop === "week" ? "current" : ""}" style="background-image:url('${IMGS[w.banner] || ""}')" onclick="goToWeek(${w.n})" title="Week ${w.n}: ${w.title}"><span>${w.n}</span></button>`).join("");
  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `<div class="wrap topbar-inner">
    <button class="brand" onclick="go('')" aria-label="Home"><img src="${IMGS.logoMark || ""}" alt=""><span><b>Wonder</b><span>Book Club · Years 5–6</span></span></button>
    <nav class="crumbs">${crumbs}</nav>
    <div class="top-actions">
      <button class="top-link ${activeTop === "rubric" ? "on" : ""}" onclick="go('rubric')">Rubric</button>
      <div class="week-jump" id="weekJump"><button class="btn glass small" id="weekJumpBtn">${ICON.grid} Weeks</button><div class="week-jump-menu">${jump}</div></div>
    </div></div>`;
  root.appendChild(header);
  header.querySelector("#weekJumpBtn").onclick = (e) => { e.stopPropagation(); header.querySelector("#weekJump").classList.toggle("open"); };
  const main = document.createElement("main");
  main.className = "page-enter";
  root.appendChild(main);
  window.scrollTo(0, 0);
  onScroll();
  return main;
}
document.addEventListener("click", (e) => { const wj = document.getElementById("weekJump"); if (wj && !wj.contains(e.target)) wj.classList.remove("open"); });
function onScroll() {
  const tb = document.querySelector(".topbar"); if (tb) tb.classList.toggle("scrolled", window.scrollY > 10);
  document.querySelectorAll("[data-parallax]").forEach((el) => { el.style.translate = `0 ${Math.min(window.scrollY, 900) * 0.3}px`; });
}
window.addEventListener("scroll", onScroll, { passive: true });
const crumbHome = `<button onclick="go('')">Home</button>`;
const sep = `<span class="sep">/</span>`;

let revealObs = null;
function reveal(scope) {
  const els = (scope || document).querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  if (!revealObs) revealObs = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); revealObs.unobserve(x.target); } }), { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => revealObs.observe(e));
}

function starConfetti(n = 70) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("div"); c.className = "confetti";
  const cols = ["#f2a93b", "#ffd27a", "#e8604c", "#2e9ca6", "#ffffff"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i"); const z = 10 + Math.random() * 16;
    s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;background:${cols[i % cols.length]};--dx:${(Math.random() - .5) * 300}px;--r:${Math.random() * 900 - 450}deg;animation-delay:${Math.random() * .8}s;animation-duration:${2.2 + Math.random() * 1.6}s`;
    c.appendChild(s);
  }
  document.body.appendChild(c); setTimeout(() => c.remove(), 4800);
}

function skyStars() {
  const layer = document.getElementById("skyLayer");
  if (!layer || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("i"); const z = 8 + Math.random() * 12;
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${z}px;height:${z}px;animation-delay:${-Math.random() * 6}s;animation-duration:${4 + Math.random() * 5}s`;
    layer.appendChild(s);
  }
}

function modeOf(n, key) { return n === 10 ? dayDefsForWeek(10).find((d) => d.key === key).mode : WEEK_CONTENT[n][key].mode; }
const MODE_LABEL = { teach: "Teacher read", group: "Group read", quiz: "Quiz day", project: "Project", present: "Present", celebrate: "Celebrate" };
function dayIcon(d, cls) {
  const k = d.mode === "project" ? null : DAY_ICON_IMG[d.mode];
  return k && IMGS[k] ? `<img class="${cls}" src="${IMGS[k]}" alt="">` : `<span class="emo">${d.icon || "⭐"}</span>`;
}

/* ============ HOME ============ */
function renderHome() {
  const main = shell(`<span class="here">Home</span>`, "home");
  const last = parseInt(LS.get("wonder_lastWeek") || "0", 10);
  let visited = []; try { visited = JSON.parse(LS.get("wonder_visited") || "[]"); } catch (e) {}
  const totalQ = Object.values(QUIZZES).reduce((a, q) => a + q.length, 0);
  const stars = Array.from({ length: 40 }, () => `<span style="left:${Math.random() * 100}%;top:${Math.random() * 80}%;animation-delay:${-Math.random() * 3}s;transform:scale(${.4 + Math.random()})"></span>`).join("");
  main.innerHTML = `
    <section class="home-hero">
      <div class="bg" data-parallax style="background-image:url('${IMGS.heroBanner || ""}')"></div>
      <div class="starfield">${stars}<div class="shooting"></div><div class="shooting s2"></div></div>
      ${IMGS.choiceKindBadge ? `<img class="hero-badge" src="${IMGS.choiceKindBadge}" alt="">` : ""}
      <div class="wrap hero-content">
        <span class="eyebrow"><span class="dot"></span> Years 5–6 · Term book study · R.J. Palacio</span>
        <h1>Wonder<span class="dot-gold">.</span></h1>
        <p class="tagline">Ten weeks. One class. <em>Choose kind.</em></p>
        <p class="lede">A term-long reading journey through R.J. Palacio's <em>Wonder</em> — read-aloud slides, group worksheets, Friday quizzes and weekly projects, all in one place for you and your class.</p>
        <div class="hero-ctas">
          ${last ? `<button class="btn big" onclick="goToWeek(${last})">Continue Week ${last} ${ICON.arrowR}</button>` : `<button class="btn big" onclick="goToWeek(1)">Start Week 1 ${ICON.arrowR}</button>`}
          <button class="btn glass big" onclick="document.getElementById('journey').scrollIntoView({behavior:'smooth'})">See the full term</button>
        </div>
      </div>
    </section>
    <div class="wrap">
      <div class="stats-strip reveal">
        <div class="stat"><b>10</b><span>weeks</span></div>
        <div class="stat"><b>36</b><span>reading lessons</span></div>
        <div class="stat"><b>${totalQ}</b><span>quiz questions</span></div>
        <div class="stat"><b>40</b><span>creative projects</span></div>
      </div>

      <div class="section-head" id="journey">
        <div><div class="kicker">Your term at a glance</div><h2>Ten stops, from meeting Auggie to the celebration</h2>
          <p>Every week is built and ready to explore. Pick a week to open its lessons, worksheets, quiz and projects.</p></div>
        <div class="toolbar">
          <button class="btn ghost small" onclick="downloadReadingSchedule()">📅 Reading schedule</button>
          <a class="btn teal small" href="./Wonder-Book-Club-Student-Workbook.pdf" download>📘 Student workbook</a>
          <a class="btn navy small" href="./Wonder-Book-Club-Teacher-Pack.pdf" download>📗 Teacher pack</a>
        </div>
      </div>
      <div class="journey" id="journeyGrid"></div>

      <div class="section-head"><div><div class="kicker">The weekly rhythm</div><h2>How every week works</h2>
        <p>The same predictable routine each week, so everyone knows what's coming.</p></div></div>
      <div class="rhythm">
        ${[["teach", "Monday", "Teacher read · slides"], ["group", "Tuesday", "Group read · worksheet"], ["teach", "Wednesday", "Teacher read · slides"], ["group", "Thursday", "Group read · worksheet"], ["quiz", "Friday", "Quiz day · 20 questions"]]
          .map(([m, d, t], i) => `<div class="reveal" style="--d:${i * .07}s">${imgTag(DAY_ICON_IMG[m], "")}<b>${d}</b><span>${t}</span></div>`).join("")}
      </div>

      <div class="section-head"><div><div class="kicker">Teacher toolkit</div><h2>Everything for the whole term</h2></div></div>
      <div class="toolkit">
        <a class="tool reveal" href="./Wonder-Book-Club-Student-Workbook.pdf" download>${imgTag("iconJournal", "")}<b>Student workbook</b><span>The printable student workbook for the whole unit.</span><small>PDF download</small></a>
        <a class="tool reveal" style="--d:.05s" href="./Wonder-Book-Club-Teacher-Pack.pdf" download>${imgTag("iconPrintAll", "")}<b>Teacher pack</b><span>Planning, every lesson plan and the 3-level marking guide.</span><small>PDF download</small></a>
        <button class="tool reveal" style="--d:.1s" onclick="downloadReadingSchedule()"><div class="emoji">📅</div><b>Reading schedule</b><span>Day-by-day reading ranges for the whole term.</span><small>Downloads a page</small></button>
        <button class="tool reveal" style="--d:.15s" onclick="go('rubric')">${imgTag("iconQuizDay", "")}<b>Progress rubric</b><span>Mark the class on R1–R10: Not Achieved, Working Towards, Achieved.</span></button>
        <button class="tool reveal" style="--d:.2s" onclick="go('week10/fri')">${imgTag("choiceKindBadge", "")}<b>Certificates</b><span>Print "Certificate of Choosing Kind" for the celebration.</span></button>
      </div>
    </div>`;
  const grid = main.querySelector("#journeyGrid");
  WEEKS_META.forEach((w, i) => {
    const b = document.createElement("button");
    b.className = "week-card reveal" + (w.n === 10 ? " w10" : "");
    b.style.setProperty("--d", `${(i % 5) * .06}s`);
    b.onclick = () => goToWeek(w.n);
    b.innerHTML = `<div class="thumb"><div style="background-image:url('${IMGS[w.banner] || ""}')"></div>${visited.includes(w.n) ? `<span class="visited">✓ Visited</span>` : ""}</div>
      <div class="num">${w.n}</div><div class="body"><h3>${w.title}</h3><p class="theme">${w.theme}</p><div class="go">Open week <span>→</span></div></div>`;
    grid.appendChild(b);
  });
  reveal(main);
}

/* ============ WEEK OVERVIEW ============ */
function weekLISC(n) { return n === 10 ? [WEEK10.learningIntention, WEEK10.successCriteria] : [WEEK_CONTENT[n].learningIntention, WEEK_CONTENT[n].successCriteria]; }

function renderWeekPage() {
  const n = currentWeek, m = meta(n);
  const main = shell(`${crumbHome}${sep}<span class="here">Week ${n}</span>`, "week");
  const [li, sc] = weekLISC(n);
  const prev = meta(n - 1), next = meta(n + 1);
  main.innerHTML = `
    <section class="week-hero">
      <div class="bg" data-parallax style="background-image:url('${banner(n)}')"></div>
      ${n === 2 && IMGS.preceptsWallBg ? `<div class="precepts" style="background-image:url('${IMGS.preceptsWallBg}')"></div>` : ""}
      ${n === 2 && IMGS.choiceKindBadge ? `<img class="hero-kind" src="${IMGS.choiceKindBadge}" alt="Choose Kind badge">` : ""}
      <div class="big-num">${String(n).padStart(2, "0")}</div>
      <div class="wrap">
        <span class="eyebrow"><span class="dot"></span> Week ${n} of 10</span>
        <h1>${m.title}</h1>
        <p class="theme-line">${m.theme}</p>
        <div class="meta">${n === 10 ? `<span class="pill">No new reading</span><span class="pill">3 project lessons</span><span class="pill">Presentations</span><span class="pill">Certificates</span>` : `<span class="pill">📖 4 reading lessons</span><span class="pill">📝 Friday quiz</span><span class="pill">🎨 4 project choices</span>`}</div>
      </div>
    </section>
    <div class="wrap">
      <div class="signposts">
        <div class="signpost reveal">${imgTag("iconLeadIn", "")}<div class="label">Learning intention</div><p>${li}</p></div>
        <div class="signpost reveal" style="--d:.08s">${imgTag("iconQuizDay", "")}<div class="label">Success criteria</div><p>${sc}</p></div>
      </div>
      <div class="section-head"><div><div class="kicker">${n === 10 ? "The final week" : "The week's trail"}</div><h2>${n === 10 ? "Plan, produce, polish, present, celebrate" : "Five days of reading"}</h2></div></div>
      <div class="trail" id="trail"></div>
      <div class="section-head"><div><div class="kicker">Choose one</div><h2>${n === 10 ? "Final project options" : "This week's project menu"}</h2></div></div>
      <div class="proj-grid" id="projGrid"></div>
      <div class="section-head"><div><div class="kicker">For the teacher</div><h2>Print &amp; prepare</h2></div></div>
      <div class="action-row">
        <button class="action-card reveal" onclick="currentWeek=${n};openPrint(weekPackHTML())">${imgTag("iconPrintAll", "")}<div><b>Print Week Pack</b><span>Lesson plans, worksheets, projects, quiz &amp; answer key — all in one.</span></div></button>
        <button class="action-card reveal" style="--d:.06s" onclick="go('rubric')">${imgTag("iconQuizDay", "")}<div><b>Progress rubric</b><span>Record where the class is at on R1–R10.</span></div></button>
        <a class="action-card reveal" style="--d:.12s" href="./Wonder-Book-Club-Teacher-Pack.pdf" download>${imgTag("iconJournal", "")}<div><b>Teacher pack (PDF)</b><span>All planning plus the marking guide.</span></div></a>
      </div>
      <nav class="week-nav">
        ${prev ? `<button onclick="goToWeek(${prev.n})"><div class="t" style="background-image:url('${banner(prev.n)}')"></div><div><small>← Week ${prev.n}</small><b>${prev.title}</b></div></button>` : "<span></span>"}
        ${next ? `<button class="next" onclick="goToWeek(${next.n})"><div class="t" style="background-image:url('${banner(next.n)}')"></div><div><small>Week ${next.n} →</small><b>${next.title}</b></div></button>` : ""}
      </nav>
    </div>`;
  const trail = main.querySelector("#trail");
  dayDefsForWeek(n).forEach((d, i) => {
    const b = document.createElement("button");
    const mode = d.mode;
    b.className = `day-card ${mode} ${d.modeLabel ? d.modeLabel.toLowerCase() : ""} reveal`;
    b.style.setProperty("--d", `${i * .08}s`);
    b.onclick = () => go(`week${n}/${d.key}`);
    const title = n === 10 ? d.title.replace(/^Lesson \d — /, "") : mode === "quiz" ? "Quiz day" : d.range;
    const sub = n === 10 ? (d.time || d.modeLabel) : mode === "quiz" ? "20 questions on the week's reading" : (mode === "teach" ? "Teacher reads aloud" : "Groups read in turns");
    b.innerHTML = `<div class="bubble">${dayIcon(d, "")}</div><div class="dayname">${d.label}</div><h4>${title}</h4><p>${sub}</p>
      <span class="mode-tag ${mode}">${d.modeLabel}</span>${d.rubric ? `<div class="codes">${d.rubric.map((c) => `<span class="code">${c}</span>`).join("")}</div>` : ""}`;
    trail.appendChild(b);
  });
  renderProjectCards(main.querySelector("#projGrid"), n);
  reveal(main);
}

function renderProjectCards(grid, n) {
  const list = n === 10 ? WEEK10.options : PROJECTS[n];
  grid.innerHTML = list.map((p, i) => {
    const ic = n === 10 ? W10_OPTION_ICON[i] : PROJECT_ICON_IMG[i];
    const key = n === 10 ? "wonder_w10_proj_" + i : `wonder_w${n}_proj_${i}`;
    const on = LS.get(key) === "1";
    return `<div class="proj reveal ${on ? "chosen" : ""}" style="--d:${i * .07}s"><span class="ribbon">CHOSEN</span>
      <div class="top">${IMGS[ic] ? `<img src="${IMGS[ic]}" alt="">` : `<span class="emo">${p.icon || "⭐"}</span>`}</div>
      <div class="tag">${n === 10 ? "Option " + (i + 1) : p.title}</div><h4>${n === 10 ? p.title : p.title}</h4><p>${p.desc}</p>
      <label class="choose"><input type="checkbox" data-key="${key}" ${on ? "checked" : ""}> Mark as chosen</label></div>`;
  }).join("");
  grid.querySelectorAll("input[type=checkbox]").forEach((c) => c.addEventListener("change", () => {
    LS.set(c.dataset.key, c.checked ? "1" : "0");
    c.closest(".proj").classList.toggle("chosen", c.checked);
    if (c.checked) starConfetti(26);
  }));
  // tidy duplicate tag/title for weeks 1–9 (title is the project type there)
  if (n !== 10) grid.querySelectorAll(".proj").forEach((card, i) => { card.querySelector(".tag").textContent = "Project " + (i + 1); });
  reveal(grid);
}

/* ============ DAY PAGE ============ */
function renderDayPage() {
  const n = currentWeek, key = currentDay;
  const defs = dayDefsForWeek(n);
  const d = defs.find((x) => x.key === key);
  const main = shell(`${crumbHome}${sep}<button onclick="goToWeek(${n})">Week ${n}</button>${sep}<span class="here">${d.label}</span>`, "week");
  const [li, sc] = weekLISC(n);
  const title = n === 10 ? d.title : d.mode === "quiz" ? `Week ${n} Quiz` : d.range;
  const sub = n === 10 ? d.desc : d.mode === "quiz" ? `20 questions on ${meta(n).title}` : `${d.modeLabel} · ${d.mode === "teach" ? "slides for the class" : "groups read in turns"}`;
  main.innerHTML = `<div class="wrap">
    <div class="page-head reveal"><div class="bg" style="background-image:url('${banner(n)}')"></div>
      ${dayIcon(d, "ph-icon").replace('class="emo"', 'class="ph-emo"')}
      <div class="ph-text"><small>Week ${n} · ${d.label} · ${d.modeLabel}</small><h1>${title}</h1><p>${sub}</p></div>
      <div class="toolbar no-print">
        ${n !== 10 ? `<button class="btn glass small" onclick="printLessonPlan()">${ICON.print} Today's lesson plan</button>` : `<button class="btn glass small" onclick="printLessonPlan()">${ICON.print} Print this plan</button>`}
        <button class="btn small" onclick="openPrint(weekPackHTML())">${ICON.print} Week Pack</button>
      </div>
    </div>
    <div class="day-tabs" id="dayTabs">${defs.map((x) => `<button class="day-tab ${x.mode} ${(x.modeLabel || "").toLowerCase()} ${x.key === key ? "active" : ""}" onclick="go('week${n}/${x.key}')">${dayIcon(x, "")}<div><b>${x.label}</b><span>${x.modeLabel}</span></div></button>`).join("")}</div>
    <div class="li-strip"><div><b>Learning intention</b>${li}</div><div><b>Success criteria</b>${sc}</div></div>
    <div id="dayPanel"></div>
    ${d.rubric ? `<div class="checkpoint"><span class="cp-ic">📊</span><div><b>Rubric checkpoint</b> ${d.rubric.map((c) => `<span class="code">${c}</span>`).join(" ")}<p>${d.rubricNote}</p></div><button class="btn small" onclick="go('rubric')">Open rubric</button></div>` : ""}
  </div>`;
  const panel = main.querySelector("#dayPanel");
  if (n === 10) renderWeek10Day(panel, d);
  else if (d.mode === "teach") renderSlideshow(panel, d, n);
  else if (d.mode === "group") renderWorksheet(panel, d, key, n);
  else renderQuizDay(panel, n);
  reveal(main);
}

/* ---------- slideshow (Mon/Wed) ---------- */
function renderSlideshow(panel, d, weekN) {
  const slides = [
    { cls: "title-slide", html: `<div class="s-kicker">Week ${weekN} · ${d.label} · ${d.modeLabel}</div><h3>${d.range}</h3><span class="range-pill">Reading range for this chunk</span>` },
    { html: `${imgTag("iconLeadIn", "s-icon")}<div class="s-kicker">Lead-in</div>${d.leadIn.map((q) => `<h3>${q}</h3>`).join("")}` },
    { html: `${imgTag("iconTeacherRead", "s-icon")}<div class="s-kicker">Now reading…</div><h3>${d.range}</h3><p class="s-body">Read aloud together. Encourage the class to notice how each character's perspective shapes what they say and don't say.</p><span class="range-pill">⏱ 15–20 minutes</span>` },
    { html: `<span class="s-emo">🧠</span><div class="s-kicker">Comprehension &amp; inference</div><ol>${d.comprehension.map((q) => `<li>${q}</li>`).join("")}</ol>` },
    { html: `${imgTag("iconGoAway", "s-icon")}<div class="s-kicker">Go-away reflection</div><h3>${d.goAway}</h3><p class="s-body">Record this in your reading journal before you pack up.</p><span class="range-pill">📊 Rubric: ${d.rubric.join(", ")}</span>` },
  ];
  panel.innerHTML = `
    <div class="stage" id="stage"><div class="bg" id="stageBg" style="background-image:url('${banner(weekN)}')"></div>
      <div class="progress"><i id="prog"></i></div>
      <div class="stage-top"><span class="pill">${d.label} · ${d.modeLabel}</span><div class="toolbar"><span class="pill" id="counter"></span><button class="btn glass small" id="fsBtn">${ICON.full} Full screen</button></div></div>
      <div class="slide-area"><div class="slide" id="slide"></div></div>
      <div class="stage-nav"><button class="btn glass" id="prevBtn">${ICON.arrowL} Back</button><div class="slide-dots" id="dots"></div><button class="btn coral" id="nextBtn"></button></div>
    </div>
    <p class="key-hint">Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>Space</kbd> to move through the slides · <kbd>F</kbd> for full screen</p>
    <div id="afterSlides"></div>`;
  let idx = 0;
  const slide = panel.querySelector("#slide"), dots = panel.querySelector("#dots"), stage = panel.querySelector("#stage");
  slides.forEach((_, i) => { const b = document.createElement("button"); b.setAttribute("aria-label", "Slide " + (i + 1)); b.onclick = () => { const dir = i > idx ? 1 : -1; idx = i; draw(dir); }; dots.appendChild(b); });
  function draw(dir) {
    slide.className = "slide " + (slides[idx].cls || "");
    void slide.offsetWidth;
    if (dir) slide.classList.add(dir > 0 ? "enter-next" : "enter-prev");
    slide.innerHTML = slides[idx].html;
    [...dots.children].forEach((x, i) => x.classList.toggle("active", i === idx));
    panel.querySelector("#prevBtn").disabled = idx === 0;
    panel.querySelector("#nextBtn").innerHTML = idx === slides.length - 1 ? `Finish ${ICON.check}` : `Next ${ICON.arrowR}`;
    panel.querySelector("#prog").style.width = `${((idx + 1) / slides.length) * 100}%`;
    panel.querySelector("#counter").textContent = `${idx + 1} / ${slides.length}`;
    panel.querySelector("#stageBg").style.backgroundPosition = `${(idx / (slides.length - 1)) * 100}% center`;
  }
  panel.querySelector("#prevBtn").onclick = () => { if (idx > 0) { idx--; draw(-1); } };
  panel.querySelector("#nextBtn").onclick = () => {
    if (idx < slides.length - 1) { idx++; draw(1); return; }
    if (document.fullscreenElement) document.exitFullscreen();
    renderProjectsInline(weekN);
  };
  const fs = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen(); else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen(); };
  panel.querySelector("#fsBtn").onclick = fs;
  setKeys((e) => {
    if (e.target.matches && e.target.matches("input,textarea,[contenteditable]")) return;
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); panel.querySelector("#nextBtn").click(); }
    if (e.key === "ArrowLeft") panel.querySelector("#prevBtn").click();
    if (e.key === "f" || e.key === "F") fs();
  });
  draw(1);
}

function renderProjectsInline(weekN) {
  const wrap = document.getElementById("afterSlides");
  if (!wrap) return;
  wrap.innerHTML = `<div class="section-head"><div><div class="kicker">Well done — lesson complete</div><h2>This week's project menu — choose one</h2></div></div><div class="proj-grid" id="inlineProj"></div>`;
  renderProjectCards(wrap.querySelector("#inlineProj"), weekN);
  starConfetti(40);
  wrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- worksheet (Tue/Thu) ---------- */
function qBlock(section, key, i, text, weekN) {
  const storageKey = `wonder_w${weekN}_${key}_${section}_${i}`;
  return `<div class="qa"><p>${text}</p><textarea data-key="${storageKey}" placeholder="Type your answer…"></textarea></div>`;
}

function renderWorksheet(panel, d, key, weekN) {
  let names = ["Reader 1", "Reader 2", "Reader 3", "Reader 4"];
  try { const s = JSON.parse(LS.get("wonder_turn_names") || "null"); if (Array.isArray(s) && s.length === 4) names = s; } catch (e) {}
  let turn = 0;
  panel.innerHTML = `<div class="ws-layout">
    <aside class="ws-side">
      <div class="side-card"><h4>View</h4><div class="seg"><button class="active" id="onscreenBtn">🖥 On-screen</button><button id="printBtn">🖨 Printable</button></div></div>
      <div class="side-card"><h4>Reading turns <button class="btn ghost small" id="rotateBtn" style="width:auto;margin:0;padding:6px 12px;white-space:nowrap">Rotate →</button></h4>
        <div class="turns" id="turns"></div><p class="mini">Tap a reader to give them the turn. Click a name to rename it.</p></div>
      <div class="side-card"><h4>Answers <span class="saved-flag" id="savedFlag">✓ Saved</span></h4><p class="mini" style="margin:0">Answers save automatically in this browser.</p>
        <button class="btn teal small" onclick="openPrint(worksheetSheetHTML(WEEK_CONTENT[${weekN}]['${key}'], ${weekN}))">${ICON.print} Print this worksheet</button></div>
    </aside>
    <div>
      <div class="worksheet" id="onscreenView">
        <div class="ws-head"><h3>👥 Group read — ${d.range}</h3><p>Read together in turns, talk it through, then write your group's best thinking.</p></div>
        <div class="ws-sec"><h4>${imgTag("iconLeadIn", "")}Lead-in</h4>${d.leadIn.map((q, i) => qBlock("leadin", key, i, q, weekN)).join("")}</div>
        <div class="ws-sec"><h4><span class="emo">🧠</span>Comprehension &amp; inference</h4>${d.comprehension.map((q, i) => qBlock("comp", key, i, q, weekN)).join("")}</div>
        <div class="ws-sec"><h4>${imgTag("iconGoAway", "")}Go-away reflection</h4>${qBlock("goaway", key, 0, d.goAway, weekN)}</div>
      </div>
      <div class="print-preview" id="printView" style="display:none">${worksheetSheetHTML(d, weekN)}
        <div style="text-align:center;margin-top:16px"><button class="btn" onclick="openPrint(worksheetSheetHTML(WEEK_CONTENT[${weekN}]['${key}'], ${weekN}))">${ICON.print} Print this worksheet</button></div></div>
    </div></div>`;
  const flag = panel.querySelector("#savedFlag"); let t;
  panel.querySelectorAll("#onscreenView textarea").forEach((ta) => {
    const saved = LS.get(ta.dataset.key); if (saved) ta.value = saved;
    ta.addEventListener("input", () => { LS.set(ta.dataset.key, ta.value); flag.classList.add("show"); clearTimeout(t); t = setTimeout(() => flag.classList.remove("show"), 1300); });
  });
  const turnsEl = panel.querySelector("#turns");
  function drawTurns() {
    turnsEl.innerHTML = "";
    names.forEach((nm, i) => {
      const el = document.createElement("div");
      el.className = "turn" + (i === turn ? " on" : "");
      el.innerHTML = `<span class="pebble">${i + 1}</span><input value="${nm.replace(/"/g, "&quot;")}" aria-label="Reader ${i + 1}">`;
      el.onclick = (e) => { if (e.target.tagName === "INPUT" && i === turn) return; turn = i; drawTurns(); };
      el.querySelector("input").addEventListener("input", (e) => { names[i] = e.target.value; LS.set("wonder_turn_names", JSON.stringify(names)); });
      turnsEl.appendChild(el);
    });
  }
  drawTurns();
  panel.querySelector("#rotateBtn").onclick = () => { turn = (turn + 1) % names.length; drawTurns(); };
  const on = panel.querySelector("#onscreenBtn"), pr = panel.querySelector("#printBtn");
  on.onclick = () => { on.classList.add("active"); pr.classList.remove("active"); panel.querySelector("#onscreenView").style.display = ""; panel.querySelector("#printView").style.display = "none"; };
  pr.onclick = () => { pr.classList.add("active"); on.classList.remove("active"); panel.querySelector("#onscreenView").style.display = "none"; panel.querySelector("#printView").style.display = ""; };
}

function worksheetSheetHTML(d, weekN) {
  return `<div class="sheet">
      <div class="lp-head"><span class="tag">WEEK ${weekN}</span><span class="tag">${d.label.toUpperCase()}</span><span class="tag">GROUP READ</span><h3 style="margin:8px 0 0">${d.range}</h3></div>
      <p><b>Names:</b> ______________________________________________</p>
      <h4 class="sec">💡 Lead-in</h4>
      ${d.leadIn.map((q) => `<p>${q}</p><div class="line"></div>`).join("")}
      <h4 class="sec">🧠 Comprehension &amp; inference</h4>
      ${d.comprehension.map((q) => `<p>${q}</p><div class="line"></div><div class="line"></div>`).join("")}
      <h4 class="sec">👣 Go-away reflection</h4>
      <p>${d.goAway}</p>
      <div class="line"></div><div class="line"></div><div class="line"></div>
    </div>`;
}

/* ---------- quiz (Fri) ---------- */
function renderQuizDay(panel, weekN) {
  const quiz = QUIZZES[weekN];
  const C = 2 * Math.PI * 62;
  panel.innerHTML = `<div class="quiz-layout">
    <div><div class="qlist" id="quizList"></div>
      <div style="text-align:center;margin-top:18px"><button class="btn coral big" id="submitQuiz">${ICON.check} Submit quiz</button></div>
      <div class="quiz-score" id="quizResult"></div></div>
    <aside class="quiz-side">
      <div class="side-card" style="text-align:center">
        <div class="ring"><svg viewBox="0 0 150 150"><defs><linearGradient id="ringGrad" x1="0" x2="1"><stop offset="0" stop-color="#f2a93b"/><stop offset="1" stop-color="#e8604c"/></linearGradient></defs><circle class="track" cx="75" cy="75" r="62"/><circle class="fill" id="ringFill" cx="75" cy="75" r="62" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
          <div class="lbl"><div><b id="ringNum">0</b><span>of ${quiz.length} answered</span></div></div></div>
        <label class="switch"><input type="checkbox" id="instantFeedback" checked> Show feedback instantly</label>
      </div>
      <div class="side-card"><h4>Print</h4>
        <button class="btn ghost small" onclick="openPrint(quizPrintHTML(${weekN}, false))">${ICON.print} Student copy</button>
        <button class="btn ghost small" onclick="openPrint(quizPrintHTML(${weekN}, true))">${ICON.print} Answer key</button></div>
    </aside></div>`;
  const list = panel.querySelector("#quizList");
  quiz.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "qcard"; card.dataset.i = i;
    if (q.type === "mc") {
      card.innerHTML = `<div class="qbadge">${i + 1}</div><div class="qn">Question ${i + 1} of ${quiz.length}</div><p class="qtext">${q.q}</p>
        <div class="opts">${q.opts.map((o, oi) => `<label><input type="radio" name="q${i}" value="${oi}"><span class="letter">${String.fromCharCode(65 + oi)}</span><span>${o}</span></label>`).join("")}</div>
        <div class="feedback"></div>`;
      card.querySelectorAll("input[type=radio]").forEach((r) => r.addEventListener("change", () => {
        card.classList.add("answered"); update();
        if (panel.querySelector("#instantFeedback").checked) markOne(card, q, parseInt(r.value, 10));
      }));
    } else {
      card.innerHTML = `<div class="qbadge">${i + 1}</div><div class="qn">Question ${i + 1} of ${quiz.length}<span class="open">Open answer</span></div><p class="qtext">${q.q}</p>
        <div class="short-answer"><textarea placeholder="Type your answer…"></textarea></div>
        <button class="reveal-btn" type="button">Show sample answer</button>
        <div class="model-answer"><div><div class="inner"><b>Sample answer:</b> ${q.model}</div></div></div>`;
      card.querySelector("textarea").addEventListener("input", (e) => { card.classList.toggle("answered", !!e.target.value.trim()); update(); });
      card.querySelector(".reveal-btn").addEventListener("click", function () {
        const m = card.querySelector(".model-answer"); m.classList.toggle("show");
        this.textContent = m.classList.contains("show") ? "Hide sample answer" : "Show sample answer";
      });
    }
    list.appendChild(card);
  });
  function update() {
    const n = list.querySelectorAll(".qcard.answered").length;
    panel.querySelector("#ringNum").textContent = n;
    panel.querySelector("#ringFill").style.strokeDashoffset = C * (1 - n / quiz.length);
  }
  panel.querySelector("#submitQuiz").onclick = () => {
    let score = 0, total = 0;
    quiz.forEach((q, i) => {
      if (q.type !== "mc") return;
      total++;
      const card = list.querySelector(`.qcard[data-i="${i}"]`);
      const sel = card.querySelector("input[type=radio]:checked");
      if (markOne(card, q, sel ? parseInt(sel.value, 10) : -1)) score++;
    });
    const pct = total ? Math.round((score / total) * 100) : 0;
    const res = panel.querySelector("#quizResult");
    res.innerHTML = `${IMGS.quizChampionBadge ? `<div class="badge"><img src="${IMGS.quizChampionBadge}" alt="Quiz champion badge"><span>${pct}%</span></div>` : ""}
      <div class="num">${score} / ${total}</div>
      <p>Auto-marked multiple-choice score — open-answer questions are self-checked against the sample answers above.</p>`;
    res.classList.remove("show"); void res.offsetWidth; res.classList.add("show");
    res.scrollIntoView({ behavior: "smooth", block: "center" });
    if (pct >= 50) starConfetti();
  };
}

function markOne(card, q, val) {
  const correct = val === q.correct;
  card.classList.remove("correct", "incorrect");
  void card.offsetWidth;
  card.classList.add(correct ? "correct" : "incorrect");
  const fb = card.querySelector(".feedback");
  fb.classList.add("show");
  fb.textContent = correct ? "✓ Correct!" : `Not quite — correct answer: ${q.opts[q.correct]}`;
  return correct;
}

/* ---------- week 10 ---------- */
function dayDefsForWeek(n) {
  if (n === 10) {
    return [
      Object.assign({ key: "mon", mode: "project" }, WEEK10.lessons[0]),
      Object.assign({ key: "tue", mode: "project" }, WEEK10.lessons[1]),
      Object.assign({ key: "wed", mode: "project" }, WEEK10.lessons[2]),
      Object.assign({ key: "thu", mode: "present" }, WEEK10.presentDay),
      Object.assign({ key: "fri", mode: "celebrate" }, WEEK10.celebrateDay),
    ];
  }
  return dayOrder.map((k) => Object.assign({ key: k }, WEEK_CONTENT[n][k]));
}

function renderWeek10Day(panel, d) {
  if (d.mode === "project") {
    panel.innerHTML = `<div class="lesson-card reveal"><div class="emo">${d.icon}</div><div><h3>${d.title}</h3><p>${d.desc}</p><div class="time">⏱ ${d.time} · No new reading this week — students apply everything they've learned.</div></div></div>
      <div class="section-head" style="margin-top:10px"><div><div class="kicker">Choose one</div><h2>🎯 Final project options</h2></div></div><div class="proj-grid" id="w10opts"></div>`;
    renderProjectCards(panel.querySelector("#w10opts"), 10);
  } else if (d.mode === "present") {
    panel.innerHTML = `<div class="feature-panel reveal"><div class="bg" style="background-image:url('${IMGS.finalProjectBanner || ""}')"></div>
        <div class="fp">${imgTag("presentationDayIcon", "")}<div class="fp-text"><small>${d.label}</small><h3>${d.title}</h3><p>${d.desc}</p></div></div></div>
      <div class="section-head" style="margin-top:10px"><div><div class="kicker">Assessment</div><h2>📋 Final project rubric</h2></div></div>
      ${week10RubricTableHTML("rubric3")}`;
  } else {
    panel.innerHTML = `<div class="feature-panel reveal"><div class="bg" style="background-image:url('${banner(10)}')"></div>
        <div class="fp">${imgTag("choiceKindBadge", "")}<div class="fp-text"><small>${d.label}</small><h3>${d.title}</h3><p>${d.desc}</p></div></div></div>
      <div class="section-head" style="margin-top:10px"><div><div class="kicker">Certificates</div><h2>Certificate of Choosing Kind</h2><p>Print blank certificates to hand out — or click the name line to type a student's name first.</p></div>
        <div class="toolbar"><button class="btn coral" id="printCertBtn">${ICON.print} Print certificate</button></div></div>
      <div class="cert-preview" style="background-image:url('${IMGS.certificateBorder || ""}')">
        <div class="ribbon-t">Wonder Book Club</div><h3>Certificate of Choosing Kind</h3><p>is proudly awarded to</p><div class="name" id="certName" contenteditable="true" spellcheck="false"></div>
        <p>for the kindness, courage and effort shown throughout our <em>Wonder</em> book study this term.</p>${imgTag("choiceKindBadge", "")}</div>`;
    panel.querySelector("#printCertBtn").onclick = () => printCertificate(panel.querySelector("#certName").textContent.trim());
  }
}

function week10RubricTableHTML(cls) {
  return `<div class="table-scroll"><table class="${cls}"><thead><tr><th>Criteria</th><th>Not Achieved</th><th>Working Towards</th><th>Achieved</th></tr></thead>
    <tbody>${WEEK10_RUBRIC_3.map((r) => `<tr><td><b>${r.criteria}</b><small>${r.ao}</small></td><td>${r.na}</td><td>${r.wt}</td><td>${r.a}</td></tr>`).join("")}</tbody></table></div>`;
}

/* ============ RUBRIC PAGE (3 levels, matching the teacher pack marking guide) ============ */
function renderRubricPage() {
  const main = shell(`${crumbHome}${sep}<span class="here">Rubric</span>`, "rubric");
  main.innerHTML = `<div class="wrap">
    <div class="page-head reveal"><div class="bg" style="background-image:url('${IMGS.preceptsWallBg || banner(2)}')"></div>${imgTag("iconQuizDay", "ph-icon")}
      <div class="ph-text"><small>Term-long tracking</small><h1>Reading Progress Rubric</h1><p>Ten criteria from the NZC alignment. Click a level to mark where the class is at right now — tap a criterion to see what each level looks like.</p></div>
      <div class="toolbar no-print"><button class="btn glass small" onclick="printBlankRubric()">${ICON.print} Print blank rubric (per student)</button></div></div>
    <div class="explain reveal">${imgTag("choiceKindBadge", "")}<div><b>Three simple levels</b>Not Achieved · Working Towards · Achieved — the same levels as the marking guide in your teacher pack. Achieved means the curriculum expectation is met.</div></div>
    <div class="levels-legend"><span><i style="background:var(--na)"></i>Not Achieved</span><span><i style="background:var(--wt)"></i>Working Towards</span><span><i style="background:var(--a)"></i>Achieved</span></div>
    <div id="rList"></div>
    <p class="key-hint" style="text-align:left">✓ On-screen selections save automatically in this browser as a quick class reference. For individual student tracking, print a blank copy per student and mark it by hand.</p>
  </div>`;
  const list = main.querySelector("#rList");
  const open = new Set();
  function draw() {
    list.innerHTML = RUBRIC_CRITERIA.map((c) => {
      const g = MARKING_GUIDE.find((m) => m.code === c.code);
      const sv = LS.get("wonder_rubric3_" + c.code);
      return `<div class="rrow ${open.has(c.code) ? "open" : ""}"><div class="rcode">${c.code}</div>
        <button class="rtitle" data-code="${c.code}"><small>${c.strand}</small><b>${c.title}</b><span>${c.ev}</span><em>${open.has(c.code) ? "Hide levels ▴" : "What each level looks like ▾"}</em></button>
        <div class="lv3">${MARKING_LEVELS.map((l, li) => `<button data-code="${c.code}" data-l="${li}" class="${sv === String(li) ? "on" : ""}">${l}</button>`).join("")}</div>
        <div class="rdetail"><div><div class="rd"><div class="exp"><b>Curriculum expectation:</b> ${g.expectation}</div>
          <div class="three"><div class="na"><b>Not Achieved</b>${g.notAchieved}</div><div class="wt"><b>Working Towards</b>${g.workingTowards}</div><div class="a"><b>Achieved</b>${g.achieved}</div></div></div></div></div></div>`;
    }).join("");
    list.querySelectorAll(".rtitle").forEach((b) => b.onclick = () => { const c = b.dataset.code; open.has(c) ? open.delete(c) : open.add(c); draw(); });
    list.querySelectorAll(".lv3 button").forEach((b) => b.onclick = () => { LS.set("wonder_rubric3_" + b.dataset.code, b.dataset.l); draw(); });
  }
  draw();
  reveal(main);
}

/* ============ PRINT STAGE HELPER ============ */
function openPrint(html){
  const stage = document.getElementById('printStage');
  stage.innerHTML = html;
  stage.classList.add('active');
  document.body.classList.add('printing');
  // wait for any images in the sheet to be ready before printing
  const imgs = [...stage.querySelectorAll('img')];
  Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))).then(() => setTimeout(()=>window.print(), 80));
}
window.addEventListener('afterprint', ()=>{
  document.body.classList.remove('printing');
  document.getElementById('printStage').classList.remove('active');
});

function nzcBoxHTML(){
  return `<div class="nzc-box">
    <b>NZ Curriculum alignment — English, Level 3–4</b><br>
    ${NZC_ALIGNMENT.strands.map(s=>`<b>${s.name}:</b> ${s.points.join(' ')}`).join('<br>')}<br>
    <b>Key competencies:</b> ${NZC_ALIGNMENT.competencies}<br>
    <b>Values:</b> ${NZC_ALIGNMENT.values}<br>
    <b>Cross-curricular:</b> ${NZC_ALIGNMENT.cross}
  </div>`;
}

/* ============ DOWNLOADABLE READING SCHEDULE ============ */
function downloadReadingSchedule(){
  const weekSection = (n)=>{
    const dayRows = dayOrder.map(k=>{
      const d = WEEK_CONTENT[n][k];
      if(d.mode==='quiz'){
        return `<tr><td>${d.label}</td><td>Quiz day — no new reading</td><td>Friday Quiz covering Monday–Thursday's reading</td></tr>`;
      }
      const modeName = d.mode==='teach' ? 'Teacher reads aloud (whole class)' : 'Group reading (students take turns)';
      return `<tr><td>${d.label}</td><td>${d.range}</td><td>${modeName}</td></tr>`;
    }).join('');
    const meta = WEEKS_META.find(w=>w.n===n);
    return `<h2>Week ${n} — ${meta.title} (day by day)</h2>
      <table><thead><tr><th>Day</th><th>Reading range</th><th>How it's read</th></tr></thead><tbody>${dayRows}</tbody></table>`;
  };
  const allWeeks = [1,2,3,4,5,6,7,8,9].map(weekSection).join('');
  const termRows = WEEKS_META.map(w=>`<tr><td>Week ${w.n}</td><td>${w.title}</td><td>${w.theme}</td></tr>`).join('');
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Wonder Book Club — Reading Schedule</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;max-width:760px;margin:36px auto;padding:0 20px;color:#1c1f2b;line-height:1.55;}
  h1{font-family:'Trebuchet MS',sans-serif;color:#12203d;margin-bottom:2px;}
  p.lede{color:#555;margin-top:0;}
  h2{font-family:'Trebuchet MS',sans-serif;color:#d88f22;border-bottom:2px solid #eee;padding-bottom:5px;margin-top:34px;}
  table{width:100%;border-collapse:collapse;margin-top:10px;}
  th,td{border:1px solid #ccc;padding:8px 10px;text-align:left;font-size:.92rem;vertical-align:top;}
  th{background:#12203d;color:#fff;}
  tr:nth-child(even) td{background:#faf8f2;}
  .note{font-size:.82rem;color:#666;margin-top:8px;}
  @media print{ body{margin:0;} }
</style></head><body>
  <h1>📖 Wonder Book Club — Reading Schedule</h1>
  <p class="lede">How much the class reads, and when, across the term.</p>
  ${allWeeks}
  <p class="note">Each Monday–Thursday lesson runs ~45 minutes: 5 min lead-in, 15–20 min reading, 15 min comprehension/inference, 5 min reflection. Friday is quiz day — no new reading. Week 10 has no new reading — it's the final project and celebration week.</p>
  <h2>Full term overview</h2>
  <table><thead><tr><th>Week</th><th>Book section covered</th><th>Theme</th></tr></thead><tbody>${termRows}</tbody></table>
  <p class="note">Downloaded from the Wonder Book Club app.</p>
</body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Wonder-Book-Club-Reading-Schedule.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ============ TEACHER PACK (planning + marking guide, standalone download) ============ */
function teacherPackDayPlanHTML(weekN, d, quiz){
  if(d.mode === 'quiz'){
    const mcCount = quiz.filter(q=>q.type==='mc').length;
    return `<div class="plan">
      <h3>Week ${weekN} · ${d.label} — Quiz Day</h3>
      <p class="timing"><b>Timing:</b> 5 min recap · 25 min quiz · 10 min review answers · 5 min project check-in</p>
      <p>20 questions covering all four reading chunks this week (${mcCount} auto-marked multiple-choice, ${quiz.length-mcCount} open-answer/self-checked). See the in-app "Print Week Pack" for the full student copy and teacher answer key.</p>
      <p class="rubric-line"><b>📊 Rubric checkpoint (${d.rubric.join(', ')}):</b> ${d.rubricNote}</p>
    </div>`;
  }
  const modeName = d.mode==='teach' ? 'Teacher Read' : 'Group Read';
  return `<div class="plan">
    <h3>Week ${weekN} · ${d.label} — ${modeName}</h3>
    <p class="timing"><b>Reading range:</b> ${d.range} &nbsp;|&nbsp; <b>Timing:</b> ${TIMING.join(' · ')}</p>
    <p><b>💡 Lead-in:</b> ${d.leadIn.join(' ')}</p>
    <p><b>🧠 Comprehension &amp; inference:</b> ${d.comprehension.join(' ')}</p>
    <p><b>👣 Go-away reflection:</b> ${d.goAway}</p>
    <p class="rubric-line"><b>📊 Rubric checkpoint (${d.rubric.join(', ')}):</b> ${d.rubricNote}</p>
  </div>`;
}

function teacherPackWeek10PlanHTML(){
  const defs = dayDefsForWeek(10);
  const rows = defs.map(d=>`<div class="plan">
      <h3>Week 10 · ${d.label} — ${d.title}</h3>
      <p>${d.desc}</p>
    </div>`).join('');
  return `<div class="plan"><h3>Week 10 — Final Project &amp; Celebration overview</h3>
    <p><b>Learning Intention:</b> ${WEEK10.learningIntention}</p>
    <p><b>Success Criteria:</b> ${WEEK10.successCriteria}</p>
    <p><b>Final project options (student choice):</b></p>
    <ul>${WEEK10.options.map(o=>`<li><b>${o.title}.</b> ${o.desc}</li>`).join('')}</ul>
  </div>${rows}`;
}

function teacherPackHTML(){
  // Reading schedule (all 10 weeks)
  const scheduleRows = (n)=>{
    if(n===10) return `<tr><td>Week 10</td><td colspan="2">Final project &amp; celebration week — no new reading</td></tr>`;
    const dayRows = dayOrder.map(k=>{
      const d = WEEK_CONTENT[n][k];
      if(d.mode==='quiz') return `<tr><td>Wk${n} ${d.label}</td><td>Quiz day — no new reading</td><td>Friday Quiz</td></tr>`;
      const modeName = d.mode==='teach' ? 'Teacher reads aloud' : 'Group reading';
      return `<tr><td>Wk${n} ${d.label}</td><td>${d.range}</td><td>${modeName}</td></tr>`;
    }).join('');
    return dayRows;
  };
  const scheduleBody = [1,2,3,4,5,6,7,8,9].map(scheduleRows).join('') + scheduleRows(10);
  const termRows = WEEKS_META.map(w=>`<tr><td>Week ${w.n}</td><td>${w.title}</td><td>${w.theme}</td></tr>`).join('');

  // All lesson plans, week by week
  const allPlans = [1,2,3,4,5,6,7,8,9].map(n=>{
    const weekTitle = WEEKS_META.find(w=>w.n===n).title;
    const dayPlans = dayOrder.map(k=>teacherPackDayPlanHTML(n, WEEK_CONTENT[n][k], QUIZZES[n])).join('');
    return `<div class="week-block">
      <h2>Week ${n} — ${weekTitle}</h2>
      <p class="li-sc"><b>Learning Intention:</b> ${WEEK_CONTENT[n].learningIntention}<br><b>Success Criteria:</b> ${WEEK_CONTENT[n].successCriteria}</p>
      ${dayPlans}
    </div>`;
  }).join('') + `<div class="week-block">${teacherPackWeek10PlanHTML()}</div>`;

  // Marking guide — 3-level exemplars
  const markingGuide = MARKING_GUIDE.map(m=>`
    <div class="guide-card">
      <h3>${m.code} — ${m.title}</h3>
      <p class="strand">${m.strand}</p>
      <p class="expectation"><b>Curriculum expectation:</b> ${m.expectation}</p>
      <table class="levels">
        <tr><th>Not Achieved</th><th>Working Towards</th><th>Achieved</th></tr>
        <tr><td>${m.notAchieved}</td><td>${m.workingTowards}</td><td><b>${m.achieved}</b></td></tr>
      </table>
    </div>`).join('');

  // Class achievement tracker — one blank table per criterion, 28 blank student rows, 3 tick columns
  const blankRows = (count)=>Array.from({length:count}, ()=>`<tr><td class="nameline">&nbsp;</td><td class="tick">☐</td><td class="tick">☐</td><td class="tick">☐</td></tr>`).join('');
  const trackerTables = MARKING_GUIDE.map(m=>`
    <div class="tracker-block">
      <h3>${m.code} — ${m.title}</h3>
      <p class="strand">${m.strand}</p>
      <table class="tracker">
        <thead><tr><th>Student name</th><th>Not Achieved</th><th>Working Towards</th><th>Achieved</th></tr></thead>
        <tbody>${blankRows(28)}</tbody>
      </table>
    </div>`).join('');

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Wonder Book Club — Teacher Pack</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;max-width:900px;margin:36px auto;padding:0 20px;color:#1c1f2b;line-height:1.55;}
  h1{font-family:'Trebuchet MS',sans-serif;color:#12203d;margin-bottom:2px;}
  h2{font-family:'Trebuchet MS',sans-serif;color:#d88f22;border-bottom:2px solid #eee;padding-bottom:5px;margin-top:40px;page-break-before:always;}
  h1+p+h2{page-break-before:avoid;}
  h3{font-family:'Trebuchet MS',sans-serif;color:#12203d;margin:18px 0 4px;font-size:1.02rem;}
  p.lede,p.sub{color:#555;margin-top:0;}
  table{width:100%;border-collapse:collapse;margin-top:8px;}
  th,td{border:1px solid #ccc;padding:7px 9px;text-align:left;font-size:.86rem;vertical-align:top;}
  th{background:#12203d;color:#fff;}
  tr:nth-child(even) td{background:#faf8f2;}
  .note{font-size:.8rem;color:#666;margin-top:8px;}
  .toc{background:#f4f4ef;border:1px solid #ddd;border-radius:8px;padding:14px 20px;margin:20px 0;}
  .toc ol{margin:6px 0 0;padding-left:20px;}
  .cover{text-align:center;padding:36px 0 30px;}
  .cover .cover-img{width:100%;max-height:300px;object-fit:cover;border-radius:14px;margin-bottom:22px;box-shadow:0 4px 18px rgba(0,0,0,.18);}
  .cover .eyebrow{color:#d88f22;font-family:'Trebuchet MS',sans-serif;font-weight:bold;letter-spacing:1px;}
  .plan{border:1px solid #ddd;border-radius:8px;padding:10px 16px;margin:10px 0;background:#fffefb;page-break-inside:avoid;break-inside:avoid;}
  .plan h3{margin-top:0;}
  .plan .timing{font-size:.82rem;color:#555;}
  .plan .rubric-line{background:#fdf3e0;border-left:3px solid #d88f22;padding:6px 10px;font-size:.82rem;margin:8px 0 0;}
  .week-block{margin-bottom:10px;}
  .li-sc{font-size:.88rem;background:#eef2fb;border-radius:6px;padding:8px 12px;}
  .guide-card{border:1px solid #ccc;border-radius:8px;padding:12px 16px;margin:16px 0;page-break-inside:avoid;break-inside:avoid;}
  .guide-card .strand{font-size:.76rem;text-transform:uppercase;letter-spacing:.4px;color:#2e9ca6;font-weight:bold;margin:0 0 4px;}
  .guide-card .expectation{font-size:.86rem;color:#333;background:#f4f4ef;border-radius:6px;padding:6px 10px;}
  table.levels th{background:#eee;color:#333;font-size:.76rem;text-transform:uppercase;text-align:center;}
  table.levels td{font-size:.82rem;width:33.33%;}
  table.levels td b{color:#1a7a34;}
  .tracker-block{margin:20px 0;page-break-inside:avoid;break-inside:avoid;}
  table.tracker th{font-size:.78rem;text-align:center;}
  table.tracker th:first-child{text-align:left;}
  table.tracker td.nameline{border-bottom:1px solid #999;height:1.4em;}
  table.tracker td.tick{text-align:center;font-size:1.05rem;width:14%;}
  .howto{background:#eef7f8;border-left:3px solid #2e9ca6;padding:10px 14px;border-radius:0 6px 6px 0;font-size:.86rem;margin:14px 0;}
  @media print{ body{margin:0;} .toc{page-break-after:always;} }
</style></head><body>

  <div class="cover">
    ${IMG().heroBanner ? `<img class="cover-img" src="${IMG().heroBanner}" alt="">` : ''}
    <div class="eyebrow">YEARS 5–6 · TERM BOOK STUDY · NZ CURRICULUM LEVEL 3–4 ENGLISH</div>
    <h1 style="font-size:2rem;">📗 Wonder Book Club — Teacher Pack</h1>
    <p class="lede">Reading schedule, every lesson plan, and a curriculum-linked marking guide with a class achievement tracker, for the full 10-week <em>Wonder</em> unit.</p>
  </div>

  <div class="toc">
    <b>What's inside</b>
    <ol>
      <li>Reading &amp; chapter schedule (all 10 weeks)</li>
      <li>Every lesson plan (Weeks 1–10)</li>
      <li>Marking guide — curriculum expectations with exemplars (3 levels)</li>
      <li>Class achievement tracker (one blank table per criterion, with tick boxes)</li>
    </ol>
  </div>

  <h2 style="page-break-before:avoid;">1 · Reading &amp; Chapter Schedule</h2>
  <p class="sub">How much the class reads, and when, across the term.</p>
  <table><thead><tr><th>Day</th><th>Reading range</th><th>How it's read</th></tr></thead><tbody>${scheduleBody}</tbody></table>
  <p class="note">Each Monday–Thursday lesson runs ~45 minutes: 5 min lead-in, 15–20 min reading, 15 min comprehension/inference, 5 min reflection. Friday is quiz day — no new reading. Week 10 has no new reading — it's the final project and celebration week.</p>
  <h3>Full term overview</h3>
  <table><thead><tr><th>Week</th><th>Book section covered</th><th>Theme</th></tr></thead><tbody>${termRows}</tbody></table>

  <h2>2 · Lesson Plans — Weeks 1–10</h2>
  <p class="sub">Learning intention, success criteria, reading range, questions, and rubric checkpoint for every lesson.</p>
  ${allPlans}

  <h2>3 · Marking Guide — Curriculum Expectations &amp; Exemplars</h2>
  <div class="howto">
    <b>How to use this guide:</b> Each of the 10 criteria below is drawn from the NZ Curriculum alignment for this unit (Listening/Reading/Viewing, Speaking/Writing/Presenting, Key Competencies, and Values). For each one, mark students against just three levels — <b>Not Achieved</b>, <b>Working Towards</b>, or <b>Achieved</b> — using the example description in each column as your guide to what that actually looks like from a student. You don't need to judge every criterion every week: each lesson plan above flags which 2–3 codes it gives the best evidence for.
  </div>
  ${markingGuide}

  <h2>4 · Class Achievement Tracker</h2>
  <div class="howto">
    <b>How to use this tracker:</b> Write your students' names down the left-hand column (photocopy extra rows or an extra copy of a page if your class is larger than 28), then tick the box that matches what you've observed for that criterion — <b>Not Achieved</b>, <b>Working Towards</b>, or <b>Achieved</b> — as the term progresses. Use it alongside the exemplars in Section 3 so marking stays quick and consistent between criteria.
  </div>
  ${trackerTables}

  <p class="note" style="margin-top:30px;">Downloaded from the Wonder Book Club app — built from your Wonder book study blueprint.</p>
</body></html>`;
  return html;
}

function downloadTeacherPack(){
  const html = teacherPackHTML();
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Wonder-Book-Club-Teacher-Pack.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ============ TEACHER LESSON PLANS ============ */
function lessonPlanSheetHTML(weekN, key){
  const d = WEEK_CONTENT[weekN][key];
  const wk = WEEK_CONTENT[weekN];
  if(d.mode === 'quiz'){
    const quiz = QUIZZES[weekN];
    const mcCount = quiz.filter(q=>q.type==='mc').length;
    return `<div class="sheet">
      <div class="lp-head">
        <span class="tag">WEEK ${weekN}</span><span class="tag">FRIDAY</span><span class="tag">QUIZ DAY</span>
        <h3 style="margin:8px 0 0;">Teacher Lesson Plan — Friday Quiz</h3>
      </div>
      <div class="lp-grid">
        <div><b>Learning Intention</b>${wk.learningIntention}</div>
        <div><b>Success Criteria</b>${wk.successCriteria}</div>
      </div>
      ${nzcBoxHTML()}
      <h4 class="sec">Quiz overview</h4>
      <p>20 questions covering all four reading chunks from Week ${weekN} (${mcCount} auto-marked multiple-choice, ${quiz.length-mcCount} open-answer/self-checked). Student copy has no answers visible; a full answer key is included in the teacher appendix when printing the Week Pack.</p>
      <h4 class="sec">Suggested timing</h4>
      <div class="timing-row"><span>5 min · Recap the week</span><span>25 min · Quiz</span><span>10 min · Review answers together</span><span>5 min · Project menu check-in</span></div>
      <div class="rubric-flag">📊 <b>Rubric checkpoint (${d.rubric.join(', ')}):</b> ${d.rubricNote}</div>
    </div>`;
  }
  const modeName = d.mode==='teach' ? 'Teacher Read' : 'Group Read';
  return `<div class="sheet">
    <div class="lp-head">
      <span class="tag">WEEK ${weekN}</span><span class="tag">${d.label.toUpperCase()}</span><span class="tag">${modeName.toUpperCase()}</span>
      <h3 style="margin:8px 0 0;">Teacher Lesson Plan — ${d.label}</h3>
      <p style="margin:4px 0 0;color:#555;">Reading range: ${d.range}</p>
    </div>
    <div class="lp-grid">
      <div><b>Learning Intention</b>${wk.learningIntention}</div>
      <div><b>Success Criteria</b>${wk.successCriteria}</div>
    </div>
    ${nzcBoxHTML()}
    <h4 class="sec">Timing breakdown (45 min lesson)</h4>
    <div class="timing-row">${TIMING.map(t=>`<span>${t}</span>`).join('')}</div>
    <h4 class="sec">💡 Lead-in questions</h4>
    <p>${d.leadIn.join(' ')}</p>
    <h4 class="sec">🧠 Comprehension &amp; inference questions</h4>
    <p>${d.comprehension.join(' ')}</p>
    <h4 class="sec">👣 Go-away reflection prompt</h4>
    <p>${d.goAway}</p>
    <div class="rubric-flag">📊 <b>Rubric checkpoint (${d.rubric.join(', ')}):</b> ${d.rubricNote} Tick off on the class or student rubric once observed.</div>
  </div>`;
}

function week10SheetHTML(key){
  const defs = dayDefsForWeek(10);
  const d = defs.find(x=>x.key===key);
  return `<div class="sheet">
    <div class="lp-head">
      <span class="tag">WEEK 10</span><span class="tag">${d.label.toUpperCase()}</span>
      <h3 style="margin:8px 0 0;">${d.title}</h3>
    </div>
    <div class="lp-grid">
      <div><b>Learning Intention</b>${WEEK10.learningIntention}</div>
      <div><b>Success Criteria</b>${WEEK10.successCriteria}</div>
    </div>
    <p>${d.desc}</p>
  </div>`;
}

function printLessonPlan(){
  if(currentWeek===10){ openPrint(week10SheetHTML(currentDay)); }
  else { openPrint(lessonPlanSheetHTML(currentWeek, currentDay)); }
}

/* ============ QUIZ & PROJECTS PRINT SHEETS ============ */
function quizPrintHTML(weekN, withAnswers){
  const quiz = QUIZZES[weekN];
  const items = quiz.map((q,i)=>{
    if(q.type==='mc'){
      return `<div class="qprint"><p><b>${i+1}.</b> ${q.q}</p>
        <p style="margin:2px 0 6px 18px;">${q.opts.map((o,oi)=>`${String.fromCharCode(65+oi)}) ${o}`).join('&nbsp;&nbsp;&nbsp;')}</p>
        ${withAnswers?`<p style="margin:0 0 6px 18px;color:#1a7a34;"><b>Answer: ${String.fromCharCode(65+q.correct)}) ${q.opts[q.correct]}</b></p>`:''}</div>`;
    }
    return `<div class="qprint"><p><b>${i+1}.</b> ${q.q}</p>
      ${withAnswers?`<p style="margin:0 0 6px 18px;color:#1a7a34;"><b>Sample answer:</b> ${q.model}</p>`:`<div class="line"></div><div class="line"></div>`}</div>`;
  }).join('');
  return `<div class="sheet" style="page-break-inside:auto;">
    <h3>Week ${weekN} · Friday Quiz ${withAnswers?'— Teacher Answer Key':'— Student Copy'}</h3>
    <p><b>Name:</b> ______________________________________________</p>
    ${items}
  </div>`;
}

function projectsPrintHTML(weekN){
  const projects = PROJECTS[weekN];
  return `<div class="sheet">
    <h3>Week ${weekN} · Project Menu — choose one</h3>
    ${projects.map(p=>`<p><b>${p.icon} ${p.title}.</b> ${p.desc}</p>`).join('<div class="line"></div>')}
  </div>`;
}

/* ============ WEEK PACK (single print job) ============ */
function weekPackHTML(){
  if(currentWeek===10){
    let out = `<div class="sheet">
      <h3 style="font-size:1.5rem;">Wonder Book Club — Week 10 Pack</h3>
      <p>Final Project &amp; Celebration — everything you need to run the last week of the unit.</p>
      <p><b>Learning Intention:</b> ${WEEK10.learningIntention}</p>
      <p><b>Success Criteria:</b> ${WEEK10.successCriteria}</p>
    </div>`;
    out += `<div class="page-break sheet"><h3>Final Project Options</h3>${WEEK10.options.map(p=>`<p><b>${p.title}.</b> ${p.desc}</p>`).join('<div class="line"></div>')}</div>`;
    dayDefsForWeek(10).forEach(d=>{ out += `<div class="page-break">${week10SheetHTML(d.key)}</div>`; });
    out += `<div class="page-break sheet"><h3>Final Project Rubric</h3>${week10RubricTableHTML('')}</div>`;
    return out;
  }
  const weekN = currentWeek;
  const wk = WEEK_CONTENT[weekN];
  let out = `<div class="sheet">
    <h3 style="font-size:1.5rem;">Wonder Book Club — Week ${weekN} Pack</h3>
    <p>${WEEKS_META.find(w=>w.n===weekN).title} — everything you need to prep and photocopy for the week.</p>
    <p><b>Learning Intention:</b> ${wk.learningIntention}</p>
    <p><b>Success Criteria:</b> ${wk.successCriteria}</p>
    ${nzcBoxHTML()}
  </div>`;
  dayOrder.forEach(key=>{
    out += `<div class="page-break">${lessonPlanSheetHTML(weekN, key)}</div>`;
    const d = wk[key];
    if(d.mode==='group'){
      out += `<div class="page-break">${worksheetSheetHTML(d, weekN)}</div>`;
    }
  });
  out += `<div class="page-break">${projectsPrintHTML(weekN)}</div>`;
  out += `<div class="page-break">${quizPrintHTML(weekN, false)}</div>`;
  out += `<div class="page-break sheet"><h3>Teacher Appendix — Quiz Answer Key</h3></div>`;
  out += `<div class="page-break">${quizPrintHTML(weekN, true)}</div>`;
  return out;
}


/* ============ PRINTABLE RUBRIC & CERTIFICATE ============ */
function printBlankRubric(){
  const rows = MARKING_GUIDE.map(m=>`
    <div class="qprint" style="margin-bottom:12px">
      <p style="margin-bottom:2px;"><b>${m.code} — ${m.title}</b> <span style="color:#666;font-size:.78rem;">(${m.strand})</span></p>
      <p style="margin:0 0 4px;font-size:.8rem;color:#555;">${m.expectation}</p>
      <div class="tickrow"><span>☐ Not Achieved</span><span>☐ Working Towards</span><span>☐ Achieved</span></div>
    </div>`).join('');
  const html = `<div class="sheet">
    <div class="lp-head"><span class="tag">WONDER</span><span class="tag">READING PROGRESS RUBRIC</span><h3 style="margin:8px 0 0;">Reading Progress Rubric</h3></div>
    <p><b>Student name:</b> ______________________________________________</p>
    <p><b>Term / Class:</b> ______________________________________________</p>
    ${rows}
  </div>`;
  openPrint(html);
}

function printCertificate(name){
  const border = IMG().certificateBorder;
  const badge = IMG().choiceKindBadge;
  const html = `
    <div class="cert-page">
      ${border ? `<img class="cert-frame" src="${border}" alt="">` : ''}
      <div class="cert-ribbon">Wonder Book Club</div>
      <div class="cert-inner">
        <div class="cert-title">Certificate of Choosing Kind</div>
        <div class="cert-sub">is proudly awarded to</div>
        <div class="cert-name-line" style="font-family:'Baloo 2';font-size:1.6rem;color:#d88f22;">${name || '&nbsp;'}</div>
        <div class="cert-sub" style="margin-top:10px;">for the kindness, courage and effort shown throughout our<br><em>Wonder</em> book study this term.</div>
        ${badge ? `<img class="cert-badge" src="${badge}" alt="">` : ''}
        <div class="cert-footer">
          <span>Date: ___________________</span>
          <span>Teacher: ___________________</span>
        </div>
      </div>
    </div>`;
  openPrint(html);
}

/* ============ INIT ============ */
document.body.style.setProperty('--pattern', IMGS.patternBg ? `url('${IMGS.patternBg}')` : 'none');
const fl = document.getElementById('footerLogo'); if (fl && IMGS.logoMark) fl.src = IMGS.logoMark;
skyStars();
route();
