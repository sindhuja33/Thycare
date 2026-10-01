/* CareConnect Employee app — shared helpers + page shell.
   Data layer is shared with the admin app (../admin/js/data.js) so both apps
   read/write the same localStorage bookings and employees (same origin required). */

const EMP_AUTH = "cc_emp_auth";           // holds the signed-in employee id
const ENFORCE_START_WINDOW = false;       // true = job can only be started on its scheduled date
const PAYOUT_RATE = 0.7;                  // prototype: employee earns 70% of booking amount

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = n => n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const STAGE_LABEL = { requested: "Requested", assigned: "Assigned", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
const badge = (cls, text) => `<span class="badge b-${cls}">${esc(text)}</span>`;
const svcName = id => (SERVICES.find(s => s.id === id) || {}).name || id;

/* ---------- current employee + their jobs (never anyone else's) ---------- */
const meId = () => DB.get(EMP_AUTH, null);
const me = () => DB.employees().find(e => e.id === meId());
const myJobs = () => DB.bookings().filter(b => b.employeeId === meId());
const isNew = b => b.stage === "assigned" && !b.ackAt;

function toast(msg, bad) {
  const t = document.createElement("div");
  t.className = "toast" + (bad ? " bad" : "");
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

/* ---------- job card (used on home / jobs / history) ---------- */
function jobCard(b) {
  const live = b.stage === "in_progress";
  let progress = "";
  if (live) {
    const s = startOf(b).getTime(), e = endOf(b).getTime();
    const pct = Math.max(4, Math.min(100, ((Date.now() - s) / (e - s)) * 100));
    progress = `<div class="progress"><div style="width:${pct}%"></div></div><div class="small muted">Ends ${fmtTime(endOf(b))}</div>`;
  }
  return `<div class="card job ${live ? "live" : ""}" onclick="openJob('${b.id}')">
    <div class="top"><div class="svc">${esc(b.service)}</div>${isNew(b) ? badge("new", "NEW") : badge(b.stage, STAGE_LABEL[b.stage])}</div>
    <div class="meta">👤 ${esc(b.patient)} · 📍 ${esc(b.area)}<br>🕒 ${rangeLabel(b)}</div>${progress}
  </div>`;
}

/* ---------- shell ---------- */
const NAV = [["home", "🏠", "Home"], ["jobs", "📋", "My Jobs"], ["history", "✅", "History"], ["profile", "👤", "Profile"]];
let currentRender = () => "";

function render() {
  $("#view").innerHTML = currentRender();
  const n = myJobs().filter(isNew).length;
  const c = $("#navCount"); if (c) { c.textContent = n; c.classList.toggle("hidden", !n); }
}

/* mountPage("home", () => html) — each page script calls this */
function mountPage(route, renderFn) {
  if (!DB.get(EMP_AUTH, null) || !me()) { location.replace("index.html"); return; }
  seedDemo();
  currentRender = renderFn;
  const titles = Object.fromEntries(NAV.map(n => [n[0], n[2]]));
  document.title = `${titles[route]} · CareConnect Employee`;
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="app"><main id="view"></main></div>
    <nav class="bottom-nav">${NAV.map(([r, ic, l]) =>
      `<a href="${r}.html" class="${r === route ? "active" : ""}"><span>${ic}</span>${l}${r === "jobs" ? `<b class="count hidden" id="navCount"></b>` : ""}</a>`).join("")}</nav>
    <div id="sheet"></div>`);
  render();

  /* live updates: admin assigns/changes a job in another tab */
  let known = myJobs().filter(isNew).length;
  window.addEventListener("storage", e => {
    if (e.key !== AK.BOOKINGS && e.key !== AK.EMPLOYEES) return;
    if (!me()) return;
    const fresh = myJobs().filter(isNew).length;
    if (fresh > known) toast("🔔 New job assigned to you");
    known = fresh; render();
    if (typeof refreshOpenJob === "function") refreshOpenJob();
  });
}
