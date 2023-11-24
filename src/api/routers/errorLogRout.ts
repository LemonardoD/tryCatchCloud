import "dotenv/config";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { jwtDecode } from "../helpers/jwtDecode";
import { NewErrLog } from "../database/schemas/errorLogSchema";
import ErrorLogRepo from "../database/repositories/errorLogRepo";
import { errLogSchema } from "../helpers/zodSchemas";

const { JWT_SECRET } = <{ JWT_SECRET: string }>process.env;
const errLogRouter = new Hono();

errLogRouter.post(
	"/new",
	zValidator("json", errLogSchema, async (result, c) => {
		if (!result.success) {
			return c.json("Invalid data!", 400);
		}
		const errData: NewErrLog = await c.req.json();
		await ErrorLogRepo.addNewError(errData);

		return c.json({ message: "Created successfully." }, 201);
	})
);

errLogRouter.get(
	"/page/:page",
	jwt({
		secret: JWT_SECRET,
	}),
	async c => {
		const page = Number(c.req.param("page"));
		const offset = page === 1 ? 0 : (page - 1) * 20;
		const apiKey = jwtDecode(c.req.header("Authorization")!);
		const errLog = await ErrorLogRepo.twentyErrors(apiKey, offset);

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

		return c.json(
			{
				message: errLogs,
			},
			200
		);
	}
);

export default errLogRouter;
