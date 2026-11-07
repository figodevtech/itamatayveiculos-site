import test from "node:test";
import assert from "node:assert/strict";
import { createFixtureState, executeFixtureQuery, INVENTORY_IDS, splitExpression } from "./support/mock-supabase.mjs";
import { homeVehicleCursorFilter, encodeHomeVehicleCursor, decodeHomeVehicleCursor } from "../lib/home-vehicle-cursor.ts";

test("fixture parses quoted PostgREST filters and nested groups", () => {
  assert.deepEqual(splitExpression('brand.eq."VW, Test",and(featured.eq.true,status.eq."Em venda")'), [
    'brand.eq."VW, Test"', 'and(featured.eq.true,status.eq."Em venda")',
  ]);
});

test("fixture paginates every eligible row across status/date ties and NULL dates", () => {
  const state = createFixtureState();
  const ids = [];
  let cursor;
  do {
    const params = new URLSearchParams({
      select: "id,featured,status,created_at", deleted: "eq.false", status: 'in.("Em venda","Em breve")',
      order: "featured.desc,status.asc,created_at.desc.nullslast,id.desc", limit: "9",
    });
    if (cursor) params.set("or", `(${homeVehicleCursorFilter(decodeHomeVehicleCursor(cursor))})`);
    const rows = executeFixtureQuery(state.vehicles, params);
    const page = rows.slice(0, 8);
    ids.push(...page.map((row) => row.id));
    const last = page.at(-1);
    cursor = rows.length > 8 ? encodeHomeVehicleCursor({
      v: 1, featured: last.featured, status: last.status, createdAt: last.created_at, id: String(last.id),
    }) : null;
  } while (cursor);
  assert.equal(ids.length, 25);
  assert.equal(new Set(ids).size, 25);
  assert.deepEqual([...ids].sort((a, b) => a - b), INVENTORY_IDS);
});

test("fixture honors projections, related filters and a three-row limit", () => {
  const rows = executeFixtureQuery(createFixtureState().vehicles, new URLSearchParams({
    select: "id,brand", id: "neq.101", deleted: "eq.false", status: 'in.("Em venda","Em breve")',
    or: '(brand.eq."Toyota",body_type.eq."SUV")', limit: "3", order: "id.desc",
  }));
  assert.equal(rows.length, 3);
  assert.ok(rows.every((row) => row.id !== 101));
  assert.deepEqual(Object.keys(rows[0]), ["id", "brand"]);
});
