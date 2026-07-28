/* CareConnect — shared UI helpers used across all pages */

const UI = {
  toast(message, type = "info", duration = 2600) {
    let el = document.getElementById("cc-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cc-toast";
      document.body.appendChild(el);
    }
    const icon = type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info";
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i><span>${message}</span>`;
    requestAnimationFrame(() => {
      if (window.lucide) lucide.createIcons();
      el.classList.add("show");
    });
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), duration);
  },

  formatCurrency(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  },

  statusBadge(status) {
    const map = {
      upcoming: { cls: "badge-blue", label: "Upcoming", icon: "clock" },
      pending: { cls: "badge-amber", label: "Pending", icon: "loader" },
      completed: { cls: "badge-green", label: "Completed", icon: "check" },
      cancelled: { cls: "badge-slate", label: "Cancelled", icon: "x" },
      rejected: { cls: "badge-red", label: "Rejected", icon: "alert-triangle" }
    };
    const s = map[status] || map.pending;
    return `<span class="badge ${s.cls}"><i data-lucide="${s.icon}" class="w-3 h-3"></i>${s.label}</span>`;
  },

  requireAuth() {
    if (!Store.isAuthed()) {
      window.location.href = "login.html";
    }
  },

  redirectIfAuthed() {
    if (Store.isAuthed()) {
      window.location.href = "home.html";
    }
  },

  applyDarkMode() {
    const on = Store.getDarkMode();
    document.body.classList.toggle("dark", on);
  },

  toggleDarkMode() {
    const next = !Store.getDarkMode();
    Store.setDarkMode(next);
    document.body.classList.toggle("dark", next);
    return next;
  },

  logout() {
    Store.setAuthed(false);
    UI.toast("Logged out successfully", "success");
    setTimeout(() => (window.location.href = "login.html"), 700);
  },

  icons() {
    if (window.lucide) lucide.createIcons();
  },

  simulateApi({ success = true, delay = 1200, data = null } = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) resolve(data);
        else reject(data);
      }, delay);
    });
  },

  navItems: [
    { key: "home", label: "Home", href: "home.html", icon: "home" },
    { key: "subscriptions", label: "Subscription", href: "subscriptions.html", icon: "gem" },
    { key: "patients", label: "Patients", href: "patients.html", icon: "users-round" },
    { key: "bookings", label: "Bookings", href: "bookings.html", icon: "calendar-check" }
  ],

  sidebarItems: [
    { key: "home", label: "Dashboard", href: "home.html", icon: "layout-dashboard" },
    { key: "subscriptions", label: "Subscription", href: "subscriptions.html", icon: "gem" },
    { key: "patients", label: "Patients", href: "patients.html", icon: "users-round" },
    { key: "bookings", label: "Bookings", href: "bookings.html", icon: "calendar-check" },
    { key: "notifications", label: "Notifications", href: "notifications.html", icon: "bell" },
    { key: "profile", label: "Profile", href: "profile.html", icon: "user-round" },
    { key: "support", label: "Support", href: "support.html", icon: "life-buoy" },
    { key: "settings", label: "Settings", href: "settings.html", icon: "settings" }
  ],

  renderBottomNav(active) {
    const wrap = document.getElementById("bottom-nav");
    if (!wrap) return;
    wrap.className = "bottom-nav mobile-only";
    wrap.innerHTML = UI.navItems.map(item => `
      <a href="${item.href}" class="bottom-nav-item ${active === item.key ? "active" : ""}">
        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
        <span>${item.label}</span>
      </a>
    `).join("");
    UI.icons();
  },

  renderSidebar(active) {
    const wrap = document.getElementById("sidebar");
    if (!wrap) return;
    const user = Store.getUser();
    wrap.className = "desktop-sidebar glass border-r border-slate-100 flex-col justify-between py-6 px-4 hidden lg:flex";
    wrap.innerHTML = `
      <div>
        <div class="flex items-center gap-2.5 px-2 mb-8">
          <div class="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center">
            <i data-lucide="heart-pulse" class="w-5 h-5 text-white"></i>
          </div>
          <span class="font-extrabold text-lg text-slate-900">CareConnect</span>
        </div>
        <nav class="space-y-1">
          ${UI.sidebarItems.map(item => `
            <a href="${item.href}" class="sidebar-link ${active === item.key ? "active" : ""}">
              <i data-lucide="${item.icon}" class="w-[18px] h-[18px]"></i>
              ${item.label}
            </a>
          `).join("")}
        </nav>
      </div>
      <div>
        <div class="divider mb-3"></div>
        <button onclick="UI.logout()" class="sidebar-link w-full text-red-500 hover:bg-red-50">
          <i data-lucide="log-out" class="w-[18px] h-[18px]"></i>
          Logout
        </button>
        <a href="profile.html" class="flex items-center gap-2.5 mt-4 px-2 py-2 rounded-xl hover:bg-slate-50">
          <img src="${user.avatar}" class="w-9 h-9 rounded-full object-cover" />
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">${user.name}</p>
            <p class="text-xs text-slate-500">${user.membership} Member</p>
          </div>
        </a>
      </div>
    `;
    UI.icons();
  },

  initShell(active) {
    UI.applyDarkMode();
    UI.renderBottomNav(active);
    UI.renderSidebar(active);
    UI.icons();
  }
};

window.UI = UI;
