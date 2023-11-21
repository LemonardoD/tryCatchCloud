import { Hono } from "hono";
import { userIdFromJwt } from "../helpers/jwtDecode";
import { NewErrLog } from "../database/schemas/errorLogSchema";
import UserRepo from "../database/repositories/usersRepo";
import ErrorLogRepo from "../database/repositories/errorLogRepo";

const errLogRouter = new Hono();

errLogRouter.post("/new", async c => {
	let errData: NewErrLog = await c.req.json();
	const [{ userId }] = await UserRepo.getUserId(errData.user);
	errData.user = userId;
	await ErrorLogRepo.addNewError(errData);

	return c.json({ status: 201, message: "Created successfully." });
});

errLogRouter.get("/all", async c => {
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.allErrors(userId);

	return c.json({
		message: errLogs,
	});
});

errLogRouter.get("/by-id/:id", async c => {
	const errId = c.req.param("id");
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.errorById(userId, errId);

	return c.json({
		message: errLogs,
	});
});

export default errLogRouter;
