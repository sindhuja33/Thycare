/* History page — completed jobs + estimated earnings */
mountPage("history", () => {
  const done = myJobs().filter(b => b.stage === "completed").sort((a, b) => startOf(b) - startOf(a));
  const total = done.reduce((s, b) => s + b.amount * PAYOUT_RATE, 0);
  return `
  <div class="plain-head"><h1>History</h1></div>
  <div class="content" style="margin-top:12px">
    <div class="stats" style="grid-template-columns:1fr 1fr">
      <div class="stat"><b>${done.length}</b><span>Completed jobs</span></div>
      <div class="stat"><b>${inr(total)}</b><span>Est. earnings</span></div>
    </div>
    ${done.length ? done.map(jobCard).join("") : `<div class="card empty"><div class="ic">🗂️</div>No completed jobs yet.</div>`}
  </div>`;
});
