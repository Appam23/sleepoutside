
import jwt, { type SignOptions } from "jsonwebtoken";
import { Ajv } from "ajv";
import * as AjvFormatsModule from "ajv-formats";
import * as AjvKeywordsModule from "ajv-keywords";
import type { JSONSchema7 } from "json-schema";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

declare module "json-schema" {
  interface JSONSchema7 {
    instanceof?: string | string[];
  }
}

interface TokenUser {
  _id: string;
  email: string;
  name: string;
}

export function generateToken(user: TokenUser): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN is not configured");
  }

  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: expiresIn as SignOptions["expiresIn"] }
  );
}

export function validator(schema: JSONSchema7, data: object): void {
  const ajv = new Ajv();
  const addFormats = (
    AjvFormatsModule as unknown as {
      default: (instance: Ajv) => void;
    }
  ).default;
  const addKeywords = (
    AjvKeywordsModule as unknown as {
      default: (instance: Ajv, keyword: string) => void;
    }
  ).default;
  addFormats(ajv);
  addKeywords(ajv, "instanceof");

  const validate = ajv.compile(schema);

  if (!validate(data) && validate.errors) {
    const message = validate.errors
      .map((error) => `${error.instancePath} ${error.message}`)
      .join(", ");

    throw new EntityNotFoundError({
      message,
      statusCode: 400,
      code: "ERR_VALID",
    });
  }
}

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
