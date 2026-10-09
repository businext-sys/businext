// Fake /api/** responses for marketing screenshots of the Businext web app.
//
// Usage (Playwright):
//   import { respond } from "./fixtures.mjs";
//   await page.route("**/api/**", async (route) => {
//     const req = route.request();
//     const url = new URL(req.url());
//     let body; try { body = req.postDataJSON(); } catch { body = undefined; }
//     const { status, body: json } = respond(req.method(), url.pathname, url.searchParams, body);
//     await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(json) });
//   });
//
// Every shape below mirrors what the Next.js BFF route handler returns to the
// browser (they are pass-through of the FastAPI JSON, snake_case unless noted),
// which is what the shared-core mappers/hooks then consume.
//
// IMPORTANT: wall-clock dates (reservations, booking requests) are generated in
// the LOCAL timezone of the Node process running this module. Run Playwright
// with the same timezone (e.g. TZ=Europe/Madrid for Node AND
// `timezoneId: "Europe/Madrid"` in the browser context).

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

const OWNER_ID = "5b0e8f3a-2c41-4d7e-9a6b-3f1e2d4c8a90";
const JAVI_ID = "9c2d4e6f-1a3b-4c5d-8e7f-0a1b2c3d4e5f";
const ANDRES_ID = "1f3e5d7c-9b2a-4c6e-8d0f-2a4b6c8d0e1f";

export const OWNER = {
  id: OWNER_ID,
  email: "carlos@barberiaelfaro.demo",
  displayName: "Carlos Ruiz",
  phone: "+34 600 214 387",
  businessId: OWNER_ID, // owner: business_id == user_id (backend AuthContext)
};

const BUSINESS = {
  name: "Barbería El Faro",
  phone: "+34 910 000 482",
  email: "hola@barberiaelfaro.demo",
  address: "Calle del Faro 14, 28004 Madrid",
  locationName: "El Faro · Malasaña",
  mapsLink: "https://maps.google.com/?q=Barber%C3%ADa+El+Faro+Madrid",
};

const BARBERS = [
  { name: "Carlos Ruiz", userId: OWNER_ID, role: "owner", weight: 0.33, email: OWNER.email, phone: OWNER.phone },
  { name: "Javi Moreno", userId: JAVI_ID, role: "manager", weight: 0.41, email: "javi@barberiaelfaro.demo", phone: "+34 600 518 902" },
  { name: "Andrés Gil", userId: ANDRES_ID, role: "employee", weight: 0.26, email: "andres@barberiaelfaro.demo", phone: "+34 600 733 145" },
];
const [CARLOS, JAVI, ANDRES] = BARBERS.map((b) => b.name);

const COMMISSION_SERVICE = 40; // %
const COMMISSION_PRODUCT = 10; // %

const SERVICES = [
  { id: 1, name: "Corte clásico", price: 15, dur: 30, w: 0.24 },
  { id: 2, name: "Corte + barba", price: 22, dur: 45, w: 0.27 },
  { id: 3, name: "Fade / degradado", price: 18, dur: 40, w: 0.24 },
  { id: 4, name: "Arreglo de barba", price: 10, dur: 20, w: 0.1 },
  { id: 5, name: "Afeitado navaja", price: 14, dur: 30, w: 0.08 },
  { id: 6, name: "Corte niño", price: 12, dur: 25, w: 0.07 },
];
const PRODUCTS = [
  { id: 7, name: "Pomada mate", price: 16.9, w: 0.32 },
  { id: 8, name: "Aceite de barba", price: 14.5, w: 0.26 },
  { id: 9, name: "Cera fijación fuerte", price: 12.9, w: 0.14 },
  { id: 10, name: "Bálsamo aftershave", price: 13.5, w: 0.12 },
  { id: 11, name: "Champú para barba", price: 11.9, w: 0.1 },
  { id: 12, name: "Peine de madera", price: 8, w: 0.06 },
];
const SVC = Object.fromEntries(SERVICES.map((s) => [s.name, s]));

// dayOfWeek: 0=Monday .. 6=Sunday (backend convention)
const HOURS = [
  ...[0, 1, 2, 3, 4].flatMap((d) => [
    { day: d, start: "10:00", end: "14:00", enabled: true },
    { day: d, start: "16:00", end: "20:00", enabled: true },
  ]),
  { day: 5, start: "09:30", end: "14:30", enabled: true },
  { day: 6, start: "10:00", end: "14:00", enabled: false },
];

