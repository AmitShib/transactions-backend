import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    username: text("username").primaryKey(),
    passwordHash: text("password_hash").notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
    uniqEmail: uniqueIndex("uniq_users_email").on(t.email),
}));

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;