import { Context } from "hono";
import { nanoid } from "nanoid";
import { NewError } from "../types/apiTypes";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { errLogSchema } from "../helpers/zodSchemas";
import { protectedUrl } from "../middlewares/protected";
import ProjectRepo from "../database/repositories/projectsRepo";
import ErrorLogRepo from "../database/repositories/errorLogRepo";

const honoFactory = createFactory();

export const addNewLog = honoFactory.createHandlers(zValidator("json", errLogSchema), async (cntx: Context) => {
	let errData: NewError = await cntx.req.json();
	const projectExist = await ProjectRepo.IfUserProjectExist(errData.user, errData.projectName);
	if (!projectExist.length) {
		const projectId = nanoid();
		await ProjectRepo.addNewProject({
			projectId: projectId,
			userApi: errData.user,
			projectName: errData.projectName,
		});
		await ErrorLogRepo.addNewError({ ...errData, ...{ projectId: projectId } });
		return cntx.json({ message: "Created error log and project." }, 201);
	}
	const [{ projectId }] = projectExist;
	await ErrorLogRepo.addNewError({ ...errData, ...{ projectId: projectId } });
	return cntx.json({ message: "Created error log." }, 201);
});

export const getLiveUpdate = honoFactory.createHandlers(protectedUrl, async (cntx: Context) => {
	const userId: string = cntx.get("userId");
	const errLog = await ErrorLogRepo.oneFiftyErrors(userId);
	return cntx.json(errLog, 200);
});

export const getAll = honoFactory.createHandlers(protectedUrl, async (cntx: Context) => {
	const userId: string = cntx.get("userId");
	const errLog = await ErrorLogRepo.twentyErrors(userId);
	return cntx.json(errLog, 200);
});

export const getByProject = honoFactory.createHandlers(protectedUrl, async (cntx: Context) => {
	const project = cntx.req.param("project");
	const userId: string = cntx.get("userId");
	if (project === "latest") {
		const projectResult = await ProjectRepo.latestProject(userId);
		if (!projectResult.length) {
			return cntx.json([], 200);
		}
		const errLog = await ErrorLogRepo.errorsByProject(userId, projectResult[0].projectName!);
		return cntx.json(errLog, 200);
	}
	const errLog = await ErrorLogRepo.errorsByProject(userId, project);
	return cntx.json(errLog, 200);
});

export const getById = honoFactory.createHandlers(protectedUrl, async (cntx: Context) => {
	const userId: string = cntx.get("userId");
	const errId = cntx.req.param("id");
	const errLogs = await ErrorLogRepo.errorById(userId, errId);
	return cntx.json(errLogs, 200);
});
