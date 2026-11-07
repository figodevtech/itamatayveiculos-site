import assert from "node:assert/strict";
import { test } from "node:test";
import {
  decodeHomeVehicleCursor,
  encodeHomeVehicleCursor,
  homeVehicleCursorFilter,
  InvalidHomeVehicleCursorError,
  quotePostgrestValue,
} from "../lib/home-vehicle-cursor.ts";

const cursor = {
  v: 1,
  featured: true,
  status: "Em breve",
  createdAt: "2026-03-01T12:00:00.123456+00:00",
  id: "42",
};

test("cursor preserves timestamp microseconds and supports rows without a date", () => {
  assert.deepEqual(decodeHomeVehicleCursor(encodeHomeVehicleCursor(cursor)), cursor);
  assert.deepEqual(
    decodeHomeVehicleCursor(encodeHomeVehicleCursor({ ...cursor, createdAt: null })),
    { ...cursor, createdAt: null },
  );
  assert.equal(decodeHomeVehicleCursor(), null);
});

test("invalid cursors are rejected before they can become PostgREST filters", () => {
  const encoded = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const invalid = [
    "", "not-valid-json", "abc=", "a".repeat(513), encoded(null), encoded([]),
    encoded({ ...cursor, v: 2 }), encoded({ ...cursor, featured: "true" }),
    encoded({ ...cursor, status: "Vendido" }), encoded({ ...cursor, id: "1),deleted.eq.true" }),
    encoded({ ...cursor, id: "-1" }), encoded({ ...cursor, id: "9223372036854775808" }),
    encoded({ ...cursor, createdAt: "2026-02-30T00:00:00Z" }),
    encoded({ ...cursor, createdAt: "2026-03-01T00:00:00Z),deleted.eq.true" }),
  ];
  for (const value of invalid) {
    assert.throws(() => decodeHomeVehicleCursor(value), InvalidHomeVehicleCursorError);
  }
});

function splitExpressions(value) {
  let depth = 0;
  let quoted = false;
  let start = 0;
  const values = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '"' && value[i - 1] !== "\\") quoted = !quoted;
    if (quoted) continue;
    if (value[i] === "(") depth++;
    if (value[i] === ")") depth--;
    if (value[i] === "," && depth === 0) {
      values.push(value.slice(start, i));
      start = i + 1;
    }
  }
  values.push(value.slice(start));
  return values;
}

function matchesExpression(expression, row) {
  if (expression.startsWith("and(")) {
    return splitExpressions(expression.slice(4, -1)).every((part) => matchesExpression(part, row));
  }
  const [, field, operator, raw] = /^(\w+)\.(\w+)\.(.+)$/.exec(expression);
  const actual = field === "created_at" ? row.createdAt : row[field];
  const value = raw.startsWith('"') ? JSON.parse(raw)
    : raw === "true" ? true : raw === "false" ? false : raw === "null" ? null : raw;
  if (operator === "is") return actual === value;
  if (actual === null) return false;
  if (operator === "eq") return actual === value;
  const comparison = field === "id"
    ? BigInt(actual) < BigInt(value) ? -1 : BigInt(actual) > BigInt(value) ? 1 : 0
    : actual < value ? -1 : actual > value ? 1 : 0;
  return operator === "lt" ? comparison < 0 : comparison > 0;
}

test("keyset filter returns exactly the remaining inventory across all ordering boundaries", () => {
  const rows = [];
  let id = 1;
  for (const featured of [true, false]) {
    for (const status of ["Em breve", "Em venda"]) {
      for (const createdAt of [
        "2026-03-01T12:00:00.123456+00:00",
        "2026-03-01T12:00:00.123455+00:00",
        null,
      ]) {
        for (let tie = 0; tie < 2; tie++) rows.push({ v: 1, featured, status, createdAt, id: String(id++) });
      }
    }
  }
  // This comparator defines the product ordering independently of the filter grammar.
  rows.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.status !== b.status) return a.status < b.status ? -1 : 1;
    if (a.createdAt !== b.createdAt) {
      if (a.createdAt === null) return 1;
      if (b.createdAt === null) return -1;
      return a.createdAt > b.createdAt ? -1 : 1;
    }
    return Number(BigInt(b.id) - BigInt(a.id));
  });

  rows.forEach((position, index) => {
    const clauses = splitExpressions(homeVehicleCursorFilter(position));
    const matches = rows.filter((row) => clauses.some((part) => matchesExpression(part, row)));
    assert.deepEqual(matches.map((row) => row.id), rows.slice(index + 1).map((row) => row.id));
  });
});

test("PostgREST literals keep commas, quotes and backslashes inside one value", () => {
  const brand = 'Marca, "especial" \\ teste';
  assert.equal(JSON.parse(quotePostgrestValue(brand)), brand);
});
