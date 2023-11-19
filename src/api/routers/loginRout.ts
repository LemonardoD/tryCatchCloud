import "dotenv/config";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";
import { jwtDate } from "../helpers/jwtDecode";
import { githubAuth } from "../helpers/gitHubAuth";
import UserRepo from "../database/repositories/usersRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

const loginRout = new Hono();

loginRout.get("/getUserinfo", async c => {
	const requestToken = c.req.query("code");
	const { id, login, name, company, email } = await githubAuth(requestToken);
	const alreadyExist = await UserRepo.IfUserExist(id);
	if (alreadyExist.length) {
		return c.json({ token: alreadyExist[0].token });
	}

	const generatedUserId = nanoid();
	const token = await sign({ userId: generatedUserId, expires: jwtDate() }, JWT_SECRET);

	await UserRepo.addNewUser({
		userId: generatedUserId,
		gitHubId: id,
		userLogin: login,
		userName: name,
		userCompany: company,
		userEmail: email,
		userToken: token,
	});

	return c.json({ token: token });
});

export default loginRout;