const HISTORY_DAYS = 119;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pad = (n) => String(n).padStart(2, "0");
const r2 = (n) => Math.round(n * 100) / 100;
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** Local wall-clock without offset, like the backend's naive datetimes. */
const wall = (d) => `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
/** UTC naive (backend stores created_at with datetime.utcnow()). */
const utcNaive = (d) => d.toISOString().slice(0, 19);
const isoZ = (d) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const atMin = (day, minutes) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
const addMin = (d, m) => new Date(d.getTime() + m * 60000);
const weekdayMon0 = (d) => (d.getDay() + 6) % 7;
const hm = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
function pickWeighted(rand, items) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let x = rand() * total;
  for (const i of items) {
    x -= i.w;
    if (x <= 0) return i;
  }
  return items[items.length - 1];
}
function slotStartsFor(dow) {
  const out = [];
  for (const b of HOURS.filter((h) => h.day === dow && h.enabled)) {
    for (let m = hm(b.start); m + 30 <= hm(b.end); m += 30) out.push(m);
  }
  return out;
}
function commissionFor(creator, kind) {
  if (creator === CARLOS) return { rate: 0, amountOf: () => 0 };
  const rate = kind === "product" ? COMMISSION_PRODUCT : COMMISSION_SERVICE;
  return { rate, amountOf: (amt) => r2((amt * rate) / 100) };
}

const FIRST = ["Álvaro", "Pablo", "Diego", "Javier", "Sergio", "Adrián", "Daniel", "Raúl", "Iván", "Marcos", "Jorge", "Alberto", "Rubén", "Hugo", "Mario", "Óscar", "Víctor", "Manuel", "Fernando", "Gonzalo", "Nacho", "Rodrigo", "Samuel", "Héctor", "Luis", "Miguel", "Antonio", "Francisco", "Alejandro", "Tomás", "Martín", "Enrique", "Guillermo", "Jaime", "Ignacio", "Borja", "Lucas", "Bruno", "Íker", "Unai", "Aitor", "Eduardo", "Ricardo", "Emilio", "Julián", "Santiago", "Gabriel", "Nicolás", "Joel", "Saúl", "Ismael", "Rafael", "Felipe", "César", "Germán", "Ángel", "Marta", "Lucía"];
const LAST = ["García", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Hernández", "Díaz", "Muñoz", "Álvarez", "Romero", "Alonso", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Blanco", "Castro", "Ortega", "Rubio", "Molina", "Delgado", "Ortiz", "Marín", "Sanz", "Iglesias", "Medina", "Garrido", "Cortés", "Castillo", "Santos", "Lozano", "Guerrero", "Cano", "Prieto", "Méndez", "Cruz", "Calvo", "Gallego", "Vidal", "León", "Herrera", "Márquez", "Peña", "Flores", "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco", "Caballero", "Reyes", "Nieto", "Aguilar", "Pascual"];

/* ------------------------------------------------------------------ */
/* Dataset generation                                                  */
/* ------------------------------------------------------------------ */

function generate(now, seed) {
  const rand = mulberry32(seed);
  const today = startOfDay(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  // "Virtual now" for today's agenda: real clock during opening hours,
  // otherwise mid-day so the timeline always shows completed + pending.
  const splitMin = nowMin >= 10 * 60 + 30 && nowMin <= 19 * 60 + 30 ? nowMin : 13 * 60 + 30;

  // ---- Client pool ----
  const used = new Set();
  const newName = () => {
    for (;;) {
      const n = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
      if (!used.has(n)) {
        used.add(n);
        return n;
      }
    }
  };
  const prefBarber = () => pickWeighted(rand, BARBERS.map((b) => ({ ...b, w: b.weight }))).name;
  const prefService = () => pickWeighted(rand, SERVICES).name;
  const clients = [];
  const mk = (kind) => {
    const c = { name: newName(), kind, barber: prefBarber(), service: prefService(), visits: [] };
    clients.push(c);
    return c;
  };
  for (let i = 0; i < 190; i++) {
    const c = mk("regular");
    const I = 14 + Math.floor(rand() * 15);
    // Walk backwards from the most recent visit; joiners started 20-100 days ago.
    const joined = rand() < 0.72 ? HISTORY_DAYS : 20 + Math.floor(rand() * 80);
    for (let o = 1 + Math.floor(rand() * I); o <= joined; o += I + Math.floor(rand() * 7) - 3) {
      c.visits.push(o);
    }
  }
  for (let i = 0; i < 9; i++) {
    const c = mk("at_risk");
    const I = 15 + Math.floor(rand() * 11);
    for (let o = 2 * I + 8 + Math.floor(rand() * 20); o <= HISTORY_DAYS; o += I) c.visits.push(o);
  }
  for (let i = 0; i < 14; i++) mk("new").visits.push(1 + Math.floor(rand() * 25));
  for (let i = 0; i < 25; i++) {
    const c = mk("occasional");
    let o = 1 + Math.floor(rand() * 28);
    const n = 2 + Math.floor(rand() * 2);
    for (let k = 0; k < n && o <= HISTORY_DAYS; k++) {
      c.visits.push(o);
      o += 30 + Math.floor(rand() * 25);
    }
  }
  const regulars = clients.filter((c) => c.kind === "regular");

  // ---- Bucket visits per day (offset = days before today) ----
  const byOffset = new Map();
  for (const c of clients) {
    for (let o of c.visits) {
      let d = addDays(today, -o);
      if (weekdayMon0(d) === 6) o = o + 1 <= HISTORY_DAYS ? o + 1 : o - 1; // Sunday closed
      d = addDays(today, -o);
      // Tuesdays are quiet: a third of Tuesday visits slip to Wednesday.
      if (weekdayMon0(d) === 1 && o - 1 >= 1 && rand() < 0.33) o -= 1;
      if (o < 1) continue;
      if (!byOffset.has(o)) byOffset.set(o, []);
      byOffset.get(o).push(c);
    }
  }

  const reservations = [];
  const finances = [];
  let resId = 1000;
  let finId = 5000;

  const addFinanceForVisit = (res, svc, endDate) => {
    const comm = commissionFor(res.in_charge, "service");
    finances.push({
      id: finId++,
      concept: svc.name,
      amount: svc.price,
      type: "INCOME",
      creator: res.in_charge,
      created_at: utcNaive(endDate),
      reservation_id: res.id,
      product_id: svc.id,
      customer_name: res.customer_name,
      commission_rate: comm.rate,
      commission_amount: comm.amountOf(svc.price),
      _local: endDate,
    });
  };
  const addProductSale = (creator, customer, when, product) => {
    const comm = commissionFor(creator, "product");
    finances.push({
      id: finId++,
      concept: product.name,
      amount: product.price,
      type: "INCOME",
      creator,
      created_at: utcNaive(when),
      reservation_id: null,
      product_id: product.id,
      customer_name: customer,
      commission_rate: comm.rate,
      commission_amount: comm.amountOf(product.price),
      _local: when,
    });
  };
  const pushReservation = (customer, barber, svc, start, status) => {
    const end = addMin(start, svc.dur);
    const res = {
      id: resId++,
      customer_name: customer,
      in_charge: barber,
      reservation_start_date: wall(start),
      reservation_end_date: wall(end),
      time_per_reservation: svc.dur,
      status,
      service: svc.name,
      _local: start,
    };
    reservations.push(res);
    return { res, end };
  };

  // ---- History (all COMPLETED) ----
  for (let o = HISTORY_DAYS; o >= 1; o--) {
    const day = addDays(today, -o);
    const dow = weekdayMon0(day);
    if (dow === 6) continue;
    const starts = slotStartsFor(dow);
    const taken = new Map(BARBERS.map((b) => [b.name, new Set()]));
    for (const c of byOffset.get(o) || []) {
      const order = [rand() < 0.85 ? c.barber : prefBarber(), ...BARBERS.map((b) => b.name)];
      let placed = null;
      for (const b of order) {
        let free = starts.filter((m) => !taken.get(b).has(m));
        if (dow === 1) {
          const morning = free.filter((m) => m < 14 * 60);
          if (morning.length && rand() < 0.8) free = morning; // quiet Tuesday afternoons
        }
        if (free.length) {
          placed = { b, m: free[Math.floor(rand() * free.length)] };
          break;
        }
      }
      if (!placed) continue;
      taken.get(placed.b).add(placed.m);
      const svc = rand() < 0.8 ? SVC[c.service] : pickWeighted(rand, SERVICES);
      const { res, end } = pushReservation(c.name, placed.b, svc, atMin(day, placed.m), "COMPLETED");
      addFinanceForVisit(res, svc, end);
      if (rand() < 0.22) addProductSale(placed.b, c.name, addMin(end, 2), pickWeighted(rand, PRODUCTS));
    }
  }

  // ---- Today's agenda ----
  const todayPlan = [
    ["10:00", CARLOS, "Corte clásico"],
    ["10:00", JAVI, "Fade / degradado"],
    ["10:30", ANDRES, "Corte niño"],
    ["10:45", JAVI, "Corte + barba"],
    ["11:00", CARLOS, "Corte + barba"],
    ["11:30", ANDRES, "Arreglo de barba"],
    ["12:00", JAVI, "Afeitado navaja"],
    ["12:00", CARLOS, "Corte clásico"],
    ["13:00", ANDRES, "Fade / degradado"],
    ["16:00", CARLOS, "Corte + barba"],
    ["16:30", JAVI, "Fade / degradado"],
    ["17:00", ANDRES, "Corte clásico"],
    ["17:30", CARLOS, "Afeitado navaja"],
    ["18:00", JAVI, "Corte + barba"],
    ["18:30", ANDRES, "Corte niño"],
  ];
  const todayClients = [...regulars].sort(() => rand() - 0.5).slice(0, todayPlan.length);
  todayPlan.forEach(([t, barber, svcName], i) => {
    const svc = SVC[svcName];
    const startMin = hm(t);
    const done = startMin + svc.dur <= splitMin;
    const { res, end } = pushReservation(todayClients[i].name, barber, svc, atMin(today, startMin), done ? "COMPLETED" : "PENDING");
    if (done) addFinanceForVisit(res, svc, end);
  });
  // Two counter sales today (no reservation) before the split time.
  addProductSale(JAVI, todayClients[1].name, atMin(today, Math.min(splitMin - 20, 10 * 60 + 45)), PRODUCTS[0]);
  addProductSale(CARLOS, todayClients[4].name, atMin(today, Math.min(splitMin - 10, 11 * 60 + 50)), PRODUCTS[1]);

  // ---- Upcoming PENDING reservations (next days) ----
  const upcomingPool = [...regulars].sort(() => rand() - 0.5);
  let up = 0;
  for (let o = 1; o <= 7; o++) {
    const day = addDays(today, o);
    const dow = weekdayMon0(day);
    if (dow === 6) continue;
    const n = o === 1 ? 4 : o <= 3 ? 2 : 1;
    const starts = slotStartsFor(dow);
    const taken = new Set();
    for (let k = 0; k < n; k++) {
      const c = upcomingPool[up++];
      const b = c.barber;
      let m;
      do m = starts[Math.floor(rand() * starts.length)];
      while (taken.has(`${b}${m}`));
      taken.add(`${b}${m}`);
      pushReservation(c.name, b, SVC[c.service], atMin(day, m), "PENDING");
    }
  }

  // ---- Expenses (monthly) ----
  const windowStart = addDays(today, -HISTORY_DAYS);
  const expenses = []; // includes future dates of the current month (for projections)
  for (let mDate = new Date(windowStart.getFullYear(), windowStart.getMonth(), 1); mDate <= today; mDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1)) {
    const y = mDate.getFullYear();
    const mo = mDate.getMonth();
    const plan = [
      [1, "Alquiler del local", 1150],
      [6, "Factura de luz", 140 + Math.round(rand() * 55)],
      [12, "Pedido de productos (proveedor)", 280 + Math.round(rand() * 140)],
      [20, "Agua y basuras", 38 + Math.round(rand() * 17)],
      [22, "Material desechable (cuchillas, capas, toallas)", 60 + Math.round(rand() * 35)],
    ];
    for (const [dd, concept, amount] of plan) {
      const when = new Date(y, mo, dd, 9, 15);
      expenses.push({ when, concept, amount });
      if (when < windowStart || when > now) continue;
      finances.push({
        id: finId++,
        concept,
        amount,
        type: "EXPENSE",
        creator: CARLOS,
        created_at: utcNaive(when),
        reservation_id: null,
        product_id: null,
        customer_name: null,
        commission_rate: 0,
        commission_amount: 0,
        _local: when,
      });
    }
  }

  return { today, now, splitMin, clients, reservations, finances, expenses, windowStart, rand };
}

/* ------------------------------------------------------------------ */
/* Derived: weekly intelligence summary                                */
/* ------------------------------------------------------------------ */

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function weekStats(data, start) {
  const end = addDays(start, 7);
  const inRange = (d) => d >= start && d < end;
  const res = data.reservations.filter((r) => r.status === "COMPLETED" && inRange(r._local));
  const fin = data.finances.filter((f) => f.type === "INCOME" && inRange(f._local));
  const income = fin.reduce((s, f) => s + f.amount, 0);
  const productSales = fin.filter((f) => f.reservation_id === null);
  const daily_income = [0, 0, 0, 0, 0, 0, 0];
  const daily_reservations = [0, 0, 0, 0, 0, 0, 0];
  const daily_products = [0, 0, 0, 0, 0, 0, 0];
  for (const f of fin) daily_income[weekdayMon0(f._local)] += f.amount;
  for (const r of res) daily_reservations[weekdayMon0(r._local)] += 1;
  for (const f of productSales) daily_products[weekdayMon0(f._local)] += 1;
  const serviceCount = {};
  for (const r of res) serviceCount[r.service] = (serviceCount[r.service] || 0) + 1;
  const employee_stats = BARBERS.map((b) => {
    const bf = fin.filter((f) => f.creator === b.name);
    const inc = r2(bf.reduce((s, f) => s + f.amount, 0));
    const nres = res.filter((r) => r.in_charge === b.name).length;
    return {
      name: b.name,
      income: inc,
      reservations: nres,
      product_sales: bf.filter((f) => f.reservation_id === null).length,
      avg_ticket: nres ? r2(inc / nres) : 0,
    };
  }).sort((a, b) => b.income - a.income);
  return {
    income: r2(income),
    reservations: res.length,
    product_sales: productSales.length,
    daily_income: daily_income.map(r2),
    daily_reservations,
    daily_products,
    serviceCount,
    employee_stats,
  };
}

function buildWeekly(data) {
  const lastMonday = (() => {
    const d = addDays(data.today, -7);
    return addDays(d, -weekdayMon0(d));
  })();
  const cur = weekStats(data, lastMonday);
  const prev = weekStats(data, addDays(lastMonday, -7));
  const pct = (c, p) => (p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / p) * 1000) / 10);
  const dayMap = DAY_NAMES.map((n, i) => [n, cur.daily_income[i]]).filter(([, v]) => v > 0);
  const best_day = dayMap.length ? dayMap.reduce((a, b) => (b[1] > a[1] ? b : a))[0] : "N/A";
  const worst_day = dayMap.length > 1 ? dayMap.reduce((a, b) => (b[1] < a[1] ? b : a))[0] : "N/A";
  const top_service = Object.entries(cur.serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
  const star = cur.employee_stats[0];
  const second = cur.employee_stats[1];
  const third = cur.employee_stats[2];
  return { lastMonday, cur, prev, pct, best_day, worst_day, top_service, star, second, third };
}

/** Same rules as apps/web/src/lib/intelligence/client-scoring.ts */
function atRiskClients(data) {
  const byName = new Map();
  for (const r of data.reservations) {
    if (r.status !== "COMPLETED") continue;
    if (!byName.has(r.customer_name)) byName.set(r.customer_name, []);
    byName.get(r.customer_name).push(r._local.getTime());
  }
  const out = [];
  for (const [name, ts] of byName) {
    ts.sort((a, b) => a - b);
    if (ts.length < 2) continue;
    const gaps = ts.slice(1).map((t, i) => (t - ts[i]) / 864e5);
    const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    const since = Math.floor((data.now.getTime() - ts[ts.length - 1]) / 864e5);
    if (since > avg * 2) out.push({ name, since });
  }
  return out.sort((a, b) => b.since - a.since);
}

function eur(n) {
  return `${n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`;
}

function weeklySummaryPayload(data) {
  const w = buildWeekly(data);
  const { cur, prev, pct } = w;
  const risk = atRiskClients(data);
  const riskNames = risk.slice(0, 2).map((r) => r.name.split(" ")[0] + " " + r.name.split(" ")[1]);
  const tueRes = cur.daily_reservations[1];
  const tueSlots = slotStartsFor(1).filter((m) => m >= 16 * 60).length * BARBERS.length;
  const tueFree = Math.max(55, Math.min(80, Math.round(100 - (tueRes / (slotStartsFor(1).length * BARBERS.length)) * 100)));
  const incomeChange = pct(cur.income, prev.income);
  const kpis = {
    total_income: cur.income,
    total_reservations: cur.reservations,
    total_product_sales: cur.product_sales,
    prev_week_income: prev.income,
    prev_week_reservations: prev.reservations,
    prev_week_product_sales: prev.product_sales,
    income_change_pct: incomeChange,
    reservations_change_pct: pct(cur.reservations, prev.reservations),
    product_sales_change_pct: pct(cur.product_sales, prev.product_sales),
    best_day: w.best_day,
    worst_day: w.worst_day,
    top_service: w.top_service,
    daily_income: cur.daily_income,
    daily_reservations: cur.daily_reservations,
    daily_products: cur.daily_products,
    employee_stats: cur.employee_stats,
    star_employee: w.star.name,
    opportunities: [
      {
        text: `Los martes por la tarde tienes alrededor de un ${tueFree} % de huecos libres (${tueSlots} citas posibles entre las 16:00 y las 20:00). Una promo de «Corte + barba a 18 €» solo en esa franja podría sumarte 6–8 citas por semana.`,
        impact: "alto",
      },
      {
        text: `${risk.length} clientes habituales llevan más del doble de su frecuencia normal sin volver${riskNames.length ? ` (por ejemplo ${riskNames.join(" y ")})` : ""}. Un WhatsApp personalizado con un 10 % de descuento suele recuperar a la mitad.`,
        impact: "medio",
      },
      {
        text: `Solo ${Math.round((cur.product_sales / Math.max(1, cur.reservations)) * 100)} de cada 100 clientes se llevó un producto. Recomendar la pomada mate al terminar cada fade puede subir el ticket medio unos 2 €.`,
        impact: "bajo",
      },
    ],
    team_narrative: `${w.star.name.split(" ")[0]} ha sido tu barbero estrella de la semana: ${w.star.reservations} servicios, ${eur(w.star.income)} facturados y ${w.star.product_sales} productos vendidos. ${w.second.name.split(" ")[0]} mantiene un ticket medio de ${w.second.avg_ticket.toLocaleString("es-ES")} € y ${w.third.name.split(" ")[0]} va ganando agenda propia con los cortes infantiles y los arreglos de barba.`,
  };
  const narrative = `Buena semana en ${BUSINESS.name}: facturaste ${eur(cur.income)}, un ${Math.abs(incomeChange).toLocaleString("es-ES")} % ${incomeChange >= 0 ? "más" : "menos"} que la semana anterior, con ${cur.reservations} servicios completados. El ${w.best_day.toLowerCase()} fue tu mejor día y el ${w.top_service.toLowerCase()} sigue siendo el servicio más pedido. El punto flojo continúa siendo el ${w.worst_day.toLowerCase()}, sobre todo por la tarde: es la franja con más margen para crecer.`;
  const client_narrative = `El corte + barba es lo que más dinero deja por visita (22 €) y casi la mitad de quienes lo piden repiten en menos de tres semanas. Los sábados por la mañana se llenan solos, así que conviene empujar la demanda hacia el martes y el miércoles por la tarde. Ofrece reservar la siguiente cita al cobrar: tus clientes fieles vuelven cada 18–20 días de media.`;
  const generated = new Date(w.lastMonday.getTime());
  generated.setDate(generated.getDate() + 7);
  generated.setHours(7, 2, 0, 0);
  return {
    id: 42,
    business_id: OWNER.businessId,
    week_start: ymd(w.lastMonday),
    week_end: ymd(addDays(w.lastMonday, 6)),
    narrative,
    kpis: JSON.stringify(kpis),
    client_narrative,
    generated_at: utcNaive(generated),
  };
}

/* ------------------------------------------------------------------ */
/* Dataset cache (regenerated per local day)                           */
/* ------------------------------------------------------------------ */

let cache = null;

function seedFor(today, attempt) {
  let h = 2166136261;
  for (const ch of `${ymd(today)}#${attempt}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function getData() {
  const now = new Date();
  const key = ymd(now);
  if (cache && cache.key === key) return cache;
  // Try a few seeds so the weekly story holds: income up vs. previous week,
  // Javi as star barber, Tuesday as the weakest day.
  let data = null;
  for (let attempt = 0; attempt < 60; attempt++) {
    data = generate(now, seedFor(now, attempt));
    const w = buildWeekly(data);
    const ch = w.pct(w.cur.income, w.prev.income);
    if (ch >= 4 && ch <= 22 && w.star.name === JAVI && w.worst_day === "Martes") break;
  }
  cache = {
    key,
    data,
    weekly: weeklySummaryPayload(data),
    bookingRequests: buildBookingRequests(data),
    reviews: buildReviews(data.now),
    extraReservations: [],
  };
  return cache;
}

