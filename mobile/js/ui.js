/* CareConnect Mobile — shared native-app UI helpers */

const UI = {
  toast(message, type = "info", duration = 2400) {
    let el = document.getElementById("cc-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cc-toast";
      document.body.appendChild(el);
    }
    const icon = type === "success" ? "check-circle-2" : type === "error" ? "x-circle" : "info";
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i><span>${message}</span>`;
    requestAnimationFrame(() => {
      if (window.lucide) lucide.createIcons();
      el.classList.add("show");
    });
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), duration);
  },

  formatCurrency(n) { return "₹" + Number(n).toLocaleString("en-IN"); },
  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  },
  formatDateShort(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  },

  statusBadge(status) {
    const map = {
      upcoming: { cls: "badge-blue", label: "Upcoming", icon: "clock-4" },
      pending: { cls: "badge-amber", label: "Pending", icon: "loader" },
      completed: { cls: "badge-green", label: "Completed", icon: "check" },
      cancelled: { cls: "badge-ink", label: "Cancelled", icon: "x" },
      rejected: { cls: "badge-red", label: "Rejected", icon: "alert-triangle" }
    };
    const s = map[status] || map.pending;
    return `<span class="badge ${s.cls}"><i data-lucide="${s.icon}" class="w-3 h-3"></i>${s.label}</span>`;
  },

  requireAuth() { if (!Store.isAuthed()) window.location.href = "login.html"; },
  redirectIfAuthed() { if (Store.isAuthed()) window.location.href = "home.html"; },

  applyDarkMode() { document.body.classList.toggle("dark", Store.getDarkMode()); },
  toggleDarkMode() {
    const next = !Store.getDarkMode();
    Store.setDarkMode(next);
    document.body.classList.toggle("dark", next);
    return next;
  },

  logout() {
    Store.setAuthed(false);
    UI.toast("Logged out successfully", "success");
    setTimeout(() => (window.location.href = "login.html"), 650);
  },

  icons() { if (window.lucide) lucide.createIcons(); },

  simulateApi({ success = true, delay = 1100, data = null } = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => (success ? resolve(data) : reject(data)), delay);
    });
  },

  navItems: [
    { key: "home", label: "Home", href: "home.html", icon: "house" },
    { key: "subscriptions", label: "Plans", href: "subscriptions.html", icon: "gem" },
    { key: "patients", label: "Patients", href: "patients.html", icon: "users-round" },
    { key: "bookings", label: "Bookings", href: "bookings.html", icon: "calendar-check" }
  ],

  renderFloatingNav(active) {
    const wrap = document.getElementById("floating-nav");
    if (!wrap) return;
    wrap.className = "floating-nav";
    wrap.innerHTML = UI.navItems.map(item => `
      <a href="${item.href}" class="floating-nav-item ${active === item.key ? "active" : ""}">
        <i data-lucide="${item.icon}" class="w-[21px] h-[21px]" stroke-width="${active === item.key ? 2.3 : 1.9}"></i>
        <span class="fn-label">${item.label}</span>
      </a>
    `).join("");
    UI.icons();
  },

  initShell(active) {
    UI.applyDarkMode();
    UI.renderFloatingNav(active);
    UI.icons();
  },

  openSheet(id) {
    const backdrop = document.getElementById(id + "-backdrop");
    const sheet = document.getElementById(id);
    if (!backdrop || !sheet) return;
    backdrop.classList.add("show");
    sheet.classList.add("show");
    document.body.style.overflow = "hidden";
    UI.icons();
  },
  closeSheet(id) {
    const backdrop = document.getElementById(id + "-backdrop");
    const sheet = document.getElementById(id);
    if (!backdrop || !sheet) return;
    backdrop.classList.remove("show");
    sheet.classList.remove("show");
    document.body.style.overflow = "";
  },

  skeletonCard(h = 88) {
    return `<div class="card p-3.5 flex items-center gap-3">
      <div class="skel w-14 h-14 rounded-2xl shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="skel h-3.5 w-2/3 rounded-full"></div>
        <div class="skel h-3 w-1/2 rounded-full"></div>
      </div>
    </div>`;
  }
};

window.UI = UI;
