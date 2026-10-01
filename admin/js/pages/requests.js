/* Requests page */
mountPage("requests", () => {
  const B = DB.bookings();
  const stages = ["all", "requested", "assigned", "in_progress", "completed", "cancelled"];
  const q = ui.q.trim().toLowerCase();
  const rows = B.filter(b =>
    (ui.stage === "all" || b.stage === ui.stage) &&
    (!ui.service || b.serviceId === ui.service) &&
    (!q || [b.id, b.patient, b.customer, b.service, b.caregiver || ""].join(" ").toLowerCase().includes(q))
  ).sort((a, b) => (a.stage === "requested" ? 0 : 1) - (b.stage === "requested" ? 0 : 1) || startOf(a) - startOf(b));

  return `
  <div class="toolbar">
    <div class="chips">${stages.map(s => `<button class="chip ${ui.stage === s ? "on" : ""}" onclick="setFilter('stage','${s}')">${s === "all" ? "All" : STAGE_LABEL[s]} (${s === "all" ? B.length : B.filter(b => b.stage === s).length})</button>`).join("")}</div>
    <select onchange="setFilter('service',this.value)"><option value="">All services</option>${SERVICES.map(s => `<option value="${s.id}" ${ui.service === s.id ? "selected" : ""}>${s.name}</option>`).join("")}</select>
    <input id="search" placeholder="Search ID, patient, employee…" value="${esc(ui.q)}" oninput="setSearch(this.value)">
  </div>
  <div class="card table-wrap" style="padding:6px">
    <table><thead><tr><th>Request</th><th>Patient</th><th>Service</th><th>Schedule</th><th>Amount</th><th>Status</th><th>Employee</th></tr></thead>
    <tbody>${rows.length ? rows.map(b => `
      <tr class="click" onclick="openRequest('${b.id}')">
        <td><b>${esc(b.id)}</b></td>
        <td>${esc(b.patient)}<div class="small muted">by ${esc(b.customer)}</div></td>
        <td>${esc(b.service)}</td>
        <td>${rangeLabel(b)}<div class="small muted">${esc(b.area)}</div></td>
        <td>${inr(b.amount)}</td>
        <td>${stageBadge(b.stage)}</td>
        <td>${b.caregiver ? esc(b.caregiver) : `<span class="muted">—</span>`}</td>
      </tr>`).join("") : `<tr><td colspan="7" class="empty">No requests match.</td></tr>`}</tbody></table>
  </div>`;
});