/* ------------------------------------------------------------------ */
/* Booking requests                                                    */
/* ------------------------------------------------------------------ */

function nextOpenDay(from, offset) {
  let d = addDays(from, offset);
  while (weekdayMon0(d) === 6) d = addDays(d, 1);
  return d;
}

function buildBookingRequests(data) {
  const { today, now } = data;
  const mkReq = (id, client, email, phone, employee, service, date, status, createdHoursAgo) => {
    const created = new Date(now.getTime() - createdHoursAgo * 3600e3);
    return {
      id,
      business_id: OWNER.businessId,
      client_name: client,
      client_email: email,
      client_phone: phone,
      employee_name: employee,
      service,
      requested_date: wall(date),
      proposed_date: null,
      status,
      location_id: 1,
      responded_at: status === "REQUESTED" ? null : utcNaive(new Date(created.getTime() + 2 * 3600e3)),
      expires_at: utcNaive(new Date(created.getTime() + 48 * 3600e3)),
      created_at: utcNaive(created),
    };
  };
  const d1 = nextOpenDay(today, 1);
  const d2 = nextOpenDay(today, 2);
  const d3 = nextOpenDay(today, 4);
  const at = (d, t) => atMin(d, hm(t));
  return [
    mkReq(311, "Lucía Fernández", "lucia.fernandez@example.com", "+34 600 481 226", JAVI, "Fade / degradado", at(d1, "17:30"), "REQUESTED", 0.6),
    mkReq(310, "Mateo Serrano", "mateo.serrano@example.com", "+34 600 902 318", null, "Corte + barba", at(d2, weekdayMon0(d2) === 5 ? "11:00" : "11:00"), "REQUESTED", 2.5),
    mkReq(309, "Raúl Benítez", "raul.benitez@example.com", "+34 600 377 541", ANDRES, "Corte clásico", at(d3, weekdayMon0(d3) === 5 ? "12:30" : "18:30"), "REQUESTED", 5),
    mkReq(305, "Daniel Prados", "daniel.prados@example.com", "+34 600 145 690", CARLOS, "Afeitado navaja", at(today, "12:00"), "ACCEPTED", 30),
    mkReq(301, "Íñigo Salas", "inigo.salas@example.com", "+34 600 668 204", JAVI, "Corte + barba", at(addDays(today, -2), "19:30"), "REJECTED", 70),
  ];
}

