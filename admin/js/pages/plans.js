/* Plans & Payments page */
mountPage("plans", () => {
  const B = DB.bookings();
  const mrr = PLANS.reduce((s, p) => s + p.price * p.subscribers, 0);
  const recent = B.filter(b => b.stage !== "cancelled").sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)).slice(0, 8);
  return `
  <div class="grid kpis"><div class="card kpi"><div class="label">Monthly recurring</div><div class="value">${inr(mrr)}</div></div>
    <div class="card kpi"><div class="label">Subscribers</div><div class="value">${PLANS.reduce((s, p) => s + p.subscribers, 0)}</div></div></div>
  <div class="grid kpis" style="margin-bottom:16px">${PLANS.map(p => `<div class="card"><h3>${p.name}</h3><div class="kpi"><div class="value">${p.subscribers}</div></div><div class="small muted">${p.price ? inr(p.price) + "/month" : "Free"} · ${esc(p.perks)}</div></div>`).join("")}</div>
  <div class="card table-wrap"><h3>Recent payments</h3>
    <table><thead><tr><th>Booking</th><th>Customer</th><th>Service</th><th>Amount</th><th>Payment</th></tr></thead>
    <tbody>${recent.map(b => `<tr><td><b>${esc(b.id)}</b></td><td>${esc(b.customer)}</td><td>${esc(b.service)}</td><td>${inr(b.amount)}</td><td>${badge("completed", "Paid")}</td></tr>`).join("")}</tbody></table></div>`;
});
