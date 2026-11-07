import { createServer } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { pathToFileURL } from "node:url";

export const FIXTURE_PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 4100);
export const INVENTORY_IDS = Array.from({ length: 25 }, (_, index) => 101 + index);

function vehicle(id, index, overrides = {}) {
  const image = "/images/showcase/repasses-itamatay-v3.webp";
  return {
    id, brand: index % 2 ? "Honda" : "Toyota", model: `Fixture ${id}`, version: "Teste 1.0",
    year: 2020 + index % 6, year_model: 2021 + index % 6, price: 80000 + index * 2000,
    fipe: 150000, mileage: index * 1200, fuel: index % 2 ? "Gasolina" : "Flex",
    transmission: "Automático", color: "Prata", doors: 4,
    body_type: index % 3 ? "Sedan" : "SUV", image, city: "João Pessoa", state: "PB",
    seller: "Itamatay", seller_type: "dealership", features: ["Ar condicionado", "ABS"],
    description: `Descrição pública do veículo de teste ${id}.`, enable_ai_description: false,
    ai_description: null, engine_size: "1.0", horsepower: 120, is_new: index === 0,
    featured: index < 7, status: index % 5 === 0 ? "Em breve" : "Em venda", deleted: false,
    // Deliberate date ties and NULL values exercise the complete keyset order.
    created_at: index >= 23 ? null : new Date(Date.UTC(2026, 9, 30 - Math.floor(index / 3))).toISOString(),
    vehicle_images: [
      { id: `image-${id}-1`, vehicle_id: id, image_url: image, sort_order: 0, active: true, width: 1024, height: 768 },
      { id: `image-${id}-2`, vehicle_id: id, image_url: "/images/showcase/garantia-itamatay-v3.webp", sort_order: 1, active: true, width: 1024, height: 768 },
      { id: `image-${id}-3`, vehicle_id: id, image_url: "/images/showcase/seguro-itamatay-v3.webp", sort_order: 2, active: true, width: 1024, height: 768 },
      { id: `image-${id}-inactive`, vehicle_id: id, image_url: "/not-a-real-image.webp", sort_order: 3, active: false },
    ],
    ...overrides,
  };
}

export function createFixtureState(options = {}) {
  return {
    vehicles: [
      ...INVENTORY_IDS.map((id, index) => vehicle(id, index)),
      vehicle(201, 26, { status: "Repasse" }),
      vehicle(202, 27, { status: "Repasse" }),
      vehicle(203, 28, { status: "Vendido" }),
      vehicle(204, 29, { status: "Rascunho" }),
      vehicle(205, 30, { deleted: true }),
    ],
    app_settings: [{ banner_interval: 60, banner_duration: 0.2, primary_color: "#1a2744", secondary_color: "#f1f3f7" }],
    banners: [{ id: "banner-1", name: "Destaque de teste", link: null, order: 1, image_url: "/images/showcase/repasses-itamatay-v3.webp", active: true }],
    vehicle_videos: [{ id: "short-101", vehicle_id: 101, url: "https://example.invalid/test.mp4", type: "shorts", created_at: "2026-10-01T00:00:00.000Z" }],
    options: { relatedDelayMs: 0, shortsDelayMs: 0, detailDelayMs: 0, failTables: [], ...options },
  };
}

/** Split a PostgREST expression without breaking quoted values or nested AND/OR. */
export function splitExpression(expression) {
  const result = [];
  let depth = 0, quoted = false, escaped = false, start = 0;
  for (let index = 0; index < expression.length; index++) {
    const character = expression[index];
    if (escaped) { escaped = false; continue; }
    if (character === "\\" && quoted) { escaped = true; continue; }
    if (character === '"') quoted = !quoted;
    if (quoted) continue;
    if (character === "(") depth++;
    if (character === ")") depth--;
    if (character === "," && depth === 0) {
      result.push(expression.slice(start, index));
      start = index + 1;
    }
  }
  result.push(expression.slice(start));
  return result.filter(Boolean);
}

function parseValue(value) {
  if (value.startsWith('"')) return JSON.parse(value);
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  return value;
}

function fieldValue(row, field) {
  return field.split(".").reduce((value, part) => value?.[part], row);
}

function compare(actual, expected) {
  if (typeof actual === "number") return actual - Number(expected);
  if (typeof actual === "boolean") return Number(actual) - Number(expected === true || expected === "true");
  return actual < expected ? -1 : actual > expected ? 1 : 0;
}

export function matchesExpression(row, expression) {
  if (expression.startsWith("and(") || expression.startsWith("or(")) {
    const isAnd = expression.startsWith("and(");
    const inner = expression.slice(isAnd ? 4 : 3, -1);
    const values = splitExpression(inner).map((part) => matchesExpression(row, part));
    return isAnd ? values.every(Boolean) : values.some(Boolean);
  }
  const match = /^(.+?)\.(eq|neq|lt|lte|gt|gte|is|in)\.(.*)$/.exec(expression);
  if (!match) throw new Error(`Unsupported fixture filter: ${expression}`);
  const [, field, operator, rawValue] = match;
  const actual = fieldValue(row, field);
  if (operator === "in") return splitExpression(rawValue.slice(1, -1)).some((value) => compare(actual, parseValue(value)) === 0);
  const expected = parseValue(rawValue);
  if (operator === "is") return expected === null ? actual == null : actual === expected;
  if (actual == null) return false;
  const result = compare(actual, expected);
  return operator === "eq" ? result === 0 : operator === "neq" ? result !== 0
    : operator === "lt" ? result < 0 : operator === "lte" ? result <= 0
      : operator === "gt" ? result > 0 : result >= 0;
}

