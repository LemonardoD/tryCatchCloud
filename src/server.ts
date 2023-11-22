import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import { serve } from "@hono/node-server";
import userRout from "./api/routers/userRout";
import errLogRouter from "./api/routers/errorLogRout";
import { HTTPException } from "hono/http-exception";
import ErrorUtility from "./api/services/errorUtil/errorUtility";

const app = new Hono().basePath("/api");

const port = Number(process.env.PORT);

app.use("*", cors());

app.route("/err-log", errLogRouter);
app.route("/user", userRout);
app.get(
	"*",
	cache({
		cacheName: "errorLogCache",
		cacheControl: "public, max-age=3600, must-revalidate",
		wait: true,
	})
);
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
