/* Employees page */
mountPage("employees", () => {
  const B = DB.bookings(), E = DB.employees();
  return `
  <div class="toolbar"><span class="muted">${E.length} employees</span><span style="flex:1"></span><button class="btn primary" onclick="employeeForm()">+ Add employee</button></div>
  <div class="grid emp-grid">${E.map(e => { const st = empState(e, B), job = currentJob(e.id, B);
    return `<div class="card emp-card" onclick="openEmployee('${e.id}')">
      <div class="top"><div class="pic">${initials(e.name)}</div><div style="flex:1"><b>${esc(e.name)}</b><div class="small muted">${esc(e.id)} · ⭐ ${e.rating}</div></div>${badge(st, EMP_LABEL[st])}</div>
      <div>${e.skills.map(s => `<span class="tag">${esc(svcName(s))}</span>`).join("")}</div>
      <div class="meta">📍 ${esc(e.area)} · ${job ? "On: " + esc(job.id) : "No active job"}</div>
    </div>`; }).join("")}</div>`;
});
