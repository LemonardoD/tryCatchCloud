import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { database } from "../../../configs/databaseConection";
import { userSchema, NewUser } from "../schemas/userSchema";
import { eq } from "drizzle-orm";

class UserRepo {
	db: PlanetScaleDatabase<Record<string, never>>;
	constructor(database: PlanetScaleDatabase<Record<string, never>>) {
		this.db = database;
	}

	addNewUser = async (newErrLog: NewUser) => {
		return await this.db.insert(userSchema).values(newErrLog);
	};

	IfUserExist = async (gitHubId: number) => {
		const result = await this.db.select({ userId: userSchema.userId }).from(userSchema).where(eq(userSchema.gitHubId, gitHubId));
		return result;
	};

	getUserApiKey = async (userId: string) => {
		const result = await this.db
			.select({ userApiKey: userSchema.userApiKey })
			.from(userSchema)
			.where(eq(userSchema.userId, userId));
		return result;
	};
}

export default new UserRepo(database);
