import * as argon2 from "argon2";
import { UserSchema } from "../database/json-schema.js";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import type { User } from "../models/types.mts";
import userModel from "../models/user.model.mts";
import { generateToken, validator } from "./utils.mts";

type LoginResult = {
  user: User | null;
  token: string | null;
};

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  const user = await userModel.getUserByEmail(email);
  const passwordHash = user?.password ?? user?.password_hash;

  if (!user || !passwordHash || !(await argon2.verify(passwordHash, password))) {
    return { user: null, token: null };
  }

  return {
    user,
    token: generateToken({
      _id: String(user._id),
      email: user.email,
      name: user.name,
    }),
  };
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<User> {
  const now = new Date();
  const newUser: User = {
    email,
    password,
    name,
    createdAt: now,
    modifiedAt: now,
  };

  validator(UserSchema, newUser);

  const existingUser = await userModel.getUserByEmail(email);

  if (existingUser) {
    throw new EntityNotFoundError({
      message: "A user with that email already exists",
      statusCode: 409,
      code: "ERR_VALID",
    });
  }

  const userToStore: User = {
    email,
    password: await argon2.hash(password),
    name,
    createdAt: now,
    modifiedAt: now,
  };

  return userModel.createUser(userToStore);
}

export default {
  login,
  register,
};