function project(row, selection) {
  if (!selection || selection === "*") return row;
  return Object.fromEntries(splitExpression(selection).map((column) => {
    const nested = /^([^(:]+)(?:\([^]*\))$/.exec(column);
    if (nested) return [nested[1], row[nested[1]]];
    if (column.startsWith("vehicle:vehicles!inner(")) return ["vehicle", row.vehicle];
    return [column, row[column]];
  }));
}

export function executeFixtureQuery(rows, params) {
  let result = rows.filter((row) => [...params].every(([key, value]) => {
    if (["select", "order", "limit", "offset"].includes(key)) return true;
    if (key === "or" || key === "and") return matchesExpression(row, `${key}${value}`);
    return matchesExpression(row, `${key}.${value}`);
  }));
  const order = params.get("order");
  if (order) result = [...result].sort((left, right) => {
    for (const clause of order.split(",")) {
      const [column, direction, nullPlacement] = clause.split(".");
      const a = left[column], b = right[column];
      if (a == null && b == null) continue;
      if (a == null) return nullPlacement === "nullsfirst" ? -1 : 1;
      if (b == null) return nullPlacement === "nullsfirst" ? 1 : -1;
      const difference = compare(a, b);
      if (difference) return direction === "desc" ? -difference : difference;
    }
    return 0;
  });
  const offset = Number(params.get("offset") ?? 0);
  result = result.slice(offset, params.has("limit") ? offset + Number(params.get("limit")) : undefined);
  return result.map((row) => project(row, params.get("select")));
}

export function createMockSupabase() {
  let state = createFixtureState();
  let events = [];
  const json = (response, status, body) => {
    response.writeHead(status, { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*" });
    response.end(JSON.stringify(body));
  };
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://127.0.0.1:${FIXTURE_PORT}`);
      let body = "";
      for await (const chunk of request) body += chunk;
      const payload = body ? JSON.parse(body) : {};
      if (url.pathname === "/__test/reset" && request.method === "POST") {
        state = createFixtureState(payload);
        events = [];
        return json(response, 200, { reset: true });
      }
      if (url.pathname === "/__test/state") {
        if (request.method === "POST") {
          Object.assign(state.options, payload.options ?? {});
          for (const [id, patch] of Object.entries(payload.vehicles ?? {})) {
            Object.assign(state.vehicles.find((row) => String(row.id) === id) ?? {}, patch);
          }
        }
        return json(response, 200, state);
      }
      if (url.pathname === "/__test/events") {
        if (request.method === "DELETE") events = [];
        return json(response, 200, events);
      }
      if (url.pathname === "/health") return json(response, 200, { ok: true, fixture: true });
      if (!url.pathname.startsWith("/rest/v1/")) return json(response, 404, { error: "Fixture route not found" });
      const table = url.pathname.slice("/rest/v1/".length);
      let rows = state[table];
      if (!Array.isArray(rows)) return json(response, 404, { message: `Unknown fixture table: ${table}` });
      if (table === "vehicle_videos") rows = rows.map((row) => ({ ...row, vehicle: state.vehicles.find((vehicle) => vehicle.id === row.vehicle_id) }));
      const isDetail = table === "vehicles" && url.searchParams.get("id")?.startsWith("eq.");
      const isRelated = table === "vehicles" && url.searchParams.get("id")?.startsWith("neq.");
      const delayMs = table === "vehicle_videos" ? state.options.shortsDelayMs : isDetail ? state.options.detailDelayMs : isRelated ? state.options.relatedDelayMs : 0;
      const event = { sequence: events.length + 1, table, query: Object.fromEntries(url.searchParams), startedAt: Date.now(), completedAt: null, rowCount: null, delayMs };
      events.push(event);
      if (state.options.failTables.includes(table)) {
        event.status = 503;
        event.rowCount = 0;
        event.completedAt = Date.now();
        return json(response, 503, { code: "TEST_FAILURE", message: "PRIVATE_FIXTURE_UPSTREAM_DIAGNOSTICS" });
      }
      if (delayMs) await sleep(delayMs);
      const data = executeFixtureQuery(rows, url.searchParams);
      event.rowCount = data.length;
      event.completedAt = Date.now();
      const single = request.headers.accept?.includes("application/vnd.pgrst.object+json");
      if (single && data.length !== 1) return json(response, 406, { code: "PGRST116", details: "The result contains 0 rows", message: "Cannot coerce the result to a single JSON object" });
      return json(response, 200, single ? data[0] : data);
    } catch (error) {
      return json(response, 500, { message: error.message, fixture: true });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createMockSupabase().listen(FIXTURE_PORT, "127.0.0.1", () => {
    process.stdout.write(`Mock Supabase listening at http://127.0.0.1:${FIXTURE_PORT} (local test data only)\n`);
  });
}
