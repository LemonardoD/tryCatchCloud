import { Hono, Context } from "hono";
import { protectedUrl } from "../middlewares/protected";
import ProjectRepo from "../database/repositories/projectsRepo";

const projectsRout = new Hono();

projectsRout.get("/all", protectedUrl, async (cntx: Context) => {
	const userId: string = cntx.get("userId");
	const apiResp = await ProjectRepo.allProjects(userId);
	return cntx.json(apiResp, 200);
});

export default projectsRout;
