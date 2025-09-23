// src/auth/dal.ts
import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { users, type NewUserRow, type UserRow } from "./schemas/user-table.js";

export async function findByUsername(app: FastifyInstance, username: string): Promise<UserRow | null> {
  const rows = await app.db.select().from(users).where(eq(users.username, username)).limit(1);
  return rows[0] ?? null;
}

export async function insertUser(app: FastifyInstance, payload: NewUserRow): Promise<UserRow> {
  const rows = await app.db.insert(users).values(payload).returning();
  if (!rows[0]) {
    throw new Error("Failed to insert user");
  }
  return rows[0];
}
