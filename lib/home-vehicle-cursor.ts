import { Buffer } from "node:buffer";

export const HOME_VEHICLES_PAGE_SIZE = 8;

export interface HomeVehicleCursor {
  v: 1;
  featured: boolean;
  status: "Em venda" | "Em breve";
  createdAt: string | null;
  id: string;
}

export class InvalidHomeVehicleCursorError extends Error {
  readonly status = 400;

  constructor() {
    super("Cursor de veículos inválido.");
    this.name = "InvalidHomeVehicleCursorError";
  }
}

function isTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.exec(value);
  if (!match || !Number.isFinite(Date.parse(value))) return false;

  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() + 1 === Number(month)
    && date.getUTCDate() === Number(day);
}

export function encodeHomeVehicleCursor(cursor: HomeVehicleCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeHomeVehicleCursor(value?: string): HomeVehicleCursor | null {
  if (value === undefined) return null;

  try {
    if (!value || value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) {
      throw new InvalidHomeVehicleCursorError();
    }

    const decoded = Buffer.from(value, "base64url");
    if (decoded.toString("base64url") !== value) throw new InvalidHomeVehicleCursorError();

    const cursor: unknown = JSON.parse(decoded.toString("utf8"));
    if (typeof cursor !== "object" || cursor === null || Array.isArray(cursor)) {
      throw new InvalidHomeVehicleCursorError();
    }

    const row = cursor as Record<string, unknown>;
    if (
      row.v !== 1
      || typeof row.featured !== "boolean"
      || (row.status !== "Em venda" && row.status !== "Em breve")
      || (row.createdAt !== null && !isTimestamp(row.createdAt))
      || typeof row.id !== "string"
      || !/^[1-9]\d{0,18}$/.test(row.id)
      || BigInt(row.id) > BigInt("9223372036854775807")
    ) {
      throw new InvalidHomeVehicleCursorError();
    }

    return {
      v: 1,
      featured: row.featured,
      status: row.status,
      createdAt: row.createdAt,
      id: row.id,
    };
  } catch {
    throw new InvalidHomeVehicleCursorError();
  }
}

export function quotePostgrestValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Mirrors featured DESC, status ASC, created_at DESC NULLS LAST, id DESC. */
export function homeVehicleCursorFilter(cursor: HomeVehicleCursor): string {
  const featured = `featured.eq.${cursor.featured}`;
  const status = `status.eq.${quotePostgrestValue(cursor.status)}`;
  const clauses = cursor.featured ? ["featured.eq.false"] : [];

  clauses.push(`and(${featured},status.gt.${quotePostgrestValue(cursor.status)})`);

  if (cursor.createdAt === null) {
    clauses.push(`and(${featured},${status},created_at.is.null,id.lt.${cursor.id})`);
  } else {
    const createdAt = quotePostgrestValue(cursor.createdAt);
    clauses.push(
      `and(${featured},${status},created_at.lt.${createdAt})`,
      `and(${featured},${status},created_at.is.null)`,
      `and(${featured},${status},created_at.eq.${createdAt},id.lt.${cursor.id})`,
    );
  }

  return clauses.join(",");
}
