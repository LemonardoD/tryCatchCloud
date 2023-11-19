import { InferInsertModel } from "drizzle-orm";
import { json, text, int, varchar, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

export type NewErrLog = InferInsertModel<typeof errorLogs>;

export const errorLogs = mysqlTable("error_logs", {
	errLogId: varchar("log_id", { length: 255 }).notNull().primaryKey(),
	user: varchar("user_id", { length: 255 }).notNull(),
	errorName: varchar("error_tag", { length: 255 }).notNull(),
	errorMessage: varchar("error_msg", { length: 255 }).notNull(),
	timeStamp: timestamp("time_stamp", { mode: "date" }).defaultNow(),
	method: varchar("req_method", { length: 255 }),
	url: varchar("req_url", { length: 255 }),
	query: json("req_query"),
	params: json("req_params"),
	requestBody: json("req_body"),
	statusCode: int("statusCode"),
	responseBody: text("responseBody"),
	stack: text("stack"),
});
