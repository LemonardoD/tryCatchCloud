import { InferInsertModel } from "drizzle-orm";
import { varchar, mysqlTable } from "drizzle-orm/mysql-core";

export type NewProject = InferInsertModel<typeof projectSchema>;

export const projectSchema = mysqlTable("projects", {
	projectId: varchar("project_id", { length: 255 }).notNull(),
	projectName: varchar("project_name", { length: 255 }),
	userApi: varchar("user_id", { length: 255 }).notNull(),
});
