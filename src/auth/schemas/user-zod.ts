// src/db/schema/users.zod.ts
import { z } from "zod";
import { users } from "./user-table.js";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const BaseUserInsert = createInsertSchema(users);
const BaseUserSelect = createSelectSchema(users);

export const UserPublic = BaseUserSelect
  .omit({ passwordHash: true }) // hide sensitive/noise
  .extend({ createdAt: z.coerce.date() });

export type UserPublicDTO = z.infer<typeof UserPublic>;

export const SignupInput = z.object({
  username: z.string().min(3).max(50).trim().toLowerCase()
    .regex(/^[a-z0-9._-]+$/, "username can contain a-z, 0-9, dot, underscore, hyphen"),
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
});
export type SignupInputDTO = z.infer<typeof SignupInput>;

export const UserInsert = BaseUserInsert
  .omit({ createdAt: true })
  .extend({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    passwordHash: z.string().min(20),
    name: z.string().min(1).max(100),
  });

export const UserPublicResponse = UserPublic;

export const LoginInput = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginInputDto = z.infer<typeof LoginInput>;

export const statusCodeOk = z.string();
