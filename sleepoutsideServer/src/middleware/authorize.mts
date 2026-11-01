import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

export interface AuthenticatedUser {
  _id: string;
  email: string;
  name: string;
}

export default function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = process.env.JWT_SECRET;
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!secret || !token) {
    next(
      new EntityNotFoundError({
        message: "Authorization token is required",
        statusCode: 401,
        code: "ERR_VALID",
      })
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof (decoded as JwtPayload)._id !== "string" ||
      typeof (decoded as JwtPayload).email !== "string" ||
      typeof (decoded as JwtPayload).name !== "string"
    ) {
      throw new Error("Invalid token payload");
    }

    res.locals.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
    } satisfies AuthenticatedUser;
    next();
  } catch {
    next(
      new EntityNotFoundError({
        message: "Invalid or expired authorization token",
        statusCode: 401,
        code: "ERR_VALID",
      })
    );
  }
}
