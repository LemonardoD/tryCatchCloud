import "dotenv/config";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";
import { jwtDate, userIdFromJwt } from "../helpers/jwtDecode";
import { githubAuth } from "../helpers/gitHubAuth";
import UserRepo from "../database/repositories/usersRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

const loginRout = new Hono();

loginRout.get("/getUserinfo", async c => {
	const requestToken = c.req.query("code");
	const { id, login, name, company, email } = await githubAuth(requestToken);

	const alreadyExist = await UserRepo.IfUserExist(id);
	if (alreadyExist.length) {
		const jwtToken = await sign({ userId: alreadyExist[0].userId, expires: jwtDate() }, JWT_SECRET);
		return c.json({ jwtToken, token: alreadyExist[0].usageToken });
	}

	const generatedUserId = nanoid();
	const jwtToken = await sign({ userId: generatedUserId, expires: jwtDate() }, JWT_SECRET);

	const generatedErrTokenId = nanoid();
	await UserRepo.addNewUser({
		userId: generatedUserId,
		gitHubId: id,
		userLogin: login,
		userName: name,
		userCompany: company,
		userEmail: email,
		userToken: generatedErrTokenId,
	});

	return c.json({ jwtToken, usageToken: generatedErrTokenId });
});

loginRout.get("/errToken", async c => {
	const userId = userIdFromJwt(c.req.header("Authorization"));

	const [{ usageToken }] = await UserRepo.getUsageToken(userId);

	return c.json({ usageToken: usageToken });
});

export default loginRout;