/* ------------------------------------------------------------------ */
/* Google reviews                                                      */
/* ------------------------------------------------------------------ */

const REVIEW_SEED = [
  // [daysAgo, author, rating, text, ownerAnswer?, aiDraft?]
  [2, "Marcos Peña", 5, "Javi es un crack con los degradados. Salgo siempre como quiero y el trato es de diez. Ya no voy a otro sitio.", null, "¡Gracias, Marcos! Se lo diremos a Javi, que le va a hacer mucha ilusión. Nos alegra que hayas encontrado tu barbería: aquí te esperamos para el próximo fade. ¡Un abrazo!"],
  [4, "Sergio Llorente", 3, "El corte estuvo bien pero me atendieron 20 minutos tarde y nadie me avisó. Espero que fuese algo puntual.", null, "Hola Sergio, gracias por contárnoslo y perdona la espera: ese día se nos alargó un servicio y deberíamos haberte avisado. Ya hemos activado un aviso por WhatsApp cuando vamos con retraso. Nos encantaría compensártelo en tu próxima visita. Un saludo, Carlos."],
  [5, "Pablo Ferrer", 5, "Reservé online en dos minutos y me atendieron a la hora exacta. Corte + barba impecable y muy buen ambiente.", "¡Gracias, Pablo! Así da gusto. Te esperamos en la próxima. — Carlos, Barbería El Faro", null],
  [7, "Ana Belén Ruiz", 5, "Llevé a mi hijo de 6 años y Andrés tuvo una paciencia infinita. Salió encantado y guapísimo. Repetiremos seguro.", null, "¡Muchas gracias, Ana Belén! A Andrés le encantan los peques. Dale un choque de puños de nuestra parte y aquí estaremos para el próximo corte."],
  [9, "Rodrigo Esteban", 5, "La mejor barbería del barrio sin duda. Carlos se toma su tiempo, te aconseja y el resultado es top.", "¡Gracias por la confianza, Rodrigo! Un placer tenerte por aquí. — Carlos", null],
  [11, "Héctor Vallejo", 2, "Pedí un degradado bajo y me lo dejaron más alto de lo que quería. El trato fue correcto, pero no quedé contento.", null, "Hola Héctor, sentimos de verdad que el degradado no quedara como querías. A partir de ahora confirmamos siempre con una foto de referencia antes de empezar. Si te pasas esta semana, te lo retocamos sin coste. Un saludo, Carlos."],
  [13, "Unai Etxeberria", 5, "Afeitado a navaja con toalla caliente como los de antes. Toda una experiencia, muy recomendable.", "¡Mil gracias, Unai! Ese ritual es nuestro favorito. — Equipo El Faro", null],
  [16, "Gonzalo Vera", 4, "Muy buen corte, aunque un sábado por la mañana tuve que esperar unos 10 minutos. Aun así, volveré.", null, null],
  [18, "Bruno Castaño", 5, "Sitio limpio, buena música y profesionales de verdad. El aceite de barba que me recomendaron es una maravilla.", "¡Gracias, Bruno! Nos alegra que te haya gustado el aceite. — Carlos", null],
  [21, "Jaime Robles", 5, "Precio justo para la calidad que ofrecen. El fade me duró perfecto casi tres semanas.", null, null],
  [24, "Nicolás Arce", 5, "Vine por recomendación de un amigo y ahora vengo cada dos semanas. Siempre puntuales.", "¡Gracias, Nicolás! Saluda a tu amigo de nuestra parte. — Javi", null],
  [27, "Tomás Quintana", 5, null, null, null],
  [31, "Felipe Morales", 5, "Me encanta que te manden recordatorio de la cita. Trato cercano y corte perfecto.", "¡Gracias, Felipe! Nos vemos en la próxima. — Carlos", null],
  [35, "Iván Requena", 4, "Buen servicio y precio razonable. Le pondría 5 si hubiera más huecos por la tarde.", "Gracias, Iván. Estamos ampliando horario de tarde los martes y miércoles, ¡atento! — Carlos", null],
  [38, "Andrea Solís", 5, "Le regalé a mi pareja un corte + barba y volvió encantado. Muy atentos desde la reserva.", null, null],
  [42, "Samuel Ibarra", 5, "Andrés me arregló la barba que traía hecha un desastre. Profesional y muy majo.", "¡Gracias, Samuel! — Andrés", null],
  [47, "Emilio Cuesta", 5, "Gran ambiente, te ofrecen algo de beber mientras esperas. El corte clásico, de 10.", null, null],
  [53, "Óscar Linares", 5, "Muy buenos con el degradado y con la barba. Se nota que les gusta lo que hacen.", "¡Gracias, Óscar! — Equipo El Faro", null],
  [58, "Víctor Manzano", 4, "Corte bien hecho y rápido. El sitio es pequeño pero muy acogedor.", null, null],
  [64, "Guillermo Pardo", 5, "Llevo un año viniendo y nunca me han fallado. Javi y Carlos son unos artistas.", "¡Un año ya! Gracias por estar ahí, Guillermo. — Carlos", null],
  [71, "Alejandro Vidal", 5, "Primera vez y salgo muy contento. Me explicaron cómo peinarme en casa con la pomada.", null, null],
  [78, "Ismael Rojas", 5, "Rápidos, limpios y con buen rollo. 100 % recomendable.", "¡Gracias, Ismael! — Equipo El Faro", null],
  [86, "Ricardo Tena", 5, "El mejor afeitado que me han hecho nunca.", null, null],
  [94, "Joel Carmona", 4, "Muy bien en general. A veces cuesta encontrar hueco el sábado.", "Gracias, Joel. Te recomendamos reservar online con un par de días de margen. — Carlos", null],
  [103, "Martín Olmedo", 5, "Trato excelente y resultado perfecto. Volveré seguro.", null, null],
  [112, "César Bermúdez", 5, "Javi me hizo un fade espectacular. Muy profesional.", "¡Gracias, César! — Javi", null],
  [124, "Lucas Andrade", 5, "Barbería de las de toda la vida pero con estilo actual. Me encanta.", null, null],
  [137, "Germán Toledo", 5, "Puntualidad, limpieza y buen corte. Qué más se puede pedir.", "¡Gracias, Germán! — Carlos", null],
  [149, "Rafael Ugarte", 1, "Fui sin cita un sábado y no pudieron atenderme. Deberían avisar en la web.", "Hola Rafael, sentimos no haber podido atenderte. Los sábados trabajamos solo con cita; ya lo hemos destacado en la web y en Google. ¡Esperamos verte pronto! — Carlos", null],
  [163, "Aitor Zubiri", 5, "Muy buen trato y precios correctos. Recomendable.", null, null],
  [178, "Borja Montero", 5, "Llevé a mis dos hijos y salieron encantados. Gracias, Andrés.", "¡Gracias a vosotros, Borja! — Andrés", null],
  [194, "Saúl Gutiérrez", 5, "Los mejores en degradados del barrio.", null, null],
  [211, "Eduardo Paredes", 5, "Profesionales y muy cercanos. El corte + barba merece la pena.", "¡Gracias, Eduardo! — Carlos", null],
  [229, "Ángel Sepúlveda", 4, "Buen corte. El local es pequeño pero se está a gusto.", null, null],
];

