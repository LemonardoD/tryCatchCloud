import { database } from "../../../configs/databaseConection";
import { eq, and, desc, like, gte } from "drizzle-orm";
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

	allErrorsByTag = async (userId: string, tag: string) => {
		return await this.db
			.select()
			.from(errorLogs)
			.where(and(eq(errorLogs.user, userId), like(errorLogs.tag, `%${tag}%`)))
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
