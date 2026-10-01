/* Activity page */
mountPage("activity", () => {
  const A = DB.activity();
  return `<div class="card" style="max-width:640px"><h3>Activity log</h3>
    ${A.length ? `<div class="timeline">${A.map(a => `<div class="ev ${a.type}"><div>${esc(a.text)}</div><div class="small muted">${new Date(a.at).toLocaleString("en-IN")}</div></div>`).join("")}</div>` : `<div class="empty">No activity yet.</div>`}</div>`;
});