function buildReviews(now) {
  return REVIEW_SEED.map(([daysAgo, author, rating, text, ownerAnswer, aiDraft], i) => {
    const d = new Date(now.getTime() - daysAgo * 864e5);
    d.setHours(10 + ((i * 7) % 10), (i * 13) % 60, (i * 29) % 60, 0);
    const ts = Math.floor(d.getTime() / 1000);
    return {
      id: 9000 + i,
      review_id: `ChZDSUhNMG9nS0VJQ0FnSUR${(1000 + i).toString(36).toUpperCase()}EZWxGYXJv`,
      profile_id: 1,
      author_title: author,
      author_image: null,
      review_text: text,
      review_rating: rating,
      review_timestamp: ts,
      review_datetime_utc: isoZ(d),
      review_link: `https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sElFaro${9000 + i}`,
      owner_answer: ownerAnswer,
      owner_answer_timestamp: ownerAnswer ? ts + 86400 : null,
      ai_generated_response: aiDraft,
      ai_response_generated_at: aiDraft ? isoZ(new Date(Math.min(now.getTime() - 3600e3, d.getTime() + 2 * 3600e3))) : null,
      created_at: utcNaive(new Date(d.getTime() + 3600e3)),
    };
  });
}

const REVIEWS_PER_SCORE = { "5": 148, "4": 24, "3": 6, "2": 3, "1": 2 }; // 183 -> 4.71

