import { InferInsertModel } from "drizzle-orm";
import { int, varchar, mysqlTable } from "drizzle-orm/mysql-core";

export type NewUser = InferInsertModel<typeof userSchema>;

export const userSchema = mysqlTable("users", {
	userId: varchar("user_id", { length: 255 }).notNull().unique(),
	gitHubId: int("github_id").notNull(),
	userLogin: varchar("user_login", { length: 255 }).notNull(),
	userName: varchar("user_name", { length: 255 }),
	userCompany: varchar("user_company", { length: 255 }),
	userEmail: varchar("user_email", { length: 255 }),
	userToken: varchar("user_token", { length: 255 }).notNull(),
});
