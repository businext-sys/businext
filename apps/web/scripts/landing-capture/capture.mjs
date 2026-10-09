// Captures the app's views with demo data for the landing (see README.md).
// A tiny local server stands in for Supabase auth and the backend's /auth/me, which the
// middleware calls from the Next server; everything the browser asks /api/* is answered
// here from fixtures.mjs. Nothing real is touched.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { respond, OWNER } from "./fixtures.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW ?? "playwright");

const b64url = (s) => Buffer.from(s).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 36000;
const jwt = `${b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${b64url(JSON.stringify({ sub: OWNER.id, email: OWNER.email, role: "authenticated", aud: "authenticated", exp, iat: exp - 36000 }))}.c2ln`;
const user = { id: OWNER.id, aud: "authenticated", role: "authenticated", email: OWNER.email, app_metadata: { provider: "email" }, user_metadata: {}, created_at: "2025-01-10T10:00:00Z" };
const session = { access_token: jwt, token_type: "bearer", expires_in: 36000, expires_at: exp, refresh_token: "demo-refresh", user };
const cookie = { name: "sb-127-auth-token", value: "base64-" + b64url(JSON.stringify(session)), domain: "localhost", path: "/" };

const standIn = createServer((req, res) => {
  const body = req.url.startsWith("/auth/v1/user") ? user : req.url.startsWith("/auth/me") ? respond("GET", "/api/auth/me").body : {};
  res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(body));
});
await new Promise((ok) => standIn.listen(8765, "127.0.0.1", ok));

const [,, outDir = "captures", only] = process.argv;
mkdirSync(outDir, { recursive: true });
const VIEWS = [
  { name: "agenda", path: "/reservation", scrollTo: "Reservas de hoy" },
  { name: "solicitudes", path: "/notifications", height: 560 },
  { name: "finanzas", path: "/finances", scrollTo: "Resumen del día" },
  { name: "resenas", path: "/reviews" },
  { name: "inteligencia", path: "/intelligence" },
  { name: "configuracion", path: "/configuration" },
  { name: "reserva", path: `/book/${OWNER.businessId}` },
].filter((v) => !only || only.split(",").includes(v.name));
const SIZES = { desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };

const browser = await chromium.launch();
for (const [size, opts] of Object.entries(SIZES)) {
  const ctx = await browser.newContext({ ...opts, locale: "es-ES", timezoneId: "Europe/Madrid", colorScheme: "dark" });
  await ctx.addCookies([cookie]);
  await ctx.route("**/api/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    let body; try { body = req.postDataJSON(); } catch {}
    const r = respond(req.method(), url.pathname, url.searchParams, body);
    await route.fulfill({ status: r.status, contentType: "application/json", body: JSON.stringify(r.body) });
  });
  for (const view of VIEWS) {
    const page = await ctx.newPage();
    page.on("pageerror", (e) => console.log(`[${view.name}/${size}] PAGEERROR`, e.message));
    await page.goto(`http://localhost:3000${view.path}`, { waitUntil: "networkidle", timeout: 180000 });
    // The dev build's floating indicator is not part of the product.
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    if (view.scrollTo) {
      await page.waitForTimeout(2000);
      await page.evaluate(([text, offset]) => {
        const el = [...document.querySelectorAll("h1,h2,h3,p,span")].find((e) => e.textContent.trim() === text);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - offset);
      }, [view.scrollTo, size === "mobile" ? 76 : 24]);
    }
    await page.waitForTimeout(2500);
    console.log(view.name, size, page.url());
    const clip = view.height && size === "desktop" ? { x: 0, y: 0, width: 1440, height: view.height } : undefined;
    await page.screenshot({ path: `${outDir}/${view.name}-${size}.png`, clip });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
standIn.close();
