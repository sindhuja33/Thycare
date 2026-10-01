/* Home page */
mountPage("home", () => {
  const e = me(), jobs = myJobs();
  const current = jobs.find(b => b.stage === "in_progress");
  const fresh = jobs.filter(isNew);
  const upcoming = jobs.filter(b => b.stage === "assigned" && !isNew(b)).sort((a, b) => startOf(a) - startOf(b));
  const done = jobs.filter(b => b.stage === "completed");
  const month = ymd(new Date()).slice(0, 7);
  const earned = done.filter(b => b.date.startsWith(month)).reduce((s, b) => s + b.amount * PAYOUT_RATE, 0);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const onLeave = e.status !== "active";

  return `
  <div class="header">
    <div class="row"><div><h1>${greet}, ${esc(e.name.split(" ")[0])}</h1><p>${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p></div><div class="avatar">${initials(e.name)}</div></div>
    <span class="pill ${onLeave ? "leave" : ""}"><i></i>${onLeave ? (e.status === "on_leave" ? "On leave" : "Inactive") : current ? "On duty" : "Available"}</span>
  </div>
  <div class="content">
    <div class="stats">
      <div class="stat"><b>${done.length}</b><span>Jobs done</span></div>
      <div class="stat"><b>⭐ ${e.rating}</b><span>Rating</span></div>
      <div class="stat"><b>${inr(earned)}</b><span>This month</span></div>
    </div>
    ${onLeave ? `<div class="note">You're marked <b>${e.status === "on_leave" ? "on leave" : "inactive"}</b> — you won't receive new jobs. Change this in Profile.</div>` : ""}

    ${current ? `<div class="section-title">Current job</div>${jobCard(current)}` : ""}
    ${fresh.length ? `<div class="section-title">New assignments (${fresh.length})</div>${fresh.map(jobCard).join("")}` : ""}
    <div class="section-title">Up next</div>
    ${upcoming.length ? upcoming.slice(0, 3).map(jobCard).join("") :
      (!current && !fresh.length ? `<div class="card empty"><div class="ic">☕</div>No jobs assigned right now.<br>Admin will assign you when a request comes in.</div>` : `<div class="muted small" style="margin:0 4px">Nothing else scheduled.</div>`)}
  </div>`;
});
