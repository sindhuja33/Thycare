/* Job detail bottom sheet + employee actions (accept / decline / start / complete).
   Used by: home, jobs, history. */

let openJobId = null;

function closeJob() { $("#sheet").innerHTML = ""; openJobId = null; }
function refreshOpenJob() { if (openJobId) openJob(openJobId); }

function openJob(id) {
  const b = myJobs().find(x => x.id === id);   // only own jobs are reachable
  if (!b) { closeJob(); return; }
  openJobId = id;

  const patient = DB.patients().find(p => p.name === b.patient);
  const busyWith = myJobs().find(j => j.stage === "in_progress" && j.id !== b.id);
  const sameDay = b.date === ymd(new Date());
  let actions = "", hint = "";

  if (b.stage === "assigned") {
    const blocked = busyWith ? `Finish ${busyWith.id} first` : (ENFORCE_START_WINDOW && !sameDay ? `Starts on ${fmtDate(b.date)}` : "");
    actions = `<div class="btn-row">
        ${isNew(b) ? `<button class="btn danger" onclick="declineJob('${b.id}')">Decline</button><button class="btn primary" onclick="acceptJob('${b.id}')">Accept</button>` : ""}
      </div>
      <div class="btn-row"><button class="btn info" ${blocked ? "disabled" : ""} onclick="startJob('${b.id}')">▶ Start job</button></div>
      ${blocked ? `<div class="hint">${esc(blocked)}</div>` : ""}
      ${!isNew(b) ? `<div class="btn-row"><button class="btn danger" onclick="declineJob('${b.id}')">Can't make it – release job</button></div>` : ""}`;
  } else if (b.stage === "in_progress") {
    actions = `<div class="btn-row"><button class="btn primary" onclick="completeJob('${b.id}')">✔ Complete job</button></div>`;
  }

  $("#sheet").innerHTML = `<div class="sheet-wrap" onclick="if(event.target===this)closeJob()"><div class="sheet">
    <div class="head"><div><h2>${esc(b.service)}</h2><div>${isNew(b) ? badge("new", "NEW") : badge(b.stage, STAGE_LABEL[b.stage])} <span class="small muted">${esc(b.id)}</span></div></div><button class="x" onclick="closeJob()">×</button></div>
    <dl class="kv">
      <dt>Patient</dt><dd>${esc(b.patient)}</dd>
      <dt>When</dt><dd>${rangeLabel(b)}<br><span class="small muted">${esc(b.duration)}</span></dd>
      <dt>Address</dt><dd>${esc(b.address)}<br><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}" target="_blank" rel="noopener" class="small">Open in Maps ↗</a></dd>
      <dt>Booked by</dt><dd>${esc(b.customer)}</dd>
      <dt>Payout</dt><dd>${inr(b.amount * PAYOUT_RATE)} <span class="small muted">(est.)</span></dd>
    </dl>
    ${patient && (patient.conditions || []).length ? `<div class="note">🩺 <b>Care notes:</b> ${patient.conditions.map(esc).join(", ")}${patient.age ? ` · ${esc(patient.age)} yrs` : ""}</div>` : ""}
    ${actions}
  </div></div>`;
}

/* Re-reads the booking and confirms it's still ours before changing it (admin may have reassigned). */
function myMutate(id, fn, logText, logType, doneMsg) {
  const B = DB.bookings(), b = B.find(x => x.id === id);
  if (!b || b.employeeId !== meId()) { toast("This job is no longer assigned to you", true); closeJob(); render(); return; }
  if (fn(b, B) === false) return;
  b.status = statusForStage(b.stage);
  DB.saveBookings(B);
  DB.log(logText, logType);
  toast(doneMsg);
  render(); openJob(id);
}

function acceptJob(id) {
  myMutate(id, b => { b.ackAt = new Date().toISOString(); }, `${id} accepted by ${me().name}`, "ok", "Job accepted");
}
function declineJob(id) {
  if (!confirm("Release this job? It goes back to admin to reassign.")) return;
  myMutate(id, b => {
    if (b.stage !== "assigned") { toast("Can't release a job that has started", true); return false; }
    b.stage = "requested"; b.employeeId = null; b.caregiver = null; b.ackAt = null;
  }, `${id} released by ${me().name} — needs reassignment`, "bad", "Job released");
  closeJob(); render();
}
function startJob(id) {
  myMutate(id, (b, B) => {
    const other = B.find(j => j.employeeId === meId() && j.stage === "in_progress" && j.id !== id);
    if (other) { toast(`Finish ${other.id} first`, true); return false; }
    b.stage = "in_progress"; b.ackAt = b.ackAt || new Date().toISOString(); b.startedAt = new Date().toISOString();
  }, `${id} started by ${me().name}`, "info", "Job started");
}
function completeJob(id) {
  myMutate(id, b => { b.stage = "completed"; b.completedAt = new Date().toISOString(); },
    `${id} completed by ${me().name}`, "ok", "Job completed 🎉");
}
