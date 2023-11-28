import { database } from "../../../configs/databaseConection";
import { eq, and, desc, sql } from "drizzle-orm";
import { NewErrLog, errorLogs } from "../schemas/errorLogSchema";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { userSchema } from "../schemas/userSchema";
import { projectSchema } from "../schemas/projectSchema";

class ErrorLogRepo {
	db;
	constructor(database: PlanetScaleDatabase<Record<string, never>>) {
		this.db = database;
	}

	addNewError = async (newErrLog: NewErrLog) => {
		return await this.db.insert(errorLogs).values(newErrLog);
	};

	oneFiftyErrors = async (userId: string) => {
		const result = await this.db
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
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.where(eq(errorLogs.user, userSchema.userApiKey))
			.limit(150)
			.orderBy(desc(errorLogs.timeStamp));
		return result;
	};

	twentyErrors = async (userId: string) => {
		return await this.db
			.select({
				user: errorLogs.user,
				errorLogId: errorLogs.errLogId,
				errorMethod: errorLogs.method,
				errorTag: errorLogs.url,
				errorTime: errorLogs.timeStamp,
				stack: errorLogs.stack,
				context: errorLogs.context,
				projectName: projectSchema.projectName,
			})
			.from(errorLogs)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.innerJoin(projectSchema, eq(projectSchema.projectId, errorLogs.projectId))
			.where(eq(errorLogs.user, userSchema.userApiKey))
			.orderBy(desc(errorLogs.timeStamp));
	};

	errorsByProjectAndTag = async (userId: string, projectName: string, tag: string) => {
		return await this.db
			.select({
				user: errorLogs.user,
				errorLogId: errorLogs.errLogId,
				errorMethod: errorLogs.method,
				errorTag: errorLogs.url,
				errorTime: errorLogs.timeStamp,
				stack: errorLogs.stack,
				context: errorLogs.context,
				projectName: projectSchema.projectName,
			})
			.from(errorLogs)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.innerJoin(projectSchema, eq(projectSchema.projectName, projectName))
			.where(and(eq(errorLogs.projectId, projectSchema.projectId), eq(errorLogs.url, tag)))
			.orderBy(desc(errorLogs.timeStamp));
	};

	errorsByProject = async (userId: string, projectName: string) => {
		return await this.db
			.select({
				user: errorLogs.user,
				errorLogId: errorLogs.errLogId,
				errorMethod: errorLogs.method,
				errorTag: errorLogs.url,
				errorTime: errorLogs.timeStamp,
				stack: errorLogs.stack,
				context: errorLogs.context,
				projectName: projectSchema.projectName,
			})
			.from(errorLogs)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.innerJoin(projectSchema, eq(projectSchema.projectName, projectName))
			.where(eq(errorLogs.projectId, projectSchema.projectId))
			.orderBy(desc(errorLogs.timeStamp));
	};

	errorById = async (userId: string, errId: string) => {
		return await this.db
			.select({
				errorMessage: errorLogs.errorMessage,
				method: errorLogs.method,
				url: errorLogs.url,
				query: errorLogs.query,
				requestBody: errorLogs.requestBody,
				error: errorLogs.error,
				context: errorLogs.context,
				stack: errorLogs.stack,
			})
			.from(errorLogs)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.where(and(eq(errorLogs.user, userSchema.userApiKey), eq(errorLogs.errLogId, errId)))
			.orderBy(desc(errorLogs.timeStamp));
	};

	groupedErrors = async (userId: string) => {
		const { rows } = await this.db.execute(sql`
		SELECT ${errorLogs.url}, ${projectSchema.projectName}, COUNT(*) AS count
		FROM ${errorLogs}
		INNER JOIN ${projectSchema} ON ${errorLogs.projectId} = ${projectSchema.projectId}
		INNER JOIN ${userSchema} ON ${userSchema.userId} = ${userId}
		WHERE ${errorLogs.user} = ${userSchema.userApiKey}
		GROUP BY${projectSchema.projectName}, ${errorLogs.url};`);
		return rows;
	};
}

export default new ErrorLogRepo(database);
