/* Employee detail drawer + add-employee form.
   Used by: dashboard, employees. Needs request-drawer.js (openRequest). */

function openEmployee(id) {
  ui.openEmployee = id; ui.openBooking = null;
  const B = DB.bookings(), e = empById(id);
  if (!e) return;
  const st = empState(e, B), job = currentJob(e.id, B);
  const mine = B.filter(b => b.employeeId === e.id).sort((a, b) => startOf(b) - startOf(a));
  const upcoming = mine.filter(b => ACTIVE_STAGES.includes(b.stage));
  const done = mine.filter(b => b.stage === "completed");
  showOverlay(`<div class="drawer">
    <div class="d-head"><div style="display:flex;gap:12px;align-items:center"><div class="pic" style="width:48px;height:48px">${initials(e.name)}</div><div><h2>${esc(e.name)}</h2>${badge(st, EMP_LABEL[st])}</div></div><button class="x" onclick="closeOverlay()">×</button></div>
    <dl class="kv"><dt>ID</dt><dd>${esc(e.id)}</dd><dt>Phone</dt><dd>${esc(e.phone)}</dd><dt>Area</dt><dd>${esc(e.area)}</dd>
      <dt>Rating</dt><dd>⭐ ${e.rating}</dd><dt>Joined</dt><dd>${fmtDate(e.joined)}</dd><dt>Jobs done</dt><dd>${done.length}</dd></dl>
    <div>${e.skills.map(s => `<span class="tag">${esc(svcName(s))}</span>`).join("")}</div>
    <div class="section-title">Availability</div>
    <select onchange="setEmpStatus('${e.id}',this.value)" class="field" style="padding:8px;border:1px solid var(--line);border-radius:8px">
      ${["active", "on_leave", "inactive"].map(s => `<option value="${s}" ${e.status === s ? "selected" : ""}>${EMP_LABEL[s]}</option>`).join("")}</select>
    <div class="section-title">Current &amp; upcoming (${upcoming.length})</div>
    ${upcoming.length ? upcoming.map(b => `<div class="list-row" style="cursor:pointer" onclick="openRequest('${b.id}')"><div class="grow"><div class="t">${esc(b.service)} · ${esc(b.patient)}</div><div class="small muted">${rangeLabel(b)}</div></div>${stageBadge(b.stage)}</div>`).join("") : `<div class="muted small">Nothing scheduled — ${job ? "" : "free for assignment."}</div>`}
    <div class="section-title">History (${done.length})</div>
    ${done.slice(0, 6).map(b => `<div class="list-row"><div class="grow"><div class="t">${esc(b.service)} · ${esc(b.patient)}</div><div class="small muted">${fmtDate(b.date)}</div></div>${stageBadge(b.stage)}</div>`).join("") || `<div class="muted small">No completed jobs yet.</div>`}
  </div>`);
}

function setEmpStatus(id, status) {
  const B = DB.bookings();
  if (status !== "active" && B.some(b => b.employeeId === id && ACTIVE_STAGES.includes(b.stage))) {
    toast("Reassign their active jobs first", true); openEmployee(id); return;
  }
  const E = DB.employees(); E.find(e => e.id === id).status = status; DB.saveEmployees(E);
  DB.log(`${empById(id).name} set to ${EMP_LABEL[status]}`, "info");
  render(); openEmployee(id);
}

function employeeForm() {
  showOverlay(`<form class="modal" onsubmit="saveEmployee(event)">
    <div class="d-head"><h2>Add employee</h2><button type="button" class="x" onclick="closeOverlay()">×</button></div>
    <label class="field"><span>Full name</span><input name="name" required></label>
    <label class="field"><span>Phone</span><input name="phone" required placeholder="+91 "></label>
    <label class="field"><span>Area</span><select name="area">${AREAS.map(a => `<option>${a}</option>`).join("")}</select></label>
    <div class="section-title">Skills</div>
    ${SERVICES.map(s => `<label style="display:block;margin-bottom:4px"><input type="checkbox" name="skills" value="${s.id}"> ${s.name}</label>`).join("")}
    <div class="row-btns"><button class="btn primary" type="submit">Save employee</button><button class="btn" type="button" onclick="closeOverlay()">Cancel</button></div>
  </form>`, true);
}

function saveEmployee(ev) {
  ev.preventDefault();
  const f = new FormData(ev.target), skills = f.getAll("skills");
  if (!skills.length) { toast("Pick at least one skill", true); return; }
  const E = DB.employees();
  const n = Math.max(100, ...E.map(e => parseInt(e.id.split("-")[1], 10))) + 1;
  E.push({ id: `EMP-${n}`, name: f.get("name").trim(), phone: f.get("phone").trim(), skills, area: f.get("area"), rating: 4.5, status: "active", joined: ymd(new Date()) });
  DB.saveEmployees(E); DB.log(`Employee ${f.get("name")} added`, "ok");
  closeOverlay(); toast("Employee added"); render();
}
