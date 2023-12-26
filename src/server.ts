import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import { serve } from "@hono/node-server";
import userRout from "./api/routers/userRout";
import projectsRout from "./api/routers/projectsRout";
import errLogRouter from "./api/routers/errorLogRout";
import { HTTPException } from "hono/http-exception";

const app = new Hono().basePath("/api");

const port = Number(process.env.PORT);

app.use("*", cors());

app.route("/err-log", errLogRouter);
app.route("/user", userRout);
app.route("/projects", projectsRout);

app.notFound(c => {
	return c.text("Wrong route or method.", 404);
});

app.get(
	"*",
	cache({
		cacheName: "errorLogCache",
		cacheControl: "public, max-age=3600, must-revalidate",
		wait: true,
	})
);

app.onError((err, c) => {
	console.log("file: server.ts:28 ~ err:", err);
	if (err instanceof HTTPException) {
		return err.getResponse();
	}
	return c.text("Something go wrong on the server.", 500);
});

serve({
	fetch: app.fetch,
	port,
});
