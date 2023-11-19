import { database } from "../../../configs/databaseConection";
import { eq, and, desc, like, gte, sql } from "drizzle-orm";
import { NewErrLog, errorLogs } from "../schemas/errorLogSchema";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

class ErrorLogRepo {
	db;
	constructor(database: PlanetScaleDatabase<Record<string, never>>) {
		this.db = database;
	}

	addNewError = async (newErrLog: NewErrLog) => {
		return await this.db.insert(errorLogs).values(newErrLog);
	};

	allErrors = async (userId: string) => {
		return await this.db.select().from(errorLogs).where(eq(errorLogs.user, userId)).orderBy(desc(errorLogs.timeStamp));
	};

	groupedErrors = async (userId: string) => {
		const { rows } = await this.db.execute(sql`SELECT ${errorLogs.url}, COUNT(*) AS count
		FROM ${errorLogs} WHERE ${errorLogs.user} = ${userId}
		GROUP BY ${errorLogs.url};`);
		return rows;
	};

	errorsByTag = async (userId: string, tag: string) => {
		return await this.db
			.select()
			.from(errorLogs)
			.where(and(eq(errorLogs.user, userId), like(errorLogs.url, `%${tag}%`)))
			.orderBy(desc(errorLogs.timeStamp));
	};

	errorsByTaAndTime = async (userId: string, tag: string, time: Date) => {
		return await this.db
			.select()
			.from(errorLogs)
			.where(and(eq(errorLogs.user, userId), like(errorLogs.url, `%${tag}%`), gte(errorLogs.timeStamp, time)))
			.orderBy(desc(errorLogs.timeStamp));
	};

	allErrorsByTime = async (userId: string, time: Date) => {
		return await this.db
			.select()
			.from(errorLogs)
			.where(and(eq(errorLogs.user, userId), gte(errorLogs.timeStamp, time)))
			.orderBy(desc(errorLogs.timeStamp));
	};
}

export default new ErrorLogRepo(database);
