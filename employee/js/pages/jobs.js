/* My Jobs page — everything currently assigned to me */
let jobsTab = "active";
function setJobsTab(t) { jobsTab = t; render(); }

mountPage("jobs", () => {
  const jobs = myJobs();
  const active = jobs.filter(b => ["assigned", "in_progress"].includes(b.stage)).sort((a, b) => startOf(a) - startOf(b));
  const today = ymd(new Date());
  const list = jobsTab === "today" ? active.filter(b => b.date === today) : active;

  // group by date
  const groups = {};
  list.forEach(b => (groups[b.date] = groups[b.date] || []).push(b));

  return `
  <div class="plain-head"><h1>My Jobs</h1><div class="muted small">${active.length} active · only jobs assigned to you appear here</div></div>
  <div class="content" style="margin-top:0">
    <div class="tabs">
      <button class="tab ${jobsTab === "active" ? "on" : ""}" onclick="setJobsTab('active')">All active (${active.length})</button>
      <button class="tab ${jobsTab === "today" ? "on" : ""}" onclick="setJobsTab('today')">Today (${active.filter(b => b.date === today).length})</button>
    </div>
    ${Object.keys(groups).length ? Object.keys(groups).sort().map(d =>
      `<div class="section-title">${d === today ? "Today" : fmtDate(d)}</div>${groups[d].map(jobCard).join("")}`).join("")
      : `<div class="card empty"><div class="ic">📭</div>No jobs here.</div>`}
  </div>`;
});
