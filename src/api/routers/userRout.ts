import "dotenv/config";
import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { nanoid } from "nanoid";
import { jwtDate, jwtDecode } from "../helpers/jwtDecode";
import { githubAuth } from "../helpers/gitHubAuth";
import UserRepo from "../database/repositories/usersRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;

const userRout = new Hono();

userRout.get("/github-info", async c => {
	const requestToken = c.req.query("code");
	const { id, login, name, company, email } = await githubAuth(requestToken);

	const alreadyExist = await UserRepo.IfUserExist(id);
	if (alreadyExist.length) {
		const jwtToken = await sign({ userId: alreadyExist[0].usageToken, expires: jwtDate() }, JWT_SECRET);
		return c.json({ token: jwtToken }, 200);
	}

	const generatedUserId = nanoid();
	const generatedErrTokenId = nanoid();
	const jwtToken = await sign({ userId: generatedErrTokenId, expires: jwtDate() }, JWT_SECRET);

	await UserRepo.addNewUser({
		userId: generatedUserId,
		gitHubId: id,
		userLogin: login,
		userName: name,
		userCompany: company,
		userEmail: email,
		userToken: generatedErrTokenId,
	});

	return c.json({ token: jwtToken, usageToken: generatedErrTokenId }, 201);
});

userRout.get(
	"/api-token",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const usageToken = jwtDecode(c.req.header("Authorization")!);
		return c.json({ usageToken });
	}
);

export default userRout;
