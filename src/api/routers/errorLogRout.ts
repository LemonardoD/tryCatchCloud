import { Hono } from "hono";
import ErrorLogRepo from "../database/repositories/errorLogRepo";
import { decode } from "hono/jwt";
import { JwtToken } from "../types/apiTypes";
const errLogRouter = new Hono();

errLogRouter.post("/new", async c => {
	const errData = await c.req.json();
	await ErrorLogRepo.addNewError(errData);
	return c.json({
		message: "Created successfully.",
	});
});

errLogRouter.get("/all", async c => {
	const authToken = c.req.header("Authorization") as string;
	const decodedToken: JwtToken = decode(authToken.replace("Bearer ", ""));
	const { userId } = decodedToken.payload;
	const errLogs = await ErrorLogRepo.allErrors(userId);
	return c.json({
		message: errLogs,
	});
});
errLogRouter.get("/by-tag/:tag", async c => {
	const tag = c.req.param("tag");
	const authToken = c.req.header("Authorization") as string;
	const decodedToken: JwtToken = decode(authToken.replace("Bearer ", ""));
	const { userId } = decodedToken.payload;
	const errLogs = await ErrorLogRepo.allErrorsByTag(userId, tag);
	return c.json({
		message: errLogs,
	});
});
errLogRouter.get("/by-time/:time", async c => {
	const timestamp = new Date(c.req.param("time"));
	const authToken = c.req.header("Authorization") as string;
	const decodedToken: JwtToken = decode(authToken.replace("Bearer ", ""));
	console.log("file: errorLogRout.ts:38 ~ decodedToken:", decodedToken);
	const { userId } = decodedToken.payload;
	console.log("file: errorLogRout.ts:39 ~ userId:", userId);
	const errLogs = await ErrorLogRepo.allErrorsByTime(userId, timestamp);
	return c.json({
		message: errLogs,
	});
});

export default errLogRouter;
