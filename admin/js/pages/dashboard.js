/* Dashboard page */
mountPage("dashboard", () => {
  const B = DB.bookings(), E = DB.employees();
  const todayStr = ymd(new Date());
  const requested = B.filter(b => b.stage === "requested");
  const inProg = B.filter(b => b.stage === "in_progress");
  const doneToday = B.filter(b => b.stage === "completed" && b.date === todayStr);
  const revenue = B.filter(b => b.stage === "completed").reduce((s, b) => s + b.amount, 0);
  const activeEmps = E.filter(e => e.status === "active");
  const freeNow = activeEmps.filter(e => !currentJob(e.id, B)).length;

  // last 7 days bookings by service date
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d; });
  const counts = days.map(d => B.filter(b => b.date === ymd(d) && b.stage !== "cancelled").length);
  const max = Math.max(...counts, 1);

  const bySvc = SERVICES.map(s => ({ name: s.name, n: B.filter(b => b.serviceId === s.id && b.stage !== "cancelled").length }));
  const smax = Math.max(...bySvc.map(s => s.n), 1);

  const needs = requested.sort((a, b) => startOf(a) - startOf(b)).slice(0, 5);

  return `
  <div class="grid kpis">
    <div class="card kpi ${requested.length ? "alert" : ""}"><div class="label">Needs assignment</div><div class="value">${requested.length}</div><div class="sub">New requests waiting</div></div>
    <div class="card kpi"><div class="label">In progress</div><div class="value">${inProg.length}</div><div class="sub">Caregivers on duty</div></div>
    <div class="card kpi"><div class="label">Completed today</div><div class="value">${doneToday.length}</div><div class="sub">${B.filter(b => b.stage === "completed").length} all-time</div></div>
    <div class="card kpi"><div class="label">Revenue</div><div class="value">${inr(revenue)}</div><div class="sub">From completed jobs</div></div>
    <div class="card kpi"><div class="label">Employees free now</div><div class="value">${freeNow}<span class="muted" style="font-size:16px"> / ${activeEmps.length}</span></div><div class="sub">${E.filter(e => e.status === "on_leave").length} on leave</div></div>
  </div>

  <div class="grid two">
    <div class="card"><h3>Bookings · last 7 days</h3>
      <div class="bars">${counts.map((n, i) => `<div class="bar-col"><span class="n">${n}</span><div class="bar" style="height:${(n / max) * 100}%"></div><span class="l">${days[i].toLocaleDateString("en-IN", { weekday: "short" })}</span></div>`).join("")}</div>
    </div>
    <div class="card"><h3>By service</h3>
      ${bySvc.map(s => `<div class="hbar"><div class="row"><span>${esc(s.name)}</span><b>${s.n}</b></div><div class="track"><div class="fill" style="width:${(s.n / smax) * 100}%"></div></div></div>`).join("")}
    </div>
  </div>

  <div class="grid two-eq">
    <div class="card">
      <div class="card-head"><h3>Needs assignment</h3><a href="requests.html?stage=requested" class="small">View all →</a></div>
      ${needs.length ? needs.map(b => `
        <div class="list-row">
          <div class="pic">${initials(b.patient)}</div>
          <div class="grow"><div class="t">${esc(b.patient)} · ${esc(b.service)}</div><div class="small muted">${rangeLabel(b)} · ${esc(b.area)}</div></div>
          <button class="btn primary sm" onclick="openRequest('${b.id}')">Assign</button>
        </div>`).join("") : `<div class="empty">All caught up 🎉</div>`}
    </div>
    <div class="card">
      <div class="card-head"><h3>Team right now</h3><a href="employees.html" class="small">Manage →</a></div>
      ${E.slice(0, 6).map(e => { const st = empState(e, B); const job = currentJob(e.id, B); return `
        <div class="list-row" style="cursor:pointer" onclick="openEmployee('${e.id}')">
          <div class="pic">${initials(e.name)}</div>
          <div class="grow"><div class="t">${esc(e.name)}</div><div class="small muted">${job ? esc(job.service) + " · until " + fmtTime(endOf(job)) : esc(e.area)}</div></div>
          ${badge(st, EMP_LABEL[st])}
        </div>`; }).join("")}
    </div>
  </div>`;
});
