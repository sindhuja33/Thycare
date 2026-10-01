/* Patients page */
mountPage("patients", () => {
  const P = DB.patients(), B = DB.bookings();
  return `
  <div class="card table-wrap" style="padding:6px">
    <table><thead><tr><th>Patient</th><th>Relation</th><th>Age / Gender</th><th>Conditions</th><th>Bookings</th></tr></thead>
    <tbody>${P.length ? P.map(p => `<tr>
      <td><b>${esc(p.name)}</b></td><td>${esc(p.relationship)}</td><td>${esc(p.age)} · ${esc(p.gender)}</td>
      <td>${(p.conditions || []).map(c => `<span class="tag">${esc(c)}</span>`).join("") || "—"}</td>
      <td>${B.filter(b => b.patient === p.name).length}</td></tr>`).join("") : `<tr><td colspan="5" class="empty">No patient profiles yet. Open the patient app once on this origin to load them.</td></tr>`}</tbody></table>
  </div>`;
});
