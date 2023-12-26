import "dotenv/config";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwtDecode } from "../helpers/jwtDecode";
import { createMiddleware } from "hono/factory";

export const protectedUrl = createMiddleware(async (cntx: Context, next: Next) => {
	const header = cntx.req.header("Authorization");
	if (typeof header === "undefined") {
		console.log;
		throw new HTTPException(400, { message: "No Authorization Token." });
	}
	const userId = jwtDecode(header);
	cntx.set("userId", userId);
	await next();
});
