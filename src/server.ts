import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import loginRout from "./api/routers/loginRout";
import errLogRouter from "./api/routers/errorLogRout";
import { HTTPException } from "hono/http-exception";
import ErrorUtility from "./api/services/errorUtil/errorUtility";

const app = new Hono().basePath("/api");

const port = Number(process.env.PORT);

app.use("/api/*", cors());

app.route("/err-log", errLogRouter);
app.route("/login", loginRout);

app.onError(async (err, c) => {
	if (err instanceof HTTPException) {
		// await ErrorUtility.sendErrorFromHandler(err, "hnge8UEC97M4n_PrwJCsN", c.req);
		return c.json({ status: err.status, message: err.message });
	}
	return c.json({ status: 500, message: "Something go wrong on the server." });
});

serve({
	fetch: app.fetch,
	port,
});
