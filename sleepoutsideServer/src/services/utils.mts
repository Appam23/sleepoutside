
export function formatFields(fields: string): Record<string, 1> {
  const formattedFields: Record<string, 1> = {};

  fields.split(",").forEach((field) => {
    const fieldName = field.trim();

    if (fieldName) {
      formattedFields[fieldName] = 1;
    }
  });

  return formattedFields;
}

import type { QueryParams } from "../models/types.mts";

export function buildPaginationWrapper(
  totalCount: number,
  query: QueryParams
) {
 const limit = Number(query.limit ?? 20);
const offset = Number(query.offset ?? 0);

  const hasPreviousPage = offset > 0;
  const hasNextPage = offset + limit < totalCount;

  let next: string | null = null;
  let previous: string | null = null;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value);
    }
  });

  if (hasPreviousPage) {
    params.set("offset", Math.max(0, offset - limit).toString());
    previous = `/?${params.toString()}`;
  }

  if (hasNextPage) {
    params.set("offset", (offset + limit).toString());
    next = `/?${params.toString()}`;
  }

  return {
    count: totalCount,
    next,
    previous,
    results: [] as unknown[],
  };
}

export function sanitize(v: Record<string, any>) {
  if (typeof v === "object" && v !== null) {
    for (const key in v) {
      if (/^\$/.test(key)) {
        delete v[key];
      } else {
        sanitize(v[key]);
      }
    }
  }

  return v;
}
