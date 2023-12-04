import "dotenv/config";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { jwtDecode } from "../helpers/jwtDecode";
import ProjectRepo from "../database/repositories/projectsRepo";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;
const projectsRout = new Hono();

projectsRout.get(
	"/all",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const { userId } = jwtDecode(c.req.header("Authorization")!);
		const apiResp = await ProjectRepo.allProjects(userId);
		return c.json(apiResp, 200);
	}
);

export default projectsRout;
