import { Hono } from "hono";
import { addNewLog, getAll, getById, getByProject, getLiveUpdate } from "../controllers/errLogController";

const errLogRouter = new Hono();

errLogRouter.post("/new", ...addNewLog);

errLogRouter.get("/all", ...getAll);

errLogRouter.get("/live-update", ...getLiveUpdate);

errLogRouter.get("/by-project/:project", ...getByProject);

errLogRouter.get("/by-id/:id", ...getById);

// errLogRouter.get(
// 	"/grouped",
// 	jwt({
// 		secret: JWT_SECRET,
// 	}),
// 	async c => {
// 		const { userId } = jwtDecode(c.req.header("Authorization")!);
// 		const errLogs = await ErrorLogRepo.groupedErrors(userId);
// 		return c.json(errLogs, 200);
// 	}
// );

// errLogRouter.get(
// 	"/by-project-and-tag",
// 	jwt({
// 		secret: JWT_SECRET,
// 	}),
// 	async c => {
// 		const project = c.req.query("project");
// 		const tag = c.req.query("tag");
// 		if (!project || !tag) {
// 			throw new HTTPException(400, { message: "Bad Request." });
// 		}
// 		const { userId } = jwtDecode(c.req.header("Authorization")!);
// 		const errLog = await ErrorLogRepo.errorsByProjectAndTag(userId, project, tag);

// 		return c.json(errLog, 200);
// 	}
// );

export default errLogRouter;
