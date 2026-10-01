/* CareConnect Admin — shared helpers + page shell.
   Every page (dashboard.html, requests.html, …) loads data.js + common.js,
   then its own js/pages/<name>.js which calls mountPage(). */

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = n => n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const inr = n => "₹" + Number(n).toLocaleString("en-IN");
const STAGE_LABEL = { requested: "Requested", assigned: "Assigned", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
const EMP_LABEL = { active: "Active", free: "Free", busy: "Busy now", on_leave: "On leave", inactive: "Inactive" };
const badge = (cls, text) => `<span class="badge b-${cls}">${esc(text)}</span>`;
const stageBadge = s => badge(s, STAGE_LABEL[s]);
const svcName = id => (SERVICES.find(s => s.id === id) || {}).name || id;

/* UI state (filters etc.). stage can be preset via requests.html?stage=requested */
const ui = {
  stage: new URLSearchParams(location.search).get("stage") || "all",
  service: "", q: "", scheduleDate: ymd(new Date()),
  openBooking: null, openEmployee: null
};

/* ---------- toast / overlay ---------- */
function toast(msg, bad) {
  const t = document.createElement("div");
  t.className = "toast" + (bad ? " bad" : "");
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
function showOverlay(html, center) {
  $("#overlay").innerHTML = `<div class="overlay ${center ? "center" : ""}" onclick="if(event.target===this)closeOverlay()">${html}</div>`;
}
function closeOverlay() { $("#overlay").innerHTML = ""; ui.openBooking = ui.openEmployee = null; }

/* ---------- derived data ---------- */
const empById = id => DB.employees().find(e => e.id === id);
function empState(e, bookings) {
  if (e.status !== "active") return e.status;
  return currentJob(e.id, bookings) ? "busy" : "free";
}

/* ---------- booking mutations (used by several pages) ---------- */
function mutateBooking(id, fn, logText, logType) {
  const B = DB.bookings(), b = B.find(x => x.id === id);
  if (!b) return false;
  if (fn(b, B) === false) return false;
  b.status = statusForStage(b.stage);
  DB.saveBookings(B);
  if (logText) DB.log(logText, logType);
  return true;
}

/* ---------- filters ---------- */
function setFilter(k, v) { ui[k] = v; render(); }
function setSearch(v) { ui.q = v; render(); const s = $("#search"); if (s) { s.focus(); s.setSelectionRange(v.length, v.length); } }

/* ---------- page shell ---------- */
const NAV = [
  ["dashboard", "📊", "Dashboard"], ["requests", "📥", "Requests"], ["schedule", "🗓️", "Schedule"],
  ["employees", "🧑‍⚕️", "Employees"], ["patients", "🧑", "Patients"], ["plans", "💳", "Plans & Payments"], ["activity", "🔔", "Activity"]
];
const TITLES = Object.fromEntries(NAV.map(n => [n[0], n[2]]));
let currentRender = () => "";

function shellHtml(route) {
  return `
  <div class="shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><div class="logo">C</div> CareConnect</div>
      <nav class="nav">${NAV.map(([r, ic, label]) =>
        `<a href="${r}.html" class="${r === route ? "active" : ""}">${ic} ${label}${r === "requests" ? ` <span class="count hidden" id="navCount"></span>` : ""}</a>`).join("")}</nav>
      <div class="side-foot">
        <div>Admin · Super admin</div>
        <button id="resetBtn">↺ Reset demo data</button><br>
        <button id="logoutBtn">⎋ Sign out</button>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <button class="menu-btn" id="menuBtn">☰</button>
        <h1>${TITLES[route]}</h1>
        <button class="bell" id="bell" title="Unassigned requests">🔔<span class="dot hidden" id="bellDot"></span></button>
        <div class="avatar">AD</div>
      </header>
      <main class="view" id="view"></main>
    </div>
  </div>
  <div id="overlay"></div>`;
}

function render() {
  $("#view").innerHTML = currentRender();
  const n = DB.bookings().filter(b => b.stage === "requested").length;
  [["#navCount", n], ["#bellDot", n]].forEach(([s, v]) => { $(s).textContent = v; $(s).classList.toggle("hidden", !v); });
}
function rerenderOpen() {
  render();
  if (ui.openBooking && typeof openRequest === "function") openRequest(ui.openBooking);
  else if (ui.openEmployee && typeof openEmployee === "function") openEmployee(ui.openEmployee);
}

/* Called by each page script: mountPage("requests", () => html) */
function mountPage(route, renderFn) {
  if (!DB.get(AK.AUTH, false)) { location.replace("index.html"); return; }
  seedDemo();
  currentRender = renderFn;
  document.title = `${TITLES[route]} · CareConnect Admin`;
  document.body.insertAdjacentHTML("afterbegin", shellHtml(route));
  render();

  $("#logoutBtn").onclick = () => { DB.set(AK.AUTH, false); location.href = "index.html"; };
  $("#resetBtn").onclick = () => {
    if (!confirm("Reset admin demo data? This clears bookings, employees and activity in this browser.")) return;
    [AK.BOOKINGS, AK.EMPLOYEES, AK.ACTIVITY, AK.SEEDED].forEach(k => localStorage.removeItem(k));
    seedDemo(); closeOverlay(); render(); toast("Demo data reset");
  };
  $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
  $("#bell").onclick = () => { location.href = "requests.html?stage=requested"; };

  /* live updates when the patient app (another tab, same origin) raises a request */
  window.addEventListener("storage", e => {
    if (e.key !== AK.BOOKINGS) return;
    const em = DB.employees();
    DB.saveBookings(DB.bookings().map(b => normalize(b, em)));
    rerenderOpen(); toast("Bookings updated");
  });
}
