import type { Collection } from "mongodb";
import mongodb from "../database/index.mts";
import type { User } from "./types.mts";

async function getUserByEmail(email: string): Promise<User | null> {
  const usersCollection: Collection<User> =
    mongodb.getDb().collection<User>("users");

  return usersCollection.findOne({ email });
}

async function createUser(user: User): Promise<User> {
  const usersCollection: Collection<User> =
    mongodb.getDb().collection<User>("users");
  const result = await usersCollection.insertOne(user);

  return {
    ...user,
    _id: result.insertedId.toString(),
  };
}

export default {
  getUserByEmail,
  createUser,
};
