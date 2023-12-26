import { Hono, Context } from "hono";
import { protectedUrl } from "../middlewares/protected";
import { createUser } from "../controllers/userController";
import UserRepo from "../database/repositories/usersRepo";

const userRout = new Hono();

userRout.get("/github-info", ...createUser);

userRout.get("/api-token", protectedUrl, async (cntx: Context) => {
	const userId: string = cntx.get("userId");
	const [{ userApiKey }] = await UserRepo.getUserApiKey(userId);
	return cntx.json({ usageToken: userApiKey }, 200);
});

export default userRout;
