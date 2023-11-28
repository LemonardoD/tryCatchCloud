import { InferInsertModel } from "drizzle-orm";
import { int, json, text, varchar, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

export type NewErrLog = InferInsertModel<typeof errorLogs>;

export const errorLogs = mysqlTable("error_logs", {
	errLogId: varchar("log_id", { length: 255 }).notNull().primaryKey(),
	user: varchar("user_id", { length: 255 }).notNull(),
	projectId: varchar("project_id", { length: 255 }).notNull(),
	errorName: varchar("error_name", { length: 255 }).notNull(),
	errorMessage: varchar("error_msg", { length: 255 }).notNull(),
	timeStamp: timestamp("time_stamp", { mode: "date" }).defaultNow(),
	method: varchar("req_method", { length: 255 }).notNull(),
	url: varchar("req_url", { length: 255 }).notNull(),
	query: json("req_query"),
	requestBody: json("req_body"),
	error: json("err_details"),
	context: json("user_context"),
	stack: text("stack"),
});