function reviewsProfile(now) {
  const summary = {
    overall_sentiment: "positivo",
    positive_themes: [
      "Calidad de los degradados y cortes modernos",
      "Trato cercano y profesional de todo el equipo",
      "Puntualidad y facilidad para reservar online",
    ],
    negative_themes: [
      "Esperas puntuales los sábados por la mañana",
      "Pocos huecos libres por la tarde entre semana",
      "Algún degradado que no coincidió con lo pedido",
    ],
    recommendations: [
      "Espaciar 5 minutos las citas de los sábados de 10:00 a 13:00 para absorber retrasos",
      "Confirmar con una foto de referencia el tipo de degradado antes de empezar",
      "Responder todas las reseñas en menos de 48 h, especialmente las de 3 estrellas o menos",
    ],
    review_count_analyzed: 183,
    generated_at: isoZ(new Date(now.getTime() - 26 * 3600e3)),
  };
  const created = new Date(now.getTime() - 240 * 864e5);
  return {
    id: 1,
    source_url: "https://maps.app.goo.gl/ElFaroBarberiaMadrid",
    google_id: "0xd42287e1a2b3c4d5:0x9f8e7d6c5b4a3921",
    name: BUSINESS.name,
    address: BUSINESS.address,
    category: "Barbería",
    phone: BUSINESS.phone,
    rating: 4.7,
    total_reviews: 183,
    reviews_per_score: JSON.stringify(REVIEWS_PER_SCORE),
    location_link: BUSINESS.mapsLink,
    validation_status: "locked",
    validated_by: OWNER.id,
    validated_at: utcNaive(created),
    last_sync_at: utcNaive(new Date(now.getTime() - 3 * 3600e3)),
    last_review_timestamp: Math.floor((now.getTime() - 2 * 864e5) / 1000),
    ai_summary: JSON.stringify(summary),
    ai_summary_generated_at: summary.generated_at.replace("Z", ""),
    created_at: utcNaive(created),
    updated_at: utcNaive(new Date(now.getTime() - 3 * 3600e3)),
  };
}

/* ------------------------------------------------------------------ */
/* Static-ish resources                                                */
/* ------------------------------------------------------------------ */

function accessContext() {
  return {
    userId: OWNER.id,
    businessId: OWNER.businessId,
    role: "owner",
    accountType: "owner",
    memberStatus: "active",
    subscriptionActive: true,
    profile: { displayName: OWNER.displayName, email: OWNER.email, phone: OWNER.phone },
    capabilities: {
      canAccessApp: true,
      canManageConfiguration: true,
      canManageTeam: true,
      canManageProducts: true,
      canManageFinances: true,
      canManageReservations: true,
      canManageReviews: true,
    },
  };
}

function employees() {
  // camelCase: backend EmployeePublic is already camelCase. The owner has a
  // businessmember row with role "owner" (see availability_service).
  const created = ["2025-03-02T10:12:00", "2025-03-10T18:40:00", "2025-09-15T11:05:00"];
  return BARBERS.map((b, i) => ({
    id: i + 1,
    businessId: OWNER.businessId,
    memberUserId: b.userId,
    displayName: b.name,
    email: b.email,
    phone: b.phone,
    role: b.role,
    status: "active",
    locationId: 1,
    createdAt: created[i],
  }));
}

function products() {
  return [
    ...SERVICES.map((s) => ({ id: s.id, name: s.name, price: s.price, type: "servicio", image_url: null, seller: null })),
    ...PRODUCTS.map((p) => ({ id: p.id, name: p.name, price: p.price, type: "producto", image_url: null, seller: null })),
  ];
}

function configuration() {
  return [
    {
      id: 1,
      business_id: OWNER.businessId,
      business_name: BUSINESS.name,
      business_phone: BUSINESS.phone,
      business_email: BUSINESS.email,
      commission_product: COMMISSION_PRODUCT,
      commission_service: COMMISSION_SERVICE,
    },
  ];
}

function location() {
  return {
    id: 1,
    business_id: OWNER.businessId,
    name: BUSINESS.locationName,
    address: BUSINESS.address,
    phone: BUSINESS.phone,
    maps_link: BUSINESS.mapsLink,
    is_active: true,
    created_at: "2025-03-02T10:15:00",
  };
}

function workingHours(memberUserId) {
  return HOURS.map((h, i) => ({
    id: (memberUserId ? 100 : 1) + i,
    day_of_week: h.day,
    start_time: h.start,
    end_time: h.end,
    enabled: h.enabled,
    member_user_id: memberUserId || null,
  }));
}

const strip = (o) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _local, ...rest } = o;
  return rest;
};

/* ------------------------------------------------------------------ */
/* Finances: annual balances                                           */
/* ------------------------------------------------------------------ */

const ANNUAL_OPTIONS = {
  // "projected": current month = month-to-date income extrapolated to the full
  //              month minus that month's expenses (smooth growing line).
  // "actual":    current month = real month-to-date balance (what the backend does).
  currentMonth: process.env.FIXTURE_ANNUAL_CURRENT ?? "projected",
  // "omit": current year only lists months up to the current one (cleaner line chart).
  // "zero": 12 months, future months at 0 (exact backend behaviour).
  futureMonths: process.env.FIXTURE_ANNUAL_FUTURE ?? "omit",
};

