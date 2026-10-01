/* CareConnect Admin — shared data layer.
   Uses the SAME localStorage keys as the patient app (cc_bookings, cc_patients),
   so requests raised in the patient app show up here when served from the same origin. */

const AK = {
  BOOKINGS: "cc_bookings",
  PATIENTS: "cc_patients",
  EMPLOYEES: "cc_employees",
  ACTIVITY: "cc_admin_activity",
  AUTH: "cc_admin_auth",
  SEEDED: "cc_admin_seeded"
};

const SERVICES = [
  { id: "srv-attender", name: "Patient Attender", price: 899 },
  { id: "srv-babysitter", name: "Baby Sitter", price: 699 },
  { id: "srv-eldercare", name: "Elder Care", price: 999 },
  { id: "srv-mothercare", name: "Mother Care", price: 1099 },
  { id: "srv-postsurgery", name: "Post Surgery Care", price: 1299 },
  { id: "srv-nursing", name: "Nursing Assistant", price: 1199 }
];

const AREAS = ["Anna Nagar", "T Nagar", "Adyar", "Velachery", "Mylapore", "OMR", "Tambaram"];

const PLANS = [
  { id: "plan-basic", name: "Basic", price: 0, subscribers: 412, perks: "Pay per booking" },
  { id: "plan-premium", name: "Premium", price: 499, subscribers: 236, perks: "10% off · priority matching" },
  { id: "plan-premium-plus", name: "Premium+", price: 999, subscribers: 74, perks: "20% off · emergency support" }
];

const SEED_EMPLOYEES = [
  { id: "EMP-101", name: "Priya Raman", phone: "+91 98400 11101", skills: ["srv-eldercare", "srv-attender"], area: "Anna Nagar", rating: 4.9, status: "active", joined: "2024-02-10" },
  { id: "EMP-102", name: "Muthu Kumar", phone: "+91 98400 11102", skills: ["srv-postsurgery", "srv-nursing", "srv-attender"], area: "T Nagar", rating: 4.8, status: "active", joined: "2023-09-01" },
  { id: "EMP-103", name: "Fathima Begum", phone: "+91 98400 11103", skills: ["srv-babysitter", "srv-mothercare"], area: "Adyar", rating: 4.9, status: "active", joined: "2024-05-21" },
  { id: "EMP-104", name: "Anitha Selvam", phone: "+91 98400 11104", skills: ["srv-nursing", "srv-postsurgery"], area: "Velachery", rating: 4.7, status: "active", joined: "2023-12-14" },
  { id: "EMP-105", name: "Rajesh Babu", phone: "+91 98400 11105", skills: ["srv-attender", "srv-eldercare"], area: "Mylapore", rating: 4.6, status: "active", joined: "2025-01-08" },
  { id: "EMP-106", name: "Kavitha Devi", phone: "+91 98400 11106", skills: ["srv-mothercare", "srv-babysitter", "srv-nursing"], area: "OMR", rating: 4.8, status: "active", joined: "2024-07-30" },
  { id: "EMP-107", name: "Suresh Kannan", phone: "+91 98400 11107", skills: ["srv-attender", "srv-postsurgery"], area: "Tambaram", rating: 4.5, status: "on_leave", joined: "2025-03-17" },
  { id: "EMP-108", name: "Meena Lakshmi", phone: "+91 98400 11108", skills: ["srv-eldercare", "srv-nursing"], area: "Anna Nagar", rating: 4.9, status: "active", joined: "2023-06-05" },
  { id: "EMP-109", name: "Dinesh Pandian", phone: "+91 98400 11109", skills: ["srv-attender", "srv-eldercare"], area: "Velachery", rating: 4.4, status: "active", joined: "2025-06-02" },
  { id: "EMP-110", name: "Revathi Subbu", phone: "+91 98400 11110", skills: ["srv-babysitter", "srv-eldercare"], area: "T Nagar", rating: 4.7, status: "inactive", joined: "2024-10-11" }
];

