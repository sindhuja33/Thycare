/* Schedule page — employees × 24h timeline */
function shiftDay(n) { const d = new Date(ui.scheduleDate + "T00:00:00"); d.setDate(d.getDate() + n); ui.scheduleDate = ymd(d); render(); }

mountPage("schedule", () => {
  const B = DB.bookings(), E = DB.employees();
  const dayStart = new Date(ui.scheduleDate + "T00:00:00").getTime(), dayMs = 86400000;
  const pos = t => Math.max(0, Math.min(100, ((t - dayStart) / dayMs) * 100));
  const nowPct = pos(Date.now()), isToday = ui.scheduleDate === ymd(new Date());
  const hours = [0, 3, 6, 9, 12, 15, 18, 21].map(h => `<span style="left:${(h / 24) * 100}%">${pad(h)}:00</span>`).join("");

  return `
  <div class="toolbar">
    <button class="btn" onclick="shiftDay(-1)">‹</button>
    <input type="date" value="${ui.scheduleDate}" style="max-width:170px" onchange="ui.scheduleDate=this.value;render()">
    <button class="btn" onclick="shiftDay(1)">›</button>
    <button class="btn" onclick="ui.scheduleDate=ymd(new Date());render()">Today</button>
    <span class="muted small">Click a bar for details · one job per employee at a time</span>
  </div>
  <div class="card table-wrap" style="padding:0 14px">
    <div class="tl">
      <div class="tl-row tl-head"><div class="tl-name"></div><div class="tl-track">${hours}</div></div>
      ${E.map(e => {
        const jobs = B.filter(b => b.employeeId === e.id && ["assigned", "in_progress", "completed"].includes(b.stage) &&
          startOf(b).getTime() < dayStart + dayMs && endOf(b).getTime() > dayStart);
        return `<div class="tl-row"><div class="tl-name">${esc(e.name)}<div class="small muted">${esc(e.area)}</div></div>
          <div class="tl-track">
            ${e.status !== "active" ? `<div class="tl-leave">${EMP_LABEL[e.status]}</div>` : ""}
            ${jobs.map(b => { const l = pos(startOf(b).getTime()), r = pos(endOf(b).getTime());
              return `<div class="tl-bar ${b.stage}" style="left:${l}%;width:${r - l}%" title="${esc(b.id)}" onclick="openRequest('${b.id}')"><b>${esc(b.service)}</b><br>${esc(b.patient)}</div>`; }).join("")}
            ${isToday ? `<div class="now-line" style="left:${nowPct}%"></div>` : ""}
          </div></div>`;
      }).join("")}
    </div>
  </div>`;
});
