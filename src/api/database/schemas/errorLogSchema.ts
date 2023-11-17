import { InferInsertModel } from "drizzle-orm";
import { int, varchar, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

export type NewErrLog = InferInsertModel<typeof errorLogs>;

export const errorLogs = mysqlTable("error_logs", {
	errLogId: int("log_id").notNull().primaryKey().autoincrement(),
	user: varchar("user_id", { length: 255 }).notNull(),
	errorName: varchar("error_tag", { length: 255 }).notNull(),
	message: varchar("error_message", { length: 255 }).notNull(),
	timeStamp: timestamp("time_stamp", { mode: "date" }).defaultNow(),
	file: varchar("where_ocurred", { length: 255 }),
	tag: varchar("req_tag", { length: 255 }),
});
