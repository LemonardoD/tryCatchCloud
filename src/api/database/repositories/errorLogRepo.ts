import { database } from "../../../configs/databaseConection";
import { eq, and, desc, gte, sql } from "drizzle-orm";
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

	allErrors = async (apiKey: string) => {
		return await this.db
			.select({
				user: errorLogs.user,
				errorLogId: errorLogs.errLogId,
				errorMethod: errorLogs.method,
				errorTag: errorLogs.url,
				errorTime: errorLogs.timeStamp,
				stack: errorLogs.stack,
				context: errorLogs.context,
			})
			.from(errorLogs)
			.where(eq(errorLogs.user, apiKey))
			.orderBy(desc(errorLogs.timeStamp));
	};

	errorById = async (apiKey: string, errId: string) => {
		return await this.db
			.select()
			.from(errorLogs)
			.where(and(eq(errorLogs.user, apiKey), eq(errorLogs.errLogId, errId)))
			.orderBy(desc(errorLogs.timeStamp));
	};
}

export default new ErrorLogRepo(database);
