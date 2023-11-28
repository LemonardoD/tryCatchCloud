import "dotenv/config";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { jwtDecode } from "../helpers/jwtDecode";
import { errLogSchema } from "../helpers/zodSchemas";
import ErrorLogRepo from "../database/repositories/errorLogRepo";
import ProjectRepo from "../database/repositories/projectsRepo";
import { NewError } from "../types/apiTypes";
import { nanoid } from "nanoid";
import { HTTPException } from "hono/http-exception";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;
const errLogRouter = new Hono();

errLogRouter.post(
	"/new",
	zValidator("json", errLogSchema, async (result, c) => {
		if (!result.success) {
			return c.json("Invalid data!", 400);
		}
		let errData: NewError = await c.req.json();
		const projectId = nanoid();
		await ProjectRepo.addNewProject({
			projectId: projectId,
			userApi: errData.user,
			projectName: errData.projectName,
		});

		await ErrorLogRepo.addNewError({ ...errData, ...{ projectId: projectId } });

		return c.json({ message: "Created successfully." }, 201);
	})
);

errLogRouter.get(
	"/live-update",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const userId = jwtDecode(c.req.header("Authorization")!);
		const errLog = await ErrorLogRepo.oneFiftyErrors(userId);

		return c.json(errLog, 200);
	}
);

errLogRouter.get(
	"/all",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const userId = jwtDecode(c.req.header("Authorization")!);
		const errLog = await ErrorLogRepo.twentyErrors(userId);

		return c.json(errLog, 200);
	}
);

errLogRouter.get(
	"/by-project-and-tag",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const project = c.req.query("project");
		const tag = c.req.query("tag");
		if (!project || !tag) {
			throw new HTTPException(400, { message: "Bad Request." });
		}
		const userId = jwtDecode(c.req.header("Authorization")!);
		const errLog = await ErrorLogRepo.errorsByProjectAndTag(userId, project, tag);

		return c.json(errLog, 200);
	}
);

errLogRouter.get(
	"/by-project/:project",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const project = c.req.param("project");
		const userId = jwtDecode(c.req.header("Authorization")!);
		const errLog = await ErrorLogRepo.errorsByProject(userId, project);

		return c.json(errLog, 200);
	}
);

errLogRouter.get(
	"/by-id/:id",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const errId = c.req.param("id");
		const apiKey = jwtDecode(c.req.header("Authorization")!);
		const errLogs = await ErrorLogRepo.errorById(apiKey, errId);

		return c.json(errLogs, 200);
	}
);

errLogRouter.get(
	"/grouped",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const apiKey = jwtDecode(c.req.header("Authorization")!);
		const errLogs = await ErrorLogRepo.groupedErrors(apiKey);
		return c.json(errLogs, 200);
	}
);

export default errLogRouter;
