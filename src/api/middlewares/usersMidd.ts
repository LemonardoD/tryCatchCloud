import "dotenv/config";
import { sign } from "hono/jwt";
import { Context, Next } from "hono";
import { jwtDate } from "../helpers/jwtDecode";
import { createMiddleware } from "hono/factory";
import { githubAuth } from "../helpers/gitHubAuth";
import UserRepo from "../database/repositories/usersRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

export const ifUserExist = createMiddleware(async (cntx: Context, next: Next) => {
	const requestToken = cntx.req.query("code");
	const gitHubData = await githubAuth(requestToken);

	const alreadyExist = await UserRepo.IfUserExist(gitHubData.id);
	if (alreadyExist.length) {
		const jwtToken = sign({ userId: alreadyExist[0].userId, expires: jwtDate() }, JWT_SECRET);
		return cntx.json({ token: jwtToken }, 200);
	}
	cntx.set("gitHubData", gitHubData);
	await next();
});
