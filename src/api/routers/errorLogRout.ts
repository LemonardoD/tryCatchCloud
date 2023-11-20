import { Hono } from "hono";
import { userIdFromJwt } from "../helpers/jwtDecode";
import UserRepo from "../database/repositories/usersRepo";
import ErrorLogRepo from "../database/repositories/errorLogRepo";
import { NewErrLog } from "../database/schemas/errorLogSchema";

const errLogRouter = new Hono();

errLogRouter.post("/new", async c => {
	let errData: NewErrLog = await c.req.json();
	const [{ userId }] = await UserRepo.getUserId(errData.user);
	errData.user = userId;
	await ErrorLogRepo.addNewError(errData);

	return c.json({
		message: "Created successfully.",
	});
});

errLogRouter.get("/all", async c => {
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.allErrors(userId);

	return c.json({
		message: errLogs,
	});
});

errLogRouter.get("/grouped", async c => {
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.groupedErrors(userId);

	return c.json({
		message: errLogs,
	});
});

errLogRouter.get("/by-tag", async c => {
	const tag = c.req.query("tag");
	const time = c.req.query("time");
	const userId = userIdFromJwt(c.req.header("Authorization"));

	if (!tag) {
		throw new Error("Set query param 'tag'!");
	}

	if (!time) {
		const errLogs = await ErrorLogRepo.errorsByTag(userId, tag);
		return c.json({
			message: errLogs,
		});
	}
	const errLogs = await ErrorLogRepo.errorsByTaAndTime(userId, tag, new Date(time));

	return c.json({
		message: errLogs,
	});
});

errLogRouter.get("/by-time/:time", async c => {
	const timestamp = new Date(c.req.param("time"));
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.allErrorsByTime(userId, timestamp);

	return c.json({
		message: errLogs,
	});
});

errLogRouter.get("/details/:errId", async c => {
	const errId = c.req.param("errId");
	const userId = userIdFromJwt(c.req.header("Authorization"));
	const errLogs = await ErrorLogRepo.errorDetails(userId, errId);

	return c.json({
		message: errLogs,
	});
});

export default errLogRouter;
