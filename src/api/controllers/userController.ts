import "dotenv/config";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";
import { createFactory } from "hono/factory";
import { jwtDate } from "../helpers/jwtDecode";
import { ifUserExist } from "../middlewares/usersMidd";
import UserRepo from "../database/repositories/usersRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

const honoFactory = createFactory();

export const createUser = honoFactory.createHandlers(ifUserExist, async (cntx: Context) => {
	const { id, login, name, company, email } = cntx.get("gitHubData");

	const generatedUserId = nanoid();
	const generatedErrTokenId = nanoid();
	const jwtToken = await sign({ userId: generatedUserId, expires: jwtDate() }, JWT_SECRET);

	await UserRepo.addNewUser({
		userId: generatedUserId,
		gitHubId: id,
		userLogin: login,
		userName: name,
		userCompany: company,
		userEmail: email,
		userApiKey: generatedErrTokenId,
	});

	return cntx.json({ token: jwtToken }, 201);
});
