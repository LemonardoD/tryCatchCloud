import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { database } from "../../../configs/databaseConection";
import { NewProject, projectSchema } from "../schemas/projectSchema";
import { userSchema } from "../schemas/userSchema";
import { and, desc, eq } from "drizzle-orm";

class ProjectRepo {
	db: PlanetScaleDatabase<Record<string, never>>;
	constructor(database: PlanetScaleDatabase<Record<string, never>>) {
		this.db = database;
	}

	addNewProject = async (newProject: NewProject) => {
		return await this.db.insert(projectSchema).values(newProject);
	};

	IfUserProjectExist = async (userApi: string, projectName: string) => {
		const result = await this.db
			.select({ projectId: projectSchema.projectId })
			.from(projectSchema)
			.where(and(eq(projectSchema.projectName, projectName), eq(projectSchema.userApi, userApi)));
		return result;
	};

	latestProject = async (userId: string) => {
		const result = await this.db
			.select({
				projectName: projectSchema.projectName,
			})
			.from(projectSchema)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.where(eq(projectSchema.userApi, userSchema.userApiKey))
			.orderBy(desc(projectSchema.timeStamp));
		return result;
	};

	allProjects = async (userId: string) => {
		const result = await this.db
			.select({
				projectName: projectSchema.projectName,
			})
			.from(projectSchema)
			.innerJoin(userSchema, eq(userSchema.userId, userId))
			.where(eq(projectSchema.userApi, userSchema.userApiKey));
		return result;
	};
}

export default new ProjectRepo(database);
