/* CareConnect — localStorage helpers (fake persistence layer) */

const STORAGE_KEYS = {
  AUTH: "cc_auth",
  USER: "cc_user",
  PATIENTS: "cc_patients",
  BOOKINGS: "cc_bookings",
  PLAN: "cc_plan",
  NOTIFICATIONS: "cc_notifications",
  DARK_MODE: "cc_dark_mode",
  DRAFT_BOOKING: "cc_draft_booking",
  ONBOARDED: "cc_onboarded"
};

const Store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },

  init() {
    if (!this.get(STORAGE_KEYS.PATIENTS)) this.set(STORAGE_KEYS.PATIENTS, MOCK.patients);
    if (!this.get(STORAGE_KEYS.BOOKINGS)) this.set(STORAGE_KEYS.BOOKINGS, MOCK.bookings);
    if (!this.get(STORAGE_KEYS.NOTIFICATIONS)) this.set(STORAGE_KEYS.NOTIFICATIONS, MOCK.notifications);
    if (!this.get(STORAGE_KEYS.USER)) this.set(STORAGE_KEYS.USER, MOCK.user);
    if (!this.get(STORAGE_KEYS.PLAN)) this.set(STORAGE_KEYS.PLAN, "plan-premium");
    if (this.get(STORAGE_KEYS.DARK_MODE) === null) this.set(STORAGE_KEYS.DARK_MODE, false);
  },

  isAuthed() {
    return this.get(STORAGE_KEYS.AUTH) === true;
  },
  setAuthed(val) {
    this.set(STORAGE_KEYS.AUTH, val);
  },

  getUser() { return this.get(STORAGE_KEYS.USER, MOCK.user); },
  setUser(u) { this.set(STORAGE_KEYS.USER, u); },

  getPatients() { return this.get(STORAGE_KEYS.PATIENTS, MOCK.patients); },
  setPatients(p) { this.set(STORAGE_KEYS.PATIENTS, p); },

  getBookings() { return this.get(STORAGE_KEYS.BOOKINGS, MOCK.bookings); },
  setBookings(b) { this.set(STORAGE_KEYS.BOOKINGS, b); },

  getPlan() { return this.get(STORAGE_KEYS.PLAN, "plan-premium"); },
  setPlan(p) { this.set(STORAGE_KEYS.PLAN, p); },

  getNotifications() { return this.get(STORAGE_KEYS.NOTIFICATIONS, MOCK.notifications); },
  setNotifications(n) { this.set(STORAGE_KEYS.NOTIFICATIONS, n); },

  getDarkMode() { return this.get(STORAGE_KEYS.DARK_MODE, false); },
  setDarkMode(v) { this.set(STORAGE_KEYS.DARK_MODE, v); },

  getDraftBooking() { return this.get(STORAGE_KEYS.DRAFT_BOOKING, {}); },
  setDraftBooking(b) { this.set(STORAGE_KEYS.DRAFT_BOOKING, b); },
  clearDraftBooking() { this.remove(STORAGE_KEYS.DRAFT_BOOKING); }
};

window.Store = Store;
window.STORAGE_KEYS = STORAGE_KEYS;
