/* Request detail drawer + assignment actions.
   Used by: dashboard, requests, schedule, employees. */

function openRequest(id) {
  ui.openBooking = id; ui.openEmployee = null;
  const B = DB.bookings(), b = B.find(x => x.id === id);
  if (!b) return;
  const E = DB.employees();
  const emp = b.employeeId ? E.find(e => e.id === b.employeeId) : null;
  const canEdit = b.stage === "requested" || b.stage === "assigned";

  let candidates = "";
  if (canEdit) {
    const list = E.filter(e => e.id !== b.employeeId).map(e => ({ e, c: canAssign(e, b, B) }))
      .sort((x, y) => (y.c.ok - x.c.ok) || (y.e.area === b.area) - (x.e.area === b.area) || y.e.rating - x.e.rating);
    candidates = `<div class="section-title">${emp ? "Reassign to" : "Assign employee"}</div>` +
      list.map(({ e, c }) => `<div class="cand ${c.ok ? "" : "off"}">
        <div class="pic">${initials(e.name)}</div>
        <div class="grow"><div class="t">${esc(e.name)} <span class="small muted">⭐ ${e.rating}</span></div>
          <div class="small muted">📍 ${esc(e.area)}${e.area === b.area ? " · same area ✓" : ""}</div>
          ${c.ok ? "" : `<div class="reason">${esc(c.reason)}</div>`}</div>
        <button class="btn sm primary" ${c.ok ? "" : "disabled"} onclick="assign('${b.id}','${e.id}')">${emp ? "Reassign" : "Assign"}</button></div>`).join("");
  }

  showOverlay(`<div class="drawer">
    <div class="d-head"><div><h2>${esc(b.id)}</h2>${stageBadge(b.stage)}</div><button class="x" onclick="closeOverlay()">×</button></div>
    <dl class="kv">
      <dt>Patient</dt><dd>${esc(b.patient)}</dd>
      <dt>Requested by</dt><dd>${esc(b.customer)}</dd>
      <dt>Service</dt><dd>${esc(b.service)}</dd>
      <dt>Schedule</dt><dd>${rangeLabel(b)} (${esc(b.duration)})</dd>
      <dt>Address</dt><dd>${esc(b.address)}</dd>
      <dt>Amount</dt><dd>${inr(b.amount)}</dd>
      <dt>Raised</dt><dd>${new Date(b.requestedAt).toLocaleString("en-IN")}</dd>
    </dl>
    ${emp ? `<div class="section-title">Assigned employee</div>
      <div class="assigned-box"><div class="pic" style="background:#fff">${initials(emp.name)}</div><div style="flex:1"><b>${esc(emp.name)}</b><div class="small muted">${esc(emp.phone)} · ${b.ackAt ? "✓ Accepted" : "Awaiting acceptance"}</div></div></div>` : ""}
    ${candidates}
    <div class="section-title">Actions</div>
    <div class="row-btns">
      ${b.stage === "assigned" ? `<button class="btn sm" onclick="setStage('${b.id}','in_progress')">▶ Mark started</button><button class="btn sm" onclick="unassign('${b.id}')">Unassign</button>` : ""}
      ${b.stage === "in_progress" ? `<button class="btn sm" onclick="setStage('${b.id}','completed')">✔ Mark completed</button>` : ""}
      ${canEdit || b.stage === "in_progress" ? `<button class="btn sm danger" onclick="setStage('${b.id}','cancelled')">Cancel request</button>` : ""}
    </div>
    <p class="small muted">Start / complete will be driven by the Employee app later; buttons here simulate it.</p>
  </div>`);
}

function assign(bid, eid) {
  const ok = mutateBooking(bid, (b, B) => {
    const e = empById(eid), res = canAssign(e, b, B);   // re-check on save
    if (!res.ok) { toast(`Can't assign: ${res.reason}`, true); return false; }
    b.employeeId = e.id; b.caregiver = e.name; b.stage = "assigned"; b.ackAt = null;
    DB.log(`${b.id} assigned to ${e.name}`, "ok");
    toast(`Assigned to ${e.name}`);
  });
  render(); if (ok) openRequest(bid);
}
function unassign(bid) {
  mutateBooking(bid, b => { b.employeeId = null; b.caregiver = null; b.stage = "requested"; b.ackAt = null; }, `${bid} unassigned`, "new");
  toast("Unassigned"); render(); openRequest(bid);
}
function setStage(bid, stage) {
  mutateBooking(bid, b => { b.stage = stage; }, `${bid} → ${STAGE_LABEL[stage]}`, stage === "cancelled" ? "bad" : "ok");
  toast(`Marked ${STAGE_LABEL[stage].toLowerCase()}`); render(); openRequest(bid);
}
