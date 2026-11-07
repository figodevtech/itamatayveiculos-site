import { test, expect } from "@playwright/test";
import { INVENTORY_IDS } from "../support/mock-supabase.mjs";

const fixtureURL = process.env.MOCK_SUPABASE_URL ?? "http://127.0.0.1:4100";
const publicationSecret = process.env.SITE_REVALIDATE_SECRET ?? "test-publication-secret-at-least-32-chars";
const cards = (page) => page.locator('main a[href^="/veiculos/"]').filter({ has: page.locator("article") });
let eventSequence = 0;

async function publish(request, vehicleIds = INVENTORY_IDS) {
  const response = await request.post("/api/revalidate", {
    headers: { authorization: `Bearer ${publicationSecret}` },
    data: { eventId: `browser-test:${Date.now()}:${eventSequence++}`, topics: ["vehicles", "shorts", "banners", "settings"], vehicleIds },
  });
  expect(response.status(), await response.text()).toBe(200);
  return response;
}

async function fixture(request, path, data) {
  const response = await request.post(`${fixtureURL}/__test/${path}`, { data });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function events(request) {
  return (await request.get(`${fixtureURL}/__test/events`)).json();
}

async function cardIds(page) {
  return cards(page).evaluateAll((elements) => elements.map((element) => Number(element.getAttribute("href").split("/").at(-1))));
}

test.beforeEach(async ({ request, page }) => {
  await fixture(request, "reset", {});
  await publish(request);
  // External brand logos and analytics are irrelevant to the local fixture.
  await page.route("**/www.carlogos.org/**", (route) => route.abort());
  await page.route("**/_next/image?*", (route) => route.request().url().includes("carlogos.org") ? route.abort() : route.continue());
  await page.route("**/va.vercel-scripts.com/**", (route) => route.abort());
});

test("home renders eight SSR cards, visible content and optimized images", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  const initialLinks = [...html.matchAll(/href="\/veiculos\/(\d+)"/g)].map((match) => match[1]);
  expect(new Set(initialLinks).size).toBe(8);
  expect(html).not.toContain('href="/veiculos/201"');
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Encontre seu próximo veículo" })).toBeVisible();
  await expect(page.locator("header").first()).toBeVisible();
  await expect(cards(page)).toHaveCount(8);
  const firstImage = cards(page).first().locator("img");
  await expect(firstImage).toHaveAttribute("src", /\/_next\/image\?/);
  await expect(firstImage).toHaveAttribute("sizes", /639px/);
  const logo = page.locator('header img[alt="Itamatay Veículos"]').first();
  await expect(logo).toHaveAttribute("src", /itamatay-logo-small/);
  const dataRequests = await events(request);
  const homeRead = dataRequests.find((event) => event.table === "vehicles" && event.query.limit === "9");
  expect(homeRead).toBeTruthy();
  expect(homeRead.query.select).not.toContain("description");
  expect(homeRead.query.select).not.toContain("vehicle_images");
});

