/* Profile page — details, availability toggle, sign out */
function toggleLeave() {
  const E = DB.employees(), e = E.find(x => x.id === meId());
  const goingOff = e.status === "active";
  if (goingOff && myJobs().some(b => ACTIVE_STAGES.includes(b.stage))) {
    toast("Release or finish your active jobs first", true); return;
  }
  e.status = goingOff ? "on_leave" : "active";
  DB.saveEmployees(E);
  DB.log(`${e.name} set themselves ${goingOff ? "on leave" : "available"}`, "info");
  toast(goingOff ? "You're on leave" : "You're available for jobs");
  render();
}
function signOut() { localStorage.removeItem(EMP_AUTH); location.href = "index.html"; }

mountPage("profile", () => {
  const e = me();
  const available = e.status === "active";
  return `
  <div class="header" style="padding-bottom:50px">
    <div class="row"><div><h1>${esc(e.name)}</h1><p>${esc(e.id)} · ⭐ ${e.rating}</p></div><div class="avatar">${initials(e.name)}</div></div>
  </div>
  <div class="content">
    <div class="card">
      <div class="toggle"><div><b>Available for new jobs</b><div class="small muted">${e.status === "inactive" ? "Your account is inactive — contact admin" : available ? "Admin can assign you work" : "You're on leave"}</div></div>
        <button class="switch ${available ? "on" : ""}" ${e.status === "inactive" ? "disabled" : ""} onclick="toggleLeave()" aria-label="Toggle availability"></button></div>
    </div>
    <div class="card"><h3>Details</h3>
      <dl class="kv"><dt>Phone</dt><dd>${esc(e.phone)}</dd><dt>Area</dt><dd>${esc(e.area)}</dd><dt>Joined</dt><dd>${fmtDate(e.joined)}</dd></dl>
      <h3 style="margin-top:14px">Skills</h3>${e.skills.map(s => `<span class="tag">${esc(svcName(s))}</span>`).join("")}
    </div>
    <button class="btn danger block" onclick="signOut()">Sign out</button>
  </div>`;
});
