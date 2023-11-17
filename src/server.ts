import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { cors } from "hono/cors";
import errLogRouter from "./api/routers/errorLogRout";
import loginRout from "./api/routers/loginRout";

const app = new Hono();
const port = Number(process.env.PORT);

app.use("*", cors());

app.route("/api/err-log", errLogRouter);
app.route("/api/login", loginRout);

app.onError((err, c) => {
	console.log("file: server.ts:15 ~ err:", err);
	return c.text("Something went wrong on the server!", 500);
});

serve({
	fetch: app.fetch,
	port,
});