test("home paginates all 25 eligible vehicles once and recovers from a failed page", async ({ page }) => {
  let failed = false;
  await page.route("**/api/vehicles/home?**", async (route) => {
    if (!failed) { failed = true; await route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"temporary test outage"}' }); }
    else await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(cards(page)).toHaveCount(8);
  await page.getByRole("button", { name: "Carregar mais veículos" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
  expect(await cardIds(page)).toHaveLength(8);
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect.poll(() => cards(page).count()).toBeGreaterThanOrEqual(16);
  for (const count of [24, 25]) {
    if (await cards(page).count() >= count) continue;
    await page.getByRole("button", { name: /Carregar mais veículos|Carregando veículos/ }).scrollIntoViewIfNeeded({ timeout: 1500 }).catch(async (error) => {
      if (await cards(page).count() < count) throw error;
    });
    await expect.poll(() => cards(page).count()).toBeGreaterThanOrEqual(count);
  }
  const ids = await cardIds(page);
  expect(new Set(ids).size).toBe(25);
  expect([...ids].sort((a, b) => a - b)).toEqual(INVENTORY_IDS);
  await expect(page.getByRole("button", { name: "Carregar mais veículos" })).toHaveCount(0);
});

test("card gives immediate navigation feedback and main detail precedes optional reads", async ({ page, request }, testInfo) => {
  await fixture(request, "state", { options: { detailDelayMs: 900, relatedDelayMs: 3000, shortsDelayMs: 3000 } });
  await publish(request);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const target = cards(page).first();
  const id = Number((await target.getAttribute("href")).split("/").at(-1));
  const baselineEvents = await events(request);
  await page.evaluate(() => {
    window.__navigationTimings = {};
    document.addEventListener("click", () => {
      window.__navigationTimings.clickedAt = performance.now();
      const observer = new MutationObserver(() => {
        if ([...document.querySelectorAll('[role="status"]')].some((element) => /Abrindo veículo|Carregando veículo/.test(element.textContent))) {
          window.__navigationTimings.feedbackMs = performance.now() - window.__navigationTimings.clickedAt;
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }, { capture: true, once: true });
  });
  const started = Date.now();
  await target.click({ noWaitAfter: true });
  await expect(page.getByText(/Abrindo veículo|Carregando veículo/).first()).toBeVisible({ timeout: 700 });
  const feedbackMs = await page.evaluate(() => window.__navigationTimings.feedbackMs);
  await testInfo.attach("navigation-feedback", { body: JSON.stringify({ feedbackMs, targetMs: 100 }), contentType: "application/json" });
  expect(feedbackMs, "click-to-feedback should meet the 100ms target").toBeLessThanOrEqual(100);
  await expect(page.getByRole("heading", { level: 1 }).filter({ hasText: `Fixture ${id}` })).toBeVisible({ timeout: 2400 });
  const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
  const expectedPrice = state.vehicles.find((vehicle) => vehicle.id === id).price.toLocaleString("pt-BR");
  await expect(page.locator("p.text-accent:visible").filter({ hasText: new RegExp(`R\\$\\s*${expectedPrice.replaceAll(".", "\\.")}`) }).first()).toBeVisible();
  expect(Date.now() - started).toBeLessThan(2800);
  await expect(page.getByText("Veículos similares")).not.toBeVisible();
  await expect(page.getByText("Veículos similares")).toBeVisible({ timeout: 6000 });
  const newEvents = (await events(request)).filter((event) => event.sequence > baselineEvents.length);
  // A prefetch and a navigation are separate renders and can overlap. Check
  // metadata/page request deduplication with one otherwise untouched document.
  const beforeDocument = (await events(request)).length;
  await request.get("/veiculos/124");
  const documentEvents = (await events(request)).filter((event) => event.sequence > beforeDocument);
  expect(documentEvents.filter((event) => event.table === "vehicles" && event.query.id === "eq.124")).toHaveLength(1);
  const related = newEvents.find((event) => event.table === "vehicles" && event.query.id === `neq.${id}`);
  expect(related?.query.limit).toBe("3");
  expect(related?.query.select).not.toContain("description");
  const shorts = newEvents.find((event) => event.table === "vehicle_videos");
  expect(shorts?.query.select).toBe("id");
});

test("gallery uses optimized responsive image requests and keyboard navigation", async ({ page }) => {
  const originalRequests = [];
  page.on("request", (request) => { if (/\/images\/showcase\//.test(request.url()) && !request.url().includes("/_next/image?")) originalRequests.push(request.url()); });
  await page.goto("/veiculos/101", { waitUntil: "domcontentloaded" });
  const gallery = page.getByRole("group", { name: "Galeria de fotos do veículo" });
  const first = gallery.locator("img").first();
  await expect(first).toHaveAttribute("src", /\/_next\/image\?/);
  await expect(first).toHaveAttribute("sizes", /888px/);
  await expect.poll(() => first.evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator('img[alt$="Foto 2"]')).toBeVisible();
  expect(originalRequests).toEqual([]);
});

test("filters retain URL behavior, two mobile columns and browser-back scroll", async ({ page }) => {
  await page.goto("/veiculos?marca=Toyota&sortBy=price-desc", { waitUntil: "domcontentloaded" });
  await expect(cards(page)).toHaveCount(13);
  const prices = await cards(page).locator("p.text-accent").allTextContents();
  expect(prices[0]).toContain("128.000");
  const target = cards(page).nth(8);
  await target.scrollIntoViewIfNeeded();
  const beforeScroll = await page.evaluate(() => window.scrollY);
  const href = await target.getAttribute("href");
  await target.click();
  await expect(page).toHaveURL(new RegExp(href + "$"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/marca=Toyota&sortBy=price-desc/);
  await expect(cards(page)).toHaveCount(13);
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - beforeScroll)).toBeLessThan(180);
  const firstBoxes = await Promise.all([cards(page).nth(0).boundingBox(), cards(page).nth(1).boundingBox()]);
  expect(Math.abs(firstBoxes[0].y - firstBoxes[1].y)).toBeLessThan(3);
});

test("cursor API rejects malformed cursors before querying data", async ({ request }) => {
  const before = (await events(request)).length;
  for (const cursor of ["invalid!", "", Buffer.from('{"v":999}').toString("base64url")]) {
    const response = await request.get(`/api/vehicles/home?cursor=${encodeURIComponent(cursor)}`);
    expect(response.status()).toBe(400);
  }
  expect((await events(request)).length).toBe(before);
});

test("publication authenticates, validates and exposes updated prices after ACK", async ({ request, page }) => {
  expect((await request.post("/api/revalidate", { data: {} })).status()).toBe(401);
  expect((await request.post("/api/revalidate", { headers: { authorization: `Bearer ${publicationSecret}` }, data: { topics: ["vehicles"], vehicleIds: [] } })).status()).toBe(400);
  await page.goto("/veiculos?marca=Toyota", { waitUntil: "domcontentloaded" });
  const target = page.locator('a[href="/veiculos/101"]').filter({ has: page.locator("article") });
  await expect(target).toContainText("80.000");
  // Warm the route, then mutate only the in-memory test backend.
  await target.hover();
  await request.get("/veiculos/101");
  await fixture(request, "state", { vehicles: { 101: { price: 199999 } } });
  const ack = await publish(request, [101]);
  expect((await ack.json()).revalidated).toBe(true);
  await target.click();
  await expect(page.getByRole("heading", { level: 1 }).filter({ hasText: "Fixture 101" })).toBeVisible();
  await expect(page.locator("p.text-accent:visible").filter({ hasText: /R\$\s*199\.999/ }).first()).toBeVisible();
  await page.goBack();
  await expect(page.locator('a[href="/veiculos/101"]').filter({ has: page.locator("article") })).toContainText("199.999");
});

test("missing and deleted vehicles return a not-found page", async ({ request }) => {
  for (const id of [999999, 205]) {
    const response = await request.get(`/veiculos/${id}`);
    // Streaming can commit a 200 shell before notFound; the robots marker is the fallback contract.
    expect(response.status() === 404 || (await response.text()).includes('content="noindex"')).toBeTruthy();
  }
});

test("unavailable banners and settings preserve the header, search and eight cards", async ({ page, request }) => {
  await fixture(request, "state", { options: { failTables: ["banners", "app_settings"] } });
  await publish(request);
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("header").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Encontre seu próximo veículo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buscar", exact: true })).toBeVisible();
  await expect(cards(page)).toHaveCount(8);
  expect(await response.text()).not.toContain("PRIVATE_FIXTURE_UPSTREAM_DIAGNOSTICS");
  const failedReads = (await events(request)).filter((event) => event.status === 503);
  expect(new Set(failedReads.map((event) => event.table))).toEqual(new Set(["banners", "app_settings"]));
});

test("unavailable inventory shows a local error and retry without breaking the home", async ({ page, request }) => {
  await fixture(request, "state", { options: { failTables: ["vehicles"] } });
  await publish(request);
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("header").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Encontre seu próximo veículo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buscar", exact: true })).toBeVisible();
  await expect(page.getByText("Não foi possível carregar os veículos neste momento.", { exact: true })).toBeVisible();
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByText("Ver ofertas", { exact: true })).toHaveCount(4);
  expect(await response.text()).not.toContain("PRIVATE_FIXTURE_UPSTREAM_DIAGNOSTICS");
  await fixture(request, "state", { options: { failTables: [] } });
  await publish(request);
  await page.getByRole("button", { name: "Tentar novamente", exact: true }).click();
  await expect(cards(page)).toHaveCount(8);
});