const DB = {
  get(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  employees() { return this.get(AK.EMPLOYEES, []); },
  bookings() { return this.get(AK.BOOKINGS, []); },
  patients() { return this.get(AK.PATIENTS, []); },
  activity() { return this.get(AK.ACTIVITY, []); },
  saveEmployees(v) { this.set(AK.EMPLOYEES, v); },
  saveBookings(v) { this.set(AK.BOOKINGS, v); },
  log(text, type = "info") {
    const a = this.activity();
    a.unshift({ at: new Date().toISOString(), text, type });
    this.set(AK.ACTIVITY, a.slice(0, 100));
  }
};

/* ---------- time helpers ---------- */
function pad(n) { return String(n).padStart(2, "0"); }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseDur(s) { const m = /(\d+)/.exec(s || ""); return m ? parseInt(m[1], 10) : 8; }
function startOf(b) {
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(b.time || "09:00 AM");
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  const [y, mo, d] = b.date.split("-").map(Number);
  return new Date(y, mo - 1, d, h, parseInt(m[2], 10));
}
function endOf(b) { return new Date(startOf(b).getTime() + parseDur(b.duration) * 3600000); }
function fmtTime(d) {
  let h = d.getHours(); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return `${pad(h)}:${pad(d.getMinutes())} ${ap}`;
}
function fmtDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function rangeLabel(b) { return `${fmtDate(b.date)}, ${fmtTime(startOf(b))} – ${fmtTime(endOf(b))}`; }

/* ---------- booking normalisation ----------
   Patient app uses status: upcoming | completed | cancelled.
   Admin adds `stage`: requested | assigned | in_progress | completed | cancelled
   and keeps `status` patient-compatible so the patient app doesn't break. */
const ACTIVE_STAGES = ["assigned", "in_progress"];
function statusForStage(stage) {
  return stage === "completed" ? "completed" : stage === "cancelled" ? "cancelled" : "upcoming";
}
function normalize(b, employees) {
  if (!b.stage) {
    if (b.status === "completed") b.stage = "completed";
    else if (b.status === "cancelled") b.stage = "cancelled";
    else b.stage = b.caregiver ? "assigned" : "requested";
  }
  if (!b.employeeId && b.caregiver) {
    const e = employees.find(x => x.name === b.caregiver);
    if (e) b.employeeId = e.id;
  }
  if (!b.serviceId) {
    const s = SERVICES.find(x => x.name === b.service);
    if (s) b.serviceId = s.id;
  }
  if (!b.area) b.area = AREAS.find(a => (b.address || "").includes(a)) || "Chennai";
  if (!b.customer) b.customer = "Sindhuja Stephen Raj";
  if (!b.requestedAt) b.requestedAt = startOf(b).toISOString();
  return b;
}

/* ---------- availability rule: one job at a time ---------- */
function conflictFor(empId, booking, bookings) {
  const s = startOf(booking).getTime(), e = endOf(booking).getTime();
  return bookings.find(o =>
    o.id !== booking.id && o.employeeId === empId && ACTIVE_STAGES.includes(o.stage) &&
    startOf(o).getTime() < e && endOf(o).getTime() > s
  ) || null;
}
/* returns { ok, reason } for assigning employee `emp` to `booking` */
function canAssign(emp, booking, bookings) {
  if (emp.status === "on_leave") return { ok: false, reason: "On leave" };
  if (emp.status === "inactive") return { ok: false, reason: "Inactive" };
  if (!emp.skills.includes(booking.serviceId)) return { ok: false, reason: "Not trained for this service" };
  const c = conflictFor(emp.id, booking, bookings);
  if (c) return { ok: false, reason: `Busy ${fmtTime(startOf(c))}–${fmtTime(endOf(c))} (${c.id})` };
  return { ok: true, reason: "" };
}
function currentJob(empId, bookings, at = Date.now()) {
  return bookings.find(b => b.employeeId === empId && ACTIVE_STAGES.includes(b.stage) &&
    startOf(b).getTime() <= at && endOf(b).getTime() > at) || null;
}

/* ---------- first-run seeding ---------- */
function seedDemo() {
  if (!DB.get(AK.EMPLOYEES, null)) DB.saveEmployees(SEED_EMPLOYEES);
  const emps = DB.employees();
  let bookings = DB.bookings();

  if (!DB.get(AK.SEEDED, false)) {
    const today = new Date();
    const day = off => { const d = new Date(today); d.setDate(d.getDate() + off); return ymd(d); };
    const customers = ["Sindhuja Stephen Raj", "Arun Prakash", "Deepa Nair", "Karthik Subramani", "Nisha Thomas", "Vignesh Kumar", "Sangeetha R", "Imran Khan"];
    const addrs = ["12, Lakeview Apts, Anna Nagar", "45, 3rd Main Rd, Adyar", "7, Gandhi St, Velachery", "22, Temple Rd, Mylapore", "88, OMR Tech Park Rd", "5, GST Rd, Tambaram", "19, North Usman Rd, T Nagar"];
    // [service idx, patient, day offset, time, duration, stage, empId, customer idx]
    const rows = [
      [2, "Ramesh Iyer", 1, "08:00 AM", "12 hours", "requested", null, 1],
      [4, "Savitha Rao", 1, "10:00 AM", "24 hours", "requested", null, 2],
      [1, "Baby Aarav", 0, "05:00 PM", "6 hours", "requested", null, 3],
      [0, "Kamala Devi", 2, "09:00 AM", "12 hours", "requested", null, 4],
      [5, "Joseph Mathew", 0, "11:00 AM", "8 hours", "requested", null, 5],
      [3, "Sneha Arun", 3, "07:00 AM", "10 hours", "requested", null, 6],
      [2, "Parvathi Ammal", 0, "06:00 AM", "12 hours", "in_progress", "EMP-108", 7],
      [5, "Vijay Anand", 0, "08:00 AM", "10 hours", "in_progress", "EMP-104", 0],
      [0, "Mohan Das", 1, "07:00 AM", "10 hours", "assigned", "EMP-105", 3],
      [3, "Divya Ram", 1, "09:00 AM", "8 hours", "assigned", "EMP-106", 4],
      [1, "Baby Diya", 2, "01:00 PM", "6 hours", "assigned", "EMP-103", 2],
      [4, "Lakshmanan", -1, "08:00 AM", "24 hours", "completed", "EMP-102", 5],
      [2, "Gowri Shankar", -1, "09:00 AM", "12 hours", "completed", "EMP-101", 6],
      [0, "Selvi Murugan", -2, "10:00 AM", "8 hours", "completed", "EMP-109", 1],
      [5, "Raghav", -3, "08:00 AM", "6 hours", "completed", "EMP-104", 7],
      [1, "Baby Meera", -3, "02:00 PM", "6 hours", "completed", "EMP-103", 2],
      [2, "Chandran", -4, "07:00 AM", "12 hours", "completed", "EMP-108", 0],
      [3, "Uma Maheswari", -5, "09:00 AM", "10 hours", "completed", "EMP-106", 4],
      [0, "Balu", -6, "08:00 AM", "12 hours", "completed", "EMP-105", 5],
      [2, "Janaki", -2, "03:00 PM", "8 hours", "cancelled", null, 3]
    ];
    rows.forEach((r, i) => {
      const svc = SERVICES[r[0]];
      const emp = r[6] ? emps.find(e => e.id === r[6]) : null;
      const addr = addrs[i % addrs.length];
      const b = {
        id: `CC-BK-9${String(1000 + i)}`,
        service: svc.name, serviceId: svc.id, patient: r[1], customer: customers[r[7]],
        amount: svc.price, date: day(r[2]), time: r[3], duration: r[4],
        status: statusForStage(r[5]), stage: r[5],
        employeeId: emp ? emp.id : null, caregiver: emp ? emp.name : null,
        address: addr, area: AREAS.find(a => addr.includes(a)) || "Chennai"
      };
      const st = startOf(b);
      b.requestedAt = new Date(st.getTime() - (r[5] === "requested" ? 3600000 * (i + 1) : 86400000 * 2)).toISOString();
      bookings.push(b);
    });
    DB.set(AK.SEEDED, true);
    DB.log("Demo data loaded", "info");
  }
  bookings = bookings.map(b => normalize(b, emps));
  DB.saveBookings(bookings);
}