function annual(year) {
  const { data } = getData();
  const { today, finances, expenses, windowStart } = data;
  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1;
  const monthBalance = (y, m) =>
    finances
      .filter((f) => f._local.getFullYear() === y && f._local.getMonth() + 1 === m)
      .reduce((s, f) => s + (f.type === "INCOME" ? f.amount : -f.amount), 0);

  // First month fully covered by the generated history.
  const firstFull = new Date(windowStart.getFullYear(), windowStart.getMonth() + (windowStart.getDate() === 1 ? 0 : 1), 1);
  const actual = {};
  for (let d = new Date(firstFull); d < new Date(curYear, curMonth - 1, 1); d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    actual[`${d.getFullYear()}-${d.getMonth() + 1}`] = r2(monthBalance(d.getFullYear(), d.getMonth() + 1));
  }
  const anchorKey = `${firstFull.getFullYear()}-${firstFull.getMonth() + 1}`;
  const anchor = actual[anchorKey] ?? 3800;
  const monthsBetween = (y, m) => (firstFull.getFullYear() - y) * 12 + (firstFull.getMonth() + 1 - m);
  const synthetic = (y, m) => r2(anchor * Math.pow(0.95, monthsBetween(y, m)) * (0.97 + ((y * 31 + m * 7) % 7) / 100));

  const out = [];
  for (let m = 1; m <= 12; m++) {
    let balance;
    if (year > curYear || (year === curYear && m > curMonth)) {
      if (year === curYear && ANNUAL_OPTIONS.futureMonths === "omit") continue;
      balance = 0;
    } else if (year === curYear && m === curMonth) {
      if (ANNUAL_OPTIONS.currentMonth === "actual") {
        balance = r2(monthBalance(curYear, m));
      } else {
        const income = finances
          .filter((f) => f.type === "INCOME" && f._local.getFullYear() === curYear && f._local.getMonth() + 1 === m)
          .reduce((s, f) => s + f.amount, 0);
        const dim = new Date(curYear, m, 0).getDate();
        const exp = expenses
          .filter((e) => e.when.getFullYear() === curYear && e.when.getMonth() + 1 === m)
          .reduce((s, e) => s + e.amount, 0);
        balance = r2((income * dim) / Math.max(1, today.getDate()) - exp);
      }
    } else if (actual[`${year}-${m}`] !== undefined) {
      balance = actual[`${year}-${m}`];
    } else {
      balance = synthetic(year, m);
    }
    out.push({ month: m, balance });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Public booking                                                      */
/* ------------------------------------------------------------------ */

function publicAvailability(dateStr, employeeName) {
  const { data } = getData();
  const [y, mo, d] = (dateStr || "").split("-").map(Number);
  if (!y || !mo || !d) return { status: 422, body: { detail: "Invalid date format. Use YYYY-MM-DD" } };
  const day = new Date(y, mo - 1, d);
  const dow = weekdayMon0(day);
  const now = new Date();
  const names = employeeName ? [employeeName] : BARBERS.map((b) => b.name).sort();
  const occupied = new Set();
  const all = [...data.reservations, ...getData().extraReservations];
  for (const r of all) {
    if (ymd(r._local) !== dateStr) continue;
    occupied.add(`${r.in_charge}|${pad(r._local.getHours())}:${pad(r._local.getMinutes())}`);
  }
  for (const br of getData().bookingRequests) {
    if (br.status !== "REQUESTED" || !br.requested_date.startsWith(dateStr)) continue;
    occupied.add(`${br.employee_name}|${br.requested_date.slice(11, 16)}`);
  }
  const slots = [];
  for (const name of names) {
    for (const m of slotStartsFor(dow)) {
      const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
      if (atMin(day, m) <= now) continue;
      if (occupied.has(`${name}|${t}`)) continue;
      slots.push({ time: t, employee_name: name });
    }
  }
  slots.sort((a, b) => a.time.localeCompare(b.time));
  return { status: 200, body: { date: dateStr, slots } };
}

function publicBook(method, rest, sp) {
  // rest = [businessId, action]
  const action = rest[1];
  if (method === "GET" && action === "locations") {
    const loc = location();
    return {
      status: 200,
      body: {
        business_name: BUSINESS.name,
        locations: [{ id: loc.id, name: loc.name, address: loc.address, phone: loc.phone, maps_link: loc.maps_link }],
      },
    };
  }
  if (method === "GET" && action === "services") {
    const loc = location();
    const locId = sp.get("location_id");
    return {
      status: 200,
      body: {
        business_name: BUSINESS.name,
        services: SERVICES.map((s) => ({ id: s.id, name: s.name, price: s.price, type: "servicio", image_url: null })),
        employees: BARBERS.map((b) => b.name).sort().map((name) => ({ name, available: true })),
        location: locId ? { id: loc.id, name: loc.name, address: loc.address, phone: loc.phone, maps_link: loc.maps_link } : null,
      },
    };
  }
  if (method === "GET" && action === "availability") {
    return publicAvailability(sp.get("date"), sp.get("employee_name"));
  }
  if (method === "POST" && action === "request") {
    return {
      status: 201,
      body: {
        id: 312,
        status: "REQUESTED",
        message: "Solicitud enviada correctamente. Recibirás un email de confirmación.",
      },
    };
  }
  return { status: 404, body: { detail: "Not Found" } };
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

function toParams(sp) {
  if (sp instanceof URLSearchParams) return sp;
  if (typeof sp === "string") return new URLSearchParams(sp);
  return new URLSearchParams(sp || {});
}

const ok = (body, status = 200) => ({ status, body });

/**
 * @param {string} method HTTP method
 * @param {string} pathname e.g. "/api/reservations"
 * @param {URLSearchParams|string|object} [searchParams]
 * @param {any} [body] parsed JSON request body (optional, used to echo mutations)
 * @returns {{status:number, body:any}}
 */
export function respond(method, pathname, searchParams, body) {
  const m = (method || "GET").toUpperCase();
  const sp = toParams(searchParams);
  const p = pathname.replace(/\/+$/, "");
  const store = getData();
  const { data } = store;
  const nowNaive = utcNaive(new Date());

  // ---- auth ----
  if (p === "/api/auth/me") return ok(accessContext());
  if (p === "/api/auth/signup") return ok({ success: true }, 201);
  if (p === "/api/recover-password") return ok({ success: true });
  if (p === "/api/send-contact-email") return ok({ success: true });
  if (p === "/api/stripe/session-status") return ok({ status: "complete", customer_email: OWNER.email });
  if (p === "/api/stripe/webhook") return ok({ received: true });

  // ---- reservations ----
  if (p === "/api/reservations") {
    if (m === "GET") {
      return ok([...data.reservations, ...store.extraReservations].map(strip));
    }
    if (m === "POST") {
      const b = body || {};
      const start = b.reservation_start_date ? new Date(b.reservation_start_date) : new Date();
      const r = {
        id: 1900 + store.extraReservations.length,
        customer_name: b.customer_name ?? "Cliente",
        in_charge: b.in_charge ?? CARLOS,
        reservation_start_date: b.reservation_start_date ?? wall(start),
        reservation_end_date: b.reservation_end_date ?? wall(addMin(start, 30)),
        time_per_reservation: b.time_per_reservation ?? 30,
        status: b.status ?? "PENDING",
        service: b.service ?? "Corte clásico",
        _local: start,
      };
      store.extraReservations.push(r);
      return ok(strip(r));
    }
    if (m === "PATCH") {
      const id = Number(sp.get("id"));
      const all = [...data.reservations, ...store.extraReservations];
      const r = all.find((x) => x.id === id);
      if (!r) return ok({ detail: "Reservation not found" }, 404);
      Object.assign(r, Object.fromEntries(Object.entries(body || {}).filter(([, v]) => v !== undefined && v !== null)));
      return ok(strip(r));
    }
    if (m === "DELETE") return ok({ ok: true });
  }
  {
    const mm = p.match(/^\/api\/reservations\/(\d+)\/revert$/);
    if (mm) {
      const r = [...data.reservations, ...store.extraReservations].find((x) => x.id === Number(mm[1]));
      if (!r) return ok({ detail: "Reservation not found" }, 404);
      r.status = "PENDING";
      return ok(strip(r));
    }
  }

  // ---- finances ----
  if (p === "/api/finances") {
    if (m === "GET") return ok(data.finances.map(strip));
    if (m === "POST" || m === "PATCH") {
      const b = body || {};
      const kind = b.reservation_id ? "service" : "product";
      const comm = b.type === "INCOME" ? commissionFor(b.creator, kind) : { rate: 0, amountOf: () => 0 };
      const amount = Number(b.amount ?? 0);
      return ok({
        id: m === "PATCH" ? Number(sp.get("id")) : 7000 + Math.floor(Math.random() * 1000),
        concept: b.concept ?? "Registro",
        amount,
        type: b.type ?? "INCOME",
        creator: b.creator ?? CARLOS,
        reservation_id: b.reservation_id ?? null,
        product_id: b.product_id ?? null,
        customer_name: b.customer_name ?? null,
        created_at: b.created_at ?? nowNaive,
        commission_rate: comm.rate,
        commission_amount: comm.amountOf(amount),
      });
    }
    if (m === "DELETE") return ok({ "Finances deleted": true });
  }
  {
    const mm = p.match(/^\/api\/finances\/anual\/(\d{4})$/);
    if (mm) return ok(annual(Number(mm[1])));
  }

  // ---- products ----
  if (p === "/api/products") {
    if (m === "GET") return ok(products());
    if (m === "POST" || m === "PATCH") {
      const b = body || {};
      return ok({
        id: m === "PATCH" ? Number(sp.get("id")) : 13,
        name: b.name ?? "Nuevo producto",
        price: b.price ?? 0,
        type: b.type ?? "producto",
        image_url: b.image_url ?? null,
        seller: b.seller ?? null,
      });
    }
    if (m === "DELETE") return ok({ ok: true });
  }
  if (p === "/api/products/upload-image") {
    return ok({ url: "https://example.supabase.co/storage/v1/object/public/product-images/demo.jpg" });
  }

  // ---- configuration ----
  if (p === "/api/configuration") {
    if (m === "GET") return ok(configuration());
    if (m === "POST" || m === "PATCH") {
      // Browser sends camelCase; the BFF maps it to snake_case and returns the
      // backend's snake_case row.
      const b = body || {};
      const base = configuration()[0];
      return ok({
        ...base,
        business_name: b.businessName ?? b.business_name ?? base.business_name,
        business_phone: b.businessPhone ?? b.business_phone ?? base.business_phone,
        business_email: b.businessEmail ?? b.business_email ?? base.business_email,
        commission_product: b.commissionProduct ?? b.commission_product ?? base.commission_product,
        commission_service: b.commissionService ?? b.commission_service ?? base.commission_service,
      });
    }
    if (m === "DELETE") return ok({ "Configuration deleted": true });
  }

  // ---- working hours ----
  if (p === "/api/working-hours") {
    const member = sp.get("member_user_id");
    if (m === "GET") return ok(workingHours(member));
    if (m === "PUT") {
      const blocks = Array.isArray(body) ? body : null;
      if (!blocks) return ok(workingHours(member));
      return ok(blocks.map((b, i) => ({ id: 500 + i, ...b, member_user_id: member || null })));
    }
  }

  // ---- locations ----
  if (p === "/api/locations") {
    if (m === "GET") return ok([location()]);
    if (m === "POST" || m === "PATCH") {
      return ok({ ...location(), ...(body || {}), id: m === "PATCH" ? Number(sp.get("id")) : 2 }, m === "POST" ? 201 : 200);
    }
    if (m === "DELETE") return ok({ success: true });
  }

  // ---- team (personal-management -> backend /employees) ----
  if (p === "/api/personal-management") {
    if (m === "GET") return ok(employees());
    if (m === "POST") {
      const b = body || {};
      const invited = {
        id: 4,
        businessId: OWNER.businessId,
        memberUserId: "4a6c8e0f-2b4d-4f6a-8c0e-2b4d6f8a0c2e",
        displayName: b.displayName ?? "Nuevo barbero",
        email: b.email ?? null,
        phone: b.phone ?? null,
        role: b.role ?? "employee",
        status: "pending",
        locationId: null,
        createdAt: nowNaive,
      };
      return ok({ success: true, employees: [invited, ...employees()] }, 201);
    }
    if (m === "PATCH") {
      const id = sp.get("memberUserId");
      const e = employees().find((x) => x.memberUserId === id) ?? employees()[1];
      return ok({ ...e, ...(body || {}) });
    }
    if (m === "DELETE") return ok({ success: true });
  }

  // ---- booking requests ----
  if (p === "/api/booking-requests") {
    const status = sp.get("status");
    const list = store.bookingRequests.filter((r) => !status || r.status === status);
    return ok(list);
  }
  {
    const mm = p.match(/^\/api\/booking-requests\/(\d+)\/(accept|reject)$/);
    if (mm) {
      const req = store.bookingRequests.find((r) => r.id === Number(mm[1]));
      if (!req) return ok({ detail: "Solicitud no encontrada" }, 404);
      if (mm[2] === "accept") {
        req.status = "ACCEPTED";
        req.responded_at = nowNaive;
        const svc = SVC[req.service] ?? SERVICES[0];
        const start = new Date(req.requested_date);
        const r = {
          id: 1950 + req.id,
          customer_name: req.client_name,
          in_charge: req.employee_name ?? CARLOS,
          reservation_start_date: req.requested_date,
          reservation_end_date: wall(addMin(start, svc.dur)),
          time_per_reservation: svc.dur,
          status: "PENDING",
          service: req.service,
          _local: start,
        };
        store.extraReservations.push(r);
        return ok({ status: "ACCEPTED", reservation_id: r.id, message: "Reserva confirmada y cliente notificado." });
      }
      req.status = "REJECTED";
      req.responded_at = nowNaive;
      return ok({ status: "REJECTED" });
    }
  }

  // ---- google reviews ----
  if (p === "/api/google-reviews/profile") {
    return ok(reviewsProfile(data.now), m === "POST" ? 201 : 200);
  }
  if (p === "/api/google-reviews/reviews") {
    const page = Math.max(1, Number(sp.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(sp.get("page_size") || 20)));
    const rating = Number(sp.get("rating") || 0);
    const search = (sp.get("search") || "").toLowerCase();
    const sort = sp.get("sort") || "newest";
    let items = store.reviews.filter(
      (r) => (!rating || r.review_rating === rating) && (!search || (r.review_text || "").toLowerCase().includes(search))
    );
    const sorters = {
      oldest: (a, b) => a.review_timestamp - b.review_timestamp,
      highest: (a, b) => b.review_rating - a.review_rating || b.review_timestamp - a.review_timestamp,
      lowest: (a, b) => a.review_rating - b.review_rating || b.review_timestamp - a.review_timestamp,
      newest: (a, b) => b.review_timestamp - a.review_timestamp,
    };
    items = [...items].sort(sorters[sort] || sorters.newest);
    const total = items.length;
    return ok({
      items: items.slice((page - 1) * pageSize, page * pageSize),
      total,
      page,
      page_size: pageSize,
      total_pages: total > 0 ? Math.ceil(total / pageSize) : 1,
    });
  }
  if (p === "/api/google-reviews/reviews/generate-response") {
    const id = Number(sp.get("id"));
    const r = store.reviews.find((x) => x.id === id);
    if (!r) return ok({ error: "Reseña no encontrada." }, 404);
    const first = (r.author_title || "").split(" ")[0];
    r.ai_generated_response =
      r.ai_generated_response ??
      (r.review_rating >= 4
        ? `¡Muchas gracias, ${first}! Nos alegra un montón que salieras contento. Te esperamos en ${BUSINESS.name} para la próxima. ¡Un abrazo!`
        : `Hola ${first}, gracias por tu sinceridad. Sentimos que la experiencia no fuera la que esperabas; ya lo hemos hablado con el equipo. Nos encantaría que nos dieras otra oportunidad. Un saludo, Carlos.`);
    r.ai_response_generated_at = isoZ(new Date());
    return ok({ review_id: r.id, ai_generated_response: r.ai_generated_response, ai_response_generated_at: r.ai_response_generated_at });
  }
  if (p === "/api/google-reviews/sync") {
    return ok({ new_reviews_count: 2, total_reviews: 183, last_sync_at: nowNaive });
  }
  if (p === "/api/google-reviews/summary") {
    return ok(JSON.parse(reviewsProfile(data.now).ai_summary));
  }

  // ---- intelligence ----
  if (p === "/api/intelligence/summary" || p === "/api/intelligence/summary/generate") {
    return ok(store.weekly);
  }

  // ---- public booking (no auth) ----
  if (p.startsWith("/api/public-book/")) {
    const rest = p.slice("/api/public-book/".length).split("/");
    return publicBook(m, rest, sp);
  }

  // Generic fallback: plausible success for mutations, 404 for unknown reads.
  if (m !== "GET") return ok({ success: true });
  return ok({ error: `No fixture for ${m} ${p}` }, 404);
}

/** Debug helper: summary of the generated dataset. */
export function debugSummary() {
  const { data, weekly, bookingRequests } = getData();
  const today = ymd(data.today);
  const todays = data.reservations.filter((r) => r.reservation_start_date.startsWith(today));
  return {
    today,
    splitTime: `${pad(Math.floor(data.splitMin / 60))}:${pad(data.splitMin % 60)}`,
    reservations: data.reservations.length,
    finances: data.finances.length,
    todayAgenda: {
      total: todays.length,
      completed: todays.filter((r) => r.status === "COMPLETED").length,
      pending: todays.filter((r) => r.status === "PENDING").length,
    },
    pendingRequests: bookingRequests.filter((r) => r.status === "REQUESTED").length,
    weekly: JSON.parse(weekly.kpis),
  };
}
