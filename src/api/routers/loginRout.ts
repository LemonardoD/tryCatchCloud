import { Hono } from "hono";
import "dotenv/config";
import UserRepo from "../database/repositories/usersRepo";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";
import { jwtDate } from "../helpers/stuff";
import { githubAuth } from "../services/gitHubAuth";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

const loginRout = new Hono();

loginRout.get("/getUserinfo", async c => {
	const requestToken = c.req.query("code");
	const { id, login, name, company, email } = await githubAuth(requestToken);
	const alreadyExist = await UserRepo.IfUserExist(id);
	if (alreadyExist.length) {
		const token = await sign({ userId: alreadyExist[0].userId, expires: jwtDate() }, JWT_SECRET);
		return c.json({ token: token });
	}
	const generatedUserId = nanoid();

	await UserRepo.addNewUser({
		userId: generatedUserId,
		gitHubId: id,
		userLogin: login,
		userName: name,
		userCompany: company,
		userEmail: email,
	});

	const token = await sign({ userId: generatedUserId, expires: jwtDate() }, JWT_SECRET);

	return c.json({ token: token });
});

export default loginRout;
